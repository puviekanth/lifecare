import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  Phone, 
  Calendar,
  ChevronDown,
  Stethoscope,
  Users,
  Award,
  MessageCircle
} from 'lucide-react';

interface NavbarProps {
  className?: string;
  onBookAppointment: () => void;
  onNavigateToInventory?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ className = '', onBookAppointment, onNavigateToInventory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { 
      name: 'Home', 
      href: '#home',
      icon: null
    },
    { 
      name: 'Services', 
      href: '#services',
      icon: Stethoscope,
      dropdown: [
        { name: 'Doctor Channeling', href: '#channeling' },
        { name: 'Health Monitoring', href: '#monitoring' },
        { name: 'Patient Management', href: '#management' },
        { name: 'Telemedicine', href: '#telemedicine' },
        { name: 'Inventory Management', href: '#inventory', onClick: onNavigateToInventory }
      ]
    },
    { 
      name: 'Doctors', 
      href: '#doctors',
      icon: Users
    },
    { 
      name: 'About', 
      href: '#about',
      icon: Award
    },
    { 
      name: 'Contact', 
      href: '#contact',
      icon: MessageCircle
    }
  ];

  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-transparent'
    } ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className={`relative p-2 rounded-xl transition-all duration-300 ${
              isScrolled 
                ? 'bg-blue-600 group-hover:bg-blue-700' 
                : 'bg-white/20 backdrop-blur-sm group-hover:bg-white/30'
            }`}>
              <Heart className={`h-7 w-7 transition-colors duration-300 ${
                isScrolled ? 'text-white' : 'text-white'
              }`} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                LifeCare
              </h1>
              <p className={`text-sm transition-colors duration-300 ${
                isScrolled ? 'text-blue-600' : 'text-blue-200'
              }`}>
                Channeling Services
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <a
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-white hover:text-yellow-400 hover:bg-white/10'
                  }`}
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                  {item.dropdown && (
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${
                      activeDropdown === item.name ? 'rotate-180' : ''
                    }`} />
                  )}
                </a>

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 transform transition-all duration-300 ${
                    activeDropdown === item.name 
                      ? 'opacity-100 visible translate-y-0' 
                      : 'opacity-0 invisible -translate-y-2'
                  }`}
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}>
                    {item.dropdown.map((dropdownItem) => (
                      <a
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        onClick={dropdownItem.onClick}
                        className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                      >
                        {dropdownItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isScrolled
                ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                : 'text-white hover:text-yellow-400 hover:bg-white/10'
            }`}>
              <Phone className="h-4 w-4" />
              <span>+94 (77) 226-9895</span>
            </button>
            
            <button 
              onClick={onBookAppointment}
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl mx-4 mb-4 shadow-xl border border-gray-100">
            <div className="p-6 space-y-4">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <a
                    href={item.href}
                    className="flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                    onClick={() => item.dropdown && toggleDropdown(item.name)}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="font-medium">{item.name}</span>
                    {item.dropdown && (
                      <ChevronDown className={`h-4 w-4 ml-auto transition-transform duration-300 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    )}
                  </a>
                  
                  {item.dropdown && (
                    <div className={`ml-8 mt-2 space-y-2 transition-all duration-300 ${
                      activeDropdown === item.name ? 'block' : 'hidden'
                    }`}>
                      {item.dropdown.map((dropdownItem) => (
                        <a
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          onClick={dropdownItem.onClick}
                          className="block p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                        >
                          {dropdownItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                  <Phone className="h-5 w-5" />
                  <span>+94 (77) 226-9895</span>
                </button>
                
                <button 
                  onClick={onBookAppointment}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;