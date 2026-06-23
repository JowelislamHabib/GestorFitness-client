"use client";

import { Calendar, CheckCircle2, DollarSign, MessageCircle, Search, Users, SortDesc, Target } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

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

export function StudentsTable({ students = [], title, description, role = "trainer" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest", "oldest"

  // Calculate statistics
  const totalStudents = students.length;
  const paidEnrollments = students.filter(s => s.status === "paid").length;
  
  const uniqueClassesCount = new Set(
    students.map(s => s.title || s.classDetails?.title).filter(Boolean)
  ).size;

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();
    const nameMatch = student.userName?.toLowerCase().includes(search) || student.userEmail?.toLowerCase().includes(search);
    return nameMatch;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (sortOrder === "newest") return dateB - dateA;
    if (sortOrder === "oldest") return dateA - dateB;
    return 0;
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
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-3xl">
        <div className="relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-2xl border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-red-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-11 w-[160px] rounded-2xl border-border/50 bg-background/50 text-sm font-medium focus:ring-red-500/50">
              <div className="flex items-center gap-2">
                <SortDesc className="size-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Sort by Date" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Students Table */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs h-12">Student</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Enrolled Class</TableHead>
              {role === "admin" && (
                <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Trainer</TableHead>
              )}
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Payment Status</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Registration Date</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</TableHead>
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
                      className="border-border/50 group hover:bg-muted/20 even:bg-muted/10 transition-colors"
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
                            <Badge variant="success" className="gap-1.5">
                              <CheckCircle2 className="size-3.5" /> Paid
                            </Badge>
                          ) : (
                            <Badge variant="warning" className="gap-1.5">
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
                          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white transition-all"
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
      </Card>
    </div>
  );
}
