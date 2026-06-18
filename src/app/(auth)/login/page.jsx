"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Dumbbell,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

const initialForm = {
  email: "",
  password: "",
};

const validateForm = (form) => {
  const nextErrors = {};
  const trimmedEmail = form.email.trim();

  if (!trimmedEmail) {
    nextErrors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!form.password) {
    nextErrors.password = "Password is required.";
  }

  return nextErrors;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    try {
      const response = await signIn.email({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        rememberMe: true,
      });

      if (response?.error) {
        setStatus({
          type: "error",
          text:
            response.error.message ||
            "Login failed. Please check your credentials and try again.",
        });
        return;
      }

      setForm(initialForm);
      setErrors({});
      setStatus({
        type: "success",
        text: "Login successful. Redirecting to dashboard...",
      });
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error?.message ||
          "Login failed. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setStatus(null);
    setIsGoogleSubmitting(true);
    try {
      const response = await signIn.social({
        provider: "google",
      });
      if (response?.error) {
        setStatus({
          type: "error",
          text:
            response.error.message ||
            "Google login failed. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error?.message ||
          "Google login failed. Please check your connection and try again.",
      });
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background py-8 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex w-full bg-card rounded-3xl overflow-hidden border border-border shadow-2xl min-h-[750px]">
          {/* Left side - Decorative & Brand */}
          <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-950" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/30 blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-orange-500/20 blur-[120px]"
            />

            <div className="relative z-10 flex flex-col justify-between w-full p-12 lg:p-16 text-white h-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Link
                  href="/"
                  className="flex items-center gap-2 text-2xl w-fit group"
                >
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
                className="space-y-8 container"
              >
                <motion.div variants={fadeInUp} className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl">
                    Welcome back to <br />
                    <span className="text-blue-400">your fitness journey</span>.
                  </h1>
                  <p className="text-lg text-slate-300 leading-relaxed">
                    Sign in to book sessions, track your progress, and reconnect with your trainers.
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10"
                >
                  <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                    <Dumbbell className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="text-white mb-1">Stay Active</h3>
                    <p className="text-sm text-slate-400">
                      View your upcoming and past sessions.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                    <Calendar className="w-8 h-8 text-orange-400 mb-3" />
                    <h3 className="text-white mb-1">Seamless Booking</h3>
                    <p className="text-sm text-slate-400">
                      Access top trainers in a few clicks.
                    </p>
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
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center z-[${
                        5 - i
                      }]`}
                    >
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
                <p>
                  Join <span className="text-white font-semibold">10,000+</span>{" "}
                  members today
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
            <div className="w-full container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Mobile Header */}
                <Link
                  href="/"
                  className="flex lg:hidden items-center gap-2 text-xl text-foreground mb-8"
                >
                  <div className="bg-blue-600 p-1.5 rounded-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  GestorFitness
                </Link>

                <div className="mb-8 space-y-2">
                  <h2 className="text-3xl text-foreground">
                    Sign in
                  </h2>
                  <p className="text-muted-foreground">
                    Enter your email and password to access your account.
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

                {/* Google Sign In */}
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleSubmitting}
                  className="w-full h-12 text-base font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl shadow-sm transition-all flex items-center justify-center gap-3 mb-6"
                >
                  {isGoogleSubmitting ? (
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label
                        className="text-sm font-medium text-foreground"
                        htmlFor="email"
                      >
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
                            errors.email
                              ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                              : "border-input"
                          }`}
                          placeholder="john@example.com"
                          aria-invalid={Boolean(errors.email)}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs text-destructive mt-1"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          className="text-sm font-medium text-foreground"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <Link
                          href="/forgot-password"
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
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
                            errors.password
                              ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                              : "border-input"
                          }`}
                          placeholder="Enter your password"
                          aria-invalid={Boolean(errors.password)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <AnimatePresence>
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs text-destructive mt-1"
                          >
                            {errors.password}
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
                        Signing in...
                      </motion.div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-foreground hover:text-blue-600 transition-colors"
                  >
                    Create account
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
