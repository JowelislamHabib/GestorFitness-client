"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Banner() {
  return (
    <section className="relative w-full bg-background overflow-hidden h-[calc(100vh-4rem)] min-h-[600px] flex flex-col justify-center">
      
      {/* Magazine Layout Floating Texts */}
      <div className="absolute inset-0 overflow-hidden flex justify-center">
        <div className="container mx-auto relative w-full h-full hidden lg:block">
          
          {/* Left Side Editorial Elements */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute top-[10%] left-0 xl:left-[2%] flex items-start gap-3 opacity-60 md:opacity-100 pointer-events-none"
          >
            <div className="[writing-mode:vertical-rl] rotate-180 text-[10px] sm:text-xs tracking-[0.4em] text-foreground/50 font-bold uppercase">
              GestorFitness
            </div>
            <div className="h-32 sm:h-48 w-px bg-foreground/10" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute top-[35%] left-[2%] xl:left-[5%] max-w-[180px] opacity-70 pointer-events-none"
          >
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-foreground mb-3">The Mission</h3>
            <p className="text-[10px] sm:text-xs text-foreground/60 uppercase tracking-widest leading-relaxed font-bold">
              We provide state-of-the-art facilities, expert coaching, and a community of driven individuals aiming for peak performance.
            </p>
          </motion.div>

          {/* Left Bottom Block WITH The New Editorial Button */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute bottom-[20%] left-[2%] xl:left-[5%] w-[240px] text-left z-30"
          >
            <div className="w-8 sm:w-12 h-[2px] sm:h-1 bg-red-600 mb-3 sm:mb-5 pointer-events-none" />
            <p className="text-[10px] sm:text-xs text-foreground/60 uppercase tracking-widest leading-relaxed font-bold mb-6 pointer-events-none">
              Push past limits, crush every rep, and own your transformation.
            </p>
            
            {/* Redesigned Button: Solid color default, darker hover */}
            <Button asChild className="bg-red-600 text-white hover:bg-red-700 h-12 md:h-14 px-8 uppercase tracking-[0.15em] text-[11px] font-bold rounded-md transition-all group">
              <Link href="/classes">
                Explore Classes
                <ArrowRight className="ml-3 size-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Right Side Editorial Elements */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-[15%] right-0 xl:right-[2%] text-right flex flex-col items-end opacity-60 md:opacity-100 pointer-events-none"
          >
             <span className="text-6xl sm:text-8xl lg:text-[140px] font-black text-foreground/[0.04] dark:text-foreground/[0.08] leading-none select-none tracking-tighter">
               01
             </span>
             <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-red-600 mt-2">
               The Standard
             </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute top-[50%] right-[2%] xl:right-[5%] w-[160px] opacity-70 text-right pointer-events-none"
          >
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-foreground mb-3">Key Metrics</h3>
            <div className="flex flex-col gap-2 text-[10px] sm:text-xs text-foreground/60 font-bold uppercase tracking-wider">
              <div className="flex justify-between"><span className="text-foreground/40">Trainers</span> <span className="text-foreground">15+</span></div>
              <div className="w-full h-px bg-foreground/10" />
              <div className="flex justify-between"><span className="text-foreground/40">Classes</span> <span className="text-foreground">50+</span></div>
              <div className="w-full h-px bg-foreground/10" />
              <div className="flex justify-between"><span className="text-foreground/40">Members</span> <span className="text-foreground">2K+</span></div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.9 }}
            className="absolute bottom-[20%] right-[2%] xl:right-[5%] flex flex-col items-end gap-3 opacity-60 md:opacity-100 pointer-events-none"
          >
             <p className="text-[10px] sm:text-xs tracking-[0.2em] text-foreground/50 font-bold uppercase text-right w-[140px]">
                No Shortcuts. Only Growth.
             </p>
             <div className="w-12 sm:w-20 h-px bg-foreground/20" />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto relative z-10 h-full flex flex-col items-center justify-center pt-10 pb-8 pointer-events-none">
        
        {/* Wrapper for Image and Text */}
        <div className="relative flex flex-col items-center justify-end w-full h-[70%] sm:h-[80%] lg:h-[85%]">
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-[8vh] sm:top-[5vh] md:top-[-10%] left-1/2 -translate-x-1/2 text-[26vw] sm:text-[20vw] md:text-[180px] lg:text-[240px] xl:text-[300px] font-black tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-slate-800 via-slate-400/50 to-transparent dark:from-slate-100 dark:via-slate-500/50 dark:to-transparent z-0 select-none whitespace-nowrap px-4 pt-4 pb-4 md:pt-8"
          >
            FITNESS
          </motion.h1>

          {/* Fade out applied to the bottom of the container masking the image crop */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative z-10 w-full h-full flex justify-center items-end [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
          >
            <img
              src="/images/slider/slide-image-1.png"
              alt="Fitness Hero"
              className="h-full w-auto object-contain object-bottom drop-shadow-[0_15px_40px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_15px_40px_rgba(255,255,255,0.05)]"
            />
          </motion.div>
        </div>

        {/* Mobile-only action button fallback (since the side blocks are hidden on small screens) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative z-20 flex justify-center w-full mt-8 shrink-0 lg:hidden pointer-events-auto"
        >
          <Button asChild className="bg-red-600 text-white hover:bg-red-700 h-12 md:h-14 px-8 uppercase tracking-[0.15em] text-[11px] font-bold rounded-md transition-all group">
            <Link href="/classes">
              Explore Classes
              <ArrowRight className="ml-3 size-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
