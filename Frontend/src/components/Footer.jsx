// src/components/Footer.jsx
import { FiPhone, FiMail, FiMapPin, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-blue-100 mt-12">
      <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white text-blue-800 font-bold px-3 py-2 rounded-md text-sm shadow-md">LC</div>
            <h2 className="text-lg font-semibold">Life Care Channeling Services</h2>
          </div>
          <p className="text-sm mb-2 text-blue-200">
            Providing comprehensive healthcare management solutions with advanced medicine product management systems for healthcare providers and pharmacies.
          </p>
          <p className="flex items-center text-sm text-red-400 gap-2 mt-2">
            <FiHeart /> Caring for your health management needs
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3 text-white">QUICK LINKS</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#" className="text-blue-300 hover:text-yellow-300 transition">Dashboard</a></li>
            <li><a href="#" className="text-blue-300 hover:text-yellow-300 transition">Medicine Management</a></li>
            <li><a href="#" className="text-blue-300 hover:text-yellow-300 transition">Inventory Reports</a></li>
            <li><a href="#" className="text-blue-300 hover:text-yellow-300 transition">Supplier Management</a></li>
            <li><a href="#" className="text-blue-300 hover:text-yellow-300 transition">System Settings</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-3 text-white">CONTACT INFO</h3>
          <ul className="text-sm space-y-2 text-blue-200">
            <li className="flex items-center gap-2"><FiPhone /> +94 11 234 5678</li>
            <li className="flex items-center gap-2"><FiMail /> admin@lifecare.lk</li>
            <li className="flex items-center gap-2"><FiMapPin /> 123 Healthcare Avenue, Colombo 03, Sri Lanka</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blue-800 py-4 px-6 text-center text-xs text-blue-300 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
          <p>© 2025 Life Care Channeling Services. All rights reserved.</p>
          <p className="text-center">Medicine Product Management System v2.1.0 | Last updated: 6/23/2025</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#" className="hover:underline hover:text-yellow-300">Privacy Policy</a>
            <a href="#" className="hover:underline hover:text-yellow-300">Terms of Service</a>
            <a href="#" className="hover:underline hover:text-yellow-300">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
