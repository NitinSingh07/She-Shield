import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Complaints from "./pages/Complaints";
import Training from "./pages/Training";
import Forum from "./pages/Forum";
import Notification from "./components/Notification";
import useAuth from "./hooks/useAuth"; // Correct import
import Emergency from "./pages/Emergency";
import HelpPage from "./pages/HelpPage";
import { SocketProvider } from "./context/SocketContext";
import EmergencyNotification from "./components/EmergencyNotification";
import { AuthProvider } from "./context/AuthContext";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";

const App = () => {
  const { notification } = useAuth();

  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <EmergencyNotification />
          <Notification
            message={notification.message}
            type={notification.type}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reportincident" element={<Complaints />} />
            <Route path="/training" element={<Training />} />
            <Route path="/postforums" element={<Forum />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contactus" element={<ContactUs />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
