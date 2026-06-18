const bookedClasses = [
  ["Strength Foundations", "Ariana Cole", "Mon, Wed - 7:00 AM"],
  ["Mobility Reset", "Rahim Noor", "Tue, Thu - 6:30 PM"],
  ["Cardio Burn Circuit", "Leila Bennett", "Sat - 9:30 AM"],
];

export default function BookedClassesPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Booked classes</h1>
        <p className="mt-2 text-muted-foreground">
          Classes you have successfully registered and paid for.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="grid gap-4 border-b px-5 py-3 text-sm font-semibold text-muted-foreground md:grid-cols-3">
          <span>Class name</span>
          <span>Trainer</span>
          <span>Schedule</span>
        </div>
        <div className="divide-y">
          {bookedClasses.map(([className, trainer, schedule]) => (
            <div key={className} className="grid gap-2 px-5 py-4 text-sm md:grid-cols-3">
              <span className="font-medium text-foreground">{className}</span>
              <span className="text-muted-foreground">{trainer}</span>
              <span className="text-muted-foreground">{schedule}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
