const users = [
  ["Amina Chowdhury", "User", "Blocked"],
  ["Rafiq Noor", "Trainer", "Active"],
  ["Samira Vale", "User", "Active"],
];

export default function ManageUsersPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Manage users</h1>
        <p className="mt-2 text-muted-foreground">
          Block, unblock, and promote users from the admin dashboard.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card">
        {users.map(([name, role, status]) => (
          <div key={name} className="grid gap-2 border-b px-5 py-4 text-sm last:border-b-0 md:grid-cols-3">
            <span className="font-medium text-foreground">{name}</span>
            <span className="text-muted-foreground">{role}</span>
            <span className="text-muted-foreground">{status}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
