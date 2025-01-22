import React, { useState, useRef, useEffect } from "react";
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
    <nav className="bg-[#eef6f7] shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-semibold text-[#2c3e50] hover:text-[#1abc9c]"
        >
          She-Shield
        </Link>

        {/* Menu */}
        <div>
          {!user ? (
            <div className="flex space-x-4">
              <Link to="/login" className="text-[#2c3e50] hover:text-[#1abc9c]">
                Login
              </Link>
              <Link
                to="/register"
                className="text-[#2c3e50] hover:text-[#1abc9c]"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-4">
                <Link
                  to="/forum"
                  className="text-[#2c3e50] hover:text-[#1abc9c]"
                >
                  Forum
                </Link>
                <Link
                  to="/training"
                  className="text-[#2c3e50] hover:text-[#1abc9c]"
                >
                  Training
                </Link>
                <Link
                  to="/complaints"
                  className="text-[#2c3e50] hover:text-[#1abc9c]"
                >
                  Complaints
                </Link>
                {/* User Icon */}
                <button
                  onClick={handleDropdownToggle}
                  className="focus:outline-none"
                >
                  <img
                    src="https://via.placeholder.com/40" // Replace with a valid image URL
                    alt="User"
                    className="w-9 h-9 rounded-full border-2 border-[#1abc9c]"
                  />
                </button>
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-2">
                    <p className="px-4 py-2 text-sm text-[#34495e] border-b border-gray-200 capitalize">
                      User: {user.username}
                    </p>
                    <p className="px-4 py-2 text-sm text-[#34495e] border-b border-gray-200">
                      e-mail: {user.email}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-left bg-[#34495e] w-full text-sm text-white hover:bg-[#529ba5]"
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
