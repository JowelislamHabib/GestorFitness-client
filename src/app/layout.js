import { Navbar } from "@/components/shared/Navbar";
import { Inter, Gloock } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const gloock = Gloock({
  variable: "--font-gloock",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "GestorFitness - Discover, Book & Train with the Best Fitness Classes",
  description: "GestorFitness connects you with the best fitness classes and trainers. Book sessions, track progress, join community discussions, and achieve your fitness goals. Start today!",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${gloock.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar/>
        {children}
        </body>
    </html>
  );
}
