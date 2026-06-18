import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Activity,
  ChevronDown,
  Dumbbell,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getUserSession } from "@/lib/core/session";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Classes", href: "/classes" },
  { name: "Community", href: "/forums" },
];

const ROLE_DETAILS = {
  admin: {
    label: "Admin",
    eyebrow: "Platform control",
    icon: ShieldCheck,
    links: [
      { name: "Manage users", href: "/dashboard/admin/users", icon: Users },
      { name: "Manage classes", href: "/dashboard/admin/classes", icon: Dumbbell },
    ],
  },
  trainer: {
    label: "Trainer",
    eyebrow: "Coach workspace",
    icon: Sparkles,
    links: [
      { name: "My classes", href: "/dashboard/trainer/classes", icon: Dumbbell },
      { name: "Forum posts", href: "/dashboard/trainer/forum-posts", icon: MessageSquareText },
    ],
  },
  user: {
    label: "Member",
    eyebrow: "Member profile",
    icon: UserRound,
    links: [
      { name: "Booked classes", href: "/dashboard/booked-classes", icon: Dumbbell },
      { name: "Favorite classes", href: "/dashboard/favorite-classes", icon: Heart },
    ],
  },
};

const getUserRole = (user) => {
  return (user?.role || user?.initialRole || "user").toLowerCase();
};

const getInitials = (user) => {
  const label = user?.name?.trim() || user?.email?.split("@")[0] || "User";
  const parts = label.split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getFirstName = (user) => {
  return user?.name?.trim()?.split(" ")[0] || "Member";
};

async function signOutAction() {
  "use server";

  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/login");
}

function BrandLink() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 outline-none group"
    >
      <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-all duration-300">
        <Activity className="size-5" aria-hidden="true" />
      </div>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight group-hover:to-blue-500 transition-colors duration-300">
          GestorFitness
        </span>
      </span>
    </Link>
  );
}

