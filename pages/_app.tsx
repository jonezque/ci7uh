import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ConnectProvider } from "../contexts/connect";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConnectProvider>
      <Component {...pageProps} />
    </ConnectProvider>
  );
}
