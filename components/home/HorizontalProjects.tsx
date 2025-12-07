"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { ArrowUpRight, X } from "lucide-react";
import GlitchText from "../ui/GlitchText";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";

const projects = PORTFOLIO_DATA.projects;

export default function HorizontalProjects() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-85%"]);

  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute top-10 left-10 md:top-20 md:left-20 z-10">
             <h2 className="text-sm md:text-base uppercase tracking-widest text-accent">Selected Works</h2>
        </div>

        <motion.div style={{ x }} className="flex gap-8 md:gap-16 px-8 md:px-20 pl-[20vw]">
          {projects.map((project, index) => (
            <div 
                key={index}
                className="group relative h-[60vh] w-[80vw] md:w-[40vw] flex-shrink-0 overflow-hidden bg-[#111] border border-white/10"
                onClick={() => {
                    setSelectedProject(project);
                    setActiveImage(0);
                }}
            >
              <div className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-40">
                <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                 <span className="text-accent font-mono text-xl mb-2">0{index + 1}</span>
                 <GlitchText text={project.title} className="text-4xl md:text-6xl font-bold uppercase mb-4" />
                 
                 {/* Tech Stack Preview */}
                 <div className="flex flex-wrap gap-2 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    {project.tech?.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs">
                            {tech}
                        </span>
                    ))}
                 </div>
              </div>

              {/* Hover Reveal Button */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center font-bold uppercase text-xs scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                      View
                  </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                onClick={() => setSelectedProject(null)}
            >
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0a0a0a] w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-white/10 rounded-none md:rounded-xl relative flex flex-col lg:flex-row"
                >
                    <button 
                        onClick={() => setSelectedProject(null)}
                        className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Image Side with Gallery Support */}
                    <div className="w-full lg:w-3/5 relative bg-black/20 flex flex-col">
                        <div className="relative h-[300px] lg:h-[500px] w-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0"
                                >
                                    <Image 
                                        src={selectedProject.gallery ? selectedProject.gallery[activeImage] : selectedProject.image} 
                                        alt={selectedProject.title} 
                                        fill 
                                        className="object-contain p-4"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Gallery Thumbnails */}
                        {selectedProject.gallery && selectedProject.gallery.length > 1 && (
                            <div className="flex gap-2 p-4 overflow-x-auto border-t border-white/5 bg-black/40">
                                {selectedProject.gallery.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative w-20 h-14 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-blue-500' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    >
                                        <Image src={img} alt="thumb" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-[#0a0a0a]">
                        <span className="text-accent text-sm uppercase tracking-widest mb-2">{selectedProject.category}</span>
                        <h3 className="text-3xl md:text-5xl font-bold uppercase mb-6">{selectedProject.title}</h3>
                        
                        {/* Award Badge */}
                        {(selectedProject as any).award && (
                            <div className="mb-6 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold uppercase backdrop-blur-sm">
                                <span>🏆</span>
                                <span>{(selectedProject as any).award}</span>
                            </div>
                        )}
                        
                        <div className="prose prose-invert prose-sm max-w-none mb-8 text-gray-300">
                            <p className="leading-relaxed">
                                {selectedProject.longDescription || selectedProject.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-10">
                            {selectedProject.tech?.map((tech, i) => (
                                <span key={i} className="px-3 py-1 border border-white/10 rounded-full text-xs text-accent">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <Link 
                            href={selectedProject.link}
                            target="_blank"
                            className="inline-flex items-center gap-2 text-black bg-white px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors w-fit"
                        >
                            Visit Project <ArrowUpRight size={18} />
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
