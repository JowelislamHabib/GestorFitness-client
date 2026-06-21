"use client";

import {
    Activity,
    BadgeCheck,
    BookOpenCheck,
    CalendarCheck2,
    Dumbbell,
    Heart,
    LayoutDashboard,
    MessageSquareText,
    ShieldCheck,
    Users,
    WalletCards
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const roleLinks = {
  user: [
    { icon: LayoutDashboard, href: "/dashboard/user", label: "Dashboard" },
    { icon: CalendarCheck2, href: "/dashboard/user/booked-classes", label: "Booked Classes" },
    { icon: WalletCards, href: "/dashboard/user/transactions", label: "Transactions" },
    { icon: Heart, href: "/dashboard/favorites", label: "Favorites" },
    { icon: ShieldCheck, href: "/dashboard/user/apply-trainer", label: "Apply Trainer" },
  ],
  trainer: [
    { icon: LayoutDashboard, href: "/dashboard/trainer", label: "Dashboard" },
    { icon: Dumbbell, href: "/dashboard/trainer/classes", label: "My Classes" },
    { icon: Users, href: "/dashboard/trainer/students", label: "Students" },
    { icon: BookOpenCheck, href: "/dashboard/trainer/forum-posts", label: "My Posts" },
    { icon: WalletCards, href: "/dashboard/trainer/transactions", label: "Transactions" },
    { icon: Heart, href: "/dashboard/favorites", label: "Favorites" },
  ],
  admin: [
    { icon: LayoutDashboard, href: "/dashboard/admin", label: "Dashboard" },
    { icon: Users, href: "/dashboard/admin/users", label: "Users" },
    { icon: Users, href: "/dashboard/admin/students", label: "All Students" },
    { icon: BadgeCheck, href: "/dashboard/admin/trainers", label: "Trainer Management" },
    { icon: Dumbbell, href: "/dashboard/admin/classes", label: "Classes" },
    { icon: WalletCards, href: "/dashboard/admin/transactions", label: "Transactions" },
    { icon: MessageSquareText, href: "/dashboard/admin/forum-posts", label: "Forum" },
    { icon: Heart, href: "/dashboard/favorites", label: "Favorites" },
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

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const role = getRole(user);
  const navItems = roleLinks[role] || roleLinks.user;

  return (
    <aside className="hidden min-h-screen w-[280px] shrink-0 border-r border-border/50 bg-card/50 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:flex-col">
      <div className="flex h-20 items-center px-8 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2.5 outline-none group">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-all duration-300">
            <Activity className="size-4" aria-hidden="true" />
          </div>
          <span className="font-heading text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight">
            GestorFitness
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-8">
        <nav className="grid gap-2 px-4">
          <p className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 overflow-hidden group",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-600/10"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
                )}
                <Icon 
                  className={cn(
                    "size-5 transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} 
                  aria-hidden="true" 
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3 border border-border/50 hover:bg-muted transition-colors cursor-pointer group">
          {isPending ? (
            <div className="size-10 rounded-xl bg-background animate-pulse" />
          ) : (
            <Avatar user={user} className="size-10 shadow-sm group-hover:scale-105 transition-transform" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground leading-tight">
              {isPending ? "Loading..." : user?.name || "Dashboard user"}
            </p>
            <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
              {role} account
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
