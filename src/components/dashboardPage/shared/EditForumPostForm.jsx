"use client";

import { ArrowLeft, Image as ImageIcon, MessageSquareText, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getCategories } from "@/lib/api/categories";
import { SuggestCategoryDialog } from "@/components/shared/SuggestCategoryDialog";

import { Card } from "@/components/ui/card";
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
import { updateForumPost } from "@/lib/actions/forumPosts";

export default function EditForumPostForm({ backHref, initialData }) {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [category, setCategory] = useState(initialData?.category || "");
  const fileInputRef = useRef(null);
  
  const [categories, setCategories] = useState([]);

  const fetchCategories = async (newName) => {
    const data = await getCategories("forum");
    setCategories(data);
    if (typeof newName === 'string') {
      setCategory(newName);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    
    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          const objectUrl = URL.createObjectURL(file);
          setImagePreview(objectUrl);
        }, 300);
      }
    }, 150);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !imagePreview) {
      setError("Please select an image");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      let imageUrl = initialData?.image; // keep existing by default

      // 1. Upload new image to imgbb only if a new file was selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        
        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`, {
          method: "POST",
          body: formData,
        });
        const imgbbData = await imgbbRes.json();
        
        if (!imgbbData.success) {
          throw new Error("Failed to upload image");
        }
        
        imageUrl = imgbbData.data.url;
      }

      // 2. Submit post to backend
      const title = e.target.title.value;
      const description = e.target.description.value;
      
      const postData = {
        title,
        description,
        category,
        image: imageUrl || null,
      };

      const res = await updateForumPost(initialData._id, postData);

      if (res.message && res.message.includes("Forbidden")) {
        throw new Error(res.message);
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto container space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex items-center gap-4">
        <Link 
          href={backHref}
          className="flex size-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm hover:bg-muted transition-colors text-muted-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Edit Forum Post</h1>
          <p className="mt-1 text-muted-foreground">
            Update your post details and content below.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <Card className="rounded-3xl border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {error && (
            <div className="rounded-xl bg-red-500/10 p-4 text-sm font-medium text-red-500 border border-red-500/20">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-500/10 p-4 text-sm font-medium text-green-500 border border-green-500/20">
              Post published successfully!
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Input */}
            <div className="space-y-2.5">
              <div className="flex items-center min-h-[24px]">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Post Title
                </Label>
              </div>
              <Input
                id="title"
                type="text"
                defaultValue={initialData?.title}
                placeholder="e.g., Important update to our class schedule..."
                className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-background/50 px-4 font-medium focus-visible:ring-red-500/50 transition-all"
                required
              />
            </div>

            {/* Category Select */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between min-h-[24px]">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category
                </Label>
                <SuggestCategoryDialog type="forum" onSuggested={fetchCategories} />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-14 data-[size=default]:h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-background/50 px-4 font-medium focus:ring-red-500/50 transition-all">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4} className="rounded-2xl border-slate-200 dark:border-slate-800 bg-card/95 backdrop-blur-xl shadow-xl">
                  {categories.length > 0 ? categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.name} className="rounded-xl focus:bg-red-500/10 focus:text-red-600 font-bold cursor-pointer py-3 px-4 my-0.5 mx-1">
                      {cat.name} {cat.status === "pending" && <span className="text-muted-foreground text-xs font-normal ml-2">(Pending)</span>}
                    </SelectItem>
                  )) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">Loading...</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Featured Image
            </Label>

            {imagePreview ? (
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-background/50 aspect-video w-full group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="size-4" /> Remove Image
                  </button>
                </div>
              </div>
            ) : isUploading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-background/50 p-12 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-red-600/10 text-red-600 animate-pulse">
                  <ImageIcon className="size-8 animate-bounce" />
                </div>
                <h3 className="font-bold text-foreground mb-4">Uploading image...</h3>
                <div className="w-full container h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{uploadProgress}% complete</p>
              </div>
            ) : (
              <div 
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors ${
                  dragActive ? "border-red-500 bg-red-500/10" : "border-slate-200 dark:border-slate-800 bg-background/50 hover:bg-muted/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  id="image" 
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                  accept="image/*"
                />
                <div className="flex size-16 items-center justify-center rounded-full bg-red-600/10 text-red-600 mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="size-8" />
                </div>
                <p className="font-bold text-foreground">Drag and drop your image here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse from your computer</p>
                <p className="text-xs text-muted-foreground mt-4 uppercase tracking-wider font-semibold">Max file size: 5MB</p>
              </div>
            )}
          </div>

          {/* Description Textarea */}
          <div className="space-y-2.5">
            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Post Content
            </Label>
            <Textarea
              id="description"
              defaultValue={initialData?.description}
              placeholder="Write the full content of your post here..."
              className="min-h-[250px] rounded-2xl border-slate-200 dark:border-slate-800 bg-background/50 p-4 focus-visible:ring-red-500/50 resize-y transition-all"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 shadow-lg shadow-red-600/20 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <MessageSquareText className="size-5" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </Card>
    </div>
  );
}
