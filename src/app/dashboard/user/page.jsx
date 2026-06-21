import { getUserSession } from "@/lib/core/session";
import UserDashboardClient from "./UserDashboardClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

async function getUserData(userId) {
  if (!userId) {
    return { bookings: [], favorites: [], classes: [] };
  }
  try {
    const [bookingsRes, favoritesRes, classesRes] = await Promise.all([
      fetch(`${baseUrl}/bookings/user/${userId}`, { cache: "no-store" }),
      fetch(`${baseUrl}/favorite-classes/${userId}`, { cache: "no-store" }),
      fetch(`${baseUrl}/classes`, { cache: "no-store" }),
    ]);

    const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
    const favoritesData = favoritesRes.ok ? await favoritesRes.json() : [];
    const classesDataRes = classesRes.ok ? await classesRes.json() : { classes: [] };

    const bookings = Array.isArray(bookingsData) ? bookingsData : [];
    const favorites = Array.isArray(favoritesData) ? favoritesData : [];
    const classes = Array.isArray(classesDataRes) ? classesDataRes : (classesDataRes.classes || []);

    return { bookings, favorites, classes };
  } catch (error) {
    console.error("Failed to fetch user data", error);
    return { bookings: [], favorites: [], classes: [] };
  }
}

export default async function UserDashboardPage() {
  const user = await getUserSession();
  const firstName = user?.name?.split(" ")[0] || "Member";
  const userId = user?.id || user?._id;

  const { bookings, favorites, classes } = await getUserData(userId);

  const totalBookings = bookings.length;
  const totalFavorites = favorites.length;
  
  // Calculate total spent
  const totalSpent = bookings.reduce((sum, booking) => {
    const price = booking.price || booking.classDetails?.price || 0;
    return sum + Number(price);
  }, 0);

  const upcomingClasses = bookings.slice(0, 10);
  const favoriteClasses = classes.filter(c => favorites.includes(c._id));

  return (
    <UserDashboardClient
      firstName={firstName}
      totalBookings={totalBookings}
      totalFavorites={totalFavorites}
      totalSpent={totalSpent}
      upcomingClasses={upcomingClasses}
      favoriteClasses={favoriteClasses}
      bookings={bookings}
    />
  );
}
