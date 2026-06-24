"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getForumPosts } from "@/lib/api/forumPosts";
import ForumPostCard from "@/components/forums/ForumPostCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import GlobalLoading from "@/components/shared/GlobalLoading";

export default function BlogSection() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getForumPosts(1, 3); // Fetch the 3 most recent posts
        if (!data.message) {
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error("Failed to fetch latest forum posts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return <GlobalLoading message="Loading Discussions..." />;
  }

  // If there are no posts, we can hide the section or show a message.
  if (posts.length === 0) return null;

  return (
    <section className="relative w-full py-20 md:py-32 bg-background overflow-hidden border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-16 md:mb-24"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 md:w-12 bg-red-600" />
            <span className="text-[10px] md:text-xs font-bold text-red-600 uppercase tracking-[0.2em]">Community Forum</span>
            <div className="h-[2px] w-8 md:w-12 bg-red-600" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight text-foreground uppercase leading-none">
            Latest Discussions
          </h2>
          <p className="text-muted-foreground mt-6 max-w-2xl text-sm md:text-base leading-relaxed">
            Stay updated with the latest tips, guides, and discussions from our expert trainers and active community members.
          </p>
        </motion.div>

        {/* Blog / Forum Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="h-full"
            >
              <ForumPostCard post={post} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <Button asChild variant="outline" className="h-14 px-8 uppercase tracking-widest text-xs font-bold border-border/50 hover:bg-muted transition-all group">
            <Link href="/forums">
              View All Posts
              <ArrowRight className="ml-3 size-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
