"use client";

import { Calendar, CreditCard, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-3xl">
        <div className="relative w-full container">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by email or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-2xl border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-blue-500/50"
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
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs h-12">Transaction ID</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">User Email</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Amount</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Date</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((tx) => (
              <TableRow key={tx.id} className="border-border/50 group hover:bg-muted/20 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                      <CreditCard className="size-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-foreground">{tx.id}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="font-medium text-muted-foreground">{tx.email}</span>
                </TableCell>
                <TableCell className="py-4">
                  <span className="inline-flex items-center gap-1 font-bold text-foreground text-base">
                    {tx.amount}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">{tx.date}</span>
                    <span className="text-xs text-muted-foreground">{tx.time}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-right">
                  <Badge variant="success">
                    {tx.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
