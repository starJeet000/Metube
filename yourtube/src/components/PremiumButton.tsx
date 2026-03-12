"use client";

import React, { useState } from "react";
import { loadRazorpay } from "@/lib/loadRazorpay";
import { useUser } from "@/lib/AuthContext";
import { Crown } from "lucide-react";

export default function PremiumButton() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const mockOrder = {
        id: "order_mock_" + Math.floor(Math.random() * 1000000),
        amount: 50000, 
        currency: "INR",
      };

      const options = {
        key: "rzp_test_YOUR_TEST_KEY_HERE", 
        amount: mockOrder.amount.toString(),
        currency: mockOrder.currency,
        name: "YourTube Premium",
        description: "Unlock Video Downloads & Ad-free viewing",
        order_id: mockOrder.id,
        handler: function (response: any) {
          console.log("Payment Success!", response);
          alert(`Payment Successful! Mock Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: user?.name || "Guest User",
          email: user?.email || "guest@example.com",
        },
        theme: {
          color: "#EAB308",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong with the payment gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-amber-700 dark:text-amber-400 hover:from-amber-500/20 hover:to-orange-500/10 transition-all duration-300 font-medium text-sm"
    >
      <Crown className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform duration-300" />
      {loading ? "Loading..." : "Premium"}
    </button>
  );
}