/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function HRDSummaryPage() {
  const [data, setData] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔧 Helper format jam
  const formatTime = (value?: string | null) => {
    if (!value) return "-";

    const date = new Date(value);
    if (isNaN(date.getTime())) return "-";

    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");

    return `${hh}:${mm}`;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token tidak ditemukan");
        return;
      }

      const params: any = {};
      if (from) params.from = from;
      if (to) params.to = to;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/attendances/hrd`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );

      setData(res.data?.data || []);
    } catch (err: any) {
      console.error(err);
      setError("Gagal mengambil data summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Summary Karyawan</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border px-2 py-1"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border px-2 py-1"
        />
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-3 py-1 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Filter"}
        </button>
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {!loading && data.length === 0 && (
        <p className="text-gray-500">Data tidak ditemukan</p>
      )}

      {data.map((user) => (
        <div key={user.userId} className="mb-4 border p-2 rounded">
          <h2 className="font-bold">{user.name}</h2>

          <table className="w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Tanggal</th>
                <th className="border px-2 py-1">Masuk</th>
                <th className="border px-2 py-1">Pulang</th>
              </tr>
            </thead>
            <tbody>
              {user.summary?.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{item.tanggal || "-"}</td>
                  <td className="border px-2 py-1">{formatTime(item.masuk)}</td>
                  <td className="border px-2 py-1">
                    {formatTime(item.pulang)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
