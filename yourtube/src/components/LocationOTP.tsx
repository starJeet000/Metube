"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const southIndianStates = [
  "Andhra Pradesh", 
  "Karnataka", 
  "Kerala", 
  "Tamil Nadu", 
  "Telangana"
];

export default function LocationOTP() {
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [userRegion, setUserRegion] = useState("");
  
  // New state to hold the dynamically generated OTP
  const [generatedOTP, setGeneratedOTP] = useState("");

  // Extracted the generation logic so we can reuse it
  const generateAndSendOTP = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOTP(newOtp);
    
    // Simulating an SMS arriving on the user's phone after 1 second
    setTimeout(() => {
      alert(`📱 [MOCK SMS] Your Your-Tube security OTP is: ${newOtp}`);
    }, 1000);
  };

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const res = await axios.get("https://ipapi.co/json/");
        const region = res.data.region; 
        setUserRegion(region);

        if (southIndianStates.includes(region)) {
          setShowOTP(true);
          generateAndSendOTP(); // Trigger OTP generation if in South India
        }
      } catch (error) {
        console.error("Failed to fetch location for OTP gate", error);
      }
    };

    checkLocation();
  }, []);

  if (!showOTP || isVerified) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => {
            setShowOTP(true);
            generateAndSendOTP(); // Trigger generation when using the Dev button
          }}
          className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-xs opacity-50 hover:opacity-100"
        >
          Dev: Simulate South India IP
        </button>
      </div>
    );
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate against the dynamically generated OTP
    if (otpValue === generatedOTP) {
      setIsVerified(true);
      setShowOTP(false);
    } else {
      alert("Invalid OTP. Please check your messages and try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-background border border-border p-8 rounded-xl shadow-2xl max-w-md w-full text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-foreground">Security Verification</h2>
        <p className="text-muted-foreground text-sm">
          We detected a login attempt from <span className="font-semibold text-primary">{userRegion || "South India"}</span>. 
          Due to regional security policies, please enter your OTP to continue.
        </p>
        
        <form onSubmit={handleVerify} className="flex flex-col gap-4 mt-4">
          <input 
            type="text" 
            placeholder="Enter 4-digit OTP"
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value)}
            maxLength={4}
            className="w-full p-3 text-center text-2xl tracking-widest bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground"
          />
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Verify & Continue
          </button>
        </form>
        
        {/* Added a resend button for a complete UI feel */}
        <button 
          onClick={generateAndSendOTP}
          className="text-xs text-muted-foreground hover:text-primary mt-2"
        >
          Didn't receive code? Resend
        </button>
      </div>
    </div>
  );
}