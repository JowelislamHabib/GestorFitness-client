"use client";

import { MessageSquareText, PlusCircle, Search, SlidersHorizontal, ThumbsDown, ThumbsUp, Trash2, Pencil, Users, Activity, BarChart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { getForumPosts } from "@/lib/api/forumPosts";
import { updateForumPost, deleteForumPost } from "@/lib/actions/forumPosts";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { StatCard } from "@/components/ui/stat-card";
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
import { PaginationControls } from "@/components/shared/PaginationControls";
import GlobalLoading from "@/components/shared/GlobalLoading";

export default function ManageForumPosts({ role = "trainer" }) {
  const { data: session, isPending } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder, authorFilter]);

  useEffect(() => {
    if (isPending) return;
    if (role === "trainer" && !session?.user?.id) return;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const idToFetch = role === "trainer" ? session.user.id : null;
        // Limit is 10 for dashboard
        const data = await getForumPosts(currentPage, 10, idToFetch, debouncedSearchTerm, sortOrder, authorFilter); 
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
  }, [role, session?.user?.id, isPending, currentPage, debouncedSearchTerm, sortOrder, authorFilter]);

  const isAdmin = role === "admin";

  const confirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteForumPost(postToDelete);
      if (res.message && res.message.includes('Forbidden')) throw new Error(res.message);
      setPosts(posts.filter(p => p._id !== postToDelete));
      setPostToDelete(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const title = isAdmin ? "Forum Moderation" : "My Forum Posts";
  const description = isAdmin 
    ? "Monitor community posts, remove inappropriate content, or create a new announcement."
    : "Manage your contributions to the GestorFitness community.";
  const newPostUrl = `/dashboard/${role}/forum-posts/new`;

  const totalPosts = posts.length;
  const totalUpvotes = posts.reduce((sum, post) => sum + (post.upvotes || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
  const uniqueAuthors = new Set(posts.map(post => post.author).filter(Boolean)).size;
  const avgUpvotes = totalPosts > 0 ? Math.round(totalUpvotes / totalPosts) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">{title}</h1>
          <p className="mt-1 text-muted-foreground">
            {description}
          </p>
        </div>
        <Link 
          href={newPostUrl}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 dark:shadow-none transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="size-4" />
          {isAdmin ? "Create Post" : "Add New Post"}
        </Link>
      </section>

      {/* Summary Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Posts"
          value={totalPosts}
          icon={MessageSquareText}
          color="blue"
        />
        
        <StatCard
          title="Total Upvotes"
          value={totalUpvotes}
          icon={ThumbsUp}
          color="emerald"
        />

        <StatCard
          title="Total Comments"
          value={totalComments}
          icon={Activity}
          color="orange"
        />

        <StatCard
          title={isAdmin ? "Active Authors" : "Avg. Upvotes"}
          value={isAdmin ? uniqueAuthors : avgUpvotes}
          icon={isAdmin ? Users : BarChart}
          color={isAdmin ? "purple" : "cyan"}
        />
      </section>

      {/* Filters & Search */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-xl">
        <div className="relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={isAdmin ? "Search posts by title or author..." : "Search your posts by title..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-red-500/50"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="h-11 w-40 rounded-xl border-slate-200 dark:border-slate-800 bg-background/50 text-sm font-medium focus:ring-red-500/50">
                <SelectValue placeholder="All Authors" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur-xl">
                <SelectItem value="all">All Authors</SelectItem>
                <SelectItem value="members">Members</SelectItem>
                <SelectItem value="trainers">Trainers</SelectItem>
                <SelectItem value="admins">Admins</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-11 w-40 rounded-xl border-slate-200 dark:border-slate-800 bg-background/50 text-sm font-medium focus:ring-red-500/50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Sort by Date" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur-xl">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Posts Table */}
      {loading ? (
        <GlobalLoading message="Fetching posts..." />
      ) : (
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs w-2/5 h-12">Post {isAdmin ? 'Details' : 'Title'}</TableHead>
                <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Category</TableHead>
                <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Engagement</TableHead>
                <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Date</TableHead>
                <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-red-500 font-medium">
                  {error}
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-medium">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post._id} className="border-slate-200 dark:border-slate-800 group hover:bg-muted/20 even:bg-muted/10 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 font-bold group-hover:scale-105 transition-transform overflow-hidden">
                        {post.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.image} alt="" className="size-full object-cover" />
                        ) : (
                          <MessageSquareText className="size-6" />
                        )}
                      </div>
                      <div>
                        <Link 
                          href={`/forums/${post._id}`}
                          className="font-bold text-foreground text-base leading-tight group-hover:text-red-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                        {isAdmin && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs font-semibold text-foreground">{post.author || "Anonymous"}</span>
                            <Badge variant="secondary">
                              {post.role || "Member"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="font-semibold bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700">
                      {post.category || "General"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-4 text-muted-foreground font-medium">
                      <span className="flex items-center gap-1"><ThumbsUp className="size-3.5 text-red-500" /> {post.upvotes || 0}</span>
                      {isAdmin && <span className="flex items-center gap-1"><ThumbsDown className="size-3.5 text-red-400" /> {post.downvotes || 0}</span>}
                      <span className="flex items-center gap-1"><MessageSquareText className="size-3.5 text-orange-400" /> {post.comments || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-muted-foreground font-medium">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/${role}/forum-posts/edit/${post._id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
                        aria-label="Edit Post"
                      >
                        <Pencil className="size-3.5" /> Edit
                      </Link>
                      <button 
                        onClick={() => setPostToDelete(post._id)}
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/50"
                        aria-label="Delete Post"
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Card>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6 bg-background rounded-xl shadow-2xl space-y-6 text-center border-slate-200 dark:border-slate-800">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 mb-4">
              <Trash2 className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Delete Post?</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                This action cannot be undone. Are you sure you want to permanently delete this post?
              </p>
            </div>
            
            <div className="flex justify-center gap-3 pt-4">
              <button 
                onClick={() => setPostToDelete(null)}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 rounded-xl shadow-lg shadow-red-600/20 dark:shadow-none transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
