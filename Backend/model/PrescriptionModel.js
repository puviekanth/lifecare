const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  email: String,
  prescriptionFilePath:String,
  deliveryMethod: { type: String, enum: ['home', 'instore'] },
  deliveryDetails: {
    address: String,
    city: String,
    state: String,
    zip: String,
  },
  orderToken: String,
  createdAt: { type: Date, default: Date.now },
});

const PrescriptionModel = mongoose.model('prescription', PrescriptionSchema);

module.exports = PrescriptionModel;