const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Crop = require('../models/Crop');
const User = require('../models/User');
const { authMiddleware, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateOrder = [
  body('cropId').notEmpty().withMessage('Crop ID is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('notes').optional().trim()
];

// @route   GET /api/orders
// @desc    Get all orders for logged-in user (customer or farmer)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};
    
    // If customer, get their orders
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    }
    // If farmer, get orders for their crops
    else if (req.user.role === 'farmer') {
      query.farmer = req.user.id;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name phone email')
      .populate('farmer', 'name phone email')
      .populate('crop', 'name image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching orders',
      error: error.message 
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email address city state')
      .populate('farmer', 'name phone email address city state')
      .populate('crop', 'name image description');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if user is authorized to view this order
    if (
      order.customer._id.toString() !== req.user.id &&
      order.farmer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this order' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid order ID' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching order',
      error: error.message 
    });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private (Customer only)
router.post('/', [authMiddleware, authorize('customer'), validateOrder], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { cropId, quantity, notes, paymentMethod } = req.body;

    // Get crop details
    const crop = await Crop.findById(cropId).populate('farmer');
    
    if (!crop) {
      return res.status(404).json({ 
        success: false, 
        message: 'Crop not found' 
      });
    }

    if (!crop.isAvailable) {
      return res.status(400).json({ 
        success: false, 
        message: 'This crop is no longer available' 
      });
    }

    if (quantity > crop.quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${crop.quantity} ${crop.unit} available` 
      });
    }

    // Get customer details
    const customer = await User.findById(req.user.id);

    // Calculate total amount
    const totalAmount = quantity * crop.price;

    // Create order
    const order = await Order.create({
      customer: req.user.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
      farmer: crop.farmer._id,
      farmerName: crop.farmer.name,
      crop: crop._id,
      cropName: crop.name,
      quantity,
      unit: crop.unit,
      pricePerUnit: crop.price,
      totalAmount,
      notes: notes || '',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'Processing'
    });

    // Update crop quantity
    crop.quantity -= quantity;
    if (crop.quantity === 0) {
      crop.isAvailable = false;
    }
    await crop.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating order',
      error: error.message 
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Farmer only for their orders)
router.put('/:id/status', [authMiddleware, authorize('farmer')], async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if user owns this order (is the farmer)
    if (order.farmer.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this order' 
      });
    }

    // Validate status
    const validStatuses = ['Processing', 'Confirmed', 'In Transit', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid order status' 
      });
    }

    // Update status
    order.status = status;
    
    // Add to status history
    order.statusHistory.push({
      status,
      note: note || '',
      timestamp: new Date()
    });

    // Set delivery date if delivered
    if (status === 'Delivered') {
      order.deliveryDate = new Date();
      order.paymentStatus = 'Completed';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid order ID' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating order status',
      error: error.message 
    });
  }
});

// @route   PUT /api/orders/:id/payment
// @desc    Update payment status
// @access  Private (Customer or Farmer)
router.put('/:id/payment', authMiddleware, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check authorization
    if (
      order.customer.toString() !== req.user.id &&
      order.farmer.toString() !== req.user.id
    ) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this order' 
      });
    }

    // Validate payment status
    const validPaymentStatuses = ['Pending', 'Completed', 'Failed', 'Refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment status' 
      });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating payment status',
      error: error.message 
    });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Cancel an order
// @access  Private (Customer only - own orders)
router.delete('/:id', [authMiddleware, authorize('customer')], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if user owns the order
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to cancel this order' 
      });
    }

    // Only allow cancellation if order is in Processing or Confirmed status
    if (!['Processing', 'Confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel order at this stage' 
      });
    }

    // Update order status to Cancelled
    order.status = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      note: 'Cancelled by customer',
      timestamp: new Date()
    });
    await order.save();

    // Restore crop quantity
    const crop = await Crop.findById(order.crop);
    if (crop) {
      crop.quantity += order.quantity;
      crop.isAvailable = true;
      await crop.save();
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid order ID' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error cancelling order',
      error: error.message 
    });
  }
});

module.exports = router;
