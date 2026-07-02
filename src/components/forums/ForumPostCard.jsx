import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, MessageSquareText, ArrowRight } from "lucide-react";

export default function ForumPostCard({ post }) {
  return (
    <Card className="group overflow-hidden rounded-xl border border-border/50 bg-card/40 hover:bg-card/60 hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-300 flex flex-col h-full p-0 cursor-pointer">
      <Link href={`/forums/${post.slug}`} className="flex flex-1 flex-col">
        {post.image && (
          <div className="w-full aspect-[4/3] overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            {post.category && (
              <Badge className="absolute top-4 left-4 bg-red-600 text-white uppercase tracking-widest px-3 py-1 text-[10px] font-bold border-0 shadow-lg">
                {post.category}
              </Badge>
            )}
          </div>
        )}
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <div className="flex gap-3 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1"><ThumbsUp className="size-3.5" /> {post.upvotes || 0}</span>
              <span className="flex items-center gap-1"><MessageSquareText className="size-3.5" /> {post.comments || 0}</span>
            </div>
          </div>
          <CardTitle className="font-heading text-xl font-black uppercase leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 flex-1 flex flex-col">
          <CardDescription className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-4">
            {post.description}
          </CardDescription>
          <div className="mt-auto flex items-center font-bold text-sm text-red-600 group-hover:text-red-700 transition-colors uppercase tracking-wider">
            Read discussion <ArrowRight className="size-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-6 border-t border-border/40 flex items-center justify-between bg-muted/5">
        <div className="flex items-center gap-2">
          <Avatar className="size-8 border border-border/50">
            <AvatarImage src={post.authorImage} />
            <AvatarFallback>{post.author ? post.author.charAt(0).toUpperCase() : "A"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground leading-tight">{post.author || "Anonymous"}</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{post.role || "Member"}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
