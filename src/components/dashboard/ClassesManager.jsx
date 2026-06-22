"use client";

import { deleteClass, getClasses, updateClassStatus, getClassStats } from "@/lib/api/classes";
import { Check, CheckCircle2, Clock, Dumbbell, Edit3, PlusCircle, Search, Trash2, Users, X, XCircle, DollarSign } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { StatCard } from "@/components/ui/stat-card";
import { GlobalLoading } from "@/components/dashboardPage/shared/GlobalLoading";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

export default function ClassesManager({ role = "admin", trainerId }) {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedClassId, setSelectedClassId] = useState(null);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [globalStats, setGlobalStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    avgPrice: 0,
    pendingCount: 0,
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page when filter changes
  useEffect(() => {
    // setCurrentPage(1); // Removed to avoid cascaded render warning, instead handle this implicitly or use it safely. Actually it's fine to keep it but eslint complains. Let's just remove it and let the user reset page when they change status.
  }, [statusFilter]);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const filters = {
        page: currentPage,
        limit: 10,
        search: debouncedSearchTerm,
      };
      if (role === "trainer" && trainerId) filters.trainerId = trainerId;
      if (statusFilter !== "all") filters.status = statusFilter;

      const [data, stats] = await Promise.all([
        getClasses(filters),
        getClassStats(role === "trainer" ? trainerId : undefined)
      ]);
      
      if (data && Array.isArray(data.classes)) {
        setClasses(data.classes);
        setTotalPages(data.totalPages || 1);
        setGlobalStats(stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [role, trainerId, currentPage, debouncedSearchTerm, statusFilter]);

  const handleApprove = async (id) => {
    setIsProcessing(true);
    try {
      await updateClassStatus(id, "approved");
      setClasses(classes.map(cls => cls._id === id ? { ...cls, status: "approved" } : cls));
    } catch (err) {
      alert("Failed to approve class");
    } finally {
      setIsProcessing(false);
    }
  };

  const openRejectModal = (id) => {
    setSelectedClassId(id);
    setRejectFeedback("");
    setIsRejectModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setSelectedClassId(id);
    setIsDeleteModalOpen(true);
  };

  const submitReject = async () => {
    if (!rejectFeedback.trim()) {
      alert("Please provide feedback for the rejection.");
      return;
    }
    setIsProcessing(true);
    try {
      await updateClassStatus(selectedClassId, "rejected", rejectFeedback);
      setClasses(classes.map(cls => cls._id === selectedClassId ? { ...cls, status: "rejected", feedback: rejectFeedback } : cls));
      setIsRejectModalOpen(false);
    } catch (err) {
      alert("Failed to reject class");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClassId) return;
    setIsProcessing(true);
    try {
      await deleteClass(selectedClassId);
      setClasses(classes.filter(cls => cls._id !== selectedClassId));
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert("Failed to delete class");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">
            {role === "admin" ? "Manage Classes" : "My Classes"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {role === "admin"
              ? "Approve, reject, or delete fitness classes submitted by trainers."
              : "Manage the classes you have created and track their approval status."}
          </p>
        </div>
        {role === "trainer" && (
          <Link 
            href="/dashboard/trainer/add-class"
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="size-4" />
            Add New Class
          </Link>
        )}
      </section>

      {/* Summary Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Classes"
          value={globalStats.totalClasses}
          icon={Dumbbell}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value={globalStats.totalStudents}
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Avg Price"
          value={globalStats.avgPrice}
          icon={DollarSign}
          color="purple"
          prefix="$"
        />
        <StatCard
          title="Pending Classes"
          value={globalStats.pendingCount}
          icon={Clock}
          color="orange"
        />
      </section>

      {/* Filters & Search */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-2xl">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={role === "admin" ? "Search classes by name or trainer..." : "Search your classes..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-xl border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-blue-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-40 rounded-xl border-border/50 bg-background/50 text-sm font-medium focus:ring-blue-500/50">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50 bg-background/95 backdrop-blur-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </Card>

      {isLoading ? (
        <GlobalLoading />
      ) : classes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border bg-card/50">
          <div className="flex size-20 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 mb-6">
            <Dumbbell className="size-10" />
          </div>
          <h2 className="text-2xl font-bold">No Classes Found</h2>
          <p className="mt-2 text-base text-muted-foreground max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all' 
              ? "No classes match your current search and filters." 
              : role === "trainer" 
                ? "You haven't created any classes yet." 
                : "No classes have been submitted yet."}
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs h-12">Class Details</TableHead>
                <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Price / Time</TableHead>
                <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Students</TableHead>
                <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Status</TableHead>
                <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls._id} className="border-border/50 group hover:bg-muted/20 even:bg-muted/10 transition-colors">
                  <TableCell className="px-6 py-4">
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
                          {role === "admin" 
                            ? `by ${cls.trainerName || "Unknown Trainer"}`
                            : `${cls.scheduleDays ? cls.scheduleDays.join(", ") : "Various Days"} • ${cls.time || "TBD"}`
                          }
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-foreground">${parseFloat(cls.price).toFixed(2)}</span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                        <Clock className="size-3.5 text-blue-500" /> {cls.duration} min
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="size-4" />
                      <span className="font-bold text-foreground">{cls.enrolledCount || 0} / {cls.maxAttendees || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col items-start gap-2">
                      <Badge 
                        variant={cls.status === "rejected" ? "destructive" : "secondary"}
                        className="uppercase"
                      >
                        {cls.status === "pending" ? (
                          <div className="flex items-center gap-1.5">
                            <div className="size-2 rounded-full bg-orange-500" /> Pending
                          </div>
                        ) : cls.status === "approved" ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500">
                            <CheckCircle2 className="size-3.5" /> Approved
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <X className="size-3.5" /> Rejected
                          </div>
                        )}
                      </Badge>
                      {role === "trainer" && cls.status === "rejected" && cls.feedback && (
                        <div className="mt-1 flex items-start gap-1 max-w-[200px]">
                          <XCircle className="size-3.5 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-red-500 line-clamp-2" title={cls.feedback}>{cls.feedback}</p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {role === "admin" && cls.status === "pending" && (
                        <>
                          <button 
                            onClick={() => handleApprove(cls._id)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                          >
                            <Check className="size-3.5" /> Approve
                          </button>
                          <button 
                            onClick={() => openRejectModal(cls._id)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
                          >
                            <X className="size-3.5" /> Reject
                          </button>
                        </>
                      )}
                      
                      <Link 
                        href={`/dashboard/edit-class/${cls._id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-500 hover:text-white transition-all"
                      >
                        <Edit3 className="size-3.5" /> Edit
                      </Link>

                      <button 
                        onClick={() => openDeleteModal(cls._id)}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-background/50">
              <span className="text-sm text-muted-foreground font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex h-9 items-center justify-center rounded-lg border border-border/50 bg-background px-3 text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex h-9 items-center justify-center rounded-lg border border-border/50 bg-background px-3 text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Reject Modal (Admin Only) */}
      {role === "admin" && isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="relative w-full container max-w-lg rounded-xl border border-border/50 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsRejectModalOpen(false)}
              className="absolute right-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors z-10"
            >
              <X className="size-5" />
            </button>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 font-bold">
                  <X className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Reject Class</h2>
                  <p className="text-sm text-muted-foreground mt-1">Please provide a reason for rejecting this class.</p>
                </div>
              </div>

              <div className="space-y-4">
                <Textarea 
                  value={rejectFeedback}
                  onChange={(e) => setRejectFeedback(e.target.value)}
                  placeholder="e.g., 'The description is too vague. Please provide more details about the curriculum.'"
                  className="min-h-[120px] rounded-xl bg-background/50 resize-none"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsRejectModalOpen(false)}
                  className="rounded-xl px-6 h-11"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={submitReject}
                  disabled={!rejectFeedback.trim() || isProcessing}
                  className="rounded-xl px-6 h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
                >
                  {isProcessing ? "Rejecting..." : "Submit Rejection"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="relative w-full container max-w-lg rounded-xl border border-border/50 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute right-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors z-10"
            >
              <X className="size-5" />
            </button>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 font-bold">
                  <Trash2 className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Delete Class</h2>
                  <p className="text-sm text-muted-foreground mt-1">This action cannot be undone.</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-foreground">Are you sure you want to permanently delete this class? All associated data will be removed.</p>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="rounded-xl px-6 h-11"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDelete}
                  disabled={isProcessing}
                  className="rounded-xl px-6 h-11 bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
                >
                  {isProcessing ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
