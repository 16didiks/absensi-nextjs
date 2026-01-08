"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SummaryPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [summary, setSummary] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // 🔧 Helper format jam
  const formatTime = (value?: string | null) => {
    if (!value) return "-";

    const date = new Date(value);
    if (isNaN(date.getTime())) return "-";

    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");

    return `${hh}:${mm}`;
  };

  const fetchSummary = async () => {
    const token = localStorage.getItem("token");

    let url = `${process.env.NEXT_PUBLIC_API_URL}/attendances`;

    const params: string[] = [];
    if (from) params.push(`from=${from}`);
    if (to) params.push(`to=${to}`);
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSummary(res.data.data || []);
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Summary Absen</h1>

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
          onClick={fetchSummary}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Filter
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Tanggal</th>
            <th className="border px-2 py-1">Masuk</th>
            <th className="border px-2 py-1">Pulang</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((item, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{item.tanggal || "-"}</td>
              <td className="border px-2 py-1">{formatTime(item.masuk)}</td>
              <td className="border px-2 py-1">{formatTime(item.pulang)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
