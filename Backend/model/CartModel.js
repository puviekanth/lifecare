
const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  ProductId:String,
  ProductName: String,
  email: String,
  ProductPrice:Number,
  ProductQuantity:Number,
  Subtotal:Number,
  Image:String
});

const CartModel = mongoose.model('cart', CartSchema);

module.exports = CartModel;
