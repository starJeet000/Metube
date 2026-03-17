"use client";

import { useRef, useEffect, useState } from "react";
import PaywallModal from "@/components/PaywallModal";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    // Prevent running if the video hasn't fully loaded yet
    if (!video?._id) return;

    // 🌟 THE UPGRADE CHECK: Is this user Premium?
    const isPremium = localStorage.getItem("yt_user_isPremium") === "true";
    
    // If they are premium, never show the paywall and exit the function early!
    if (isPremium) {
      setShowPaywall(false);
      return; 
    }

    // 1. Get today's date as a string
    const today = new Date().toLocaleDateString();
    
    // 2. Fetch the tracking data from localStorage
    const trackingData = JSON.parse(localStorage.getItem("yt_video_tracker") || "{}");

    // 3. Check if it's a new day or if they are within the limit
    if (trackingData.date !== today) {
      // First video of the day! Reset the counter to 1
      localStorage.setItem("yt_video_tracker", JSON.stringify({ date: today, count: 1 }));
      setShowPaywall(false);
    } else if (trackingData.count >= 3) {
      // 🚨 Limit Reached! Trigger the paywall
      setShowPaywall(true);
    } else {
      // Safe to watch! Increment the counter
      const newCount = trackingData.count + 1;
      localStorage.setItem("yt_video_tracker", JSON.stringify({ date: today, count: newCount }));
      setShowPaywall(false);
    }
  }, [video?._id]); // We use video._id here so it triggers if they click a "Related Video"

  return (
    // Added 'relative' to the container so the absolute modal stays inside the video area
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      
      {/* If the paywall is active, show the lock screen! */}
      {showPaywall && <PaywallModal />}
      
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        poster={`/placeholder.svg?height=480&width=854`}
      >
        <source
          src={`${process.env.BACKEND_URL}/${video?.filepath}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}