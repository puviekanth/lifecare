const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  phone:String,
  address:String,
});

const AdminModel = mongoose.model('admin', AdminSchema);

module.exports = AdminModel;