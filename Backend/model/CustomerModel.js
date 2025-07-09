const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  phone:String,
  address:String,
});

const CustomerModel = mongoose.model('Customer', CustomerSchema);

module.exports = CustomerModel;