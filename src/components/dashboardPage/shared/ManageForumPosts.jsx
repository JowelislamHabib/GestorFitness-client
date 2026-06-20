"use client";

import { MessageSquareText, PlusCircle, Search, SlidersHorizontal, ThumbsDown, ThumbsUp, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { getForumPosts } from "@/lib/api/forumPosts";
import { updateForumPost, deleteForumPost } from "@/lib/actions/forumPosts";
import { useSession } from "@/lib/auth-client";
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

export default function ManageForumPosts({ role = "trainer" }) {
  const { data: session, isPending } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (role === "trainer" && !session?.user?.id) return;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const idToFetch = role === "trainer" ? session.user.id : null;
        const data = await getForumPosts(1, 50, idToFetch); 
        if (data.message) throw new Error(data.message);
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [role, session?.user?.id, isPending]);

  const filteredPosts = posts.filter((post) => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteForumPost(postToDelete);
      if (res.message && res.message.includes('Forbidden')) throw new Error(res.message);
      setPosts(posts.filter(p => p._id !== postToDelete));
      setPostToDelete(null);
    } catch (err) {
      alert(err.message || "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const isAdmin = role === "admin";
  const title = isAdmin ? "Forum Moderation" : "My Forum Posts";
  const description = isAdmin 
    ? "Monitor community posts, remove inappropriate content, or create a new announcement."
    : "Manage your contributions to the GestorFitness community.";
  const newPostUrl = `/dashboard/${role}/forum-posts/new`;

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
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="size-4" />
          {isAdmin ? "Create Post" : "Add New Post"}
        </Link>
      </section>

      {/* Filters & Search */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-3xl">
        <div className="relative w-full container">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={isAdmin ? "Search posts by title or author..." : "Search your posts by title..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-2xl border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-blue-500/50"
          />
        </div>
        {isAdmin ? (
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
        ) : (
          <button className="flex h-11 items-center gap-2 rounded-2xl border border-border/50 bg-background/50 px-4 text-sm font-medium hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <span>Sort by Date</span>
          </button>
        )}
      </Card>

      {/* Posts Table */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs w-2/5 h-12">Post {isAdmin ? 'Details' : 'Title'}</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Category</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Engagement</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Date</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-medium animate-pulse">
                  Loading posts...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-red-500 font-medium">
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-medium">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post._id} className="border-border/50 group hover:bg-muted/20 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 mt-1 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 font-bold group-hover:scale-105 transition-transform overflow-hidden">
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
                          className="font-bold text-foreground text-base leading-tight group-hover:text-blue-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                        {isAdmin ? (
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs font-semibold text-foreground">{post.author || "Anonymous"}</span>
                            <Badge variant="secondary">
                              {post.role || "Member"}
                            </Badge>
                          </div>
                        ) : (
                          <Badge variant="success" className="mt-2">
                            {post.upvotes || 0} Upvotes
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="bg-muted/50 text-muted-foreground font-semibold border-border/50">
                      {post.category || "General"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4 text-muted-foreground font-medium">
                      <span className="flex items-center gap-1"><ThumbsUp className="size-3.5 text-blue-500" /> {post.upvotes || 0}</span>
                      {isAdmin && <span className="flex items-center gap-1"><ThumbsDown className="size-3.5 text-red-400" /> {post.downvotes || 0}</span>}
                      <span className="flex items-center gap-1"><MessageSquareText className="size-3.5 text-orange-400" /> {post.comments || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-muted-foreground font-medium">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/${role}/forum-posts/edit/${post._id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-500 hover:text-white transition-all"
                        aria-label="Edit Post"
                      >
                        <Pencil className="size-3.5" /> Edit
                      </Link>
                      <button 
                        onClick={() => setPostToDelete(post._id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500 hover:text-white transition-all"
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
      </Card>

      {/* Delete Confirmation Modal Overlay */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6 bg-background rounded-3xl shadow-2xl space-y-6 text-center border-border/50">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 mb-4">
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
                className="px-5 py-2.5 text-sm font-semibold rounded-2xl bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-2xl hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
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
