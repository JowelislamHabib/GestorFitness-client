import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
};
 
import { getTokenServer } from "../getTokenServer";

export const getUserToken = async () => {
  const token = await getTokenServer();
  return token || null;
};

export const requireRole = async (role) => {
  const user = await getUserSession();
  if (!user) {
    redirect("/login");
  }
  const userRole = (user?.role || user?.initialRole || "user").toLowerCase();
  if (userRole !== role) {
    redirect("/unauthorized");
  }
  return user;
};
