import DashboardNavbar from "@/components/dashboardPage/shared/DashboardNavbar";
import { DashboardSidebar } from "@/components/dashboardPage/shared/DashboardSidebar";
import { Inter, Outfit } from "next/font/google";

const dashboardSans = Inter({
  subsets: ["latin"],
  variable: "--font-ubuntu",
});

const dashboardHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-kanit",
});

export default function DashboardLayout({ children }) {
  return (
    <div className={`${dashboardSans.variable} ${dashboardHeading.variable} font-sans`}>
      <div className="min-h-screen bg-background text-foreground lg:flex">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">
          <DashboardNavbar />
          <main className="container mx-auto px-4 py-6 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
