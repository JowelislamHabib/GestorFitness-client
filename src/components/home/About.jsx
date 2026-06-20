"use client";

import { Button } from "@/components/ui/button";
import { PhoneCall, Award } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="w-full bg-background py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col space-y-6 lg:pr-8"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <span className="text-[11px] md:text-xs font-bold text-red-600 uppercase tracking-[0.2em]">More About Us</span>
              <div className="h-[2px] w-12 bg-red-600" />
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-[56px] font-black text-foreground leading-[1.1] mb-2">
              Make Yourself Stronger Than Your Best Excuses
            </motion.h2>

            <motion.p variants={itemVariants} className="text-muted-foreground leading-relaxed text-sm md:text-base">
              We believe in pushing boundaries and redefining limits. Our facility is designed to help you achieve your goals, whether you're a beginner taking your first steps or an athlete aiming for the next level. Every workout brings you closer to your ultimate potential.
            </motion.p>

            <motion.blockquote variants={itemVariants} className="border-l-4 border-red-600 pl-5 py-2 italic font-semibold text-foreground/80 leading-relaxed">
              "Success starts with self-discipline. We provide the tools, the community, and the expert guidance, but the grit comes from you."
            </motion.blockquote>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 pt-6">
              
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-12 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600">
                  <PhoneCall className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Need Help</p>
                  <p className="text-lg font-bold text-foreground">(+258) 2569 2582</p>
                </div>
              </div>

              <Button asChild className="bg-red-600 text-white hover:bg-red-700 h-12 md:h-14 px-8 uppercase tracking-[0.15em] text-[11px] font-bold rounded-md transition-all">
                <Link href="/about">
                  Learn More About Us
                </Link>
              </Button>
              
            </motion.div>
          </motion.div>

          {/* Right Column: Images Layout */}
          <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] mt-12 lg:mt-0 flex justify-center lg:justify-start">
            
            {/* Main Tall Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: -20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 left-0 lg:left-[5%] w-[75%] sm:w-[70%] h-[85%] rounded-xl overflow-hidden shadow-2xl bg-muted"
            >
              <img 
                src="/images/sporty.jpg" 
                alt="Fitness Training" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Smaller Overlapping Image */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="absolute top-[10%] lg:top-[15%] right-0 w-[45%] h-[40%] sm:h-[45%] rounded-xl overflow-hidden shadow-2xl border-[6px] sm:border-8 border-background bg-muted"
            >
              <img 
                src="/images/a-man-in-a-gym.jpg" 
                alt="Gym Workout" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Red Experience Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.6, type: "spring", bounce: 0.4 }}
              className="absolute bottom-[5%] lg:bottom-[10%] right-[5%] sm:right-[10%] bg-red-600 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-xl shadow-2xl flex items-center gap-4 z-10"
            >
              <Award className="size-10 sm:size-12" strokeWidth={1.5} />
              <div className="flex flex-col justify-center">
                <p className="text-3xl sm:text-4xl font-black leading-none mb-1">15 +</p>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold opacity-90">Years Experiences</p>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
