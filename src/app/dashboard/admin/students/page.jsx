"use client";

import { useState, useEffect } from "react";
import { StudentsTable } from "@/components/dashboardPage/shared/StudentsTable";
import { getAllBookings } from "@/lib/api/bookings";
import { useSession } from "@/lib/auth-client";
import DashboardLoading from "@/components/dashboardPage/shared/DashboardLoading";

export default function AdminStudentsPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      getAllBookings()
        .then((data) => {
          if (Array.isArray(data)) setStudents(data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else if (session === null) {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) return <DashboardLoading />;

  return (
    <StudentsTable
      students={students}
      title="All Enrolled Students"
      description="View all members enrolled across all classes on the platform."
      role="admin"
    />
  );
}
