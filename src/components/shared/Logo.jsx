import Image from "next/image";

export default function Logo({ className = "h-8 sm:h-9 w-auto" }) {
  return (
    <>
      <Image 
        src="/GestorFitness-Logo-Black.png" 
        alt="GestorFitness Logo" 
        width={180} 
        height={40} 
        className={`object-contain dark:hidden ${className}`}
        priority
      />
      <Image 
        src="/GestorFitness-Logo-White.png" 
        alt="GestorFitness Logo" 
        width={180} 
        height={40} 
        className={`object-contain hidden dark:block ${className}`}
        priority
      />
    </>
  );
}
