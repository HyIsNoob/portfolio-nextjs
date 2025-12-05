"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { Play, X } from "lucide-react";
import Image from "next/image";

const videos = PORTFOLIO_DATA.videos;

export default function VideoGallery() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={sectionRef} className="relative min-h-screen py-24 px-4 md:px-20 bg-black overflow-hidden">
      <div className="flex items-center justify-between mb-16">
        <div className="flex flex-col gap-2">
            <h2 className="text-sm md:text-base uppercase tracking-widest text-accent">
                Video Editing
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold uppercase">
                Cinematic Showreel
            </h3>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos?.map((video, index) => (
            <motion.div
                key={index}
                style={{ y: index % 2 === 0 ? 0 : y }}
                className="group relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer border border-white/10"
                onClick={() => setActiveVideo(video.id)}
            >
                <Image 
                    src={video.thumbnail} 
                    alt={video.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                        <Play fill="white" className="ml-1 text-white" />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white font-bold uppercase text-lg">{video.title}</h4>
                </div>
            </motion.div>
        ))}
      </div>

      {/* Video Modal (Cinema Mode) */}
      <AnimatePresence>
        {activeVideo && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-20"
                onClick={() => setActiveVideo(null)}
            >
                <button 
                    className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors"
                    onClick={() => setActiveVideo(null)}
                >
                    <X size={32} />
                </button>

                <div className="w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                    />
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

