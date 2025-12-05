"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Disc, Activity, Code2 } from "lucide-react";

// Lanyard API types
interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: {
    type: number;
    name: string;
    state?: string;
    details?: string;
    assets?: {
      large_image?: string;
      small_image?: string;
    };
  }[];
  listening_to_spotify: boolean;
  spotify?: {
    track_id: string;
    timestamps: {
      start: number;
      end: number;
    };
    song: string;
    artist: string;
    album_art_url: string;
  };
}

const DISCORD_ID = "534002704327114763";

export default function DiscordStatus() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch Lanyard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Poll every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;
  if (!data) return null;

  const statusColor = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-500",
  };

  const spotify = data.spotify;
  const vsCode = data.activities.find((act) => act.name === "Visual Studio Code" || act.name === "Cursor");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 z-40 hidden md:flex flex-col items-end gap-4"
    >
      {/* Spotify Activity */}
      {spotify && (
        <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 p-3 rounded-lg flex items-center gap-3 max-w-xs shadow-2xl">
          <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 animate-spin-slow">
             <Image src={spotify.album_art_url} alt="Album Art" fill className="object-cover" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-green-400 font-bold flex items-center gap-1">
                <Disc size={10} className="animate-spin" /> Listening to Spotify
            </p>
            <p className="text-sm text-white truncate font-medium">{spotify.song}</p>
            <p className="text-xs text-accent truncate">{spotify.artist}</p>
          </div>
        </div>
      )}

      {/* VS Code / Coding Activity */}
      {vsCode && (
        <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 p-3 rounded-lg flex items-center gap-3 max-w-xs shadow-2xl">
          <div className="bg-blue-500/20 p-2 rounded-md text-blue-400">
             <Code2 size={20} />
          </div>
          <div className="overflow-hidden">
             <p className="text-xs text-blue-400 font-bold flex items-center gap-1">
                <Activity size={10} /> Coding
             </p>
             <p className="text-sm text-white truncate font-medium">{vsCode.details}</p>
             <p className="text-xs text-accent truncate">{vsCode.state}</p>
          </div>
        </div>
      )}

      {/* Discord User Status */}
      <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5">
         <div className="relative">
            <div className={`w-2.5 h-2.5 rounded-full ${statusColor[data.discord_status]} animate-pulse`} />
         </div>
         <span className="text-xs font-mono uppercase text-white/60">
            {data.discord_status === 'dnd' ? 'Do Not Disturb' : data.discord_status}
         </span>
      </div>
    </motion.div>
  );
}

