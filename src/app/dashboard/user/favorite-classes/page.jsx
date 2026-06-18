const favoriteClasses = [
  ["Evening Yoga Flow", "Mind & Body", "$32"],
  ["HIIT Express", "Cardio", "$28"],
  ["Core Control Lab", "Strength", "$36"],
];

export default function FavoriteClassesPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Favorite classes</h1>
        <p className="mt-2 text-muted-foreground">
          Classes saved from the browse page for quick access later.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {favoriteClasses.map(([name, category, price]) => (
          <article key={name} className="rounded-2xl border bg-card p-5">
            <h2 className="text-xl font-semibold text-foreground">{name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{category}</p>
            <p className="mt-4 text-lg font-bold text-foreground">{price}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
