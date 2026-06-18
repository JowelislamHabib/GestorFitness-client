"use client";

import {
  BadgeCheck,
  BookOpenCheck,
  CalendarCheck2,
  Dumbbell,
  Heart,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const roleLinks = {
  user: [
    { icon: LayoutDashboard, href: "/dashboard/user", label: "Dashboard" },
    { icon: CalendarCheck2, href: "/dashboard/user/booked-classes", label: "Booked Classes" },
    { icon: Heart, href: "/dashboard/user/favorite-classes", label: "Favorites" },
    { icon: ShieldCheck, href: "/dashboard/user/apply-trainer", label: "Apply Trainer" },
  ],
  trainer: [
    { icon: LayoutDashboard, href: "/dashboard/trainer", label: "Dashboard" },
    { icon: Dumbbell, href: "/dashboard/trainer/classes", label: "My Classes" },
    { icon: Users, href: "/dashboard/trainer/students", label: "Students" },
    { icon: BookOpenCheck, href: "/dashboard/trainer/forum-posts", label: "Forum Posts" },
  ],
  admin: [
    { icon: LayoutDashboard, href: "/dashboard/admin", label: "Dashboard" },
    { icon: Users, href: "/dashboard/admin/users", label: "Users" },
    { icon: BadgeCheck, href: "/dashboard/admin/trainers", label: "Trainer Queue" },
    { icon: Dumbbell, href: "/dashboard/admin/classes", label: "Classes" },
    { icon: WalletCards, href: "/dashboard/admin/transactions", label: "Transactions" },
    { icon: MessageSquareText, href: "/dashboard/admin/forums", label: "Forum Watch" },
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

function Avatar({ user }) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
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
    <aside className="hidden min-h-screen w-64 shrink-0 border-r bg-card lg:sticky lg:top-0 lg:flex lg:flex-col">
      <div className="border-b px-6 py-5">
        <Link href="/" className="text-2xl font-bold text-foreground">
          GestorFitness
        </Link>
      </div>

      <div className="px-5 py-6">
        <div className="flex items-center gap-3 rounded-2xl border bg-background p-3">
          {isPending ? (
            <div className="size-11 rounded-full bg-muted" />
          ) : (
            <Avatar user={user} />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {isPending ? "Loading" : user?.name || "Dashboard user"}
            </p>
            <p className="truncate text-xs capitalize text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
