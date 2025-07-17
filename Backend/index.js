const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const CustomerModel = require('./model/CustomerModel');
const ProductModel = require('./model/MedicineModel');
const SupplierModel = require('./model/SupplierModel');
const AdminModel = require('./model/AdminModel');
const CartModel = require('./model/CartModel');
const OrderModel = require('./model/OrderModel');
const Consultation = require('./model/ConsultationModel'); // Import Consultation model
const PrescriptionModel = require('./model/PrescriptionModel');

const app = express();
const saltRounds = 10;
const secretKey = 'lifecare/AGILE/y3s2';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Multer storage for product images (existing)
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Uploads/medicines'); // Save product images to 'Uploads/medicines'
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const productFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed for product images.'), false);
  }
};

const upload = multer({
  storage: productStorage,
  fileFilter: productFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
}).array('medicine', 1);

const uploadMedicine = multer({
  storage: productStorage,
  fileFilter: productFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
}).single('image'); // Adjusted to match /addproduct and /updateproduct routes

// Multer storage for medical records
const medicalRecordsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Uploads/medical-records'); // Save medical records to 'Uploads/medical-records'
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const medicalRecordsFileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, JPG, and PNG are allowed for medical records.'), false);
  }
};

const uploadMedicalRecords = multer({
  storage: medicalRecordsStorage,
  fileFilter: medicalRecordsFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
}).single('medicalRecords');


// Multer storage for prescriptions
const prescriptionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/prescriptions'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const prescriptionsFileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, JPG, and PNG are allowed for medical records.'), false);
  }
};

const uploadPrescriptionRecords = multer({
  storage: prescriptionStorage,
  fileFilter: prescriptionsFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
}).single('prescription');



mongoose.connect("mongodb://localhost:27017/lifecare", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connected to MongoDB database: lifecare"))
  .catch(err => console.error("Failed to connect to MongoDB", err));





// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token found, please try logging in again.' });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    if (email.endsWith('.admin@lifecare.com')) {
      const adminUser = await AdminModel.create({
        name,
        password: encryptedPassword,
        email,
        phone,
        address,
      });
      res.status(200).json({ message: 'Admin User Created Successfully', user: adminUser });
    } else {
      const newUser = await CustomerModel.create({
        name,
        password: encryptedPassword,
        email,
        phone,
        address,
      });
      res.status(200).json({ message: 'Customer Created Successfully', user: newUser });
    }
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).json({ error: "Email or NIC already exists." });
    } else {
      console.error("An unexpected error occurred.", e);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email.endsWith('.admin@lifecare.com')) {
      const admin = await AdminModel.findOne({ email });
      if (!admin) {
        return res.status(404).json({ error: 'No admin Found' });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const token = jwt.sign({ email: admin.email }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Logged in successfully', token, user: admin });
      } else {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
    } else {
      const user = await CustomerModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'No User Found, please register.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Logged in successfully', token, user });
      } else {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get all products
app.get('/getproducts', async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Add new product
app.post('/addproduct', authenticateJWT, uploadMedicine, async (req, res) => {
  const { medicineName, price, otcStatus, companyName, quantity, description, manufactureDate, expiryDate } = req.body;
  if (!req.file) return res.status(400).json({ message: 'Image is required' });
  const imagePath = req.file.path;

  try {
    const supplier = await SupplierModel.findOne({ companyName });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    const medicine = new ProductModel({
      productName: medicineName,
      description,
      price,
      category: otcStatus,
      quantity,
      manufactureDate,
      expiryDate,
      companyName,
      supplierID: supplier._id,
      image: imagePath
    });
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});

// Update existing product
app.put('/updateproduct/:id', authenticateJWT, uploadMedicine, async (req, res) => {
  const { id } = req.params;
  const { productName, description, price, category, quantity, companyName, manufactureDate, expiryDate } = req.body;
  try {
    const parsedManufactureDate = manufactureDate ? new Date(manufactureDate) : null;
    const parsedExpiryDate = expiryDate ? new Date(expiryDate) : null;
    if (manufactureDate && isNaN(parsedManufactureDate?.getTime())) {
      return res.status(400).json({ message: 'Invalid manufacture date' });
    }
    if (expiryDate && isNaN(parsedExpiryDate?.getTime())) {
      return res.status(400).json({ message: 'Invalid expiry date' });
    }
    let imagePath;
    if (req.file) {
      imagePath = req.file.path;
    } else if (req.body.image) {
      imagePath = req.body.image;
    } else {
      return res.status(400).json({ message: 'No image provided' });
    }
    const supplier = await SupplierModel.findOne({ companyName });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    const updateData = {
      ...(productName && { productName }),
      ...(description && { description }),
      ...(price && { price }),
      ...(category && { category }),
      ...(imagePath && { image: imagePath }),
      ...(quantity && { quantity }),
      ...(companyName && { companyName }),
      ...(supplier && { supplierID: supplier._id }),
      ...(parsedManufactureDate && { manufactureDate: parsedManufactureDate }),
      ...(parsedExpiryDate && { expiryDate: parsedExpiryDate }),
    };
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete a product
app.delete('/deleteproduct/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    await ProductModel.findByIdAndDelete(id);
    res.status(204).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// Get individual product
app.get('/getproduct', async (req, res) => {
  try {
    const { id } = req.query;
    const product = await ProductModel.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ error: 'No product found' });
    }
    return res.status(200).json(product);
  } catch (err) {
    console.log('Error fetching product:', err);
    return res.status(500).json({ error: 'Server side error', err });
  }
});

// Create Supplier
app.post('/addsuppliers', authenticateJWT, async (req, res) => {
  try {
    const { supplierName, companyName, email, phone } = req.body;
    const supplier = await new SupplierModel({ supplierName, companyName, email, phone }).save();
    res.status(200).json({ message: 'Supplier created successfully', supplier });
  } catch (error) {
    console.error('Error creating supplier:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email or NIC already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Get suppliers
app.get('/getsuppliers', authenticateJWT, async (req, res) => {
  try {
    const suppliers = await SupplierModel.find();
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Error fetching suppliers' });
  }
});

// Update supplier
app.put('/updatesupplier/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { supplierName, companyName, email } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid supplier ID format' });
    }
    const updatedSupplier = await SupplierModel.findByIdAndUpdate(
      id,
      { supplierName, companyName, email },
      { new: true, runValidators: true }
    );
    if (!updatedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(updatedSupplier);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Error updating supplier', error: error.message });
  }
});

// Delete supplier
app.delete('/deletesupplier/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid supplier ID' });
    }
    const supplier = await SupplierModel.findByIdAndDelete(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    return res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return res.status(500).json({ message: 'Server error while deleting supplier' });
  }
});

