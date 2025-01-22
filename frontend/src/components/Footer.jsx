import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#507b80] text-white py-10 mt-12">
      <div className="container mx-auto text-center">
        {/* Header Section */}
        <div className="mb-6">
          <h3 className="text-4xl font-extrabold text-white">She-Shield</h3>
          <p className="text-lg mt-3 text-[#e0e0e0]">
            Empowering Women, Protecting Future
          </p>
        </div>

        {/* Social Links Section */}
        <div className="flex justify-center gap-10 mb-6 text-xl">
          <a
            href="https://www.facebook.com/SheShield"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e67e22] transition-all"
          >
            <i className="fab fa-facebook-f text-3xl"></i>
          </a>
          <a
            href="https://twitter.com/SheShield"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e67e22] transition-all"
          >
            <i className="fab fa-twitter text-3xl"></i>
          </a>
          <a
            href="https://www.instagram.com/SheShield"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e67e22] transition-all"
          >
            <i className="fab fa-instagram text-3xl"></i>
          </a>
          <a
            href="mailto:support@sheshield.com"
            className="hover:text-[#e67e22] transition-all"
          >
            <i className="fas fa-envelope text-3xl"></i>
          </a>
        </div>

        {/* Copyright Section */}
        <p className="text-sm mt-6 text-[#dcdcdc]">
          &copy; 2025 She-Shield. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
