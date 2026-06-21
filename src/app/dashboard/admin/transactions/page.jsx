"use client";

import { useState, useEffect } from "react";
import { TransactionsTable } from "@/components/dashboardPage/shared/TransactionsTable";
import { getAllBookings } from "@/lib/api/bookings";
import { toast } from "sonner";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllBookings()
      .then((data) => {
        if (Array.isArray(data)) {
          setTransactions(data);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load transactions.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <TransactionsTable 
      role="admin"
      transactions={transactions} 
      title="All Transactions"
      description="Read-only Stripe payment history across the platform."
    />
  );
}