// Get user profile
app.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const email = req.user.email;
    const currentUser = await CustomerModel.findOne({ email });
    if (!currentUser) {
      return res.status(404).json({ error: 'No Record Exists' });
    }
    return res.status(200).json({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve user data' });
  }
});

// Update profile
app.put('/updateProfile', authenticateJWT, async (req, res) => {
  try {
    const email = req.user.email;
    const { name, phone, address } = req.body;
    const updatedUser = await CustomerModel.findOneAndUpdate(
      { email },
      { name, phone, address },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User Not Found' });
    }
    return res.status(200).json({ message: 'User Updated Successfully', updatedUser });
  } catch (error) {
    console.log('Error updating profile', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update password
app.put('/updatepassword', authenticateJWT, async (req, res) => {
  try {
    const email = req.user.email;
    const { currentPassword, newPassword } = req.body;
    const user = await CustomerModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    const updatedUser = await CustomerModel.findOneAndUpdate(
      { email },
      { password: hashedNewPassword },
      { new: true }
    );
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error when updating the password' });
  }
});

// Get OTC products
app.get('/getproductsOTC', async (req, res) => {
  try {
    const products = await ProductModel.find({ category: 'OTC' });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get profile letter and cart count
app.get('/getLetter', authenticateJWT, async (req, res) => {
  try {
    const email = req.user.email;
    const user = await CustomerModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const username = user.name;
    const letter = username.charAt(0).toUpperCase();
    const items = await CartModel.find({ email });
    const number = items.length;
    res.status(200).json({ letter, number });
  } catch (error) {
    console.error('Error on the server side', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to cart
app.post('/addtocart', authenticateJWT, async (req, res) => {
  const { productId, ProductName, ProductPrice, ProductQuantity, Subtotal, Image } = req.body;
  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      console.error('No product found');
      return res.status(404).json({ message: 'No product found' });
    }
    product.quantity -= 1;
    await product.save();
    const newItem = new CartModel({
      ProductId: productId,
      ProductName,
      email: req.user.email,
      ProductPrice,
      ProductQuantity,
      Subtotal,
      Image
    });
    await newItem.save();
    return res.status(200).json({ message: 'Product Added to Cart Successfully' });
  } catch (error) {
    console.log("Something went wrong in the server", error);
    return res.status(500).json({ error: 'Something went wrong in the server' });
  }
});

// Delete product from cart
app.delete('/deletecartproduct/:id', authenticateJWT, async (req, res) => {
  try {
    const email = req.user.email;
    if (!email) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
    const { id } = req.params;
    const cartItem = await CartModel.findById(id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    const product = await ProductModel.findById(cartItem.ProductId);
    if (product) {
      product.quantity += 1;
      await product.save();
    }
    const deletedProduct = await CartModel.findOneAndDelete({ email, _id: id });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'No products found' });
    }
    res.status(200).json({ message: 'Product Deleted Successfully from the cart' });
  } catch (error) {
    console.error('Server side error when deleting the product', error);
    return res.status(500).json({ message: 'Server side error when deleting the product' });
  }
});

// Get cart items
app.get('/getcartitems', authenticateJWT, async (req, res) => {
  try {
    const email = req.user.email;
    if (!email) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
    const products = await CartModel.find({ email });
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found in the cart' });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error('Server side error when fetching the cart products.', error);
    return res.status(500).json({ message: 'Server side error when fetching the cart products' });
  }
});

// Get user email
app.get('/getuser', authenticateJWT, async (req, res) => {
  try {
    return res.status(200).json({ email: req.user.email });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Save order
app.post('/saveorder', authenticateJWT, async (req, res) => {
  const { cartItems, email, deliveryMethod, deliveryDetails, orderToken } = req.body;
  if (!cartItems || !email || !deliveryMethod) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (deliveryMethod === 'home' && !deliveryDetails) {
    return res.status(400).json({ message: 'Delivery details required for home delivery' });
  }
  if (deliveryMethod === 'instore' && !orderToken) {
    return res.status(400).json({ message: 'Order token required for in-store pickup' });
  }
  try {
    const newOrder = new OrderModel({
      email,
      cartItems,
      deliveryMethod,
      deliveryDetails: deliveryMethod === 'home' ? deliveryDetails : null,
      orderToken: deliveryMethod === 'instore' ? orderToken : null,
    });
    await newOrder.save();
    await CartModel.deleteMany({ email });
    return res.status(200).json({ message: 'Order saved successfully' });
  } catch (error) {
    console.error('Error saving order:', error.message);
    return res.status(500).json({ error: 'Failed to save order' });
  }
});

// Book consultation
app.post('/book-consultation', authenticateJWT, uploadMedicalRecords, async (req, res) => {
  try {
    const email = req.user.email;
    const { user, patient, location, slot } = req.body;
    if (!user || !patient || !location || !slot || !req.file) {
      return res.status(400).json({ message: 'All fields and medical records file are required' });
    }

    const parsedUser = JSON.parse(user);
    const parsedPatient = JSON.parse(patient);
    const parsedLocation = JSON.parse(location);
    const parsedSlot = JSON.parse(slot);

    if (!parsedUser.name || !parsedUser.email || !parsedUser.phone) {
      return res.status(400).json({ message: 'User details (name, email, phone) are required' });
    }
    if (!parsedPatient.name || !parsedPatient.age || !parsedPatient.gender || !parsedPatient.reason) {
      return res.status(400).json({ message: 'Patient details (name, age, gender, reason) are required' });
    }
    if (!parsedLocation.lat || !parsedLocation.lng || !parsedLocation.link) {
      return res.status(400).json({ message: 'Location details (lat, lng, link) are required' });
    }
    if (!parsedSlot.date || !parsedSlot.time) {
      return res.status(400).json({ message: 'Slot details (date, time) are required' });
    }

    const consultation = new Consultation({
      user: {
        name: parsedUser.name,
        email: parsedUser.email,
        phone: parsedUser.phone
      },
      patient: {
        name: parsedPatient.name,
        age: parsedPatient.age,
        gender: parsedPatient.gender,
        reason: parsedPatient.reason
      },
      medicalRecords: req.file.path,
      location: {
        lat: parsedLocation.lat,
        lng: parsedLocation.lng,
        link: parsedLocation.link
      },
      slot: {
        date: new Date(parsedSlot.date),
        time: parsedSlot.time
      },
      status: 'Pending',
      createdBy: email
    });

    await consultation.save();
    res.status(200).json({ message: 'Consultation booked successfully! You will receive a confirmation soon.' });
  } catch (error) {
    console.error('Error booking consultation:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    } else if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ message: error.message });
    } else if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate entry detected' });
    }
    res.status(500).json({ message: 'Failed to book consultation. Please try again.' });
  }
});

app.post('/prescriptionUpload',authenticateJWT , uploadPrescriptionRecords, async (req , res)=>{
  try{
    const email = req.user.email;
    console.log(email);
    const {deliveryOption, tokenNumber, address, city, state, zip} = req.body;
    console.log(deliveryOption);
  if (!req.file) return res.status(400).json({ message: 'Prescription is required' });
  const prescriptionFilePath = req.file.path;
  if (deliveryOption === 'instore' && !tokenNumber) {
    return res.status(400).json({ message: 'Order token required for in-store pickup' });
  }
  const prescription = new PrescriptionModel({
    email,
    prescriptionFilePath,
    deliveryMethod:deliveryOption,
    deliveryDetails:deliveryOption==='home'? {
      address,
      city,
      state,
      zip
    }:null,
     orderToken: deliveryOption === 'instore' ? tokenNumber : null
  });

  await prescription.save();
  return res.status(200).json({message:'Successfully added the prescription'});
  }catch(error){
    return res.status(500).json({message:'Server Error in uploading prescription'});
  }
});




// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});