import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import ClassDetailsClient from "./ClassDetailsClient";

export async function generateMetadata({ params }) {
  // Can add metadata here if needed
  return {
    title: "Class Details | GestorFitness",
  };
}

export default async function ClassDetailsPage({ params }) {
  const { id } = await params;
  const user = await getUserSession();
  
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/classes/${id}`)}`);
  }

  return <ClassDetailsClient />;
}
