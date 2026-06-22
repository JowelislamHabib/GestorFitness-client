"use client";

import { Calendar, CreditCard, Search, DollarSign, Users, Activity } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { AnimatedCounter } from "@/components/ui/animated-counter";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TransactionsTable({ transactions = [], title, description, role = "admin", currentUserEmail }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("30"); // "7", "30", "all"

  const filteredTransactions = transactions.filter((tx) => {
    // Search filter
    const search = searchTerm.toLowerCase();
    const idMatch = tx.transactionId?.toLowerCase().includes(search) || tx.sessionId?.toLowerCase().includes(search);
    const emailMatch = tx.userEmail?.toLowerCase().includes(search);
    const titleMatch = tx.title?.toLowerCase().includes(search);
    const matchesSearch = idMatch || emailMatch || titleMatch;

    // Date filter
    let matchesDate = true;
    if (dateFilter !== "all" && tx.createdAt) {
      const txDate = new Date(tx.createdAt);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateFilter));
      matchesDate = txDate >= cutoffDate;
    }

    return matchesSearch && matchesDate;
  });

  const isIncome = (tx) => {
    if (role === "user") return false;
    return !currentUserEmail || tx.userEmail !== currentUserEmail;
  };
  const isExpense = (tx) => {
    if (role === "user") return true;
    return currentUserEmail && tx.userEmail === currentUserEmail;
  };

  const incomeTxs = transactions.filter(isIncome);
  const expenseTxs = transactions.filter(isExpense);

  const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.price || 0), 0);
  const totalEarnings = incomeTxs.reduce((sum, tx) => sum + (tx.price || 0), 0);
  const totalSpent = expenseTxs.reduce((sum, tx) => sum + (tx.price || 0), 0);
  
  const totalTransactions = transactions.length;
  const uniqueUsers = new Set(transactions.map(tx => tx.userEmail).filter(Boolean)).size;
  const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const avgClassPrice = expenseTxs.length > 0 ? totalSpent / expenseTxs.length : 0;

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

      {/* Summary Statistics */}
      <section className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-${role === "user" ? "3" : "4"}`}>
        <article className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-emerald-500/10 to-card/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col p-6 items-center justify-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
            <DollarSign className="size-6" />
          </div>
          <div className="text-4xl font-heading font-bold text-foreground flex items-center justify-center">
            $<AnimatedCounter value={role === "user" ? totalSpent : role === "trainer" ? totalEarnings : totalRevenue} />
          </div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
            {role === "admin" ? "Total Revenue" : role === "trainer" ? "Total Earnings" : "Total Spent"}
          </p>
        </article>
        
        <article className={`group relative overflow-hidden rounded-xl border border-border/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col p-6 items-center justify-center text-center ${role === "trainer" ? "bg-gradient-to-br from-red-500/10 to-card/50" : "bg-gradient-to-br from-blue-500/10 to-card/50"}`}>
          <div className={`flex size-14 items-center justify-center rounded-full mb-3 group-hover:scale-110 transition-transform ${role === "trainer" ? "bg-gradient-to-br from-red-500/20 to-red-500/5 text-red-500" : "bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-500"}`}>
            {role === "trainer" ? <DollarSign className="size-6" /> : <CreditCard className="size-6" />}
          </div>
          <div className="text-4xl font-heading font-bold text-foreground flex items-center justify-center">
            {role === "trainer" ? <>$<AnimatedCounter value={totalSpent} /></> : <AnimatedCounter value={role === "user" ? expenseTxs.length : totalTransactions} />}
          </div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
            {role === "admin" ? "Transactions" : role === "trainer" ? "Total Spent" : "Classes Booked"}
          </p>
        </article>

        {role !== "user" && (
          <article className={`group relative overflow-hidden rounded-xl border border-border/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col p-6 items-center justify-center text-center ${role === "trainer" ? "bg-gradient-to-br from-blue-500/10 to-card/50" : "bg-gradient-to-br from-purple-500/10 to-card/50"}`}>
            <div className={`flex size-14 items-center justify-center rounded-full mb-3 group-hover:scale-110 transition-transform ${role === "trainer" ? "bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-500" : "bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-500"}`}>
              {role === "trainer" ? <CreditCard className="size-6" /> : <Users className="size-6" />}
            </div>
            <p className="text-4xl font-heading font-bold text-foreground">
              <AnimatedCounter value={role === "trainer" ? incomeTxs.length : uniqueUsers} />
            </p>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              {role === "admin" ? "Unique Users" : "Classes Sold"}
            </p>
          </article>
        )}

        <article className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-orange-500/10 to-card/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col p-6 items-center justify-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/5 text-orange-500 mb-3 group-hover:scale-110 transition-transform">
            <Activity className="size-6" />
          </div>
          <div className="text-4xl font-heading font-bold text-foreground flex items-center justify-center">
            {role === "trainer" ? (
               <AnimatedCounter value={expenseTxs.length} />
            ) : (
               <>$<AnimatedCounter value={role === "user" ? avgClassPrice : avgTransaction} /></>
            )}
          </div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
            {role === "admin" ? "Avg. Transaction" : role === "trainer" ? "Classes Booked" : "Avg. Class Price"}
          </p>
        </article>
      </section>

      {/* Filters & Search */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-xl">
        <div className="relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by email, ID, or class title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-xl border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-blue-500/50 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="h-11 w-[160px] rounded-xl border-border/50 bg-background/50 text-sm font-medium focus:ring-blue-500/50">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <SelectValue placeholder="Date Range" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50 bg-background/95 backdrop-blur-xl">
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs h-12">Class & ID</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">User Email</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Amount</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Date</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Status</TableHead>
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
                  <TableRow key={tx._id || tx.sessionId} className="border-border/50 group hover:bg-muted/20 even:bg-muted/10 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${isExpense(tx) ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                          <CreditCard className="size-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-foreground">{tx.title || "Class"}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">ID: {tx.transactionId || tx.sessionId || "N/A"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="font-medium text-muted-foreground">{tx.userEmail || "N/A"}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 font-bold text-base ${isExpense(tx) ? "text-red-500" : "text-emerald-500"}`}>
                        {isExpense(tx) ? "-" : "+"}${tx.price?.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">{datePart}</span>
                        <span className="text-xs text-muted-foreground">{timePart}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Badge variant="secondary" className="uppercase text-emerald-600 dark:text-emerald-500">
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
