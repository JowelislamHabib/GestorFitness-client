"use client";

import { Ban, CheckCircle2, Search, ShieldCheck, SlidersHorizontal, Unlock, UserPlus } from "lucide-react";
import { useState } from "react";

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

const mockUsers = [
  { id: 1, name: "Amina Chowdhury", email: "amina.c@example.com", role: "Member", status: "Active", joined: "Oct 12, 2025", avatar: "AC" },
  { id: 2, name: "Rafiq Noor", email: "rafiq.n@fitness.com", role: "Trainer", status: "Active", joined: "Sep 04, 2025", avatar: "RN" },
  { id: 3, name: "Samira Vale", email: "samira.vale@mail.com", role: "Member", status: "Blocked", joined: "Nov 21, 2025", avatar: "SV" },
  { id: 4, name: "David Miller", email: "david.m@example.com", role: "Member", status: "Active", joined: "Today", avatar: "DM" },
  { id: 5, name: "Jessica Alba", email: "jess.a@example.com", role: "Trainer", status: "Active", joined: "Oct 01, 2025", avatar: "JA" },
  { id: 6, name: "Tommy V.", email: "tommy@fitness.com", role: "Admin", status: "Active", joined: "Yesterday", avatar: "TV" },
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
            Block, unblock, and promote users from the admin dashboard.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95">
          <UserPlus className="size-4" />
          Add User
        </button>
      </section>

      {/* Filters & Search */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-3xl">
        <div className="relative w-full container">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-2xl border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-blue-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-11 w-40 rounded-2xl border-border/50 bg-background/50 text-sm font-medium focus:ring-blue-500/50">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="members">Members</SelectItem>
              <SelectItem value="trainers">Trainers</SelectItem>
              <SelectItem value="admins">Admins</SelectItem>
            </SelectContent>
          </Select>
          <button className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50 hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs h-12">User</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Role</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Status</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} className="border-border/50 group hover:bg-muted/20 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 font-bold group-hover:scale-105 transition-transform">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="font-medium text-foreground">{user.role}</span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-1.5">
                    {user.status === "Active" ? (
                      <Badge variant="success" className="gap-1.5">
                        <CheckCircle2 className="size-3.5" /> {user.status}
                      </Badge>
                    ) : (
                      <Badge variant="danger" className="gap-1.5">
                        <Ban className="size-3.5" /> {user.status}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {user.role !== "Admin" && (
                      <button className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/10 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                        <ShieldCheck className="size-3.5" /> Make Admin
                      </button>
                    )}
                    
                    {user.status === "Blocked" ? (
                      <button className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all">
                        <Unlock className="size-3.5" /> Unblock
                      </button>
                    ) : (
                      <button className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500 hover:text-white transition-all">
                        <Ban className="size-3.5" /> Block
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
