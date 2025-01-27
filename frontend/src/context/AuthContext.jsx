import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // Fetch user data based on token
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            }
          );
          setUser(response.data); // Set user data
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };
      fetchUser();
    }
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );
      setUser(response.data.user); // Set user after login
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      showNotification("Login successful!", "success");
    } catch (error) {
      showNotification("Login failed. Please check your credentials.", error);
    }
  };

  const register = async (username, password, email) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { username, password, email }
      );
      setUser(response.data.user); // Set user after registration
      showNotification("Registration successful! Please log in.", "success");
    } catch (error) {
      showNotification("Registration failed. Please try again.", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    showNotification("You have logged out.", "info");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        showNotification,
        notification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
