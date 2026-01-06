"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Swal from "sweetalert2";
import { useAuth } from "@/context/auth";

export default function HRDNotifier() {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user || user.role !== "HRD") return;

    socketRef.current = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 HRD WS connected");
    });

    socketRef.current.on("notification", (data) => {
      Swal.fire({
        title: "Notifikasi",
        text: data.message,
        icon: "info",
        timer: 4000,
        showConfirmButton: false,
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  return null;
}
