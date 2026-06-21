"use client";

import { motion } from "framer-motion";
import { Activity, BookOpenCheck, CreditCard, Dumbbell, ExternalLink, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
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

export default function TrainerDashboardClient({ 
  firstName, 
  totalClasses,
  activeStudents,
  totalEarnings,
  pendingClassesCount,
  classes = [],
  bookings = []
}) {
  const recentClasses = classes.slice(0, 5);
  const recentBookings = bookings.slice(0, 5);
  const recentTransactions = bookings.slice(0, 5); // Assuming bookings represent transactions

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
            Ready to coach, {firstName}? 💪
          </h1>
          <p className="mt-2 text-slate-300 text-lg max-w-2xl">
            You are managing {totalClasses} classes with {activeStudents} enrolled students. Keep up the great work!
          </p>
        </div>
        <div className="absolute -right-10 -top-24 size-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-32 size-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      </motion.section>

      {/* Unified Stats & Action Cards */}
      <motion.section variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Classes Card */}
        <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
              <Dumbbell className="size-6" />
            </div>
            <p className="text-4xl font-heading font-bold text-foreground">
              <AnimatedCounter value={totalClasses} />
            </p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              Classes
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Total classes created
            </p>
          </div>
          <Link href="/dashboard/trainer/classes" className="mt-auto flex items-center justify-center w-full py-3 bg-emerald-50/80 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-colors border-t border-emerald-100 dark:border-emerald-900">
            Manage Classes
          </Link>
        </article>

        {/* Students Card */}
        <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 mb-3 group-hover:scale-110 transition-transform">
              <Users className="size-6" />
            </div>
            <p className="text-4xl font-heading font-bold text-foreground">
              <AnimatedCounter value={activeStudents} />
            </p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              Students
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Total enrollments
            </p>
          </div>
          <Link href="/dashboard/trainer/students" className="mt-auto flex items-center justify-center w-full py-3 bg-blue-50/80 text-blue-700 font-semibold text-sm hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors border-t border-blue-100 dark:border-blue-900">
            View Students
          </Link>
        </article>

        {/* Earnings Card */}
        <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 mb-3 group-hover:scale-110 transition-transform">
              <CreditCard className="size-6" />
            </div>
            <p className="text-4xl font-heading font-bold text-foreground">
              $<AnimatedCounter value={totalEarnings} />
            </p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              Earnings
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Lifetime revenue
            </p>
          </div>
          <Link href="/dashboard/trainer/transactions" className="mt-auto flex items-center justify-center w-full py-3 bg-indigo-50/80 text-indigo-700 font-semibold text-sm hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-900/40 transition-colors border-t border-indigo-100 dark:border-indigo-900">
            View Earnings
          </Link>
        </article>

        {/* Pending Classes Card */}
        <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 mb-3 group-hover:scale-110 transition-transform">
              <Activity className="size-6" />
            </div>
            <p className="text-4xl font-heading font-bold text-foreground">
              <AnimatedCounter value={pendingClassesCount} />
            </p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              Pending
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Awaiting admin approval
            </p>
          </div>
          <Link href="/dashboard/trainer/add-class" className="mt-auto flex items-center justify-center w-full py-3 bg-orange-50/80 text-orange-700 font-semibold text-sm hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:hover:bg-orange-900/40 transition-colors border-t border-orange-100 dark:border-orange-900">
            Add New Class
          </Link>
        </article>
      </motion.section>

      {/* Bottom Section - Lists */}
      <motion.section variants={itemVariants} className="grid gap-4 lg:grid-cols-3">
        
        {/* My Classes */}
        <article className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              My Classes
            </h2>
            <Link href="/dashboard/trainer/classes" className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {recentClasses.length > 0 ? (
              recentClasses.map((cls) => (
                <div key={cls._id} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {cls.image ? (
                      <img src={cls.image} alt={cls.title} className="size-8 shrink-0 rounded-md object-cover" />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <Dumbbell className="size-4" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {cls.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        Status: {cls.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/classes/${cls._id}`}
                      className="flex size-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center bg-slate-50/50 dark:bg-slate-900/10">
                <ShieldCheck className="size-8 text-emerald-500/50 mb-3" />
                <p className="text-sm font-medium text-foreground">No classes yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start by adding your first class.
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Recent Enrollments */}
        <article className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Recent Enrollments
            </h2>
            <Link href="/dashboard/trainer/students" className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => {
                const cls = booking.classDetails || {};
                return (
                  <div key={booking._id || booking.sessionId} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {booking.userImage ? (
                        <img src={booking.userImage} alt="User" className="size-8 shrink-0 rounded-full object-cover" />
                      ) : (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold text-xs uppercase">
                          {(booking.userEmail || "U").charAt(0)}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {booking.userEmail || "User"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {cls.title || booking.title}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center bg-slate-50/50 dark:bg-slate-900/10">
                <Users className="size-8 text-blue-500/50 mb-3" />
                <p className="text-sm font-medium text-foreground">No students yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Students will appear here once they enroll.
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Recent Earnings */}
        <article className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Recent Earnings
            </h2>
            <Link href="/dashboard/trainer/transactions" className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition-colors">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => {
                const cls = transaction.classDetails || {};
                return (
                  <div key={transaction._id || transaction.sessionId} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold text-xs uppercase">
                        $
                      </div>
                      <div className="overflow-hidden">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {transaction.title || cls.title || "Class Payment"}
                        </p>
                        <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
                          From: {transaction.userEmail || "User"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end shrink-0">
                      <span className="text-sm font-bold text-foreground">
                        +${transaction.price || cls.price || 0}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center bg-slate-50/50 dark:bg-slate-900/10">
                <CreditCard className="size-8 text-indigo-500/50 mb-3" />
                <p className="text-sm font-medium text-foreground">No earnings yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your payments will appear here.
                </p>
              </div>
            )}
          </div>
        </article>

      </motion.section>
    </motion.div>
  );
}
