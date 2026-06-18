"use client";

import { ArrowLeft, CheckCircle2, Clock, DollarSign, Dumbbell, FileText, UploadCloud, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AddClassPage() {
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API submission
    setIsSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex items-center gap-4">
        <Link 
          href="/dashboard/trainer/classes"
          className="flex size-10 items-center justify-center rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-muted transition-colors text-muted-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Submit New Class</h1>
          <p className="mt-1 text-muted-foreground">
            Create a new fitness class. Submissions will be reviewed by an admin.
          </p>
        </div>
      </section>

      {isSubmitted ? (
        <section className="flex flex-col items-center justify-center rounded-3xl border border-blue-500/20 bg-blue-600/5 p-12 text-center backdrop-blur-xl">
          <div className="flex size-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 mb-6">
            <CheckCircle2 className="size-10" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground">Class Submitted Successfully!</h2>
          <p className="mt-4 max-w-md text-muted-foreground text-lg">
            Your class is currently in a <span className="font-bold text-orange-500">Pending</span> state. You will be notified once an Admin approves it.
          </p>
          <div className="mt-8 flex gap-4">
            <Link 
              href="/dashboard/trainer/classes"
              className="rounded-xl border border-border/50 bg-background/50 px-6 py-3 text-sm font-bold text-foreground hover:bg-muted transition-colors"
            >
              Back to My Classes
            </Link>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
            >
              Submit Another Class
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Video className="size-4" /> Class Name
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Advanced Powerlifting Mechanics"
                className="w-full rounded-2xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Category Input */}
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Dumbbell className="size-4" /> Category
                </label>
                <select
                  id="category"
                  defaultValue=""
                  className="w-full rounded-2xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                  required
                >
                  <option value="" disabled>Select category...</option>
                  <option value="strength">Strength & Weights</option>
                  <option value="cardio">Cardio & HIIT</option>
                  <option value="yoga">Yoga & Flexibility</option>
                  <option value="mind">Mind & Body</option>
                </select>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Clock className="size-4" /> Duration (mins)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    min="15"
                    step="15"
                    placeholder="60"
                    className="w-full rounded-2xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <DollarSign className="size-4" /> Price ($)
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="25.00"
                    className="w-full rounded-2xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Class Cover Image (Imgbb Upload)
              </label>
              <div 
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors ${
                  dragActive ? "border-blue-500 bg-blue-500/10" : "border-border/50 bg-background/50 hover:bg-muted/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
              >
                <input 
                  type="file" 
                  id="image" 
                  className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                  accept="image/*"
                  required
                />
                <div className="flex size-16 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 mb-4">
                  <UploadCloud className="size-8" />
                </div>
                <p className="font-bold text-foreground">Drag and drop your image here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse from your computer</p>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="size-4" /> Description
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Describe what the class entails, the required fitness level, and what students should expect..."
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
                <CheckCircle2 className="size-5" />
                Submit Class for Review
              </button>
            </div>

          </form>
        </section>
      )}
    </div>
  );
}
