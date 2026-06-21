"use client";

import ClassCard from "@/components/classes/ClassCard";
import { Button } from "@/components/ui/button";
import { getClasses } from "@/lib/api/classes";
import { addFavorite, getUserFavorites, removeFavorite } from "@/lib/api/favorites";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FeaturedClasses() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Favorites state and logic
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Fetch classes from the database
    getClasses({ status: "approved" })
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort by bookings (if available), then slice the first 3
          const sortedClasses = [...data].sort((a, b) => {
            const countA = a.enrolledCount || 0;
            const countB = b.enrolledCount || 0;
            return countB - countA;
          });
          setClasses(sortedClasses.slice(0, 3));
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      getUserFavorites(session.user.id)
        .then((data) => setFavorites(Array.isArray(data) ? data : []))
        .catch(console.error);
    }
  }, [session?.user?.id]);

  const handleToggleFavorite = async (classId) => {
    if (!session?.user?.id) {
      toast.error("Please login to add favorites.");
      return;
    }
    
    const isFavorited = favorites.includes(classId);
    
    // Optimistic update
    setFavorites((prev) => 
      isFavorited ? prev.filter((id) => id !== classId) : [...prev, classId]
    );

    try {
      if (isFavorited) {
        await removeFavorite(session.user.id, classId);
        toast.success("Removed from your favorites!");
      } else {
        await addFavorite(session.user.id, classId);
        toast.success("Successfully added to your favorites!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update favorites");
      // Revert optimistic update
      setFavorites((prev) => 
        isFavorited ? [...prev, classId] : prev.filter((id) => id !== classId)
      );
    }
  };

  return (
    <section className="w-full bg-muted/20 py-20 md:py-32 overflow-hidden border-t border-border/50">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {isLoading ? (
            // Skeleton loaders while fetching
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[400px] w-full rounded-2xl bg-muted animate-pulse border border-border/50" />
            ))
          ) : classes.length > 0 ? (
            classes.map((cls, idx) => (
              <motion.div 
                key={cls._id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                className="h-full flex"
              >
                <div className="w-full h-full [&>div]:h-full">
                  <ClassCard 
                    cls={cls} 
                    isFavorited={favorites.includes(cls._id)} 
                    onToggleFavorite={handleToggleFavorite} 
                  />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No classes available right now.
            </div>
          )}
        </div>

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
