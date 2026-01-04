"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/"); // redirect ke login
  }, [user, router]);

  if (!user) return null; // cegah flicker

  return <Layout>{children}</Layout>;
}
