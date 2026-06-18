"use client";

import { Calendar, CheckCircle2, DollarSign, MessageCircle, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

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

const mockStudents = [
  { id: 1, name: "Amina Chowdhury", email: "amina.c@example.com", className: "Power Circuit", payment: "Paid", date: "Oct 12, 2025", initials: "AC" },
  { id: 2, name: "Rafi Noor", email: "rafi.n@example.com", className: "Mobility Reset Lab", payment: "Paid", date: "Oct 10, 2025", initials: "RN" },
  { id: 3, name: "Leila Karim", email: "leila.k@example.com", className: "Weekend Cardio Rush", payment: "Pending", date: "Today", initials: "LK" },
  { id: 4, name: "David Miller", email: "david.m@example.com", className: "Power Circuit", payment: "Paid", date: "Yesterday", initials: "DM" },
];

export default function TrainerStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">My Enrolled Students</h1>
          <p className="mt-1 text-muted-foreground">
            View members enrolled in your classes and their payment statuses.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-3xl">
        <div className="relative w-full container">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-2xl border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-blue-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-11 w-48 rounded-2xl border-border/50 bg-background/50 text-sm font-medium focus:ring-blue-500/50">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="power">Power Circuit</SelectItem>
              <SelectItem value="mobility">Mobility Reset Lab</SelectItem>
              <SelectItem value="cardio">Weekend Cardio Rush</SelectItem>
            </SelectContent>
          </Select>
          <button className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50 hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </Card>

      {/* Students Table */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs h-12">Student</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Enrolled Class</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Payment Status</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Registration Date</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStudents.map((student) => (
              <TableRow key={student.id} className="border-border/50 group hover:bg-muted/20 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 font-bold group-hover:scale-105 transition-transform">
                      {student.initials}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="font-semibold text-foreground bg-muted/50 px-3 py-1 rounded-lg">
                    {student.className}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-1.5">
                    {student.payment === "Paid" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0 text-[10px] font-bold uppercase tracking-wider rounded-md py-1">
                        <CheckCircle2 className="size-3.5 mr-1" /> {student.payment}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-500/20 bg-orange-500/5 shadow-none text-[10px] font-bold uppercase tracking-wider rounded-md py-1">
                        <DollarSign className="size-3.5 mr-1" /> {student.payment}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Calendar className="size-4" />
                    {student.date}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-right">
                  <button 
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/10 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                    title="Message Student"
                  >
                    <MessageCircle className="size-3.5" /> Message
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
