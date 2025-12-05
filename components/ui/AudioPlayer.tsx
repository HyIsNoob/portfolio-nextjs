"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import Magnetic from "./Magnetic";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    // Optional: Auto-play handling (browsers often block this without interaction)
    // We'll leave it as manual toggle for better UX
    if (audioRef.current) {
        audioRef.current.volume = 0.5;
    }
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-50 mix-blend-difference text-white">
      <audio ref={audioRef} src="/bg.mp3" loop />
      <Magnetic>
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-12 h-12 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
        >
          <motion.div
            animate={{
              scale: isPlaying ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: isPlaying ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </motion.div>
        </button>
      </Magnetic>
    </div>
  );
}

