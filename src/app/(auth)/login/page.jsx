"use client";

import { useState } from "react";
import Link from "next/link";
import { MagicCard } from "@/components/ui/magic-card";
import {
  RiMailLine,
  RiLockLine,
  RiArrowRightLine,
  RiTeamFill,
  RiRocketLine,
  RiShieldStarLine,
  RiCheckDoubleLine,
  RiEyeLine,
  RiEyeOffLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleInputChange = (field, value, setter) => {
    setter(value);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    setIsLoading(false);

    if (data?.user) {
      router.push(redirectTo);
    }
    if (error) {
      console.log(error, "error");
      const msg = error.message || "Invalid email or password";
      if (msg.toLowerCase().includes("password")) {
        setErrors({ password: msg });
      } else if (
        msg.toLowerCase().includes("email") ||
        msg.toLowerCase().includes("user")
      ) {
        setErrors({ email: msg });
      } else {
        setErrors({ form: msg });
      }
    }
  };

  const handleGoogleLogin = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    if (data?.user) {
      router.push(redirectTo);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden transition-colors duration-300">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-200 h-150 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-fuchsia-500/5 dark:bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="container w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 px-6 py-12 lg:py-20 relative z-10">
        {/* Left Content Area */}
        <div className="flex flex-col justify-center gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold w-fit">
              <RiRocketLine className="w-4 h-4" />
              <span>Welcome Back</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-tight">
              Log in to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                WorkLix
              </span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
              Access your dashboard, manage your tasks, and continue
              collaborating seamlessly with your team.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-indigo-500 shrink-0">
                <RiTeamFill className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Pick up where you left off
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                  Instantly jump back into your active projects and recent tasks
                  without missing a beat.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-fuchsia-500 shrink-0">
                <RiShieldStarLine className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Secure & Reliable
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                  Your workspace and credentials are protected with
                  enterprise-grade encryption.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-emerald-500 shrink-0">
                <RiCheckDoubleLine className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Stay in the loop
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                  Check your latest notifications, team updates, and project
                  progress in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Area */}
        <div className="flex items-center justify-center lg:justify-end">
          <MagicCard
            mode="orb"
            glowFrom="#6366f1"
            glowTo="#d946ef"
            glowSize={380}
            glowOpacity={0.7}
            className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md shadow-xl"
          >
            <div className="p-8 sm:p-10 flex flex-col gap-8">
              {/* Header */}
              <div className="flex flex-col items-center text-center gap-3">
                <Link
                  href="/"
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2 shadow-lg shadow-purple-500/10"
                >
                  <RiTeamFill className="w-6 h-6 text-white" />
                </Link>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight mt-2 transition-colors">
                  Welcome back
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs leading-relaxed transition-colors">
                  Enter your credentials to access your WorkLix account.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5"
              >
                {/* General form error */}
                {errors.form && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-455 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <RiErrorWarningLine className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errors.form}</span>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    <svg
                      className="w-5 h-5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="grow border-t border-zinc-200 dark:border-zinc-800"></div>
                    <span className="shrink-0 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Or continue with email
                    </span>
                    <div className="grow border-t border-zinc-200 dark:border-zinc-800"></div>
                  </div>
                </div>

                {/* Email input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <RiMailLine className="absolute left-4 w-4.5 h-4.5 text-zinc-400 dark:text-zinc-550 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value, setEmail)
                      }
                      disabled={isLoading}
                      className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl bg-zinc-50/50 dark:bg-zinc-950/40 border text-zinc-950 dark:text-white focus:outline-hidden focus:ring-2 transition-all font-medium disabled:opacity-50 ${
                        errors.email
                          ? "border-rose-500/50 dark:border-rose-500/45 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-zinc-200 dark:border-zinc-800/80 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-500/10"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-rose-600 dark:text-rose-455 text-xs mt-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <RiErrorWarningLine className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </span>
                  )}
                </div>

                {/* Password input */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs font-semibold"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <RiLockLine className="absolute left-4 w-4.5 h-4.5 text-zinc-400 dark:text-zinc-550 pointer-events-none" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) =>
                        handleInputChange(
                          "password",
                          e.target.value,
                          setPassword,
                        )
                      }
                      disabled={isLoading}
                      className={`w-full pl-11 pr-11 py-3 text-sm rounded-xl bg-zinc-50/50 dark:bg-zinc-950/40 border text-zinc-950 dark:text-white focus:outline-hidden focus:ring-2 transition-all font-medium disabled:opacity-50 ${
                        errors.password
                          ? "border-rose-500/50 dark:border-rose-500/45 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-zinc-200 dark:border-zinc-800/80 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-500/10"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 focus:outline-hidden transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <RiEyeOffLine className="w-4.5 h-4.5" />
                      ) : (
                        <RiEyeLine className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-rose-600 dark:text-rose-455 text-xs mt-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <RiErrorWarningLine className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.password}</span>
                    </span>
                  )}
                </div>

                {/* Remember Me */}
                <label className="flex items-start gap-2.5 px-0.5 select-none cursor-pointer group mt-1 w-fit">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      handleInputChange(
                        "rememberMe",
                        e.target.checked,
                        setRememberMe,
                      )
                    }
                    disabled={isLoading}
                    className="w-4 h-4 mt-0.5 rounded-sm border-zinc-300 dark:border-zinc-800 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-zinc-950 shrink-0"
                  />
                  <span className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold leading-normal transition-colors group-hover:text-zinc-850 dark:group-hover:text-zinc-200">
                    Keep me signed in
                  </span>
                </label>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black shadow-lg shadow-indigo-600/15 dark:shadow-white/5 transition-all duration-200 active:scale-[0.98] cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span>Signing In...</span>
                      <svg
                        className="animate-spin h-4 w-4 text-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <RiArrowRightLine className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Navigation */}
              <div className="flex justify-center text-center text-xs">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Don't have an account?{" "}
                  <Link
                    href={`/register?redirect=${redirectTo}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                  >
                    Sign up free
                  </Link>
                </span>
              </div>
            </div>
          </MagicCard>
        </div>
      </div>
    </div>
  );
}
