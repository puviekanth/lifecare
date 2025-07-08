const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  supplierName: String, 
   
  
  companyName: {
    type:String,
     unique: true, 
    required: true 
  },
  email: String,
  phone:Number,
});

const SupplierModel = mongoose.model('Supplier', SupplierSchema);

module.exports = SupplierModel;