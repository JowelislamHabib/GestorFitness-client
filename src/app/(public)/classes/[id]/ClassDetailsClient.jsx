"use client";

import { ArrowLeft, CalendarClock, ChevronRight, Clock, Dumbbell, Heart, Share2, ShieldCheck, Users, Target, Flame, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getClassById } from "@/lib/api/classes";
import { useSession } from "@/lib/auth-client";
import { getUserFavorites, addFavorite, removeFavorite } from "@/lib/api/favorites";
import { getUserBookings } from "@/lib/api/bookings";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import GlobalLoading from "@/components/shared/GlobalLoading";

export default function ClassDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [cls, setCls] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: session, isPending } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      toast.error(errorParam);
      // Optional: remove error from URL
      router.replace(pathname, undefined, { shallow: true });
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    if (params.id) {
      getClassById(params.id)
        .then((data) => {
          if (!data.message) {
            setCls(data);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [params.id]);

  useEffect(() => {
    if (session?.user?.id && params.id) {
      // Fetch Favorites
      getUserFavorites(session.user.id)
        .then((data) => {
          if (Array.isArray(data) && data.includes(params.id)) {
            setIsFavorite(true);
          }
        })
        .catch(console.error);

      // Fetch Bookings
      getUserBookings(session.user.id)
        .then((bookings) => {
          if (Array.isArray(bookings)) {
            const hasBooked = bookings.some(b => b.classId === params.id);
            setIsBooked(hasBooked);
          }
        })
        .catch(console.error);
    }
  }, [session?.user?.id, params.id]);

  const handleFavorite = async () => {
    if (!session?.user?.id) {
      toast.error("Please login to add favorites.");
      return;
    }
    
    const wasFavorite = isFavorite;
    setIsFavorite(!wasFavorite); // Optimistic update

    try {
      if (wasFavorite) {
        await removeFavorite(session.user.id, params.id);
        toast.success("Removed from your favorites!");
      } else {
        await addFavorite(session.user.id, params.id);
        toast.success("Successfully added to your favorites!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update favorites");
      setIsFavorite(wasFavorite); // Revert
    }
  };

  // handleBook is removed, using native HTML form action instead

  if (isLoading) {
    return <GlobalLoading message="Fetching class details..." />;
  }

  if (!cls) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-foreground">Class Not Found</h1>
        <p className="mt-2 text-muted-foreground">The class you are looking for does not exist or has been removed.</p>
        <Link href="/classes" className="mt-6 text-red-600 font-bold hover:underline">
          Return to Classes
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-32 lg:pb-24 pt-0 lg:pt-24">
      
      {/* Mobile Edge-to-Edge Image Header (Hidden on Desktop) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="lg:hidden w-full aspect-[4/3] relative mb-6"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cls.image} alt={cls.title} className="w-full h-full object-cover" />
        
        <div className="absolute top-4 left-4 z-20">
          <Link href="/classes" className="size-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
            <ArrowLeft className="size-5" />
          </Link>
        </div>
        
        <div className="absolute bottom-6 left-4 right-4 z-20 space-y-2">
          <Badge className="bg-red-600 text-white border-0 px-2.5 py-0.5 uppercase tracking-widest text-[10px] font-bold">
            {cls.category}
          </Badge>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight leading-[1.1]">
            {cls.title}
          </h1>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Desktop Header & Image (Hidden on Mobile) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-6 mb-12"
        >
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link href="/classes" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="size-4" /> Back to Classes
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{cls.title}</span>
          </div>

          <div className="space-y-4">
            <Badge className="bg-red-600/10 text-red-600 border-red-600/20 px-3 py-1 uppercase tracking-widest text-[10px] font-bold hover:bg-red-600/20">
              {cls.category}
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-black uppercase text-foreground tracking-tight leading-[1.1]">
              {cls.title}
            </h1>
          </div>
          
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cls.image} alt={cls.title} className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* 2-Column Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-6 lg:mt-0"
        >
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Tight Mobile-Optimized Stats Grid */}
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 lg:py-2"
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card shadow-sm">
                <Clock className="size-5 lg:size-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Duration</p>
                  <p className="text-sm lg:text-base font-bold text-foreground leading-tight mt-0.5">{cls.duration} mins</p>
                </div>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card shadow-sm">
                <ShieldCheck className="size-5 lg:size-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Level</p>
                  <p className="text-sm lg:text-base font-bold text-foreground leading-tight mt-0.5">{cls.difficulty}</p>
                </div>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card shadow-sm">
                <Target className="size-5 lg:size-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Focus</p>
                  <p className="text-sm lg:text-base font-bold text-foreground leading-tight mt-0.5">{cls.focus || "Full Body"}</p>
                </div>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card shadow-sm">
                <Flame className="size-5 lg:size-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Est. Burn</p>
                  <p className="text-sm lg:text-base font-bold text-foreground leading-tight mt-0.5">{cls.estBurn ? `${cls.estBurn} kcal` : "Varies"}</p>
                </div>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card shadow-sm">
                <CalendarClock className="size-5 lg:size-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Schedule</p>
                  <p className="text-sm lg:text-base font-bold text-foreground leading-tight mt-0.5">{cls.scheduleDays ? cls.scheduleDays.join(", ") : "Various"}</p>
                </div>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card shadow-sm">
                <Users className="size-5 lg:size-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</p>
                  <p className="text-sm lg:text-base font-bold text-emerald-600 leading-tight mt-0.5">Open</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Content Details */}
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-xl lg:text-2xl font-black uppercase text-foreground flex items-center gap-2">
                  <span className="bg-red-600 w-1.5 h-5 rounded-full inline-block"></span>
                  About This Class
                </h2>
                <div className="text-muted-foreground leading-relaxed text-sm lg:text-base whitespace-pre-line">
                  {cls.description}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl lg:text-2xl font-black uppercase text-foreground flex items-center gap-2">
                  <span className="bg-red-600 w-1.5 h-5 rounded-full inline-block"></span>
                  Your Coach
                </h2>
                <div className="flex items-center gap-4 p-4 lg:p-6 rounded-2xl bg-muted/30 border border-border/50">
                  {cls.trainerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cls.trainerImage} alt={cls.trainerName} className="size-16 lg:size-20 rounded-full object-cover shadow-sm shrink-0 border-2 border-background" />
                  ) : (
                    <div className="size-16 lg:size-20 rounded-full bg-red-600/10 flex items-center justify-center border-2 border-background shadow-sm shrink-0">
                      <Dumbbell className="size-6 lg:size-8 text-red-600" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-[9px] lg:text-[10px] font-bold tracking-widest uppercase text-red-600 bg-red-600/10 inline-block px-2 lg:px-3 py-0.5 lg:py-1 rounded-md">Lead Coach</p>
                    <h3 className="text-lg lg:text-xl font-black uppercase text-foreground">{cls.trainerName || "Expert Trainer"}</h3>
                    <p className="text-xs lg:text-sm text-muted-foreground line-clamp-2">
                      Join {cls.trainerName ? cls.trainerName.split(' ')[0] : 'them'} in this intense and rewarding session.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Desktop Minimalist Booking Sidebar (Hidden on Mobile) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              
              <div className="border border-border rounded-xl bg-background overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col">
                  
                  {/* Price Header */}
                  <div className="flex flex-col items-center justify-center text-center pb-8 border-b border-border">
                    <Badge variant="outline" className="mb-4 text-[10px] font-bold tracking-widest uppercase bg-red-600/10 text-red-600 border-red-600/20 px-3 py-1 rounded-md">Class Pass</Badge>
                    <div className="flex items-start justify-center text-foreground">
                      <span className="text-2xl font-bold mt-1">$</span>
                      <span className="font-black text-6xl tracking-tight">{parseFloat(cls.price).toFixed(2)}</span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground mt-2 uppercase tracking-widest">One-time payment</p>
                  </div>

                  {/* Logistics List */}
                  <div className="py-8 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-md bg-red-600/10 text-red-600 shrink-0 mt-0.5">
                        <CalendarClock className="size-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground">Schedule</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {cls.scheduleDays ? cls.scheduleDays.join(", ") : "Various Days"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-md bg-red-600/10 text-red-600 shrink-0 mt-0.5">
                        <Clock className="size-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground">Time</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {cls.time || "TBD"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5">
                        <Users className="size-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground">Status</p>
                        <p className="text-sm font-bold text-emerald-600 leading-relaxed">
                          Open for Booking
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-4 border-t border-border mt-auto">
                    <form action="/api/checkout_sessions" method="POST">
                      <input type="hidden" name="classId" value={cls._id || params.id} />
                      <input type="hidden" name="price" value={cls.price} />
                      <input type="hidden" name="title" value={cls.title} />
                      <input type="hidden" name="trainerId" value={cls.trainerId || ""} />
                      <input type="hidden" name="trainerName" value={cls.trainerName || "Expert Trainer"} />
                      <input type="hidden" name="scheduleDays" value={cls.scheduleDays ? cls.scheduleDays.join(", ") : "Various Days"} />
                      <input type="hidden" name="time" value={cls.time || "TBD"} />
                      
                      <button 
                        type="submit"
                        disabled={!session?.user}
                        onClick={(e) => {
                          if (session?.user?.isBlocked) {
                            e.preventDefault();
                            toast.error("Action restricted by Admin");
                          } else if (isBooked) {
                            e.preventDefault();
                            toast.error("You have already booked this class.");
                          }
                        }}
                        className={`w-full relative rounded-md py-4 text-[13px] tracking-widest uppercase font-bold transition-all ${
                          isBooked 
                            ? "bg-muted text-muted-foreground border border-border" 
                            : !session?.user
                              ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                              : "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]"
                        }`}
                      >
                        {isBooked ? (
                          <span className="flex items-center justify-center gap-2">
                            Already Booked <CheckCircle2 className="size-4" />
                          </span>
                        ) : (!session?.user ? "Login to Book" : "Book This Class")}
                      </button>
                    </form>
                    
                    <button 
                      onClick={handleFavorite}
                      className={`w-full flex items-center justify-center gap-2 rounded-md py-3 text-[11px] uppercase tracking-wider font-bold transition-all border ${
                        isFavorite 
                          ? "bg-red-600/10 text-red-600 border-red-600/20" 
                          : "bg-background text-foreground border-border hover:bg-muted"
                      }`}
                    >
                      <Heart className={`size-4 ${isFavorite ? "fill-red-600 text-red-600" : ""}`} />
                      {isFavorite ? "Added to Favourites" : "Add to Favourites"}
                    </button>
                  </div>

                </div>
              </div>

              {/* Security Badge */}
              <div className="flex flex-col items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-6">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-red-600" />
                  <span>Secure 1-Click Booking</span>
                </div>
              </div>

            </div>
          </div>

        </motion.div>
      </div>

      {/* Mobile-Only Sticky Bottom Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:hidden"
      >
        <div className="flex items-center gap-3">
          
          <button 
            onClick={handleFavorite}
            className={`flex items-center justify-center size-12 shrink-0 rounded-md transition-all border ${
              isFavorite 
                ? "bg-red-600/10 text-red-600 border-red-600/20" 
                : "bg-background text-muted-foreground border-border"
            }`}
          >
            <Heart className={`size-5 ${isFavorite ? "fill-red-600 text-red-600" : ""}`} />
          </button>

          <form action="/api/checkout_sessions" method="POST" className="flex-1 flex items-center bg-foreground text-background rounded-md p-1 pl-4 h-12">
            <input type="hidden" name="classId" value={cls._id || params.id} />
            <input type="hidden" name="price" value={cls.price} />
            <input type="hidden" name="title" value={cls.title} />
            <input type="hidden" name="trainerId" value={cls.trainerId || ""} />
            <input type="hidden" name="trainerName" value={cls.trainerName || "Expert Trainer"} />
            <input type="hidden" name="scheduleDays" value={cls.scheduleDays ? cls.scheduleDays.join(", ") : "Various Days"} />
            <input type="hidden" name="time" value={cls.time || "TBD"} />
            
            <div className="flex flex-col mr-auto">
              <span className="text-[9px] font-bold text-background/70 uppercase tracking-widest leading-none">Total</span>
              <span className="text-sm font-black leading-tight mt-0.5">${parseFloat(cls.price).toFixed(2)}</span>
            </div>

            <button 
              type="submit"
              disabled={!session?.user}
              onClick={(e) => {
                if (session?.user?.isBlocked) {
                  e.preventDefault();
                  toast.error("Action restricted by Admin");
                } else if (isBooked) {
                  e.preventDefault();
                  toast.error("You have already booked this class.");
                }
              }}
              className={`h-full px-5 rounded text-[11px] tracking-widest uppercase font-bold transition-all ${
                isBooked 
                  ? "bg-muted text-muted-foreground" 
                  : !session?.user
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]"
              }`}
            >
              {isBooked ? (
                <span className="flex items-center justify-center gap-1.5">
                  Booked <CheckCircle2 className="size-3.5" />
                </span>
              ) : (!session?.user ? "Login" : "Book")}
            </button>
          </form>

        </div>
      </motion.div>

    </main>
  );
}
