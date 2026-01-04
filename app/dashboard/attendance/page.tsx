"use client";
import { useAuth } from "@/context/auth";
import { useState } from "react";
import axios from "axios";

export default function AttendancePage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  const handleAttendance = async (type: "IN" | "OUT") => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/attendances`,
      { type },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setMessage(res.data.message);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Absensi</h1>
      <div className="flex gap-2">
        <button
          onClick={() => handleAttendance("IN")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Masuk
        </button>
        <button
          onClick={() => handleAttendance("OUT")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Pulang
        </button>
      </div>
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}
