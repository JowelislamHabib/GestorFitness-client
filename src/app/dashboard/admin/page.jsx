import { getUserSession } from "@/lib/core/session";
import { Activity, ShieldAlert, ShieldCheck, TrendingUp, Users, CalendarCheck, MessageSquare, PlusCircle, UserCog } from "lucide-react";
import AdminChart from "./AdminChart";
import AdminPieChart from "./AdminPieChart";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

async function getAdminData() {
  try {
    const [usersRes, classesRes, pendingTrainersRes, bookingsRes, forumPostsRes] = await Promise.all([
      fetch(`${baseUrl}/users`, { cache: "no-store" }),
      fetch(`${baseUrl}/classes`, { cache: "no-store" }),
      fetch(`${baseUrl}/trainer-applications?status=pending`, { cache: "no-store" }),
      fetch(`${baseUrl}/bookings`, { cache: "no-store" }),
      fetch(`${baseUrl}/forum-posts?limit=1`, { cache: "no-store" })
    ]);

    const users = usersRes.ok ? await usersRes.json() : [];
    const classes = classesRes.ok ? await classesRes.json() : [];
    const pendingTrainers = pendingTrainersRes.ok ? await pendingTrainersRes.json() : [];
    const bookings = bookingsRes.ok ? await bookingsRes.json() : [];
    const forumPostsData = forumPostsRes.ok ? await forumPostsRes.json() : { total: 0 };

    return { users, classes, pendingTrainers, bookings, forumPostsTotal: forumPostsData.total };
  } catch (error) {
    console.error("Failed to fetch admin data", error);
    return { users: [], classes: [], pendingTrainers: [], bookings: [], forumPostsTotal: 0 };
  }
}

export default async function AdminDashboardPage() {
  const user = await getUserSession();
  const firstName = user?.name?.split(" ")[0] || "Admin";

  const { users, classes, pendingTrainers, bookings, forumPostsTotal } = await getAdminData();

  const totalUsers = users.length;
  const activeClasses = classes.filter((c) => c.status === "approved").length;
  const totalBookings = bookings.length;

  // Process registrations for the last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const registrationActivity = last7Days.map((date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const count = users.filter((u) => {
      if (!u.createdAt) return false;
      const createdAt = new Date(u.createdAt);
      return createdAt >= date && createdAt < nextDay;
    }).length;

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      count,
    };
  });

  // Calculate new users this month
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const newUsersThisMonth = users.filter((u) => {
    if (!u.createdAt) return false;
    return new Date(u.createdAt) >= thisMonth;
  }).length;

  const userRolesData = [
    { role: "Admin", count: users.filter(u => u.role === "admin").length, fill: "hsl(var(--chart-1))" },
    { role: "Trainer", count: users.filter(u => u.role === "trainer").length, fill: "hsl(var(--chart-2))" },
    { role: "User", count: users.filter(u => u.role === "user" || !u.role).length, fill: "hsl(var(--chart-3))" },
  ];
  const userRolesConfig = { count: { label: "Users" } };

  const classStatusData = [
    { status: "Approved", count: activeClasses, fill: "hsl(var(--chart-2))" },
    { status: "Pending", count: classes.filter(c => c.status === "pending").length, fill: "hsl(var(--chart-4))" },
    { status: "Rejected", count: classes.filter(c => c.status === "rejected").length, fill: "hsl(var(--destructive))" },
  ];
  const classStatusConfig = { count: { label: "Classes" } };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-10 text-white shadow-xl">
        <div className="relative z-10 container">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-wide">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 text-slate-300 text-lg">
            System operations are running smoothly. You have {pendingTrainers.length} pending trainer applications to review today.
          </p>
        </div>
        <div className="absolute -right-10 -top-24 size-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 right-32 size-48 rounded-full bg-slate-500/20 blur-2xl" />
      </section>

      {/* Quick Actions */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/admin/users" className="group flex items-center gap-4 rounded-3xl border border-border/50 bg-card/50 p-4 hover:bg-muted/50 hover:shadow-md transition-all">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
            <Users className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">Manage Users</h3>
            <p className="text-xs text-muted-foreground">View all members</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/classes" className="group flex items-center gap-4 rounded-3xl border border-border/50 bg-card/50 p-4 hover:bg-muted/50 hover:shadow-md transition-all">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
            <Activity className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">Manage Classes</h3>
            <p className="text-xs text-muted-foreground">Approve/Reject</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/trainers" className="group flex items-center gap-4 rounded-3xl border border-border/50 bg-card/50 p-4 hover:bg-muted/50 hover:shadow-md transition-all">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
            <UserCog className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">Applied Trainers</h3>
            <p className="text-xs text-muted-foreground">Review apps</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/forum-posts" className="group flex items-center gap-4 rounded-3xl border border-border/50 bg-card/50 p-4 hover:bg-muted/50 hover:shadow-md transition-all">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
            <PlusCircle className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">Add Forum Post</h3>
            <p className="text-xs text-muted-foreground">Write to community</p>
          </div>
        </Link>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Metrics Grid */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Users</p>
                  <p className="mt-2 text-3xl font-heading font-bold text-foreground">
                    {totalUsers}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                  <Users className="size-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-500">
                <TrendingUp className="size-4" />
                <span>+{newUsersThisMonth} this month</span>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Classes</p>
                  <p className="mt-2 text-3xl font-heading font-bold text-foreground">
                    {activeClasses}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="size-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-500">
                <TrendingUp className="size-4" />
                <span>+{classes.length - activeClasses} pending</span>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Bookings</p>
                  <p className="mt-2 text-3xl font-heading font-bold text-foreground">
                    {totalBookings}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                  <CalendarCheck className="size-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <span>Total class enrollments</span>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Forum Posts</p>
                  <p className="mt-2 text-3xl font-heading font-bold text-foreground">
                    {forumPostsTotal}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="size-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <span>Community discussions</span>
              </div>
            </article>
          </section>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Registration Graph */}
            <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-heading">New Registrations (Last 7 Days)</h2>
              </div>
              
              <div className="h-[250px] w-full">
                <AdminChart data={registrationActivity} />
              </div>
            </section>
            
            {/* Roles Pie Chart */}
            <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 flex flex-col">
              <h2 className="text-xl font-bold font-heading mb-6">Users by Role</h2>
              <div className="h-[200px] w-full mt-auto">
                <AdminPieChart data={userRolesData} dataKey="count" nameKey="role" config={userRolesConfig} />
              </div>
            </section>

            {/* Classes Pie Chart */}
            <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 flex flex-col">
              <h2 className="text-xl font-bold font-heading mb-6">Classes by Status</h2>
              <div className="h-[200px] w-full mt-auto">
                <AdminPieChart data={classStatusData} dataKey="count" nameKey="status" config={classStatusConfig} />
              </div>
            </section>
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          
          {/* Pending Approvals */}
          <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-heading">Trainer Management</h2>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
            </div>
            
            <div className="space-y-4">
              {pendingTrainers.length > 0 ? (
                pendingTrainers.slice(0, 5).map((trainer) => (
                  <div key={trainer._id} className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-background/50 p-4 hover:border-orange-500/50 hover:shadow-md transition-all">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 group-hover:scale-105 transition-transform">
                      <ShieldAlert className="size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-foreground">{trainer.fullName}</h3>
                      <p className="text-xs text-muted-foreground">{trainer.email}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {trainer.createdAt ? formatDistanceToNow(new Date(trainer.createdAt), { addSuffix: true }) : "Recently"}
                        </span>
                        <button className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700">
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No pending applications.</p>
                </div>
              )}
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

