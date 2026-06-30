"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { suggestCategory } from "@/lib/api/categories";
import { PlusCircle } from "lucide-react";

export function SuggestCategoryDialog({ type, onSuggested }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await suggestCategory(name.trim(), type);
    
    if (res.error) {
      setError(res.message);
    } else {
      setSuccess("Category suggested successfully! It has been selected for you.");
      if (onSuggested) onSuggested(name.trim());
      // Auto close after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setSuccess("");
        setName("");
      }, 2000);
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setError("");
        setSuccess("");
        setName("");
      }
    }}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-auto py-0.5 px-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50/50">
          <PlusCircle className="size-3 mr-1" />
          Suggest new {type === 'specialty' ? 'specialty' : 'category'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Suggest New {type === 'specialty' ? 'Specialty' : 'Category'}</DialogTitle>
          <DialogDescription>
            Can't find what you're looking for? Suggest a new one. It will be available for everyone once approved by an admin.
          </DialogDescription>
        </DialogHeader>
        <div onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
          }
        }}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Zumba"
                required
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            {success && <p className="text-sm text-green-500 font-medium">{success}</p>}
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSubmit} disabled={loading || !name.trim()} className="bg-red-600 hover:bg-red-700 text-white">
              {loading ? "Submitting..." : "Submit Suggestion"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
