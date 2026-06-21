"use client";

import { Calendar, CreditCard, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

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

export function TransactionsTable({ transactions, title, description }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter((tx) => {
    const search = searchTerm.toLowerCase();
    const idMatch = tx.transactionId?.toLowerCase().includes(search) || tx.sessionId?.toLowerCase().includes(search);
    const emailMatch = tx.userEmail?.toLowerCase().includes(search);
    const titleMatch = tx.title?.toLowerCase().includes(search);
    return idMatch || emailMatch || titleMatch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">{title}</h1>
          <p className="mt-1 text-muted-foreground">
            {description}
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-3xl">
        <div className="relative w-full container">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by email, ID, or class title..."
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
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs h-12">Class & ID</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">User Email</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Amount</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Date</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => {
                const dateObj = new Date(tx.createdAt);
                const formattedDate = format(dateObj, "dd MMM yyyy, hh:mm a");
                const [datePart, timePart] = formattedDate.split(", ");
                
                return (
                  <TableRow key={tx._id || tx.sessionId} className="border-border/50 group hover:bg-muted/20 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                          <CreditCard className="size-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-foreground">{tx.title || "Class"}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">ID: {tx.transactionId || tx.sessionId || "N/A"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-medium text-muted-foreground">{tx.userEmail || "N/A"}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="inline-flex items-center gap-1 font-bold text-foreground text-base">
                        ${tx.price?.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">{datePart}</span>
                        <span className="text-xs text-muted-foreground">{timePart}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0">
                        {tx.status || "Paid"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
