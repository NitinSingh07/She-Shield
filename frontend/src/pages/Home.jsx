import Navbar from "../components/Navbar";
import ForumPost from "../components/ForumPost";
import Footer from "../components/Footer";
import ComplaintPost from "../components/ComplaintPost";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f9f8f6]">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Welcome Section */}
        <div className="bg-[#fbf5e9] p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-[#2c3e50] mb-4">
            Welcome to <span className="text-[#e67e22]">She-Shield</span>
          </h1>
          <p className="text-lg text-[#34495e] mb-4">
            Empowering women in rural areas by providing access to safety
            resources, reporting tools, and a supportive community. Together, we
            stand for safety and equality.
          </p>
          <div className="bg-[#fff] border-l-4 border-[#e67e22] p-4">
            <p className="text-sm text-[#7f8c8d] italic">
              “Safety is not a privilege, it’s a basic right for every woman.”
            </p>
          </div>
        </div>

        {/* Forum Section */}
        <div className="mt-8">
          <ForumPost />
        </div>
        <div className="mt-8">
          <ComplaintPost />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
