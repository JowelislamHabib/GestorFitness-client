"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { getForumPosts } from "@/lib/api/forumPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ForumPostCard from "@/components/forums/ForumPostCard";

export default function LatestDiscussionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <LatestDiscussionsContent />
    </Suspense>
  );
}

function LatestDiscussionsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // Show a 2-row grid

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getForumPosts(currentPage, limit, null, debouncedSearchTerm);
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
  }, [currentPage, debouncedSearchTerm]);

  return (
    <main className="min-h-screen bg-background pb-16 pt-24 lg:pt-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 flex flex-col items-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">All Discussions</h1>
          <p className="text-muted-foreground text-lg max-w-2xl text-center mb-8">Browse the newest conversations, tips, and insights from the fitness community.</p>
          
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title..." 
              className="h-14 w-full rounded-full pl-13 bg-background/80 border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-purple-500 backdrop-blur-md text-base shadow-lg transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
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
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1} 
                  className="rounded-xl border-border/50 bg-background/50 hover:bg-muted"
                >
                  <ChevronLeft className="size-5" />
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button 
                    key={i + 1} 
                    variant={currentPage === i + 1 ? "default" : "outline"} 
                    onClick={() => setCurrentPage(i + 1)} 
                    className={`size-10 rounded-xl font-bold ${currentPage === i + 1 ? "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20" : "border-border/50 bg-background/50"}`}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages} 
                  className="rounded-xl border-border/50 bg-background/50 hover:bg-muted"
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
