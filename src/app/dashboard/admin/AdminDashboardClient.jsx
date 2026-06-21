"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Activity, CalendarCheck, MessageSquare, PlusCircle, ShieldAlert, ShieldCheck, UserCog, Users } from "lucide-react";
import Link from "next/link";
import AdminChart from "./AdminChart";
import AdminPieChart from "./AdminPieChart";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AdminDashboardClient({ 
  firstName, 
  pendingTrainers, 
  totalUsers, 
  activeClasses, 
  totalBookings, 
  forumPostsTotal, 
  registrationActivity, 
  userRolesData, 
  classStatusData 
}) {
  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-8"
    >
      
      {/* Hero Welcome Section */}
      <motion.section variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="font-heading text-4xl sm:text-5xl font-medium">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 text-slate-300 text-lg max-w-2xl">
            System operations are running smoothly. You have {pendingTrainers.length} pending trainer applications to review today.
          </p>
        </div>
        <div className="absolute -right-10 -top-24 size-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-32 size-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
      </motion.section>

      {/* Stats Grid - Full Width */}
      <motion.section variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Users</p>
              <p className="mt-2 text-3xl font-heading font-medium text-foreground">
                {totalUsers}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="size-6" />
            </div>
          </div>
        </article>

        <article className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Classes</p>
              <p className="mt-2 text-3xl font-heading font-medium text-foreground">
                {activeClasses}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Activity className="size-6" />
            </div>
          </div>
        </article>

        <article className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Bookings</p>
              <p className="mt-2 text-3xl font-heading font-medium text-foreground">
                {totalBookings}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <CalendarCheck className="size-6" />
            </div>
          </div>
        </article>

        <article className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Forum Posts</p>
              <p className="mt-2 text-3xl font-heading font-medium text-foreground">
                {forumPostsTotal}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <MessageSquare className="size-6" />
            </div>
          </div>
        </article>
      </motion.section>

      {/* Quick Actions - Full Width */}
      <motion.section variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/admin/users" className="group flex items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 hover:bg-blue-100/80 transition-all shadow-sm hover:shadow-md dark:border-blue-900 dark:bg-blue-950/30 dark:hover:bg-blue-900/40">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-600 group-hover:scale-110 transition-transform dark:text-blue-400">
            <Users className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-blue-950 dark:text-blue-50">Manage Users</h3>
            <p className="text-xs text-blue-700/80 dark:text-blue-300/80">View all members</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/classes" className="group flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 hover:bg-emerald-100/80 transition-all shadow-sm hover:shadow-md dark:border-emerald-900 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 group-hover:scale-110 transition-transform dark:text-emerald-400">
            <Activity className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-50">Manage Classes</h3>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">Approve or Reject</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/trainers" className="group flex items-center gap-4 rounded-2xl border border-orange-200 bg-orange-50/80 p-4 hover:bg-orange-100/80 transition-all shadow-sm hover:shadow-md dark:border-orange-900 dark:bg-orange-950/30 dark:hover:bg-orange-900/40">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-orange-600 group-hover:scale-110 transition-transform dark:text-orange-400">
            <UserCog className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-orange-950 dark:text-orange-50">Applied Trainers</h3>
            <p className="text-xs text-orange-700/80 dark:text-orange-300/80">Review applications</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/forum-posts" className="group flex items-center gap-4 rounded-2xl border border-purple-200 bg-purple-50/80 p-4 hover:bg-purple-100/80 transition-all shadow-sm hover:shadow-md dark:border-purple-900 dark:bg-purple-950/30 dark:hover:bg-purple-900/40">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-600 group-hover:scale-110 transition-transform dark:text-purple-400">
            <PlusCircle className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-purple-950 dark:text-purple-50">Add Forum Post</h3>
            <p className="text-xs text-purple-700/80 dark:text-purple-300/80">Write to community</p>
          </div>
        </Link>
      </motion.section>

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Area: Charts */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Registration Graph */}
            <section className="rounded-2xl border bg-card p-6 shadow-sm md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">New Registrations (Last 7 Days)</h2>
              </div>
              <div className="h-[250px] w-full">
                <AdminChart data={registrationActivity} />
              </div>
            </section>
            
            {/* Roles Pie Chart */}
            <section className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col">
              <h2 className="text-xl font-medium mb-6 text-center">Users by Role</h2>
              <div className="h-[200px] w-full mt-auto">
                <AdminPieChart data={userRolesData} dataKey="count" nameKey="role" config={{ count: { label: "Users" } }} />
              </div>
            </section>

            {/* Classes Pie Chart */}
            <section className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col">
              <h2 className="text-xl font-medium mb-6 text-center">Classes by Status</h2>
              <div className="h-[200px] w-full mt-auto">
                <AdminPieChart data={classStatusData} dataKey="count" nameKey="status" config={{ count: { label: "Classes" } }} />
              </div>
            </section>
          </div>
        </motion.div>

        {/* Right Area: Trainers & System Status */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Pending Approvals */}
          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Trainer Management</h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
            </div>
            
            <div className="space-y-4">
              {pendingTrainers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No pending applications.</p>
              ) : (
                pendingTrainers.slice(0, 4).map((trainer) => (
                  <div key={trainer._id} className="flex items-start gap-4 rounded-xl border border-border/50 bg-muted/30 p-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                      <ShieldAlert className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-foreground">{trainer.fullName}</h3>
                      <p className="text-xs text-muted-foreground">{trainer.email}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] font-medium uppercase text-muted-foreground">
                          {trainer.createdAt ? formatDistanceToNow(new Date(trainer.createdAt), { addSuffix: true }) : "Recently"}
                        </span>
                        <button className="text-[10px] font-medium uppercase text-blue-600 hover:text-blue-700">
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* System Status */}
          <section className="rounded-2xl border bg-card p-6 shadow-sm text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 mb-4">
              <ShieldCheck className="size-8" />
            </div>
            <h3 className="font-heading text-2xl font-medium text-foreground">System Online</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              All services are operational. No critical errors reported.
            </p>
            <button className="mt-6 w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              View Logs
            </button>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
}
