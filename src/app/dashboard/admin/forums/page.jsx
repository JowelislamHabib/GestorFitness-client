"use client";

import { MessageSquareText, PlusCircle, Search, SlidersHorizontal, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

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
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-2xl border border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="h-11 rounded-2xl border border-border/50 bg-background/50 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
            <option>All Authors</option>
            <option>Members</option>
            <option>Trainers</option>
            <option>Admins</option>
          </select>
          <button className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50 hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Posts Table */}
      <section className="overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs w-1/2">Post Details</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Engagement</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockPosts.map((post) => (
                <tr key={post.id} className="group hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 mt-1 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 font-bold group-hover:scale-105 transition-transform">
                        <MessageSquareText className="size-6" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-base leading-tight group-hover:text-blue-600 transition-colors cursor-pointer">{post.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs font-semibold text-foreground">{post.author}</span>
                          <span className="inline-flex rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                            {post.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-muted-foreground font-medium">
                      <span className="flex items-center gap-1"><ThumbsUp className="size-3.5 text-emerald-500" /> {post.likes}</span>
                      <span className="flex items-center gap-1"><ThumbsDown className="size-3.5 text-red-400" /> {post.dislikes}</span>
                      <span className="flex items-center gap-1"><MessageSquareText className="size-3.5" /> {post.comments}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-muted-foreground font-medium">{post.date}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500 hover:text-white transition-all"
                      aria-label="Delete Post"
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
