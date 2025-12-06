"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Disc, Activity, Code2, Music } from "lucide-react";

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

export default function DiscordActivity() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        console.log("Lanyard API Response:", json);
        if (json.success) {
          setData(json.data);
        } else {
          console.error("Lanyard API returned success: false", json);
        }
      } catch (error) {
        console.error("Failed to fetch Lanyard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="relative py-24 px-4 md:px-20 overflow-hidden border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-12 h-[400px] flex items-center justify-center">
            <span className="text-accent">Loading Discord Status...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="relative py-24 px-4 md:px-20 overflow-hidden border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-900/20 via-black to-black border border-indigo-500/20 rounded-2xl p-8 md:p-12 overflow-hidden">
            <div className="text-center py-12">
              <p className="text-accent mb-2">Discord Status Unavailable</p>
              <p className="text-sm text-accent/70">
                Make sure you've joined the Lanyard Discord server
              </p>
              <a 
                href="https://discord.gg/lanyard" 
                target="_blank"
                className="text-indigo-400 hover:text-indigo-300 text-sm mt-4 inline-block"
              >
                Join Lanyard Server →
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const statusColor = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-500",
  };

  const statusText = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline",
  };

  const spotify = data.spotify;
  const vsCode = data.activities.find((act) => act.name === "Visual Studio Code" || act.name === "Cursor");

  const avatarUrl = data.discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discord_user.discriminator) % 5}.png`;

  return (
    <section className="relative py-24 px-4 md:px-20 overflow-hidden border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-indigo-900/20 via-black to-black border border-indigo-500/20 rounded-2xl p-8 md:p-12 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(99, 102, 241, 0.5)",
                        "0 0 40px rgba(99, 102, 241, 0.8)",
                        "0 0 20px rgba(99, 102, 241, 0.5)",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/50"
                  >
                    <Image 
                      src={avatarUrl} 
                      alt={data.discord_user.username} 
                      fill 
                      className="object-cover"
                    />
                    <div className={`absolute bottom-0 right-0 w-8 h-8 ${statusColor[data.discord_status]} rounded-full border-4 border-black`} />
                  </motion.div>
                  
                  {/* Decorative Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-spin-slow" />
                </div>

                {/* Nameplate */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-1">{data.discord_user.username}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusColor[data.discord_status]} animate-pulse`} />
                    <span className="text-sm text-accent">{statusText[data.discord_status]}</span>
                  </div>
                </div>
              </div>

              {/* Activity Section */}
              <div className="md:col-span-2 space-y-4">
                {spotify && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image src={spotify.album_art_url} alt="Album Art" fill className="object-cover" />
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <Music className="text-green-400" size={24} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Disc size={14} className="text-green-400 animate-spin" />
                        <span className="text-xs text-green-400 font-bold uppercase">Listening to Spotify</span>
                      </div>
                      <p className="text-white font-bold truncate">{spotify.song}</p>
                      <p className="text-accent text-sm truncate">{spotify.artist}</p>
                    </div>
                  </motion.div>
                )}

                {vsCode && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Code2 size={32} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity size={14} className="text-blue-400" />
                        <span className="text-xs text-blue-400 font-bold uppercase">Coding</span>
                      </div>
                      <p className="text-white font-bold truncate">{vsCode.details || vsCode.name}</p>
                      {vsCode.state && (
                        <p className="text-accent text-sm truncate">{vsCode.state}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {!spotify && !vsCode && (
                  <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                    <p className="text-accent">No current activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

