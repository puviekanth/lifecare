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
import ViewProduct from './pages/ViewProduct';
import Profile from './pages/Profile';
import Products from './pages/Products';


function App() {
  return (
    <Router>
      
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path='/' element={< Login />}/>
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
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
