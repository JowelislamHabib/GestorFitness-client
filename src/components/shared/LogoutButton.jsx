"use client";
import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton({ className, iconClassName = "size-4", showIcon = true, text = "Log out" }) {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        }
      }
    });
  };
  return (
    <button onClick={handleLogout} className={`flex w-full items-center gap-3 text-left ${className || ""}`}>
      {showIcon && (
        <div className="bg-background shadow-sm p-1.5 rounded-md group-hover/item:shadow-md transition-all">
          <LogOut className={iconClassName} aria-hidden="true" />
        </div>
      )}
      {text}
    </button>
  );
}
