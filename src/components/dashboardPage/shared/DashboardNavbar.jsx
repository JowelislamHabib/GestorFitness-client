"use client";

import { Bell, ChevronDown, LogOut, Menu, Search, X, LayoutDashboard, CalendarCheck2, Heart, ShieldCheck, Dumbbell, Users, MessageSquareText, BadgeCheck, WalletCards, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import LogoutButton from "@/components/shared/LogoutButton";
import Logo from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NotificationsDropdown } from "@/components/dashboardPage/shared/NotificationsDropdown";
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
    { href: "/dashboard/user", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/user/booked-classes", label: "Booked Classes", icon: CalendarCheck2 },
    { href: "/dashboard/user/transactions", label: "Transactions", icon: WalletCards },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard/user/apply-trainer", label: "Apply Trainer", icon: ShieldCheck },
  ],
  trainer: [
    { href: "/dashboard/trainer", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/trainer/transactions", label: "Transactions", icon: WalletCards },
    { href: "/dashboard/trainer/classes", label: "My Classes", icon: Dumbbell },
    { href: "/dashboard/trainer/students", label: "Students", icon: GraduationCap },
    { href: "/dashboard/trainer/forum-posts", label: "My Posts", icon: MessageSquareText },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: WalletCards },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/students", label: "All Students", icon: GraduationCap },
    { href: "/dashboard/admin/trainers", label: "Trainer Management", icon: BadgeCheck },
    { href: "/dashboard/admin/classes", label: "Classes", icon: Dumbbell },
    { href: "/dashboard/admin/forum-posts", label: "Forum", icon: MessageSquareText },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
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

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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

        <div ref={searchRef} className="relative hidden flex-1 lg:block mr-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search menus..."
            className="h-10 w-full rounded-xl border bg-card pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {isSearchOpen && searchTerm && (
            <div className="absolute top-full mt-2 w-full rounded-xl border bg-card shadow-lg p-2 z-50 overflow-hidden">
              {filteredNavItems.length > 0 ? (
                filteredNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchTerm("");
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No menus found.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <NotificationsDropdown />
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
                  <span className="block container truncate text-sm font-semibold text-foreground group-hover:text-red-600 transition-colors">
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
                {navItems.map((item) => (
                  <DropdownMenuItem key={`${item.href}-${item.label}`} asChild className="rounded-xl px-3 py-2 text-sm font-medium cursor-pointer">
                    <Link href={item.href} className="flex w-full items-center gap-2">
                      <item.icon className="size-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="m-0" />
              <div className="p-1.5">
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm font-medium cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                  <LogoutButton className="w-full" iconClassName="size-4" />
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur"
            aria-label="Close dashboard menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="relative h-full w-72 border-r bg-background shadow-2xl p-4">
            <div className="flex items-center justify-between border-b pb-4">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <Logo className="h-8 w-auto" />
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
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                      isActive
                        ? "bg-red-600/10 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-600/20 shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                    )}
                  >
                    <item.icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
