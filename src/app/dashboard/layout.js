import DashboardNavbar from "@/components/dashboardPage/shared/DashboardNavbar";
import { DashboardSidebar } from "@/components/dashboardPage/shared/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground lg:flex">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">
          <DashboardNavbar />
          <main className="container mx-auto px-4 py-6 lg:py-8">{children}</main>
        </div>
      </div>
    </>
  );
}
