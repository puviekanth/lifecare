const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    productName: String,
    description: String,
    price: Number,
    category: String,
    image: String,
    quantity:Number,
    companyName:String,
    supplierID:String
  });
  
  // Create a model
  const ProductModel = mongoose.model('product', medicineSchema);

  module.exports = ProductModel;