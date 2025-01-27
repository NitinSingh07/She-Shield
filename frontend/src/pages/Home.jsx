import Navbar from "../components/Navbar";
import ForumPost from "../components/ForumPost";
import Footer from "../components/Footer";
import ComplaintPost from "../components/ComplaintPost";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f9f8f6] via-[#f1f8ff] to-[#e8f8f5]">
      <Navbar />
      <div className="container mx-auto px-6 py-12 flex-1">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#fff9f0] via-[#ffedcc] to-[#ffd699] p-10 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-[#ffe3b3] rounded-full blur-2xl opacity-50 -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#fcd49b] rounded-full blur-2xl opacity-50 translate-x-10 translate-y-10"></div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#2c3e50] mb-6 tracking-tight leading-tight">
            Welcome to <span className="text-[#e67e22]">She-Shield</span>
          </h1>
          <p className="text-lg md:text-xl text-[#34495e] mb-8 leading-relaxed">
            Empowering women in rural areas by providing access to safety
            resources, reporting tools, and a supportive community. Together, we
            stand for safety and equality.
          </p>
          <div className="bg-[#fff] border-l-4 border-[#e67e22] p-6 rounded-lg shadow-md">
            <p className="text-sm md:text-base text-[#7f8c8d] italic text-center">
              “Safety is not a privilege, it’s a basic right for every woman.”
            </p>
          </div>
        </div>

        {/* Forum Section */}
        <div className="mt-16">
          <ForumPost />
        </div>

        {/* Complaint Section */}
        <div className="mt-16">
          <ComplaintPost />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
