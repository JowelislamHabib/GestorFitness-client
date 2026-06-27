"use client";

import { getTrainerApplications, updateTrainerApplicationStatus } from "@/lib/api/trainerApplications";
import { getUsersList, toggleTrainerFeature, demoteTrainer } from "@/lib/api/users";
import { AlertTriangle, Clock, Eye, MessageSquareWarning, UserMinus, X, Users, UserCog, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { StatCard } from "@/components/ui/stat-card";
import GlobalLoading from "@/components/shared/GlobalLoading";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PaginationControls } from "@/components/shared/PaginationControls";

export default function ManageTrainersPage() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [demoteTarget, setDemoteTarget] = useState(null);
  
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ totalApps: 0, pending: 0, rejected: 0, activeTrainers: 0 });
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const fetchActiveTab = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "Active" || activeTab === "Featured") {
        const featuredParam = activeTab === "Featured" ? "true" : undefined;
        const res = await getUsersList({ role: "trainer", page, limit: 10, featured: featuredParam });
        if (res && res.data) {
          setData(res.data);
          setTotalPages(res.totalPages || 1);
          setStats(prev => ({ ...prev, activeTrainers: res.stats?.totalTrainers || 0 }));
        }
      } else {
        const status = activeTab.toLowerCase();
        const res = await getTrainerApplications(status, null, { page, limit: 10 });
        if (res && res.data) {
          setData(res.data);
          setTotalPages(res.totalPages || 1);
          setStats(prev => ({
            ...prev,
            totalApps: res.stats?.totalApps || prev.totalApps,
            pending: res.stats?.pending || prev.pending,
            rejected: res.stats?.rejected || prev.rejected
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveTab();
  }, [activeTab, page]);

  useEffect(() => {
    // Initial fetch for global stats that aren't on the first active tab
    getUsersList({ role: "trainer", page: 1, limit: 1 }).then(res => {
      if (res && res.stats) {
        setStats(prev => ({ ...prev, activeTrainers: res.stats.totalTrainers }));
      }
    }).catch(() => {});
    
    getTrainerApplications("pending", null, { page: 1, limit: 1 }).then(res => {
      if (res && res.stats) {
        setStats(prev => ({
          ...prev,
          totalApps: res.stats.totalApps,
          pending: res.stats.pending,
          rejected: res.stats.rejected
        }));
      }
    }).catch(() => {});
  }, []);

  const handleAction = async (status) => {
    if (!selectedTrainer) return;
    try {
      const id = selectedTrainer.id || selectedTrainer._id;
      await updateTrainerApplicationStatus(id, status, feedback);
      setSelectedTrainer(null);
      setFeedback("");
      
      // Update global stats optimistic
      if (status === "approved") {
        setStats(prev => ({ ...prev, pending: prev.pending - 1, activeTrainers: prev.activeTrainers + 1 }));
      } else if (status === "rejected") {
        setStats(prev => ({ ...prev, pending: prev.pending - 1, rejected: prev.rejected + 1 }));
      }
      
      fetchActiveTab();
    } catch (error) {
      console.error(`Failed to ${status} application:`, error);
    }
  };

  const handleDemote = async () => {
    if (!demoteTarget) return;
    const id = demoteTarget._id || demoteTarget.id;
    try {
      await demoteTrainer(id);
      setStats(prev => ({ ...prev, activeTrainers: prev.activeTrainers - 1 }));
      setDemoteTarget(null);
      fetchActiveTab();
    } catch (error) {
      console.error("Failed to demote trainer:", error);
    }
  };

  const handleToggleFeature = async (id, currentStatus) => {
    try {
      await toggleTrainerFeature(id, !currentStatus);
      fetchActiveTab(); // Refresh to update list and state
    } catch (error) {
      console.error("Failed to toggle feature status:", error);
    }
  };

  if (isLoading && data.length === 0) return <GlobalLoading message="Fetching trainers..." />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Trainer Queue & Management</h1>
          <p className="mt-1 text-muted-foreground">
            Review new applications and manage existing trainers on the platform.
          </p>
        </div>
      </section>

      {/* Summary Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Apps"
          value={stats.totalApps}
          icon={Users}
          color="blue"
        />
        
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="orange"
        />

        <StatCard
          title="Active Trainers"
          value={stats.activeTrainers}
          icon={UserCog}
          color="emerald"
        />

        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={UserMinus}
          color="red"
        />
      </section>

      {/* Tabs */}
      <section className="flex flex-wrap gap-2 p-1.5 bg-muted/30 border border-border/50 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("Pending")}
          className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${
            activeTab === "Pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-900 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Pending Applications
        </button>
        <button
          onClick={() => setActiveTab("Active")}
          className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${
            activeTab === "Active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-900 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Active Trainers
        </button>
        <button
          onClick={() => setActiveTab("Featured")}
          className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${
            activeTab === "Featured" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 ring-1 ring-purple-200 dark:ring-purple-900 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Featured
        </button>
        <button
          onClick={() => setActiveTab("Rejected")}
          className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${
            activeTab === "Rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-900 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Rejected Logs
        </button>
      </section>

      {/* Trainers Table */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs h-12">Trainer</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Specialty</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Experience</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Date</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No {activeTab.toLowerCase()} records found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => {
                const isUser = activeTab === "Active" || activeTab === "Featured";
                const id = isUser ? (item._id || item.id) : item._id;
                const status = isUser ? "approved" : item.status;
                const date = isUser ? item.createdAt : item.createdAt;

                const specialty = item.specialty || "General";
                const experience = item.experience || 0;

                return (
                <TableRow key={id} className="border-border/50 group hover:bg-muted/20 even:bg-muted/10 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className={`size-10 rounded-xl transition-transform group-hover:scale-105 `}>
                        <AvatarImage src={item.image} />
                        <AvatarFallback className={`rounded-xl font-bold ${
                          status === "pending" ? "bg-orange-500/10 text-orange-600" : 
                          status === "approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                        }`}>
                          {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-foreground">{item.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{item.email || "No email"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="secondary" className="capitalize">
                      {specialty}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium text-foreground">
                    {experience} Years
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <Clock className="size-3.5" />
                      {new Date(date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {status === "pending" ? (
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedTrainer(item)}
                        className="bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Eye className="size-4 mr-1.5" /> Review Details
                      </Button>
                    ) : status === "approved" ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeature(id, item.isFeatured)}
                          className={`bg-transparent hover:bg-transparent border-transparent hover:border-border ${item.isFeatured ? 'text-amber-500 hover:text-amber-600' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          <Star className={`size-4 mr-1.5 ${item.isFeatured ? 'fill-current' : ''}`} /> 
                          {item.isFeatured ? 'Featured' : 'Feature'}
                        </Button>
                        <Button 
                          variant="destructive"
                          size="sm"
                          onClick={() => setDemoteTarget(item)}
                          className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white"
                        >
                          <UserMinus className="size-4 mr-1.5" /> Demote
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedTrainer(item)}
                        className="bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background"
                      >
                        <MessageSquareWarning className="size-4 mr-1.5" /> View Feedback
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )})
            )}
          </TableBody>
        </Table>
        <PaginationControls 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Card>

      {/* Review Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="relative w-full container max-w-lg rounded-xl border border-border/50 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedTrainer(null)}
              className="absolute right-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors z-10"
            >
              <X className="size-5" />
            </button>
            
            <CardHeader>
              <CardTitle className="text-2xl font-bold font-heading">
                {selectedTrainer.status === "rejected" ? "Rejected Application Log" : "Review Application"}
              </CardTitle>
              <CardDescription>
                {selectedTrainer.status === "rejected" 
                  ? `Viewing rejection details for ${selectedTrainer.name}.` 
                  : `Review ${selectedTrainer.name}'s trainer application details.`}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4 rounded-2xl bg-muted/30 p-4 border border-border/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Experience</p>
                    <p className="font-semibold text-foreground mt-1">{selectedTrainer.experience} Years</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Specialty</p>
                    <p className="font-semibold text-foreground mt-1 capitalize">{selectedTrainer.specialty}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio / Qualifications</p>
                  <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{selectedTrainer.bio}</p>
                </div>
              </div>

              {selectedTrainer.status === "pending" ? (
                <div className="mt-6">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Admin Feedback</Label>
                  <Textarea 
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Write your feedback here (required for rejections)..."
                    className="mt-2 rounded-2xl bg-background text-sm resize-none"
                  />
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">Feedback Provided</h4>
                  <p className="text-sm font-medium text-foreground whitespace-pre-wrap">
                    {selectedTrainer.feedback || "No feedback recorded."}
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-3">
              {selectedTrainer.status === "pending" ? (
                <>
                  <Button 
                    onClick={() => handleAction("rejected")}
                    disabled={!feedback.trim()}
                    variant="destructive"
                    size="lg"
                    className="flex-1 rounded-xl text-sm font-bold"
                  >
                    Reject Application
                  </Button>
                  <Button 
                    onClick={() => handleAction("approved")}
                    size="lg"
                    className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-sm font-bold shadow-lg shadow-emerald-500/20"
                  >
                    Approve as Trainer
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setSelectedTrainer(null)}
                  variant="outline"
                  size="lg"
                  className="w-full rounded-xl"
                >
                  Close
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Demote Confirmation Modal */}
      {demoteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="relative w-full max-w-md rounded-xl border border-border/50 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setDemoteTarget(null)}
              className="absolute right-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors z-10"
            >
              <X className="size-5" />
            </button>

            <CardHeader className="pb-2">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="size-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-bold font-heading text-center">Demote Trainer</CardTitle>
              <CardDescription className="text-center">
                Are you sure you want to demote <span className="font-semibold text-foreground">{demoteTarget.name}</span> back to a regular user? This will revoke their trainer privileges.
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex gap-3 pt-4">
              <Button 
                onClick={() => setDemoteTarget(null)}
                variant="outline"
                size="lg"
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDemote}
                variant="destructive"
                size="lg"
                className="flex-1 rounded-xl font-bold"
              >
                <UserMinus className="size-4 mr-1.5" /> Confirm Demote
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
