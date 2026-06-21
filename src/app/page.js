import Banner from "@/components/home/Banner";
import Marquee from "@/components/home/Marquee";
import Partners from "@/components/home/Partners";
import About from "@/components/home/About";
import FeaturedClasses from "@/components/home/FeaturedClasses";
import Promo from "@/components/home/Promo";
import Trainers from "@/components/home/Trainers";
import BlogSection from "@/components/home/BlogSection";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Banner />
      <Marquee />
      {/* <Partners /> */}
      <About />
      <FeaturedClasses />
      <Promo />
      <Trainers />
      <BlogSection />
    </main>
  );
}
