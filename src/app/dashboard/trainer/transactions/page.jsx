"use client";

import { useState, useEffect } from "react";
import { TransactionsTable } from "@/components/dashboardPage/shared/TransactionsTable";
import { GlobalLoading } from "@/components/dashboardPage/shared/GlobalLoading";
import { getTrainerBookings, getUserBookings } from "@/lib/api/bookings";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function TrainerTransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      Promise.all([
        getTrainerBookings(session.user.id),
        getUserBookings(session.user.id)
      ])
        .then(([sales, purchases]) => {
          const allSales = Array.isArray(sales) ? sales : [];
          const allPurchases = Array.isArray(purchases) ? purchases : [];
          
          const allTx = [...allSales, ...allPurchases];
          const uniqueTx = Array.from(new Map(allTx.map(tx => [tx._id || tx.sessionId, tx])).values());
          
          uniqueTx.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setTransactions(uniqueTx);
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
      role="trainer"
      currentUserEmail={session?.user?.email}
      transactions={transactions} 
      title="Sales & Purchases"
      description="View the payment history of your sold and booked classes."
    />
  );
}
