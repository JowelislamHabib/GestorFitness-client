"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function GlobalLoading({ message = "Please wait while we fetch your data." }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-8 p-8">
      {/* Dynamic Logo/Spinner */}
      <div className="relative flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t-2 border-r-2 border-red-600/40 w-24 h-24 -m-2"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-b-2 border-l-2 border-red-600/40 w-28 h-28 -m-4"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex size-20 items-center justify-center rounded-full bg-red-600/10 border border-red-600/20 backdrop-blur-sm shadow-xl shadow-red-600/10"
        >
          <Image src="/GestorFitness.png" alt="GestorFitness Logo" width={48} height={48} priority={true} className="object-contain drop-shadow-md" />
        </motion.div>
      </div>
      
      {/* Typography */}
      <div className="flex flex-col items-center gap-3 text-center mt-4">
        <motion.h3 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-heading text-3xl md:text-4xl font-black uppercase tracking-[0.15em] text-foreground"
        >
          Loading
        </motion.h3>
        <p className="text-xs md:text-sm font-bold text-red-600 uppercase tracking-[0.25em]">
          {message}
        </p>
      </div>
    </div>
  );
}
