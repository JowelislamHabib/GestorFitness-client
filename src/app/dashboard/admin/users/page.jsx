"use client";

import { Ban, CheckCircle2, Loader2, Search, ShieldCheck, SlidersHorizontal, Unlock, VenetianMask, X, Users, UserCog } from "lucide-react";
import GlobalLoading from "@/components/shared/GlobalLoading";

import { StatCard } from "@/components/ui/stat-card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

import { PaginationControls } from "@/components/shared/PaginationControls";
import { getUsersList, blockUser, unblockUser } from "@/lib/api/users";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const SUPER_ADMIN_ID = "6a340d9254af790ed3b1a79a";

export default function ManageUsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal States
  const [modalState, setModalState] = useState({ isOpen: false, type: null, user: null });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, roleFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsersList({ page, limit: 10, search: debouncedSearch, role: roleFilter });
      if (data && data.data) {
        setUsers(data.data);
        setStats(data.stats || {});
        setTotalPages(data.totalPages || 1);
      } else if (data?.users) {
        setUsers(data.users);
      } else if (Array.isArray(data)) {
        setUsers(data);
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
    if (user.id === SUPER_ADMIN_ID || user._id === SUPER_ADMIN_ID) {
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
    const userId = user.id || user._id;

    setIsProcessing(true);
    try {
      if (type === "promote") {
        await authClient.admin.setRole({ userId, role: "admin" });
        toast.success(`${user.name} is now an Admin!`);
        fetchUsers();
      } 
      else if (type === "block") {
        await blockUser(userId);
        toast.success(`${user.name} has been blocked.`);
        fetchUsers();
      }
      else if (type === "unblock") {
        await unblockUser(userId);
        toast.success(`${user.name} has been unblocked.`);
        fetchUsers();
      }
      else if (type === "impersonate") {
        const res = await authClient.admin.impersonateUser({ userId });
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

  const totalUsers = stats.totalUsers || 0;
  const totalTrainers = stats.totalTrainers || 0;
  const totalAdmins = stats.totalAdmins || 0;
  const blockedUsers = stats.blockedUsers || 0;

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

      {/* Summary Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Trainers"
          value={totalTrainers}
          icon={UserCog}
          color="emerald"
        />

        <StatCard
          title="Admins"
          value={totalAdmins}
          icon={ShieldCheck}
          color="purple"
        />

        <StatCard
          title="Blocked Users"
          value={blockedUsers}
          icon={Ban}
          color="red"
        />
      </section>

      {/* Filters & Search */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm p-4 shadow-sm rounded-xl">
        <div className="relative w-full container">
          <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-background/50 pl-11 pr-4 text-sm font-medium focus-visible:ring-red-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-11 w-40 rounded-xl border-slate-200 dark:border-slate-800 bg-background/50 text-sm font-medium focus:ring-red-500/50">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur-xl">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="trainer">Trainers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {isLoading && users.length === 0 ? (
        <GlobalLoading message="Fetching users..." />
      ) : users.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-slate-200 dark:border-slate-800 bg-card/50">
          <div className="flex size-20 items-center justify-center rounded-full bg-red-500/10 text-red-600 mb-6">
            <Search className="size-10" />
          </div>
          <h2 className="text-2xl font-bold">No Users Found</h2>
          <p className="mt-2 text-base text-muted-foreground">
            No users match your current search and filters.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs h-12">User</TableHead>
                <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Role</TableHead>
                <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Status</TableHead>
                <TableHead className="px-6 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const userId = user.id || user._id;
                return (
                <TableRow key={userId} className="border-border/50 group hover:bg-muted/20 even:bg-muted/10 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-600 font-bold group-hover:scale-105 transition-transform overflow-hidden">
                        {user.image ? (
                          <Image src={user.image} alt={user.name} width={40} height={40} referrerPolicy="no-referrer" className="size-full object-cover" />
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
                  <TableCell className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      user.role === 'trainer' ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                    }`}>
                      {user.role || 'user'}
                    </span>
                    {userId === SUPER_ADMIN_ID && (
                      <span className="ml-2 inline-flex items-center text-[10px] bg-yellow-500/20 text-yellow-600 px-1.5 py-1 rounded-md font-bold uppercase tracking-widest">
                        Super
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {!user.isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                          <CheckCircle2 className="size-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-600 uppercase tracking-widest">
                          <Ban className="size-3.5" /> Blocked
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {userId !== SUPER_ADMIN_ID && (
                        <Button 
                          variant="ghost" size="sm"
                          onClick={() => openModal("impersonate", user)}
                          className="h-8 gap-1.5 px-3 text-[11px] font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-slate-700"
                        >
                          <VenetianMask className="size-3.5" /> Impersonate
                        </Button>
                      )}

                      {user.role !== "admin" && (
                        <Button 
                          variant="ghost" size="sm"
                          onClick={() => openModal("promote", user)}
                          className="h-8 gap-1.5 px-3 text-[11px] font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-slate-700"
                        >
                          <ShieldCheck className="size-3.5" /> Make Admin
                        </Button>
                      )}
                      
                      {userId !== SUPER_ADMIN_ID && (
                        user.isBlocked ? (
                          <Button 
                            variant="ghost" size="sm"
                            onClick={() => openModal("unblock", user)}
                            className="h-8 gap-1.5 px-3 text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-all border border-emerald-200 dark:border-emerald-900"
                          >
                            <Unlock className="size-3.5" /> Unblock
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" size="sm"
                            onClick={() => openModal("block", user)}
                            className="h-8 gap-1.5 px-3 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-all border border-red-200 dark:border-red-900"
                          >
                            <Ban className="size-3.5" /> Block
                          </Button>
                        )
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
          <PaginationControls 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </Card>
      )}

      {/* Action Confirmation Modal */}
      {modalState.isOpen && modalState.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="relative w-full container max-w-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors z-10"
            >
              <X className="size-5" />
            </button>
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                {modalState.type === "block" && (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 font-bold">
                    <Ban className="size-6" />
                  </div>
                )}
                {modalState.type === "unblock" && (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 font-bold">
                    <Unlock className="size-6" />
                  </div>
                )}
                {modalState.type === "promote" && (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 font-bold">
                    <ShieldCheck className="size-6" />
                  </div>
                )}
                {modalState.type === "impersonate" && (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 font-bold">
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
                    modalState.type === "block" ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 shadow-lg shadow-red-600/20 dark:shadow-none" :
                    modalState.type === "unblock" ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-lg shadow-emerald-600/20 dark:shadow-none" :
                    modalState.type === "promote" ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 shadow-lg shadow-red-600/20 dark:shadow-none" :
                    "bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900 shadow-lg shadow-slate-900/20 dark:shadow-none"
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
