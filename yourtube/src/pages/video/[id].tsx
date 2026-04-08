import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/lib/axiosinstance";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { useUser } from "@/lib/AuthContext";
import Comments from "@/components/Comments"; // 🌟 Added

export default function VideoPlayerPage() {
  const router = useRouter();
  const { id } = router.query; 
  const { user } = useUser();

  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        const response = await axiosInstance.get(`/video/getvideo/${id}`);
        setVideoData(response.data);
      } catch (error) {
        console.error("Failed to fetch video:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  // Logic to check if the current user has liked/disliked
  const isLiked = videoData?.likes?.some((likeId: any) => likeId.toString() === user?._id?.toString());
  const isDisliked = videoData?.dislikes?.some((disId: any) => disId.toString() === user?._id?.toString());

  const handleLike = async () => {
    if (!user) return alert("Please sign in to like videos!");
    try {
      const res = await axiosInstance.put(`/video/like/${id}`, { userId: user._id });
      setVideoData(res.data); 
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleDislike = async () => {
    if (!user) return alert("Please sign in to dislike videos!");
    try {
      const res = await axiosInstance.put(`/video/dislike/${id}`, { userId: user._id });
      setVideoData(res.data);
    } catch (error) {
      console.error("Dislike failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!videoData) {
    return <div className="min-h-screen flex items-center justify-center pt-20">Video not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 md:px-8 pb-10">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Video Player & Details */}
        <div className="flex-1">
          <div className="bg-black rounded-xl overflow-hidden shadow-md">
            <video
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/uploads/${videoData.filepath}`}
              controls
              autoPlay
              className="w-full max-h-[70vh]"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="mt-4 space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">{videoData.videotitle}</h1>
            
            <p className="text-sm text-gray-500">
              {videoData.views?.toLocaleString() || 0} views • {new Date(videoData.createdAt).toLocaleDateString()}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                    {videoData.videochanel?.[0]?.toUpperCase() || "C"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-md">{videoData.videochanel}</h3>
                  <p className="text-xs text-gray-500">1.2M Subscribers</p>
                </div>
                <Button variant="default" className="ml-2 bg-black text-white hover:bg-gray-800 rounded-full px-6">
                  Subscribe
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-full">
                  <Button 
                    variant="ghost" 
                    onClick={handleLike}
                    className={`rounded-l-full px-4 hover:bg-gray-200 flex gap-2 ${isLiked ? "text-blue-600 font-bold" : "text-gray-700"}`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-blue-600" : ""}`} /> 
                    {videoData.likes?.length || 0}
                  </Button>
                  
                  <div className="w-[1px] h-6 bg-gray-300"></div>
                  
                  <Button 
                    variant="ghost" 
                    onClick={handleDislike}
                    className={`rounded-r-full px-4 hover:bg-gray-200 ${isDisliked ? "text-red-600 font-bold" : "text-gray-700"}`}
                  >
                    <ThumbsDown className={`w-4 h-4 ${isDisliked ? "fill-red-600" : ""}`} />
                  </Button>
                </div>
                <Button variant="ghost" className="bg-gray-100 rounded-full hover:bg-gray-200 flex gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </div>
          </div>

          {/* 🌟 Added Comments Section */}
          <Comments videoId={id as string} />
        </div>

        {/* Right Side: Recommended Videos (Skeleton) */}
        <div className="lg:w-[350px] hidden lg:block">
          <h3 className="font-bold mb-4">Up Next</h3>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-2">
                <div className="w-40 h-24 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}