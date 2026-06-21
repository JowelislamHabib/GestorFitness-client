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

      {/* Unified Stats & Action Cards */}
      <motion.section variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Users Card */}
        <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Users className="size-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Users</p>
            </div>
            <p className="text-3xl font-heading font-medium text-foreground">
              {totalUsers}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total registered members</p>
          </div>
          <Link href="/dashboard/admin/users" className="mt-auto flex items-center justify-center w-full py-3 bg-blue-50/80 text-blue-700 font-semibold text-sm hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors border-t border-blue-100 dark:border-blue-900">
            Manage Users
          </Link>
        </article>

        {/* Classes Card */}
        <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Activity className="size-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Classes</p>
            </div>
            <p className="text-3xl font-heading font-medium text-foreground">
              {activeClasses}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Active fitness classes</p>
          </div>
          <Link href="/dashboard/admin/classes" className="mt-auto flex items-center justify-center w-full py-3 bg-emerald-50/80 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-colors border-t border-emerald-100 dark:border-emerald-900">
            Manage Classes
          </Link>
        </article>

        {/* Trainers Card */}
        <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <UserCog className="size-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Trainers</p>
            </div>
            <p className="text-3xl font-heading font-medium text-foreground">
              {pendingTrainers.length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Pending applications</p>
          </div>
          <Link href="/dashboard/admin/trainers" className="mt-auto flex items-center justify-center w-full py-3 bg-orange-50/80 text-orange-700 font-semibold text-sm hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:hover:bg-orange-900/40 transition-colors border-t border-orange-100 dark:border-orange-900">
            Review Trainers
          </Link>
        </article>

        {/* Forum Posts Card */}
        <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <MessageSquare className="size-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Forum</p>
            </div>
            <p className="text-3xl font-heading font-medium text-foreground">
              {forumPostsTotal}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total discussions</p>
          </div>
          <Link href="/dashboard/admin/forum-posts" className="mt-auto flex items-center justify-center w-full py-3 bg-purple-50/80 text-purple-700 font-semibold text-sm hover:bg-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:hover:bg-purple-900/40 transition-colors border-t border-purple-100 dark:border-purple-900">
            Add Forum Post
          </Link>
        </article>
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
