"use client";

import React, { useState } from "react";
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

    setLoading(true);
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
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
    } finally {
      setLoading(false);
    }
  };

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