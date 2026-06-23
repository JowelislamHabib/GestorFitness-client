"use client";

import { ArrowLeft, ChevronRight, MessageSquareText, MoreHorizontal, Send, Share2, ThumbsDown, ThumbsUp, Trash2, Pencil, ShieldCheck, Dumbbell } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { useSession } from "@/lib/auth-client";
import { getForumPost } from "@/lib/api/forumPosts";
import { voteForumPost } from "@/lib/actions/forumPosts";
import { getForumComments } from "@/lib/api/forumComments";
import { createForumComment, updateForumComment, deleteForumComment, likeForumComment } from "@/lib/actions/forumComments";
import { getClasses } from "@/lib/api/classes";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function ForumPostDetailsPage() {
  const params = useParams();
  const postId = params.id;
  const { data: session } = useSession();
  
  const RoleBadge = ({ role, className }) => {
    const isTrainer = role?.toLowerCase() === "trainer";
    const isAdmin = role?.toLowerCase() === "admin";

    if (isAdmin) {
      return (
        <Badge className={`gap-1 bg-zinc-900 text-white hover:bg-zinc-800 border-0 shadow-none uppercase tracking-wider text-[10px] ${className}`}>
          <ShieldCheck className="size-3" />
          {role}
        </Badge>
      );
    }
    
    if (isTrainer) {
      return (
        <Badge className={`gap-1 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-0 shadow-none uppercase tracking-wider text-[10px] ${className}`}>
          <Dumbbell className="size-3" />
          {role}
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className={`bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-0 shadow-none uppercase tracking-wider text-[10px] ${className}`}>
        {role || "Member"}
      </Badge>
    );
  };
  
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const commentInputRef = useRef(null);
  
  const [post, setPost] = useState(null);
  const [authorClasses, setAuthorClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await getForumPost(postId);
        if (postData.message) throw new Error(postData.message);
        setPost(postData);

        const commentsData = await getForumComments(postId);
        if (Array.isArray(commentsData)) setComments(commentsData);

        // Fetch trainer classes if applicable
        if (postData.role && postData.role.toLowerCase() === 'trainer' && postData.authorId) {
           try {
              const classesData = await getClasses({ trainerId: postData.authorId, status: 'approved', limit: 50 });
              if (classesData.classes && Array.isArray(classesData.classes)) {
                 const sorted = classesData.classes.sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0)).slice(0, 3);
                 setAuthorClasses(sorted);
              }
           } catch (err) {
              console.error("Failed to fetch author classes", err);
           }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchData();
  }, [postId]);

  const isUpvoted = session?.user && post?.upvotedBy?.includes(session.user.id);
  const isDownvoted = session?.user && post?.downvotedBy?.includes(session.user.id);

  const handleVote = async (action) => {
    if (!session?.user) {
        alert("You must be logged in to vote.");
        return;
    }

    try {
        let updatedUpvotedBy = [...(post.upvotedBy || [])];
        let updatedDownvotedBy = [...(post.downvotedBy || [])];
        const userId = session.user.id;

        if (action === "upvote") {
            if (isUpvoted) {
                updatedUpvotedBy = updatedUpvotedBy.filter(id => id !== userId);
            } else {
                updatedUpvotedBy.push(userId);
                updatedDownvotedBy = updatedDownvotedBy.filter(id => id !== userId);
            }
        } else if (action === "downvote") {
            if (isDownvoted) {
                updatedDownvotedBy = updatedDownvotedBy.filter(id => id !== userId);
            } else {
                updatedDownvotedBy.push(userId);
                updatedUpvotedBy = updatedUpvotedBy.filter(id => id !== userId);
            }
        }

        setPost({
            ...post,
            upvotedBy: updatedUpvotedBy,
            downvotedBy: updatedDownvotedBy,
            upvotes: updatedUpvotedBy.length,
            downvotes: updatedDownvotedBy.length
        });

        const res = await voteForumPost(postId, action);
        if (res.message && res.message.includes('Failed')) throw new Error(res.message);
    } catch (err) {
        alert(err.message || "Failed to register vote");
        const data = await getForumPost(postId);
        setPost(data);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!session?.user) {
        alert("You must be logged in to post a comment.");
        return;
    }

    setIsSubmittingComment(true);
    try {
        const res = await createForumComment(postId, newComment);
        if (res.message && res.message.includes('Failed')) throw new Error(res.message);
        
        // Optimistically add to list
        setComments([...comments, {
            _id: res.insertedId || Date.now(), 
            author: session.user.name,
            authorId: session.user.id,
            authorImage: session.user.image,
            role: session.user.role || "Member",
            text: newComment,
            createdAt: new Date().toISOString(),
        }]);
        setNewComment("");
        // Optimistically increment post comment count
        if (post) setPost({ ...post, comments: (post.comments || 0) + 1 });
    } catch (err) {
        alert(err.message || "Failed to post comment");
    } finally {
        setIsSubmittingComment(false);
    }
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    setIsDeletingComment(true);
    try {
        await deleteForumComment(commentToDelete);
        setComments(comments.filter(c => c._id !== commentToDelete));
        if (post) setPost({ ...post, comments: Math.max(0, (post.comments || 0) - 1) });
        setCommentToDelete(null);
    } catch (err) {
        alert("Failed to delete comment");
    } finally {
        setIsDeletingComment(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
        await updateForumComment(commentId, editCommentText);
        setComments(comments.map(c => c._id === commentId ? { ...c, text: editCommentText } : c));
        setEditingCommentId(null);
    } catch (err) {
        alert("Failed to update comment");
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!session?.user) {
        alert("You must be logged in to like a comment.");
        return;
    }
    
    // Optimistic update
    setComments(comments.map(c => {
        if (c._id === commentId) {
            const likedBy = c.likedBy || [];
            const hasLiked = likedBy.includes(session.user.id);
            return { 
                ...c, 
                likedBy: hasLiked ? likedBy.filter(id => id !== session.user.id) : [...likedBy, session.user.id] 
            };
        }
        return c;
    }));

    try {
        const res = await likeForumComment(commentId);
        if (res.message && res.message.includes('Failed')) throw new Error(res.message);
    } catch (err) {
        // Revert on error
        const commentsData = await getForumComments(postId);
        if (Array.isArray(commentsData)) setComments(commentsData);
        alert("Failed to like comment");
    }
  };

  const handleReplyClick = (authorName) => {
    setNewComment((prev) => prev ? `${prev} @${authorName} ` : `@${authorName} `);
    if (commentInputRef.current) {
        commentInputRef.current.focus();
        commentInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 container space-y-8">
        
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm font-medium text-muted-foreground"
        >
          <Link href="/forums/latest" className="hover:text-foreground transition-colors flex items-center gap-1 shrink-0">
            <ArrowLeft className="size-4 shrink-0" /> <span className="whitespace-nowrap">Back to All Posts</span>
          </Link>
          <ChevronRight className="size-4 shrink-0 hidden sm:block" />
          <span className="text-foreground truncate max-w-[200px] sm:max-w-md md:max-w-xl">{post ? post.title : "Loading..."}</span>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="size-12 rounded-full border-4 border-red-600 border-t-transparent animate-spin mb-4" />
              <p className="text-muted-foreground font-bold">Loading post details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-black uppercase text-red-600">Post Not Found</h2>
              <p className="text-muted-foreground">{error}</p>
              <Link href="/forums" className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 text-sm font-bold uppercase text-white hover:bg-red-700 transition-colors shadow-sm">
                <ArrowLeft className="size-4" /> Return to Forums
              </Link>
            </div>
          </div>
        ) : post ? (
          <div className={`grid grid-cols-1 ${authorClasses.length > 0 ? "lg:grid-cols-[1fr_380px]" : ""} gap-8 items-start`}>
            <div className="min-w-0 space-y-8">
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-8"
              >
          
          {/* Main Post Card */}
          <Card className="overflow-hidden rounded-xl border border-border shadow-sm p-4 sm:p-6 bg-background">
            
            {/* Featured Image */}
            {post.image && (
              <div className="h-[300px] sm:h-[400px] w-full relative rounded-lg overflow-hidden mb-8 border border-border/50 bg-zinc-100 dark:bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={post.image} 
                  alt="Post Cover" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col">
              
              <CardHeader className="p-0 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-14 rounded-full border border-border/50">
                      <AvatarImage src={post.authorImage} />
                      <AvatarFallback className="rounded-full text-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-black uppercase">{post.author ? post.author.charAt(0) : "A"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-foreground text-lg uppercase tracking-wide">{post.author || "Anonymous"}</span>
                        <RoleBadge role={post.role} />
                      </div>
                      <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
                        <span>{new Date(post.createdAt).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                </div>
                <Separator className="bg-border" />
              </CardHeader>

              <CardContent className="space-y-8 p-0">
                <CardTitle className="font-heading text-3xl sm:text-4xl font-black uppercase text-foreground leading-none">
                  {post.title}
                </CardTitle>
                
                <div className="mt-8 prose prose-gray dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-base">
                  {post.description?.split('\n\n').map((paragraph, i) => {
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={i} className="text-xl font-bold uppercase text-foreground mt-8 mb-4 tracking-wider">{paragraph.replace('### ', '')}</h3>;
                    }
                    return <p key={i} className="whitespace-pre-line">{paragraph}</p>;
                  })}
                </div>
              </CardContent>

              <CardFooter className="p-0 pt-8 pb-2 flex-col items-start">
                <Separator className="mb-6 w-full bg-border" />
                <div className="flex items-center gap-4 w-full">
                  <div className="flex items-center rounded-md border border-border bg-background overflow-hidden font-bold">
                    <Button 
                      variant="ghost"
                      onClick={() => handleVote("upvote")}
                      className={`gap-2 px-4 h-11 rounded-none transition-colors uppercase tracking-wider text-xs ${
                        isUpvoted ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-500" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <ThumbsUp className={`size-4 ${isUpvoted ? "fill-emerald-500" : ""}`} />
                      {post.upvotes || 0}
                    </Button>
                    <div className="w-px h-6 bg-border" />
                    <Button 
                      variant="ghost"
                      onClick={() => handleVote("downvote")}
                      className={`gap-2 px-4 h-11 rounded-none transition-colors uppercase tracking-wider text-xs ${
                        isDownvoted ? "bg-red-600/10 text-red-600 hover:bg-red-600/20 hover:text-red-600" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <ThumbsDown className={`size-4 ${isDownvoted ? "fill-red-600" : ""}`} />
                      {post.downvotes || 0}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4 h-11 rounded-md border border-border bg-background text-muted-foreground font-bold uppercase tracking-wider text-xs cursor-default">
                    <MessageSquareText className="size-4" />
                    {comments.length} Comments
                  </div>
                </div>
              </CardFooter>

            </div>
          </Card>

          {/* Comments Section */}
          <section className="space-y-6 pt-8">
            <h2 className="font-heading text-2xl font-black uppercase text-foreground">Discussion ({comments.length})</h2>
            
            {/* New Comment Input */}
            <Card className="p-4 sm:p-6 rounded-xl border border-border bg-zinc-100 dark:bg-zinc-900/50 flex gap-4 shadow-none">
              <Avatar className="hidden sm:flex size-10 rounded-full border border-border/50">
                <AvatarImage src={session?.user?.image} />
                <AvatarFallback className="rounded-full bg-background text-foreground font-black uppercase">{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <form onSubmit={handleCommentSubmit} className="flex-1 flex flex-col gap-3">
                <Textarea 
                  ref={commentInputRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={session?.user ? "Share your thoughts..." : "Please log in to join the discussion."}
                  disabled={!session?.user || isSubmittingComment}
                  className="rounded-md border border-border bg-background p-4 font-medium focus-visible:ring-red-600 resize-none min-h-[100px] shadow-sm text-base"
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    disabled={!newComment.trim() || !session?.user || isSubmittingComment}
                    className="gap-2 rounded-md bg-red-600 px-6 h-12 text-xs uppercase tracking-wider font-bold text-white shadow-sm hover:bg-red-700 transition-all"
                  >
                    <Send className="size-4" /> {isSubmittingComment ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </form>
            </Card>

            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment._id} className="p-4 sm:p-6 rounded-xl border border-border bg-background shadow-sm">
                  <div className="flex items-start gap-4">
                    <Avatar className="size-10 rounded-full border border-border/50">
                      <AvatarImage src={comment.authorImage} />
                      <AvatarFallback className="rounded-full font-black uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                        {comment.author?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-foreground text-sm uppercase tracking-wider">{comment.author || "Anonymous"}</span>
                          <RoleBadge role={comment.role} />
                          {post?.authorId && post.authorId === comment.authorId && (
                            <Badge variant="outline" className="uppercase tracking-wider text-[10px] bg-amber-500/10 text-amber-600 border-0 shrink-0">
                              Author
                            </Badge>
                          )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">{new Date(comment.createdAt).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      {editingCommentId === comment._id ? (
                        <div className="mt-4 space-y-2">
                          <Textarea 
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="text-base rounded-md border-border focus-visible:ring-red-600 min-h-[80px]"
                          />
                          <div className="flex gap-2 pt-2">
                              <Button size="sm" onClick={() => handleUpdateComment(comment._id)} className="h-9 px-4 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm">Save</Button>
                              <Button variant="outline" size="sm" onClick={() => setEditingCommentId(null)} className="h-9 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground rounded-md">Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-foreground text-base leading-relaxed mt-4 whitespace-pre-line">
                          {comment.text}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleReplyClick(comment.author || "Anonymous")} className="h-8 text-[10px] uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground rounded-md">Reply</Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleLikeComment(comment._id)}
                                className={`h-8 text-[10px] uppercase tracking-wider font-bold rounded-md gap-1 ${
                                    comment.likedBy?.includes(session?.user?.id) 
                                    ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-500" 
                                    : "text-muted-foreground hover:text-emerald-500"
                                }`}
                            >
                                <ThumbsUp className={`size-3 ${comment.likedBy?.includes(session?.user?.id) ? "fill-emerald-500" : ""}`} />
                                Like {comment.likedBy?.length > 0 && `(${comment.likedBy.length})`}
                            </Button>
                        </div>
                        
                        {(session?.user?.id === comment.authorId || session?.user?.role === "admin") && (
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Button variant="ghost" size="sm" onClick={() => { setEditingCommentId(comment._id); setEditCommentText(comment.text); }} className="h-8 flex-1 sm:flex-none text-[10px] uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground rounded-md gap-1">
                                    <Pencil className="size-3" /> Edit
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setCommentToDelete(comment._id)} className="h-8 flex-1 sm:flex-none text-[10px] uppercase tracking-wider font-bold text-muted-foreground hover:bg-red-600/10 hover:text-red-600 rounded-md gap-1">
                                    <Trash2 className="size-3" /> Delete
                                </Button>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

        </motion.article>
      </div>

      {/* Sidebar: Top Classes */}
      {authorClasses.length > 0 && (
        <motion.aside 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="sticky top-32 space-y-6"
        >
          <Card className="rounded-xl border border-border bg-background shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-red-600 rounded-full shrink-0" />
              <h3 className="font-heading text-xl font-black uppercase text-foreground">Top Classes by {post.author}</h3>
            </div>
            <div className="space-y-4">
              {authorClasses.map(cls => (
                <Link key={cls._id} href={`/classes/${cls._id}`} className="block group">
                  <div className="rounded-lg border border-border bg-background overflow-hidden transition-all group-hover:border-red-600 group-hover:shadow-md">
                    {cls.image && (
                      <div className="h-28 w-full relative bg-zinc-100 dark:bg-zinc-900 border-b border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cls.image} alt={cls.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40">
                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider line-clamp-1 mb-3 group-hover:text-red-600 transition-colors">{cls.title}</h4>
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[9px] uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-0">{cls.difficulty || "All Levels"}</Badge>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{cls.enrolledCount || 0} Bookings</span>
                        </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </motion.aside>
      )}
      
      </div>
        ) : null}

      {/* Delete Confirmation Modal Overlay */}
      {commentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6 bg-background rounded-xl shadow-xl space-y-6 text-center border border-border">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-600/10 text-red-600 mb-4">
              <Trash2 className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase text-foreground">Delete Comment?</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                This action cannot be undone. Are you sure you want to permanently delete this comment?
              </p>
            </div>
            
            <div className="flex justify-center gap-3 pt-6 border-t border-border/50">
              <Button variant="outline"
                onClick={() => setCommentToDelete(null)}
                className="flex-1 h-12 text-xs uppercase tracking-wider font-bold rounded-md disabled:opacity-50"
                disabled={isDeletingComment}
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDeleteComment}
                className="flex-1 h-12 text-xs uppercase tracking-wider font-bold text-white bg-red-600 rounded-md hover:bg-red-700 shadow-sm transition-all disabled:opacity-50"
                disabled={isDeletingComment}
              >
                {isDeletingComment ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      </div>
    </main>
  );
}
