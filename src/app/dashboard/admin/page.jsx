import { getUserSession } from "@/lib/core/session";
import AdminDashboardClient from "./AdminDashboardClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

async function getAdminData() {
  try {
    const [usersRes, classesRes, pendingTrainersRes, bookingsRes, forumPostsRes] = await Promise.all([
      fetch(`${baseUrl}/users`, { cache: "no-store" }),
      fetch(`${baseUrl}/classes`, { cache: "no-store" }),
      fetch(`${baseUrl}/trainer-applications?status=pending`, { cache: "no-store" }),
      fetch(`${baseUrl}/bookings`, { cache: "no-store" }),
      fetch(`${baseUrl}/forum-posts?limit=1`, { cache: "no-store" })
    ]);

    const users = usersRes.ok ? await usersRes.json() : [];
    const classes = classesRes.ok ? await classesRes.json() : [];
    const pendingTrainers = pendingTrainersRes.ok ? await pendingTrainersRes.json() : [];
    const bookings = bookingsRes.ok ? await bookingsRes.json() : [];
    const forumPostsData = forumPostsRes.ok ? await forumPostsRes.json() : { total: 0 };

    return { users, classes, pendingTrainers, bookings, forumPostsTotal: forumPostsData.total };
  } catch (error) {
    console.error("Failed to fetch admin data", error);
    return { users: [], classes: [], pendingTrainers: [], bookings: [], forumPostsTotal: 0 };
  }
}

export default async function AdminDashboardPage() {
  const user = await getUserSession();
  const firstName = user?.name?.split(" ")[0] || "Admin";

  const { users, classes, pendingTrainers, bookings, forumPostsTotal } = await getAdminData();

  const totalUsers = users.length;
  const activeClasses = classes.filter((c) => c.status === "approved").length;
  const pendingClasses = classes.filter((c) => c.status === "pending");
  const totalBookings = bookings.length;
  const recentTransactions = bookings.slice(0, 5);

  // Process registrations for the last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const registrationActivity = last7Days.map((date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const count = users.filter((u) => {
      if (!u.createdAt) return false;
      const createdAt = new Date(u.createdAt);
      return createdAt >= date && createdAt < nextDay;
    }).length;

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      count,
    };
  });

  // Calculate new users this month
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const newUsersThisMonth = users.filter((u) => {
    if (!u.createdAt) return false;
    return new Date(u.createdAt) >= thisMonth;
  }).length;

  const userRolesData = [
    { role: "Admin", count: users.filter(u => u.role === "admin").length, className: "fill-blue-500" },
    { role: "Trainer", count: users.filter(u => u.role === "trainer").length, className: "fill-emerald-500" },
    { role: "User", count: users.filter(u => u.role === "user" || !u.role).length, className: "fill-purple-500" },
  ];
  const userRolesConfig = { count: { label: "Users" } };

  const classStatusData = [
    { status: "Active", count: activeClasses, className: "fill-emerald-500" },
    { status: "Pending", count: classes.filter(c => c.status === "pending").length, className: "fill-orange-500" },
    { status: "Rejected", count: classes.filter(c => c.status === "rejected").length, className: "fill-rose-500" },
  ];
  const classStatusConfig = { count: { label: "Classes" } };

  return (
    <AdminDashboardClient
      firstName={firstName}
      pendingTrainers={pendingTrainers}
      pendingClasses={pendingClasses}
      recentTransactions={recentTransactions}
      totalUsers={totalUsers}
      activeClasses={activeClasses}
      totalBookings={totalBookings}
      forumPostsTotal={forumPostsTotal}
      registrationActivity={registrationActivity}
      userRolesData={userRolesData}
      classStatusData={classStatusData}
    />
  );
}
