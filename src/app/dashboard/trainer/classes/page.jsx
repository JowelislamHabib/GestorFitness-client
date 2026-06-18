"use client";

import { CheckCircle2, Clock, Dumbbell, Edit3, PlusCircle, Search, SlidersHorizontal, Users } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const mockClasses = [
  { id: 1, name: "Power Circuit", category: "Strength", price: "$49", duration: "60m", students: 28, status: "Approved" },
  { id: 2, name: "Mobility Reset Lab", category: "Flexibility", price: "$35", duration: "45m", students: 18, status: "Pending" },
  { id: 3, name: "Weekend Cardio Rush", category: "Cardio", price: "$28", duration: "45m", students: 32, status: "Approved" },
];

export default function TrainerClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">My Classes</h1>
          <p className="mt-1 text-muted-foreground">
            Manage the classes you have created and track their approval status.
          </p>
        </div>
        <Link 
          href="/dashboard/trainer/classes/new"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="size-4" />
          Add New Class
        </Link>
      </section>

      {/* Filters & Search */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-2xl border border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="h-11 rounded-2xl border border-border/50 bg-background/50 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending</option>
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
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Price & Time</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Students</th>
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
                        <p className="font-bold text-foreground text-base leading-tight">{cls.name}</p>
                        <span className="inline-flex rounded-md bg-muted px-1.5 py-0.5 text-[10px] mt-1.5 font-bold uppercase tracking-wider text-muted-foreground">
                          {cls.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-foreground">{cls.price}</span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <Clock className="size-3.5 text-blue-500" />
                        {cls.duration}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="size-4" />
                      <span className="font-bold text-foreground">{cls.students}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {cls.status === "Approved" ? (
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      ) : (
                        <div className="size-2 rounded-full bg-orange-500 ml-1 mr-0.5" />
                      )}
                      <span className={`font-bold ${
                        cls.status === "Approved" ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"
                      }`}>
                        {cls.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/10 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Edit3 className="size-3.5" /> Manage
                    </button>
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
