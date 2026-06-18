"use client";

import { Calendar, CreditCard, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const mockTransactions = [
  { id: "pi_3Rr8xA4B6k8d91Qf", email: "amina.c@example.com", amount: "$49.00", date: "18 Jun 2026", time: "14:30", status: "Succeeded" },
  { id: "pi_3Rr7na8D1l2m43Zx", email: "samira.vale@example.com", amount: "$36.00", date: "18 Jun 2026", time: "09:15", status: "Succeeded" },
  { id: "pi_3Rr5YZ2R8p7t19Dn", email: "idris.h@example.com", amount: "$54.00", date: "17 Jun 2026", time: "18:45", status: "Succeeded" },
  { id: "pi_3Rq9Xm4B6k8d92Pw", email: "david.m@example.com", amount: "$65.00", date: "16 Jun 2026", time: "08:00", status: "Succeeded" },
  { id: "pi_3Rq7Kb8D1l2m45Ty", email: "jess.a@example.com", amount: "$30.00", date: "15 Jun 2026", time: "12:10", status: "Succeeded" },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Transactions</h1>
          <p className="mt-1 text-muted-foreground">
            Read-only Stripe payment history across the platform.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by email or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-2xl border border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-11 items-center gap-2 rounded-2xl border border-border/50 bg-background/50 px-4 text-sm font-medium hover:bg-muted transition-colors">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="hidden sm:inline">Last 30 Days</span>
          </button>
          <button className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50 hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Transactions Table */}
      <section className="overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Transaction ID</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">User Email</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Amount</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                        <CreditCard className="size-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-foreground">{tx.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-muted-foreground">{tx.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 font-bold text-foreground text-base">
                      {tx.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">{tx.date}</span>
                      <span className="text-xs text-muted-foreground">{tx.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex rounded-md bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
