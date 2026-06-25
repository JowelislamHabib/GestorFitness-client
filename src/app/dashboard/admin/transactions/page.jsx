"use client";

import { useState, useEffect } from "react";
import { TransactionsTable } from "@/components/dashboardPage/shared/TransactionsTable";
import GlobalLoading from "@/components/shared/GlobalLoading";
import { getAllBookings } from "@/lib/api/bookings";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function TransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("30");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (session?.user?.id) {
      setIsLoading(true);
      getAllBookings({ page, limit: 10, search: debouncedSearch, dateFilter })
        .then((response) => {
          if (response && response.data) {
            setTransactions(response.data);
            setStats(response.stats || {});
            setTotalPages(response.totalPages || 1);
          } else if (Array.isArray(response)) {
            setTransactions(response);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to load transactions.");
        })
        .finally(() => setIsLoading(false));
    } else if (session === null) {
      setIsLoading(false);
    }
  }, [session, page, debouncedSearch, dateFilter]);

  if (isLoading && transactions.length === 0) {
    return <GlobalLoading message="Fetching transactions..." />;
  }

  return (
    <TransactionsTable 
      role="admin"
      transactions={transactions} 
      stats={stats}
      title="All Transactions"
      description="Read-only Stripe payment history across the platform."
      search={search}
      onSearchChange={setSearch}
      dateFilter={dateFilter}
      onDateFilterChange={setDateFilter}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}
