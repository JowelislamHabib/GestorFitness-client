"use client";

import { Clock, Dumbbell, Search, SlidersHorizontal, Users, Heart, Star, Flame, Activity, Zap, Timer, Target, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getClasses } from "@/lib/api/classes";
import { useSession } from "@/lib/auth-client";
import { getUserFavorites, addFavorite, removeFavorite } from "@/lib/api/favorites";
import { toast } from "sonner";
import ClassCard from "@/components/classes/ClassCard";

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

  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset to first page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    // Only fetch approved classes
    getClasses({ status: "approved" })
      .then((data) => {
        if (Array.isArray(data)) setClasses(data);
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

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || cls.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

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
            // Skeleton loaders
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[calc(var(--radius)*2)] bg-muted animate-pulse h-[400px]" />
            ))
          ) : paginatedClasses.length > 0 ? (
            paginatedClasses.map((cls) => (
              <ClassCard 
                key={cls._id} 
                cls={cls} 
                isFavorited={favorites.includes(cls._id)} 
                onToggleFavorite={handleToggleFavorite} 
              />
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

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 pb-8">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-xl border border-border/50 bg-card hover:bg-muted text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Previous
            </button>
            <span className="text-sm font-bold text-muted-foreground bg-muted/50 px-4 py-2.5 rounded-xl border border-border/50">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 rounded-xl border border-border/50 bg-card hover:bg-muted text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
