"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-background p-6 py-12 md:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full text-center space-y-8 flex flex-col items-center"
      >
        
        {/* Illustration */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          className="relative flex size-32 md:size-48 items-center justify-center rounded-full bg-red-600/10 shadow-[0_0_40px_rgba(220,38,38,0.2)]"
        >
          <ShieldAlert className="size-16 md:size-24 text-red-600 drop-shadow-xl" />
        </motion.div>

        {/* Typography */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight">
            Access <span className="text-red-600">Restricted</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-500">
            You don't have permission to view this page.
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Please make sure you are logged in with an account that has the required privileges to access this area.
          </p>
        </motion.div>

        {/* Action */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-4 flex flex-col sm:flex-row gap-4"
        >
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-14 px-8 text-lg font-bold shadow-lg shadow-red-600/20 transition-all hover:-translate-y-1">
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-zinc-900/10 bg-zinc-100 hover:bg-zinc-200 text-neutral-600 rounded-xl h-14 px-8 text-lg font-bold transition-all">
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
