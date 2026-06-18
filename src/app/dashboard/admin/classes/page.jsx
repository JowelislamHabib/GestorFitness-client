const classes = [
  ["Functional Strength Lab", "Pending", "$49"],
  ["Recovery Flow Reset", "Approved", "$36"],
  ["HIIT Engine", "Needs Review", "$28"],
];

export default function ManageClassesPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Manage classes</h1>
        <p className="mt-2 text-muted-foreground">
          Approve, reject, or delete classes submitted by trainers.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {classes.map(([name, status, price]) => (
          <article key={name} className="rounded-2xl border bg-card p-5">
            <h2 className="text-xl font-semibold text-foreground">{name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{status}</p>
            <p className="mt-4 text-lg font-bold text-foreground">{price}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
