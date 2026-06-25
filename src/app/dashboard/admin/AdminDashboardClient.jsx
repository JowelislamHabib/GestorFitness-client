"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Activity, CalendarCheck, MessageSquare, PlusCircle, ShieldAlert, ShieldCheck, UserCog, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { updateClassStatus } from "@/lib/api/classes";
import { updateTrainerApplicationStatus } from "@/lib/api/trainerApplications";
import dynamic from "next/dynamic";

const AdminChart = dynamic(() => import("./AdminChart"), { ssr: false });
const AdminPieChart = dynamic(() => import("./AdminPieChart"), { ssr: false });

import { StatCard } from "@/components/ui/stat-card";

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
        <div className="absolute -bottom-24 right-32 size-48 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />
      </motion.section>

      {/* Unified Stats & Action Cards */}
      <motion.section variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Users"
          value={totalUsers}
          description="Total registered members"
          icon={Users}
          color="blue"
          link={{ href: "/dashboard/admin/users", text: "Manage Users" }}
        />

        <StatCard
          title="Classes"
          value={activeClasses}
          description="Active fitness classes"
          icon={Activity}
          color="emerald"
          link={{ href: "/dashboard/admin/classes", text: "Manage Classes" }}
        />

        <StatCard
          title="Trainers"
          value={pendingTrainers.length}
          description="Pending applications"
          icon={UserCog}
          color="orange"
          link={{ href: "/dashboard/admin/trainers", text: "Review Trainers" }}
        />

        <StatCard
          title="Forum"
          value={forumPostsTotal}
          description="Total discussions"
          icon={MessageSquare}
          color="purple"
          link={{ href: "/dashboard/admin/forum-posts", text: "Add Forum Post" }}
        />
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
        <article className="min-w-0 rounded-2xl border bg-card p-6 shadow-sm flex flex-col max-h-[400px] lg:h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Trainer Management
            </h2>
            <Link href="/dashboard/admin/trainers" className="text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {pendingTrainers.length > 0 ? (
              pendingTrainers.slice(0, 5).map((trainer) => (
                <div key={trainer._id} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
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
                      onClick={async () => {
                        await updateTrainerApplicationStatus(trainer._id, "approved");
                        window.location.reload();
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-md bg-rose-50 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition-colors"
                      onClick={async () => {
                        await updateTrainerApplicationStatus(trainer._id, "rejected");
                        window.location.reload();
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
        <article className="min-w-0 rounded-2xl border bg-card p-6 shadow-sm flex flex-col max-h-[400px] lg:h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Class Management
            </h2>
            <Link href="/dashboard/admin/classes" className="text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {pendingClasses.length > 0 ? (
              pendingClasses.slice(0, 5).map((cls) => (
                <div key={cls._id} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {cls.image ? (
                      <img src={cls.image} alt={cls.title || cls.name} className="size-8 shrink-0 rounded-md object-cover" />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
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
                      onClick={async () => {
                        await updateClassStatus(cls._id, "approved");
                        window.location.reload();
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-md bg-rose-50 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition-colors"
                      onClick={async () => {
                        await updateClassStatus(cls._id, "rejected");
                        window.location.reload();
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
        <article className="min-w-0 rounded-2xl border bg-card p-6 shadow-sm flex flex-col max-h-[400px] lg:h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Recent Transactions
            </h2>
            <Link href="/dashboard/admin/transactions" className="text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
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
