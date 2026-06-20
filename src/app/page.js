import Banner from "@/components/home/Banner";
import Marquee from "@/components/home/Marquee";
import Partners from "@/components/home/Partners";
import About from "@/components/home/About";
import FeaturedClasses from "@/components/home/FeaturedClasses";

export default function Home() {
  return (
    <main className="">
      <Banner />
      <Marquee />
      {/* <Partners /> */}
      <About />
      <FeaturedClasses />
    </main>
  );
}
