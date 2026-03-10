import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import TimeBasedTheme from "@/components/TimeBasedTheme";
import LocationOTP from "@/components/LocationOTP";
import { ThemeProvider } from "next-themes";
import Head from "next/head"; // 1. Imported the Head component

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        
        {/* 2. Wrapped the title inside Next.js Head component */}
        <Head>
          <title>Your-Tube Clone</title>
        </Head>

        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <Header />
          <Toaster />
          <div className="flex">
            <Sidebar />
            <TimeBasedTheme />
            <LocationOTP />
            <Component {...pageProps} />
          </div>
        </div>
      </ThemeProvider>
    </UserProvider>
  );
}