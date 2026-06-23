"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Promo() {
  return (
    // Removed overflow-hidden from the section so the image can pop out vertically
    // Increased top margin to make room for the pop-out head
    <section className="relative w-full bg-gradient-to-r from-[#22252A] via-[#6C1F24] to-[#DC1F26] mt-20 md:mt-32 shadow-2xl border-y border-border/10">
      
      {/* BACKGROUND LAYER: overflow-hidden to prevent circles from causing horizontal scrollbars */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 h-full flex">
          {/* Matches the width of the left column to keep circles perfectly centered behind the man */}
          <div className="relative w-full md:w-5/12 h-full flex justify-center items-center">
            <div className="absolute w-[240px] h-[240px] md:w-[360px] md:h-[360px] rounded-full border-[6px] border-[#FF4D00] opacity-90" />
            <div className="absolute w-[300px] h-[300px] md:w-[460px] md:h-[460px] rounded-full border-[6px] border-[#FF4D00] opacity-40" />
            <div className="absolute w-[360px] h-[360px] md:w-[560px] md:h-[560px] rounded-full border-[6px] border-[#FF4D00] opacity-10" />
          </div>
        </div>
      </div>

      {/* FOREGROUND LAYER */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="relative w-full flex flex-col md:flex-row items-center">
          
          {/* Left Side: Image */}
          {/* The height defines how tall the container gets natively */}
          <div className="relative w-full md:w-5/12 h-[350px] md:h-[480px] lg:h-[560px] flex justify-center items-end shrink-0 pt-10 md:pt-0 md:self-end">
            {/* Man Image - Height is > 100% so it pops out of the top! */}
            <motion.img 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 2 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              src="/images/muscular-man.png" 
              alt="Man lifting dumbbells" 
              className="relative block w-auto h-[115%] md:h-[125%] object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] scale-x-[-1]"
            />
          </div>

          {/* Right Side: Content */}
          <div className="w-full md:w-7/12 py-10 pb-16 md:py-24 lg:py-32 flex flex-col justify-center text-white z-20 md:pl-12 lg:pl-20">
            <motion.h4 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-extrabold text-base md:text-lg mb-2"
            >
              This Summer
            </motion.h4>
            
            <motion.h2 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-black text-4xl md:text-5xl lg:text-[64px] mb-6 tracking-tight leading-none"
            >
              Save 50% Offer
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-white/90 text-[13px] md:text-[15px] mb-10 max-w-2xl leading-relaxed font-medium"
            >
              Unlock your ultimate potential this season! Get unlimited access to our state-of-the-art facilities, elite coaching programs, and premium equipment. Transform your body and elevate your performance with our exclusive summer membership. Don't wait—start your fitness journey today and achieve the results you've always demanded.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button asChild className="bg-white text-red-600 hover:bg-gray-100 hover:text-red-700 h-12 md:h-14 px-8 md:px-10 uppercase tracking-widest text-[11px] md:text-xs font-bold w-fit shadow-xl">
                <Link href="/pricing">
                  Become A Member
                </Link>
              </Button>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
