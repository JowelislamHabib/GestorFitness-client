"use client";

import { Check, CheckCircle2, Clock, Dumbbell, Search, SlidersHorizontal, Trash2, X } from "lucide-react";
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
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-3xl">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search classes by name or trainer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-2xl border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-blue-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-11 w-40 rounded-2xl border-border/50 bg-background/50 text-sm font-medium focus:ring-blue-500/50">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <button className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50 hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </Card>

      {/* Classes Table */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs h-12">Class Details</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Category</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Price / Time</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Status</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockClasses.map((cls) => (
              <TableRow key={cls.id} className="border-border/50 group hover:bg-muted/20 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 font-bold group-hover:scale-105 transition-transform">
                      <Dumbbell className="size-6" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-base">{cls.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">by {cls.trainer}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                    {cls.category}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-foreground">{cls.price}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <Clock className="size-3" /> {cls.duration}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-1.5">
                    {cls.status === "Approved" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0 text-[10px] font-bold uppercase tracking-wider rounded-md py-1">
                        <CheckCircle2 className="size-3.5 mr-1" /> {cls.status}
                      </Badge>
                    ) : cls.status === "Rejected" ? (
                      <Badge variant="outline" className="text-red-600 border-red-500/20 bg-red-500/5 shadow-none text-[10px] font-bold uppercase tracking-wider rounded-md py-1">
                        <X className="size-3.5 mr-1" /> {cls.status}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-500/20 bg-orange-500/5 shadow-none text-[10px] font-bold uppercase tracking-wider rounded-md py-1">
                        <div className="size-2 rounded-full bg-orange-500 mr-1.5" /> {cls.status}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-right">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
