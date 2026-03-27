"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosinstance";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [videotitle, setVideotitle] = useState("");
  const [videochanel, setVideochanel] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !videotitle || !videochanel) {
      setMessage("⚠️ Please fill all fields and select a video file.");
      return;
    }

    setUploading(true);
    setMessage("");

    // 🌟 Create the exact payload Multer is expecting
    const formData = new FormData();
    formData.append("file", file); // Must match upload.single("file")
    formData.append("videotitle", videotitle);
    formData.append("videochanel", videochanel);

    try {
      const response = await axiosInstance.post("/video/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setMessage("✅ Video uploaded successfully!");
        // Send the user back to the homepage after 2 seconds to see their video
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Failed to upload video. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Upload Video
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Title
            </label>
            <input
              type="text"
              value={videotitle}
              onChange={(e) => setVideotitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="E.g., My Awesome Vlog"
            />
          </div>

          {/* Channel Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel Name
            </label>
            <input
              type="text"
              value={videochanel}
              onChange={(e) => setVideochanel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="E.g., Tech Guru"
            />
          </div>

          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video File (MP4)
            </label>
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          {/* Status Message */}
          {message && (
            <div className={`text-sm text-center p-2 rounded ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
              uploading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload to YouTube"}
          </button>
        </form>
      </div>
    </div>
  );
}