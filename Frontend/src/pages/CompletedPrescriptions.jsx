import React from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const CompletedPrescriptions = () => {
  const prescriptions = [
    {
      id: "PRE001",
      patientName: "John Doe",
      date: "2025-07-18",
      image: "https://via.placeholder.com/150",
      status: "completed",
    },
    {
      id: "PRE002",
      patientName: "Jane Smith",
      date: "2025-07-17",
      image: "https://via.placeholder.com/150",
      status: "completed",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" role="main" aria-label="Completed Prescriptions">
      <Navbar />
      <div className="flex-1 py-8 px-4 mt-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6" id="prescriptions-heading">Completed Prescriptions</h1>
          {prescriptions.length === 0 ? (
            <p className="text-gray-600 text-center py-10" role="alert">No completed prescriptions.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <img
                    src={prescription.image}
                    alt={`${prescription.patientName}'s prescription`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">ID: {prescription.id}</h2>
                    <p className="text-gray-600"><strong>Patient:</strong> {prescription.patientName}</p>
                    <p className="text-gray-600"><strong>Date:</strong> {prescription.date}</p>
                    <p className="text-gray-600"><strong>Status:</strong> {prescription.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompletedPrescriptions;