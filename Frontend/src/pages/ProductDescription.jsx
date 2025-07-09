import { useParams, useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EHeader from '../components/EHeader';
import Footer from '../components/Footer';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const api = 'http://localhost:3000';

  useEffect(() => {
    if (id) {
      axios
        .get(`${api}/getproduct?id=${id}`)
        .then((res) => {
          if (res.data.error) {
            console.log(res.data.error);
          } else {
            setProduct(res.data);
            setFormData(res.data);
            console.log('Fetched Successfully');
          }
        })
        .catch((err) => {
          console.error('Error fetching product:', err);
        });
    } else {
      console.error('No ID has been defined');
    }
  }, [id]);

  const totalValue = product.price && product.quantity
    ? (product.price * product.quantity).toFixed(2)
    : '0.00';

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(product.quantity, Number(e.target.value)));
    setQuantity(value);
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.productName} to cart`);
  };

  const getImageUrl = () => {
    if (product.image) {
      const formattedPath = product.image.replace(/\\/g, '/');
      return `http://localhost:3000/${formattedPath}`;
    }
    return null;
  };

  return (
    <>
      <EHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-8">
        <div className="bg-white shadow-xl rounded-2xl max-w-4xl w-full p-6 relative">
          <button
            onClick={() => navigate('/products')}
            className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black"
          >
            <FiX />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Product Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {getImageUrl() ? (
                <img
                  src={getImageUrl()}
                  alt={product.productName || 'Product Image'}
                  className="w-full h-auto max-h-64 object-contain rounded-md"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/192x128?text=No+Image'; }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 border border-dashed">
                  No Image Available
                </div>
              )}
              <p className="text-xl font-bold text-gray-800 mt-4">{product.productName}</p>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-lg font-semibold text-green-600">
                  Rs. {parseFloat(product?.price || 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-sm text-gray-800">{product.description}</p>
              </div>
              <div className="mb-3 mt-8">
                {product.quantity > 0 ? (
                  <p className="text-green-600">In Stock ({product.quantity} units)</p>
                ) : (
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                )}
              </div>
              {product.quantity > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Quantity</p>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.quantity}
                    className="w-20 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div className="mt-6 flex flex-col sm:flex-row justify-start gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                  className={`px-4 py-2 rounded-md text-white ${
                    product.quantity === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;