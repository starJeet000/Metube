"use client";

import React, { useState } from "react";
import { useUser } from "@/lib/AuthContext";
import { Crown } from "lucide-react";

export default function PremiumButton() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);

    // MOCK PAYMENT SUCCESS FOR FRONTEND TESTING
    // We simulate a 1-second loading delay, then "upgrade" the user!
    setTimeout(() => {
      console.log("Mock Payment Success!");
      
      // 1. Save the premium status to local storage
      localStorage.setItem("yt_user_isPremium", "true");
      
      // 2. Alert the user
      alert("Payment Successful! Welcome to Premium!");
      
      // 3. Refresh the page to apply the new PRO badge across the app
      window.location.href = "/";
    }, 1000); 
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full group flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-amber-700 dark:text-amber-400 hover:from-amber-500/20 hover:to-orange-500/10 transition-all duration-300 font-medium text-sm"
    >
      <Crown className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform duration-300" />
      {loading ? "Processing..." : "Upgrade to Premium"}
    </button>
  );
}