import { Dumbbell } from "lucide-react";

export default function Partners() {
  // Reusable placeholder logo component to mimic the "TRAYN" logo from the screenshot
  const PartnerLogo = () => (
    <div className="flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
      <div className="relative flex items-center justify-center">
        <span className="text-2xl sm:text-3xl font-black text-slate-300 tracking-tighter uppercase">Tr</span>
        <Dumbbell className="size-5 sm:size-6 text-slate-300 mx-1 -mt-2" />
        <span className="text-2xl sm:text-3xl font-black text-slate-300 tracking-tighter uppercase">yn</span>
      </div>
      <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Plus Fitness</span>
    </div>
  );

  return (
    <section className="w-full relative z-20 flex justify-center bg-background">
      {/* The main angled dark container */}
      <div className="w-full bg-[#151921] py-16 md:py-24 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(0_0,100%_0,calc(100%-120px)_100%,120px_100%)]">
        
        <div className="container mx-auto px-6 md:px-12 lg:px-32 flex flex-col items-center">
          
          {/* Header section with horizontal lines and dumbbells */}
          <div className="flex items-center w-full max-w-5xl mb-12 sm:mb-16 gap-2 sm:gap-4">
            
            {/* Left Line */}
            <div className="flex-1 flex items-center">
              <div className="size-1.5 sm:size-2 rounded-full bg-white shrink-0" />
              <div className="h-px bg-red-600 w-full" />
            </div>
            
            {/* Center Title */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 px-2 sm:px-4">
              <Dumbbell className="size-3 sm:size-4 text-red-600" />
              <h2 className="text-[10px] sm:text-xs md:text-sm font-bold text-white uppercase tracking-[0.2em]">
                Our Partners & Supporters
              </h2>
              <Dumbbell className="size-3 sm:size-4 text-red-600" />
            </div>

            {/* Right Line */}
            <div className="flex-1 flex items-center">
              <div className="h-px bg-red-600 w-full" />
              <div className="size-1.5 sm:size-2 rounded-full bg-white shrink-0" />
            </div>

          </div>

          {/* Logos Row */}
          <div className="flex flex-wrap justify-center gap-10 sm:gap-12 md:gap-16 lg:gap-20 w-full mb-12">
            {[1, 2, 3, 4, 5].map((item) => (
              <PartnerLogo key={item} />
            ))}
          </div>

          {/* Bottom Red Dot */}
          <div className="size-2.5 sm:size-3 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]" />

        </div>

      </div>
    </section>
  );
}
