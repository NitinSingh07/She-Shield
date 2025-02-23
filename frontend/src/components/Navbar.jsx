import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";

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
    <nav className="bg-white border-b-4 border-black shadow-[0px_4px_0px_0px_#FF1493] fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-2">
        <Link
          to="/"
          className="transform hover:scale-105 transition-transform duration-300"
        >
          <img
            className="w-40 h-13 shadow-[4px_4px_0px_0px_#FF1493] rounded-xl border-2 border-black p-1"
            src="/logo.png"
            alt="She-Shield"
          />
        </Link>

        <div className="relative">
          {!user ? (
            <div className="flex space-x-6">
              <Link
                to="/login"
                className="text-[#FF1493] font-bold hover:text-black transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#FF1493] text-white px-6 py-2 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-6">
                {[
                  "Help",
                  "Emergency",
                  "Post Forums",
                  "Report Incident",
                  "About Us",
                  "Contact Us",
                ].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase().replace(" ", "")}`}
                    className="text-[#FF1493] font-bold hover:text-black transition duration-300 transform hover:scale-105"
                  >
                    {item}
                  </Link>
                ))}

                <div className="relative inline-block">
                  <button
                    onClick={handleDropdownToggle}
                    className="focus:outline-none group transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#FF1493] overflow-hidden">
                      <img
                        src="/user.png"
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>

                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-64 bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493]"
                      style={{
                        zIndex: 1000,
                        minWidth: "250px",
                        transformOrigin: "top right",
                      }}
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex items-center space-x-3 pb-3 border-b-2 border-black">
                          <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden">
                            <img
                              src="/user.png"
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-black capitalize">
                              {user.username}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* <div className="space-y-2"> */}
                        {/* <button
                            onClick={() => {
                              navigate("/profile");
                              setDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                          >
                            👤 View Profile
                          </button>
                          <button
                            onClick={() => {
                              navigate("/settings");
                              setDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                          >
                            ⚙️ Settings
                          </button>
                        </div> */}

                        <button
                          onClick={handleLogout}
                          className="w-full bg-[#FF1493] text-white px-4 py-2 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200 mt-2"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
