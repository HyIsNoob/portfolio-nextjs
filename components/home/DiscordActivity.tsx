"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Disc, Activity, Code2, Music, Monitor, Smartphone, Globe, Users } from "lucide-react";

interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    global_name?: string;
    display_name?: string;
    avatar_decoration_data?: {
      sku_id: string;
      asset: string;
      expires_at: number | null;
    };
    collectibles?: {
      nameplate?: {
        label: string;
        sku_id: string;
        asset: string;
        expires_at: number | null;
        palette?: string;
      };
    };
    primary_guild?: {
      tag: string;
      identity_guild_id: string;
      badge: string;
      identity_enabled: boolean;
    };
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
  active_on_discord_web?: boolean;
  active_on_discord_desktop?: boolean;
  active_on_discord_mobile?: boolean;
  kv?: Record<string, string>;
}

const DISCORD_ID = "534002704327114763";

export default function DiscordActivity() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket("wss://api.lanyard.rest/socket");
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("Lanyard WebSocket connected");
          setConnected(true);
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);

          if (message.op === 1) {
            const heartbeatInterval = message.d.heartbeat_interval;
            ws.send(JSON.stringify({
              op: 2,
              d: {
                subscribe_to_id: DISCORD_ID,
              },
            }));

            heartbeatRef.current = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 }));
              }
            }, heartbeatInterval);
          }

          if (message.op === 0) {
            if (message.t === "INIT_STATE") {
              if (message.d) {
                setData(message.d);
                setLoading(false);
              }
            } else if (message.t === "PRESENCE_UPDATE") {
              setData(message.d);
            }
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setConnected(false);
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected, reconnecting...");
          setConnected(false);
          if (heartbeatRef.current) {
            clearInterval(heartbeatRef.current);
          }
          setTimeout(connectWebSocket, 5000);
        };
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
        fetchFallback();
      }
    };

    const fetchFallback = async () => {
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

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
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
    ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.webp?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discord_user.discriminator || "0") % 5}.png`;

  const decorationUrl = data.discord_user.avatar_decoration_data
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${data.discord_user.avatar_decoration_data.asset}.png`
    : null;

  const nameplateUrl = data.discord_user.collectibles?.nameplate
    ? `https://cdn.discordapp.com/${data.discord_user.collectibles.nameplate.asset}`
    : null;

  const displayName = data.discord_user.display_name || data.discord_user.global_name || data.discord_user.username;

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

            {/* Connection Status */}
            {connected && (
              <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            )}

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
                      alt={displayName} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                    {decorationUrl && (
                      <div className="absolute inset-0">
                        <Image 
                          src={decorationUrl} 
                          alt="Decoration" 
                          fill 
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className={`absolute bottom-0 right-0 w-8 h-8 ${statusColor[data.discord_status]} rounded-full border-4 border-black`} />
                  </motion.div>
                  
                  {/* Decorative Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-spin-slow" />
                </div>

                {/* Nameplate */}
                {nameplateUrl && (
                  <div className="relative w-full h-8 mb-2">
                    <Image 
                      src={nameplateUrl} 
                      alt="Nameplate" 
                      fill 
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}

                {/* User Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-1">{displayName}</h3>
                  {data.discord_user.primary_guild && (
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className="text-xs text-indigo-400 font-bold">
                        {data.discord_user.primary_guild.tag}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${statusColor[data.discord_status]} animate-pulse`} />
                    <span className="text-sm text-accent">{statusText[data.discord_status]}</span>
                  </div>
                  
                  {/* Platform Indicators */}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {data.active_on_discord_desktop && (
                      <div title="Desktop">
                        <Monitor size={14} className="text-indigo-400" />
                      </div>
                    )}
                    {data.active_on_discord_mobile && (
                      <div title="Mobile">
                        <Smartphone size={14} className="text-indigo-400" />
                      </div>
                    )}
                    {data.active_on_discord_web && (
                      <div title="Web">
                        <Globe size={14} className="text-indigo-400" />
                      </div>
                    )}
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
                      <Image 
                        src={spotify.album_art_url} 
                        alt="Album Art" 
                        fill 
                        className="object-cover"
                        unoptimized
                      />
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

                {data.activities.filter(act => act.name !== "Visual Studio Code" && act.name !== "Cursor" && act.type === 0).map((activity, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Activity size={32} className="text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-purple-400 font-bold uppercase">Playing</span>
                      </div>
                      <p className="text-white font-bold truncate">{activity.name}</p>
                      {activity.details && (
                        <p className="text-accent text-sm truncate">{activity.details}</p>
                      )}
                      {activity.state && (
                        <p className="text-accent text-xs truncate">{activity.state}</p>
                      )}
                    </div>
                  </motion.div>
                ))}

                {!spotify && !vsCode && data.activities.filter(act => act.type === 0).length === 0 && (
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
