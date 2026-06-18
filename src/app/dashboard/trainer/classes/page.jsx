"use client";

import { Clock, Dumbbell, Edit3, PlusCircle, Search, SlidersHorizontal, Users } from "lucide-react";
import Link from "next/link";
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
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-3xl">
        <div className="relative w-full container">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-2xl border-border/50 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-blue-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-11 w-36 rounded-2xl border-border/50 bg-background/50 text-sm font-medium focus:ring-blue-500/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
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
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Price & Time</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Students</TableHead>
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
                      <p className="font-bold text-foreground text-base leading-tight">{cls.name}</p>
                      <Badge variant="secondary" className="mt-1.5 text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full">
                        {cls.category}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-foreground">{cls.price}</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Clock className="size-3.5 text-blue-500" />
                      {cls.duration}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="size-4" />
                    <span className="font-bold text-foreground">{cls.students}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge 
                    variant={cls.status === "Approved" ? "default" : "outline"} 
                    className={
                      cls.status === "Approved" 
                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" 
                        : "text-orange-600 border-orange-500/20 bg-orange-500/5 shadow-none px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    }
                  >
                    {cls.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-right">
                  <button 
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/10 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Edit3 className="size-3.5" /> Manage
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
