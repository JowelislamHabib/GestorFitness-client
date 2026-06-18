import { requireRole } from "@/lib/core/session";

export default async function TrainerDashboardLayout({ children }) {
  await requireRole("trainer");

  return children;
}
