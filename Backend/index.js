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
const secretKey = 'lifecare/AGILE/y3s2';

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
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
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
  app.put('/updateproduct/:id', uploadMedicine.single('image'), async (req, res) => {
    const { id } = req.params;
    const { productName , description, price, category,quantity , companyName } = req.body;
    
    

    try {
      let imagePath;
    if (req.file) {
      imagePath = req.file.path;
    }else if(req.body.image){
      imagePath = req.body.image;
    }else{
      return res.status(400).json({'message':'No Image provided'});
    }
      const supplier = SupplierModel.findOne({companyName});

    if(!supplier)
      return res.status(404).json({ message: 'Supplier not found'});

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        { productName, description, price, category, image: imagePath , quantity , companyName , supplierID : supplier._id },
        { new: true }
      );
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error });
    }
  });
  
  // Delete a product
  app.delete('/deleteproduct/:id', async (req, res) => {
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


  // get existing individual product
  app.get('/getproduct', async (req, res) => {
    try {
        const { id } = req.query; 

        const product = await ProductModel.findOne({ _id: id });

        if (!product) {
            return res.status(200).json({ error: 'No product found' });
        }
        console.log(product);
        return res.status(200).json(product);
    }
    catch (err) {
        console.log('Error fetching product:', err);
        return res.status(500).json({ error: 'Server side error', err });
    }
});


  //Create Supplier
  app.post('/addsuppliers', async (req, res) => {
    try {
        const { supplierName, companyName, email, phone } = req.body;
        console.log(phone);
        const supplier = await new SupplierModel({ supplierName, companyName, email, phone  }).save();
        console.log(supplier);
        res.status(200).json({ message: 'Supplier created successfully', supplier });
    } catch (error) {
        console.error('Error creating supplier:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email or NIC already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});


//get supplier
app.get('/getsuppliers', async (req, res) => {
  try {
    const suppliers = await SupplierModel.find();
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

app.put('/updatesupplier/:id', async (req, res) => {
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
    res.status(500).json({ 
      message: 'Error updating supplier',
      error: error.message 
    });
  }
});


app.delete('/deletesupplier/:id', async (req, res) => {
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


app.get('/profile',authenticateJWT, async (req,res)=>{
    try {
        const email = req.user.email;
        const currentUser = await CustomerModel.findOne({email:email});
        if(!currentUser){
            return res.status(500).json({error:'No Record Exists'});
        }
       return res.status(201).json({
            name:currentUser.name,
            email:currentUser.email,
            contact:currentUser.contact,
        });
    } catch (error) {
        return res.status(500).json({error:'Failed to retrieve user data'});
    }
});

//update profile
app.put('/updateProfile', authenticateJWT, async (req, res) => {
    try {
        const email = req.user.email; 
        const { name } = req.body;
        const updatedUser = await CustomerModel.findOneAndUpdate(
            { email: email },  
            { name },
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

//update the password
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

//get products in e-commerce side
app.get('/getproductsOTC', async (req, res) => {
  try {
    const products = await ProductModel.find({ category:'OTC'});
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});



// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});