"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

const YOUTUBE_CHANNEL_ID = "UCDabE6mnD9G-1xljiTszRoA";

export default function YouTubeStats() {
  const [subscribers, setSubscribers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch(`/api/youtube-stats`);
        if (response.ok) {
          const data = await response.json();
          setSubscribers(data.subscriberCount);
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

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-accent">
        <Users size={16} />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!subscribers) return null;

  const formattedCount = subscribers >= 1000 
    ? `${(subscribers / 1000).toFixed(1)}K` 
    : subscribers.toString();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2"
    >
      <Users size={16} className="text-red-500" />
      <span className="text-sm font-bold">
        {formattedCount} <span className="text-accent font-normal">Subscribers</span>
      </span>
    </motion.div>
  );
}

