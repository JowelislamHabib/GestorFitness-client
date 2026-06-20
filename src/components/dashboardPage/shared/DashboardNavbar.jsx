"use client";

import { Bell, ChevronDown, LogOut, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { dashboardSignOut } from "@/components/dashboardPage/shared/dashboard-actions";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const roleLinks = {
  user: [
    { href: "/dashboard/user", label: "Dashboard" },
    { href: "/dashboard/user/booked-classes", label: "Booked Classes" },
    { href: "/dashboard/favorites", label: "Favorites" },
    { href: "/dashboard/user/apply-trainer", label: "Apply Trainer" },
  ],
  trainer: [
    { href: "/dashboard/trainer", label: "Dashboard" },
    { href: "/dashboard/trainer/classes", label: "My Classes" },
    { href: "/dashboard/trainer/students", label: "Students" },
    { href: "/dashboard/trainer/forum-posts", label: "My Posts" },
    { href: "/dashboard/favorites", label: "Favorites" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Dashboard" },
    { href: "/dashboard/admin/users", label: "Users" },
    { href: "/dashboard/admin/trainers", label: "Trainer Queue" },
    { href: "/dashboard/admin/classes", label: "Classes" },
    { href: "/dashboard/admin/transactions", label: "Transactions" },
    { href: "/dashboard/admin/forum-posts", label: "Forum" },
    { href: "/dashboard/favorites", label: "Favorites" },
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
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground",
        className
      )}
    >
      {user?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        getInitials(user)
      )}
    </span>
  );
}

export default function DashboardNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const role = getRole(user);
  const navItems = roleLinks[role] || roleLinks.user;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-6">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="inline-flex size-10 items-center justify-center rounded-xl border text-muted-foreground lg:hidden"
          aria-label="Open dashboard menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <label className="relative hidden flex-1 lg:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search dashboard"
            className="h-10 w-full rounded-xl border bg-card pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="relative inline-flex size-10 items-center justify-center rounded-xl border text-muted-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-5" aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive" />
          </button>
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl border bg-card p-1.5 pr-3 outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:ring-2 data-[state=open]:ring-ring transition-all group">
                {isPending ? (
                  <span className="size-9 rounded-full bg-muted" />
                ) : (
                  <Avatar user={user} className="size-9" />
                )}
                <span className="hidden text-left sm:block">
                  <span className="block container truncate text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                    {user?.name || "Dashboard user"}
                  </span>
                  <span className="block text-xs capitalize text-muted-foreground">{role}</span>
                </span>
                <ChevronDown className="size-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-2xl p-0">
              <DropdownMenuLabel className="p-3">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user?.name || "Dashboard user"}
                </p>
                <p className="truncate text-xs font-medium text-muted-foreground">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="m-0" />
              <div className="p-1.5">
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm font-medium cursor-pointer">
                  <Link href="/dashboard" className="w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="m-0" />
              <div className="p-1.5">
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm font-medium cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                  <form action={dashboardSignOut} className="w-full">
                    <button type="submit" className="flex w-full items-center gap-2 text-left">
                      <LogOut className="size-4" aria-hidden="true" />
                      Log out
                    </button>
                  </form>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur"
            aria-label="Close dashboard menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="relative h-full w-72 border-r bg-card p-4">
            <div className="flex items-center justify-between border-b pb-4">
              <Link href="/" className="text-xl font-bold text-foreground" onClick={() => setMenuOpen(false)}>
                GestorFitness
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-xl border text-muted-foreground"
                aria-label="Close dashboard menu"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <nav className="mt-5 grid gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
