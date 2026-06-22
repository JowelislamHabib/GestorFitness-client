"use client";

import { useState, useEffect } from "react";
import { StudentsTable } from "@/components/dashboardPage/shared/StudentsTable";
import { getTrainerBookings } from "@/lib/api/bookings";
import { useSession } from "@/lib/auth-client";
import { GlobalLoading } from "@/components/dashboardPage/shared/GlobalLoading";

export default function TrainerStudentsPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      getTrainerBookings(session.user.id)
        .then((data) => {
          if (Array.isArray(data)) setStudents(data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else if (session === null) {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) return <GlobalLoading />;

  return (
    <StudentsTable
      students={students}
      title="My Students"
      description="View members who have enrolled in your classes."
      role="trainer"
    />
  );
}
