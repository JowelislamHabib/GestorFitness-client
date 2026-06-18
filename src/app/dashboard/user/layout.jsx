import { requireRole } from "@/lib/core/session";

export default async function UserDashboardLayout({ children }) {
  await requireRole("user");

  return children;
}
