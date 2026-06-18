"use client";

import { MessageSquareText, PlusCircle, Search, SlidersHorizontal, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockPosts = [
  { id: 1, title: "10 Tips for Better Recovery After Heavy Lifting", author: "Maya Calder", role: "Trainer", comments: 14, likes: 120, dislikes: 2, date: "2 hours ago" },
  { id: 2, title: "Is Keto really effective for long-term weight loss?", author: "David Miller", role: "Member", comments: 45, likes: 89, dislikes: 12, date: "Yesterday" },
  { id: 3, title: "Welcome to GestorFitness Community! Read the rules.", author: "System Admin", role: "Admin", comments: 102, likes: 450, dislikes: 0, date: "Oct 01, 2025" },
  { id: 4, title: "My 3-month body transformation journey (with pics!)", author: "Jessica Alba", role: "Member", comments: 28, likes: 210, dislikes: 5, date: "Oct 12, 2025" },
];

export default function ForumWatchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Forum Moderation</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor community posts, remove inappropriate content, or create a new announcement.
          </p>
        </div>
        <Link 
          href="/dashboard/admin/forums/new"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="size-4" />
          Create Post
        </Link>
      </section>

      {/* Filters & Search */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-3xl">
        <div className="relative w-full container">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-2xl border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-blue-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-11 w-40 rounded-2xl border-border/50 bg-background/50 text-sm font-medium focus:ring-blue-500/50">
              <SelectValue placeholder="All Authors" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
              <SelectItem value="all">All Authors</SelectItem>
              <SelectItem value="members">Members</SelectItem>
              <SelectItem value="trainers">Trainers</SelectItem>
              <SelectItem value="admins">Admins</SelectItem>
            </SelectContent>
          </Select>
          <button className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50 hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </Card>

      {/* Posts Table */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs w-1/2 h-12">Post Details</TableHead>
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
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs font-semibold text-foreground">{post.author}</span>
                        <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider py-0 rounded-sm">
                          {post.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-4 text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><ThumbsUp className="size-3.5 text-emerald-500" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><ThumbsDown className="size-3.5 text-red-400" /> {post.dislikes}</span>
                    <span className="flex items-center gap-1"><MessageSquareText className="size-3.5" /> {post.comments}</span>
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
