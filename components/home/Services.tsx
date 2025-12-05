"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function Services() {
  const services = PORTFOLIO_DATA.services;

  return (
    <section className="py-24 px-4 md:px-20 border-b border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1">
            <h2 className="text-sm md:text-base uppercase tracking-widest text-accent sticky top-32">
                Services
            </h2>
        </div>
        
        <div className="md:col-span-2 grid grid-cols-1 gap-16">
            {services?.map((service, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group border-t border-white/10 pt-8"
                >
                    <div className="flex flex-col md:flex-row justify-between gap-6 md:items-start">
                        <h3 className="text-3xl md:text-4xl font-bold uppercase max-w-xs">
                            {service.title}
                        </h3>
                        <div className="flex-1 max-w-md">
                            <p className="text-accent mb-6 leading-relaxed">
                                {service.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {service.tags.map((tag, idx) => (
                                    <span key={idx} className="text-xs border border-white/10 px-2 py-1 rounded-full text-white/60">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}

