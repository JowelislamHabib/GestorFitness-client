export default function Marquee() {
  const phrases = [
    "FOCUS ON YOUR WORKOUTS",
    "NOT YOUR LOSS",
    "PUSH PAST YOUR LIMITS",
    "NO EXCUSES ONLY RESULTS",
    "ELEVATE YOUR GRIND"
  ];
  
  // We duplicate the phrases multiple times to ensure the container is wide enough for a seamless loop.
  // Translating by -50% shifts exactly half of the duplicated arrays.
  const loopedPhrases = [...phrases, ...phrases, ...phrases, ...phrases, ...phrases, ...phrases];

  return (
    <section className="w-full bg-red-600 py-6 sm:py-8 lg:py-10 overflow-hidden relative flex z-30 border-y border-red-700 shadow-xl">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          animation: marquee 240s linear infinite;
        }
      `}} />
      <div className="flex items-center whitespace-nowrap animate-marquee-infinite w-max hover:[animation-play-state:paused] cursor-default">
        {loopedPhrases.map((text, i) => (
          <div key={i} className="flex items-center shrink-0">
            {/* Much larger text sizing */}
            <span className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-black tracking-[0.2em] uppercase leading-none">
              {text}
            </span>
            {/* Visual separator between texts */}
            <span className="text-white/20 mx-8 sm:mx-12 md:mx-20 text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-light leading-none">
              /
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
