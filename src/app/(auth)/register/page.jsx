"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Image as ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Dumbbell,
  Activity,
  Calendar,
  Eye,
  EyeOff,
  UploadCloud
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const passwordRules = [
  "At least 6 characters",
  "One uppercase letter",
  "One lowercase letter",
];

const validateForm = (form) => {
  const nextErrors = {};
  const trimmedName = form.name.trim();
  const trimmedEmail = form.email.trim();

  if (!trimmedName) {
    nextErrors.name = "Name is required.";
  }

  if (!trimmedEmail) {
    nextErrors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!form.password) {
    nextErrors.password = "Password is required.";
  } else if (form.password.length < 6) {
    nextErrors.password = "Password must be at least 6 characters.";
  } else if (!/[A-Z]/.test(form.password)) {
    nextErrors.password = "Password needs one uppercase letter.";
  } else if (!/[a-z]/.test(form.password)) {
    nextErrors.password = "Password needs one lowercase letter.";
  }

  if (!form.confirmPassword) {
    nextErrors.confirmPassword = "Confirm your password.";
  } else if (form.confirmPassword !== form.password) {
    nextErrors.confirmPassword = "Passwords do not match.";
  }

  return nextErrors;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const RegisterPage = () => {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) {
        setErrors((currentErrors) => {
          const nextErrors = { ...currentErrors };
          delete nextErrors.image;
          return nextErrors;
        });
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    let imageUrl = undefined;
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("image", imageFile);
        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`, {
          method: "POST",
          body: formData,
        });
        const imgbbData = await imgbbResponse.json();
        if (imgbbData.success) {
          imageUrl = imgbbData.data.display_url;
        } else {
          setStatus({
            type: "error",
            text: "Failed to upload profile image. Please try again."
          });
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        setStatus({
          type: "error",
          text: "Failed to upload profile image. Check your connection."
        });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        image: imageUrl,
        password: form.password,
        rememberMe: true,
      });

      if (response?.error) {
        setStatus({
          type: "error",
          text:
            response.error.message ||
            "Registration failed. Please review your details and try again.",
        });
        return;
      }

      setForm(initialForm);
      setErrors({});
      setStatus({
        type: "success",
        text: "Account created. Redirecting you to the home page...",
      });
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error?.message ||
          "Registration failed. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex">
      {/* Left side - Decorative & Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-950" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/30 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-orange-500/20 blur-[120px]"
        />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 lg:p-16 text-white h-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight w-fit group">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                GestorFitness
              </span>
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8 max-w-lg"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Unlock your true <br/>
                <span className="text-blue-400">fitness potential</span>.
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                Join thousands of members tracking their progress, booking top trainers, and engaging with our fitness community.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                <Dumbbell className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-white mb-1">Expert Trainers</h3>
                <p className="text-sm text-slate-400">Book sessions with certified professionals.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                <Calendar className="w-8 h-8 text-orange-400 mb-3" />
                <h3 className="font-semibold text-white mb-1">Easy Scheduling</h3>
                <p className="text-sm text-slate-400">Manage your classes with a unified calendar.</p>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4 text-sm text-slate-400"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center z-[${5-i}]`}>
                  <User className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
            <p>Join <span className="text-white font-semibold">10,000+</span> members today</p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile Header */}
            <Link
              href="/"
              className="flex lg:hidden items-center gap-2 text-xl font-bold tracking-tight text-foreground mb-8"
            >
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              GestorFitness
            </Link>

            <div className="mb-8 space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Create an account
              </h2>
              <p className="text-muted-foreground">
                Enter your details below to start your fitness journey.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {status && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className={`overflow-hidden rounded-xl border ${
                    status.type === "error"
                      ? "border-destructive/20 bg-destructive/10 text-destructive"
                      : "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
                  }`}
                >
                  <div className="flex items-center gap-3 p-4 text-sm font-medium">
                    {status.type === "error" ? (
                      <AlertCircle className="w-5 h-5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    )}
                    <p>{status.text}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="space-y-4">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-blue-600 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className={`h-12 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 ${
                        errors.name ? "border-destructive focus:border-destructive focus:ring-destructive/10" : "border-input"
                      }`}
                      placeholder="John Doe"
                      aria-invalid={Boolean(errors.name)}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-xs text-destructive mt-1">
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-blue-600 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`h-12 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 ${
                        errors.email ? "border-destructive focus:border-destructive focus:ring-destructive/10" : "border-input"
                      }`}
                      placeholder="john@example.com"
                      aria-invalid={Boolean(errors.email)}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-xs text-destructive mt-1">
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Image Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex justify-between" htmlFor="image">
                    <span>Profile Image</span>
                    <span className="text-muted-foreground text-xs font-normal">Optional</span>
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 border border-border">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <label 
                      htmlFor="image"
                      className={`relative flex flex-1 items-center justify-center gap-2 h-12 rounded-xl border border-dashed cursor-pointer transition-all hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:border-blue-300 focus-within:ring-4 focus-within:ring-blue-600/10 focus-within:border-blue-600 ${
                        errors.image ? "border-destructive text-destructive hover:border-destructive" : "border-input text-muted-foreground hover:text-blue-600"
                      }`}
                    >
                      <UploadCloud className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {imageFile ? "Change image" : "Upload image"}
                      </span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                        aria-invalid={Boolean(errors.image)}
                      />
                    </label>
                  </div>
                  <AnimatePresence>
                    {errors.image && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-xs text-destructive mt-1">
                        {errors.image}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="password">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-blue-600 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      className={`h-12 w-full rounded-xl border bg-background pl-10 pr-12 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 ${
                        errors.password ? "border-destructive focus:border-destructive focus:ring-destructive/10" : "border-input"
                      }`}
                      placeholder="Create a strong password"
                      aria-invalid={Boolean(errors.password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Password Rules */}
                  <div className="pt-1 flex flex-wrap gap-2">
                    {passwordRules.map((rule) => {
                      // simple checks to colorize rules if typing
                      let isMet = false;
                      if (form.password) {
                        if (rule.includes("6 characters") && form.password.length >= 6) isMet = true;
                        if (rule.includes("uppercase") && /[A-Z]/.test(form.password)) isMet = true;
                        if (rule.includes("lowercase") && /[a-z]/.test(form.password)) isMet = true;
                      }
                      
                      return (
                        <div key={rule} className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${isMet ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isMet ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                          {rule}
                        </div>
                      );
                    })}
                  </div>
                  
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-xs text-destructive mt-1">
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-blue-600 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={`h-12 w-full rounded-xl border bg-background pl-10 pr-12 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 ${
                        errors.confirmPassword ? "border-destructive focus:border-destructive focus:ring-destructive/10" : "border-input"
                      }`}
                      placeholder="Repeat your password"
                      aria-invalid={Boolean(errors.confirmPassword)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.confirmPassword && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-xs text-destructive mt-1">
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/30 hover:-translate-y-0.5 mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </motion.div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create account
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-foreground hover:text-blue-600 transition-colors"
              >
                Sign in instead
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;

