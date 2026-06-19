"use client";

import { CheckCircle2, Clock, Dumbbell, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { createTrainerApplication } from "@/lib/api/trainerApplications";

export default function ApplyTrainerPage() {
  const { data: session } = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    
    if (!session?.user) {
        setError("You must be logged in to apply.");
        setIsPending(false);
        return;
    }

    const formData = new FormData(e.target);
    const experience = parseInt(formData.get("experience"));
    const specialty = formData.get("specialty");
    const bio = formData.get("description");

    try {
        const applicationData = {
            userId: session.user.id,
            name: session.user.name,
            email: session.user.email,
            experience,
            specialty,
            bio
        };

        const res = await createTrainerApplication(applicationData);
        if (res.message && res.message.includes("already")) {
             setError(res.message);
        } else {
             setIsSubmitted(true);
        }
    } catch (err) {
        setError("Something went wrong. Please try again.");
    } finally {
        setIsPending(false);
    }
  };

  return (
    <div className="mx-auto container space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Become a Trainer</h1>
          <p className="mt-1 text-muted-foreground">
            Share your passion. Join our elite team of fitness instructors.
          </p>
        </div>
      </section>

      {isSubmitted || session?.user?.trainerApplicationStatus === "pending" ? (
        <section className="flex flex-col items-center justify-center rounded-3xl border border-blue-500/20 bg-blue-600/5 p-12 text-center backdrop-blur-xl">
          <div className="flex size-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 mb-6">
            <CheckCircle2 className="size-10" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground">Application Submitted!</h2>
          <p className="mt-4 container text-muted-foreground text-lg">
            Thank you for applying. Your application is now marked as <span className="font-bold text-orange-500">Pending</span>. Our admins will review your profile shortly.
          </p>
        </section>
      ) : (
        <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          
          {/* Aesthetic background accent */}
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-sm font-medium text-red-600 border border-red-500/20 relative z-10">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Experience Input */}
              <div className="space-y-2">
                <label htmlFor="experience" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Clock className="size-4" /> Experience (Years)
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  placeholder="e.g., 5"
                  className="w-full rounded-2xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all"
                  required
                />
              </div>

              {/* Specialty Input */}
              <div className="space-y-2">
                <label htmlFor="specialty" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Dumbbell className="size-4" /> Primary Specialty
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  defaultValue=""
                  className="w-full rounded-2xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                  required
                >
                  <option value="" disabled>Select your specialty...</option>
                  <option value="yoga">Yoga & Flexibility</option>
                  <option value="weights">Weightlifting & Strength</option>
                  <option value="cardio">Cardio & HIIT</option>
                  <option value="pilates">Pilates</option>
                  <option value="martial_arts">Martial Arts</option>
                </select>
              </div>
            </div>

            {/* Why Join Textarea */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <UserRound className="size-4" /> Brief Bio & Qualifications
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Tell us about your training background, certifications, and what you'd like to teach..."
                className="w-full rounded-2xl border border-border/50 bg-background/50 p-4 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ShieldCheck className="size-5" />
                {isPending ? "Submitting..." : "Submit Application"}
              </button>
            </div>

          </form>
        </section>
      )}
    </div>
  );
}
