"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // redirect to login if not logged in
    }
  }, [user, router]);

  if (!user) return null; // prevent flicker

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
}
