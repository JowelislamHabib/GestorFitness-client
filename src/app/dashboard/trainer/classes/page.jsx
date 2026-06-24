"use client";

import ClassesManager from "@/components/dashboard/ClassesManager";
import { useSession } from "@/lib/auth-client";
import GlobalLoading from "@/components/shared/GlobalLoading";

export default function TrainerClassesPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <GlobalLoading message="Authenticating..." />;
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
