import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Channeldialogue from "./channeldialogue";
import { useUser } from "@/lib/AuthContext";
import PremiumButton from "./PremiumButton";
import { useSidebar } from "@/lib/SidebarContext";

const Sidebar = () => {
  const { user } = useUser();
  const { isOpen } = useSidebar();
  const [isdialogeopen, setisdialogeopen] = useState(false);
  
  return (
    <aside 
      className={`bg-white min-h-screen transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${
        isOpen ? "w-64 p-2 border-r opacity-100" : "w-0 p-0 border-none opacity-0"
      }`}
    >
      {/* THE FIX: This inner container stays exactly 256px (w-64) wide. 
          When the parent aside shrinks to w-0, it just hides this content 
          smoothly without squishing the text! */}
      <div className="w-64 flex-shrink-0">
        <nav className="space-y-1">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="w-5 h-5 mr-3" />
              Home
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="ghost" className="w-full justify-start">
              <Compass className="w-5 h-5 mr-3" />
              Explore
            </Button>
          </Link>
          <Link href="/subscriptions">
            <Button variant="ghost" className="w-full justify-start">
              <PlaySquare className="w-5 h-5 mr-3" />
              Subscriptions
            </Button>
          </Link>
          
          <div className="px-3 py-2">
            <PremiumButton />
          </div>

          {user && (
            <>
              <div className="border-t pt-2 mt-2">
                <Link href="/history">
                  <Button variant="ghost" className="w-full justify-start">
                    <History className="w-5 h-5 mr-3" />
                    History
                  </Button>
                </Link>
                <Link href="/liked">
                  <Button variant="ghost" className="w-full justify-start">
                    <ThumbsUp className="w-5 h-5 mr-3" />
                    Liked videos
                  </Button>
                </Link>
                <Link href="/watch-later">
                  <Button variant="ghost" className="w-full justify-start">
                    <Clock className="w-5 h-5 mr-3" />
                    Watch later
                  </Button>
                </Link>
                {user?.channelname ? (
                  <Link href={`/channel/${user.id}`}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-5 h-5 mr-3" />
                      Your channel
                    </Button>
                  </Link>
                ) : (
                  <div className="px-2 py-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => setisdialogeopen(true)}
                    >
                      Create Channel
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
      
      <Channeldialogue
        isopen={isdialogeopen}
        onclose={() => setisdialogeopen(false)}
        mode="create"
      />
    </aside>
  );
};

export default Sidebar;