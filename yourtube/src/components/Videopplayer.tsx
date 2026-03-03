"use client";

import { useRef, useEffect } from "react";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videos = "/video/vdo.mp4";

  // Click handlers to verify our invisible hitboxes
  const handleLeftZoneClick = () => {
    console.log("Left zone clicked! (Future: Rewind 10s / Close app)");
  };

  const handleCenterZoneClick = () => {
    console.log("Center zone clicked! (Future: Pause / Next Video)");
  };

  const handleRightZoneClick = () => {
    console.log("Right zone clicked! (Future: Forward 10s / Close app)");
  };

  return (
    // Added 'relative' here so the absolute overlay stays inside this container
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
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

      {/* The Gesture Overlay Layer 
          We leave the bottom 20% empty (h-[80%]) so standard native controls aren't blocked.
      */}
      <div className="absolute top-0 left-0 w-full h-[80%] flex z-10">
        <div 
          className="w-1/3 h-full cursor-pointer bg-transparent hover:bg-white/5 transition-colors" 
          onClick={handleLeftZoneClick}
        />
        <div 
          className="w-1/3 h-full cursor-pointer bg-transparent hover:bg-white/5 transition-colors" 
          onClick={handleCenterZoneClick}
        />
        <div 
          className="w-1/3 h-full cursor-pointer bg-transparent hover:bg-white/5 transition-colors" 
          onClick={handleRightZoneClick}
        />
      </div>
    </div>
  );
}