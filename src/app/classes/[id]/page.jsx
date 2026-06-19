"use client";

import { ArrowLeft, CalendarClock, ChevronRight, Clock, Dumbbell, Heart, Share2, ShieldCheck, Users, Target, Flame } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getClassById } from "@/lib/api/classes";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function ClassDetailsPage() {
  const params = useParams();
  const [cls, setCls] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

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

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In real app, trigger a toast notification here
  };

  const handleBook = () => {
    // In real app, redirect to Stripe payment
    setIsBooked(true);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (!cls) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-foreground">Class Not Found</h1>
        <p className="mt-2 text-muted-foreground">The class you are looking for does not exist or has been removed.</p>
        <Link href="/classes" className="mt-6 text-blue-600 font-bold hover:underline">
          Return to Classes
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground animate-in fade-in duration-500">
          <Link href="/classes" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="size-4" /> Back to Classes
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{cls.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hero Image */}
            <div className="relative h-[400px] w-full overflow-hidden rounded-[calc(var(--radius)*2)] shadow-2xl bg-muted">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={cls.image} 
                alt={cls.title} 
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-8 left-8 z-20 space-y-3">
                <Badge className="bg-blue-600 text-white border-0 shadow-lg px-3 py-1 hover:bg-blue-600">
                  {cls.category}
                </Badge>
                <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight container px-0">
                  {cls.title}
                </h1>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Card className="flex flex-col items-center justify-center p-5 rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/40 backdrop-blur-sm text-center hover:bg-card/60 transition-colors">
                <Clock className="size-7 text-blue-500 mb-3" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration</span>
                <span className="font-bold text-foreground mt-1.5 text-lg">{cls.duration} mins</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-5 rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/40 backdrop-blur-sm text-center hover:bg-card/60 transition-colors">
                <ShieldCheck className="size-7 text-emerald-500 mb-3" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Level</span>
                <span className="font-bold text-foreground mt-1.5 text-lg">{cls.difficulty}</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-5 rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/40 backdrop-blur-sm text-center hover:bg-card/60 transition-colors">
                <Target className="size-7 text-purple-500 mb-3" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Focus Area</span>
                <span className="font-bold text-foreground mt-1.5 text-lg">{cls.focus || "Full Body"}</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-5 rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/40 backdrop-blur-sm text-center hover:bg-card/60 transition-colors">
                <Flame className="size-7 text-orange-500 mb-3" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Est. Burn</span>
                <span className="font-bold text-foreground mt-1.5 text-lg">{cls.estBurn ? `${cls.estBurn} kcal` : "Varies"}</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-5 rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/40 backdrop-blur-sm text-center hover:bg-card/60 transition-colors">
                <Dumbbell className="size-7 text-blue-500 mb-3" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Equipment</span>
                <span className="font-bold text-foreground mt-1.5 text-lg">Provided</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-5 rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/40 backdrop-blur-sm text-center hover:bg-card/60 transition-colors">
                <Users className="size-7 text-emerald-500 mb-3" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</span>
                <span className="font-bold text-emerald-600 mt-1.5 text-lg">Open</span>
              </Card>
            </div>

            {/* Description & Coach */}
            <div className="grid gap-10 mt-10">
              <div className="space-y-4">
                <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
                  <span className="bg-blue-600 w-1.5 h-6 rounded-full inline-block"></span>
                  About This Class
                </h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-[17px] bg-card/30 p-6 rounded-[calc(var(--radius)*1.5)] border border-border/50 backdrop-blur-sm">
                  {cls.description}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
                  <span className="bg-orange-500 w-1.5 h-6 rounded-full inline-block"></span>
                  Meet Your Coach
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-card/30 p-6 rounded-[calc(var(--radius)*1.5)] border border-border/50 backdrop-blur-sm hover:bg-card/50 transition-colors">
                  {cls.trainerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cls.trainerImage} alt={cls.trainerName} className="size-24 rounded-full object-cover border-4 border-background shadow-lg shrink-0" />
                  ) : (
                    <div className="size-24 rounded-full bg-orange-500/10 flex items-center justify-center border-4 border-background shadow-lg shrink-0">
                      <Dumbbell className="size-10 text-orange-500" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="font-heading text-2xl font-bold text-foreground">{cls.trainerName || "Expert Trainer"}</h3>
                    <p className="text-sm font-bold tracking-wider uppercase text-blue-600 bg-blue-500/10 inline-block px-3 py-1 rounded-full mb-1">Lead Coach</p>
                    <p className="text-sm text-muted-foreground">
                      An elite fitness professional dedicated to helping you crush your goals. Join {cls.trainerName ? cls.trainerName.split(' ')[0] : 'them'} in this intense and highly rewarding session.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar / Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Premium Booking Card */}
              <Card className="p-1 rounded-[calc(var(--radius)*2)] bg-gradient-to-b from-border/50 to-transparent shadow-2xl relative">
                <div className="bg-card/90 backdrop-blur-xl p-6 rounded-[calc(var(--radius)*2-4px)] h-full">
                  
                  {/* Price Header */}
                  <div className="flex flex-col items-center justify-center text-center pb-6 border-b border-border/50">
                    <Badge variant="outline" className="mb-4 text-xs font-bold tracking-widest uppercase bg-blue-500/10 text-blue-600 border-blue-500/20 px-3 py-1">Class Pass</Badge>
                    <div className="flex items-start justify-center text-foreground">
                      <span className="text-2xl font-bold mt-1">$</span>
                      <span className="font-heading text-6xl font-extrabold tracking-tight">{parseFloat(cls.price).toFixed(2)}</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mt-2">One-time payment, no hidden fees.</p>
                  </div>

                  {/* Logistics List */}
                  <div className="py-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                        <CalendarClock className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">Class Schedule</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {cls.scheduleDays ? cls.scheduleDays.join(", ") : "Various Days"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 shrink-0">
                        <Clock className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">Time & Duration</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {cls.time || "TBD"} • {cls.duration} mins
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 shrink-0">
                        <Target className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">Class Focus</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {cls.focus || "Full Body Workout"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-4">
                    <button 
                      onClick={handleBook}
                      disabled={isBooked}
                      className={`w-full relative overflow-hidden rounded-2xl py-4 text-base font-bold shadow-xl transition-all group ${
                        isBooked 
                          ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none" 
                          : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/25 active:scale-[0.98]"
                      }`}
                    >
                      {isBooked ? "Successfully Booked ✓" : "Book This Class"}
                    </button>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={handleFavorite}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                          isFavorite 
                            ? "bg-red-500/10 text-red-600 border border-red-500/20" 
                            : "bg-background text-foreground border border-border/50 hover:bg-muted"
                        }`}
                      >
                        <Heart className={`size-4 ${isFavorite ? "fill-red-600" : ""}`} />
                        {isFavorite ? "Saved" : "Save"}
                      </button>
                      <button className="flex items-center justify-center rounded-xl border border-border/50 bg-background px-4 py-3 text-foreground hover:bg-muted transition-all">
                        <Share2 className="size-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </Card>

              {/* Security Badge */}
              <div className="flex flex-col items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  <span>Secure 1-Click Booking</span>
                </div>
                <p className="text-[11px] opacity-70">Powered by Stripe Processing</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
