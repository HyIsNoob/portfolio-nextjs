"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className }: GlitchTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("relative inline-block overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <motion.span
          className="block"
          animate={{
            x: isHovered ? [-2, 2, -1, 0] : 0,
            y: isHovered ? [1, -1, 0] : 0,
          }}
          transition={{
             repeat: isHovered ? Infinity : 0,
             duration: 0.2,
             ease: "linear"
          }}
        >
          {text}
        </motion.span>
        
        {/* Glitch Layer 1 (Red) */}
        <motion.span
          className="absolute top-0 left-0 text-red-500 opacity-70 mix-blend-screen pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovered ? 0.7 : 0,
            x: isHovered ? [2, -2, 0] : 0,
            y: isHovered ? [-1, 1, 0] : 0,
          }}
          transition={{
             repeat: isHovered ? Infinity : 0,
             duration: 0.15,
             ease: "linear"
          }}
        >
          {text}
        </motion.span>

        {/* Glitch Layer 2 (Blue) */}
        <motion.span
          className="absolute top-0 left-0 text-blue-500 opacity-70 mix-blend-screen pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovered ? 0.7 : 0,
            x: isHovered ? [-2, 2, 0] : 0,
            y: isHovered ? [1, -1, 0] : 0,
          }}
          transition={{
             repeat: isHovered ? Infinity : 0,
             duration: 0.15,
             delay: 0.05,
             ease: "linear"
          }}
        >
          {text}
        </motion.span>
      </div>
    </div>
  );
}

