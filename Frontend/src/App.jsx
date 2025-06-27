// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddMedicine from './pages/AddMedicine';
import ProductDetails from './pages/ProductDetails';
import BillProduct from './pages/BillProducts';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Suppliers from './pages/Suppliers'
import AddSuppliers from './pages/AddSupplier'

function App() {
  return (
    <Router>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addproduct" element={<AddMedicine />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path='/bill' element={<BillProduct />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Signup />} />
          <Route path='/suppliers' element={<Suppliers />} />
          <Route path='/addSuppliers' element={<AddSuppliers />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
