"use client";

import { Clock, Eye, ShieldAlert, UserMinus, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockTrainers = [
  { id: 1, name: "Leila Bennett", email: "leila@example.com", specialty: "Yoga & Mobility", experience: "5 Years", status: "Pending", applied: "2 hours ago" },
  { id: 2, name: "Khalid Mercer", email: "khalid.m@fitness.com", specialty: "Strength & Conditioning", experience: "8 Years", status: "Pending", applied: "Yesterday" },
  { id: 3, name: "Maya Calder", email: "maya.c@example.com", specialty: "HIIT & Cardio", experience: "3 Years", status: "Active", applied: "Oct 12, 2025" },
  { id: 4, name: "David Miller", email: "david.m@example.com", specialty: "Powerlifting", experience: "10 Years", status: "Active", applied: "Sep 04, 2025" },
];

export default function ManageTrainersPage() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const filteredTrainers = mockTrainers.filter((t) => t.status === activeTab);

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
      </section>

      {/* Trainers Table */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs h-12">Trainer</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Specialty</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Experience</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Time / Date</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrainers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No {activeTab.toLowerCase()} trainers found.
                </TableCell>
              </TableRow>
            )}
            {filteredTrainers.map((trainer) => (
              <TableRow key={trainer.id} className="border-border/50 group hover:bg-muted/20 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-bold transition-transform group-hover:scale-105 ${
                      trainer.status === "Pending" ? "bg-orange-500/10 text-orange-600" : "bg-emerald-500/10 text-emerald-600"
                    }`}>
                      {trainer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{trainer.name}</p>
                      <p className="text-xs text-muted-foreground">{trainer.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold">
                    {trainer.specialty}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 font-medium text-foreground">
                  {trainer.experience}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <Clock className="size-3.5" />
                    {trainer.applied}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-right">
                  {trainer.status === "Pending" ? (
                    <button 
                      onClick={() => setSelectedTrainer(trainer)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/10 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Eye className="size-3.5" /> Review Details
                    </button>
                  ) : (
                    <button className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500 hover:text-white transition-all">
                      <UserMinus className="size-3.5" /> Demote to User
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Mock Review Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full container rounded-3xl border border-border/50 bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedTrainer(null)}
              className="absolute right-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="size-5" />
            </button>
            
            <h2 className="font-heading text-2xl font-bold text-foreground">Review Application</h2>
            <p className="text-sm text-muted-foreground mt-1">Review {selectedTrainer.name}'s trainer application details.</p>

            <div className="mt-6 space-y-4 rounded-2xl bg-muted/30 p-4 border border-border/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Experience</p>
                  <p className="font-semibold text-foreground mt-1">{selectedTrainer.experience}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Specialty</p>
                  <p className="font-semibold text-foreground mt-1">{selectedTrainer.specialty}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Admin Feedback</label>
              <textarea 
                rows={3}
                placeholder="Write your feedback here (required for rejections)..."
                className="mt-2 w-full rounded-2xl border border-border/50 bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
              />
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setSelectedTrainer(null)}
                className="flex-1 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-sm font-bold text-red-600 hover:bg-red-500 hover:text-white transition-all"
              >
                Reject Application
              </button>
              <button 
                onClick={() => setSelectedTrainer(null)}
                className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all"
              >
                Approve as Trainer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
