"use client";

import { ArrowLeft, CalendarClock, CheckCircle2, Clock, DollarSign, Dumbbell, FileText, ShieldAlert, UploadCloud, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AddClassPage() {
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

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

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <div className="container space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
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
        <Card className="flex flex-col items-center justify-center border-blue-500/20 bg-blue-600/5 p-12 text-center backdrop-blur-xl max-w-3xl mx-auto rounded-3xl">
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
              onClick={() => { setIsSubmitted(false); setSelectedDays([]); }}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
            >
              Submit Another Class
            </button>
          </div>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-xl rounded-3xl">
          <form onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left & Center Columns: Core Fields */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Title Input */}
                <div className="space-y-2.5">
                  <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Video className="size-4" /> Class Name
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Power Yoga Flow"
                    className="h-12 rounded-2xl border-border/50 bg-background/50 px-4 font-medium focus-visible:ring-blue-500/50 transition-all"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Category Input */}
                  <div className="space-y-2.5">
                    <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Dumbbell className="size-4" /> Category
                    </Label>
                    <Select defaultValue="yoga" required>
                      <SelectTrigger id="category" className="h-12 rounded-2xl border-border/50 bg-background/50 px-4 font-medium focus:ring-blue-500/50 transition-all">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="cardio">Cardio</SelectItem>
                        <SelectItem value="yoga">Yoga</SelectItem>
                        <SelectItem value="mind">Mind & Body</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Difficulty Level */}
                  <div className="space-y-2.5">
                    <Label htmlFor="difficulty" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <ShieldAlert className="size-4" /> Difficulty Level
                    </Label>
                    <Select defaultValue="beginner" required>
                      <SelectTrigger id="difficulty" className="h-12 rounded-2xl border-border/50 bg-background/50 px-4 font-medium focus:ring-blue-500/50 transition-all">
                        <SelectValue placeholder="Select Difficulty" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="all">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  {/* Duration */}
                  <div className="space-y-2.5">
                    <Label htmlFor="duration" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Clock className="size-4" /> Duration
                    </Label>
                    <Input
                      id="duration"
                      type="text"
                      placeholder="e.g. 60 mins"
                      className="h-12 rounded-2xl border-border/50 bg-background/50 px-4 font-medium focus-visible:ring-blue-500/50 transition-all"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-2.5">
                    <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <DollarSign className="size-4" /> Price ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="25"
                      className="h-12 rounded-2xl border-border/50 bg-background/50 px-4 font-medium focus-visible:ring-blue-500/50 transition-all"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-2.5">
                    <Label htmlFor="time" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Clock className="size-4" /> Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      defaultValue="08:00"
                      className="h-12 rounded-2xl border-border/50 bg-background/50 px-4 font-medium focus-visible:ring-blue-500/50 transition-all block w-full"
                      required
                    />
                  </div>
                </div>

                {/* Schedule Days */}
                <div className="space-y-3 pt-1">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <CalendarClock className="size-4" /> Class Schedule Days
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                            isSelected 
                              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                              : "bg-background/50 text-muted-foreground hover:bg-muted border border-border/50"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Image Upload Area */}
              <div className="lg:col-span-1 space-y-2.5 h-full">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <UploadCloud className="size-4" /> Class Cover Image
                </Label>
                <div 
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors h-[calc(100%-2.25rem)] min-h-[300px] ${
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
                  <p className="font-bold text-foreground text-center">Drag & drop image</p>
                  <p className="text-sm text-muted-foreground mt-1 text-center">or click to browse</p>
                  <div className="mt-4 rounded-xl bg-background/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    ImgBB Upload
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Description & Submit */}
            <div className="mt-8 space-y-6">
              
              {/* Description Textarea */}
              <div className="space-y-2.5">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <FileText className="size-4" /> Description
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the class..."
                  className="rounded-2xl border-border/50 bg-background/50 p-4 font-medium focus-visible:ring-blue-500/50 resize-none transition-all"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  type="submit"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <CheckCircle2 className="size-5" />
                  Add Class
                </button>
              </div>

            </div>

          </form>
        </Card>
      )}
    </div>
  );
}
