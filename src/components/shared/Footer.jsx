"use client";

import Link from "next/link";
import { Dumbbell, Phone, Mail, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full bg-zinc-950 text-zinc-300 dark:bg-background dark:text-muted-foreground border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Top Section: Logo & Contact */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-zinc-800 dark:border-border/50">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image 
              src="/GestorFitness-Logo-White.png" 
              alt="GestorFitness Logo" 
              width={180} 
              height={40} 
              className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              priority
            />
          </Link>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-8 text-sm font-medium text-zinc-400 dark:text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="size-4" />
              <span>+1 234 567 890</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <span>support@gestorfitness.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>123 Fitness Ave, NY</span>
            </div>
          </div>

        </div>

        {/* Main Section: Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-10 pb-12">
          
          {/* About Us */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white dark:text-foreground font-bold text-lg uppercase tracking-wider mb-2">About Us</h3>
              <div className="w-10 h-[2px] bg-red-600" />
            </div>
            <p className="text-sm leading-relaxed text-zinc-400 dark:text-muted-foreground">
              GestorFitness is your ultimate fitness companion — discover your perfect workout, connect with passionate trainers, and engage with a thriving community.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="flex items-center justify-center size-8 rounded-full bg-zinc-900 hover:bg-red-600 dark:bg-muted dark:hover:bg-red-600 text-white transition-colors">
                <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="flex items-center justify-center size-8 rounded-full bg-zinc-900 hover:bg-red-600 dark:bg-muted dark:hover:bg-red-600 text-white transition-colors">
                <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
              </a>
              <a href="#" className="flex items-center justify-center size-8 rounded-full bg-zinc-900 hover:bg-red-600 dark:bg-muted dark:hover:bg-red-600 text-white transition-colors">
                <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="flex items-center justify-center size-8 rounded-full bg-zinc-900 hover:bg-red-600 dark:bg-muted dark:hover:bg-red-600 text-white transition-colors">
                <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white dark:text-foreground font-bold text-lg uppercase tracking-wider mb-2">Quick Links</h3>
              <div className="w-10 h-[2px] bg-red-600" />
            </div>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/" className="hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link href="/classes" className="hover:text-red-500 transition-colors">All Classes</Link></li>
              <li><Link href="/forums" className="hover:text-red-500 transition-colors">Community Forum</Link></li>
              <li><Link href="/dashboard" className="hover:text-red-500 transition-colors">Apply as Trainer</Link></li>
              <li><Link href="/register" className="hover:text-red-500 transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white dark:text-foreground font-bold text-lg uppercase tracking-wider mb-2">Programs</h3>
              <div className="w-10 h-[2px] bg-red-600" />
            </div>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/classes?category=Yoga" className="hover:text-red-500 transition-colors">Yoga & Mobility</Link></li>
              <li><Link href="/classes?category=Strength" className="hover:text-red-500 transition-colors">Strength Training</Link></li>
              <li><Link href="/classes?category=Cardio" className="hover:text-red-500 transition-colors">Cardio & HIIT</Link></li>
              <li><Link href="/classes?category=Zumba" className="hover:text-red-500 transition-colors">Zumba Dance</Link></li>
              <li><Link href="/classes?category=Pilates" className="hover:text-red-500 transition-colors">Pilates</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white dark:text-foreground font-bold text-lg uppercase tracking-wider mb-2">Newsletter</h3>
              <div className="w-10 h-[2px] bg-red-600" />
            </div>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Email Address" 
                className="w-full h-12 bg-white text-black border-0 focus-visible:ring-red-600 rounded-md"
              />
              <Button type="submit" className="w-auto bg-red-600 hover:bg-red-700 text-white font-bold tracking-wider uppercase h-11 px-8 rounded-md transition-colors">
                Subscribe
              </Button>
            </form>
            <p className="text-[11px] text-zinc-500 dark:text-muted-foreground/70 leading-tight">
              *Subscribe to our newsletter to receive the latest updates, offers, and fitness tips directly in your inbox.
            </p>
          </div>

        </div>

      </div>

      {/* Bottom Section: Copyright & Legal */}
      <div className="border-t border-zinc-800 dark:border-border/50 bg-black/40 dark:bg-muted/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-500 dark:text-muted-foreground">
          <p>Copyright © {new Date().getFullYear()} GestorFitness. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white dark:hover:text-foreground transition-colors">Privacy Policy</Link>
            <span className="w-px h-3 bg-zinc-700 dark:bg-border"></span>
            <Link href="#" className="hover:text-white dark:hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
