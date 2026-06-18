"use client";

import { ArrowLeft, Image as ImageIcon, MessageSquareText, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function AddForumPostForm({ backHref }) {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

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
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="flex items-center gap-4">
        <Link 
          href={backHref}
          className="flex size-10 items-center justify-center rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-muted transition-colors text-muted-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide">Create Forum Post</h1>
          <p className="mt-1 text-muted-foreground">
            Share announcements, fitness tips, and updates with the community.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <section className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        <form className="space-y-6">
          
          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Post Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Important update to our class schedule..."
              className="w-full rounded-2xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium outline-none focus:bg-background focus:ring-2 focus:ring-blue-500/50 transition-all"
              required
            />
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Featured Image (Imgbb Upload)
            </label>

            {imagePreview ? (
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 aspect-video w-full group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-lg"
                  >
                    <X className="size-4" /> Remove Image
                  </button>
                </div>
              </div>
            ) : isUploading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-background/50 p-12 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 animate-pulse">
                  <ImageIcon className="size-8 animate-bounce" />
                </div>
                <h3 className="font-bold text-foreground mb-4">Uploading image...</h3>
                <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{uploadProgress}% complete</p>
              </div>
            ) : (
              <div 
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors ${
                  dragActive ? "border-blue-500 bg-blue-500/10" : "border-border/50 bg-background/50 hover:bg-muted/50"
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
                  required
                />
                <div className="flex size-16 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="size-8" />
                </div>
                <p className="font-bold text-foreground">Drag and drop your image here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse from your computer</p>
                <p className="text-xs text-muted-foreground mt-4 uppercase tracking-wider font-semibold">Max file size: 5MB</p>
              </div>
            )}
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Post Content
            </label>
            <textarea
              id="description"
              rows={8}
              placeholder="Write the full content of your post here..."
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
              <MessageSquareText className="size-5" />
              Publish Post
            </button>
          </div>

        </form>
      </section>
    </div>
  );
}
