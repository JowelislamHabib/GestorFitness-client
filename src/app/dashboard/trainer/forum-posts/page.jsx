"use client";

import { MessageSquareText, PlusCircle, Search, SlidersHorizontal, ThumbsUp, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockPosts = [
  { id: 1, title: "How to build consistency without burnout", comments: 14, likes: 120, date: "2 hours ago", status: "Published" },
  { id: 2, title: "Mobility drills for desk workers", comments: 45, likes: 89, date: "Yesterday", status: "Published" },
  { id: 3, title: "Why recovery days still count", comments: 102, likes: 450, date: "Oct 01, 2025", status: "Published" },
];

export default function TrainerForumPostsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">My Forum Posts</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your contributions to the GestorFitness community.
          </p>
        </div>
        <Link 
          href="/dashboard/trainer/forum-posts/new"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="size-4" />
          Add New Post
        </Link>
      </section>

      {/* Filters & Search */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-3xl">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your posts by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-2xl border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-blue-500/50"
          />
        </div>
        <button className="flex h-11 items-center gap-2 rounded-2xl border border-border/50 bg-background/50 px-4 text-sm font-medium hover:bg-muted transition-colors">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <span>Sort by Date</span>
        </button>
      </Card>

      {/* Posts Table */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs w-1/2 h-12">Post Title</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Engagement</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Date</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPosts.map((post) => (
              <TableRow key={post.id} className="border-border/50 group hover:bg-muted/20 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 mt-1 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 font-bold group-hover:scale-105 transition-transform">
                      <MessageSquareText className="size-6" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-base leading-tight group-hover:text-blue-600 transition-colors cursor-pointer">{post.title}</p>
                      <Badge className="mt-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0 text-[9px] font-bold uppercase tracking-wider rounded-md">
                        {post.status}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-4 text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><ThumbsUp className="size-3.5 text-blue-500" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquareText className="size-3.5 text-orange-400" /> {post.comments}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-muted-foreground font-medium">{post.date}</span>
                </TableCell>
                <TableCell className="py-4 text-right">
                  <button 
                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500 hover:text-white transition-all"
                    aria-label="Delete Post"
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
