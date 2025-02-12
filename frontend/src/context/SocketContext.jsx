import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext); // Use AuthContext directly

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      if (user?._id) {
        newSocket.emit("authenticate", user._id);
      }
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
