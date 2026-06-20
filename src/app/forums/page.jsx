"use client";

import { ArrowRight, ChevronLeft, ChevronRight, MessageSquareText, PlusCircle, Search, Sparkles, ThumbsUp, ShieldCheck, Dumbbell } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { getForumPosts } from "@/lib/api/forumPosts";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const RoleBadge = ({ role, className }) => {
  const isTrainer = role?.toLowerCase() === "trainer";
  const isAdmin = role?.toLowerCase() === "admin";

  if (isAdmin) {
    return (
      <Badge variant="danger" className={`gap-1 shadow-none ${className}`}>
        <ShieldCheck className="size-3" />
        {role}
      </Badge>
    );
  }
  
  if (isTrainer) {
    return (
      <Badge className={`gap-1 shadow-none bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-0 ${className}`}>
        <Dumbbell className="size-3" />
        {role}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={`${className}`}>
      {role || "Member"}
    </Badge>
  );
};

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
          <Badge variant="author" className="inline-flex items-center gap-2">
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
          <Button asChild size="lg" className="w-full sm:w-auto h-12 rounded-2xl hover:bg-purple-600 px-6 font-bold transition-all shadow-lg text-base">
            <Link href="/dashboard/trainer/forum-posts/add">
              <PlusCircle className="size-5" />
              New Post
            </Link>
          </Button>
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
                <div className="flex flex-col sm:flex-row p-4 sm:p-5 gap-5 sm:gap-6">
                  {/* Optional Image */}
                  {post.image && (
                    <div className="w-full sm:w-64 h-48 sm:h-auto shrink-0 relative overflow-hidden rounded-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    
                    <CardHeader className="p-0 pb-3 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={post.authorImage} />
                            <AvatarFallback>{post.author ? post.author.charAt(0).toUpperCase() : "A"}</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">{post.author || "Anonymous"}</span>
                            <RoleBadge role={post.role} />
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mt-1">
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20 font-semibold shadow-none mb-2">
                          {post.category || "General"}
                        </Badge>
                        <Link href={`/forums/${post._id}`} className="block group/title">
                          <CardTitle className="font-heading text-xl sm:text-2xl font-bold text-foreground leading-tight group-hover/title:text-purple-500 transition-colors">
                            {post.title}
                          </CardTitle>
                        </Link>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-0 pb-4">
                      <Link href={`/forums/${post._id}`}>
                        <CardDescription className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                          {post.description}
                        </CardDescription>
                      </Link>
                    </CardContent>

                    <CardFooter className="p-0 mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
                        <span className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors cursor-pointer">
                          <ThumbsUp className="size-4" /> {post.upvotes || 0}
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer">
                          <MessageSquareText className="size-4" /> {post.comments || 0}
                        </span>
                      </div>
                      <Button variant="ghost" asChild className="group-hover:text-purple-500 transition-colors font-bold -mr-4">
                        <Link href={`/forums/${post._id}`}>
                          Read More <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>

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
                  className={`size-10 rounded-xl font-bold ${
                    currentPage === i + 1 
                      ? "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20" 
                      : "border-border/50 bg-background/50"
                  }`}
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

        </section>

      </div>
    </main>
  );
}
