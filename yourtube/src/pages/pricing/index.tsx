import Head from "next/head";
import { Check } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import PremiumButton from "@/components/PremiumButton";

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing - YourTube Premium</title>
      </Head>
      <div className="flex-1 p-8 ml-0 md:ml-8 mt-4">
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Upgrade your experience
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Unlock the full potential of YourTube. No limits, no ads, just content.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
            {/* Free Tier */}
            <div className="border border-border bg-card text-card-foreground rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <div className="text-4xl font-extrabold mb-6">Free</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-green-500" />
                  Watch up to 3 videos per day
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-green-500" />
                  Standard streaming quality
                </li>
                <li className="flex items-center gap-3 text-muted-foreground opacity-50">
                  <Check className="w-5 h-5" />
                  <s>Video Downloads</s>
                </li>
              </ul>
              <button className="w-full py-3 rounded-lg border border-border font-semibold text-muted-foreground bg-secondary/50 cursor-not-allowed">
                Current Plan
              </button>
            </div>

            {/* Premium Tier */}
            <div className="border-2 border-yellow-500 bg-card text-card-foreground rounded-2xl p-8 shadow-xl relative transform transition-transform hover:-translate-y-1">
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-extrabold mb-6">
                ₹500 <span className="text-lg text-muted-foreground font-normal">/lifetime</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-yellow-500" />
                  <strong>Unlimited</strong> daily video views
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-yellow-500" />
                  Highest quality streaming
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-yellow-500" />
                  Unlock Video Downloads
                </li>
              </ul>
              
              {/* Reusing your exact Razorpay button component here! */}
              <div className="mt-auto">
                 <PremiumButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}