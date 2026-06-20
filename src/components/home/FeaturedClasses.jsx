"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ClassCard from "@/components/classes/ClassCard";
import { getClasses } from "@/lib/api/classes";

export default function FeaturedClasses() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch classes from the database
    getClasses({ status: "approved" })
      .then((data) => {
        if (Array.isArray(data)) {
          // Once booking count is implemented, you can sort here.
          // For now, we just slice the first 3 classes.
          setClasses(data.slice(0, 3));
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="w-full bg-muted/20 py-20 md:py-32 overflow-hidden border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
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
            <span className="text-[10px] md:text-xs font-bold text-red-600 uppercase tracking-[0.2em]">Our Programs</span>
            <div className="h-[2px] w-8 md:w-12 bg-red-600" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight text-foreground uppercase leading-none">
            Featured Classes
          </h2>
          <p className="text-muted-foreground mt-6 max-w-2xl text-sm md:text-base leading-relaxed">
            Choose from a variety of expertly designed programs tailored to help you crush your specific fitness goals, no matter your experience level.
          </p>
        </motion.div>

        {/* Classes Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
        >
          {isLoading ? (
            // Skeleton loaders while fetching
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[400px] w-full rounded-2xl bg-muted animate-pulse border border-border/50" />
            ))
          ) : classes.length > 0 ? (
            classes.map((cls) => (
              <motion.div key={cls._id} variants={itemVariants} className="h-full flex">
                <div className="w-full h-full [&>div]:h-full">
                  <ClassCard 
                    cls={cls} 
                    isFavorited={false} 
                    onToggleFavorite={() => {}} 
                  />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No classes available right now.
            </div>
          )}
        </motion.div>

        {/* Bottom Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 md:mt-20 flex justify-center"
        >
          <Button asChild className="bg-red-600 text-white hover:bg-red-700 h-12 md:h-14 px-8 md:px-10 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold rounded-md transition-all shadow-lg shadow-red-600/20">
            <Link href="/classes">
              Explore All Programs
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
