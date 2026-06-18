import { Activity, ShieldAlert, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { getUserSession } from "@/lib/core/session";

// Mock data
const pendingTrainers = [
  { id: 1, name: "David Miller", email: "david.m@example.com", applied: "2 hours ago", status: "Pending Review" },
  { id: 2, name: "Jessica Alba", email: "jess.a@example.com", applied: "5 hours ago", status: "Pending Review" },
  { id: 3, name: "Tommy V.", email: "tommy@fitness.com", applied: "1 day ago", status: "Pending Review" },
];

const registrationActivity = [
  { day: "Mon", count: 12 },
  { day: "Tue", count: 19 },
  { day: "Wed", count: 8 },
  { day: "Thu", count: 24 },
  { day: "Fri", count: 32 },
  { day: "Sat", count: 45 },
  { day: "Sun", count: 28 },
];

export default async function AdminDashboardPage() {
  const user = await getUserSession();
  const firstName = user?.name?.split(" ")[0] || "Admin";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-wide">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 text-slate-300 text-lg">
            System operations are running smoothly. You have 3 pending trainer applications to review today.
          </p>
        </div>
        <div className="absolute -right-10 -top-24 size-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 right-32 size-48 rounded-full bg-slate-500/20 blur-2xl" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Metrics Grid */}
          <section className="grid gap-4 sm:grid-cols-2">
            <article className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Users</p>
                  <p className="mt-2 text-3xl font-heading font-bold text-foreground">1,284 <span className="text-lg text-muted-foreground font-sans font-medium">members</span></p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                  <Users className="size-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-500">
                <TrendingUp className="size-4" />
                <span>+124 this month</span>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Classes</p>
                  <p className="mt-2 text-3xl font-heading font-bold text-foreground">146 <span className="text-lg text-muted-foreground font-sans font-medium">active</span></p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="size-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-500">
                <TrendingUp className="size-4" />
                <span>+12 new this week</span>
              </div>
            </article>
          </section>

          {/* Registration Graph */}
          <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading">New Registrations</h2>
              <select className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-slate-500">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            
            <div className="flex h-48 items-end justify-between gap-2 sm:gap-4 pt-4">
              {registrationActivity.map((day, i) => (
                <div key={i} className="group relative flex w-full flex-col items-center gap-2">
                  <div className="absolute -top-10 scale-0 rounded-lg bg-foreground px-2 py-1 text-xs font-bold text-background transition-transform group-hover:scale-100 z-10">
                    {day.count} users
                  </div>
                  <div className="w-full max-w-[40px] rounded-t-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative" style={{ height: "100%" }}>
                    <div 
                      className="absolute bottom-0 w-full rounded-t-xl bg-slate-800 dark:bg-slate-500 transition-all duration-1000 ease-out group-hover:bg-slate-700" 
                      style={{ height: `${(day.count / 50) * 100}%` }} 
                    />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          
          {/* Pending Approvals */}
          <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-heading">Trainer Queue</h2>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
            </div>
            
            <div className="space-y-4">
              {pendingTrainers.map((trainer) => (
                <div key={trainer.id} className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-background/50 p-4 hover:border-orange-500/50 hover:shadow-md transition-all">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 group-hover:scale-105 transition-transform">
                    <ShieldAlert className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold text-foreground">{trainer.name}</h3>
                    <p className="text-xs text-muted-foreground">{trainer.email}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {trainer.applied}
                      </span>
                      <button className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700">
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* System Status Box */}
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 mb-4">
              <ShieldCheck className="size-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">System Online</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              All services are operational. No critical errors reported.
            </p>
            <button className="mt-6 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-foreground hover:bg-muted transition-colors">
              View Logs
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
