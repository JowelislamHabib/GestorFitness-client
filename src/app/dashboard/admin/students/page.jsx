"use client";

import { useState, useEffect } from "react";
import { StudentsTable } from "@/components/dashboardPage/shared/StudentsTable";
import { getAllBookings } from "@/lib/api/bookings";
import { useSession } from "@/lib/auth-client";
import GlobalLoading from "@/components/shared/GlobalLoading";

export default function AdminStudentsPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  
  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (session?.user?.id) {
      setIsLoading(true);
      getAllBookings({ page, limit: 10, search: debouncedSearch })
        .then((response) => {
          if (response && response.data) {
            setStudents(response.data);
            setStats(response.stats || {});
            setTotalPages(response.totalPages || 1);
          } else if (Array.isArray(response)) {
            setStudents(response);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else if (session === null) {
      setIsLoading(false);
    }
  }, [session, page, debouncedSearch]);

  if (isLoading && students.length === 0) return <GlobalLoading message="Fetching students..." />;

  return (
    <StudentsTable
      students={students}
      stats={stats}
      title="All Enrolled Students"
      description="View all members enrolled across all classes on the platform."
      role="admin"
      search={search}
      onSearchChange={setSearch}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}
