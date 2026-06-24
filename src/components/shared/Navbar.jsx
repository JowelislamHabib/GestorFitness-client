import {
    Activity,
    CalendarCheck2,
    ChevronDown,
    Dumbbell,
    GraduationCap,
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
    WalletCards,
    BadgeCheck,
    X,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { auth } from "@/lib/auth";
import { getUserSession } from "@/lib/core/session";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationsDropdown } from "@/components/dashboardPage/shared/NotificationsDropdown";

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
      { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Transactions", href: "/dashboard/admin/transactions", icon: WalletCards },
      { name: "Users", href: "/dashboard/admin/users", icon: Users },
      { name: "All Students", href: "/dashboard/admin/students", icon: GraduationCap },
      { name: "Trainer Management", href: "/dashboard/admin/trainers", icon: BadgeCheck },
      { name: "Classes", href: "/dashboard/admin/classes", icon: Dumbbell },
      { name: "Forum", href: "/dashboard/admin/forum-posts", icon: MessageSquareText },
      { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
    ],
  },
  trainer: {
    label: "Trainer",
    eyebrow: "Coach workspace",
    icon: Sparkles,
    links: [
      { name: "Dashboard", href: "/dashboard/trainer", icon: LayoutDashboard },
      { name: "Transactions", href: "/dashboard/trainer/transactions", icon: WalletCards },
      { name: "My Classes", href: "/dashboard/trainer/classes", icon: Dumbbell },
      { name: "Students", href: "/dashboard/trainer/students", icon: GraduationCap },
      { name: "My Posts", href: "/dashboard/trainer/forum-posts", icon: MessageSquareText },
      { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
    ],
  },
  user: {
    label: "Member",
    eyebrow: "Member profile",
    icon: UserRound,
    links: [
      { name: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
      { name: "Booked Classes", href: "/dashboard/user/booked-classes", icon: CalendarCheck2 },
      { name: "Transactions", href: "/dashboard/user/transactions", icon: WalletCards },
      { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
      { name: "Apply Trainer", href: "/dashboard/user/apply-trainer", icon: ShieldCheck },
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

import Logo from "@/components/shared/Logo";
import LogoutButton from "@/components/shared/LogoutButton";
import { MobileNavLinks, DesktopNavLinks } from "@/components/shared/ClientNav";

function BrandLink() {
  return (
    <Link
      href="/"
      className="flex items-center outline-none group"
    >
      <Logo className="h-8 sm:h-9 w-auto transition-transform duration-300 group-hover:scale-105" />
    </Link>
  );
}

function Avatar({ user, className = "size-9" }) {
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border-2 border-background bg-muted rounded-md text-sm font-bold text-muted-foreground shadow-sm ${className}`}
      aria-hidden="true"
    >
      {user?.image ? (
        <Image
          src={user?.image}
          alt=""
          className="size-full object-cover"
          referrerPolicy="no-referrer"
          width={48}
          height={48}
        />
      ) : (
        getInitials(user)
      )}
    </span>
  );
}

function NavLinks({ user }) {
  return <DesktopNavLinks links={NAV_LINKS} user={user} />;
}

function UserDropdown({ user }) {
  const role = getUserRole(user);
  const roleDetails = ROLE_DETAILS[role] || ROLE_DETAILS.user;
  const RoleIcon = roleDetails.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border/50 bg-card/50 hover:bg-card px-1.5 py-1.5 pr-4 shadow-sm backdrop-blur-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-card data-[state=open]:ring-2 data-[state=open]:ring-ring group">
          <Avatar user={user} className="size-9" />
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
            className="size-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180 ml-1"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 rounded-lg border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl p-0 overflow-hidden">
        <DropdownMenuLabel className="p-4 bg-gradient-to-br from-red-600/5 to-transparent">
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
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-red-600/10 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400">
            <RoleIcon className="size-3.5" aria-hidden="true" />
            {roleDetails.eyebrow}
          </div>
        </DropdownMenuLabel>

        <div className="p-2 space-y-1 border-t border-border/50">
          {roleDetails.links.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem asChild key={item.href} className="rounded-md px-3 py-2.5 text-sm font-semibold cursor-pointer group/item hover:bg-muted/50 hover:pl-4 transition-all">
                <Link href={item.href} className="flex items-center gap-3">
                  <div className="bg-background shadow-sm p-1.5 rounded-md group-hover/item:text-red-600 group-hover/item:shadow-md transition-all">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  {item.name}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="m-0 bg-border/50" />

        <div className="p-2 bg-muted/20">
          <DropdownMenuItem asChild className="rounded-md px-3 py-2.5 text-sm font-semibold cursor-pointer group/item hover:bg-red-500/10 hover:pl-4 transition-all focus:bg-red-500/10 text-red-600 dark:text-red-400 focus:text-red-600">
            <LogoutButton className="w-full" iconClassName="size-4" />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
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
        className="text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition-colors px-2 py-1"
      >
        Log in
      </Link>
      <Button asChild size="sm" className="px-5 font-bold shadow-lg shadow-red-600/20 bg-red-600 hover:bg-red-700 hover:-translate-y-0.5 transition-all duration-300 text-white dark:bg-red-600 dark:hover:bg-red-700">
        <Link href="/register">Join now</Link>
      </Button>
    </div>
  );
}

function MobileMenu({ user }) {
  const role = getUserRole(user);
  const roleDetails = ROLE_DETAILS[role] || ROLE_DETAILS.user;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-border/50 bg-card/50 backdrop-blur-sm text-foreground transition-all duration-300 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/20 md:hidden">
          <Menu className="size-5" aria-hidden="true" />
          <span className="sr-only">Toggle navigation menu</span>
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[350px] flex flex-col p-0 border-l border-border bg-background" showCloseButton={true}>
        <div className="flex-1 overflow-y-auto p-6">
          <SheetHeader className="mb-8 text-left">
            <SheetTitle className="font-heading text-2xl font-bold uppercase tracking-wide">Menu</SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            <MobileNavLinks links={NAV_LINKS} user={user} />
          </nav>

          <div className="mt-8 border-t border-border/50 pt-8">
            {user ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-md bg-zinc-100 dark:bg-zinc-900/50 p-4 border border-border/50">
                  <Avatar user={user} className="size-12 shadow-sm" />
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-neutral-900 dark:text-white">
                      {user?.name || "Member"}
                    </p>
                    <p className="truncate text-sm font-medium text-neutral-500">
                      {roleDetails.label} account
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 px-4 pb-2">{roleDetails.eyebrow}</p>
                  {roleDetails.links.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold text-neutral-500 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Icon className="size-4" aria-hidden="true" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-border/50">
                  <LogoutButton 
                    className="flex w-full items-center justify-center gap-3 rounded-md px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" 
                    iconClassName="size-5"
                    showIcon={true}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button asChild variant="outline" className="w-full h-12 text-base font-bold">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700 shadow-sm shadow-red-600/20">
                  <Link href="/register">Create account</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export async function Navbar() {
  const user = await getUserSession();

  return (
    <header className="global-site-navbar sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        <div className="flex flex-1 items-center justify-start">
          <BrandLink />
        </div>

        <nav className="hidden lg:flex items-center gap-2 justify-center shrink-0" aria-label="Primary navigation">
          <NavLinks user={user} />
        </nav>

        <div className="hidden lg:flex flex-1 items-center justify-end gap-4">
          <Link
            href="/classes"
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Search classes"
          >
            <Search className="size-4.5" aria-hidden="true" />
          </Link>
          {user && <NotificationsDropdown />}
          <ThemeToggle />
          <AuthActions user={user} />
        </div>

        <div className="flex lg:hidden flex-1 items-center justify-end gap-3">
          {user && <NotificationsDropdown />}
          <ThemeToggle />
          {user ? <Avatar user={user} className="size-9" /> : null}
          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  );
}
