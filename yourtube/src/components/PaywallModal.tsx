import Link from "next/link";
import { Lock } from "lucide-react";

export default function PaywallModal() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md rounded-xl border border-gray-800">
      <div className="text-center p-8 max-w-md animate-in zoom-in duration-300">
        <div className="bg-yellow-500/10 p-4 rounded-full inline-block mb-4">
          <Lock className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Daily Limit Reached</h2>
        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
          You are on the Basic Free plan and have reached your limit of 3 videos for today. 
          Upgrade to Premium for unlimited access and offline downloads.
        </p>
        <Link 
          href="/pricing"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition-all hover:scale-105 inline-block shadow-[0_0_20px_rgba(234,179,8,0.3)]"
        >
          View Premium Plans
        </Link>
      </div>
    </div>
  );
}