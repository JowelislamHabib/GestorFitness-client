const posts = [
  ["How to build consistency without burnout", "Published"],
  ["Mobility drills for desk workers", "Draft"],
  ["Why recovery days still count", "Published"],
];

export default function TrainerForumPostsPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Forum posts</h1>
        <p className="mt-2 text-muted-foreground">
          Manage the posts you share with the GestorFitness community.
        </p>
      </section>

      <section className="grid gap-4">
        {posts.map(([title, status]) => (
          <article key={title} className="rounded-2xl border bg-card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {status}
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
