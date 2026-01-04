"use client";

import { useAuth } from "@/context/auth";
import axios from "axios";
import { useState } from "react";

export default function AttendancePage() {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAttendance = async (type: "IN" | "OUT") => {
    if (!accessToken) return;
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/attendances`,
        { type },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert(`Absen ${type} berhasil!`);
    } catch (err: any) {
      alert(err.response?.data?.message || "Absen gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow text-center">
      <h2 className="text-xl font-bold mb-4">Absen Masuk / Pulang</h2>
      <div className="flex justify-around">
        <button
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          onClick={() => handleAttendance("IN")}
        >
          Masuk
        </button>
        <button
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          onClick={() => handleAttendance("OUT")}
        >
          Pulang
        </button>
      </div>
    </div>
  );
}
