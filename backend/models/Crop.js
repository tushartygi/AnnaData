const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0
  },
  unit: {
    type: String,
    default: 'kg',
    enum: ['kg', 'quintal', 'ton', 'piece']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerName: {
    type: String,
    required: true
  },
  farmerLocation: {
    type: String,
    required: true
  },
  farmerCity: {
    type: String,
    required: true
  },
  farmerState: {
    type: String,
    required: true
  },
  distance: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['grains', 'vegetables', 'fruits', 'pulses', 'other'],
    default: 'other'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  harvestDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
cropSchema.index({ name: 'text', description: 'text' });
cropSchema.index({ farmer: 1 });
cropSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Crop', cropSchema);
