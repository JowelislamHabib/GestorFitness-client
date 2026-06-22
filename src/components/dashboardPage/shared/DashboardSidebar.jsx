"use client";

import {
    Activity,
    BadgeCheck,
    CalendarCheck2,
    Dumbbell,
    GraduationCap,
    Heart,
    LayoutDashboard,
    MessageSquareText,
    ShieldCheck,
    Users,
    WalletCards,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const roleLinks = {
  user: [
    {
      sector: "Overview",
      items: [
        { icon: LayoutDashboard, href: "/dashboard/user", label: "Dashboard" },
        { icon: CalendarCheck2, href: "/dashboard/user/booked-classes", label: "Booked Classes" },
        { icon: WalletCards, href: "/dashboard/user/transactions", label: "Transactions" },
      ],
    },
    {
      sector: "Settings & More",
      items: [
        { icon: Heart, href: "/dashboard/favorites", label: "Favorites" },
        { icon: ShieldCheck, href: "/dashboard/user/apply-trainer", label: "Apply Trainer" },
      ],
    },
  ],
  trainer: [
    {
      sector: "Overview",
      items: [
        { icon: LayoutDashboard, href: "/dashboard/trainer", label: "Dashboard" },
        { icon: WalletCards, href: "/dashboard/trainer/transactions", label: "Transactions" },
      ],
    },
    {
      sector: "Management",
      items: [
        { icon: Dumbbell, href: "/dashboard/trainer/classes", label: "My Classes" },
        { icon: GraduationCap, href: "/dashboard/trainer/students", label: "Students" },
      ],
    },
    {
      sector: "Community",
      items: [
        { icon: MessageSquareText, href: "/dashboard/trainer/forum-posts", label: "My Posts" },
        { icon: Heart, href: "/dashboard/favorites", label: "Favorites" },
      ],
    },
  ],
  admin: [
    {
      sector: "Analytics",
      items: [
        { icon: LayoutDashboard, href: "/dashboard/admin", label: "Dashboard" },
        { icon: WalletCards, href: "/dashboard/admin/transactions", label: "Transactions" },
      ],
    },
    {
      sector: "Management",
      items: [
        { icon: Users, href: "/dashboard/admin/users", label: "Users" },
        { icon: GraduationCap, href: "/dashboard/admin/students", label: "All Students" },
        { icon: BadgeCheck, href: "/dashboard/admin/trainers", label: "Trainer Management" },
        { icon: Dumbbell, href: "/dashboard/admin/classes", label: "Classes" },
      ],
    },
    {
      sector: "Community",
      items: [
        { icon: MessageSquareText, href: "/dashboard/admin/forum-posts", label: "Forum" },
        { icon: Heart, href: "/dashboard/favorites", label: "Favorites" },
      ],
    },
  ],
};

function getInitials(user) {
  const label = user?.name?.trim() || user?.email?.split("@")[0] || "User";
  const parts = label.split(" ").filter(Boolean);

  if (parts.length < 2) {
    return (parts[0] || "US").slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getRole(user) {
  return (user?.role || user?.initialRole || "user").toLowerCase();
}

function Avatar({ user, className }) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-sm font-bold text-primary-foreground", className)}>
      {user?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        getInitials(user)
      )}
    </span>
  );
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const user = session?.user;
  const role = getRole(user);
  const sectors = roleLinks[role] || roleLinks.user;

  return (
    <aside 
      className={cn(
        "hidden shrink-0 border-r border-border/50 bg-card/50 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:flex-col min-h-screen transition-all duration-300 ease-in-out z-50",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      <div className={cn("flex h-20 items-center border-b border-border/50", isCollapsed ? "justify-center px-0" : "px-8")}>
        <Link href="/" className="flex items-center gap-2.5 outline-none group overflow-hidden">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg shadow-red-600/20 group-hover:scale-105 transition-all duration-300">
            <Activity className="size-4" aria-hidden="true" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-heading text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight uppercase whitespace-nowrap"
              >
                GestorFitness
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <div className="flex-1 py-8 flex flex-col items-center overflow-x-hidden overflow-y-auto no-scrollbar">
        <motion.nav 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={cn("flex flex-col gap-6 w-full", isCollapsed ? "px-2" : "px-4")}
        >
          {sectors.map((sectorObj) => (
            <div key={sectorObj.sector} className="flex flex-col gap-2">
              {/* Sector Header */}
              {isCollapsed ? (
                <div className="mx-auto w-8 border-t border-border/50 my-2" />
              ) : (
                <motion.p variants={itemVariants} className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-1 whitespace-nowrap">
                  {sectorObj.sector}
                </motion.p>
              )}

              {/* Items */}
              {sectorObj.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <motion.div key={`${item.href}-${item.label}`} variants={itemVariants} className="relative group">
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center rounded-2xl py-3 text-sm font-bold transition-all duration-300 overflow-hidden",
                        isActive
                          ? "text-red-600 dark:text-red-400 bg-red-600/10"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                        isCollapsed ? "justify-center px-0 h-11 w-11 mx-auto" : "gap-3 px-4 tracking-wide"
                      )}
                    >
                      {isActive && (
                        <span 
                          className={cn(
                            "rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)] transition-all duration-300",
                            isCollapsed 
                              ? "absolute top-2 right-2 size-1.5" 
                              : "absolute right-4 top-1/2 -translate-y-1/2 size-1.5"
                          )} 
                        />
                      )}
                      <Icon 
                        className={cn(
                          "size-4.5 shrink-0 transition-transform duration-300",
                          isActive ? "scale-110" : "group-hover:scale-110"
                        )} 
                        aria-hidden="true" 
                      />
                      
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 hidden group-hover:block z-50">
                        <div className="rounded-md bg-foreground px-3 py-1.5 text-xs font-bold text-background shadow-md whitespace-nowrap">
                          {item.label}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </motion.nav>
      </div>

      <div className="flex flex-col border-t border-border/50">
        {/* Toggle Button */}
        <div className={cn("p-2", isCollapsed ? "flex justify-center" : "flex justify-end")}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex size-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {isCollapsed ? <PanelLeftOpen className="size-4.5" /> : <PanelLeftClose className="size-4.5" />}
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 pt-0">
          <div className={cn(
            "flex items-center rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors cursor-pointer group",
            isCollapsed ? "p-2 justify-center" : "gap-3 p-3"
          )}>
            {isPending ? (
              <div className="size-10 shrink-0 rounded-xl bg-background animate-pulse" />
            ) : (
              <Avatar user={user} className="size-10 shrink-0 shadow-sm group-hover:scale-105 transition-transform" />
            )}
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="min-w-0 flex-1 overflow-hidden"
                >
                  <p className="truncate text-sm font-bold text-foreground leading-tight">
                    {isPending ? "Loading..." : user?.name || "Dashboard user"}
                  </p>
                  <p className="truncate text-[11px] font-bold uppercase tracking-[0.2em] text-red-600 mt-0.5">
                    {role}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </aside>
  );
}
