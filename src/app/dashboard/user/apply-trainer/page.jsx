"use client";

import { CheckCircle2, Clock, Dumbbell, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";

export default function ApplyTrainerPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would hit the API and change user status to Pending
    setIsSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Become a Trainer</h1>
          <p className="mt-1 text-muted-foreground">
            Share your passion. Join our elite team of fitness instructors.
          </p>
        </div>
      </section>

      {isSubmitted ? (
        <section className="flex flex-col items-center justify-center rounded-3xl border border-blue-500/20 bg-blue-600/5 p-12 text-center backdrop-blur-xl">
          <div className="flex size-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 mb-6">
            <CheckCircle2 className="size-10" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground">Application Submitted!</h2>
          <p className="mt-4 max-w-md text-muted-foreground text-lg">
            Thank you for applying. Your application is now marked as <span className="font-bold text-orange-500">Pending</span>. Our admins will review your profile shortly.
          </p>
        </section>
      ) : (
        <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          
          {/* Aesthetic background accent */}
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Experience Input */}
              <div className="space-y-2">
                <label htmlFor="experience" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Clock className="size-4" /> Experience (Years)
                </label>
                <input
                  id="experience"
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

            {/* Available Time / Schedule */}
            <div className="space-y-2">
              <label htmlFor="availability" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Clock className="size-4" /> Available Training Hours
              </label>
              <input
                id="availability"
                type="text"
                placeholder="e.g., Weekdays 6PM - 9PM, Sat 8AM - 12PM"
                className="w-full rounded-2xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>

            {/* Why Join Textarea */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <UserRound className="size-4" /> Brief Bio & Qualifications
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Tell us about your fitness journey, certifications, and why you want to train at GestorFitness..."
                className="w-full rounded-2xl border border-border/50 bg-background/50 p-4 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <ShieldCheck className="size-5" />
                Submit Application
              </button>
            </div>

          </form>
        </section>
      )}
    </div>
  );
}
