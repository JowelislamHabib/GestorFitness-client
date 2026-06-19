"use client";

import { ArrowLeft, ChevronRight, MessageSquareText, MoreHorizontal, Send, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { getForumPost } from "@/lib/api/forumPosts";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Mock Comments (Pending actual comments API)

const MOCK_COMMENTS = [
  { id: 1, author: "David Miller", role: "Member", text: "Great tips! I've really been struggling with soreness after leg days.", date: "1 hour ago" },
  { id: 2, author: "Jessica Alba", role: "Member", text: "Do you recommend any specific protein powders for post-workout?", date: "45 mins ago" },
  { id: 3, author: "Maya Calder", role: "Trainer", text: "Yes! Look for whey isolate if you tolerate dairy well, otherwise a pea/rice blend works great.", date: "15 mins ago" },
];

export default function ForumPostDetailsPage() {
  const params = useParams();
  const postId = params.id;
  const [likeState, setLikeState] = useState(null); // 'up', 'down', or null
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(MOCK_COMMENTS);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getForumPost(postId);
        if (data.message) throw new Error(data.message);
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  const handleLike = () => {
    setLikeState(prev => prev === 'up' ? null : 'up');
  };

  const handleDislike = () => {
    setLikeState(prev => prev === 'down' ? null : 'down');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: "Current User",
      role: "Member",
      text: newComment,
      date: "Just now",
    };

    setComments([...comments, comment]);
    setNewComment("");
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
          <Card className="overflow-hidden rounded-[2rem] border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
            
            {/* Featured Image */}
            {post.image && (
              <div className="h-[300px] sm:h-[400px] w-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={post.image} 
                  alt="Post Cover" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            <div className="p-6 sm:p-10 space-y-8">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-600 font-bold text-xl overflow-hidden">
                    {post.authorImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.authorImage} alt="" className="size-full object-cover" />
                    ) : (
                      post.author ? post.author.charAt(0).toUpperCase() : "A"
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-lg">{post.author || "Anonymous"}</span>
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider py-0.5 rounded-md font-bold bg-background/80 border border-border/50">
                        {post.role || "Member"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground font-medium">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex size-10 items-center justify-center rounded-xl border border-border/50 bg-background/50 hover:bg-muted text-muted-foreground transition-colors">
                    <Share2 className="size-4" />
                  </button>
                  <button className="flex size-10 items-center justify-center rounded-xl border border-border/50 bg-background/50 hover:bg-muted text-muted-foreground transition-colors">
                    <MoreHorizontal className="size-4" />
                  </button>
                </div>
              </div>

              {/* Title & Content */}
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                  {post.title}
                </h1>
                
                <div className="mt-8 prose prose-gray dark:prose-invert container text-muted-foreground leading-relaxed">
                  {post.description?.split('\n\n').map((paragraph, i) => {
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={i} className="text-xl font-bold text-foreground mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
                    }
                    return <p key={i} className="whitespace-pre-line">{paragraph}</p>;
                  })}
                </div>
              </div>

              {/* Engagement Actions */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                <div className="flex items-center rounded-xl border border-border/50 bg-background/50 overflow-hidden font-bold">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2.5 transition-colors ${
                      likeState === 'up' ? "bg-emerald-500/10 text-emerald-500" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <ThumbsUp className={`size-4 ${likeState === 'up' ? "fill-emerald-500" : ""}`} />
                    {(post.upvotes || 0) + (likeState === 'up' ? 1 : 0)}
                  </button>
                  <div className="w-px h-6 bg-border/50" />
                  <button 
                    onClick={handleDislike}
                    className={`flex items-center gap-2 px-4 py-2.5 transition-colors ${
                      likeState === 'down' ? "bg-red-500/10 text-red-500" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <ThumbsDown className={`size-4 ${likeState === 'down' ? "fill-red-500" : ""}`} />
                    {(post.downvotes || 0) + (likeState === 'down' ? 1 : 0)}
                  </button>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-background/50 text-muted-foreground font-bold cursor-default">
                  <MessageSquareText className="size-4" />
                  {comments.length} Comments
                </div>
              </div>

            </div>
          </Card>

          {/* Comments Section */}
          <section className="space-y-6 pt-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">Discussion ({comments.length})</h2>
            
            {/* New Comment Input */}
            <Card className="p-4 sm:p-6 rounded-3xl border-border/50 bg-card/30 backdrop-blur-md flex gap-4">
              <div className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 font-bold">
                U
              </div>
              <form onSubmit={handleCommentSubmit} className="flex-1 flex flex-col gap-3">
                <Textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="rounded-2xl border-border/50 bg-background/60 p-4 font-medium focus-visible:ring-purple-500/50 resize-none min-h-[100px]"
                />
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={!newComment.trim()}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="size-4" /> Post Comment
                  </button>
                </div>
              </form>
            </Card>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="p-4 sm:p-6 rounded-[2rem] border-border/50 bg-card/20 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-bold ${
                      comment.role === "Trainer" ? "bg-purple-600/10 text-purple-600" : "bg-muted text-muted-foreground"
                    }`}>
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm">{comment.author}</span>
                          <Badge variant="secondary" className="text-[9px] uppercase tracking-wider py-0 rounded-sm font-bold bg-background border border-border/50">
                            {comment.role}
                          </Badge>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{comment.date}</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-4 mt-3 pt-2">
                        <button className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">Reply</button>
                        <button className="text-xs font-bold text-muted-foreground hover:text-emerald-500 transition-colors">Like</button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

        </article>
        ) : null}
      </div>
    </main>
  );
}
