import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Stethoscope,
  MapPin,
  Star
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
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentModalProps {
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
    location: 'Main Hospital - Floor 3'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    experience: '12+ years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    location: 'Neurology Center - Floor 2'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    experience: '10+ years',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    location: 'Children\'s Wing - Floor 1'
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedic Surgeon',
    experience: '18+ years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    location: 'Orthopedic Center - Floor 4'
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

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    reason: ''
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
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

  const handleBooking = () => {
    // Here you would typically send the booking data to your backend
    console.log('Booking Details:', {
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      patient: patientInfo
    });
    
    // Show success message and close modal
    alert('Appointment booked successfully! You will receive a confirmation email shortly.');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime('');
    setPatientInfo({ name: '', email: '', phone: '', reason: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
              <p className="text-gray-600">Schedule your visit with our expert doctors</p>
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
              { step: 1, title: 'Select Doctor', icon: User },
              { step: 2, title: 'Choose Date & Time', icon: Calendar },
              { step: 3, title: 'Patient Details', icon: Phone },
              { step: 4, title: 'Confirmation', icon: Check }
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
                {index < 3 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > item.step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* Step 1: Select Doctor */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Select a Doctor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedDoctor?.id === doctor.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                        <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                        <p className="text-sm text-gray-600">{doctor.experience}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{doctor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{doctor.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Date & Time */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Choose Date & Time</h3>
              
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
              {selectedDate && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
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
                </div>
              )}
            </div>
          )}

          {/* Step 3: Patient Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
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
                    value={patientInfo.email}
                    onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
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
                    value={patientInfo.phone}
                    onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit
                  </label>
                  <textarea
                    value={patientInfo.reason}
                    onChange={(e) => setPatientInfo({ ...patientInfo, reason: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Briefly describe your symptoms or reason for the visit"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Your Appointment</h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={selectedDoctor?.image}
                    alt={selectedDoctor?.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedDoctor?.name}</h4>
                    <p className="text-blue-600">{selectedDoctor?.specialty}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor?.location}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">
                      {selectedDate?.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold text-gray-900">{selectedTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Patient</p>
                    <p className="font-semibold text-gray-900">{patientInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-semibold text-gray-900">{patientInfo.phone}</p>
                  </div>
                </div>
                
                {patientInfo.reason && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Reason for Visit</p>
                    <p className="text-gray-900">{patientInfo.reason}</p>
                  </div>
                )}
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
              if (currentStep === 1 && selectedDoctor) {
                setCurrentStep(2);
              } else if (currentStep === 2 && selectedDate && selectedTime) {
                setCurrentStep(3);
              } else if (currentStep === 3 && patientInfo.name && patientInfo.email && patientInfo.phone) {
                setCurrentStep(4);
              } else if (currentStep === 4) {
                handleBooking();
              }
            }}
            disabled={
              (currentStep === 1 && !selectedDoctor) ||
              (currentStep === 2 && (!selectedDate || !selectedTime)) ||
              (currentStep === 3 && (!patientInfo.name || !patientInfo.email || !patientInfo.phone))
            }
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {currentStep === 4 ? 'Book Appointment' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;