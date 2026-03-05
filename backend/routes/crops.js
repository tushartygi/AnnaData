const express = require('express');
const { body, validationResult } = require('express-validator');
const Crop = require('../models/Crop');
const User = require('../models/User');
const { authMiddleware, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateCrop = [
  body('name').trim().notEmpty().withMessage('Crop name is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').trim().notEmpty().withMessage('Description is required')
];

// @route   GET /api/crops
// @desc    Get all crops (with optional search and filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, city, state } = req.query;
    
    // Build query
    let query = { isAvailable: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (city) {
      query.farmerCity = { $regex: city, $options: 'i' };
    }
    
    if (state) {
      query.farmerState = { $regex: state, $options: 'i' };
    }

    const crops = await Crop.find(query)
      .populate('farmer', 'name phone city state')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: crops.length,
      crops
    });
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching crops',
      error: error.message 
    });
  }
});

// @route   GET /api/crops/:id
// @desc    Get single crop by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate('farmer', 'name phone email city state address');

    if (!crop) {
      return res.status(404).json({ 
        success: false, 
        message: 'Crop not found' 
      });
    }

    res.json({
      success: true,
      crop
    });
  } catch (error) {
    console.error('Get crop error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid crop ID' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching crop',
      error: error.message 
    });
  }
});

// @route   GET /api/crops/farmer/:farmerId
// @desc    Get all crops by a specific farmer
// @access  Public
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const crops = await Crop.find({ 
      farmer: req.params.farmerId,
      isAvailable: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: crops.length,
      crops
    });
  } catch (error) {
    console.error('Get farmer crops error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching farmer crops',
      error: error.message 
    });
  }
});

// @route   POST /api/crops
// @desc    Create a new crop
// @access  Private (Farmer only)
router.post('/', [authMiddleware, authorize('farmer'), validateCrop], async (req, res) => {
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

    const { name, quantity, unit, price, description, image, category, distance } = req.body;

    // Get farmer details
    const farmer = await User.findById(req.user.id);

    // Create crop
    const crop = await Crop.create({
      name,
      quantity,
      unit: unit || 'kg',
      price,
      description,
      image: image || '',
      category: category || 'other',
      distance: distance || '',
      farmer: req.user.id,
      farmerName: farmer.name,
      farmerLocation: farmer.farmLocation,
      farmerCity: farmer.city,
      farmerState: farmer.state
    });

    res.status(201).json({
      success: true,
      message: 'Crop created successfully',
      crop
    });
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating crop',
      error: error.message 
    });
  }
});

// @route   PUT /api/crops/:id
// @desc    Update a crop
// @access  Private (Farmer only - own crops)
router.put('/:id', [authMiddleware, authorize('farmer')], async (req, res) => {
  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ 
        success: false, 
        message: 'Crop not found' 
      });
    }

    // Check if user owns the crop
    if (crop.farmer.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this crop' 
      });
    }

    const { name, quantity, unit, price, description, image, category, isAvailable, distance } = req.body;

    // Update crop
    crop = await Crop.findByIdAndUpdate(
      req.params.id,
      {
        name: name || crop.name,
        quantity: quantity !== undefined ? quantity : crop.quantity,
        unit: unit || crop.unit,
        price: price !== undefined ? price : crop.price,
        description: description || crop.description,
        image: image !== undefined ? image : crop.image,
        category: category || crop.category,
        isAvailable: isAvailable !== undefined ? isAvailable : crop.isAvailable,
        distance: distance !== undefined ? distance : crop.distance
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Crop updated successfully',
      crop
    });
  } catch (error) {
    console.error('Update crop error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid crop ID' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating crop',
      error: error.message 
    });
  }
});

// @route   DELETE /api/crops/:id
// @desc    Delete a crop
// @access  Private (Farmer only - own crops)
router.delete('/:id', [authMiddleware, authorize('farmer')], async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ 
        success: false, 
        message: 'Crop not found' 
      });
    }

    // Check if user owns the crop
    if (crop.farmer.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this crop' 
      });
    }

    await Crop.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Crop deleted successfully'
    });
  } catch (error) {
    console.error('Delete crop error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid crop ID' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error deleting crop',
      error: error.message 
    });
  }
});

module.exports = router;
