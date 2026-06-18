const transactions = [
  ["amina.c@example.com", "$49.00", "18 Jun 2026", "pi_3Rr8xA4B6k8d91Qf"],
  ["samira.vale@example.com", "$36.00", "18 Jun 2026", "pi_3Rr7na8D1l2m43Zx"],
  ["idris.h@example.com", "$54.00", "17 Jun 2026", "pi_3Rr5YZ2R8p7t19Dn"],
];

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
        <p className="mt-2 text-muted-foreground">
          Read-only Stripe payment history across the platform.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card">
        {transactions.map(([email, amount, date, id]) => (
          <div key={id} className="grid gap-2 border-b px-5 py-4 text-sm last:border-b-0 lg:grid-cols-4">
            <span className="font-medium text-foreground">{email}</span>
            <span className="text-muted-foreground">{amount}</span>
            <span className="text-muted-foreground">{date}</span>
            <span className="truncate text-muted-foreground">{id}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
