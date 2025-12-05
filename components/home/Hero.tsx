"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function Hero() {
  const name = PORTFOLIO_DATA.personal.name.split(" ");
  const role = PORTFOLIO_DATA.personal.role;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 2.6 }, // Delay adjusted for preloader (2.5s)
    }),
  };

  // Optimized animation variants with will-change to prevent layout thrashing
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 50,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  } as const;

  return (
    <section 
        className="group relative h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 will-change-transform"
        onMouseMove={handleMouseMove}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
        }}
      />

      {/* Name Animation */}
      <motion.div
        className="z-10 flex flex-wrap justify-center gap-x-4 md:gap-x-8 overflow-hidden"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {name.map((word, index) => (
          <motion.h1
            key={index}
            variants={child}
            className="text-[12vw] leading-[0.9] font-bold tracking-tighter text-center mix-blend-difference"
          >
            {word}
          </motion.h1>
        ))}
      </motion.div>

      {/* Role Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 0.8, ease: "easeOut" }}
        className="z-10 mt-8 text-accent text-sm md:text-xl tracking-widest uppercase text-center"
      >
        {role}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-1 h-10 bg-gradient-to-b from-white to-transparent opacity-50"
        />
      </motion.div>
    </section>
  );
}
