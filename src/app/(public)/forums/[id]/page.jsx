import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import ForumPostDetailsClient from "./ForumPostDetailsClient";

export async function generateMetadata({ params }) {
  return {
    title: "Forum Post | GestorFitness",
  };
}

export default async function ForumPostDetailsPage({ params }) {
  const { id } = await params;
  const user = await getUserSession();
  
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/forums/${id}`)}`);
  }

  return <ForumPostDetailsClient />;
}
