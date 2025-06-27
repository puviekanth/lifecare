import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { FiX } from 'react-icons/fi';
import { useState } from 'react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ ...product });

  if (!product) {
    return (
      <div className="p-8 text-center text-lg text-red-500 font-semibold">
        Product not found.
      </div>
    );
  }

  const totalValue = (product.price * product.quantity).toFixed(2);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log('Updated Product:', formData);
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl max-w-4xl w-full p-6 relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black"
        >
          <FiX />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Product Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Image and basic info */}
          <div>
            <div className="w-full h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400 border border-dashed">
              <span>No Image</span>
            </div>
            <p className="text-xl font-bold text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-500 mt-1">Product ID: {product.id}</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-lg font-semibold text-green-600">Rs. {product.price.toFixed(2)}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="text-lg font-bold text-gray-800">{product.quantity}</p>
            </div>
          </div>

          {/* Right: Additional details */}
          <div>
            <div className="mb-3">
              <p className="text-sm text-gray-500">OTC Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === 'OTC'
                    ? 'bg-black text-white'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {product.status}
              </span>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-sm text-gray-800">{product.description}</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-500">Supplier ID</p>
              <p className="text-sm text-gray-800">{product.supplier}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mt-4">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <p>Stock Status</p>
                <p>Total Value</p>
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-green-600">In Stock ({product.quantity} units)</p>
                <p className="text-blue-700">Rs. {totalValue}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
          >
            Edit Product
          </button>
        </div>
      </div>

      {/* Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowEditModal(false)}
            >
              <FiX />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Edit Product</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Medicine Name"
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  disabled
                  className="border p-2 rounded-md bg-gray-100 text-gray-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Quantity"
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Supplier ID"
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400"
                />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select OTC</option>
                  <option value="OTC">OTC</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="A3">A3</option>
                </select>
              </div>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="border border-gray-300 p-2 rounded-md w-full resize-none focus:ring-2 focus:ring-blue-400"
              ></textarea>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
