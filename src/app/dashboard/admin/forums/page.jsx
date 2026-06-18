const posts = [
  ["Flagged tone in nutrition thread", "Needs review"],
  ["Post image quality check", "Review"],
  ["Spam wave monitor", "Stable"],
];

export default function ForumWatchPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Forum watch</h1>
        <p className="mt-2 text-muted-foreground">
          Moderate community posts and remove inappropriate content.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {posts.map(([title, status]) => (
          <article key={title} className="rounded-2xl border bg-card p-5">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <p className="mt-4 text-sm text-muted-foreground">{status}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
