"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { ArrowUpRight, Gamepad2, Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";

const games = PORTFOLIO_DATA.games;

export default function GameSection() {
  const [activeGame, setActiveGame] = useState(0);
  const [activeImages, setActiveImages] = useState<Record<number, number>>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={sectionRef} className="relative min-h-screen py-24 px-4 md:px-20 bg-[#050505] overflow-hidden border-t border-white/5">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-16">
             <Gamepad2 className="text-accent" size={24} />
             <h2 className="text-sm md:text-base uppercase tracking-widest text-accent">Game Development</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Game Visuals */}
            <div className="order-2 lg:order-1 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeGame}-${activeImages[activeGame] || 0}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl group"
                    >
                        <Image 
                            src={games[activeGame].gallery[activeImages[activeGame] || 0]} 
                            alt={games[activeGame].title} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Award Badge */}
                        <div className="absolute top-4 left-4 bg-yellow-500/90 text-black px-3 py-1 rounded-full flex items-center gap-2 font-bold text-xs uppercase backdrop-blur-sm shadow-lg">
                            <Trophy size={14} /> Game of The Lab
                        </div>

                        {/* Overlay Gallery Hint */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="uppercase tracking-widest text-sm font-bold border border-white/50 px-4 py-2 rounded-full">View on Itch.io</span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Gallery Thumbnails */}
                <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                    {games[activeGame].gallery.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setActiveImages(prev => ({ ...prev, [activeGame]: idx }));
                            }}
                            className={`relative w-24 h-16 shrink-0 rounded-md overflow-hidden border transition-all ${
                                (activeImages[activeGame] ?? 0) === idx
                                    ? 'border-white opacity-100 scale-105' 
                                    : 'border-white/10 opacity-60 hover:opacity-100'
                            }`}
                        >
                            <Image src={img} alt="Thumbnail" fill className="object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Game Info */}
            <div className="order-1 lg:order-2 space-y-8">
                <div className="flex gap-8 border-b border-white/10 pb-4">
                    {games.map((game, index) => (
                        <button 
                            key={index}
                            onClick={() => {
                                setActiveGame(index);
                                if (activeImages[index] === undefined) {
                                    setActiveImages(prev => ({ ...prev, [index]: 0 }));
                                }
                            }}
                            className={`text-2xl md:text-4xl font-bold uppercase transition-colors ${activeGame === index ? 'text-white' : 'text-white/20 hover:text-white/50'}`}
                        >
                            {game.title}
                        </button>
                    ))}
                </div>

                <motion.div
                    key={activeGame}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <p className="text-accent text-lg leading-relaxed">
                        {games[activeGame].longDescription}
                    </p>

                    <div className="space-y-3">
                        <h4 className="text-sm uppercase tracking-widest text-white/60">Key Features</h4>
                        <ul className="space-y-2">
                            {games[activeGame].features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-300">
                                    <ChevronRight size={16} className="mt-1 text-blue-500 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                        {games[activeGame].tech.map((tech, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-accent font-mono">
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="pt-6">
                        <Link 
                            href={games[activeGame].link}
                            target="_blank"
                            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
                        >
                            Play on Itch.io <ArrowUpRight size={18} />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
      </div>
    </section>
  );
}

