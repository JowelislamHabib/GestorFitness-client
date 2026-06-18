export default function ApplyTrainerPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Apply as trainer</h1>
        <p className="mt-2 text-muted-foreground">
          Submit your experience, skills, and available training times for admin review.
        </p>
      </section>

      <form className="grid gap-4 rounded-2xl border bg-card p-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-foreground">Experience</span>
          <textarea className="min-h-28 rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-foreground">Skills</span>
          <input className="h-11 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-foreground">Available time</span>
          <input className="h-11 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <button type="button" className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
          Submit application
        </button>
      </form>
    </div>
  );
}
