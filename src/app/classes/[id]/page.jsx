"use client";

import { ArrowLeft, CalendarClock, CheckCircle2, ChevronRight, Clock, Dumbbell, Heart, Share2, ShieldCheck, Star, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Mock Data
const MOCK_CLASS = {
  id: 1,
  name: "Functional Strength Lab",
  trainer: "Maya Calder",
  category: "Strength",
  difficulty: "Intermediate",
  duration: "60 mins",
  price: "$49.00",
  schedule: ["Mon", "Wed", "Fri"],
  time: "18:00 (6:00 PM)",
  bookings: 28,
  maxCapacity: 30,
  image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
  description: "Join Maya Calder for an intense, full-body functional strength session designed to improve your mobility, power, and overall conditioning. We focus on compound movements like squats, deadlifts, and kettlebell swings to build real-world strength. Perfect for those looking to break through plateaus and learn proper lifting mechanics in a safe, high-energy environment.",
  benefits: [
    "Build lean muscle mass",
    "Improve metabolic conditioning",
    "Enhance joint mobility and stability",
    "Learn proper lifting techniques",
  ],
};

export default function ClassDetailsPage() {
  const params = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Note: params.id is available if needed for fetching

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In real app, trigger a toast notification here
  };

  const handleBook = () => {
    // In real app, redirect to Stripe payment
    setIsBooked(true);
  };

  const spotsLeft = MOCK_CLASS.maxCapacity - MOCK_CLASS.bookings;

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground animate-in fade-in duration-500">
          <Link href="/classes" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="size-4" /> Back to Classes
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{MOCK_CLASS.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hero Image */}
            <div className="relative h-[400px] w-full overflow-hidden rounded-[2rem] shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={MOCK_CLASS.image} 
                alt={MOCK_CLASS.name} 
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-8 left-8 z-20 space-y-3">
                <Badge className="bg-blue-600 text-white border-0 shadow-lg px-3 py-1 font-bold uppercase tracking-wider text-[10px]">
                  {MOCK_CLASS.category}
                </Badge>
                <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight container">
                  {MOCK_CLASS.name}
                </h1>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="flex flex-col items-center justify-center p-4 rounded-2xl border-border/50 bg-card/40 backdrop-blur-sm text-center">
                <Clock className="size-6 text-blue-500 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration</span>
                <span className="font-bold text-foreground mt-1">{MOCK_CLASS.duration}</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 rounded-2xl border-border/50 bg-card/40 backdrop-blur-sm text-center">
                <ShieldCheck className="size-6 text-emerald-500 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Level</span>
                <span className="font-bold text-foreground mt-1">{MOCK_CLASS.difficulty}</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 rounded-2xl border-border/50 bg-card/40 backdrop-blur-sm text-center">
                <Users className="size-6 text-orange-500 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Capacity</span>
                <span className="font-bold text-foreground mt-1">{MOCK_CLASS.maxCapacity} Max</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 rounded-2xl border-border/50 bg-card/40 backdrop-blur-sm text-center">
                <Star className="size-6 text-yellow-500 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rating</span>
                <span className="font-bold text-foreground mt-1">4.9/5.0</span>
              </Card>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">About This Class</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {MOCK_CLASS.description}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-4">What you will achieve:</h3>
                <ul className="space-y-3">
                  {MOCK_CLASS.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Sidebar / Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Booking Card */}
              <Card className="p-6 rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                
                <div className="flex items-end justify-between mb-6 pt-2">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Price</p>
                    <p className="font-heading text-4xl font-extrabold text-foreground mt-1">{MOCK_CLASS.price}</p>
                  </div>
                  {spotsLeft <= 5 && (
                    <Badge variant="destructive" className="animate-pulse">Only {spotsLeft} spots left!</Badge>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                    <CalendarClock className="size-5 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase text-muted-foreground">Schedule</p>
                      <p className="font-semibold text-foreground text-sm">{MOCK_CLASS.schedule.join(", ")} at {MOCK_CLASS.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                    <Dumbbell className="size-5 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase text-muted-foreground">Instructor</p>
                      <p className="font-semibold text-foreground text-sm">{MOCK_CLASS.trainer}</p>
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
                        : "bg-foreground text-background hover:bg-blue-600 hover:text-white hover:shadow-blue-600/20 active:scale-[0.98]"
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
