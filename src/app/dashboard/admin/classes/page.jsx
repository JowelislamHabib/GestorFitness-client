"use client";

import { Check, CheckCircle2, Clock, Dumbbell, Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useState } from "react";

const mockClasses = [
  { id: 1, name: "Functional Strength Lab", trainer: "Maya Calder", category: "Strength", duration: "60m", price: "$49", status: "Pending" },
  { id: 2, name: "Recovery Flow Reset", trainer: "Leila Bennett", category: "Mobility", duration: "45m", price: "$36", status: "Approved" },
  { id: 3, name: "HIIT Engine Core", trainer: "Khalid Mercer", category: "Cardio", duration: "45m", price: "$28", status: "Pending" },
  { id: 4, name: "Advanced Powerlifting", trainer: "David Miller", category: "Strength", duration: "90m", price: "$65", status: "Rejected" },
  { id: 5, name: "Sunrise Yoga Vinyasa", trainer: "Jessica Alba", category: "Flexibility", duration: "60m", price: "$30", status: "Approved" },
];

export default function ManageClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Manage Classes</h1>
          <p className="mt-1 text-muted-foreground">
            Approve, reject, or delete fitness classes submitted by trainers.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search classes by name or trainer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-2xl border border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="h-11 rounded-2xl border border-border/50 bg-background/50 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <button className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50 hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Classes Table */}
      <section className="overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Class Details</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Category</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Price / Time</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockClasses.map((cls) => (
                <tr key={cls.id} className="group hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 font-bold group-hover:scale-105 transition-transform">
                        <Dumbbell className="size-6" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-base">{cls.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">by {cls.trainer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-md bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {cls.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-foreground">{cls.price}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                        <Clock className="size-3" /> {cls.duration}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {cls.status === "Approved" && <CheckCircle2 className="size-4 text-emerald-500" />}
                      {cls.status === "Rejected" && <X className="size-4 text-red-500" />}
                      {cls.status === "Pending" && <div className="size-2 rounded-full bg-orange-500 ml-1 mr-0.5" />}
                      <span className={`font-bold ${
                        cls.status === "Approved" ? "text-emerald-600 dark:text-emerald-400" :
                        cls.status === "Rejected" ? "text-red-600 dark:text-red-400" :
                        "text-orange-600 dark:text-orange-400"
                      }`}>
                        {cls.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {cls.status === "Pending" && (
                        <>
                          <button 
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"
                            aria-label="Approve"
                          >
                            <Check className="size-3.5" /> Approve
                          </button>
                          <button 
                            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-500 hover:text-white transition-all"
                            aria-label="Reject"
                          >
                            <X className="size-3.5" /> Reject
                          </button>
                        </>
                      )}
                      
                      <button 
                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500 hover:text-white transition-all"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
