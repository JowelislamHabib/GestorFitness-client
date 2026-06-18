import { Navbar } from "@/components/shared/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter, Sansation } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sansation = Sansation({
  variable: "--font-sansation",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata = {
  title: "GestorFitness - Discover, Book & Train with the Best Fitness Classes",
  description: "GestorFitness connects you with the best fitness classes and trainers. Book sessions, track progress, join community discussions, and achieve your fitness goals. Start today!",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sansation.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
