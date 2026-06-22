"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <div className="w-full bg-red-600 rounded-t-[2.5rem] mt-20 relative z-10 -mb-[1px]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 lg:py-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10 text-white">
        
        {/* Left Content */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-[0.2em] text-white">Need Support?</span>
            <div className="h-[2px] w-12 sm:w-20 bg-white/40" />
          </div>
          <h2 className="font-heading text-xl sm:text-3xl lg:text-3xl xl:text-4xl font-black uppercase tracking-tight leading-none mb-4 lg:whitespace-nowrap">
            Got a question? We would be happy to help!
          </h2>
          <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed max-w-3xl">
            Ready to transform your fitness journey? Reach out to our dedicated support team for any inquiries. We are here to guide you every step of the way.
          </p>
        </div>

        {/* Right Button */}
        <div className="shrink-0 w-full sm:w-auto mt-4 lg:mt-0">
          <Button asChild variant="secondary" className="w-full sm:w-auto font-extrabold uppercase tracking-[0.2em] text-[11px] md:text-xs h-14 px-10 shadow-xl transition-all hover:scale-105 active:scale-95">
            <Link href="/contact">
              Contact Us
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
