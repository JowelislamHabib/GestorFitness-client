import { BookOpenCheck, Dumbbell, Star, TrendingUp, Users } from "lucide-react";
import { getUserSession } from "@/lib/core/session";

// Mock data
const upcomingClasses = [
  { id: 1, name: "HIIT Core Burn", time: "Today, 5:30 PM", enrolled: "24/30", type: "Cardio", status: "Teaching" },
  { id: 2, name: "Advanced Yoga Flow", time: "Tomorrow, 7:00 AM", enrolled: "15/20", type: "Flexibility", status: "Teaching" },
  { id: 3, name: "Strength Foundation", time: "Friday, 6:00 PM", enrolled: "28/30", type: "Strength", status: "Teaching" },
];

const studentAttendance = [
  { day: "Mon", count: 45 },
  { day: "Tue", count: 60 },
  { day: "Wed", count: 35 },
  { day: "Thu", count: 80 },
  { day: "Fri", count: 55 },
  { day: "Sat", count: 110 },
  { day: "Sun", count: 40 },
];

export default async function TrainerDashboardPage() {
  const user = await getUserSession();
  const firstName = user?.name?.split(" ")[0] || "Trainer";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-900 px-8 py-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-wide">
            Ready to coach, {firstName}? 💪
          </h1>
          <p className="mt-2 text-emerald-100 text-lg">
            Your classes are filling up! You have 3 classes scheduled for the next 48 hours.
          </p>
        </div>
        <div className="absolute -right-10 -top-24 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 right-32 size-48 rounded-full bg-emerald-400/20 blur-2xl" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Metrics Grid */}
          <section className="grid gap-4 sm:grid-cols-2">
            <article className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active Students</p>
                  <p className="mt-2 text-3xl font-heading font-bold text-foreground">342 <span className="text-lg text-muted-foreground font-sans font-medium">enrolled</span></p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                  <Users className="size-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-500">
                <TrendingUp className="size-4" />
                <span>+8% from last month</span>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Class Rating</p>
                  <p className="mt-2 text-3xl font-heading font-bold text-foreground">4.9 <span className="text-lg text-muted-foreground font-sans font-medium">/ 5.0</span></p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-500 group-hover:scale-110 transition-transform duration-300">
                  <Star className="size-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-500">
                <span>Based on 128 reviews</span>
              </div>
            </article>
          </section>

          {/* Attendance Graph */}
          <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading">Student Attendance</h2>
              <select className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            
            <div className="flex h-48 items-end justify-between gap-2 sm:gap-4 pt-4">
              {studentAttendance.map((day, i) => (
                <div key={i} className="group relative flex w-full flex-col items-center gap-2">
                  <div className="absolute -top-10 scale-0 rounded-lg bg-foreground px-2 py-1 text-xs font-bold text-background transition-transform group-hover:scale-100 z-10">
                    {day.count} students
                  </div>
                  <div className="w-full max-w-[40px] rounded-t-xl bg-emerald-100 dark:bg-emerald-900/30 overflow-hidden relative" style={{ height: "100%" }}>
                    <div 
                      className="absolute bottom-0 w-full rounded-t-xl bg-emerald-600 transition-all duration-1000 ease-out group-hover:bg-emerald-500" 
                      style={{ height: `${(day.count / 120) * 100}%` }} 
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
          
          {/* Upcoming Schedule */}
          <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-heading">Your Schedule</h2>
              <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Manage</button>
            </div>
            
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-background/50 p-4 hover:border-emerald-500/50 hover:shadow-md transition-all">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 group-hover:scale-105 transition-transform">
                    <Dumbbell className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold text-foreground">{cls.name}</h3>
                    <p className="text-sm text-muted-foreground">{cls.time}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex rounded-md bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {cls.enrolled} Enrolled
                      </span>
                      <span className="inline-flex rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        {cls.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievement Box */}
          <section className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-6 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-yellow-500 text-white shadow-lg shadow-yellow-500/20 mb-4">
              <BookOpenCheck className="size-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">Top Rated</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You are among the top 5% of trainers based on student feedback this month!
            </p>
            <button className="mt-6 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-foreground hover:bg-muted transition-colors">
              View Feedback
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
