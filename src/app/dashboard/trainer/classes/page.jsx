"use client";

import ClassesManager from "@/components/dashboard/ClassesManager";
import { useSession } from "@/lib/auth-client";

export default function TrainerClassesPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="flex justify-center p-12 text-muted-foreground">
        Authentication required.
      </div>
    );
  }

  return <ClassesManager role="trainer" trainerId={session.user.id} />;
}
