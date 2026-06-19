"use client";

import { ArrowRight, ChevronLeft, ChevronRight, MessageSquareText, PlusCircle, Search, Sparkles, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { getForumPosts } from "@/lib/api/forumPosts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForumPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getForumPosts(currentPage, limit);
        if (data.message) throw new Error(data.message);
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage]);

  const filteredPosts = posts.filter((post) => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <section className="text-center container mx-auto space-y-4">
          <Badge className="bg-purple-600/10 text-purple-600 hover:bg-purple-600/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs border-0 inline-flex items-center gap-2">
            <Sparkles className="size-3.5" /> Community
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Fitness Discussions
          </h1>
          <p className="text-muted-foreground text-lg">
            Ask questions, share your progress, and connect with trainers and fellow members.
          </p>
        </section>

        {/* Action Bar */}
        <section className="flex flex-col sm:flex-row items-center gap-4 container mx-auto">
          <div className="relative w-full flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search discussions..." 
              className="h-12 w-full rounded-2xl pl-11 bg-card/50 border-border/50 focus-visible:ring-purple-500/50 backdrop-blur-sm text-base"
            />
          </div>
          <Link href="/dashboard/trainer/forum-posts/add" className="w-full sm:w-auto h-12 flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background hover:bg-purple-600 hover:text-white px-6 font-bold transition-all shadow-lg active:scale-[0.98] shrink-0">
            <PlusCircle className="size-5" />
            New Post
          </Link>
        </section>

        {/* Posts Layout */}
        <section className="container mx-auto space-y-6">
          {loading ? (
            <div className="py-24 text-center">
              <h3 className="text-xl font-bold text-foreground animate-pulse">Loading posts...</h3>
            </div>
          ) : error ? (
            <div className="py-24 text-center text-red-500">
              <h3 className="text-xl font-bold">Error loading posts</h3>
              <p className="mt-2">{error}</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Card 
                key={post._id} 
                className={`group overflow-hidden rounded-3xl border border-border/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 bg-card/40 hover:bg-card/60`}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Optional Image */}
                  {post.image && (
                    <div className="sm:w-64 h-48 sm:h-auto shrink-0 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{post.author || "Anonymous"}</span>
                        <Badge variant="secondary" className="text-[9px] uppercase tracking-wider py-0 rounded-sm font-bold bg-background/50">
                          {post.role || "Member"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-medium">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Link href={`/forums/${post._id}`} className="block group/title">
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground leading-tight group-hover/title:text-purple-500 transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                    </Link>

                    <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
                        <span className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors cursor-pointer">
                          <ThumbsUp className="size-4" /> {post.upvotes || 0}
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer">
                          <MessageSquareText className="size-4" /> {post.comments || 0}
                        </span>
                      </div>
                      <Link 
                        href={`/forums/${post._id}`}
                        className="flex items-center gap-1 text-sm font-bold text-foreground group-hover:text-purple-500 transition-colors"
                      >
                        Read More <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="py-24 text-center">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted/50 mb-4 text-muted-foreground">
                <Search className="size-10" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No posts found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search terms.</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex size-10 items-center justify-center rounded-xl border border-border/50 bg-background/50 hover:bg-muted transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="size-5" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`flex size-10 items-center justify-center rounded-xl font-bold transition-colors ${
                    currentPage === i + 1 
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" 
                      : "border border-border/50 bg-background/50 hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex size-10 items-center justify-center rounded-xl border border-border/50 bg-background/50 hover:bg-muted transition-colors disabled:opacity-50"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}
