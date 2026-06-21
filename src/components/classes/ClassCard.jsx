import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity, Heart, Star, Target, Timer, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function ClassCard({ cls, isFavorited, onToggleFavorite }) {
  return (
    <Card className="p-0 group overflow-hidden rounded-[2rem] border-0 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col bg-background relative">
      
      {/* Full Bleed Image Section */}
      <div className="relative h-56 w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={cls.image} 
          alt={cls.title} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Category - Sleek Pill */}
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-white/10 shadow-sm px-3 py-1 font-semibold tracking-wide">
            {cls.category}
          </Badge>
        </div>

        <button 
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(cls._id);
          }}
          className={cn(
            "absolute top-4 right-4 z-20 h-9 w-9 flex items-center justify-center rounded-full backdrop-blur-md border border-white/10 shadow-sm transition-colors",
            isFavorited 
              ? "bg-red-500 text-white hover:bg-red-600 border-red-500" 
              : "bg-white/20 text-white hover:text-red-500 hover:bg-white"
          )}
        >
          <Heart className={cn("size-4", isFavorited ? "fill-white" : "")} />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-6 gap-6">
        
        {/* Header: Title & Trainer */}
        <div>
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-heading text-xl font-bold text-foreground leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
              {cls.title}
            </h3>
            <div className="text-right shrink-0">
              <div className="flex items-start justify-end text-foreground">
                <span className="text-sm font-semibold mt-0.5">$</span>
                <span className="text-2xl font-bold tracking-tight">
                  {parseFloat(cls.price).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
          
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground font-medium w-full">
            <span className="truncate">
              <span className="opacity-70 mr-1">Coach:</span>
              {cls.trainerName || "Elite Coach"}
            </span>
            <span className="text-border text-xs">•</span>
            <span className="flex items-center text-yellow-500">
              <Star className="size-3.5 fill-yellow-500 mr-1" />
              4.9
            </span>
            <span className="text-xs text-muted-foreground/60">(128)</span>
            
            <span className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md">
              <Users className="size-3" />
              {cls.enrolledCount || 0} Booked
            </span>
          </p>
        </div>

        {/* Sleek Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-3 bg-muted/30 px-3 py-2.5 rounded-2xl">
            <div className="bg-blue-500/10 p-1.5 rounded-full text-blue-600">
              <Timer className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Duration</span>
              <span className="text-sm font-bold text-foreground leading-none">{cls.duration} min</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted/30 px-3 py-2.5 rounded-2xl">
            <div className="bg-orange-500/10 p-1.5 rounded-full text-orange-600">
              <Activity className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Intensity</span>
              <span className="text-sm font-bold text-foreground leading-none capitalize">{cls.difficulty}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted/30 px-3 py-2.5 rounded-2xl">
            <div className="bg-red-500/10 p-1.5 rounded-full text-red-600">
              <Zap className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Est. Burn</span>
              <span className="text-sm font-bold text-foreground leading-none">{cls.estBurn ? `${cls.estBurn} cal` : '~450 cal'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted/30 px-3 py-2.5 rounded-2xl">
            <div className="bg-emerald-500/10 p-1.5 rounded-full text-emerald-600">
              <Target className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Focus</span>
              <span className="text-sm font-bold text-foreground leading-none">{cls.focus || (cls.category === 'Yoga' ? 'Flexibility' : 'Full Body')}</span>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="mt-auto pt-2 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider shrink-0">Schedule</p>
            
            {/* Fading Gradient Line */}
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent rounded-full" />
            
            <span className="text-xs font-semibold text-blue-600 bg-blue-600/10 px-2 py-0.5 rounded-md shrink-0">
              {cls.time || "TBD"}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cls.scheduleDays && cls.scheduleDays.length > 0 ? (
              cls.scheduleDays.map((day) => (
                <div key={day} className="flex items-center justify-center bg-muted text-foreground border border-transparent px-3 py-1.5 rounded-xl text-xs font-semibold">
                  {day.substring(0,3)}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center bg-muted text-muted-foreground px-3 py-1.5 rounded-xl text-xs font-semibold">
                Various Days
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link 
          href={`/classes/${cls._id}`}
          className="mt-2 flex w-full items-center justify-center rounded-2xl bg-foreground text-background px-4 py-4 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-blue-600 hover:text-white shadow-md"
        >
          View Class Details
        </Link>
      </div>
    </Card>
  );
}
