"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function TimeBasedTheme() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Next.js hydration safety check
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const applyTimeBasedTheme = () => {
      const currentHour = new Date().getHours();
      
      // 6 AM (6) to 5:59 PM (17) -> Light Mode
      // 6 PM (18) to 5:59 AM (5) -> Dark Mode
      const isDaytime = currentHour >= 6 && currentHour < 18;
      
      if (isDaytime && theme !== 'light') {
        setTheme('light');
        console.log("TimeBasedTheme: Switching to Light Mode");
      } else if (!isDaytime && theme !== 'dark') {
        setTheme('dark');
        console.log("TimeBasedTheme: Switching to Dark Mode");
      }
    };

    // Run immediately
    applyTimeBasedTheme();

    // Check every minute in case they leave the tab open during the transition hour
    const intervalId = setInterval(applyTimeBasedTheme, 1000);

    return () => clearInterval(intervalId);
  }, [mounted, setTheme, theme]);

  return null; // This component renders nothing to the screen
}