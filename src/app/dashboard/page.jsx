import { redirect } from "next/navigation";

import { getUserSession } from "@/lib/core/session";

export default async function DashboardEntryPage() {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  const role = (user?.role || user?.initialRole || "user").toLowerCase();

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  if (role === "trainer") {
    redirect("/dashboard/trainer");
  }

  redirect("/dashboard/user");
}
