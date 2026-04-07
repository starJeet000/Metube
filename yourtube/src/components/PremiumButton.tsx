"use client";

import React, { useState } from "react";
<<<<<<< HEAD
import { Button } from "./ui/button";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { Loader2, Crown } from "lucide-react";

const PremiumButton = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // 1. Function to dynamically load the Razorpay script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) return;

=======
import { loadRazorpay } from "@/lib/loadRazorpay";
import { useUser } from "@/lib/AuthContext";
import { Crown } from "lucide-react";

export default function PremiumButton() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
>>>>>>> feature/task-2-premium-download
    setLoading(true);
    const res = await loadRazorpay();

    if (!res) {
<<<<<<< HEAD
      alert("Razorpay SDK failed to load. Are you online?");
=======
      alert("Razorpay SDK failed to load. Please check your internet connection.");
>>>>>>> feature/task-2-premium-download
      setLoading(false);
      return;
    }

    try {
<<<<<<< HEAD
      // 2. Ask backend to create an Order
      const orderResponse = await axiosInstance.post("/payment/create-order");
      const orderData = orderResponse.data;

      // 3. Set up the Razorpay Checkout Window
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "YourTube Premium",
        description: "Lifetime Premium Subscription",
        order_id: orderData.id,
        // 4. This handler runs when the payment is successful
        handler: async function (response: any) {
          try {
            const verifyRes = await axiosInstance.post("/payment/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: user._id, // Tell the backend who just paid!
            });
            
            if (verifyRes.status === 200) {
              alert("🎉 Welcome to Premium! Please refresh to see changes.");
              // You can optionally call a function to refresh the user context here
            }
          } catch (err) {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#EF4444", // Red-500 to match YouTube vibe
        },
      };

      // 5. Open the window!
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment flow error:", error);
      alert("Something went wrong with the payment.");
=======
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
>>>>>>> feature/task-2-premium-download
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Don't show the button if not logged in
  if (!user) return null; 

  // If already premium, show a cool crown instead of a button
  if (user.isPremium) {
    return (
      <span className="text-yellow-500 font-bold flex items-center gap-1 px-2">
        <Crown className="w-5 h-5" /> Premium
      </span>
    );
  }

  // Otherwise, show the checkout button
  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading} 
      variant="outline"
      className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
      Get Premium
    </Button>
  );
};

export default PremiumButton;
=======
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
>>>>>>> feature/task-2-premium-download
