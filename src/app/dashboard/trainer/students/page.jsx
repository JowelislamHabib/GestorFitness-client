"use client";

import { Calendar, CheckCircle2, DollarSign, MessageCircle, Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
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
import { getTrainerBookings } from "@/lib/api/bookings";
import { useSession } from "@/lib/auth-client";

function getInitials(name, email) {
  const label = name?.trim() || email?.split("@")[0] || "US";
  const parts = label.split(" ").filter(Boolean);
  if (parts.length < 2) return (parts[0] || "US").slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function TrainerStudentsPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      getTrainerBookings(session.user.id)
        .then((data) => {
          if (Array.isArray(data)) setStudents(data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else if (session === null) {
      setIsLoading(false);
    }
  }, [session]);

  // Extract unique class names for the filter dropdown
  const uniqueClasses = Array.from(new Set(students.map(s => s.title || s.classDetails?.title).filter(Boolean)));

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();
    const nameMatch = student.userName?.toLowerCase().includes(search) || student.userEmail?.toLowerCase().includes(search);
    
    const className = student.title || student.classDetails?.title;
    const classMatch = classFilter === "all" || className === classFilter;
    
    return nameMatch && classMatch;
  });

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
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="h-11 w-48 rounded-2xl border-border/50 bg-background/50 text-sm font-medium focus:ring-blue-500/50">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
              <SelectItem value="all">All Classes</SelectItem>
              {uniqueClasses.map(cls => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => {
                  const dateObj = new Date(student.createdAt);
                  const formattedDate = format(dateObj, "MMM dd, yyyy");
                  
                  return (
                    <TableRow key={student._id || student.sessionId} className="border-border/50 group hover:bg-muted/20 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 font-bold group-hover:scale-105 transition-transform overflow-hidden">
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
                      <TableCell className="py-4">
                        <span className="font-semibold text-foreground bg-muted/50 px-3 py-1 rounded-lg">
                          {student.title || student.classDetails?.title || "Unknown Class"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
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
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                          <Calendar className="size-4" />
                          {formattedDate}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <a 
                          href={`mailto:${student.userEmail}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/10 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
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
