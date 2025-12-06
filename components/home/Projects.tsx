"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { ArrowUpRight, X } from "lucide-react";

const projects = PORTFOLIO_DATA.projects;

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);

  return (
    <section className="relative min-h-screen py-32 px-4 md:px-20 flex flex-col justify-center">
      <div className="mb-16 border-b border-white/10 pb-8">
        <h2 className="text-sm md:text-base uppercase tracking-widest text-accent">Featured Works</h2>
      </div>

      <div className="flex flex-col group/list">
        {projects.map((project, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            onClick={() => setSelectedProject(project)}
            className="group/item relative border-b border-white/10 py-12 md:py-16 transition-all duration-500 hover:px-4 hover:border-white/30"
          >
            <div className="flex items-center justify-between pointer-events-none">
                <div className="flex items-baseline gap-8 md:gap-16">
                    <span className="text-xl md:text-2xl text-accent font-mono">0{index + 1}</span>
                    <h3 className="text-4xl md:text-7xl font-bold uppercase transition-transform duration-500 group-hover/item:translate-x-4">
                        {project.title}
                    </h3>
                </div>
                <div className="flex items-center gap-4">
                    <span className="hidden md:block text-sm md:text-base text-accent group-hover/item:text-white transition-colors">
                        {project.category}
                    </span>
                    <ArrowUpRight className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                </div>
            </div>
            <div className="mt-4 md:ml-24 max-w-lg overflow-hidden h-0 opacity-0 group-hover/item:opacity-100 group-hover/item:h-auto transition-all duration-500 pointer-events-none">
                <p className="text-accent transform translate-y-full group-hover/item:translate-y-0 transition-transform duration-500 delay-75">
                    {project.description}
                </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                onClick={() => setSelectedProject(null)}
            >
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#111] w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-white/10 rounded-xl p-8 md:p-12 relative"
                >
                    <button 
                        onClick={() => setSelectedProject(null)}
                        className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="mb-8">
                        <span className="text-accent text-sm uppercase tracking-widest">{selectedProject.category}</span>
                        <h3 className="text-4xl md:text-6xl font-bold mt-2 uppercase mb-6">{selectedProject.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {selectedProject.tech?.map((tech, i) => (
                                <span key={i} className="px-3 py-1 border border-white/10 rounded-full text-xs text-accent">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <p className="text-lg text-gray-300 leading-relaxed">
                                {selectedProject.longDescription || selectedProject.description}
                            </p>
                            
                            <Link 
                                href={selectedProject.link}
                                target="_blank"
                                className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:opacity-70 transition-opacity mt-4"
                            >
                                View Project <ArrowUpRight size={16} />
                            </Link>
                        </div>
                        <div className="aspect-video relative bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5">
                             {/* Image placeholder - would be real image in production */}
                             <div className="w-full h-full flex items-center justify-center flex-col gap-4">
                                <span className="text-4xl font-bold text-white/10">{selectedProject.title}</span>
                             </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
