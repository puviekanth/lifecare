import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Stethoscope,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Star,
  Heart,
  Activity,
  Shield
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image: string;
  availability: string[];
  location: string;
  consultationFee: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    experience: '15+ years',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    location: 'Main Hospital - Floor 3',
    consultationFee: 150
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    experience: '12+ years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    location: 'Neurology Center - Floor 2',
    consultationFee: 180
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    experience: '10+ years',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    location: 'Children\'s Wing - Floor 1',
    consultationFee: 120
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedic Surgeon',
    experience: '18+ years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    location: 'Orthopedic Center - Floor 4',
    consultationFee: 200
  },
  {
    id: '5',
    name: 'Dr. Lisa Anderson',
    specialty: 'Dermatologist',
    experience: '8+ years',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    location: 'Dermatology Clinic - Floor 2',
    consultationFee: 130
  }
];

const timeSlots: TimeSlot[] = [
  { time: '09:00 AM', available: true },
  { time: '09:30 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '11:30 AM', available: false },
  { time: '02:00 PM', available: true },
  { time: '02:30 PM', available: true },
  { time: '03:00 PM', available: true },
  { time: '03:30 PM', available: false },
  { time: '04:00 PM', available: true },
  { time: '04:30 PM', available: true }
];

const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointmentInfo, setAppointmentInfo] = useState({
    patientName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    reason: '',
    symptoms: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    preferredLanguage: 'English',
    emergencyContact: '',
    insuranceProvider: ''
  });

  const specialties = [
    { name: 'Cardiology', icon: Heart, description: 'Heart and cardiovascular system' },
    { name: 'Neurology', icon: Activity, description: 'Brain and nervous system' },
    { name: 'Pediatrics', icon: User, description: 'Children\'s healthcare' },
    { name: 'Orthopedics', icon: Shield, description: 'Bones, joints, and muscles' },
    { name: 'Dermatology', icon: User, description: 'Skin, hair, and nails' }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date) => {
    if (!selectedDoctor) return false;
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && selectedDoctor.availability.includes(dayName);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleSchedule = () => {
    console.log('Appointment Scheduled:', {
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      patient: appointmentInfo
    });
    
    alert('Appointment scheduled successfully! You will receive a confirmation email shortly.');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedSpecialty('');
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime('');
    setAppointmentInfo({
      patientName: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      reason: '',
      symptoms: '',
      medicalHistory: '',
      allergies: '',
      currentMedications: '',
      preferredLanguage: 'English',
      emergencyContact: '',
      insuranceProvider: ''
    });
  };

  const filteredDoctors = selectedSpecialty 
    ? doctors.filter(doctor => doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase()))
    : doctors;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Schedule Appointment</h2>
              <p className="text-gray-600">Book your consultation with our expert doctors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Select Specialty', icon: Stethoscope },
              { step: 2, title: 'Choose Doctor', icon: User },
              { step: 3, title: 'Date & Time', icon: Calendar },
              { step: 4, title: 'Patient Details', icon: Phone },
              { step: 5, title: 'Confirmation', icon: CheckCircle }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= item.step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= item.step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {item.title}
                </span>
                {index < 4 && (
                  <div className={`w-12 h-1 mx-3 ${
                    currentStep > item.step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* Step 1: Select Specialty */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Select Medical Specialty</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specialties.map((specialty) => (
                  <div
                    key={specialty.name}
                    onClick={() => setSelectedSpecialty(specialty.name)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedSpecialty === specialty.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        selectedSpecialty === specialty.name ? 'bg-blue-500' : 'bg-gray-100'
                      }`}>
                        <specialty.icon className={`h-8 w-8 ${
                          selectedSpecialty === specialty.name ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{specialty.name}</h4>
                      <p className="text-sm text-gray-600">{specialty.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Doctor */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Choose Your Doctor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedDoctor?.id === doctor.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg">{doctor.name}</h4>
                        <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                        <p className="text-sm text-gray-600 mb-2">{doctor.experience}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{doctor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{doctor.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">${doctor.consultationFee}</span>
                          <span className="text-sm text-gray-500">Consultation Fee</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Select Date & Time</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {getDaysInMonth(currentMonth).map((date, index) => (
                      <div key={index} className="aspect-square">
                        {date && (
                          <button
                            onClick={() => isDateAvailable(date) && setSelectedDate(date)}
                            disabled={!isDateAvailable(date)}
                            className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 ${
                              selectedDate?.toDateString() === date.toDateString()
                                ? 'bg-blue-600 text-white'
                                : isDateAvailable(date)
                                ? 'bg-white text-gray-900 hover:bg-blue-100 border border-gray-200'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h4>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`p-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedTime === slot.time
                              ? 'bg-blue-600 text-white'
                              : slot.available
                              ? 'bg-white border border-gray-200 text-gray-900 hover:bg-blue-50'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Please select a date to view available time slots</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Patient Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={appointmentInfo.patientName}
                    onChange={(e) => setAppointmentInfo({ ...appointmentInfo, patientName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={appointmentInfo.email}
                    onChange={(e) => setAppointmentInfo({ ...appointmentInfo, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={appointmentInfo.phone}
                    onChange={(e) => setAppointmentInfo({ ...appointmentInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={appointmentInfo.age}
                    onChange={(e) => setAppointmentInfo({ ...appointmentInfo, age: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={appointmentInfo.gender}
                    onChange={(e) => setAppointmentInfo({ ...appointmentInfo, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    value={appointmentInfo.emergencyContact}
                    onChange={(e) => setAppointmentInfo({ ...appointmentInfo, emergencyContact: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Emergency contact number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit *
                  </label>
                  <textarea
                    value={appointmentInfo.reason}
                    onChange={(e) => setAppointmentInfo({ ...appointmentInfo, reason: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Briefly describe your symptoms or reason for the visit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    value={appointmentInfo.currentMedications}
                    onChange={(e) => setAppointmentInfo({ ...appointmentInfo, currentMedications: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List any medications you're currently taking"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies
                  </label>
                  <textarea
                    value={appointmentInfo.allergies}
                    onChange={(e) => setAppointmentInfo({ ...appointmentInfo, allergies: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List any known allergies"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Your Appointment</h3>
              
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                {/* Doctor Information */}
                <div className="flex items-start gap-4">
                  <img
                    src={selectedDoctor?.image}
                    alt={selectedDoctor?.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{selectedDoctor?.name}</h4>
                    <p className="text-blue-600 font-medium">{selectedDoctor?.specialty}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor?.location}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{selectedDoctor?.rating}</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">${selectedDoctor?.consultationFee}</span>
                    </div>
                  </div>
                </div>
                
                {/* Appointment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Appointment Details</h5>
                    <div className="space-y-2 text-sm">
                      <div><strong>Date:</strong> {selectedDate?.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</div>
                      <div><strong>Time:</strong> {selectedTime}</div>
                      <div><strong>Specialty:</strong> {selectedSpecialty}</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Patient Information</h5>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {appointmentInfo.patientName}</div>
                      <div><strong>Age:</strong> {appointmentInfo.age} years</div>
                      <div><strong>Phone:</strong> {appointmentInfo.phone}</div>
                      <div><strong>Email:</strong> {appointmentInfo.email}</div>
                    </div>
                  </div>
                </div>
                
                {/* Medical Information */}
                {appointmentInfo.reason && (
                  <div className="pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-2">Medical Information</h5>
                    <div className="space-y-2 text-sm">
                      <div><strong>Reason for Visit:</strong> {appointmentInfo.reason}</div>
                      {appointmentInfo.currentMedications && (
                        <div><strong>Current Medications:</strong> {appointmentInfo.currentMedications}</div>
                      )}
                      {appointmentInfo.allergies && (
                        <div><strong>Allergies:</strong> {appointmentInfo.allergies}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Important Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important Information:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Please arrive 15 minutes before your appointment</li>
                      <li>• Bring a valid ID and insurance card</li>
                      <li>• You will receive a confirmation email with appointment details</li>
                      <li>• Cancellations must be made at least 24 hours in advance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button
            onClick={() => {
              if (currentStep === 1 && selectedSpecialty) {
                setCurrentStep(2);
              } else if (currentStep === 2 && selectedDoctor) {
                setCurrentStep(3);
              } else if (currentStep === 3 && selectedDate && selectedTime) {
                setCurrentStep(4);
              } else if (currentStep === 4 && appointmentInfo.patientName && appointmentInfo.email && appointmentInfo.phone && appointmentInfo.age && appointmentInfo.gender && appointmentInfo.reason) {
                setCurrentStep(5);
              } else if (currentStep === 5) {
                handleSchedule();
              }
            }}
            disabled={
              (currentStep === 1 && !selectedSpecialty) ||
              (currentStep === 2 && !selectedDoctor) ||
              (currentStep === 3 && (!selectedDate || !selectedTime)) ||
              (currentStep === 4 && (!appointmentInfo.patientName || !appointmentInfo.email || !appointmentInfo.phone || !appointmentInfo.age || !appointmentInfo.gender || !appointmentInfo.reason))
            }
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {currentStep === 5 ? 'Confirm Appointment' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppointmentModal;