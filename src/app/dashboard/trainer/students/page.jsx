"use client";

import { Calendar, CheckCircle2, DollarSign, MessageCircle, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const mockStudents = [
  { id: 1, name: "Amina Chowdhury", email: "amina.c@example.com", className: "Power Circuit", payment: "Paid", date: "Oct 12, 2025", initials: "AC" },
  { id: 2, name: "Rafi Noor", email: "rafi.n@example.com", className: "Mobility Reset Lab", payment: "Paid", date: "Oct 10, 2025", initials: "RN" },
  { id: 3, name: "Leila Karim", email: "leila.k@example.com", className: "Weekend Cardio Rush", payment: "Pending", date: "Today", initials: "LK" },
  { id: 4, name: "David Miller", email: "david.m@example.com", className: "Power Circuit", payment: "Paid", date: "Yesterday", initials: "DM" },
];

export default function TrainerStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

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
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-2xl border border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="h-11 rounded-2xl border border-border/50 bg-background/50 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
            <option>All Classes</option>
            <option>Power Circuit</option>
            <option>Mobility Reset Lab</option>
            <option>Weekend Cardio Rush</option>
          </select>
          <button className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50 hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Students Table */}
      <section className="overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Student</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Enrolled Class</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Payment Status</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Registration Date</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockStudents.map((student) => (
                <tr key={student.id} className="group hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 font-bold group-hover:scale-105 transition-transform">
                        {student.initials}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground bg-muted/50 px-3 py-1 rounded-lg">
                      {student.className}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {student.payment === "Paid" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          <CheckCircle2 className="size-3.5" /> {student.payment}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-500/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                          <DollarSign className="size-3.5" /> {student.payment}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                      <Calendar className="size-4" />
                      {student.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/10 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                      title="Message Student"
                    >
                      <MessageCircle className="size-3.5" /> Message
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
