import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center bg-background p-6 py-12 md:py-24">
        
        <div className="max-w-3xl w-full text-center space-y-8 flex flex-col items-center">
          
          {/* Illustration */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
            <Image 
              src="/images/man-lifting-dumbbells.png" 
              alt="404 Fitness Illustration" 
              fill
              className="object-contain drop-shadow-2xl dark:brightness-90 transition-transform hover:scale-105 duration-500"
              priority
            />
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-black text-red-600 tracking-tighter">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Looks like you missed a rep.
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              We couldn't find the page you're looking for. Let's get you back on track with your fitness journey.
            </p>
          </div>

          {/* Action */}
          <div className="pt-4">
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-14 px-8 text-lg font-semibold shadow-lg shadow-red-600/20 transition-all hover:shadow-red-600/30 hover:-translate-y-1">
              <Link href="/">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
