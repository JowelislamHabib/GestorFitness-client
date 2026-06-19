"use client";

import { ArrowLeft, CalendarClock, ChevronRight, Clock, Dumbbell, Heart, Share2, ShieldCheck, Users } from "lucide-react";
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="flex flex-col items-center justify-center p-4 rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/40 backdrop-blur-sm text-center">
                <Clock className="size-6 text-blue-500 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration</span>
                <span className="font-bold text-foreground mt-1">{cls.duration} mins</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/40 backdrop-blur-sm text-center">
                <ShieldCheck className="size-6 text-emerald-500 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Level</span>
                <span className="font-bold text-foreground mt-1">{cls.difficulty}</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/40 backdrop-blur-sm text-center">
                <Users className="size-6 text-orange-500 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</span>
                <span className="font-bold text-foreground mt-1 text-emerald-600">Open</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/40 backdrop-blur-sm text-center">
                <Dumbbell className="size-6 text-blue-500 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trainer</span>
                <span className="font-bold text-foreground mt-1 truncate w-full px-2" title={cls.trainerName}>{cls.trainerName || "Expert"}</span>
              </Card>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">About This Class</h2>
                <div className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line bg-card/30 p-6 rounded-[calc(var(--radius)*1.5)] border border-border/50">
                  {cls.description}
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar / Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Booking Card */}
              <Card className="p-6 rounded-[calc(var(--radius)*2)] border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                
                <div className="flex items-end justify-between mb-6 pt-2">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Price</p>
                    <p className="font-heading text-4xl font-extrabold text-foreground mt-1">${parseFloat(cls.price).toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                    <CalendarClock className="size-5 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase text-muted-foreground">Schedule</p>
                      <p className="font-semibold text-foreground text-sm">
                        {cls.scheduleDays ? cls.scheduleDays.join(", ") : "Various Days"} at {cls.time || "TBD"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                    {cls.trainerImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cls.trainerImage} alt={cls.trainerName} className="size-10 rounded-full object-cover" />
                    ) : (
                      <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Dumbbell className="size-5 text-blue-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold uppercase text-muted-foreground">Instructor</p>
                      <p className="font-semibold text-foreground text-sm">{cls.trainerName || "Unknown Trainer"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleBook}
                    disabled={isBooked}
                    className={`w-full rounded-2xl py-4 text-base font-bold shadow-lg transition-all ${
                      isBooked 
                        ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none" 
                        : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/20 active:scale-[0.98]"
                    }`}
                  >
                    {isBooked ? "Already Booked" : "Book Now (Stripe)"}
                  </button>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={handleFavorite}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold transition-all ${
                        isFavorite 
                          ? "border-red-500 bg-red-500/10 text-red-600" 
                          : "border-border/50 bg-background/50 text-foreground hover:bg-muted"
                      }`}
                    >
                      <Heart className={`size-4 ${isFavorite ? "fill-red-600" : ""}`} />
                      {isFavorite ? "Saved" : "Favorite"}
                    </button>
                    <button className="flex items-center justify-center rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-foreground hover:bg-muted transition-all">
                      <Share2 className="size-4" />
                    </button>
                  </div>
                </div>

              </Card>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="size-4" />
                Payments are securely processed via Stripe.
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
