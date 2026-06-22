"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Activity, CalendarCheck, MessageSquare, PlusCircle, ShieldAlert, ShieldCheck, UserCog, Users } from "lucide-react";
import Link from "next/link";
import AdminChart from "./AdminChart";
import AdminPieChart from "./AdminPieChart";
import { AnimatedCounter } from "@/components/ui/animated-counter";

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
  pendingClasses = [],
  recentTransactions = [],
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
        <article className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-blue-500/10 to-card/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col">
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-500 mb-3 group-hover:scale-110 transition-transform">
              <Users className="size-6" />
            </div>
            <p className="text-4xl font-heading font-bold text-foreground">
              <AnimatedCounter value={totalUsers} />
            </p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              Users
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Total registered members
            </p>
          </div>
          <Link href="/dashboard/admin/users" className="mt-auto flex items-center justify-center w-full py-3 bg-blue-50/80 text-blue-700 font-semibold text-sm hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors border-t border-blue-100 dark:border-blue-900">
            Manage Users
          </Link>
        </article>

        {/* Classes Card */}
        <article className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-card/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col">
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
              <Activity className="size-6" />
            </div>
            <p className="text-4xl font-heading font-bold text-foreground">
              <AnimatedCounter value={activeClasses} />
            </p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              Classes
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Active fitness classes
            </p>
          </div>
          <Link href="/dashboard/admin/classes" className="mt-auto flex items-center justify-center w-full py-3 bg-emerald-50/80 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-colors border-t border-emerald-100 dark:border-emerald-900">
            Manage Classes
          </Link>
        </article>

        {/* Trainers Card */}
        <article className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-orange-500/10 to-card/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col">
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/5 text-orange-500 mb-3 group-hover:scale-110 transition-transform">
              <UserCog className="size-6" />
            </div>
            <p className="text-4xl font-heading font-bold text-foreground">
              <AnimatedCounter value={pendingTrainers.length} />
            </p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              Trainers
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Pending applications
            </p>
          </div>
          <Link href="/dashboard/admin/trainers" className="mt-auto flex items-center justify-center w-full py-3 bg-orange-50/80 text-orange-700 font-semibold text-sm hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:hover:bg-orange-900/40 transition-colors border-t border-orange-100 dark:border-orange-900">
            Review Trainers
          </Link>
        </article>

        {/* Forum Posts Card */}
        <article className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-purple-500/10 to-card/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col">
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-500 mb-3 group-hover:scale-110 transition-transform">
              <MessageSquare className="size-6" />
            </div>
            <p className="text-4xl font-heading font-bold text-foreground">
              <AnimatedCounter value={forumPostsTotal} />
            </p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              Forum
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Total discussions
            </p>
          </div>
          <Link href="/dashboard/admin/forum-posts" className="mt-auto flex items-center justify-center w-full py-3 bg-purple-50/80 text-purple-700 font-semibold text-sm hover:bg-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:hover:bg-purple-900/40 transition-colors border-t border-purple-100 dark:border-purple-900">
            Add Forum Post
          </Link>
        </article>
      </motion.section>

      {/* Main Content Layout */}
      <motion.section variants={itemVariants} className="grid gap-4 lg:grid-cols-4">
        {/* Bar Chart - Spans 2 columns */}
        <article className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            New Registrations (Last 7 Days)
          </h2>
          <div className="h-[250px] mt-auto">
            <AdminChart data={registrationActivity} />
          </div>
        </article>

        {/* Users Pie Chart */}
        <article className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col items-center">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2 text-center">
            Users by Role
          </h2>
          <div className="h-[250px] w-full mt-auto">
            <AdminPieChart data={userRolesData} dataKey="count" nameKey="role" config={{ count: { label: "Users" } }} />
          </div>
        </article>

        {/* Classes Pie Chart */}
        <article className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col items-center">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2 text-center">
            Classes by Status
          </h2>
          <div className="h-[250px] w-full mt-auto">
            <AdminPieChart data={classStatusData} dataKey="count" nameKey="status" config={{ count: { label: "Classes" } }} />
          </div>
        </article>
      </motion.section>

      {/* Bottom Section - Trainer, Class & Transactions */}
      <motion.section variants={itemVariants} className="grid gap-4 lg:grid-cols-3">
        {/* Trainer Management */}
        <article className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Trainer Management
            </h2>
            <button className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {pendingTrainers.length > 0 ? (
              pendingTrainers.slice(0, 5).map((trainer) => (
                <div key={trainer._id} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {trainer.profileImage || trainer.image ? (
                      <img src={trainer.profileImage || trainer.image} alt="Trainer avatar" className="size-8 shrink-0 rounded-full object-cover" />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 font-bold text-xs uppercase">
                        {(trainer.name || trainer.fullName || trainer.email || "?").charAt(0)}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {trainer.name || trainer.fullName || "Trainer"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {trainer.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      className="rounded-md bg-emerald-50 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 transition-colors"
                      onClick={() => {
                        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
                        fetch(`${baseUrl}/trainer-applications/${trainer._id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "approved" }),
                        }).then(() => window.location.reload());
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-md bg-rose-50 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition-colors"
                      onClick={() => {
                        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
                        fetch(`${baseUrl}/trainer-applications/${trainer._id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "rejected" }),
                        }).then(() => window.location.reload());
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center bg-slate-50/50 dark:bg-slate-900/10">
                <ShieldCheck className="size-8 text-emerald-500/50 mb-3" />
                <p className="text-sm font-medium text-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  No pending trainer applications.
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Class Management */}
        <article className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Class Management
            </h2>
            <button className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {pendingClasses.length > 0 ? (
              pendingClasses.slice(0, 5).map((cls) => (
                <div key={cls._id} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {cls.image ? (
                      <img src={cls.image} alt={cls.title || cls.name} className="size-8 shrink-0 rounded-md object-cover" />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <Activity className="size-4" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {cls.title || cls.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {cls.trainerName || "Trainer"} | ${cls.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      className="rounded-md bg-emerald-50 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 transition-colors"
                      onClick={() => {
                        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
                        fetch(`${baseUrl}/classes/${cls._id}/status`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "approved" }),
                        }).then(() => window.location.reload());
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-md bg-rose-50 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition-colors"
                      onClick={() => {
                        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
                        fetch(`${baseUrl}/classes/${cls._id}/status`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "rejected" }),
                        }).then(() => window.location.reload());
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center bg-slate-50/50 dark:bg-slate-900/10">
                <ShieldCheck className="size-8 text-emerald-500/50 mb-3" />
                <p className="text-sm font-medium text-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  No pending class submissions.
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Recent Transactions */}
        <article className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Recent Transactions
            </h2>
            <button className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {transaction.userImage ? (
                      <img src={transaction.userImage} alt="User avatar" className="size-8 shrink-0 rounded-full object-cover" />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold text-xs uppercase">
                        {(transaction.userEmail || "U").charAt(0)}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {transaction.userEmail || "user@example.com"}
                      </p>
                      <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
                        ID: {transaction.transactionId || transaction._id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end shrink-0">
                    <span className="text-sm font-bold text-foreground">
                      ${transaction.price || 0}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center bg-slate-50/50 dark:bg-slate-900/10">
                <ShieldAlert className="size-8 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium text-foreground">No recent transactions</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Transactions will appear here once made.
                </p>
              </div>
            )}
          </div>
        </article>
      </motion.section>
    </motion.div>
  );
}
