import { getUserSession } from "@/lib/core/session";

export default async function UserDashboardPage() {
  const user = await getUserSession();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Member overview
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">User dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Track booked classes, favorites, profile details, and trainer application status.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Booked classes</p>
          <p className="mt-3 text-3xl font-bold text-foreground">12</p>
        </article>
        <article className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Favorite classes</p>
          <p className="mt-3 text-3xl font-bold text-foreground">8</p>
        </article>
        <article className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Trainer application</p>
          <p className="mt-3 text-3xl font-bold text-foreground">Pending</p>
        </article>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="text-xl font-semibold text-foreground">Profile details</h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <p><span className="text-muted-foreground">Name:</span> {user?.name || "Member"}</p>
          <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
          <p><span className="text-muted-foreground">Role:</span> User</p>
        </div>
      </section>
    </div>
  );
}
