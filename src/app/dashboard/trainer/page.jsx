import { getUserSession, getUserToken } from "@/lib/core/session";
import TrainerDashboardClient from "./TrainerDashboardClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

async function getTrainerData(userId, token) {
  if (!userId) {
    return { classes: [], bookings: [] };
  }
  try {
    const headers = token ? { authorization: `Bearer ${token}` } : {};
    const [classesRes, bookingsRes] = await Promise.all([
      fetch(`${baseUrl}/classes?trainerId=${userId}`, { headers, cache: "no-store" }),
      fetch(`${baseUrl}/bookings/trainer/${userId}`, { headers, cache: "no-store" })
    ]);

    const classesData = classesRes.ok ? await classesRes.json() : { classes: [] };
    const classes = Array.isArray(classesData) ? classesData : (classesData.classes || []);
    
    const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
    const bookings = Array.isArray(bookingsData) ? bookingsData : [];

    return { classes, bookings };
  } catch (error) {
    console.error("Failed to fetch trainer data", error);
    return { classes: [], bookings: [] };
  }
}

export default async function TrainerDashboardPage() {
  const user = await getUserSession();
  const token = await getUserToken();
  const firstName = user?.name?.split(" ")[0] || "Trainer";
  const userId = user?.id || user?._id;

  const { classes, bookings } = await getTrainerData(userId, token);

  const totalClasses = classes.length;
  const activeStudents = bookings.length;
  
  const pendingClassesCount = classes.filter(c => c.status === "pending").length;

  // Calculate total earnings
  const totalEarnings = bookings.reduce((sum, booking) => {
    const price = booking.price || booking.classDetails?.price || 0;
    return sum + Number(price);
  }, 0);

  return (
    <TrainerDashboardClient
      firstName={firstName}
      totalClasses={totalClasses}
      activeStudents={activeStudents}
      totalEarnings={totalEarnings}
      pendingClassesCount={pendingClassesCount}
      classes={classes}
      bookings={bookings}
    />
  );
}
