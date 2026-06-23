"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getClasses } from "@/lib/api/classes";
import { getUserFavorites, addFavorite, removeFavorite } from "@/lib/api/favorites";
import { HeartOff } from "lucide-react";
import Link from "next/link";
import ClassCard from "@/components/classes/ClassCard";
import DashboardLoading from "@/components/dashboardPage/shared/DashboardLoading";
import { toast } from "sonner";

export default function DashboardFavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      Promise.all([
        getClasses(),
        getUserFavorites(session.user.id)
      ])
        .then(([allClassesData, userFavIds]) => {
          const allClasses = allClassesData?.classes || [];
          setClasses(Array.isArray(allClasses) ? allClasses : []);
          setFavorites(Array.isArray(userFavIds) ? userFavIds : []);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else if (session === null) {
      setIsLoading(false);
    }
  }, [session]);

  const handleToggleFavorite = async (classId) => {
    if (!session?.user?.id) return;
    
    const isFavorited = favorites.includes(classId);
    
    // Optimistic update
    setFavorites(prev => 
      isFavorited ? prev.filter(id => id !== classId) : [...prev, classId]
    );

    try {
      if (isFavorited) {
        await removeFavorite(session.user.id, classId);
        toast.success("Removed from your favorites!");
      } else {
        await addFavorite(session.user.id, classId);
        toast.success("Successfully added to your favorites!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update favorites");
      // Revert optimistic update
      setFavorites(prev => 
        isFavorited ? [...prev, classId] : prev.filter(id => id !== classId)
      );
    }
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  const favoriteClasses = classes.filter(cls => favorites.includes(cls._id));

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
      {favoriteClasses.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteClasses.map((cls) => (
            <ClassCard 
              key={cls._id} 
              cls={cls} 
              isFavorited={favorites.includes(cls._id)} 
              onToggleFavorite={handleToggleFavorite} 
            />
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
