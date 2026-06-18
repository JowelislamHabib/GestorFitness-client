import { getUserSession } from "@/lib/core/session";

export default async function TrainerDashboardPage() {
  const user = await getUserSession();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Trainer overview
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Trainer dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Track created classes, enrolled students, and your community posts.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Classes created</p>
          <p className="mt-3 text-3xl font-bold text-foreground">18</p>
        </article>
        <article className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Students enrolled</p>
          <p className="mt-3 text-3xl font-bold text-foreground">342</p>
        </article>
        <article className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Forum posts</p>
          <p className="mt-3 text-3xl font-bold text-foreground">11</p>
        </article>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="text-xl font-semibold text-foreground">Profile details</h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <p><span className="text-muted-foreground">Name:</span> {user?.name || "Trainer"}</p>
          <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
          <p><span className="text-muted-foreground">Role:</span> Trainer</p>
        </div>
      </section>
    </div>
  );
}
