import { getUserSession } from "@/lib/core/session";
import ForumPostDetailsClient from "./ForumPostDetailsClient";

export async function generateMetadata({ params }) {
  return {
    title: "Forum Post | GestorFitness",
  };
}

export default async function ForumPostDetailsPage({ params }) {
  const { id } = await params;
  const user = await getUserSession();
  
  return <ForumPostDetailsClient />;
}
