import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isEmergencySender, setIsEmergencySender] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      if (user?._id) {
        newSocket.emit("authenticate", user._id);
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  const value = {
    socket,
    isEmergencySender,
    setIsEmergencySender,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
