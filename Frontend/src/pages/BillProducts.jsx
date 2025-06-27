import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 29.99, category: 'Accessories' },
  { id: 3, name: 'Keyboard', price: 59.99, category: 'Accessories' },
  { id: 4, name: 'Monitor', price: 199.99, category: 'Electronics' },
  { id: 5, name: 'Headphones', price: 79.99, category: 'Accessories' },
  { id: 6, name: 'PC', price: 999.99, category: 'Electronics' },
  { id: 7, name: 'Cable', price: 29.99, category: 'Accessories' },
  { id: 8, name: 'Mechanical Keyboard', price: 59.99, category: 'Accessories' },
  { id: 9, name: 'Mouse pad', price: 199.99, category: 'Electronics' },
  { id: 10, name: 'Stand', price: 79.99, category: 'Accessories' }
];

function BillProduct() {
  const [searchTerm, setSearchTerm] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToBill = () => {
    if (selectedProduct && quantity > 0) {
      const subtotal = selectedProduct.price * quantity;
      setBillItems((prevItems) => [...prevItems, { ...selectedProduct, quantity, subtotal }]);
      setIsModalOpen(false);
      setQuantity(1);
      setSelectedProduct(null);
      console.log('Added to bill:', { ...selectedProduct, quantity, subtotal });
    } else {
      console.log('Invalid addition: selectedProduct or quantity is invalid');
    }
  };

  const total = billItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Left: Product Search and List */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]">
          <div className="sticky top-0 bg-white z-10 pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Search Products</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleAddClick(product)}
                >
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base">{product.name}</h3>
                  <p className="text-xs md:text-sm text-gray-500">{product.category}</p>
                  <p className="text-base md:text-lg font-bold text-gray-800 mt-2">${product.price.toFixed(2)}</p>
                  <button
                    className="mt-3 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 text-xs md:text-sm transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddClick(product);
                    }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Bill Section */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Bill</h2>
          <div className="border-b border-gray-200 pb-2 mb-4">
            <div className="grid grid-cols-4 font-semibold text-gray-600 text-xs md:text-sm">
              <span>Product</span>
              <span>Quantity</span>
              <span>Price</span>
              <span>Subtotal</span>
            </div>
          </div>
          {billItems.map((item, index) => (
            <div key={index} className="grid grid-cols-4 mb-2 text-gray-700 text-xs md:text-sm">
              <span>{item.name}</span>
              <span>{item.quantity}</span>
              <span>${item.price.toFixed(2)}</span>
              <span>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-4 border-t border-gray-200 pt-2">
            <div className="flex justify-between font-bold text-base md:text-lg text-gray-800">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Quantity Input */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-sm">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Add {selectedProduct?.name}</h3>
            <label className="block text-gray-700 text-sm md:text-base mb-2">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 focus:outline-none focus:border-blue-500 transition-colors mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm md:text-base transition-colors"
                onClick={() => {
                  setIsModalOpen(false);
                  setQuantity(1);
                  console.log('Modal canceled');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm md:text-base transition-colors"
                onClick={handleAddToBill}
              >
                Add to Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillProduct;