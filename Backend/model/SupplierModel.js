const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  supplierName: { 
    type: String, 
    unique: true, 
    required: true 
  },
  companyName: String,
  email: String,
  contact:String,
});

const SupplierModel = mongoose.model('Supplier', SupplierSchema);

module.exports = SupplierModel;