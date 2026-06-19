"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { createClass } from "@/lib/api/classes";
import { Loader2, Save, XCircle, Info, CalendarClock, Target, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MINUTES = ["00", "15", "30", "45"];

export default function AddClassPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Controlled inputs for complex fields
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  
  // Custom Time Picker State
  const [hour, setHour] = useState("08");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!session?.user) {
      setError("You must be logged in as a trainer to add a class.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.target);
    const title = formData.get("title");
    const duration = formData.get("duration");
    const price = formData.get("price");
    const description = formData.get("description");
    const imageFile = formData.get("image");
    
    const time = `${hour}:${minute} ${ampm}`;

    if (!title || !category || !difficulty || !duration || !price || selectedDays.length === 0 || !description || !imageFile.name) {
      setError("Please fill in all required fields and select an image.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Upload Image to ImgBB
      const imgData = new FormData();
      imgData.append("image", imageFile);

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`, {
        method: "POST",
        body: imgData,
      });
      const imgbbResult = await imgbbRes.json();

      if (!imgbbResult.success) {
        throw new Error("Failed to upload image to ImgBB");
      }

      const imageUrl = imgbbResult.data.url;

      // 2. Submit Class Data
      const classData = {
        trainerId: session.user.id,
        trainerName: session.user.name,
        title,
        image: imageUrl,
        category,
        difficulty,
        duration,
        price: parseFloat(price),
        scheduleDays: selectedDays,
        time,
        description,
      };

      const res = await createClass(classData);
      if (res.message && res.message.includes("Failed")) {
        throw new Error(res.message);
      }

      // Success! Redirect to class list
      router.push("/dashboard/trainer/classes");
    } catch (err) {
      setError(err.message || "An unexpected error occurred while adding the class.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Add New Class</h1>
          <p className="mt-1 text-muted-foreground">
            Structure your new fitness class and submit it for platform approval.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive border border-destructive/20 flex items-center gap-2">
          <XCircle className="size-5 shrink-0" /> <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <Card className="rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/50 backdrop-blur-xl shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                    <Info className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Basic Information</CardTitle>
                    <CardDescription>Core details about what you'll be teaching.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-sm font-bold text-foreground">Class Name</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Power Yoga Flow"
                    className="h-11 bg-background/50"
                    required
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-foreground">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-11 bg-background/50">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-foreground">Difficulty Level</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="h-11 bg-background/50">
                        <SelectValue placeholder="Select Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="All Levels">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-bold text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a detailed description of what members can expect..."
                    className="min-h-[120px] resize-y bg-background/50"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Scheduling */}
            <Card className="rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/50 backdrop-blur-xl shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <CalendarClock className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Scheduling</CardTitle>
                    <CardDescription>When does this class take place?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Active Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`h-10 px-4 rounded-xl text-sm font-bold transition-colors border ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background/50 border-input text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  {selectedDays.length === 0 && (
                    <p className="text-xs text-muted-foreground">Please select at least one day.</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Class Time</Label>
                  <div className="flex items-center gap-2 max-w-sm">
                    <div className="flex-1">
                      <Select value={hour} onValueChange={setHour}>
                        <SelectTrigger className="h-11 bg-background/50 font-medium">
                          <SelectValue placeholder="HH" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          {HOURS.map((h) => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <span className="text-muted-foreground font-bold">:</span>
                    <div className="flex-1">
                      <Select value={minute} onValueChange={setMinute}>
                        <SelectTrigger className="h-11 bg-background/50 font-medium">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {MINUTES.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Select value={ampm} onValueChange={setAmpm}>
                        <SelectTrigger className="h-11 bg-background/50 font-bold">
                          <SelectValue placeholder="AM/PM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Right Column (Settings & Submit) */}
          <div className="space-y-6">
            
            <Card className="rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/50 backdrop-blur-xl shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
                    <Target className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Details & Media</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-3">
                  <Label htmlFor="image" className="text-sm font-bold text-foreground">Cover Image</Label>
                  <div className="relative group">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="h-12 bg-background/50 pt-2.5 cursor-pointer file:cursor-pointer file:font-medium text-sm"
                      required
                    />
                    <ImageIcon className="absolute right-3 top-3.5 size-5 text-muted-foreground pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted-foreground">Upload a high quality 16:9 image.</p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="duration" className="text-sm font-bold text-foreground">Duration (Mins)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    placeholder="e.g. 60"
                    className="h-11 bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="price" className="text-sm font-bold text-foreground">Price per Class ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="25.00"
                    className="h-11 bg-background/50"
                    required
                  />
                </div>

              </CardContent>
            </Card>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl gap-2 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 text-base"
            >
              {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
              {isSubmitting ? "Submitting Class..." : "Submit Class"}
            </Button>
            
            <p className="text-center text-xs text-muted-foreground mt-4">
              Submitted classes must be approved by an administrator before they are visible to the public.
            </p>

          </div>
        </div>
      </form>
    </div>
  );
}
