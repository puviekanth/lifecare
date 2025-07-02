import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiEye, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import EditProductModal from '../components/EditModal';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = 'http://localhost:3000';
  const naviagte = useNavigate();

  const filteredData = products.filter((item) =>
    (item.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
     String(item.id)?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
     item.supplier?.toLowerCase()?.includes(searchTerm.toLowerCase())) &&
    (filter ? item.status === filter : true)
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${api}/getproducts`);
        setProducts(response.data);
      } catch (error) {
        if (error.response) {
          setError(`Server error: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          setError('Network error: Unable to reach the server. Please check your connection.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        console.error('Axios error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/deleteproduct/${id}`);
      setProducts(products.filter((item) => item.id !== id));
      naviagte('/');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product.');
    }
  };

  return (
    <div className="px-4 md:px-6 py-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-800 tracking-tight text-center md:text-left">
          Medicine Product Management
        </h1>
        <Link
          to="/addproduct"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 shadow-md transition duration-200 w-full md:w-auto"
        >
          <FiPlus className="text-lg" /> Add Product
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-blue-100">
        <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-4">
          <FiSearch className="text-blue-500" /> Search & Filter Products
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by medicine name, product ID, or supplier ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Filter by OTC</option>
            <option value="OTC">OTC</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="A3">A3</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          All Products <span className="text-sm text-gray-500">({filteredData.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full table-auto text-sm text-gray-700">
            <thead className="bg-blue-100 text-blue-900 border-b">
              <tr className="text-left">
                <th className="py-2 px-3">Image</th>
                <th className="px-3">Medicine Name</th>
                <th className="px-3">Price (Rs.)</th>
                <th className="px-3">OTC Status</th>
                <th className="px-3">Supplier Name</th>
                <th className="px-3">Quantity</th>
                <th className="px-3">Description</th>
                <th className="px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="9" className="text-center py-6">
                    Loading products...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-red-500">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-blue-50 transition">
                  <td className="py-2 px-3">
                    {item.image ? (
                      <img src={`${api}/${item.image}`} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-md shadow-inner"></div>
                    )}
                  </td>
                  <td className="px-3">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {item.productName}
                    </Link>
                  </td>
                  <td className="px-3 font-semibold text-green-600">Rs. {item.price.toFixed(2)}</td>
                  <td className="px-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.category === 'OTC' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-3">{item.companyName}</td>
                  <td className="px-3 font-semibold">{item.quantity}</td>
                  <td className="px-3 text-gray-600">{item.description}</td>
                  <td className="px-3">
                    <div className="flex gap-3">
                      <Link to={`/product/${item._id}`} className="text-blue-600 hover:text-blue-800" aria-label={`View ${item.name}`}>
                        <FiEye />
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Delete ${item.name}`}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !error && filteredData.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-400 italic">
                    No products match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;