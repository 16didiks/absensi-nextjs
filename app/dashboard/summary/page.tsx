"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SummaryPage() {
  const [summary, setSummary] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchSummary = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/attendances?from=${from || ""}&to=${
        to || ""
      }`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSummary(res.data.data || []);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div>
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
              <td className="border px-2 py-1">{item.tanggal}</td>
              <td className="border px-2 py-1">{item.masuk}</td>
              <td className="border px-2 py-1">{item.pulang}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
