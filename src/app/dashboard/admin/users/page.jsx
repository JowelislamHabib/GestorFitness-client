"use client";

import { Ban, CheckCircle2, Search, ShieldCheck, SlidersHorizontal, Unlock, VenetianMask, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

import { getUsersList } from "@/lib/api/users";
import { authClient } from "@/lib/auth-client";

const SUPER_ADMIN_ID = "6a340d9254af790ed3b1a79a";

export default function ManageUsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal States
  const [modalState, setModalState] = useState({ isOpen: false, type: null, user: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsersList();
      if (data?.users) {
        setUsers(data.users);
      }
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (user) => {
    const label = user?.name?.trim() || user?.email?.split("@")[0] || "User";
    const parts = label.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const openModal = (type, user) => {
    if (user.id === SUPER_ADMIN_ID) {
      toast.error("You cannot modify or impersonate the super-admin account.");
      return;
    }
    setModalState({ isOpen: true, type, user });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, user: null });
  };

  const handleAction = async () => {
    const { type, user } = modalState;
    if (!user) return;

    setIsProcessing(true);
    try {
      if (type === "promote") {
        await authClient.admin.setRole({ userId: user.id, role: "admin" });
        toast.success(`${user.name} is now an Admin!`);
        setUsers(users.map(u => u.id === user.id ? { ...u, role: "admin" } : u));
      } 
      else if (type === "block") {
        await authClient.admin.banUser({ userId: user.id, banReason: "Admin action" });
        toast.success(`${user.name} has been blocked.`);
        setUsers(users.map(u => u.id === user.id ? { ...u, banned: true } : u));
      }
      else if (type === "unblock") {
        await authClient.admin.unbanUser({ userId: user.id });
        toast.success(`${user.name} has been unblocked.`);
        setUsers(users.map(u => u.id === user.id ? { ...u, banned: false } : u));
      }
      else if (type === "impersonate") {
        const res = await authClient.admin.impersonateUser({ userId: user.id });
        if (res.error) throw res.error;
        toast.success(`Now impersonating ${user.name}`);
        window.location.href = "/dashboard/user"; // Full reload to reset auth state
        return; 
      }
      closeModal();
    } catch (err) {
      toast.error(err.message || `Failed to ${type} user`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = user.name?.toLowerCase().includes(term) || user.email?.toLowerCase().includes(term);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Manage Users</h1>
          <p className="mt-1 text-muted-foreground">
            Block, unblock, impersonate, and promote users from the admin dashboard.
          </p>
        </div>
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
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-11 w-40 rounded-2xl border-border/50 bg-background/50 text-sm font-medium focus:ring-blue-500/50">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="trainer">Trainers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
          <button className="flex size-11 items-center justify-center rounded-2xl border border-border/50 bg-background/50 hover:bg-muted transition-colors">
            <SlidersHorizontal className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </Card>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border bg-card/50">
          <div className="flex size-20 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 mb-6">
            <Search className="size-10" />
          </div>
          <h2 className="text-2xl font-bold">No Users Found</h2>
          <p className="mt-2 text-base text-muted-foreground">
            No users match your current search and filters.
          </p>
        </Card>
      ) : (
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
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-border/50 group hover:bg-muted/20 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 font-bold group-hover:scale-105 transition-transform overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="size-full object-cover" />
                        ) : (
                          getInitials(user)
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-bold text-foreground uppercase text-xs tracking-wider">{user.role || 'user'}</span>
                    {user.id === SUPER_ADMIN_ID && (
                      <span className="ml-2 text-[10px] bg-yellow-500/20 text-yellow-600 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-widest">
                        Super
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5">
                      {!user.banned ? (
                        <Badge variant="success" className="gap-1.5 uppercase">
                          <CheckCircle2 className="size-3.5" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="danger" className="gap-1.5 uppercase">
                          <Ban className="size-3.5" /> Blocked
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.id !== SUPER_ADMIN_ID && (
                        <button 
                          onClick={() => openModal("impersonate", user)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-600 hover:bg-purple-500 hover:text-white transition-all"
                        >
                          <VenetianMask className="size-3.5" /> Impersonate
                        </button>
                      )}

                      {user.role !== "admin" && (
                        <button 
                          onClick={() => openModal("promote", user)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/10 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <ShieldCheck className="size-3.5" /> Make Admin
                        </button>
                      )}
                      
                      {user.id !== SUPER_ADMIN_ID && (
                        user.banned ? (
                          <button 
                            onClick={() => openModal("unblock", user)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"
                          >
                            <Unlock className="size-3.5" /> Unblock
                          </button>
                        ) : (
                          <button 
                            onClick={() => openModal("block", user)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Ban className="size-3.5" /> Block
                          </button>
                        )
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Action Confirmation Modal */}
      {modalState.isOpen && modalState.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="relative w-full container max-w-md rounded-3xl border border-border/50 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors z-10"
            >
              <X className="size-5" />
            </button>
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                {modalState.type === "block" && (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 font-bold">
                    <Ban className="size-6" />
                  </div>
                )}
                {modalState.type === "unblock" && (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 font-bold">
                    <Unlock className="size-6" />
                  </div>
                )}
                {modalState.type === "promote" && (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 font-bold">
                    <ShieldCheck className="size-6" />
                  </div>
                )}
                {modalState.type === "impersonate" && (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 font-bold">
                    <VenetianMask className="size-6" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold capitalize">{modalState.type} User</h2>
                  <p className="text-sm text-muted-foreground mt-1">{modalState.user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                {modalState.type === "block" && <p className="text-foreground">Are you sure you want to block <strong>{modalState.user.name}</strong>? They will be unable to log in until unblocked.</p>}
                {modalState.type === "unblock" && <p className="text-foreground">Are you sure you want to unblock <strong>{modalState.user.name}</strong>? Their access will be restored immediately.</p>}
                {modalState.type === "promote" && <p className="text-foreground">Are you sure you want to promote <strong>{modalState.user.name}</strong> to Admin? This grants them full control over the platform.</p>}
                {modalState.type === "impersonate" && <p className="text-foreground">Are you sure you want to impersonate <strong>{modalState.user.name}</strong>? You will be logged into their account to view exactly what they see.</p>}
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={closeModal}
                  className="rounded-xl px-6 h-11"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAction}
                  disabled={isProcessing}
                  className={`rounded-xl px-6 h-11 text-white font-bold transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 ${
                    modalState.type === "block" ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20" :
                    modalState.type === "unblock" ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20" :
                    modalState.type === "promote" ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" :
                    "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20"
                  }`}
                >
                  {isProcessing ? "Processing..." : `Confirm ${modalState.type}`}
                </Button>
              </div>

            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
