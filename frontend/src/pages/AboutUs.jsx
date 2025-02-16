import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-orange-100 to-red-50 min-h-screen flex flex-col items-center p-6">
        <div className="max-w-7xl w-full bg-white shadow-xl rounded-xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-10 text-center shadow-lg">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-wide">
              About <span className="text-yellow-300">She-Shield</span>
            </h1>
            <p className="text-lg text-white mt-2 font-light italic tracking-widest">
              "For Every Woman, Safety Comes First"
            </p>
          </div>

          {/* Content Section */}
          <div className="p-12 text-gray-800 space-y-8 animate-fadeInUp">
            <p className="text-lg leading-relaxed tracking-wide text-gray-700">
              <span className="text-orange-600 font-bold">She-Shield</span> is a
              digital platform dedicated to empowering women with essential
              safety resources. Our goal is to create a{" "}
              <span className="font-semibold text-red-500">
                safe, secure, and supportive space
              </span>{" "}
              where women can access real-time protection, report incidents
              anonymously, and navigate safer routes in their daily lives.
            </p>

            <div className="border-l-4 border-orange-500 pl-6 italic text-gray-600 text-lg font-medium">
              “Safety is not a privilege; it’s a basic right for every woman.”
            </div>

            {/* Mission Section */}
            <div className="relative">
              <h2 className="text-3xl font-semibold text-gray-900">
                Our Mission
              </h2>
              <div className="w-16 h-1 bg-orange-500 rounded-full mt-2"></div>
              <p className="text-lg leading-relaxed mt-4 text-gray-700">
                We believe that safety is a fundamental right. By leveraging
                technology, we aim to provide immediate assistance, raise
                awareness, and foster a strong community where women can support
                each other.
              </p>
            </div>

            {/* Features Section */}
            <div className="relative">
              <h2 className="text-3xl font-semibold text-gray-900">
                Key Features
              </h2>
              <div className="w-16 h-1 bg-orange-500 rounded-full mt-2"></div>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
              {[
                {
                  icon: "🔒",
                  title: "Anonymous & Secure Reporting",
                  bg: "bg-orange-100",
                  text: "Report incidents without fear, ensuring privacy and security.",
                  link: "/complaints",
                },
                {
                  icon: "👥",
                  title: "Community Support & Awareness",
                  bg: "bg-red-100",
                  text: "Engage in discussions and spread awareness about safety.",
                  link: "/forum",
                },
                {
                  icon: "🚨",
                  title: "Emergency Assistance & SOS",
                  bg: "bg-red-100",
                  text: "Instantly connect with trusted contacts and emergency services.",
                  link: "/emergency",
                },
                {
                  icon: "🏥",
                  title: "Nearest Police & Medical Support",
                  bg: "bg-orange-100",
                  text: "Quickly locate nearby police stations and medical facilities.",
                  link: "/help",
                },
              ].map((feature, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-4 p-5 rounded-lg shadow-md transition-all transform hover:scale-105 hover:shadow-xl ${feature.bg}`}
                >
                  <a href={feature.link}>
                    <span className="text-3xl">{feature.icon}</span>{" "}
                  </a>
                  <div>
                    <strong className="text-gray-900">{feature.title}</strong>
                    <p className="text-gray-700 text-sm">{feature.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Join Section */}
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-900">
                Join Our Movement
              </h2>
              <div className="w-16 h-1 bg-orange-500 rounded-full mx-auto mt-2"></div>
              <p className="text-lg leading-relaxed mt-4 text-gray-700">
                Safety is a{" "}
                <span className="font-semibold text-red-500">
                  shared responsibility
                </span>
                . Be part of our mission to create a safer environment for women
                everywhere. Join our community, contribute, and help us make a
                difference.
              </p>

              <div className="mt-8">
                <a href="/">
                  <button
                    className="bg-orange-500 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg 
                    hover:bg-orange-600 transform transition-all duration-300 hover:scale-110"
                  >
                    Join Community
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
