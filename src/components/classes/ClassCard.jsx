import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Heart, Star, User, Users } from "lucide-react";
import Link from "next/link";

export default function ClassCard({ cls, isFavorited, onToggleFavorite }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Card className="p-0 group h-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col bg-white dark:bg-zinc-950 relative">
      
        {/* Full Bleed Image Section */}
        <div className="relative h-[240px] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={cls.image} 
            alt={cls.title} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/5 dark:bg-black/20 transition-opacity group-hover:bg-transparent dark:group-hover:bg-black/10" />
          
          {/* Category - Light Badge */}
          <div className="absolute top-5 left-5 z-20">
            <Badge className="bg-white/90 hover:bg-white dark:bg-zinc-900/80 dark:hover:bg-zinc-900 text-neutral-800 dark:text-neutral-200 border-0 px-3 py-1 font-semibold tracking-wide rounded-full text-xs shadow-sm">
              {cls.category || "Class"}
            </Badge>
          </div>

          <button 
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite?.(cls._id);
            }}
            className={cn(
              "absolute top-5 right-5 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm transition-colors border border-transparent dark:border-white/10",
              isFavorited 
                ? "text-red-600 hover:bg-white dark:hover:bg-zinc-800" 
                : "text-neutral-400 hover:text-red-600 hover:bg-white dark:hover:bg-zinc-800"
            )}
          >
            <Heart className={cn("size-4", isFavorited ? "fill-red-600" : "")} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 px-6 pb-6 pt-5 gap-5">
          
          {/* Header: Title & Price */}
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-heading text-2xl font-extrabold text-neutral-900 dark:text-white leading-tight line-clamp-2">
              {cls.title}
            </h3>
            <div className="text-right shrink-0 pt-1">
              <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                <span className="text-xl font-bold tracking-tight">
                  ${parseFloat(cls.price).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Trainer Info & Booked */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {cls.trainer?.image || cls.trainerImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={cls.trainer?.image || cls.trainerImage} alt={cls.trainer?.name || cls.trainerName || "Coach"} className="w-10 h-10 rounded-full object-cover bg-zinc-100 dark:bg-zinc-800" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden flex items-center justify-center">
                  <User className="size-4 text-neutral-400 dark:text-neutral-500" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[12px] text-neutral-500 dark:text-neutral-500 font-medium">Coach</span>
                <div className="flex items-center gap-1.5 text-[14px] font-semibold text-neutral-700 dark:text-neutral-300">
                  {cls.trainer?.name || cls.trainerName || "Deaci Cancer"}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md uppercase tracking-wider">
              <Users className="size-3" />
              {cls.enrolledCount || 0} Booked
            </div>
          </div>

          {/* Clean Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl flex flex-col justify-center border border-zinc-100 dark:border-zinc-800">
              <span className="text-[12px] text-neutral-400 dark:text-neutral-500 mb-0.5">Duration</span>
              <span className="text-[14px] font-medium text-neutral-700 dark:text-neutral-300">{cls.duration} min</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl flex flex-col justify-center border border-zinc-100 dark:border-zinc-800">
              <span className="text-[12px] text-neutral-400 dark:text-neutral-500 mb-0.5">Burn</span>
              <span className="text-[14px] font-medium text-neutral-700 dark:text-neutral-300">{cls.estBurn ? `${cls.estBurn} cal` : '420 cal'}</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl flex flex-col justify-center border border-zinc-100 dark:border-zinc-800">
              <span className="text-[12px] text-neutral-400 dark:text-neutral-500 mb-0.5">Intensity</span>
              <span className="text-[14px] font-medium text-neutral-700 dark:text-neutral-300 capitalize">{cls.difficulty || "Advanced"}</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl flex flex-col justify-center border border-zinc-100 dark:border-zinc-800">
              <span className="text-[12px] text-neutral-400 dark:text-neutral-500 mb-0.5">Focus</span>
              <span className="text-[14px] font-medium text-neutral-700 dark:text-neutral-300 leading-tight line-clamp-1">{cls.focus || "Spiritual & Physical"}</span>
            </div>
          </div>

          {/* Schedule */}
          <div className="mt-auto space-y-1">
            <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Schedule</p>
            <div className="flex items-center gap-3">
              <span className="text-[24px] font-medium text-neutral-700 dark:text-neutral-300 shrink-0 leading-none tracking-tight">
                {cls.time || "05:30 AM"}
              </span>
              <div className="flex flex-wrap gap-1.5 items-center pt-0.5">
                {cls.scheduleDays && cls.scheduleDays.length > 0 ? (
                  cls.scheduleDays.map((day, idx) => (
                    <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-neutral-500 dark:text-neutral-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {day.substring(0,3)}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="bg-slate-100 dark:bg-slate-800 text-neutral-500 dark:text-neutral-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">TUE</span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-neutral-500 dark:text-neutral-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">FRI</span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-neutral-500 dark:text-neutral-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">SAT</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            asChild 
            className="w-full bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 h-[52px] uppercase tracking-[0.1em] text-[13px] font-bold rounded-xl transition-colors shadow-sm"
          >
            <Link href={`/classes/${cls._id}`}>
              View Class Details
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