function Avatar({ user, className = "size-9" }) {
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-background bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm ${className}`}
      aria-hidden="true"
    >
      {user?.image ? (
        <img
          src={user.image}
          alt=""
          className="size-full object-cover"
        />
      ) : (
        getInitials(user)
      )}
    </span>
  );
}

function NavLinks({ user }) {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="relative px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground group"
        >
          {link.name}
          <span className="absolute inset-x-4 -bottom-1 h-0.5 bg-blue-600 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded-full" />
        </Link>
      ))}
      {user ? (
        <Link
          href="/dashboard"
          className="relative px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground group"
        >
          Dashboard
          <span className="absolute inset-x-4 -bottom-1 h-0.5 bg-blue-600 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded-full" />
        </Link>
      ) : null}
    </>
  );
}

function UserDropdown({ user }) {
  const role = getUserRole(user);
  const roleDetails = ROLE_DETAILS[role] || ROLE_DETAILS.user;
  const RoleIcon = roleDetails.icon;

  return (
    <details className="group relative [&>summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-full border border-border/50 bg-card/50 hover:bg-card px-1.5 py-1.5 pr-3 shadow-sm backdrop-blur-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20">
        <Avatar user={user} />
        <span className="hidden min-w-0 text-left lg:block">
          <span className="block truncate text-sm font-bold text-foreground leading-tight">
            {getFirstName(user)}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <RoleIcon className="size-3" aria-hidden="true" />
            {roleDetails.label}
          </span>
        </span>
        <ChevronDown
          className="size-4 text-muted-foreground transition-transform duration-300 group-open:rotate-180 ml-1"
          aria-hidden="true"
        />
      </summary>

      {/* Overlay to close dropdown when clicking outside (CSS hack) */}
      <div className="fixed inset-0 z-40 hidden group-open:block" />

      <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border border-border/50 bg-background/80 backdrop-blur-xl text-popover-foreground shadow-2xl z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-gradient-to-br from-blue-600/5 to-transparent">
          <div className="flex items-center gap-3">
            <Avatar user={user} className="size-12 shadow-md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">
                {user?.name || "GestorFitness member"}
              </p>
              <p className="truncate text-xs font-medium text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
            <RoleIcon className="size-3.5" aria-hidden="true" />
            {roleDetails.eyebrow}
          </div>
        </div>

        <div className="p-2 space-y-1 border-t border-border/50">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all hover:bg-muted/50 hover:pl-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group/item"
          >
            <div className="bg-background shadow-sm p-1.5 rounded-lg group-hover/item:text-blue-600 group-hover/item:shadow-md transition-all">
              <LayoutDashboard className="size-4" aria-hidden="true" />
            </div>
            Dashboard
          </Link>

          {roleDetails.links.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all hover:bg-muted/50 hover:pl-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group/item"
              >
                <div className="bg-background shadow-sm p-1.5 rounded-lg group-hover/item:text-blue-600 group-hover/item:shadow-md transition-all">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-2 border-t border-border/50 bg-muted/20">
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 dark:text-red-400 transition-all hover:bg-red-500/10 hover:pl-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/20 group/item"
            >
              <div className="bg-background shadow-sm p-1.5 rounded-lg group-hover/item:shadow-md transition-all">
                <LogOut className="size-4" aria-hidden="true" />
              </div>
              Log out
            </button>
          </form>
        </div>
      </div>
    </details>
  );
}

function AuthActions({ user }) {
  if (user) {
    return <UserDropdown user={user} />;
  }

  return (
    <div className="flex items-center gap-3">
      <Link 
        href="/login"
        className="text-sm font-bold text-foreground hover:text-blue-600 transition-colors px-2 py-1"
      >
        Log in
      </Link>
      <Button asChild size="sm" className="rounded-full px-5 font-bold shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300">
        <Link href="/register">Join now</Link>
      </Button>
    </div>
  );
}

function MobileMenu({ user }) {
  const role = getUserRole(user);
  const roleDetails = ROLE_DETAILS[role] || ROLE_DETAILS.user;

  return (
    <details className="group md:hidden [&>summary::-webkit-details-marker]:hidden">
      <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm text-foreground transition-all duration-300 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Menu className="size-5 group-open:hidden transition-transform duration-300" aria-hidden="true" />
        <X className="hidden size-5 group-open:block transition-transform duration-300 rotate-90 group-open:rotate-0" aria-hidden="true" />
        <span className="sr-only">Toggle navigation menu</span>
      </summary>

      <div className="fixed inset-x-4 top-[4.5rem] rounded-3xl border border-border/50 bg-background/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-4 fade-in duration-300">
        <div className="p-6">
          <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
            <NavLinks user={user} />
          </nav>

          <div className="mt-8 border-t border-border/50 pt-6">
            {user ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-2xl bg-muted/50 p-4 border border-border/50">
                  <Avatar user={user} className="size-12 shadow-sm" />
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-foreground">
                      {user?.name || "GestorFitness member"}
                    </p>
                    <p className="truncate text-sm font-medium text-muted-foreground">
                      {roleDetails.label} account
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  {roleDetails.links.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                <form action={signOutAction} className="pt-2">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 transition-colors hover:bg-red-100 dark:hover:bg-red-900/40"
                  >
                    <LogOut className="size-5" aria-hidden="true" />
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid gap-3">
                <Button asChild variant="outline" className="w-full h-12 rounded-xl text-base font-bold">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700">
                  <Link href="/register">Create account</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Overlay */}
      <div className="fixed inset-0 top-[4rem] z-40 bg-background/40 backdrop-blur-sm hidden group-open:block animate-in fade-in duration-300" />
    </details>
  );
}

export async function Navbar() {
  const user = await getUserSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        <BrandLink />

        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2" aria-label="Primary navigation">
          <NavLinks user={user} />
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/classes"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Search classes"
          >
            <Search className="size-5" aria-hidden="true" />
          </Link>
          <AuthActions user={user} />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          {user ? <Avatar user={user} className="size-9" /> : null}
          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  );
}
