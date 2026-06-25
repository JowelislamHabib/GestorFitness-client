"use client";

import { Calendar, CheckCircle2, DollarSign, MessageCircle, Search, Users, SortDesc, Target } from "lucide-react";
import { format } from "date-fns";
import { PaginationControls } from "@/components/shared/PaginationControls";

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

import { StatCard } from "@/components/ui/stat-card";

function getInitials(name, email) {
  const label = name?.trim() || email?.split("@")[0] || "US";
  const parts = label.split(" ").filter(Boolean);
  if (parts.length < 2) return (parts[0] || "US").slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function StudentsTable({ 
  students = [], 
  stats = {}, 
  title, 
  description, 
  role = "trainer",
  search = "",
  onSearchChange = () => {},
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {}
}) {
  // Use backend statistics
  const totalStudents = stats.totalStudents || 0;
  const paidEnrollments = stats.paidEnrollments || 0;
  const uniqueClassesCount = stats.uniqueClassesCount || 0;

  const sortedStudents = students;

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

      {/* Statistics Section */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          variant="horizontal"
          title="Total Students"
          value={totalStudents}
          description="Enrolled Members"
          icon={Users}
          color="blue"
        />

        <StatCard
          variant="horizontal"
          title="Paid Enrollments"
          value={paidEnrollments}
          description="Active Members"
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          variant="horizontal"
          title="Classes with Students"
          value={uniqueClassesCount}
          description="Unique Classes"
          icon={Target}
          color="purple"
        />
      </section>

      {/* Filters & Search */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-3xl">
        <div className="relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search students by name or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 w-full rounded-2xl border-slate-200 dark:border-slate-800 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-red-500/50"
          />
        </div>
      </Card>

      {/* Students Table */}
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs h-12">Student</TableHead>
              <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Enrolled Class</TableHead>
              {role === "admin" && (
                <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Trainer</TableHead>
              )}
              <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Payment Status</TableHead>
              <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Registration Date</TableHead>
              <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {sortedStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={role === "admin" ? 6 : 5} className="px-6 py-8 text-center text-muted-foreground">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedStudents.map((student) => {
                  const dateObj = new Date(student.createdAt);
                  const formattedDate = format(dateObj, "MMM dd, yyyy");
                  
                  return (
                    <TableRow 
                      key={student._id || student.sessionId} 
                      className="border-slate-200 dark:border-slate-800 group hover:bg-muted/20 even:bg-muted/10 transition-colors"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-600 font-bold group-hover:scale-105 transition-transform overflow-hidden">
                            {student.userImage ? (
                              <img src={student.userImage} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              getInitials(student.userName, student.userEmail)
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{student.userName || "Unknown Student"}</p>
                            <p className="text-xs text-muted-foreground">{student.userEmail || "No email"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="font-semibold text-foreground bg-muted/50 px-3 py-1 rounded-lg">
                          {student.title || student.classDetails?.title || "Unknown Class"}
                        </span>
                      </TableCell>
                      {role === "admin" && (
                        <TableCell className="px-6 py-4">
                          <span className="font-medium text-foreground">
                            {student.classDetails?.trainerName || student.trainerName || "Unknown Trainer"}
                          </span>
                        </TableCell>
                      )}
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {student.status === "paid" ? (
                            <Badge className="gap-1.5 uppercase shadow-none border-0 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/30">
                              <CheckCircle2 className="size-3.5" /> Paid
                            </Badge>
                          ) : (
                            <Badge className="gap-1.5 uppercase shadow-none border-0 bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/30">
                              <DollarSign className="size-3.5" /> {student.status || "Pending"}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                          <Calendar className="size-4" />
                          {formattedDate}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <a 
                          href={`mailto:${student.userEmail}`}
                          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
                          title="Message Student"
                        >
                          <MessageCircle className="size-3.5" /> Message
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
        </Table>
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </Card>
    </div>
  );
}
