"use client";

import { Clock, Dumbbell, Search, SlidersHorizontal, Users, Heart, Star, Flame, Activity, Zap, Timer, Target, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getClasses } from "@/lib/api/classes";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AllClassesPage() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // Only fetch approved classes
    getClasses({ status: "approved" })
      .then((data) => {
        if (Array.isArray(data)) setClasses(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || cls.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <section className="text-center container mx-auto space-y-4">
          <Badge className="bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 px-4 py-1.5 shadow-none border-0">
            Find Your Class
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Discover Your Perfect Workout
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse through hundreds of high-quality classes hosted by expert trainers. Find the one that matches your fitness goals.
          </p>
        </section>

        {/* Search & Filter Bar */}
        <Card className="p-4 rounded-[calc(var(--radius)*2)] border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center gap-4 container mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 opacity-50" />
          <div className="relative w-full flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search classes by name..." 
              className="h-14 w-full rounded-[calc(var(--radius)*1.5)] pl-12 bg-background/60 border-border/50 focus-visible:ring-blue-500/50 text-base"
            />
          </div>
          <div className="relative w-full sm:w-auto flex items-center gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-14 w-full sm:w-48 rounded-[calc(var(--radius)*1.5)] bg-background/60 border-border/50 focus:ring-blue-500/50 text-base font-medium">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-[calc(var(--radius)*1.5)] border-border/50 bg-background/95 backdrop-blur-xl">
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Strength">Strength</SelectItem>
                <SelectItem value="Cardio">Cardio</SelectItem>
                <SelectItem value="Yoga">Yoga</SelectItem>
                <SelectItem value="Flexibility">Flexibility</SelectItem>
                <SelectItem value="CrossFit">CrossFit</SelectItem>
              </SelectContent>
            </Select>
            <button className="h-14 w-14 flex items-center justify-center shrink-0 rounded-[calc(var(--radius)*1.5)] border border-border/50 bg-background/60 hover:bg-muted text-foreground transition-colors">
              <SlidersHorizontal className="size-5" />
            </button>
          </div>
        </Card>

        {/* Classes Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full py-24 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredClasses.length > 0 ? (
            filteredClasses.map((cls) => (
              <Card key={cls._id} className="p-0 group overflow-hidden rounded-[2rem] border-0 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col bg-background relative">
                
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

                  {/* Favorite Button */}
                  <button className="absolute top-4 right-4 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-white hover:text-red-500 hover:bg-white transition-colors shadow-sm">
                    <Heart className="size-4" />
                  </button>

                  {/* Spots Left Warning */}
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 text-xs font-bold text-white bg-orange-500/80 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                    <Flame className="size-3.5" />
                    {Math.floor(Math.random() * 5) + 1} Spots Left
                  </div>
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
                    
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
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
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted/50 mb-4 text-muted-foreground">
                <Search className="size-10" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No classes found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                className="mt-6 font-bold text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
