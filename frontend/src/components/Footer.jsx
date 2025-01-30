import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2c3e50] text-white py-12 mt-12">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
        {/* 1️⃣ Brand Section */}
        <div>
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-gray-200 transition duration-300"
          >
            <img className="w-40 h-13" src="/logo.png" alt="" />
          </Link>{" "}
          <p className="text-lg mt-3 text-[#e0e0e0]">
            Empowering Women, Protecting Future
          </p>
          <div className="mt-4 flex justify-center md:justify-start space-x-4 text-xl">
            <a
              href="https://www.facebook.com/SheShield"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e67e22] transition-all"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com/SheShield"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e67e22] transition-all"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/SheShield"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e67e22] transition-all"
            >
              <FaInstagram />
            </a>
            <a
              href="mailto:support@sheshield.com"
              className="hover:text-[#e67e22] transition-all"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* 2️⃣ Quick Links Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-[#dcdcdc]">
            <li>
              <Link to="/" className="hover:text-white transition">
                🏠 Home
              </Link>
            </li>
            <li>
              <Link to="/complaints" className="hover:text-white transition">
                📝 Complaints
              </Link>
            </li>
            <li>
              <Link to="/training" className="hover:text-white transition">
                📚 Training
              </Link>
            </li>
            <li>
              <Link to="/forum" className="hover:text-white transition">
                💬 Forum
              </Link>
            </li>
            <li>
              <Link to="/emergency" className="hover:text-white transition">
                🚨 Emergency
              </Link>
            </li>
          </ul>
        </div>

        {/* 3️⃣ Contact Info Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <p className="flex items-center justify-center md:justify-start gap-2 text-[#dcdcdc]">
            <FaMapMarkerAlt className="text-[#e67e22]" /> 123, Safe Street,
            India
          </p>
          <p className="flex items-center justify-center md:justify-start gap-2 mt-2 text-[#dcdcdc]">
            <FaPhoneAlt className="text-[#e67e22]" /> +91 98765 43210
          </p>
          <p className="flex items-center justify-center md:justify-start gap-2 mt-2 text-[#dcdcdc]">
            <FaEnvelope className="text-[#e67e22]" /> support@sheshield.com
          </p>
        </div>
      </div>

      {/* 4️⃣ Copyright Section */}
      <div className="mt-8 text-center text-[#dcdcdc] text-sm">
        &copy; {new Date().getFullYear()} She-Shield. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
