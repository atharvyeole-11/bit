import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
  queueSocket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null, queueSocket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [queueSocket, setQueueSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      
      const newSocket = io(url, { auth: { token } });
      const newQueueSocket = io(`${url}/queue`, { auth: { token } });

      newSocket.on('connect', () => {
        newSocket.emit('join', user._id);
      });

      setSocket(newSocket);
      setQueueSocket(newQueueSocket);

      return () => {
        newSocket.disconnect();
        newQueueSocket.disconnect();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, queueSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
