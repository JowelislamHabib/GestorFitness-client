"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Activity, CalendarCheck, Heart, CreditCard, ExternalLink, ShieldCheck, Dumbbell, Timer, PlusCircle } from "lucide-react";
import Link from "next/link";

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

export default function UserDashboardClient({ 
  firstName, 
  totalBookings,
  totalFavorites,
  totalSpent,
  upcomingClasses = [],
  favoriteClasses = [],
  bookings = []
}) {
  const recentTransactions = bookings.slice(0, 5);

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
            You have {totalBookings} booked classes and {totalFavorites} favorite classes saved. Keep pushing towards your goals!
          </p>
        </div>
        <div className="absolute -right-10 -top-24 size-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-32 size-48 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />
      </motion.section>

      {/* Unified Stats & Action Cards */}
      <motion.section variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Bookings"
          value={totalBookings}
          description="Total classes booked"
          icon={CalendarCheck}
          color="blue"
          link={{ href: "/dashboard/user/booked-classes", text: "View Bookings" }}
        />

        <StatCard
          title="Favorites"
          value={totalFavorites}
          description="Saved classes"
          icon={Heart}
          color="rose"
          link={{ href: "/dashboard/user/booked-classes", text: "View Favorites" }}
        />

        <StatCard
          title="Spent"
          value={totalSpent}
          description="Total investment"
          icon={CreditCard}
          color="emerald"
          prefix="$"
          link={{ href: "/dashboard/user/booked-classes", text: "View History" }}
        />

        <StatCard
          title="New Class"
          value={<span className="text-xl">Find Classes</span>}
          description="Explore our schedule"
          icon={PlusCircle}
          color="purple"
          link={{ href: "/classes", text: "Browse Classes" }}
        />
      </motion.section>

      {/* Bottom Section - Lists */}
      <motion.section variants={itemVariants} className="grid gap-4 lg:grid-cols-3">
        
        {/* Upcoming Classes */}
        <article className="min-w-0 rounded-2xl border bg-card p-6 shadow-sm flex flex-col max-h-[400px] lg:h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              My Classes
            </h2>
            <Link href="/dashboard/user/booked-classes" className="text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((booking) => {
                const cls = booking.classDetails || {};
                return (
                  <div key={booking._id || booking.sessionId} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      {cls.image ? (
                        <img src={cls.image} alt={cls.title || "Class"} className="size-8 shrink-0 rounded-md object-cover" />
                      ) : (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                          <Dumbbell className="size-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {booking.title || cls.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {cls.time || "TBD"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        href={`/classes/${booking.classDetails?.slug}`}
                        className="flex size-7 items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center bg-slate-50/50 dark:bg-slate-900/10">
                <ShieldCheck className="size-8 text-emerald-500/50 mb-3" />
                <p className="text-sm font-medium text-foreground">No classes booked</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You haven't booked any classes yet.
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Favorite Classes */}
        <article className="min-w-0 rounded-2xl border bg-card p-6 shadow-sm flex flex-col max-h-[400px] lg:h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Favorites
            </h2>
            <Link href="/dashboard/favorites" className="text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 transition-colors">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {favoriteClasses.length > 0 ? (
              favoriteClasses.slice(0, 5).map((cls) => (
                <div key={cls._id} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {cls.image ? (
                      <img src={cls.image} alt={cls.title} className="size-8 shrink-0 rounded-md object-cover" />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                        <Heart className="size-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {cls.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {cls.trainerName || "Trainer"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/classes/${cls.slug}`}
                      className="flex size-7 items-center justify-center rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center bg-slate-50/50 dark:bg-slate-900/10">
                <Heart className="size-8 text-rose-500/50 mb-3" />
                <p className="text-sm font-medium text-foreground">No favorites</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You haven't added any classes to your favorites.
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
            <Link href="/dashboard/user/transactions" className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-colors">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => {
                const cls = transaction.classDetails || {};
                return (
                  <div key={transaction._id || transaction.sessionId} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold text-xs uppercase">
                        $
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {transaction.title || cls.title || "Class Payment"}
                        </p>
                        <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
                          ID: {transaction.transactionId || transaction._id || transaction.sessionId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end shrink-0">
                      <span className="text-sm font-bold text-foreground">
                        ${transaction.price || cls.price || 0}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center bg-slate-50/50 dark:bg-slate-900/10">
                <CreditCard className="size-8 text-emerald-500/50 mb-3" />
                <p className="text-sm font-medium text-foreground">No recent transactions</p>
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
