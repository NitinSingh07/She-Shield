import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home after logout
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-br from-yellow-300 via-red-500 to-orange-300 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-gray-200 transition duration-300"
        >
          <img className="w-40 h-13" src="/logo.png" alt="" />
        </Link>

        {/* Menu */}
        <div>
          {!user ? (
            <div className="flex space-x-6">
              <Link
                to="/login"
                className="text-white font-medium hover:text-gray-200 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-[#1abc9c] px-4 py-2 rounded-full font-semibold shadow-md hover:bg-gray-200 transition duration-300"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-6">
                <Link
                  to="/help"
                  className="text-white font-medium hover:text-gray-200 transition duration-300"
                >
                  Help
                </Link>
                <Link
                  to="/emergency"
                  className="text-white font-medium hover:text-gray-200 transition duration-300"
                >
                  Emergency
                </Link>
                {/* <Link
                  to="/forum"
                  className="text-white font-medium hover:text-gray-200 transition duration-300"
                >
                  Post Forum
                </Link> */}
                <Link
                  to="/training"
                  className="text-white font-medium hover:text-gray-200 transition duration-300"
                >
                  Post Module
                </Link>
                <Link
                  to="/complaints"
                  className="text-white font-medium hover:text-gray-200 transition duration-300"
                >
                  Report Incident
                </Link>
                <Link
                  to="/about"
                  className="text-white font-medium hover:text-gray-200 transition duration-300"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="text-white font-medium hover:text-gray-200 transition duration-300"
                >
                  Contact Us
                </Link>

                {/* User Icon */}
                <button
                  onClick={handleDropdownToggle}
                  className="focus:outline-none relative group"
                >
                  <img
                    src="/user.png"
                    alt="User"
                    className="w-11 h-10 rounded-full border-2 border-white shadow-md"
                  />
                  <span className="absolute top-0 right-0 w-3 h-3 bg-[#e74c3c] rounded-full border-2 border-white"></span>
                </button>
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-xl shadow-lg z-10 overflow-hidden animate-fade-in">
                  <div className="py-2">
                    <p className="px-4 py-2 text-sm text-gray-700 font-medium border-b border-gray-200 capitalize">
                      👤 {user.username}
                    </p>
                    <p className="px-4 py-2 text-sm text-gray-700 font-medium border-b border-gray-200">
                      ✉️ {user.email}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-left text-white font-semibold bg-[#e74c3c] hover:bg-[#c0392b] transition duration-300 w-full"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
