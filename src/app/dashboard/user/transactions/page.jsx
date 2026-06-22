"use client";

import { useState, useEffect } from "react";
import { TransactionsTable } from "@/components/dashboardPage/shared/TransactionsTable";
import { GlobalLoading } from "@/components/dashboardPage/shared/GlobalLoading";
import { getUserBookings } from "@/lib/api/bookings";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function UserTransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      getUserBookings(session.user.id)
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
    } else if (session === null) {
       setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <TransactionsTable 
      role="user"
      transactions={transactions} 
      title="My Transactions"
      description="View the payment history of classes you have booked."
    />
  );
}
