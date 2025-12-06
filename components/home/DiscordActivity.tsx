"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Activity, Code2, Monitor, Smartphone, Globe, Youtube, Github, Facebook, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PORTFOLIO_DATA } from "@/data/portfolio";

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

  const vsCode = data.activities.find((act) => act.name === "Visual Studio Code" || act.name === "Cursor");

  const avatarUrl = data.discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.webp?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discord_user.discriminator || "0") % 5}.png`;

  const decorationUrl = data.discord_user.avatar_decoration_data
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${data.discord_user.avatar_decoration_data.asset}.png`
    : null;

  const nameplateUrl = data.discord_user.collectibles?.nameplate
    ? (() => {
        const asset = data.discord_user.collectibles.nameplate.asset;
        if (asset.endsWith('.png') || asset.endsWith('.webp') || asset.endsWith('.jpg')) {
          return `https://cdn.discordapp.com/${asset}`;
        }
        if (asset.endsWith('/')) {
          return `https://cdn.discordapp.com/${asset.slice(0, -1)}.png`;
        }
        return `https://cdn.discordapp.com/${asset}.png`;
      })()
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
          <div className="bg-gradient-to-br from-indigo-900/20 via-black to-black border border-indigo-500/20 rounded-2xl p-6 md:p-8 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />

            {/* Connection Status */}
            {connected && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-green-400">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            )}

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar Section */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 w-full md:w-auto shrink-0">
                <div className="relative shrink-0">
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(99, 102, 241, 0.5)",
                        "0 0 40px rgba(99, 102, 241, 0.8)",
                        "0 0 20px rgba(99, 102, 241, 0.5)",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-visible border-3 border-indigo-500/50"
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image 
                        src={avatarUrl} 
                        alt={displayName} 
                        fill 
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    {decorationUrl && (
                      <div className="absolute inset-0 pointer-events-none">
                        <Image 
                          src={decorationUrl} 
                          alt="Decoration" 
                          fill 
                          className="object-cover scale-110"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className={`absolute bottom-0 right-0 w-6 h-6 md:w-7 md:h-7 ${statusColor[data.discord_status]} rounded-full border-3 border-black z-10`} />
                  </motion.div>
                  
                  {/* Decorative Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-spin-slow pointer-events-none" />
                </div>

                {/* User Info - Compact */}
                <div className="flex-1 md:flex-none text-left min-w-0">
                  <h3 className="text-lg md:text-xl font-bold mb-0.5 uppercase truncate">{displayName}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {data.discord_user.primary_guild && (
                      <span className="text-xs text-indigo-400 font-bold">
                        {data.discord_user.primary_guild.tag}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusColor[data.discord_status]} animate-pulse`} />
                      <span className="text-xs text-accent">{statusText[data.discord_status]}</span>
                    </div>
                    {(data.active_on_discord_desktop || data.active_on_discord_mobile || data.active_on_discord_web) && (
                      <div className="flex items-center gap-1.5 ml-1">
                        {data.active_on_discord_desktop && (
                          <div title="Desktop">
                            <Monitor size={12} className="text-indigo-400" />
                          </div>
                        )}
                        {data.active_on_discord_mobile && (
                          <div title="Mobile">
                            <Smartphone size={12} className="text-indigo-400" />
                          </div>
                        )}
                        {data.active_on_discord_web && (
                          <div title="Web">
                            <Globe size={12} className="text-indigo-400" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Activity Section */}
              <div className="flex-1 space-y-3 w-full min-w-0">
                {vsCode && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg p-3 flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Code2 size={24} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Activity size={12} className="text-blue-400" />
                        <span className="text-xs text-blue-400 font-bold uppercase">Coding</span>
                      </div>
                      <p className="text-white text-sm font-bold truncate">{vsCode.details || vsCode.name}</p>
                      {vsCode.state && (
                        <p className="text-accent text-xs truncate">{vsCode.state}</p>
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
                    className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Activity size={24} className="text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs text-purple-400 font-bold uppercase">Playing</span>
                      </div>
                      <p className="text-white text-sm font-bold truncate">{activity.name}</p>
                      {activity.details && (
                        <p className="text-accent text-xs truncate">{activity.details}</p>
                      )}
                      {activity.state && (
                        <p className="text-accent text-xs truncate">{activity.state}</p>
                      )}
                    </div>
                  </motion.div>
                ))}

                {!vsCode && data.activities.filter(act => act.type === 0).length === 0 && (
                  <div className="space-y-3">
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center">
                      <p className="text-accent text-sm mb-3">No current activity</p>
                    </div>
                    
                    {/* Social Links */}
                    <div className="bg-black/40 backdrop-blur-sm border border-indigo-500/20 rounded-lg p-4">
                      <h4 className="text-xs text-indigo-400 font-bold uppercase mb-3">Connect</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {PORTFOLIO_DATA.socials.slice(0, 4).map((social, idx) => (
                          <Link
                            key={idx}
                            href={social.link}
                            target="_blank"
                            className="flex items-center gap-2 p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors group"
                          >
                            {social.name === "YouTube" && <Youtube size={16} className="text-red-500" />}
                            {social.name === "GitHub" && <Github size={16} className="text-white" />}
                            {social.name === "Facebook" && <Facebook size={16} className="text-blue-500" />}
                            {social.name === "TikTok" && <Activity size={16} className="text-white" />}
                            <span className="text-xs text-white group-hover:text-indigo-400 transition-colors truncate">
                              {social.name}
                            </span>
                            <ExternalLink size={12} className="text-accent/50 ml-auto" />
                          </Link>
                        ))}
                      </div>
                    </div>
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
