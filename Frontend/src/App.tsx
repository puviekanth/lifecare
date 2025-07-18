import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AppointmentModal from './components/AppointmentModal';
import UploadPrescriptionModal from './components/UploadPrescriptionModal';
import ScheduleAppointmentModal from './components/ScheduleAppointmentModal';
import InventoryDashboard from './components/InventoryDashboard';
import PrescriptionVerification from './components/PrescriptionVerification';
import BookVisitVerification from './components/BookVisitVerification';
import { 
  Heart, 
  Calendar, 
  Users, 
  Clock, 
  Shield, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  ChevronRight,
  Play,
  CheckCircle,
  Stethoscope,
  Activity,
  UserCheck,
  Building2,
  ArrowRight,
  Quote
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image: string;
  availability: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

const services: Service[] = [
  {
    id: '1',
    title: 'Doctor Channeling',
    description: 'Book appointments with specialist doctors across multiple medical fields',
    icon: Stethoscope,
    features: ['Online Booking', 'Instant Confirmation', 'Reminder Notifications', 'Flexible Scheduling']
  },
  {
    id: '2',
    title: 'Health Monitoring',
    description: 'Comprehensive health tracking and monitoring services',
    icon: Activity,
    features: ['Vital Signs Tracking', 'Health Reports', 'Trend Analysis', 'Emergency Alerts']
  },
  {
    id: '3',
    title: 'Patient Management',
    description: 'Complete patient record management and care coordination',
    icon: UserCheck,
    features: ['Digital Records', 'Care Plans', 'Medication Tracking', 'Family Access']
  },
  {
    id: '4',
    title: 'Telemedicine',
    description: 'Remote consultations and virtual healthcare services',
    icon: Building2,
    features: ['Video Consultations', 'Digital Prescriptions', 'Follow-up Care', '24/7 Support']
  }
];

const featuredDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    experience: '15+ years',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: 'Available Today'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    experience: '12+ years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: 'Available Tomorrow'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    experience: '10+ years',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: 'Available Today'
  }
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Santos',
    role: 'Patient',
    content: 'LifeCare has transformed how I manage my family\'s healthcare. The online booking system is so convenient, and the doctors are exceptional.',
    rating: 5,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '2',
    name: 'James Wilson',
    role: 'Regular Patient',
    content: 'The telemedicine service saved me so much time. I can consult with my doctor from home and get prescriptions digitally.',
    rating: 5,
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '3',
    name: 'Dr. Amanda Lee',
    role: 'Healthcare Partner',
    content: 'As a healthcare provider, LifeCare\'s platform has streamlined our patient management and improved care coordination significantly.',
    rating: 5,
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  }
];

