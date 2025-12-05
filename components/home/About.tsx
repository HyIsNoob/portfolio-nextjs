"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function About() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={container} className="min-h-screen flex items-center justify-center py-24 px-4 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full max-w-7xl">
        {/* Image Section */}
        <div className="relative w-full aspect-square md:aspect-[3/4] group overflow-hidden">
          <motion.div style={{ y }} className="w-full h-full relative">
             <div className="w-full h-full transition-all duration-700 filter grayscale group-hover:grayscale-0 group-hover:scale-105">
                <Image
                    src="/avt.jpg"
                    alt={PORTFOLIO_DATA.personal.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
             </div>
             {/* Blue Glow Effect on Hover */}
             <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay" />
          </motion.div>
        </div>

        {/* Text Section */}
        <div className="space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold uppercase leading-none"
          >
            {PORTFOLIO_DATA.about.title}
          </motion.h2>
          
          <div className="space-y-6 text-lg md:text-xl text-accent">
            <motion.p
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.2 }}
            >
                {PORTFOLIO_DATA.about.description}
            </motion.p>

            <ul className="space-y-2 mt-4">
                {PORTFOLIO_DATA.about.details.map((detail, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                        className="flex items-center gap-4"
                    >
                        <span className="w-2 h-2 bg-white rounded-full" />
                        {detail}
                    </motion.li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

