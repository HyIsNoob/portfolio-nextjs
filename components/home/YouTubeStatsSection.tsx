"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Play } from "lucide-react";
import Link from "next/link";

function CountUpNumber({ value, duration = 2 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * value);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    setDisplayValue(0);
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  const formatted = displayValue >= 1000 
    ? `${(displayValue / 1000).toFixed(1)}K` 
    : displayValue.toString();

  return (
    <motion.span 
      key={value}
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-6xl md:text-8xl font-bold"
    >
      {formatted}
    </motion.span>
  );
}

export default function YouTubeStatsSection() {
  const [subscribers, setSubscribers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch(`/api/youtube-stats`);
        if (response.ok) {
          const data = await response.json();
          setSubscribers(data.subscriberCount);
          setDisplayValue(data.subscriberCount);
        }
      } catch (error) {
        console.error("Failed to fetch YouTube stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
    const interval = setInterval(fetchSubscribers, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (subscribers !== null) {
      setDisplayValue(subscribers);
    }
  }, [subscribers]);

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
          <Link 
            href="https://youtube.com/@hyisnoob1102"
            target="_blank"
            className="group block"
          >
            <div className="relative bg-gradient-to-br from-red-900/20 via-black to-black border border-red-500/20 rounded-2xl p-12 md:p-16 overflow-hidden cursor-none">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 animate-pulse" />
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left Side - Icon & Label */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center"
                    >
                      <Play fill="white" size={32} />
                    </motion.div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-black animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold uppercase mb-2">YouTube Channel</h3>
                    <p className="text-accent text-sm">@hyisnoob1102</p>
                  </div>
                </div>

                {/* Center - Stats */}
                <div className="flex flex-col items-center gap-4">
                  {loading ? (
                    <div className="text-6xl md:text-8xl font-bold">...</div>
                  ) : (
                    <motion.div
                      key={subscribers}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-baseline gap-2"
                    >
                      <CountUpNumber value={displayValue} duration={2} />
                      <span className="text-2xl md:text-4xl text-accent font-bold">Subscribers</span>
                    </motion.div>
                  )}
                  
                  <div className="flex items-center gap-2 text-green-400">
                    <TrendingUp size={20} />
                    <span className="text-sm font-bold">Growing</span>
                  </div>
                </div>

                {/* Right Side - CTA */}
                <div className="flex items-center gap-4">
                  <Users size={24} className="text-red-500" />
                  <span className="text-lg font-bold uppercase group-hover:text-red-400 transition-colors">
                    Watch Now →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

