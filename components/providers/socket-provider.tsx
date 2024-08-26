'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
  connected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstanse = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: '/api/socket/io',
    });

    socketInstanse.on('connect', () => {
      setConnected(true);
    });

    socketInstanse.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(socketInstanse);

    return () => {
      socketInstanse.disconnect();
    };
  }, []);

  const value = useMemo(() => {
    return {
      socket,
      connected,
    };
  }, [socket, connected]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
