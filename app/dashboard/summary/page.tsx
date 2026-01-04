"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import axios from "axios";

export default function SummaryPage() {
  const { accessToken } = useAuth();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState<any[]>([]);

  const fetchSummary = async () => {
    if (!accessToken) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/attendances?from=${from}&to=${to}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Summary Absen</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          className="p-2 border rounded"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button
          onClick={fetchSummary}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Filter
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Masuk</th>
            <th className="border p-2">Pulang</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="text-center">
              <td className="border p-2">{item.tanggal}</td>
              <td className="border p-2">{item.masuk}</td>
              <td className="border p-2">{item.pulang}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
