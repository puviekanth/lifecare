// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inventory from './pages/Inventory';
import AddMedicine from './pages/AddMedicine';
import ProductDetails from './pages/ProductDetails';
import BillProduct from './pages/BillProducts';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Suppliers from './pages/Suppliers'
import AddSuppliers from './pages/AddSupplier'
import Home from './pages/Home';
import Profile from './pages/Profile';
import Products from './pages/Products';
import ViewProduct from './pages/ProductDescription';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import BookConsultation from './pages/BookConsultation';
import UploadPrescription from './pages/UploadPrescription';
import Prescriptions from './pages/Prescriptions';
import ContactUs from './pages/ContactUs';
import EHeader from './components/EHeader';
import AboutUs from './pages/AboutUs';


function App() {
  return (
    <Router>
      <EHeader/>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path='/' element={< Home />}/>
          <Route path='/home' element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/addproduct" element={<AddMedicine />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path='/bill' element={<BillProduct />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Signup />} />
          <Route path='/suppliers' element={<Suppliers />} />
          <Route path='/addSuppliers' element={<AddSuppliers />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/products' element={<Products />} />
          <Route path="/view/:id" element={<ViewProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path='/checkout' element={<Checkout />}/>
          <Route path='/consultation' element={<BookConsultation />}/>
          <Route path='/prescription' element={<UploadPrescription />} />
          <Route path='/prescriptions' element={<Prescriptions />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/about-us' element={<AboutUs />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
