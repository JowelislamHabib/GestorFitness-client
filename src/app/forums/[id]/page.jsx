"use client";

import { ArrowLeft, ChevronRight, MessageSquareText, MoreHorizontal, Send, Share2, ThumbsDown, ThumbsUp, Trash2, Pencil, ShieldCheck, Dumbbell } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { useSession } from "@/lib/auth-client";
import { getForumPost } from "@/lib/api/forumPosts";
import { voteForumPost } from "@/lib/actions/forumPosts";
import { getForumComments } from "@/lib/api/forumComments";
import { createForumComment, updateForumComment, deleteForumComment } from "@/lib/actions/forumComments";

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
  
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  
  const [post, setPost] = useState(null);
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

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 container space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground animate-in fade-in duration-500">
          <Link href="/forums" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="size-4" /> Back to Forums
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground truncate max-w-xs">{post ? post.title : "Loading..."}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="size-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">Loading post details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-500">Post Not Found</h2>
              <p className="text-muted-foreground">{error}</p>
              <Link href="/forums" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
                <ArrowLeft className="size-4" /> Return to Forums
              </Link>
            </div>
          </div>
        ) : post ? (
          <article className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
          
          {/* Main Post Card */}
          <Card className="overflow-hidden rounded-[2rem] border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl p-4 sm:p-6">
            
            {/* Featured Image */}
            {post.image && (
              <div className="h-[300px] sm:h-[400px] w-full relative rounded-[1.5rem] overflow-hidden mb-6 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={post.image} 
                  alt="Post Cover" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            <div className="flex flex-col">
              
              <CardHeader className="p-0 pb-6 sm:px-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-14 rounded-2xl">
                      <AvatarImage src={post.authorImage} />
                      <AvatarFallback className="rounded-2xl text-xl bg-purple-600/10 text-purple-600 font-bold">{post.author ? post.author.charAt(0).toUpperCase() : "A"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-lg">{post.author || "Anonymous"}</span>
                        <RoleBadge role={post.role} />
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground font-medium">
                        <span>{new Date(post.createdAt).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-xl border-border/50 bg-background/50 hover:bg-muted text-muted-foreground">
                      <Share2 className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl border-border/50 bg-background/50 hover:bg-muted text-muted-foreground">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>
                </div>
                <Separator />
              </CardHeader>

              <CardContent className="space-y-8 p-0 sm:px-4">
                <CardTitle className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground leading-tight normal-case tracking-normal">
                  {post.title}
                </CardTitle>
                
                <div className="mt-8 prose prose-gray dark:prose-invert container text-muted-foreground leading-relaxed">
                  {post.description?.split('\n\n').map((paragraph, i) => {
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={i} className="text-xl font-bold text-foreground mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
                    }
                    return <p key={i} className="whitespace-pre-line">{paragraph}</p>;
                  })}
                </div>
              </CardContent>

              <CardFooter className="p-0 pt-6 sm:px-4 pb-2 flex-col items-start">
                <Separator className="mb-6 w-full" />
                <div className="flex items-center gap-4 w-full">
                  <div className="flex items-center rounded-xl border border-border/50 bg-background/50 overflow-hidden font-bold">
                    <Button 
                      variant="ghost"
                      onClick={() => handleVote("upvote")}
                      className={`gap-2 px-4 h-11 rounded-none transition-colors ${
                        isUpvoted ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-500" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <ThumbsUp className={`size-4 ${isUpvoted ? "fill-emerald-500" : ""}`} />
                      {post.upvotes || 0}
                    </Button>
                    <div className="w-px h-6 bg-border/50" />
                    <Button 
                      variant="ghost"
                      onClick={() => handleVote("downvote")}
                      className={`gap-2 px-4 h-11 rounded-none transition-colors ${
                        isDownvoted ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <ThumbsDown className={`size-4 ${isDownvoted ? "fill-red-500" : ""}`} />
                      {post.downvotes || 0}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4 h-11 rounded-xl border border-border/50 bg-background/50 text-muted-foreground font-bold cursor-default">
                    <MessageSquareText className="size-4" />
                    {comments.length} Comments
                  </div>
                </div>
              </CardFooter>

            </div>
          </Card>

          {/* Comments Section */}
          <section className="space-y-6 pt-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">Discussion ({comments.length})</h2>
            
            {/* New Comment Input */}
            <Card className="p-4 sm:p-6 rounded-3xl border-border/50 bg-card/30 backdrop-blur-md flex gap-4">
              <Avatar className="hidden sm:flex size-10 rounded-xl">
                <AvatarImage src={session?.user?.image} />
                <AvatarFallback className="rounded-xl bg-blue-600/10 text-blue-600 font-bold">{session?.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <form onSubmit={handleCommentSubmit} className="flex-1 flex flex-col gap-3">
                <Textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={session?.user ? "Share your thoughts..." : "Please log in to join the discussion."}
                  disabled={!session?.user || isSubmittingComment}
                  className="rounded-2xl border-border/50 bg-background/60 p-4 font-medium focus-visible:ring-purple-500/50 resize-none min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    disabled={!newComment.trim() || !session?.user || isSubmittingComment}
                    className="gap-2 rounded-xl bg-purple-600 px-6 h-10 text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all"
                  >
                    <Send className="size-4" /> {isSubmittingComment ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </form>
            </Card>

            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment._id} className="p-4 sm:p-6 rounded-[2rem] border-border/50 bg-card/20 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <Avatar className="size-10 rounded-xl">
                      <AvatarImage src={comment.authorImage} />
                      <AvatarFallback className={`rounded-xl font-bold ${comment.role === "Trainer" || comment.role === "admin" ? "bg-purple-600/10 text-purple-600" : "bg-muted text-muted-foreground"}`}>
                        {comment.author?.charAt(0).toUpperCase() || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm">{comment.author || "Anonymous"}</span>
                          <RoleBadge role={comment.role} />
                          {post?.authorId && post.authorId === comment.authorId && (
                            <Badge variant="author">
                              Author
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{new Date(comment.createdAt).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      {editingCommentId === comment._id ? (
                        <div className="mt-2 space-y-2">
                          <Textarea 
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="text-sm rounded-lg min-h-[60px]"
                          />
                          <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleUpdateComment(comment._id)} className="h-8 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-600/10">Save</Button>
                              <Button variant="ghost" size="sm" onClick={() => setEditingCommentId(null)} className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground">Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm leading-relaxed mt-2 whitespace-pre-line">
                          {comment.text}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-3 pt-2">
                        <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground">Reply</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-muted-foreground hover:text-emerald-500">Like</Button>
                        
                        {(session?.user?.id === comment.authorId || session?.user?.role === "admin") && (
                            <div className="flex items-center gap-2 ml-auto">
                                <Button 
                                    variant="ghost" size="sm"
                                    onClick={() => { setEditingCommentId(comment._id); setEditCommentText(comment.text); }}
                                    className="h-8 text-xs font-bold text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 gap-1"
                                >
                                    <Pencil className="size-3" /> Edit
                                </Button>
                                <Button 
                                    variant="ghost" size="sm"
                                    onClick={() => setCommentToDelete(comment._id)}
                                    className="h-8 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-1"
                                >
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

        </article>
        ) : null}

      {/* Delete Confirmation Modal Overlay */}
      {commentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6 bg-background rounded-3xl shadow-2xl space-y-6 text-center border-border/50">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 mb-4">
              <Trash2 className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Delete Comment?</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                This action cannot be undone. Are you sure you want to permanently delete this comment?
              </p>
            </div>
            
            <div className="flex justify-center gap-3 pt-4">
              <Button variant="ghost"
                onClick={() => setCommentToDelete(null)}
                className="px-5 h-10 text-sm font-semibold rounded-2xl disabled:opacity-50"
                disabled={isDeletingComment}
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDeleteComment}
                className="px-5 h-10 text-sm font-bold text-white bg-red-600 rounded-2xl hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
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
