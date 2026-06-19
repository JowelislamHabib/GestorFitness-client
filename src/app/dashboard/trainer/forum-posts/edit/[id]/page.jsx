import EditForumPostForm from "@/components/dashboardPage/shared/EditForumPostForm";
import { getForumPost } from "@/lib/api/forumPosts";

export default async function TrainerEditForumPostPage({ params }) {
  const { id } = await params;
  const post = await getForumPost(id);

  if (post.message) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="mt-2 text-muted-foreground">{post.message}</p>
        </div>
      </div>
    );
  }

  return <EditForumPostForm backHref="/dashboard/trainer/forum-posts" initialData={post} />;
}
