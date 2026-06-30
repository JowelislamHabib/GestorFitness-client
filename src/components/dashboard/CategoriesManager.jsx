"use client";

import { useEffect, useState } from "react";
import { getPaginatedCategories, updateCategoryStatus, deleteCategory } from "@/lib/api/categories";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Trash2, Tag, Clock, Dumbbell, MessageSquare, List, Loader2 } from "lucide-react";
import { PaginationControls } from "@/components/shared/PaginationControls";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, classes: 0 });
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("All");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, filterType]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const statusParam = activeTab === "All" ? "" : activeTab.toLowerCase();
      const typeParam = filterType === "all" ? "" : filterType;

      const res = await getPaginatedCategories(typeParam, statusParam, page, 10);
      
      setCategories(res.data || []);
      setTotalPages(res.totalPages || 1);
      
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [activeTab, filterType, page]);

  const handleStatusUpdate = async (id, status) => {
    const res = await updateCategoryStatus(id, status);
    if (!res.error) {
      fetchCategories();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const res = await deleteCategory(id);
      if (!res.error) {
        fetchCategories();
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Category Management</h1>
          <p className="mt-1 text-muted-foreground">
            Review suggested categories and manage the taxonomy across the platform.
          </p>
        </div>
      </section>

      {/* Summary Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Categories"
          value={stats.total}
          icon={List}
          color="blue"
        />
        
        <StatCard
          title="Pending Approval"
          value={stats.pending}
          icon={Clock}
          color="orange"
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={Check}
          color="emerald"
        />

        <StatCard
          title="Class Categories"
          value={stats.classes}
          icon={Dumbbell}
          color="purple"
        />
      </section>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Tabs */}
        <section className="flex flex-wrap gap-2 p-1.5 bg-muted/30 border border-border/50 rounded-xl w-fit">
          {["All", "Pending", "Approved", "Rejected"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${
                activeTab === tab 
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-900 shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </section>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-xs font-medium text-muted-foreground mr-4">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-purple-500"></span> Classes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-blue-500"></span> Forums
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-orange-500"></span> Specialties
            </span>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[200px] h-11 bg-card/50 backdrop-blur-sm rounded-xl">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="class">Classes</SelectItem>
              <SelectItem value="forum">Forums</SelectItem>
              <SelectItem value="specialty">Trainer Specialties</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Categories Table */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs h-12">Category Name</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Type</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs">Status</TableHead>
              <TableHead className="px-6 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center">
                  <Loader2 className="size-8 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                  No {activeTab.toLowerCase()} categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => {
                const Icon = cat.type === "class" ? Dumbbell : cat.type === "forum" ? MessageSquare : Tag;
                return (
                <TableRow key={cat._id} className="border-border/50 group hover:bg-muted/20 even:bg-muted/10 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3 font-medium text-foreground">
                      <div className={`flex size-10 items-center justify-center rounded-xl group-hover:scale-105 transition-transform ${
                        cat.type === "class" ? "bg-purple-500/10 text-purple-600" :
                        cat.type === "forum" ? "bg-blue-500/10 text-blue-600" :
                        "bg-orange-500/10 text-orange-600"
                      }`}>
                        <Icon className="size-5" />
                      </div>
                      <span className="font-bold">{cat.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className={`capitalize ${
                      cat.type === "class" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                      cat.type === "forum" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                      "bg-orange-500/10 text-orange-600 border-orange-500/20"
                    }`}>
                      {cat.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={`capitalize ${
                      cat.status === "approved" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" :
                      cat.status === "pending" ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20" :
                      "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20"
                    }`} variant="outline">
                      {cat.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {cat.status !== "approved" && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(cat._id, "approved")}
                          className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white border-transparent"
                        >
                          <Check className="size-4 mr-1.5" /> Approve
                        </Button>
                      )}
                      {cat.status !== "rejected" && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(cat._id, "rejected")}
                          className="bg-orange-500/10 text-orange-600 hover:bg-orange-600 hover:text-white border-transparent"
                        >
                          <X className="size-4 mr-1.5" /> Reject
                        </Button>
                      )}
                      <Button 
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(cat._id)}
                        className="size-9 bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white shadow-none"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )})
            )}
          </TableBody>
        </Table>
        <PaginationControls 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
