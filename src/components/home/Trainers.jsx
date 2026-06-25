"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GlobalLoading from "@/components/shared/GlobalLoading";

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Fetch public trainers
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"}/trainers`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTrainers(data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % trainers.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + trainers.length) % trainers.length);
  };

  if (isLoading) {
    return <GlobalLoading message="Loading Trainers..." />;
  }

  // If there are no trainers in the DB, hide the section
  if (trainers.length === 0) return null;

  return (
    <section className="relative w-full py-20 md:py-32 bg-muted/20 overflow-hidden border-y border-border/50">
      
      {/* Background Watermarks */}
      <Dumbbell className="absolute -left-20 top-20 w-[400px] h-[400px] text-muted-foreground opacity-[0.03] dark:opacity-5 -rotate-45 pointer-events-none" />
      <Activity className="absolute -right-20 bottom-20 w-[400px] h-[400px] text-muted-foreground opacity-[0.03] dark:opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-16 md:mb-24"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 md:w-12 bg-red-600" />
            <span className="text-[10px] md:text-xs font-bold text-red-600 uppercase tracking-[0.2em]">Our Trainer</span>
            <div className="h-[2px] w-8 md:w-12 bg-red-600" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight text-foreground uppercase leading-none">
            Meet Our Skilled Trainer
          </h2>
          <p className="text-muted-foreground mt-6 max-w-2xl text-sm md:text-base leading-relaxed">
            Our elite certified coaches are dedicated to pushing you beyond your limits. With years of specialized expertise, they will motivate, guide, and support you through every step of your fitness journey.
          </p>
        </motion.div>

        {/* 3D Coverflow Carousel */}
        <div 
          className="relative w-full h-[400px] md:h-[520px] flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          {trainers.map((trainer, idx) => {
            // Determine relative position
            let offset = idx - activeIndex;
            // Handle edge wrapping for continuous loop effect
            if (offset < -1 && activeIndex === trainers.length - 1 && idx === 0) offset = 1;
            if (offset > 1 && activeIndex === 0 && idx === trainers.length - 1) offset = -1;

            // Only render items that are Center, Left, or Right
            if (offset < -1 || offset > 1) return null;

            const isCenter = offset === 0;
            const isLeft = offset === -1;
            const isRight = offset === 1;

            return (
              <motion.div
                key={trainer._id || idx}
                className={`absolute top-0 w-[280px] sm:w-[320px] md:w-[400px] h-[360px] md:h-[500px] ${isCenter ? 'cursor-default' : 'cursor-pointer'} group`}
                initial={false}
                animate={{
                  x: isCenter ? "0%" : isLeft ? "-105%" : "105%",
                  scale: isCenter ? 1 : 0.8,
                  rotateY: isCenter ? 0 : isLeft ? 45 : -45,
                  opacity: isCenter ? 1 : 0.5,
                  zIndex: isCenter ? 30 : 20,
                }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                onClick={() => {
                  if (isLeft) handlePrev();
                  if (isRight) handleNext();
                }}
              >
                {/* Shadcn Card Container */}
                <Card className="relative w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 dark:from-slate-800 dark:via-slate-900 dark:to-black overflow-hidden shadow-2xl shadow-black/40 border border-border/50">
                  <CardContent className="p-0 h-full">
                    <img 
                      src={trainer.image || "/images/default-avatar.png"} 
                      alt={trainer.name || "Trainer"} 
                      className="w-full h-full object-cover opacity-90"
                    />
                    
                    {/* Bottom Red Block Overlay - With Shadcn rounding */}
                    <div className="absolute bottom-6 left-6 right-6 bg-red-600 py-5 px-4 text-center transform transition-all duration-500 shadow-xl shadow-red-600/20 z-50 rounded-lg md:rounded-xl">
                      <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-wide">{trainer.name || "Elite Trainer"}</h3>
                      <p className="text-white/90 text-sm font-medium mt-1 uppercase tracking-wider">{trainer.specialty ? `${trainer.specialty} Trainer` : "Fitness Trainer"}</p>
                    </div>
                    
                    {/* Subtle hover overlay for side items */}
                    {!isCenter && (
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-40" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Navigation Controls utilizing Shadcn Buttons - Positioned in the gap between cards */}
          {trainers.length > 1 && (
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[340px] sm:w-[440px] md:w-[560px] lg:w-[600px] h-0 flex items-center justify-between px-0 z-50 pointer-events-none">
              <Button 
                variant="default"
                size="icon"
                onClick={handlePrev}
                className="pointer-events-auto bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl transition-transform hover:scale-110 flex items-center justify-center w-12 h-12 md:w-14 md:h-14"
              >
                <ChevronLeft className="size-5 md:size-6" />
              </Button>
              <Button 
                variant="secondary"
                size="icon"
                onClick={handleNext}
                className="pointer-events-auto bg-foreground hover:bg-foreground/80 text-background rounded-full shadow-xl transition-transform hover:scale-110 flex items-center justify-center w-12 h-12 md:w-14 md:h-14"
              >
                <ChevronRight className="size-5 md:size-6" />
              </Button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
