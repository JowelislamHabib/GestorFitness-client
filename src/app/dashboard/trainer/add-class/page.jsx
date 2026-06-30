"use client";

import { createClass } from "@/lib/api/classes";
import { useSession } from "@/lib/auth-client";
import { CalendarClock, ImageIcon, Info, Loader2, Save, Target, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCategories } from "@/lib/api/categories";
import { SuggestCategoryDialog } from "@/components/shared/SuggestCategoryDialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
  const [focus, setFocus] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  
  // Image Upload State
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Custom Time Picker State
  const [hour, setHour] = useState("08");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");

  const [categories, setCategories] = useState([]);
  
  const fetchCategories = async (newName) => {
    const data = await getCategories("class");
    if (typeof newName === 'string') {
      const newCat = { _id: "pending-" + Date.now(), name: newName, status: "pending" };
      setCategories([...data, newCat]);
      setCategory(newName);
    } else {
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setError(null);
    
    try {
      const imgData = new FormData();
      imgData.append("image", file);

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`, {
        method: "POST",
        body: imgData,
      });
      const imgbbResult = await imgbbRes.json();

      if (!imgbbResult.success) {
        throw new Error("Failed to upload image to ImgBB");
      }

      setImageUrl(imgbbResult.data.url);
    } catch (err) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
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
    const estBurn = formData.get("estBurn");
    
    const time = `${hour}:${minute} ${ampm}`;

    if (!title || !category || !difficulty || !focus || !estBurn || !duration || !price || selectedDays.length === 0 || !description || !imageUrl) {
      setError("Please fill in all required fields and ensure the cover image has finished uploading.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit Class Data
      const classData = {
        trainerId: session.user.id,
        trainerName: session.user.name,
        title,
        image: imageUrl,
        category,
        difficulty,
        focus,
        estBurn: parseInt(estBurn, 10),
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

      toast.success("Class submitted successfully!");

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
                  <div className="p-2 rounded-lg bg-red-600/10 text-red-600">
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
                    <div className="flex items-center justify-between min-h-[24px]">
                      <Label className="text-sm font-bold text-foreground">Category</Label>
                      <SuggestCategoryDialog type="class" onSuggested={fetchCategories} />
                    </div>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="!h-11 bg-background/50">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.length > 0 ? categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat.name}>
                            {cat.name} {cat.status === "pending" && <span className="text-muted-foreground text-xs ml-2">(Pending)</span>}
                          </SelectItem>
                        )) : (
                          <div className="p-2 text-sm text-muted-foreground text-center">Loading...</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center min-h-[24px]">
                      <Label className="text-sm font-bold text-foreground">Difficulty Level</Label>
                    </div>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="!h-11 bg-background/50">
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

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-foreground">Focus Area</Label>
                    <Select value={focus} onValueChange={setFocus}>
                      <SelectTrigger className="!h-11 bg-background/50">
                        <SelectValue placeholder="Select Focus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Body">Full Body</SelectItem>
                        <SelectItem value="Upper Body">Upper Body</SelectItem>
                        <SelectItem value="Lower Body">Lower Body</SelectItem>
                        <SelectItem value="Core">Core</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                        <SelectItem value="Endurance">Endurance</SelectItem>
                        <SelectItem value="Balance">Balance</SelectItem>
                        <SelectItem value="Recovery">Recovery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="estBurn" className="text-sm font-bold text-foreground">Estimated Burn (Kcal)</Label>
                    <Input
                      id="estBurn"
                      name="estBurn"
                      type="number"
                      min="50"
                      placeholder="e.g. 450"
                      className="h-11 bg-background/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
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
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-bold text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a detailed description of what members can expect..."
                    className="min-h-[160px] resize-y bg-background/50"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Settings & Submit) */}
          <div className="space-y-6">
            
            {/* Media */}
            <Card className="rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/50 backdrop-blur-xl shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-red-600/10 text-red-600">
                    <Target className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Media</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Cover Image</Label>
                  <div className="border-2 border-dashed border-border/60 bg-background/30 rounded-[calc(var(--radius)*1.2)] p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group relative overflow-hidden min-h-[180px]">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
                    />
                    
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center justify-center z-10">
                        <Loader2 className="size-8 text-red-600 animate-spin mb-3" />
                        <p className="text-sm font-bold text-foreground">Uploading Image...</p>
                        <p className="text-xs text-muted-foreground mt-1">Please wait</p>
                      </div>
                    ) : imageUrl ? (
                      <div className="absolute inset-0 z-10 bg-background">
                        <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Click to Change Image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center z-10 pointer-events-none">
                        <div className="p-4 bg-red-600/10 text-red-600 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                          <ImageIcon className="size-8" />
                        </div>
                        <p className="text-sm font-bold text-foreground">Click to upload cover image</p>
                        <p className="text-xs text-muted-foreground mt-1.5 font-medium">SVG, PNG, JPG or GIF (max. 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Scheduling */}
            <Card className="rounded-[calc(var(--radius)*1.5)] border-border/50 bg-card/50 backdrop-blur-xl shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-red-600/10 text-red-600">
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
                  <div className="flex gap-1.5">
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`flex-1 h-10 rounded-xl text-xs font-bold transition-colors border ${
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
                        <SelectTrigger className="!h-11 bg-background/50 font-medium px-3">
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
                        <SelectTrigger className="!h-11 bg-background/50 font-medium px-3">
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
                        <SelectTrigger className="!h-11 bg-background/50 font-bold px-3">
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

            <Button 
              type="submit" 
              size="lg"
              disabled={isSubmitting}
              className="w-full rounded-xl gap-2 font-bold bg-red-600 hover:bg-red-700 !text-white shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
            >
              {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
              {isSubmitting ? "Submitting Class..." : "Submit Class"}
            </Button>
            
            <p className="text-center text-xs text-muted-foreground mt-4">
              Classes must be approved by an admin before they are visible to the public.
            </p>

          </div>
        </div>
      </form>
    </div>
  );
}
