import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, MonitorUp, StopCircle, Video, Download } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function CreatorStudio() {
  const [isMicActive, setIsMicActive] = useState(false);
  const [isScreenShared, setIsScreenShared] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]); 
  const micStreamRef = useRef<MediaStream | null>(null); 

  // 🌟 NEW: States for the Hardware Selector
  const [availableMics, setAvailableMics] = useState<MediaDeviceInfo[]>([]);
  const [selectedMic, setSelectedMic] = useState<string>("");

  // 🌟 NEW: Scan the computer for available microphones when the page loads
  useEffect(() => {
    const fetchMicrophones = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        setAvailableMics(audioInputs);
        
        // Auto-select the first available mic if one isn't selected yet
        if (audioInputs.length > 0 && !selectedMic) {
          setSelectedMic(audioInputs[0].deviceId);
        }
      } catch (err) {
        console.error("Error fetching devices", err);
      }
    };

    fetchMicrophones();

    // Listen for USB mics being plugged in or out!
    navigator.mediaDevices.addEventListener('devicechange', fetchMicrophones);
    return () => navigator.mediaDevices.removeEventListener('devicechange', fetchMicrophones);
  }, [selectedMic]);

  const toggleMic = async () => {
    if (isMicActive) {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
        micStreamRef.current = null;
      }
      setIsMicActive(false);
    } else {
      try {
        // 🌟 UPDATED: Tell Chrome EXACTLY which hardware ID to use!
        const constraints = {
          audio: {
            deviceId: selectedMic ? { exact: selectedMic } : undefined,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        micStreamRef.current = stream;
        setIsMicActive(true);

        // 🌟 PRO TIP: Once permission is granted, device labels (names) become visible.
        // We re-fetch the list here so the dropdown shows real names instead of "Microphone 1"
        const devices = await navigator.mediaDevices.enumerateDevices();
        setAvailableMics(devices.filter(d => d.kind === 'audioinput'));

      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Please allow microphone access to record your voice.");
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenShared) {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop()); 
      }
      setMediaStream(null);
      setIsScreenShared(false);
      if (liveVideoRef.current) liveVideoRef.current.srcObject = null;
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: "monitor" },
          audio: true 
        });

        setMediaStream(stream);
        setIsScreenShared(true);
        setRecordedVideoUrl(null); 

        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = stream;
        }

        stream.getVideoTracks()[0].onended = () => {
          setIsScreenShared(false);
          setMediaStream(null);
          if (liveVideoRef.current) liveVideoRef.current.srcObject = null;
        };
      } catch (err) {
        console.error("Error accessing screen:", err);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      if (!mediaStream) return;
      chunksRef.current = []; 

      let streamToRecord = mediaStream;

      if (isMicActive && micStreamRef.current) {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const audioContext = new AudioContextClass();
          audioContext.resume(); 

          const audioDestination = audioContext.createMediaStreamDestination();

          if (mediaStream.getAudioTracks().length > 0) {
            const systemAudioSource = audioContext.createMediaStreamSource(new MediaStream(mediaStream.getAudioTracks()));
            systemAudioSource.connect(audioDestination);
          }

          const micAudioSource = audioContext.createMediaStreamSource(micStreamRef.current);
          micAudioSource.connect(audioDestination);

          streamToRecord = new MediaStream([
            ...mediaStream.getVideoTracks(),
            ...audioDestination.stream.getAudioTracks()
          ]);
        } catch (err) {
          console.error("Audio mixing failed", err);
        }
      }

      const recorder = new MediaRecorder(streamToRecord, { mimeType: "video/webm" });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url); 
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordedVideoUrl(null); 
    }
  };

  const downloadVideo = () => {
    if (!recordedVideoUrl) return;
    const a = document.createElement("a");
    a.href = recordedVideoUrl;
    a.download = `YourTube_Recording_${new Date().getTime()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Head>
        <title>Creator Studio - YourTube</title>
      </Head>
      
      <div className="flex-1 p-8 ml-0 md:ml-8 mt-4">
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Creator Studio</h1>
              <p className="text-muted-foreground">Record your screen and voice for your next upload.</p>
            </div>
            
            {isRecording && (
              <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-full font-semibold border border-red-500/20 animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                RECORDING LIVE
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video bg-black rounded-xl border border-border overflow-hidden relative flex items-center justify-center shadow-lg">
                
                {!isScreenShared && !recordedVideoUrl && (
                  <div className="text-center text-muted-foreground flex flex-col items-center gap-3">
                    <MonitorUp className="w-12 h-12 opacity-50" />
                    <p>Share your screen to see the preview here</p>
                  </div>
                )}

                <video 
                  ref={liveVideoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-contain ${isScreenShared ? 'block' : 'hidden'}`}
                />

                {recordedVideoUrl && !isScreenShared && (
                  <video 
                    src={recordedVideoUrl} 
                    controls 
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6 h-fit">
              <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-border pb-4">
                <Video className="w-5 h-5 text-blue-500" />
                Control Deck
              </h3>

              <div className="space-y-4">
                <button 
                  onClick={toggleScreenShare} 
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${isScreenShared ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  {isScreenShared ? <StopCircle className="w-5 h-5" /> : <MonitorUp className="w-5 h-5" />}
                  {isScreenShared ? "Stop Sharing" : "Share Screen"}
                </button>

                {/* 🌟 NEW: The Hardware Selector Dropdown */}
                <div className="flex flex-col gap-2 p-3 bg-secondary/50 rounded-lg border border-border">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Audio Input Source
                  </label>
                  <select
                    value={selectedMic}
                    onChange={(e) => setSelectedMic(e.target.value)}
                    disabled={isMicActive} // Prevent switching while the mic is currently hot/live
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-50 cursor-pointer"
                  >
                    {availableMics.length === 0 ? (
                      <option>Loading devices...</option>
                    ) : (
                      availableMics.map((mic, index) => (
                        <option key={mic.deviceId} value={mic.deviceId}>
                          {mic.label || `Microphone ${index + 1} (Permission Required)`}
                        </option>
                      ))
                    )}
                  </select>

                  <button 
                    onClick={toggleMic}
                    className={`w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-md font-medium border transition-all ${isMicActive ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-background text-foreground hover:bg-secondary/80 border-border'}`}
                  >
                    {isMicActive ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
                    {isMicActive ? "Mic is Live" : "Enable Selected Mic"}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-4">
                <button 
                  disabled={!isScreenShared}
                  onClick={toggleRecording} 
                  className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all ${!isScreenShared ? 'opacity-50 cursor-not-allowed bg-secondary text-muted-foreground' : isRecording ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-foreground text-background hover:bg-foreground/90'}`}
                >
                  {isRecording ? "STOP RECORDING" : "START RECORDING"}
                </button>

                {recordedVideoUrl && (
                  <button 
                    onClick={downloadVideo} 
                    className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Download Recording
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}