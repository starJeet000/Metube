"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, StopCircle, Video, Upload, RefreshCw } from "lucide-react";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";

const StudioPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // 1. Access Camera and Mic
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Please allow camera and microphone access.");
    }
  };

  // 2. Start Recording
  const startRecording = () => {
    if (!stream) return;
    
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream);
    
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      setRecordedBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  };

  // 3. Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // 4. Upload to Backend (Using your existing upload logic)
  const handleUpload = async () => {
    if (!recordedBlob) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", recordedBlob, "studio-record.mp4");
    formData.append("videotitle", `Studio Record - ${new Date().toLocaleDateString()}`);
    formData.append("videochanel", "My Studio"); // You can fetch real user channel name here

    try {
      await axiosInstance.post("/video/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Video uploaded successfully from Studio!");
      router.push("/");
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Video className="text-red-600" /> Creator Studio
      </h1>

      <Card className="w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden relative shadow-2xl">
        {previewUrl ? (
          <video src={previewUrl} controls className="w-full h-full" />
        ) : (
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
        )}
        
        {!stream && !previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <Button onClick={startCamera} className="bg-white text-black hover:bg-gray-200">
              <Camera className="mr-2 h-4 w-4" /> Enable Camera
            </Button>
          </div>
        )}
      </Card>

      <div className="mt-8 flex gap-4">
        {!previewUrl ? (
          recording ? (
            <Button onClick={stopRecording} variant="destructive" className="rounded-full px-8">
              <StopCircle className="mr-2 h-4 w-4" /> Stop Recording
            </Button>
          ) : (
            <Button onClick={startRecording} disabled={!stream} className="bg-red-600 hover:bg-red-700 rounded-full px-8">
              <Video className="mr-2 h-4 w-4" /> Start Recording
            </Button>
          )
        ) : (
          <>
            <Button onClick={() => { setPreviewUrl(null); setRecordedBlob(null); }} variant="outline" className="rounded-full">
              <RefreshCw className="mr-2 h-4 w-4" /> Retake
            </Button>
            <Button onClick={handleUpload} disabled={uploading} className="bg-blue-600 hover:bg-blue-700 rounded-full px-8">
              {uploading ? "Uploading..." : <><Upload className="mr-2 h-4 w-4" /> Upload Video</>}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default StudioPage;