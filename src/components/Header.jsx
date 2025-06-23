import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiBell, FiMenu, FiX } from 'react-icons/fi';
import logo from '../assets/images/logo.png';


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Life Care Logo"
            className="w-10 h-10 object-contain rounded-md shadow-sm bg-white p-1"
          />
          <div>
            <h1 className="font-semibold text-lg leading-tight">Life Care</h1>
            <p className="text-xs text-gray-200 -mt-1">Channeling Services</p>
          </div>
        </div>

        {/* Hamburger icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-yellow-300 border-b-2 border-yellow-300 pb-1'
                : 'text-white hover:text-yellow-200 transition'
            }
          >
            Medicine Management
          </NavLink>
          <NavLink to="/inventory" className="text-white hover:text-yellow-200 transition">
            Inventory
          </NavLink>
          <NavLink to="/suppliers" className="text-white hover:text-yellow-200 transition">
            Suppliers
          </NavLink>
          <NavLink to="/reports" className="text-white hover:text-yellow-200 transition">
            Reports
          </NavLink>
        </nav>

        {/* Right Side Icons - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <FiBell className="text-xl text-white" />
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-800 text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow-sm">
              3
            </span>
          </div>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold shadow-inner">
            A
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4">
          <nav className="flex flex-col gap-4 text-sm font-medium bg-blue-900 rounded-md p-4 shadow-md">
            <NavLink
              to="/"
              onClick={toggleMenu}
              className={({ isActive }) =>
                isActive
                  ? 'text-yellow-300 border-l-4 border-yellow-300 pl-2'
                  : 'text-white hover:text-yellow-200 transition pl-2'
              }
            >
              Medicine Management
            </NavLink>
            <NavLink to="/inventory" onClick={toggleMenu} className="text-white hover:text-yellow-200 pl-2">
              Inventory
            </NavLink>
            <NavLink to="/suppliers" onClick={toggleMenu} className="text-white hover:text-yellow-200 pl-2">
              Suppliers
            </NavLink>
            <NavLink to="/reports" onClick={toggleMenu} className="text-white hover:text-yellow-200 pl-2">
              Reports
            </NavLink>

            <div className="flex justify-between items-center pt-4 border-t border-blue-800 mt-4">
              <div className="flex gap-2 items-center text-white">
                <FiBell className="text-lg" />
                <span className="text-xs bg-yellow-400 text-blue-800 px-2 py-1 rounded-full font-semibold">3</span>
              </div>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold shadow-inner">
                A
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
