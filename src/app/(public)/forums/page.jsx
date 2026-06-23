"use client";

import { ArrowRight, ChevronLeft, ChevronRight, MessageSquareText, PlusCircle, Search, Sparkles, ThumbsUp, ShieldCheck, Dumbbell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
      <Badge className={`gap-1 shadow-none bg-red-500/10 text-red-600 hover:bg-red-500/20 border-0 ${className}`}>
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
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const limit = 8; // 1 main + 4 side + 3 latest

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

  // Split posts for the layout
  const featuredMain = posts.length > 0 ? posts[0] : null;
  const featuredSide = posts.slice(1, 5);
  const latestPosts = posts.slice(5);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search");
    if (query && query.trim()) {
      router.push(`/forums/latest?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <main className="min-h-screen bg-background pb-16">
      
      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-8">
        {/* Header Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-12 md:mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 md:w-12 bg-red-600" />
            <span className="text-[10px] md:text-xs font-bold text-red-600 uppercase tracking-[0.2em]">Premium Community</span>
            <div className="h-[2px] w-8 md:w-12 bg-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight text-foreground uppercase leading-none">
            Fitness Is Essential For Your Life.<br/>Join The Discussion.
          </h1>
        </motion.section>

        {/* Sleek Unified Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center w-full max-w-3xl bg-background rounded-md border border-border shadow-sm p-2 gap-2 sm:gap-0">
            
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input 
                name="search"
                placeholder="Search articles, categories, and discussions..." 
                className="h-12 w-full rounded-md sm:rounded-r-none pl-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base shadow-none"
              />
            </div>

            <div className="hidden sm:block w-px h-8 bg-border mx-2 shrink-0" />

            <Button type="submit" className="h-12 w-full sm:w-auto px-8 rounded-md bg-red-600 text-white font-bold uppercase tracking-wider text-xs hover:bg-red-700 transition-colors shadow-none flex items-center justify-center shrink-0 mt-2 sm:mt-0">
              Search
            </Button>
            
          </form>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 space-y-24 mt-8 lg:mt-16 animate-in fade-in duration-1000 delay-300">
        
        {loading ? (
          <div className="py-24 text-center">
            <h3 className="text-xl font-bold text-foreground animate-pulse">Loading amazing discussions...</h3>
          </div>
        ) : error ? (
          <div className="py-24 text-center text-red-500">
            <h3 className="text-xl font-bold">Error loading posts</h3>
            <p className="mt-2">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted/50 mb-4 text-muted-foreground">
              <Search className="size-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No posts found</h3>
            <p className="mt-2 text-muted-foreground">Check back later for new discussions.</p>
          </div>
        ) : (
          <>
            {/* 2. Popular Discussions (Split Layout) */}
            {featuredMain && (
              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h2 className="text-xl lg:text-2xl font-black uppercase text-foreground flex items-center gap-2">
                    <span className="bg-red-600 w-1.5 h-5 rounded-full inline-block"></span>
                    Popular Discussions
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Side: Large Featured Post */}
                  <div className="lg:col-span-8">
                    <Link href={`/forums/${featuredMain._id}`} className="block group">
                      <div className="relative overflow-hidden rounded-xl aspect-video w-full border border-border/50 bg-card/50 shadow-2xl transition-all duration-500 group-hover:shadow-red-600/20 group-hover:-translate-y-1">
                        {featuredMain.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={featuredMain.image} alt={featuredMain.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                            <MessageSquareText className="size-16 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute top-6 left-6 flex gap-2">
                          <Badge className="bg-red-600 text-white uppercase tracking-widest px-3 py-1 text-[10px] font-bold border-0 shadow-lg">Featured</Badge>
                          {featuredMain.category && (
                            <Badge variant="outline" className="bg-black/50 text-white border-white/20 uppercase tracking-widest backdrop-blur-md px-3 py-1 text-[10px] font-bold shadow-sm">
                              {featuredMain.category}
                            </Badge>
                          )}
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 pt-24">
                          <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase text-white leading-tight mb-4 group-hover:text-red-500 transition-colors drop-shadow-md">
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
                  <div className="lg:col-span-4 grid grid-cols-1 gap-3">
                    {featuredSide.map(post => (
                      <Link href={`/forums/${post._id}`} key={post._id} className="block group">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-sm hover:shadow-md hover:border-red-600/30 transition-all duration-300">
                          <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-muted/30 border border-border/50 relative">
                            {post.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                              <MessageSquareText className="size-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/30" />
                            )}
                          </div>
                          <div className="flex flex-col justify-center">
                            {post.category && (
                              <Badge className="w-fit bg-red-600/10 text-red-600 border-red-600/20 px-2 py-0.5 uppercase tracking-widest text-[8px] font-bold mb-1">
                                {post.category}
                              </Badge>
                            )}
                            <h4 className="font-heading text-sm sm:text-base font-black uppercase text-foreground leading-tight line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
                              {post.title}
                            </h4>
                            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
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
                <h2 className="text-xl lg:text-2xl font-black uppercase text-foreground flex items-center gap-2">
                  <span className="bg-red-600 w-1.5 h-5 rounded-full inline-block"></span>
                  Explore Categories
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Card 1: Yoga */}
                <Link href="/forums/latest?category=Yoga" className="group relative h-[450px] rounded-xl overflow-hidden shadow-xl border border-border/50 block">
                  <img src="/images/forums/category_yoga_portrait.png" alt="Yoga" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-8">
                    <Badge className="bg-red-600 text-white uppercase tracking-widest px-3 py-1 text-[10px] font-bold border-0 shadow-lg mb-3">Mind & Body</Badge>
                    <h3 className="font-heading text-3xl font-black uppercase tracking-tight text-white mb-2">Yoga</h3>
                    <p className="text-white/80 font-medium text-sm line-clamp-2">Discover flows, poses, and techniques to improve flexibility and mental clarity.</p>
                  </div>
                </Link>

                {/* Card 2: Strength */}
                <Link href="/forums/latest?category=Strength" className="group relative h-[450px] rounded-xl overflow-hidden shadow-xl border border-border/50 block">
                  <img src="/images/forums/category_strength_portrait.png" alt="Strength Training" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-8">
                    <Badge className="bg-red-600 text-white uppercase tracking-widest px-3 py-1 text-[10px] font-bold border-0 shadow-lg mb-3">Power</Badge>
                    <h3 className="font-heading text-3xl font-black uppercase tracking-tight text-white mb-2">Strength</h3>
                    <p className="text-white/80 font-medium text-sm line-clamp-2">Master your form, build muscle, and crush your PRs with community advice.</p>
                  </div>
                </Link>

                {/* Card 3: Cardio */}
                <Link href="/forums/latest?category=Cardio" className="group relative h-[450px] rounded-xl overflow-hidden shadow-xl border border-border/50 block">
                  <img src="/images/forums/category_cardio_portrait.png" alt="Cardio" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-8">
                    <Badge className="bg-red-600 text-white uppercase tracking-widest px-3 py-1 text-[10px] font-bold border-0 shadow-lg mb-3">Endurance</Badge>
                    <h3 className="font-heading text-3xl font-black uppercase tracking-tight text-white mb-2">Cardio</h3>
                    <p className="text-white/80 font-medium text-sm line-clamp-2">Boost your stamina and burn calories with intense, high-energy routines.</p>
                  </div>
                </Link>

              </div>
            </section>

            {/* 3. Latest Discussions (Grid Layout) */}
            {latestPosts.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h2 className="text-xl lg:text-2xl font-black uppercase text-foreground flex items-center gap-2">
                    <span className="bg-red-600 w-1.5 h-5 rounded-full inline-block"></span>
                    Latest Discussions
                  </h2>
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

                <div className="flex justify-center pt-8">
                  <Button asChild className="h-14 px-10 rounded-md bg-red-600 text-white font-black uppercase tracking-[0.15em] text-sm hover:bg-red-700 transition-colors shadow-md">
                    <Link href="/forums/latest">
                      View All Discussions <ArrowRight className="size-5 ml-3" />
                    </Link>
                  </Button>
                </div>
              </section>
            )}




            
          </>
        )}

      </div>
    </main>
  );
}
