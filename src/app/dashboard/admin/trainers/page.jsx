"use client";

import { getTrainerApplications, updateTrainerApplicationStatus } from "@/lib/api/trainerApplications";
import { getUsersList } from "@/lib/api/users";
import { Clock, Eye, MessageSquareWarning, UserMinus, X, Users, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { GlobalLoading } from "@/components/dashboardPage/shared/GlobalLoading";

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

export default function ManageTrainersPage() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeTrainers, setActiveTrainers] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const appData = await getTrainerApplications();
      if (Array.isArray(appData)) {
        setApplications(appData);
      }
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`);
        if (res.ok) {
          const allUsers = await res.json();
          setActiveTrainers(allUsers.filter(u => u.role === "trainer"));
        } else {
          throw new Error("Fallback to better-auth");
        }
      } catch (err) {
        const userData = await getUsersList();
        if (userData?.users) {
          setActiveTrainers(userData.users.filter(u => u.role === "trainer"));
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (status) => {
    if (!selectedTrainer) return;
    try {
      await updateTrainerApplicationStatus(selectedTrainer._id, status, feedback);
      setSelectedTrainer(null);
      setFeedback("");
      fetchApplications();
    } catch (error) {
      console.error(`Failed to ${status} application:`, error);
    }
  };

  const handleDemote = async (id) => {
    try {
      await updateTrainerApplicationStatus(id, "rejected", "Demoted by Admin");
      fetchApplications();
    } catch (error) {
      console.error("Failed to demote trainer:", error);
    }
  };

  const filteredList = activeTab === "Active" 
    ? activeTrainers 
    : applications.filter((t) => {
        if (activeTab === "Pending") return t.status === "pending";
        if (activeTab === "Rejected") return t.status === "rejected";
        return false;
      });

  if (isLoading) return <GlobalLoading />;

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
        <article className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-blue-500/10 to-card/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col p-6 items-center justify-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-500 mb-3 group-hover:scale-110 transition-transform">
            <Users className="size-6" />
          </div>
          <p className="text-4xl font-heading font-bold text-foreground">
            <AnimatedCounter value={applications.length} />
          </p>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">Total Apps</p>
        </article>
        
        <article className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-orange-500/10 to-card/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col p-6 items-center justify-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/5 text-orange-500 mb-3 group-hover:scale-110 transition-transform">
            <Clock className="size-6" />
          </div>
          <p className="text-4xl font-heading font-bold text-foreground">
            <AnimatedCounter value={applications.filter(a => a.status === "pending").length} />
          </p>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">Pending</p>
        </article>

        <article className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-emerald-500/10 to-card/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col p-6 items-center justify-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
            <UserCog className="size-6" />
          </div>
          <p className="text-4xl font-heading font-bold text-foreground">
            <AnimatedCounter value={activeTrainers.length} />
          </p>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">Active Trainers</p>
        </article>

        <article className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-red-500/10 to-card/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col p-6 items-center justify-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-red-500/5 text-red-500 mb-3 group-hover:scale-110 transition-transform">
            <UserMinus className="size-6" />
          </div>
          <p className="text-4xl font-heading font-bold text-foreground">
            <AnimatedCounter value={applications.filter(a => a.status === "rejected").length} />
          </p>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">Rejected</p>
        </article>
      </section>

      {/* Tabs */}
      <section className="flex gap-4 border-b border-border/50 pb-px">
        <button
          onClick={() => setActiveTab("Pending")}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeTab === "Pending" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending Applications
          {activeTab === "Pending" && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab("Active")}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeTab === "Active" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Active Trainers
          {activeTab === "Active" && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab("Rejected")}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeTab === "Rejected" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Rejected Logs
          {activeTab === "Rejected" && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600 rounded-t-full" />}
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
            {filteredList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No {activeTab.toLowerCase()} records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredList.map((item) => {
                const isUser = activeTab === "Active";
                const id = isUser ? (item._id || item.id) : item._id;
                const status = isUser ? "approved" : item.status;
                const date = isUser ? item.createdAt : item.createdAt;

                // For robustness, find by either exact string match or stringified ObjectId
                const relatedApp = isUser ? applications.find(app => String(app.userId) === String(id) && app.status === "approved") : null;
                const specialty = isUser ? (item.specialty || relatedApp?.specialty || "General") : (item.specialty || "General");
                const experience = isUser ? (item.experience || relatedApp?.experience || 0) : (item.experience || 0);

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
                        className="bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        <Eye className="size-4 mr-1.5" /> Review Details
                      </Button>
                    ) : status === "approved" ? (
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDemote(item.id || item._id)}
                        className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white"
                      >
                        <UserMinus className="size-4 mr-1.5" /> Demote to User
                      </Button>
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
    </div>
  );
}
