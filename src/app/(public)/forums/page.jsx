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
import ForumPostCard from "@/components/forums/ForumPostCard";

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
  
  const limit = 7; // 1 main + 3 side + 3 latest

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getForumPosts(1, limit);
        if (data.message) throw new Error(data.message);
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Split posts for the layout
  const featuredMain = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const featuredSide = filteredPosts.slice(1, 4);
  const latestPosts = filteredPosts.slice(4);

  return (
    <main className="min-h-screen bg-background pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[450px] md:h-[500px] flex flex-col items-center justify-center pt-10 overflow-hidden">
        {/* Seamless Gradient Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-500/15 via-background/80 to-background dark:from-purple-500/15 dark:via-background/80 dark:to-background pointer-events-none">
          <div className="absolute top-0 inset-x-0 h-full overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-purple-500/20 blur-[120px]" />
            <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-blue-500/20 blur-[120px]" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="author" className="inline-flex items-center gap-2 bg-background/60 backdrop-blur-md border-border/50 text-foreground shadow-sm">
              <Sparkles className="size-3.5 text-purple-500" /> Premium Community
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-extrabold text-foreground tracking-tight drop-shadow-sm leading-tight max-w-4xl mx-auto">
              Fitness Is Essential For Your Life. Join The Discussion.
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto pt-6">
              <div className="relative w-full flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles, categories, and discussions..." 
                  className="h-14 w-full rounded-full pl-13 bg-background/80 border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-purple-500 backdrop-blur-md text-base shadow-xl transition-all"
                />
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto h-14 rounded-full bg-purple-600 hover:bg-purple-700 px-8 font-bold transition-all shadow-lg shadow-purple-600/30 text-base text-white border-0">
                <Link href="/dashboard/trainer/forum-posts/add">
                  <PlusCircle className="size-5 mr-2" />
                  New Post
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 space-y-24 mt-16 animate-in fade-in duration-1000 delay-300">
        
        {loading ? (
          <div className="py-24 text-center">
            <h3 className="text-xl font-bold text-foreground animate-pulse">Loading amazing discussions...</h3>
          </div>
        ) : error ? (
          <div className="py-24 text-center text-red-500">
            <h3 className="text-xl font-bold">Error loading posts</h3>
            <p className="mt-2">{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted/50 mb-4 text-muted-foreground">
              <Search className="size-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No posts found</h3>
            <p className="mt-2 text-muted-foreground">Try adjusting your search terms.</p>
          </div>
        ) : (
          <>
            {/* 2. Popular Discussions (Split Layout) */}
            {featuredMain && (
              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h2 className="font-heading text-3xl font-extrabold tracking-tight">Popular Discussions</h2>
                  <Sparkles className="size-6 text-purple-500" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Side: Large Featured Post */}
                  <div className="lg:col-span-8">
                    <Link href={`/forums/${featuredMain._id}`} className="block group">
                      <div className="relative overflow-hidden rounded-[2rem] aspect-video w-full border border-border/50 bg-card/50 shadow-2xl transition-all duration-500 group-hover:shadow-purple-500/20 group-hover:-translate-y-1">
                        {featuredMain.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={featuredMain.image} alt={featuredMain.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                            <MessageSquareText className="size-16 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute top-6 left-6 flex gap-2">
                          <Badge className="bg-purple-600 text-white font-bold px-3 py-1 text-sm border-0 shadow-lg">Featured</Badge>
                          {featuredMain.category && (
                            <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-md px-3 py-1 text-sm shadow-sm">
                              {featuredMain.category}
                            </Badge>
                          )}
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 pt-24">
                          <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4 group-hover:text-purple-300 transition-colors drop-shadow-md">
                            {featuredMain.title}
                          </h3>
                          <div className="flex items-center gap-4 text-white/90 text-sm font-semibold">
                            <span className="flex items-center gap-2">
                              <Avatar className="size-6 border border-white/20">
                                <AvatarImage src={featuredMain.authorImage} />
                                <AvatarFallback className="bg-white/10 text-white">{featuredMain.author ? featuredMain.author.charAt(0).toUpperCase() : "A"}</AvatarFallback>
                              </Avatar>
                              {featuredMain.author || "Anonymous"}
                            </span>
                            <span>•</span>
                            <span>{new Date(featuredMain.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><ThumbsUp className="size-4" /> {featuredMain.upvotes || 0}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Right Side: Stacked Smaller Posts */}
                  <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                    {featuredSide.map(post => (
                      <Link href={`/forums/${post._id}`} key={post._id} className="block group">
                        <div className="flex gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-purple-500/30 transition-all duration-300">
                          <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-muted/30 border border-border/50 relative">
                            {post.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                              <MessageSquareText className="size-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/30" />
                            )}
                          </div>
                          <div className="flex flex-col justify-center">
                            {post.category && (
                              <span className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-1 block">
                                {post.category}
                              </span>
                            )}
                            <h4 className="font-heading text-lg font-bold text-foreground leading-snug line-clamp-2 group-hover:text-purple-500 transition-colors mb-2">
                              {post.title}
                            </h4>
                            <span className="text-xs text-muted-foreground font-medium">
                              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 4. Explore Categories (Portrait Cards) */}
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <h2 className="font-heading text-3xl font-extrabold tracking-tight">Explore Categories</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Card 1: Yoga */}
                <div className="group relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-xl border border-border/50">
                  <img src="/images/forums/category_yoga_portrait.png" alt="Yoga" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-8">
                    <Badge className="bg-purple-500/80 text-white border-white/20 backdrop-blur-md mb-3 px-3 py-1">Mind & Body</Badge>
                    <h3 className="font-heading text-3xl font-extrabold text-white mb-2">Yoga & Mobility</h3>
                    <p className="text-white/80 font-medium text-sm line-clamp-2">Discover flows, poses, and techniques to improve flexibility and mental clarity.</p>
                  </div>
                </div>

                {/* Card 2: Strength */}
                <div className="group relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-xl border border-border/50">
                  <img src="/images/forums/category_strength_portrait.png" alt="Strength Training" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-8">
                    <Badge className="bg-blue-500/80 text-white border-white/20 backdrop-blur-md mb-3 px-3 py-1">Power</Badge>
                    <h3 className="font-heading text-3xl font-extrabold text-white mb-2">Strength Training</h3>
                    <p className="text-white/80 font-medium text-sm line-clamp-2">Master your form, build muscle, and crush your PRs with community advice.</p>
                  </div>
                </div>

                {/* Card 3: Cardio */}
                <div className="group relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-xl border border-border/50">
                  <img src="/images/forums/category_cardio_portrait.png" alt="Cardio" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-8">
                    <Badge className="bg-orange-500/80 text-white border-white/20 backdrop-blur-md mb-3 px-3 py-1">Endurance</Badge>
                    <h3 className="font-heading text-3xl font-extrabold text-white mb-2">Cardio & HIIT</h3>
                    <p className="text-white/80 font-medium text-sm line-clamp-2">Boost your stamina and burn calories with intense, high-energy routines.</p>
                  </div>
                </div>

              </div>
            </section>

            {/* 3. Latest Discussions (Grid Layout) */}
            {latestPosts.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h2 className="font-heading text-3xl font-extrabold tracking-tight">Latest Discussions</h2>
                  <Button asChild variant="ghost" className="font-bold text-muted-foreground hover:text-foreground">
                    <Link href="/forums/latest">
                      View All <ArrowRight className="size-4 ml-2" />
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {latestPosts.map(post => (
                    <ForumPostCard key={post._id} post={post} />
                  ))}
                </div>
              </section>
            )}




            
          </>
        )}

      </div>
    </main>
  );
}
