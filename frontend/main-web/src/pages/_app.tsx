import "@/styles/globals.css";

import type { AppProps } from "next/app";

import TokenHOC from "@/components/hoc/TokenHOC";
import SocketProvider from "@/context/SocketContext";
import UserProvider from "@/context/UserContext";

export default function App({ Component, pageProps }: AppProps) {
  const GuardedComponent = TokenHOC(Component);

  return (
    <UserProvider>
      <SocketProvider>
        <GuardedComponent {...pageProps} />
      </SocketProvider>
    </UserProvider>
  );
}