function App() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isUploadPrescriptionModalOpen, setIsUploadPrescriptionModalOpen] = useState(false);
  const [isScheduleAppointmentModalOpen, setIsScheduleAppointmentModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'inventory', 'prescription-verification', 'visit-verification'

  const openAppointmentModal = () => {
    setIsAppointmentModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
  };

  const openUploadPrescriptionModal = () => {
    setIsUploadPrescriptionModalOpen(true);
  };

  const closeUploadPrescriptionModal = () => {
    setIsUploadPrescriptionModalOpen(false);
  };

  const openScheduleAppointmentModal = () => {
    setIsScheduleAppointmentModalOpen(true);
  };

  const closeScheduleAppointmentModal = () => {
    setIsScheduleAppointmentModalOpen(false);
  };

  if (currentPage === 'prescription-verification') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Verification Navigation */}
        <nav className="bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
                  <div className="bg-white p-2 rounded-lg">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">Life Care</h1>
                    <p className="text-xs text-blue-200">Channeling Services</p>
                  </div>
                </div>
                
                <div className="hidden md:flex space-x-8">
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="text-blue-200 hover:text-white transition-colors duration-200"
                  >
                    Home
                  </button>
                  <button className="bg-blue-500 px-4 py-2 rounded-lg font-medium">
                    Prescription Verification
                  </button>
                  <button 
                    onClick={() => setCurrentPage('visit-verification')}
                    className="text-blue-200 hover:text-white transition-colors duration-200"
                  >
                    Visit Verification
                  </button>
                  <button 
                    onClick={() => setCurrentPage('inventory')}
                    className="text-blue-200 hover:text-white transition-colors duration-200"
                  >
                    Inventory
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">U</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        <PrescriptionVerification onUploadPrescription={openUploadPrescriptionModal} />
      </div>
    );
  }

  if (currentPage === 'visit-verification') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Verification Navigation */}
        <nav className="bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
                  <div className="bg-white p-2 rounded-lg">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">Life Care</h1>
                    <p className="text-xs text-blue-200">Channeling Services</p>
                  </div>
                </div>
                
                <div className="hidden md:flex space-x-8">
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="text-blue-200 hover:text-white transition-colors duration-200"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => setCurrentPage('prescription-verification')}
                    className="text-blue-200 hover:text-white transition-colors duration-200"
                  >
                    Prescription Verification
                  </button>
                  <button className="bg-blue-500 px-4 py-2 rounded-lg font-medium">
                    Visit Verification
                  </button>
                  <button 
                    onClick={() => setCurrentPage('inventory')}
                    className="text-blue-200 hover:text-white transition-colors duration-200"
                  >
                    Inventory
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">U</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        <BookVisitVerification onScheduleAppointment={openScheduleAppointmentModal} />
      </div>
    );
  }

  if (currentPage === 'inventory') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Inventory Navigation */}
        <nav className="bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
                  <div className="bg-white p-2 rounded-lg">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">Life Care</h1>
                    <p className="text-xs text-blue-200">Channeling Services</p>
                  </div>
                </div>
                
                <div className="hidden md:flex space-x-8">
                  <button className="text-blue-200 hover:text-white transition-colors duration-200">
                    Medicine Management
                  </button>
                  <button className="bg-blue-500 px-4 py-2 rounded-lg font-medium">
                    Inventory
                  </button>
                  <button className="text-blue-200 hover:text-white transition-colors duration-200">
                    Suppliers
                  </button>
                  <button className="text-blue-200 hover:text-white transition-colors duration-200">
                    Reports
                  </button>
                  <button 
                    onClick={() => setCurrentPage('prescription-verification')}
                    className="text-blue-200 hover:text-white transition-colors duration-200"
                  >
                    Prescription Verification
                  </button>
                  <button 
                    onClick={() => setCurrentPage('visit-verification')}
                    className="text-blue-200 hover:text-white transition-colors duration-200"
                  >
                    Visit Verification
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="bg-yellow-400 text-blue-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">U</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        <InventoryDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onBookAppointment={openAppointmentModal} 
        onNavigateToInventory={() => setCurrentPage('inventory')}
        onNavigateToPrescriptionVerification={() => setCurrentPage('prescription-verification')}
        onNavigateToVisitVerification={() => setCurrentPage('visit-verification')}
      />
      
      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-32 pt-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Your Health,
                  <span className="text-yellow-400"> Our Priority</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Experience world-class healthcare with LifeCare's comprehensive channeling services. 
                  Connect with top specialists, manage your health records, and access care anytime, anywhere.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={openAppointmentModal}
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Book Appointment
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Watch Demo
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">500+</div>
                  <div className="text-blue-200">Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">50K+</div>
                  <div className="text-blue-200">Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">24/7</div>
                  <div className="text-blue-200">Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 border border-white border-opacity-20">
                <img
                  src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                  alt="Healthcare Professional"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-blue-900 p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-semibold">Trusted Care</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Healthcare Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare solutions designed to meet all your medical needs with convenience and excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors duration-300">
                  <service.icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="mt-6 text-blue-600 font-semibold flex items-center gap-2 group-hover:text-blue-700 transition-colors duration-300">
                  Learn More
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section id="doctors" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Doctors</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team of experienced healthcare professionals is dedicated to providing you with the best medical care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {doctor.availability}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{doctor.specialty}</p>
                  <p className="text-gray-600 mb-4">{doctor.experience} experience</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(doctor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">{doctor.rating}</span>
                    </div>
                    <button 
                      onClick={openAppointmentModal}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300 flex items-center gap-2 mx-auto">
              View All Doctors
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="about" className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose LifeCare?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We're committed to providing exceptional healthcare services with cutting-edge technology and compassionate care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Secure & Private', description: 'Your health data is protected with enterprise-grade security' },
              { icon: Clock, title: '24/7 Availability', description: 'Round-the-clock access to healthcare services and support' },
              { icon: Award, title: 'Certified Professionals', description: 'All our doctors are board-certified specialists' },
              { icon: Users, title: 'Patient-Centered', description: 'Personalized care tailored to your unique needs' }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real patients who have experienced the LifeCare difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-2xl p-8 relative">
                <Quote className="h-8 w-8 text-blue-200 mb-4" />
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience Better Healthcare?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust LifeCare for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={openAppointmentModal}
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Started Today
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">LifeCare</h3>
                  <p className="text-sm text-gray-400">Channeling Services</p>
                </div>
              </div>
              <p className="text-gray-400">
                Providing exceptional healthcare services with compassion, innovation, and excellence.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Doctor Channeling</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Health Monitoring</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Patient Management</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Telemedicine</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors duration-300">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Our Doctors</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Appointments</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Contact</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span>info@lifecare.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span>123 Healthcare Ave, Medical City</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LifeCare Channeling Services. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Appointment Modal */}
      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={closeAppointmentModal} 
      />

      {/* Upload Prescription Modal */}
      <UploadPrescriptionModal 
        isOpen={isUploadPrescriptionModalOpen} 
        onClose={closeUploadPrescriptionModal} 
      />

      {/* Schedule Appointment Modal */}
      <ScheduleAppointmentModal 
        isOpen={isScheduleAppointmentModalOpen} 
        onClose={closeScheduleAppointmentModal} 
      />
    </div>
  );
}

export default App;