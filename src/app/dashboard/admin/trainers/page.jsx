const trainers = [
  ["Leila Bennett", "Mobility & Recovery", "Pending"],
  ["Khalid Mercer", "Strength Conditioning", "Pending"],
  ["Maya Calder", "Strength", "Active"],
];

export default function TrainerQueuePage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Trainer queue</h1>
        <p className="mt-2 text-muted-foreground">
          Review trainer applications and manage active trainer roles.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {trainers.map(([name, specialty, status]) => (
          <article key={name} className="rounded-2xl border bg-card p-5">
            <h2 className="text-xl font-semibold text-foreground">{name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{specialty}</p>
            <p className="mt-4 text-sm font-semibold text-foreground">{status}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
