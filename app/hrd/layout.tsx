"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import Navbar from "@/components/Navbar";

export default function HRDLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "HRD") {
      router.push("/"); // redirect jika bukan HRD
    }
  }, [user, router]);

  if (!user) return null; // cegah flicker

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hanya 1 Navbar */}
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
}
