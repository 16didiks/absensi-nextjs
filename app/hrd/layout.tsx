"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import Layout from "@/components/Layout";

import { io, Socket } from "socket.io-client";
import Swal from "sweetalert2";

let socket: Socket | null = null;

export default function HRDLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  // ================= AUTH CHECK =================
  useEffect(() => {
    if (!user || user.role !== "HRD") {
      router.push("/");
    }
  }, [user, router]);

  // ================= SOCKET NOTIFICATION =================
  useEffect(() => {
    if (!user || user.role !== "HRD") return;

    if (!socket) {
      socket = io("http://localhost:3000", {
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("✅ HRD socket connected");
      });
    }

    socket.on("notification", (data: { message: string }) => {
      Swal.fire({
        title: "Notifikasi",
        text: data.message,
        icon: "info",
        toast: true,
        position: "top-end",
        timer: 4000,
        showConfirmButton: false,
      });
    });

    return () => {
      socket?.off("notification");
    };
  }, [user]);

  if (!user) return null;

  return <Layout>{children}</Layout>;
}
