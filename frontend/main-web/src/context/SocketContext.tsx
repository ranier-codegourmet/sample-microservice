import { createContext, ReactNode, useCallback, useEffect } from "react";
import io, { Socket } from "socket.io-client";

import { LocalStorageKeys } from "@/types/config";

export type SocketValue = {
  handleJoinBid: (itemId: string) => void;
  handleLeaveBid: (itemId: string) => void;
  socket: Socket | null;
};

export const SocketContext = createContext<SocketValue>({
  handleJoinBid: () => null,
  handleLeaveBid: () => null,
  socket: null,
});

type SocketProviderProps = {
  children: ReactNode;
};

const uri = process.env.NEXT_PUBLIC_BID_WS_URL || "http://localhost:3000";
let socket: Socket;

const SocketProvider = ({ children }: SocketProviderProps) => {
  const handleJoinBid = useCallback((itemId: string) => {
    socket.emit("joinBid", { item_id: itemId });
  }, []);

  const handleLeaveBid = useCallback((itemId: string) => {
    socket.emit("leaveBid", { item_id: itemId });
  }, []);

  useEffect(() => {
    socket = io(`${uri}/bid`, {
      extraHeaders: {
        authorization: `Bearer ${localStorage.getItem(
          LocalStorageKeys.ACCESS_TOKEN
        )}`,
      },
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        handleJoinBid,
        handleLeaveBid,
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
