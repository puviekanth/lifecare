import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-100 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-blue-600 font-bold text-xl">LifeCare</div>
          <span className="text-sm text-gray-600">Channeling Services</span>
        </div>

        {/* Navigation Links */}
        <div className="space-x-4 hidden md:flex">
          <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="/completed-prescriptions" className="text-gray-700 hover:text-blue-600">Completed Prescriptions</a>
        </div>

        {/* Mobile Menu (Optional - Keep Simple) */}
        <div className="md:hidden">
          <span>Menu</span> {/* Placeholder - Add toggle if needed later */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;