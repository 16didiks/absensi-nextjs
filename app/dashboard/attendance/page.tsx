"use client";
import { useAuth } from "@/context/auth";
import { useState } from "react";
import axios from "axios";

export default function AttendancePage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAttendance = async (attendanceType: "IN" | "OUT") => {
    if (!user) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/attendances`,
        { type: attendanceType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message || "Berhasil absensi!");
      setType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Gagal absensi");
      setType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6 relative">
      <h1 className="text-2xl font-bold mb-6 text-center">Absensi</h1>

      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={() => handleAttendance("IN")}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold transition disabled:opacity-50"
        >
          Masuk
        </button>
        <button
          onClick={() => handleAttendance("OUT")}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold transition disabled:opacity-50"
        >
          Pulang
        </button>
      </div>

      {/* Floating Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50">
          <div
            className={`${
              type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            } px-4 py-3 rounded shadow-lg flex items-center gap-2 animate-slide-in`}
          >
            <span>{message}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
