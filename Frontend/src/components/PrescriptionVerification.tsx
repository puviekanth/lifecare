import React, { useState } from 'react';
import {
  FileText,
  User,
  Calendar,
  Clock,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Upload,
  Search,
  Eye,
  Download,
  X,
  Phone,
  Mail,
  MapPin,
  Shield,
  Camera,
  Pill,
  Activity
} from 'lucide-react';

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  date: string;
  medications: Medication[];
  diagnosis: string;
  instructions: string;
  status: 'pending' | 'verified' | 'rejected' | 'dispensed';
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  prescriptionImage?: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}

const mockPrescriptions: Prescription[] = [
  {
    id: 'RX001',
    patientName: 'John Smith',
    patientId: 'P001',
    doctorName: 'Dr. Sarah Johnson',
    doctorId: 'D001',
    date: '2024-01-15',
    diagnosis: 'Hypertension',
    instructions: 'Take with food, avoid alcohol',
    status: 'pending',
    medications: [
      {
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30,
        instructions: 'Take in the morning'
      },
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        quantity: 60,
        instructions: 'Take with meals'
      }
    ]
  },
  {
    id: 'RX002',
    patientName: 'Maria Garcia',
    patientId: 'P002',
    doctorName: 'Dr. Michael Chen',
    doctorId: 'D002',
    date: '2024-01-14',
    diagnosis: 'Respiratory Infection',
    instructions: 'Complete full course of antibiotics',
    status: 'verified',
    verifiedBy: 'Pharmacist Jane Doe',
    verifiedAt: '2024-01-14 10:30 AM',
    medications: [
      {
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '7 days',
        quantity: 21,
        instructions: 'Take with food'
      }
    ]
  }
];

const PrescriptionVerification: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'dispensed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      case 'dispensed': return <Pill className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleVerifyPrescription = (prescriptionId: string, action: 'verify' | 'reject') => {
    setPrescriptions(prev => prev.map(prescription => {
      if (prescription.id === prescriptionId) {
        return {
          ...prescription,
          status: action === 'verify' ? 'verified' : 'rejected',
          verifiedBy: action === 'verify' ? 'Current Pharmacist' : undefined,
          verifiedAt: action === 'verify' ? new Date().toLocaleString() : undefined,
          rejectionReason: action === 'reject' ? rejectionReason : undefined
        };
      }
      return prescription;
    }));
    setShowVerificationModal(false);
    setVerificationNotes('');
    setRejectionReason('');
  };

  const openVerificationModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowVerificationModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Prescription Verification</h1>
                <p className="text-gray-600">Verify and manage prescription requests</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200">
                <Upload className="h-4 w-4" />
                Upload Prescription
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200">
                <Download className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient name, prescription ID, or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
              <option value="dispensed">Dispensed</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Prescriptions</p>
                <p className="text-3xl font-bold text-gray-900">{prescriptions.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Verification</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {prescriptions.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified Today</p>
                <p className="text-3xl font-bold text-green-600">
                  {prescriptions.filter(p => p.status === 'verified').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {prescriptions.filter(p => p.status === 'rejected').length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <X className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Prescription Requests ({filteredPrescriptions.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredPrescriptions.map((prescription) => (
              <div key={prescription.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          Prescription #{prescription.id}
                        </h4>
                        <p className="text-gray-600">
                          Patient: {prescription.patientName} | Doctor: {prescription.doctorName}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(prescription.status)}`}>
                        {getStatusIcon(prescription.status)}
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        Date: {prescription.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Activity className="h-4 w-4" />
                        Diagnosis: {prescription.diagnosis}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Pill className="h-4 w-4" />
                        Medications: {prescription.medications.length}
                      </div>
                    </div>

                    {prescription.status === 'verified' && prescription.verifiedBy && (
                      <div className="bg-green-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-green-800">
                          <strong>Verified by:</strong> {prescription.verifiedBy} at {prescription.verifiedAt}
                        </p>
                      </div>
                    )}

                    {prescription.status === 'rejected' && prescription.rejectionReason && (
                      <div className="bg-red-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong> {prescription.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Medications:</h5>
                      <div className="space-y-2">
                        {prescription.medications.map((medication, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="font-medium">{medication.name} {medication.dosage}</span>
                            <span className="text-gray-600">
                              {medication.frequency} × {medication.duration} (Qty: {medication.quantity})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => setSelectedPrescription(prescription)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    
                    {prescription.status === 'pending' && (
                      <button
                        onClick={() => openVerificationModal(prescription)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Verify Prescription</h3>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Prescription Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">ID:</span> {selectedPrescription.id}
                  </div>
                  <div>
                    <span className="text-gray-600">Patient:</span> {selectedPrescription.patientName}
                  </div>
                  <div>
                    <span className="text-gray-600">Doctor:</span> {selectedPrescription.doctorName}
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span> {selectedPrescription.date}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Notes
                </label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any verification notes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Reason for rejection..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleVerifyPrescription(selectedPrescription.id, 'verify')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Verify Prescription
                </button>
                <button
                  onClick={() => handleVerifyPrescription(selectedPrescription.id, 'reject')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <X className="h-5 w-5" />
                  Reject Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Details Modal */}
      {selectedPrescription && !showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Prescription Details</h3>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient and Doctor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedPrescription.patientName}</div>
                    <div><strong>ID:</strong> {selectedPrescription.patientId}</div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Doctor Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedPrescription.doctorName}</div>
                    <div><strong>ID:</strong> {selectedPrescription.doctorId}</div>
                  </div>
                </div>
              </div>

              {/* Prescription Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Prescription Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Date:</strong> {selectedPrescription.date}</div>
                  <div><strong>Diagnosis:</strong> {selectedPrescription.diagnosis}</div>
                  <div className="md:col-span-2">
                    <strong>Instructions:</strong> {selectedPrescription.instructions}
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Prescribed Medications</h4>
                <div className="space-y-4">
                  {selectedPrescription.medications.map((medication, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{medication.name}</h5>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {medication.dosage}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div><strong>Frequency:</strong> {medication.frequency}</div>
                        <div><strong>Duration:</strong> {medication.duration}</div>
                        <div><strong>Quantity:</strong> {medication.quantity}</div>
                      </div>
                      {medication.instructions && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Instructions:</strong> {medication.instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionVerification;