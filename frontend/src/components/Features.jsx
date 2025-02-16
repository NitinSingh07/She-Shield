import React from "react";

const FeatureCards = () => {
  const features = [
    {
      title: "Anonymous & Secure Reporting",
      image: "/reporting.jpg", 
    },
    {
      title: "Community Support & Awareness",
      image: "/community.jpg",  
    },
    {
      title: "Smart Safe Routes & Navigation",
      image: "/navigation.jpg", 
    },
    {
      title: " Emergency Assistance & SOS",
      image: "/Emergency.jpg", 
    }, {
      title: " Self-Defense & Awareness ",
      image: "/Defense.jpg", 
    }, {
      title: "Nearest Police & Medical Support",
      image: "/Police.jpg", 
    },
  ];

  return (
    <div className="container px-4 py-10  mb-[10rem] bg-gradient-to-r from-[#c76d6d] to-[#edef74] rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold text-[#2c3e50] text-center mb-10 tracking-wide">
      Our Key Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-[2.5rem] gap-6 sm:ml-0 ">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 transition transform hover:scale-105 h-[20rem] w-[27rem] flex flex-col items-center justify-center"
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="w-[15rem] h-[15rem] object-cover rounded-md mb-4"
              style={{ objectFit: "cover" }}
            />
            <h3 className="text-xl font-semibold text-center">{feature.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;
