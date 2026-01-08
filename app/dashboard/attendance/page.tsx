"use client";

import { useAuth } from "@/context/auth";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AttendancePage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

      setMessage(res.data.message || "Absensi berhasil");
      setType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Gagal absensi");
      setType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("id-ID");

  return (
    <div className="max-w-md mx-auto mt-14 p-6 bg-white rounded-2xl shadow-xl relative">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Absensi Harian
      </h1>

      {/* DATE */}
      <p className="text-center text-gray-500 mt-1">{formattedDate}</p>

      {/* STATUS CARD → CLOCK */}
      <div className="bg-gray-50 border rounded-2xl p-6 text-center my-6">
        <div className="text-5xl font-mono font-bold text-gray-800">
          {formattedTime}
        </div>
        <p className="text-sm text-gray-500 mt-2">Jam kerja 08:00 – 17:00</p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={() => handleAttendance("IN")}
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700 active:scale-95 text-white py-3 rounded-xl font-semibold shadow transition disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Check In"}
        </button>

        <button
          onClick={() => handleAttendance("OUT")}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3 rounded-xl font-semibold shadow transition disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Check Out"}
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <p className="text-center text-sm text-gray-500 italic mt-4">
          {type === "success" ? "✅" : "❌"} {message}
        </p>
      )}

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`${
              type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white px-5 py-3 rounded-lg shadow-lg animate-slide-in`}
          >
            {message}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
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
