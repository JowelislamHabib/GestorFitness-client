const classes = [
  ["Power Circuit", "Approved", "28 students"],
  ["Mobility Reset Lab", "Pending", "18 students"],
  ["Weekend Cardio Rush", "Approved", "32 students"],
];

export default function TrainerClassesPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-foreground">My classes</h1>
        <p className="mt-2 text-muted-foreground">
          Classes you created and their current approval status.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {classes.map(([name, status, students]) => (
          <article key={name} className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-foreground">{name}</h2>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {status}
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{students}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
