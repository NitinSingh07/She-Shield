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
import { motion } from "framer-motion";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: <FaFacebookF />,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: <FaTwitter />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: <FaInstagram />,
  },
];

const quickLinks = [
  {
    name: "Home",
    href: "/",
    icon: "🏠",
  },
  {
    name: "Complaints",
    href: "/complaints",
    icon: "📝",
  },
  {
    name: "Training",
    href: "/training",
    icon: "📚",
  },
  {
    name: "Forum",
    href: "/forum",
    icon: "💬",
  },
  {
    name: "Emergency",
    href: "/emergency",
    icon: "🚨",
  },
];

const contactInfo = [
  {
    icon: <FaMapMarkerAlt />,
    text: "123, Safe Street, India",
  },
  {
    icon: <FaPhoneAlt />,
    text: "+91 98765 43210",
  },
  {
    icon: <FaEnvelope />,
    text: "support@sheshield.com",
  },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t-4 border-black mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt="She-Shield"
                className="h-12 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#FF1493]"
              />
            </Link>
            <p className="text-gray-600 font-mono">
              Empowering women through technology
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#FF1493] 
                           flex items-center justify-center hover:shadow-none 
                           transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-bold text-xl mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-600 hover:text-[#FF1493] transition-colors"
                >
                  {link.icon} {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493]"
          >
            <h3 className="font-bold text-xl mb-4">Contact Us</h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center bg-[#FF1493] text-white">
                    {info.icon}
                  </div>
                  <span className="text-gray-600">{info.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t-2 border-black text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} She-Shield. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
