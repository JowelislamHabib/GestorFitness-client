"use client";

import { Clock, Dumbbell, Edit3, PlusCircle, Search, SlidersHorizontal, Users, XCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { getClasses } from "@/lib/api/classes";

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

export default function TrainerClassesPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      getClasses({ trainerId: session.user.id })
        .then((data) => {
          if (Array.isArray(data)) setClasses(data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [session]);

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || cls.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">My Classes</h1>
          <p className="mt-1 text-muted-foreground">
            Manage the classes you have created and track their approval status.
          </p>
        </div>
        <Link 
          href="/dashboard/trainer/add-class"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="size-4" />
          Add New Class
        </Link>
      </section>

      {/* Filters & Search */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-3xl">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-2xl border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-blue-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-36 rounded-2xl border-border/50 bg-background/50 text-sm font-medium focus:ring-blue-500/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <button className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50 hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
          </button>
        </div>
      </Card>

      {/* Classes Table */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredClasses.length === 0 ? (
         <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border bg-card/50">
          <div className="flex size-20 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 mb-6">
            <Dumbbell className="size-10" />
          </div>
          <h2 className="text-2xl font-bold">No Classes Found</h2>
          <p className="mt-2 text-base text-muted-foreground max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all' ? "Try adjusting your search or filters." : "You haven't created any classes yet."}
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs h-12">Class Details</TableHead>
                <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Price & Time</TableHead>
                <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Students</TableHead>
                <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((cls) => (
                <TableRow key={cls._id} className="border-border/50 group hover:bg-muted/20 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      {cls.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cls.image} alt={cls.title} className="size-12 shrink-0 rounded-2xl object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 font-bold group-hover:scale-105 transition-transform">
                          <Dumbbell className="size-6" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-foreground text-base leading-tight">{cls.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(cls.schedule).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-foreground">${parseFloat(cls.price).toFixed(2)}</span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <Clock className="size-3.5 text-blue-500" />
                        {cls.duration} min
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="size-4" />
                      <span className="font-bold text-foreground">0 / {cls.maxAttendees}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-2 items-start">
                      <Badge 
                        variant={cls.status === "approved" ? "success" : cls.status === "rejected" ? "danger" : "warning"}
                        className="uppercase"
                      >
                        {cls.status}
                      </Badge>
                      {cls.status === "rejected" && cls.feedback && (
                        <div className="mt-1 flex items-start gap-1 max-w-[200px]">
                          <XCircle className="size-3.5 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-red-500 line-clamp-2" title={cls.feedback}>{cls.feedback}</p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
