"use client";

import { Clock, Dumbbell, Search, SlidersHorizontal, Users, Heart, Star, Flame, Activity, Zap, Timer, Target, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getClasses } from "@/lib/api/classes";
import { useSession } from "@/lib/auth-client";
import { getUserFavorites, addFavorite, removeFavorite } from "@/lib/api/favorites";
import { toast } from "sonner";
import ClassCard from "@/components/classes/ClassCard";
import GlobalLoading from "@/components/shared/GlobalLoading";

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
  return (
    <Suspense fallback={<GlobalLoading message="Fetching classes..." />}>
      <AllClassesContent />
    </Suspense>
  );
}

function AllClassesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialPage = parseInt(searchParams.get("page") || "1");

  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  // Sync URL function
  const updateUrl = (page, search, category) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page);
    if (search) params.set("search", search);
    if (category && category !== "All") params.set("category", category);
    
    const newUrl = `${pathname}?${params.toString()}`;
    // Use replace to not bloat history stack for every keystroke
    router.replace(newUrl, { scroll: false });
  };

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm !== initialSearch) {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, initialSearch]);

  // Handle Category Change
  const handleCategoryChange = (val) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  useEffect(() => {
    setIsLoading(true);
    updateUrl(currentPage, debouncedSearchTerm, selectedCategory);

    getClasses({ 
      status: "approved", 
      page: currentPage, 
      limit: itemsPerPage, 
      search: debouncedSearchTerm,
      category: selectedCategory
    })
      .then((data) => {
        if (data && Array.isArray(data.classes)) {
          setClasses(data.classes);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [currentPage, debouncedSearchTerm, selectedCategory]);

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

  // Removed local filtering since backend handles it

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-12 md:mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 md:w-12 bg-red-600" />
            <span className="text-[10px] md:text-xs font-bold text-red-600 uppercase tracking-[0.2em]">Find Your Class</span>
            <div className="h-[2px] w-8 md:w-12 bg-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight text-foreground uppercase leading-none">
            Discover Your Perfect Workout
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-sm md:text-base leading-relaxed">
            Browse through hundreds of high-quality classes hosted by expert trainers. Find the one that matches your fitness goals.
          </p>
        </motion.section>

        {/* Sleek Unified Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div className="flex flex-col sm:flex-row items-center w-full max-w-3xl bg-background rounded-xl border shadow-xl p-2 gap-2 sm:gap-0">
            
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="What do you want to train today?" 
                className="h-12 w-full rounded-md sm:rounded-r-none pl-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base shadow-none"
              />
            </div>

            <div className="hidden sm:block w-px h-8 bg-border mx-2 shrink-0" />

            <div className="relative w-full sm:w-56 shrink-0">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-12 w-full rounded-md sm:rounded-none border-0 bg-transparent focus:ring-0 focus:ring-offset-0 text-sm font-semibold uppercase tracking-wider shadow-none">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl">
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="Flexibility">Flexibility</SelectItem>
                  <SelectItem value="CrossFit">CrossFit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button 
              onClick={() => {}} 
              className="h-12 w-full sm:w-auto px-8 rounded-md bg-red-600 text-white font-bold uppercase tracking-wider text-xs hover:bg-red-700 transition-colors shadow-md flex items-center justify-center shrink-0 mt-2 sm:mt-0"
            >
              Search
            </button>
            
          </div>
        </motion.div>

        {/* Classes Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full">
              <GlobalLoading message="Fetching classes..." />
            </div>
          ) : classes.length > 0 ? (
            classes.map((cls) => (
              <ClassCard 
                key={cls._id} 
                cls={cls} 
                isFavorited={favorites.includes(cls._id)} 
                onToggleFavorite={handleToggleFavorite} 
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full py-24 text-center flex flex-col items-center justify-center"
            >
              <div className="flex size-20 items-center justify-center rounded-full bg-red-600/10 mb-6 text-red-600">
                <Search className="size-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">No classes found</h3>
              <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                className="mt-8 px-6 py-2.5 rounded-md bg-red-600 text-white hover:bg-red-700 uppercase tracking-wider text-[10px] font-bold transition-all shadow-md shadow-red-600/20"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </section>

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center gap-4 mt-16 pb-12"
          >
            <button 
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="px-6 py-2.5 rounded-md border border-red-600/20 bg-transparent text-red-600 hover:bg-red-600 hover:text-white uppercase tracking-wider text-[10px] font-bold transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-red-600 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-foreground bg-muted/50 px-4 py-2.5 rounded-md border border-border/50 uppercase tracking-wider">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="px-6 py-2.5 rounded-md border border-red-600/20 bg-transparent text-red-600 hover:bg-red-600 hover:text-white uppercase tracking-wider text-[10px] font-bold transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-red-600 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </motion.div>
        )}

      </div>
    </main>
  );
}
