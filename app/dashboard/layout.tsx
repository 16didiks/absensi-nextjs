"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import Layout from "@/components/Layout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  if (user === undefined) return null;
  if (!user) {
    router.push("/");
    return null;
  }

  return <Layout>{children}</Layout>;
}
