const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Crop = require('../models/Crop');
const { authMiddleware, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private (Customer only)
router.get('/', authMiddleware, authorize('customer'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'cart.crop',
        select: 'name price quantity unit image isAvailable farmer',
        populate: {
          path: 'farmer',
          select: 'name city state'
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter out unavailable crops
    const availableCart = user.cart.filter(item => 
      item.crop && item.crop.isAvailable
    );

    res.json({
      success: true,
      cart: availableCart,
      count: availableCart.length
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cart',
      error: error.message
    });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private (Customer only)
router.post('/',
  authMiddleware,
  authorize('customer'),
  [
    body('cropId').notEmpty().withMessage('Crop ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    try {
      const { cropId, quantity } = req.body;

      // Check if crop exists and is available
      const crop = await Crop.findById(cropId);
      if (!crop) {
        return res.status(404).json({
          success: false,
          message: 'Crop not found'
        });
      }

      if (!crop.isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'This crop is not available'
        });
      }

      if (quantity > crop.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${crop.quantity} ${crop.unit} available`
        });
      }

      // Get user
      const user = await User.findById(req.user.id);

      // Check if item already exists in cart
      const existingItemIndex = user.cart.findIndex(
        item => item.crop.toString() === cropId
      );

      if (existingItemIndex > -1) {
        // Update quantity
        user.cart[existingItemIndex].quantity = quantity;
        user.cart[existingItemIndex].addedAt = Date.now();
      } else {
        // Add new item
        user.cart.push({
          crop: cropId,
          quantity,
          addedAt: Date.now()
        });
      }

      await user.save();

      // Populate the cart for response
      await user.populate({
        path: 'cart.crop',
        select: 'name price quantity unit image isAvailable farmer',
        populate: {
          path: 'farmer',
          select: 'name city state'
        }
      });

      res.json({
        success: true,
        message: 'Item added to cart',
        cart: user.cart
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error adding to cart',
        error: error.message
      });
    }
  }
);

// @route   PUT /api/cart/:cropId
// @desc    Update cart item quantity
// @access  Private (Customer only)
router.put('/:cropId',
  authMiddleware,
  authorize('customer'),
  [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    try {
      const { cropId } = req.params;
      const { quantity } = req.body;

      // Check if crop exists and has enough quantity
      const crop = await Crop.findById(cropId);
      if (!crop) {
        return res.status(404).json({
          success: false,
          message: 'Crop not found'
        });
      }

      if (quantity > crop.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${crop.quantity} ${crop.unit} available`
        });
      }

      // Update cart
      const user = await User.findById(req.user.id);
      const cartItem = user.cart.find(
        item => item.crop.toString() === cropId
      );

      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart'
        });
      }

      cartItem.quantity = quantity;
      await user.save();

      await user.populate({
        path: 'cart.crop',
        select: 'name price quantity unit image isAvailable farmer',
        populate: {
          path: 'farmer',
          select: 'name city state'
        }
      });

      res.json({
        success: true,
        message: 'Cart updated',
        cart: user.cart
      });
    } catch (error) {
      console.error('Update cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error updating cart',
        error: error.message
      });
    }
  }
);

// @route   DELETE /api/cart/:cropId
// @desc    Remove item from cart
// @access  Private (Customer only)
router.delete('/:cropId', authMiddleware, authorize('customer'), async (req, res) => {
  try {
    const { cropId } = req.params;

    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(
      item => item.crop.toString() !== cropId
    );

    await user.save();

    await user.populate({
      path: 'cart.crop',
      select: 'name price quantity unit image isAvailable farmer',
      populate: {
        path: 'farmer',
        select: 'name city state'
      }
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing from cart',
      error: error.message
    });
  }
});

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private (Customer only)
router.delete('/', authMiddleware, authorize('customer'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error clearing cart',
      error: error.message
    });
  }
});

module.exports = router;
