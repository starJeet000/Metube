import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import { SidebarProvider } from "@/lib/SidebarContext";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <SidebarProvider>
        
        <Head>
          <title>Your-Tube Clone</title>
        </Head>

        <div className="min-h-screen bg-white text-black">
          <Header />
          <Toaster />
          <div className="flex">
            <Sidebar />
            <Component {...pageProps} />
          </div>
        </div>

      </SidebarProvider>
    </UserProvider>
  );
}