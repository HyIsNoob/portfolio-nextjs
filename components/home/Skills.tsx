"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { PORTFOLIO_DATA } from "@/data/portfolio";

interface ParallaxProps {
  children: string;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax flex overflow-hidden whitespace-nowrap py-4">
      <motion.div className="flex gap-16 text-[10vw] md:text-[8vw] font-bold uppercase leading-none" style={{ x }}>
        <span className="block mr-8 text-white/20">{children}</span>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8 text-white/20">{children}</span>
        <span className="block mr-8">{children}</span>
      </motion.div>
    </div>
  );
}

export default function Skills() {
  const { creative, technical } = PORTFOLIO_DATA.skills;
  const allSkills = [...creative, ...technical].join(" — ");

  return (
    <section className="py-20 md:py-40 overflow-hidden flex flex-col justify-center">
      <div className="mb-12 px-4 md:px-20 text-center md:text-left">
         <h2 className="text-sm md:text-base uppercase tracking-widest text-accent">Capabilities</h2>
      </div>
      
      <div className="relative">
        <ParallaxText baseVelocity={-2}>CREATIVE EDITING</ParallaxText>
        <ParallaxText baseVelocity={2}>TECHNICAL DEVELOPMENT</ParallaxText>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 px-4 md:px-20 max-w-6xl mx-auto w-full">
         <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b border-white/20 pb-4">CREATIVE</h3>
            <div className="flex flex-wrap gap-3">
                {creative.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 border border-white/10 rounded-full text-sm text-accent hover:text-white hover:border-white/40 transition-colors cursor-default">
                        {skill}
                    </span>
                ))}
            </div>
         </div>
         <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b border-white/20 pb-4">TECHNICAL</h3>
             <div className="flex flex-wrap gap-3">
                {technical.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 border border-white/10 rounded-full text-sm text-accent hover:text-white hover:border-white/40 transition-colors cursor-default">
                        {skill}
                    </span>
                ))}
            </div>
         </div>
      </div>
    </section>
  );
}

