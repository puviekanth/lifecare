const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  deliveryOption: {
    type: String,
    enum: ['home-delivery', 'in-store-pickup'],
    required: true
  },
  address: {
    type: String,
    default: null
  },
  city: String,
  state: String,
  zip: String,
  tokenNumber: {
    type: String,
    default: null
  },
  filePath: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
