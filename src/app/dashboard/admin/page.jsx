import { getUserSession } from "@/lib/core/session";

export default async function AdminDashboardPage() {
  const user = await getUserSession();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Platform overview
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Admin dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage users, trainer approvals, classes, transactions, and community safety.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total users</p>
          <p className="mt-3 text-3xl font-bold text-foreground">1,284</p>
        </article>
        <article className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total classes</p>
          <p className="mt-3 text-3xl font-bold text-foreground">146</p>
        </article>
        <article className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Booked classes</p>
          <p className="mt-3 text-3xl font-bold text-foreground">3,872</p>
        </article>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="text-xl font-semibold text-foreground">Profile details</h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <p><span className="text-muted-foreground">Name:</span> {user?.name || "Admin"}</p>
          <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
          <p><span className="text-muted-foreground">Role:</span> Admin</p>
        </div>
      </section>
    </div>
  );
}
