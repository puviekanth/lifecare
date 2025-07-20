import React, { useEffect, useState } from 'react';

const DeliveryDetails = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [modalImage, setModalImage] = useState(null); // stores the image path to show in modal

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/prescriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setDeliveries(data);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this delivery?")) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/prescriptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDeliveries(deliveries.filter(item => item._id !== id));
    } catch (error) {
      console.error("Failed to delete delivery:", error);
    }
  };

  const handleVerify = (id) => {
    alert(`Delivery ID ${id} verified!`);
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">Customer Delivery Details</h2>

      {/* Modal */}
      {modalImage && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full max-h-[90vh] overflow-auto mx-4">
      <button
        onClick={() => setModalImage(null)}
        className="absolute top-3 right-3 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition"
        aria-label="Close modal"
      >
        &times;
      </button>
      <img
        src={`http://localhost:3000/${modalImage}`}
        alt="Prescription"
        className="w-full h-auto max-h-[80vh] object-contain rounded"
      />
    </div>
  </div>
)}


      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full table-auto bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-sm uppercase tracking-wide">
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Delivery Option</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">City</th>
              <th className="py-3 px-4 text-left">State</th>
              <th className="py-3 px-4 text-left">ZIP</th>
              <th className="py-3 px-4 text-left">Token</th>
              <th className="py-3 px-4 text-left">Prescription</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d._id} className="hover:bg-gray-50 text-sm transition-all duration-200">
                <td className="py-3 px-4 border-b">{d.email}</td>

                <td className="py-3 px-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${d.deliveryMethod === 'home' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {d.deliveryMethod}
                  </span>
                </td>

                <td className="py-3 px-4 border-b">{d.deliveryMethod === 'home' ? (d.deliveryDetails.address || '-') : '-'}</td>
                <td className="py-3 px-4 border-b">{d.deliveryMethod === 'home' ? (d.deliveryDetails.city || '-') : '-'}</td>
                <td className="py-3 px-4 border-b">{d.deliveryMethod === 'home' ? (d.deliveryDetails.state || '-') : '-'}</td>
                <td className="py-3 px-4 border-b">{d.deliveryMethod === 'home' ? (d.deliveryDetails.zip || '-') : '-'}</td>

                <td className="py-3 px-4 border-b">
                  {d.deliveryMethod === 'instore' ? (d.orderToken || '-') : '-'}
                </td>

                <td className="py-3 px-4 border-b">
                  {d.prescriptionFilePath ? (
                    <img
                      src={`http://localhost:3000/${d.prescriptionFilePath}`}
                      alt="Prescription"
                      onClick={() => setModalImage(d.prescriptionFilePath)}
                      className="w-16 h-16 object-cover border rounded cursor-pointer hover:scale-110 transition-transform duration-200"
                    />
                  ) : (
                    '-'
                  )}
                </td>

                <td className="py-3 px-4 border-b">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => handleVerify(d._id)}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded transition"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {deliveries.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">No delivery records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryDetails;
