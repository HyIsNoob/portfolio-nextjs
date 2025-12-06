"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Magnetic from "../ui/Magnetic";
import YouTubeStats from "../ui/YouTubeStats";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function Footer() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);

  return (
    <footer 
        ref={container}
        className="relative h-[80vh] bg-[#080808] flex flex-col justify-between px-4 md:px-20 py-12 overflow-hidden"
    >
      {/* Parallax Background Content */}
      <motion.div style={{ y }} className="absolute inset-0 w-full h-full flex flex-col justify-end pb-24 pointer-events-none opacity-20">
         <h2 className="text-[15vw] font-bold text-center leading-none text-white/5 uppercase">
            Contact
         </h2>
      </motion.div>

      <div className="z-10 flex flex-col md:flex-row justify-between items-start md:items-center pt-20">
        <div className="flex flex-col gap-4">
            <h3 className="text-accent uppercase tracking-widest text-sm">Get in touch</h3>
            <Link 
                href={`mailto:${PORTFOLIO_DATA.personal.email}`}
                className="text-4xl md:text-6xl font-bold hover:text-gray-300 transition-colors"
            >
                {PORTFOLIO_DATA.personal.email}
            </Link>
        </div>
      </div>

      <div className="z-10 flex flex-col items-center justify-center gap-8 flex-grow">
        <Magnetic strength={0.3}>
          <Link href={`mailto:${PORTFOLIO_DATA.personal.email}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="relative px-12 py-6 bg-gradient-to-r from-white to-gray-200 text-black font-bold text-xl md:text-2xl uppercase tracking-widest rounded-full overflow-hidden">
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  style={{ backgroundSize: "200% 100%" }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  Let's Create Together
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </div>
              
              <div className="absolute -inset-1 bg-gradient-to-r from-white via-gray-400 to-white rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </motion.div>
          </Link>
        </Magnetic>
      </div>

      <div className="z-10 grid grid-cols-2 md:flex md:justify-between items-end gap-8 border-t border-white/10 pt-8">
        <div className="flex flex-col gap-2">
            <span className="text-accent text-xs uppercase">Socials</span>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
                {PORTFOLIO_DATA.socials.map((social, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <Magnetic strength={0.2}>
                            <Link 
                                href={social.link}
                                target="_blank"
                                className="hover:text-white text-accent transition-colors"
                            >
                                {social.name}
                            </Link>
                        </Magnetic>
                        {social.name === "YouTube" && <YouTubeStats />}
                    </div>
                ))}
            </div>
        </div>

        <div className="flex flex-col gap-2 text-right md:text-left">
            <span className="text-accent text-xs uppercase">Location</span>
            <span className="text-white">{PORTFOLIO_DATA.personal.location}</span>
        </div>

        <div className="col-span-2 md:col-span-1 flex justify-center md:justify-end">
            <span className="text-accent text-xs">
                © {new Date().getFullYear()} {PORTFOLIO_DATA.personal.name}
            </span>
        </div>
      </div>
    </footer>
  );
}

