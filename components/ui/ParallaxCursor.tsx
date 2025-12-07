"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function ParallaxCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 100 });
  
  const layer1X = useTransform(smoothX, (v) => v * 0.3);
  const layer1Y = useTransform(smoothY, (v) => v * 0.3);
  const layer2X = useTransform(smoothX, (v) => v * 0.2);
  const layer2Y = useTransform(smoothY, (v) => v * 0.2);
  const layer3X = useTransform(smoothX, (v) => v * 0.1);
  const layer3Y = useTransform(smoothY, (v) => v * 0.1);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const deltaX = (clientX - centerX) / centerX;
      const deltaY = (clientY - centerY) / centerY;
      
      mouseX.set(deltaX * 50);
      mouseY.set(deltaY * 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Layer 1 - Fastest (closest) */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          x: layer1X,
          y: layer1Y,
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Layer 2 - Medium */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          x: layer2X,
          y: layer2Y,
        }}
      >
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </motion.div>

      {/* Layer 3 - Slowest (farthest) */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          x: layer3X,
          y: layer3Y,
        }}
      >
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
      </motion.div>
    </div>
  );
}

