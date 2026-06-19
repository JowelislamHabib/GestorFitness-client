"use client";

import { CheckCircle2, Clock, Dumbbell, ShieldCheck, UserRound, XCircle, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { createTrainerApplication, getTrainerApplications } from "@/lib/api/trainerApplications";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ApplyTrainerPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [hasExistingApp, setHasExistingApp] = useState(false);
  const [checkingApp, setCheckingApp] = useState(true);
  const [rejectedApp, setRejectedApp] = useState(null);
  const [isReapplying, setIsReapplying] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      getTrainerApplications(null, session.user.id)
        .then(apps => {
          if (Array.isArray(apps) && apps.length > 0) {
            const activeApp = apps.find(app => app.status === "pending" || app.status === "approved");
            if (activeApp) {
              setHasExistingApp(true);
            } else if (apps[0].status === "rejected") {
              // The most recent application is rejected
              setRejectedApp(apps[0]);
            }
          }
          setCheckingApp(false);
        })
        .catch(() => setCheckingApp(false));
    } else if (!sessionPending) {
        setCheckingApp(false);
    }
  }, [session, sessionPending]);

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
             setIsReapplying(false);
        }
    } catch (err) {
        setError("Something went wrong. Please try again.");
    } finally {
        setIsPending(false);
    }
  };

  if (checkingApp) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground animate-pulse">Checking application status...</p>
      </div>
    );
  }

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

      {isSubmitted || hasExistingApp || session?.user?.trainerApplicationStatus === "pending" ? (
        <Card className="flex flex-col items-center justify-center border-blue-500/20 bg-blue-600/5 p-12 text-center backdrop-blur-xl shadow-xl">
          <div className="flex size-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 mb-6">
            <CheckCircle2 className="size-10" />
          </div>
          <CardTitle className="text-3xl font-bold">Application Submitted!</CardTitle>
          <CardDescription className="mt-4 text-lg">
            Thank you for applying. Your application is now marked as <span className="font-bold text-orange-500">Pending</span>. Our admins will review your profile shortly.
          </CardDescription>
        </Card>
      ) : rejectedApp && !isReapplying ? (
        <Card className="border-red-500/20 bg-red-500/5 shadow-xl backdrop-blur-xl overflow-hidden relative">
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
          <CardHeader className="text-center pb-2 relative z-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4 shadow-sm border border-red-200">
              <XCircle className="size-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Application Not Approved</CardTitle>
            <CardDescription className="text-base mt-2">
              We have reviewed your recent application to become a trainer.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6 relative z-10 container mx-auto">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 shadow-inner">
              <h4 className="text-sm font-bold uppercase tracking-wider text-red-800 dark:text-red-400 mb-2">Admin Feedback</h4>
              <p className="text-sm font-medium text-red-900 dark:text-red-200 whitespace-pre-wrap">
                {rejectedApp.feedback || "Your application did not meet our criteria at this time."}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center mt-6 pb-10 relative z-10">
            <Button 
              size="lg" 
              onClick={() => setIsReapplying(true)}
              className="gap-2 bg-foreground text-background hover:bg-foreground/90 font-bold"
            >
              <RotateCcw className="size-4" /> Re-Apply Now
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-xl relative overflow-hidden">
          
          {/* Aesthetic background accent */}
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <CardHeader className="relative z-10 border-b border-border/50 pb-6 mb-6">
            <CardTitle className="text-2xl font-bold">Trainer Application</CardTitle>
            <CardDescription>Fill out your details below. We look forward to having you on board.</CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">
            {error && (
              <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-sm font-medium text-red-600 border border-red-500/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Experience Input */}
                <div className="space-y-3">
                  <Label htmlFor="experience" className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Clock className="size-3.5" /> Experience (Years)
                  </Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    className="h-12 rounded-xl bg-background/50 text-base"
                    required
                  />
                </div>

                {/* Specialty Input */}
                <div className="space-y-3">
                  <Label htmlFor="specialty" className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Dumbbell className="size-3.5" /> Primary Specialty
                  </Label>
                  <select
                    id="specialty"
                    name="specialty"
                    defaultValue=""
                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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

              {/* Bio Textarea */}
              <div className="space-y-3 pt-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <UserRound className="size-3.5" /> Brief Bio & Qualifications
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Tell us about your training background, certifications, and what you'd like to teach..."
                  className="rounded-xl bg-background/50 text-base resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit"
                  disabled={isPending}
                  size="lg"
                  className="w-full gap-2 rounded-xl bg-blue-600 text-base font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <ShieldCheck className="size-5" />
                  {isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
