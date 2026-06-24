"use client";

import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { getForumPosts } from "@/lib/api/forumPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ForumPostCard from "@/components/forums/ForumPostCard";
import GlobalLoading from "@/components/shared/GlobalLoading";

export default function LatestDiscussionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <LatestDiscussionsContent />
    </Suspense>
  );
}

function LatestDiscussionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialCategory = searchParams.get("category") || "all";
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // Show a 2-row grid

  // Sync search and pagination to URL
  const updateUrl = (page, search, category) => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    if (page > 1) {
      params.set("page", page);
    } else {
      params.delete("page");
    }
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.replace(`/forums/latest?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateUrl(newPage, debouncedSearchTerm, selectedCategory);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateUrl(1, debouncedSearchTerm, category);
  };

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== debouncedSearchTerm) {
        setDebouncedSearchTerm(searchTerm);
        setCurrentPage(1); // Reset page on new search
        updateUrl(1, searchTerm, selectedCategory);
      }
    }, 500);
    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getForumPosts(currentPage, limit, null, debouncedSearchTerm, "newest", "", selectedCategory);
        if (data.message) throw new Error(data.message);
        setPosts(data.posts);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage, debouncedSearchTerm, selectedCategory]);

  return (
    <main className="min-h-screen bg-background pb-16 pt-24 lg:pt-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 md:w-12 bg-red-600" />
            <span className="text-[10px] md:text-xs font-bold text-red-600 uppercase tracking-[0.2em]">Community</span>
            <div className="h-[2px] w-8 md:w-12 bg-red-600" />
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-black uppercase tracking-tight text-foreground leading-none mb-6">All Discussions</h1>
          <p className="text-muted-foreground text-lg max-w-2xl text-center mb-8">Browse the newest conversations, tips, and insights from the fitness community.</p>
          
          <div className="flex flex-col sm:flex-row items-center w-full max-w-2xl bg-background rounded-md border border-border shadow-sm p-2 gap-2 sm:gap-0 mx-auto">
            
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-red-600 transition-colors" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or category..." 
                className="h-12 w-full rounded-md sm:rounded-r-none pl-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base shadow-none"
              />
            </div>

            <div className="hidden sm:block w-px h-8 bg-border mx-2 shrink-0" />

            <div className="relative w-full sm:w-48 shrink-0">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-12 w-full rounded-md sm:rounded-none border-0 bg-transparent focus:ring-0 focus:ring-offset-0 text-sm font-bold uppercase tracking-wider shadow-none">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-border bg-background shadow-xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="Flexibility">Flexibility</SelectItem>
                  <SelectItem value="CrossFit">CrossFit</SelectItem>
                  <SelectItem value="HIIT">HIIT</SelectItem>
                  <SelectItem value="Nutrition">Nutrition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <GlobalLoading message="Fetching discussions..." />
        ) : error ? (
          <div className="bg-red-500/10 text-red-500 p-6 rounded-2xl border border-red-500/20 text-center">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted/50 mb-4 text-muted-foreground">
              <Search className="size-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No posts found</h3>
            <p className="mt-2 text-muted-foreground">Try a different search term.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map(post => (
                <ForumPostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8 border-t border-border/50">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                  disabled={currentPage === 1} 
                  className="rounded-md border-border hover:bg-muted"
                >
                  <ChevronLeft className="size-5" />
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button 
                    key={i + 1} 
                    variant={currentPage === i + 1 ? "default" : "outline"} 
                    onClick={() => handlePageChange(i + 1)} 
                    className={`size-10 rounded-md font-bold ${currentPage === i + 1 ? "bg-red-600 hover:bg-red-700 text-white shadow-md" : "border-border bg-background hover:bg-muted"}`}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
                  disabled={currentPage === totalPages} 
                  className="rounded-md border-border hover:bg-muted"
                >
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
