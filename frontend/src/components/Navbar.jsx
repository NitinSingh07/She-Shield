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
    <nav className="bg-blue-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold hover:text-gray-300">
          Women Safety Hub
        </Link>
        <div>
          {!user ? (
            <>
              <Link to="/login" className="text-white mr-4 hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-gray-300">
                Register
              </Link>
            </>
          ) : (
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <div className="flex space-x-4">
                <Link to="/forum" className="text-white hover:text-gray-300">
                  Forum
                </Link>
                <Link to="/training" className="text-white hover:text-gray-300">
                  Training
                </Link>
                <Link to="/complaints" className="text-white hover:text-gray-300">
                  Complaints
                </Link>
                <button onClick={handleDropdownToggle} className="text-white focus:outline-none">
                  <img
                    src="/path/to/user-icon.png"
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                </button>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-2">
                    <p className="px-4 py-2 text-gray-800 border-b border-gray-200">{user.username}</p>
                    <p className="px-4 py-2 text-gray-800 border-b border-gray-200">{user.email}</p>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
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
