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
const saltRounds = 10;
const secretKey = 'lifecare/AGILE/y3s2'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/medicines'); // Save files to 'uploads/medicines' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append date and file extension to the file name
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
}).array('medicine', 1);

mongoose.connect("mongodb://localhost:27017/lifecare", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

    .then(() => console.log("Connected to MongoDB database: lifecare"))
    .catch(err => console.error("Failed to connect to MongoDB", err));



    //create protected route for all navigations
    const authenticateJWT = (req,res,next) =>{
    const token = req.headers.authorization?.split(' ')[1]; //extract token from the headers
    if(!token){
       return res.status(500).json({error:'No token found, please try logging in again.'});
        
    }
    jwt.verify(token,secretKey, (err,decoded)=>{
        if(err){
            return res.status(500).json({error:'Invalid token'});
        }
        req.user = decoded; //saving the decoded email to the req.user
        next();
    });
}


//Signup route
app.post('/signup', async (req, res) => {
    try {
        
        const { name, email, password } = req.body;

        // Hash the password
        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        // Store the user details in the appropriate collection
        if (email.endsWith('.admin@lifecare.com')) {
            // Admin user logic
            const adminUser = await AdminModel.create({
                name,
                password: encryptedPassword,
                email,
            });
            res.status(200).json({ message: 'Admin User Created Successfully', user: adminUser });

        } else {
            // Regular customer logic
            const newUser = await CustomerModel.create({
                name,
                password: encryptedPassword,
                email,
            });

            // Respond with success
            res.status(200).json({ message: 'Customer Created Successfully', user: newUser });
        }

    } catch (e) {
        if (e.code === 11000) { // MongoDB error for duplicate key
            // Duplicate email or NIC error
            res.status(400).json({ error: "Email or NIC already exists." });
        } else {
            console.error("An unexpected error occurred.", e);
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
});


//login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if(email.endsWith('.admin@lifecare.com')){
            const admin = await AdminModel.findOne({email:email});
            if(!admin){
                return res.status(404).json({error:'No admin Found'});
            }
            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {
                // Generate JWT token
                const token = jwt.sign({ email: admin.email }, secretKey, { expiresIn: '1h' });
    
                // Return token along with success message
                return res.status(200).json({ message: 'Logged in successfully', token: token ,user:admin });
            } else {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

        }else{
        const user = await CustomerModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ error: 'No User Found, please register.' });
        }

        // Correctly await bcrypt.compare for password comparison
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Generate JWT token
            const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

            // Return token along with success message
            return res.status(200).json({ message: 'Logged in successfully', token: token ,user:user });
        } else {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
       }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Server error'});
    }
});


//Get the Products to display in ueEffect
  app.get('/getproducts', async (req, res) => {
    try {
      const medicine = await MedicineModel.find();
      res.json(medicine);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  });
  
  const Medicinestorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/medicines');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const uploadMedicine = multer({ storage: Medicinestorage });
  
  // Add new product
 app.post('/addproduct', uploadMedicine.single('image'), async (req, res) => {
  const { medicineName, price, otcStatus , companyName,  quantity, description} = req.body;
  
  if (!req.file) return res.status(400).json({ message: 'Image is required' });
  const imagePath = req.file.path;
  
  try {
    
    const supplier = await SupplierModel.findOne({companyName});
    console.log(supplier.companyName);
    if (!supplier) {return res.status(404).json({ message: 'Supplier not found'});}

    const medicine = new ProductModel({
      productName:medicineName,
      description,
      price,
      category: otcStatus,
      quantity,
      companyName,
      supplierID: supplier._id,
      image: imagePath
    });

    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding product', 
      error: error.message 
    });
  }
});
  
  // Update existing product
  app.put('/updateMedicine/:id', uploadMedicine.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category,quantity } = req.body;
    const imagePath = req.file ? req.file.path : '';
  
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        { name, description, price, category, image: imagePath },
        { new: true }
      );
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error });
    }
  });
  
  // Delete a product
  app.delete('/deleteproducts/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await ProductModel.findByIdAndDelete(id);
      res.status(204).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error });
    }
  });
  
  // Serve uploaded images
  app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));



  //Create Supplier
  app.post('/addsuppliers', async (req, res) => {
    try {
        const { supplierName, companyName, email, phone } = req.body;
        const supplier = await new SupplierModel({ supplierName, companyName, email, phone  }).save();
        res.status(200).json({ message: 'Supplier created successfully', supplier });
    } catch (error) {
        console.error('Error creating customer:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email or NIC already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});


// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});