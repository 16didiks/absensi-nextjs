"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import Layout from "@/components/Layout";

export default function HRDLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "HRD") router.push("/");
  }, [user, router]);

  if (!user) return null;

  return <Layout>{children}</Layout>;
}
