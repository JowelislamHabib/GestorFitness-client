"use client";

import { useEffect, useState } from "react";
import { getCategories, updateCategoryStatus, deleteCategory } from "@/lib/api/categories";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Trash2, Tag, Loader2 } from "lucide-react";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchCategories = async () => {
    setLoading(true);
    const data = await getCategories(
        filterType === "all" ? "" : filterType, 
        filterStatus === "all" ? "" : filterStatus
    );
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [filterType, filterStatus]);

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
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="class">Classes</SelectItem>
              <SelectItem value="forum">Forums</SelectItem>
              <SelectItem value="specialty">Trainer Specialties</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center p-8">
                  <Loader2 className="size-6 animate-spin mx-auto text-muted-foreground" />
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-8 text-muted-foreground">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <Tag className="size-4 text-muted-foreground" />
                    {cat.name}
                  </td>
                  <td className="px-4 py-3 capitalize">{cat.type}</td>
                  <td className="px-4 py-3">
                    <Badge variant={cat.status === "approved" ? "default" : cat.status === "pending" ? "secondary" : "destructive"}>
                      {cat.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {cat.status !== "approved" && (
                      <Button size="icon" variant="outline" className="size-8 text-green-600 hover:text-green-700" onClick={() => handleStatusUpdate(cat._id, "approved")}>
                        <Check className="size-4" />
                      </Button>
                    )}
                    {cat.status !== "rejected" && (
                      <Button size="icon" variant="outline" className="size-8 text-orange-600 hover:text-orange-700" onClick={() => handleStatusUpdate(cat._id, "rejected")}>
                        <X className="size-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="outline" className="size-8 text-red-600 hover:text-red-700" onClick={() => handleDelete(cat._id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
