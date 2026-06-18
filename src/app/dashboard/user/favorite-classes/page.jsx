"use client";

import { Dumbbell, ExternalLink, HeartOff, Trash2, UserRound } from "lucide-react";
import Link from "next/link";

const mockFavorites = [
  { id: 1, name: "Evening Yoga Flow", trainer: "Elena Rostova", category: "Mind & Body", price: "$32" },
  { id: 2, name: "HIIT Express", trainer: "Maya Calder", category: "Cardio", price: "$28" },
  { id: 3, name: "Core Control Lab", trainer: "David Miller", category: "Strength", price: "$36" },
];

export default function FavoriteClassesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Favorite Classes</h1>
          <p className="mt-1 text-muted-foreground">
            Classes you've saved for quick access. Ready to book?
          </p>
        </div>
      </section>

      {/* Grid of Favorites */}
      {mockFavorites.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockFavorites.map((cls) => (
            <article 
              key={cls.id} 
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-blue-500/50"
            >
              {/* Aesthetic Graphic Header */}
              <div className="h-32 w-full bg-gradient-to-br from-blue-600/20 to-indigo-900/20 relative flex items-center justify-center overflow-hidden">
                <Dumbbell className="size-12 text-blue-600/30 group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute top-4 right-4 inline-flex rounded-full bg-background/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">
                  {cls.category}
                </span>
              </div>
              
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-heading text-xl font-bold text-foreground">{cls.name}</h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <UserRound className="size-4" />
                  <span className="font-medium">{cls.trainer}</span>
                </div>
                
                <p className="mt-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {cls.price}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <Link 
                    href={`/classes/${cls.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    View Details <ExternalLink className="size-4" />
                  </Link>
                  <button 
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all"
                    aria-label="Remove from favorites"
                    title="Remove from favorites"
                  >
                    <Trash2 className="size-4.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-card/50 backdrop-blur-sm py-24 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted/50 mb-4">
            <HeartOff className="size-10 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">No favorites yet</h2>
          <p className="mt-2 container text-muted-foreground">
            You haven't saved any classes to your favorites. Head over to the Browse Classes page to find your next workout!
          </p>
          <Link 
            href="/classes"
            className="mt-6 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/90 transition-colors"
          >
            Browse Classes
          </Link>
        </section>
      )}

    </div>
  );
}
