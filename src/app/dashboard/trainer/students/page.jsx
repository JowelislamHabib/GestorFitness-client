const students = [
  ["Amina Chowdhury", "Power Circuit", "81%"],
  ["Rafi Noor", "Mobility Reset Lab", "64%"],
  ["Leila Karim", "Weekend Cardio Rush", "92%"],
];

export default function TrainerStudentsPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Students</h1>
        <p className="mt-2 text-muted-foreground">
          Members enrolled in your classes and their current progress.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card">
        {students.map(([name, className, progress]) => (
          <div key={name} className="grid gap-2 border-b px-5 py-4 text-sm last:border-b-0 md:grid-cols-3">
            <span className="font-medium text-foreground">{name}</span>
            <span className="text-muted-foreground">{className}</span>
            <span className="text-muted-foreground">{progress}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
