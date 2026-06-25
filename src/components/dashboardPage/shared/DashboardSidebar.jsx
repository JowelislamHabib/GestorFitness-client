"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    BadgeCheck,
    CalendarCheck2,
    Dumbbell,
    GraduationCap,
    Heart,
    LayoutDashboard,
    MessageSquareText,
    PanelLeftClose,
    PanelLeftOpen,
    PlusCircle,
    ShieldCheck,
    Users,
    WalletCards
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Logo from "@/components/shared/Logo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
        { 
          icon: Dumbbell, 
          href: "/dashboard/trainer/classes", 
          label: "My Classes",
          subItems: [
            { icon: PlusCircle, href: "/dashboard/trainer/add-class", label: "Add New Class" }
          ]
        },
        { icon: GraduationCap, href: "/dashboard/trainer/students", label: "All Students" },
      ],
    },
    {
      sector: "Community",
      items: [
        { 
          icon: MessageSquareText, 
          href: "/dashboard/trainer/forum-posts", 
          label: "My Posts",
          subItems: [
            { icon: PlusCircle, href: "/dashboard/trainer/forum-posts/new", label: "Add New Post" }
          ]
        },
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
        { 
          icon: MessageSquareText, 
          href: "/dashboard/admin/forum-posts", 
          label: "Forum",
          subItems: [
            { icon: PlusCircle, href: "/dashboard/admin/forum-posts/new", label: "Add New Post" }
          ]
        },
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
    <TooltipProvider delayDuration={100}>
      <aside 
        className={cn(
          "relative hidden shrink-0 border-r border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:flex-col min-h-screen transition-all duration-300 ease-in-out z-50",
          isCollapsed ? "w-[80px]" : "w-[280px]"
        )}
      >
      <div className={cn("flex h-20 items-center border-b border-slate-200 dark:border-slate-800", isCollapsed ? "justify-center px-0" : "px-8")}>
        <Link href="/" className="flex items-center gap-2.5 outline-none group overflow-hidden">
          {isCollapsed ? (
            <img 
              src="/GestorFitness.png" 
              alt="Icon" 
              className="size-8 object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          ) : (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <Logo className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" />
              </motion.div>
            </AnimatePresence>
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-6 z-50 flex size-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-background text-slate-600 dark:text-slate-400 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300"
      >
        {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
      </button>

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
                <div className="mx-auto w-8 border-t border-slate-200 dark:border-slate-800 my-2" />
              ) : (
                <motion.p variants={itemVariants} className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-1 whitespace-nowrap">
                  {sectorObj.sector}
                </motion.p>
              )}

              {/* Items */}
              {sectorObj.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                const LinkContent = (
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center rounded-2xl py-3 text-sm font-bold transition-all duration-300 overflow-hidden",
                      isActive
                        ? "text-red-600 dark:text-red-400 bg-red-600/10"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
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
                );

                return (
                  <motion.div key={`${item.href}-${item.label}`} variants={itemVariants} className="relative group">
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {LinkContent}
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={15} className="font-bold text-xs bg-foreground text-background border-none rounded-md px-3 py-1.5 shadow-md">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      LinkContent
                    )}

                    {/* Sub-items */}
                    {!isCollapsed && item.subItems && (
                      <div className="mt-1 flex flex-col gap-1 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                        {item.subItems.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "flex items-center gap-3 rounded-xl py-2 px-3 text-xs font-semibold transition-all duration-300",
                                isSubActive
                                  ? "text-red-600 dark:text-red-400 bg-red-600/10"
                                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                              )}
                            >
                              <SubIcon className={cn("size-3.5", isSubActive && "scale-110")} />
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </motion.nav>
      </div>


      </aside>
    </TooltipProvider>
  );
}
