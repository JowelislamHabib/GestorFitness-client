"use client";

import { CalendarClock, Dumbbell, ExternalLink, Search, SlidersHorizontal, UserRound } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const mockBookedClasses = [
  { id: 1, name: "Strength Foundations", trainer: "Ariana Cole", schedule: "Mon, Wed", time: "7:00 AM - 8:00 AM", category: "Strength" },
  { id: 2, name: "Mobility Reset", trainer: "Rahim Noor", schedule: "Tue, Thu", time: "6:30 PM - 7:30 PM", category: "Mobility" },
  { id: 3, name: "Cardio Burn Circuit", trainer: "Leila Bennett", schedule: "Saturday", time: "9:30 AM - 10:30 AM", category: "Cardio" },
];

export default function BookedClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">My Booked Classes</h1>
          <p className="mt-1 text-muted-foreground">
            Classes you have successfully registered and paid for.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm">
        <div className="relative w-full container">
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
            <option>All Categories</option>
            <option>Strength</option>
            <option>Cardio</option>
            <option>Mobility</option>
          </select>
          <button className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50 hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Booked Classes Table */}
      <section className="overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Class Name</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Trainer</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Schedule</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockBookedClasses.map((cls) => (
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
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UserRound className="size-4" />
                      <span className="font-semibold text-foreground">{cls.trainer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 font-bold text-foreground">
                        <CalendarClock className="size-4 text-blue-500" />
                        {cls.schedule}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground pl-5">{cls.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/classes/${cls.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/10 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <ExternalLink className="size-3.5" /> View Details
                    </Link>
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
