import { Dumbbell, Flame, Timer, TrendingUp, Trophy } from "lucide-react";
import { getUserSession } from "@/lib/core/session";

// Mock data
const upcomingClasses = [
  { id: 1, name: "HIIT Core Burn", trainer: "Sarah Jenkins", time: "Today, 5:30 PM", duration: "45 min", type: "Cardio", status: "Upcoming" },
  { id: 2, name: "Power Lifting 101", trainer: "Marcus Cole", time: "Tomorrow, 7:00 AM", duration: "60 min", type: "Strength", status: "Upcoming" },
  { id: 3, name: "Vinyasa Flow", trainer: "Elena Rostova", time: "Friday, 6:00 PM", duration: "60 min", type: "Flexibility", status: "Waitlist" },
];

const weeklyActivity = [
  { day: "Mon", duration: 45 },
  { day: "Tue", duration: 60 },
  { day: "Wed", duration: 0 },
  { day: "Thu", duration: 90 },
  { day: "Fri", duration: 45 },
  { day: "Sat", duration: 120 },
  { day: "Sun", duration: 30 },
];

export default async function UserDashboardPage() {
  const user = await getUserSession();
  const firstName = user?.name?.split(" ")[0] || "Member";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-900 px-8 py-10 text-white shadow-xl">
        <div className="relative z-10 container">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-wide">
            Hello, {firstName}! 👋
          </h1>
          <p className="mt-2 text-blue-100 text-lg">
            Good morning. You've completed 4 workouts this week. Keep pushing towards your goals!
          </p>
        </div>
        {/* Decorative background circles */}
        <div className="absolute -right-10 -top-24 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 right-32 size-48 rounded-full bg-blue-400/20 blur-2xl" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Metrics Grid */}
          <section className="grid gap-4 sm:grid-cols-2">
            <article className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Weekly Goal</p>
                  <p className="mt-2 text-3xl font-heading font-bold text-foreground">3 / 5 <span className="text-lg text-muted-foreground font-sans font-medium">sessions</span></p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform duration-300">
                  <Flame className="size-6" />
                </div>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-orange-500 w-[60%] transition-all duration-1000" />
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active Time</p>
                  <p className="mt-2 text-3xl font-heading font-bold text-foreground">4.5 <span className="text-lg text-muted-foreground font-sans font-medium">hours</span></p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                  <Timer className="size-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-500">
                <TrendingUp className="size-4" />
                <span>+12% from last week</span>
              </div>
            </article>
          </section>

          {/* Activity Graph (Mock CSS bars) */}
          <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading">Activity Overview</h2>
              <select className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            
            <div className="flex h-48 items-end justify-between gap-2 sm:gap-4 pt-4">
              {weeklyActivity.map((day, i) => (
                <div key={i} className="group relative flex w-full flex-col items-center gap-2">
                  {/* Tooltip */}
                  <div className="absolute -top-10 scale-0 rounded-lg bg-foreground px-2 py-1 text-xs font-bold text-background transition-transform group-hover:scale-100 z-10">
                    {day.duration} min
                  </div>
                  {/* Bar */}
                  <div className="w-full max-w-[40px] rounded-t-xl bg-blue-100 dark:bg-blue-900/30 overflow-hidden relative" style={{ height: "100%" }}>
                    <div 
                      className="absolute bottom-0 w-full rounded-t-xl bg-blue-600 transition-all duration-1000 ease-out group-hover:bg-blue-500" 
                      style={{ height: `${(day.duration / 120) * 100}%` }} 
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
          
          {/* Next Class Widget */}
          <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-heading">Upcoming Classes</h2>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
            </div>
            
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-background/50 p-4 hover:border-blue-500/50 hover:shadow-md transition-all">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 group-hover:scale-105 transition-transform">
                    <Dumbbell className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold text-foreground">{cls.name}</h3>
                    <p className="text-sm text-muted-foreground">{cls.time}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex rounded-md bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {cls.duration}
                      </span>
                      <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${cls.status === 'Upcoming' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600'}`}>
                        {cls.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievement Box */}
          <section className="rounded-3xl border border-blue-500/20 bg-blue-600/5 p-6 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20 mb-4">
              <Trophy className="size-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">Pro Member</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You have access to all premium features and advanced classes.
            </p>
            <button className="mt-6 w-full rounded-xl bg-foreground px-4 py-3 text-sm font-bold text-background hover:bg-foreground/90 transition-colors">
              Manage Subscription
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
