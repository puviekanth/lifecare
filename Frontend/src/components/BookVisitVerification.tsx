import React, { useState } from 'react';
import ScheduleAppointmentModal from './ScheduleAppointmentModal';
import {
  Calendar,
  User,
  Clock,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Search,
  Eye,
  Phone,
  Mail,
  MapPin,
  X,
  Edit,
  UserCheck,
  Activity,
  FileText,
  Star,
  Shield,
  Heart
} from 'lucide-react';

interface BookingRequest {
  id: string;
  patientName: string;
  patientId: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  doctorName: string;
  doctorId: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  visitType: 'consultation' | 'follow-up' | 'emergency' | 'routine-checkup';
  reason: string;
  symptoms: string[];
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

const mockBookingRequests: BookingRequest[] = [
  {
    id: 'BV001',
    patientName: 'Sarah Wilson',
    patientId: 'P001',
    email: 'sarah.wilson@email.com',
    phone: '+1 (555) 123-4567',
    age: 34,
    gender: 'Female',
    doctorName: 'Dr. Michael Chen',
    doctorId: 'D001',
    specialty: 'Cardiology',
    appointmentDate: '2024-01-20',
    appointmentTime: '10:00 AM',
    visitType: 'consultation',
    reason: 'Chest pain and shortness of breath',
    symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue'],
    medicalHistory: 'Hypertension, Family history of heart disease',
    currentMedications: 'Lisinopril 10mg daily',
    allergies: 'Penicillin',
    status: 'pending',
    priority: 'high',
    submittedAt: '2024-01-15 09:30 AM'
  },
  {
    id: 'BV002',
    patientName: 'James Rodriguez',
    patientId: 'P002',
    email: 'james.rodriguez@email.com',
    phone: '+1 (555) 987-6543',
    age: 28,
    gender: 'Male',
    doctorName: 'Dr. Emily Johnson',
    doctorId: 'D002',
    specialty: 'General Medicine',
    appointmentDate: '2024-01-18',
    appointmentTime: '2:30 PM',
    visitType: 'routine-checkup',
    reason: 'Annual health checkup',
    symptoms: [],
    medicalHistory: 'No significant medical history',
    currentMedications: 'None',
    allergies: 'None',
    status: 'confirmed',
    priority: 'low',
    submittedAt: '2024-01-12 02:15 PM',
    verifiedBy: 'Admin Staff',
    verifiedAt: '2024-01-12 03:00 PM'
  },
  {
    id: 'BV003',
    patientName: 'Maria Garcia',
    patientId: 'P003',
    email: 'maria.garcia@email.com',
    phone: '+1 (555) 456-7890',
    age: 45,
    gender: 'Female',
    doctorName: 'Dr. Sarah Johnson',
    doctorId: 'D003',
    specialty: 'Dermatology',
    appointmentDate: '2024-01-22',
    appointmentTime: '11:15 AM',
    visitType: 'follow-up',
    reason: 'Follow-up for skin condition',
    symptoms: ['Skin rash', 'Itching'],
    medicalHistory: 'Eczema, Allergic dermatitis',
    currentMedications: 'Topical corticosteroids',
    allergies: 'Latex, Certain fragrances',
    status: 'pending',
    priority: 'medium',
    submittedAt: '2024-01-14 11:45 AM'
  }
];

interface BookVisitVerificationProps {
  onScheduleAppointment?: () => void;
}

const BookVisitVerification: React.FC<BookVisitVerificationProps> = ({ onScheduleAppointment }) => {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(mockBookingRequests);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredBookings = bookingRequests.filter(booking => {
    const matchesSearch = booking.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || booking.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      case 'completed': return <UserCheck className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const handleVerifyBooking = (bookingId: string, action: 'confirm' | 'reject') => {
    setBookingRequests(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: action === 'confirm' ? 'confirmed' : 'rejected',
          verifiedBy: action === 'confirm' ? 'Current Staff' : undefined,
          verifiedAt: action === 'confirm' ? new Date().toLocaleString() : undefined,
          rejectionReason: action === 'reject' ? rejectionReason : undefined,
          notes: verificationNotes
        };
      }
      return booking;
    }));
    setShowVerificationModal(false);
    setVerificationNotes('');
    setRejectionReason('');
  };

  const openVerificationModal = (booking: BookingRequest) => {
    setSelectedBooking(booking);
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
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Book Visit Verification</h1>
                <p className="text-gray-600">Review and verify appointment booking requests</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
              >
                <Calendar className="h-4 w-4" />
                Schedule Appointment
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200">
                <FileText className="h-4 w-4" />
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
                  placeholder="Search by patient name, booking ID, or doctor..."
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
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900">{bookingRequests.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {bookingRequests.filter(b => b.status === 'pending').length}
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
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">
                  {bookingRequests.filter(b => b.status === 'confirmed').length}
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
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-3xl font-bold text-orange-600">
                  {bookingRequests.filter(b => b.priority === 'high' || b.priority === 'urgent').length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-blue-600">
                  {bookingRequests.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Requests List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Booking Requests ({filteredBookings.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          Booking #{booking.id}
                        </h4>
                        <p className="text-gray-600">
                          Patient: {booking.patientName} | Doctor: {booking.doctorName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(booking.priority)}`}>
                          {booking.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {booking.appointmentDate}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {booking.appointmentTime}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Stethoscope className="h-4 w-4" />
                        {booking.specialty}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Activity className="h-4 w-4" />
                        {booking.visitType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {booking.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {booking.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        {booking.age} years, {booking.gender}
                      </div>
                    </div>

                    {booking.status === 'confirmed' && booking.verifiedBy && (
                      <div className="bg-green-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-green-800">
                          <strong>Confirmed by:</strong> {booking.verifiedBy} at {booking.verifiedAt}
                        </p>
                      </div>
                    )}

                    {booking.status === 'rejected' && booking.rejectionReason && (
                      <div className="bg-red-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong> {booking.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Reason for Visit:</h5>
                      <p className="text-sm text-gray-700 mb-2">{booking.reason}</p>
                      {booking.symptoms.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Symptoms: </span>
                          <span className="text-sm text-gray-600">{booking.symptoms.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => openVerificationModal(booking)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Review
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
      {showVerificationModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Review Booking Request</h3>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">ID:</span> {selectedBooking.id}
                  </div>
                  <div>
                    <span className="text-gray-600">Patient:</span> {selectedBooking.patientName}
                  </div>
                  <div>
                    <span className="text-gray-600">Doctor:</span> {selectedBooking.doctorName}
                  </div>
                  <div>
                    <span className="text-gray-600">Date & Time:</span> {selectedBooking.appointmentDate} at {selectedBooking.appointmentTime}
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
                  placeholder="Add any notes about this booking..."
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
                  onClick={() => handleVerifyBooking(selectedBooking.id, 'confirm')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Confirm Booking
                </button>
                <button
                  onClick={() => handleVerifyBooking(selectedBooking.id, 'reject')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <X className="h-5 w-5" />
                  Reject Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && !showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Booking Request Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {selectedBooking.patientName}</div>
                  <div><strong>ID:</strong> {selectedBooking.patientId}</div>
                  <div><strong>Age:</strong> {selectedBooking.age} years</div>
                  <div><strong>Gender:</strong> {selectedBooking.gender}</div>
                  <div><strong>Phone:</strong> {selectedBooking.phone}</div>
                  <div><strong>Email:</strong> {selectedBooking.email}</div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Appointment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Doctor:</strong> {selectedBooking.doctorName}</div>
                  <div><strong>Specialty:</strong> {selectedBooking.specialty}</div>
                  <div><strong>Date:</strong> {selectedBooking.appointmentDate}</div>
                  <div><strong>Time:</strong> {selectedBooking.appointmentTime}</div>
                  <div><strong>Visit Type:</strong> {selectedBooking.visitType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                  <div><strong>Priority:</strong> {selectedBooking.priority.toUpperCase()}</div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Medical Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Reason for Visit:</strong>
                    <p className="mt-1 text-gray-700">{selectedBooking.reason}</p>
                  </div>
                  {selectedBooking.symptoms.length > 0 && (
                    <div>
                      <strong>Symptoms:</strong>
                      <p className="mt-1 text-gray-700">{selectedBooking.symptoms.join(', ')}</p>
                    </div>
                  )}
                  <div>
                    <strong>Medical History:</strong>
                    <p className="mt-1 text-gray-700">{selectedBooking.medicalHistory}</p>
                  </div>
                  <div>
                    <strong>Current Medications:</strong>
                    <p className="mt-1 text-gray-700">{selectedBooking.currentMedications}</p>
                  </div>
                  <div>
                    <strong>Allergies:</strong>
                    <p className="mt-1 text-gray-700">{selectedBooking.allergies}</p>
                  </div>
                </div>
              </div>

              {/* Submission Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Submission Details</h4>
                <div className="text-sm">
                  <div><strong>Submitted At:</strong> {selectedBooking.submittedAt}</div>
                  {selectedBooking.verifiedBy && (
                    <>
                      <div><strong>Verified By:</strong> {selectedBooking.verifiedBy}</div>
                      <div><strong>Verified At:</strong> {selectedBooking.verifiedAt}</div>
                    </>
                  )}
                  {selectedBooking.notes && (
                    <div className="mt-2">
                      <strong>Notes:</strong>
                      <p className="mt-1 text-gray-700">{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Appointment Modal */}
      <ScheduleAppointmentModal 
        isOpen={showScheduleModal} 
        onClose={() => setShowScheduleModal(false)} 
      />
    </div>
  );
};

export default BookVisitVerification;