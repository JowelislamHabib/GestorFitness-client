"use client";

import { Ban, CheckCircle2, MoreVertical, Search, SlidersHorizontal, UserPlus } from "lucide-react";
import { useState } from "react";

const mockUsers = [
  { id: 1, name: "Amina Chowdhury", email: "amina.c@example.com", role: "Member", status: "Active", joined: "Oct 12, 2025", avatar: "AC" },
  { id: 2, name: "Rafiq Noor", email: "rafiq.n@fitness.com", role: "Trainer", status: "Active", joined: "Sep 04, 2025", avatar: "RN" },
  { id: 3, name: "Samira Vale", email: "samira.vale@mail.com", role: "Member", status: "Blocked", joined: "Nov 21, 2025", avatar: "SV" },
  { id: 4, name: "David Miller", email: "david.m@example.com", role: "Member", status: "Pending", joined: "Today", avatar: "DM" },
  { id: 5, name: "Jessica Alba", email: "jess.a@example.com", role: "Trainer", status: "Active", joined: "Oct 01, 2025", avatar: "JA" },
  { id: 6, name: "Tommy V.", email: "tommy@fitness.com", role: "Trainer", status: "Pending", joined: "Yesterday", avatar: "TV" },
];

export default function ManageUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Manage Users</h1>
          <p className="mt-1 text-muted-foreground">
            View, block, and manage platform members and trainers.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95">
          <UserPlus className="size-4" />
          Add User
        </button>
      </section>

      {/* Filters & Search */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-2xl border border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="h-11 rounded-2xl border border-border/50 bg-background/50 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
            <option>All Roles</option>
            <option>Members</option>
            <option>Trainers</option>
            <option>Admins</option>
          </select>
          <button className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50 hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Users Table */}
      <section className="overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">User</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Role</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Joined</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 font-bold">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {user.status === "Active" && <CheckCircle2 className="size-4 text-emerald-500" />}
                      {user.status === "Blocked" && <Ban className="size-4 text-red-500" />}
                      {user.status === "Pending" && <div className="size-2 rounded-full bg-orange-500 ml-1 mr-0.5" />}
                      <span className={`font-bold ${
                        user.status === "Active" ? "text-emerald-600 dark:text-emerald-400" :
                        user.status === "Blocked" ? "text-red-600 dark:text-red-400" :
                        "text-orange-600 dark:text-orange-400"
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                      <MoreVertical className="size-4" />
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
