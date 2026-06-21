import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <section className="w-full rounded-2xl border bg-card p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Access restricted
        </p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">Unauthorized</h1>
        <p className="mt-3 text-muted-foreground">
          Your account does not have permission to view this page.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
