"use client";

import { Clock, Dumbbell, Search, SlidersHorizontal, Users } from "lucide-react";
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

// Mock Data: Only Approved classes
const MOCK_CLASSES = [
  {
    id: 1,
    name: "Functional Strength Lab",
    trainer: "Maya Calder",
    category: "Strength",
    duration: "60 mins",
    price: "$49.00",
    bookings: 28,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Recovery Flow Reset",
    trainer: "Leila Bennett",
    category: "Yoga",
    duration: "45 mins",
    price: "$36.00",
    bookings: 15,
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Sunrise Vinyasa",
    trainer: "Jessica Alba",
    category: "Yoga",
    duration: "60 mins",
    price: "$30.00",
    bookings: 42,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Weekend Cardio Rush",
    trainer: "Khalid Mercer",
    category: "Cardio",
    duration: "45 mins",
    price: "$28.00",
    bookings: 35,
    image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1925&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Advanced Powerlifting",
    trainer: "David Miller",
    category: "Strength",
    duration: "90 mins",
    price: "$65.00",
    bookings: 12,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "HIIT Core Burn",
    trainer: "Maya Calder",
    category: "Cardio",
    duration: "30 mins",
    price: "$20.00",
    bookings: 50,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function AllClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredClasses = MOCK_CLASSES.filter((cls) => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || cls.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <Badge className="bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs border-0">
            Find Your Class
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Discover Your Perfect Workout
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse through hundreds of high-quality classes hosted by expert trainers. Find the one that matches your fitness goals.
          </p>
        </section>

        {/* Search & Filter Bar */}
        <Card className="p-4 rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center gap-4 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 opacity-50" />
          <div className="relative w-full flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search classes by name..." 
              className="h-14 w-full rounded-2xl pl-12 bg-background/60 border-border/50 focus-visible:ring-blue-500/50 text-base"
            />
          </div>
          <div className="relative w-full sm:w-auto flex items-center gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-14 w-full sm:w-48 rounded-2xl bg-background/60 border-border/50 focus:ring-blue-500/50 text-base font-medium">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Strength">Strength</SelectItem>
                <SelectItem value="Cardio">Cardio</SelectItem>
                <SelectItem value="Yoga">Yoga</SelectItem>
              </SelectContent>
            </Select>
            <button className="h-14 w-14 flex items-center justify-center shrink-0 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted text-foreground transition-colors">
              <SlidersHorizontal className="size-5" />
            </button>
          </div>
        </Card>

        {/* Classes Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls) => (
              <Card key={cls.id} className="group overflow-hidden rounded-[2rem] border-border/50 bg-card/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                {/* Image Section */}
                <div className="relative h-60 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={cls.image} 
                    alt={cls.name} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background border-0 shadow-lg px-3 py-1 font-bold">
                      {cls.price}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <Badge variant="secondary" className="bg-primary text-primary-foreground border-0 shadow-lg px-3 py-1 font-bold uppercase tracking-wider text-[10px]">
                      {cls.category}
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-foreground line-clamp-1 group-hover:text-blue-500 transition-colors">
                    {cls.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground text-sm font-medium">
                    <Dumbbell className="size-4" />
                    <span>by {cls.trainer}</span>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                    <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-4 text-blue-500" />
                        {cls.duration}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="size-4 text-emerald-500" />
                        {cls.bookings} Booked
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link 
                      href={`/classes/${cls.id}`}
                      className="flex w-full items-center justify-center rounded-2xl bg-foreground text-background hover:bg-blue-600 hover:text-white px-4 py-3.5 text-sm font-bold transition-all shadow-lg active:scale-[0.98]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted/50 mb-4 text-muted-foreground">
                <Search className="size-10" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No classes found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                className="mt-6 font-bold text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
