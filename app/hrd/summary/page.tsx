"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HRDSummaryPage() {
  const [data, setData] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/attendances/hrd?from=${
        from || ""
      }&to=${to || ""}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setData(res.data.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
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
        >
          Filter
        </button>
      </div>

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
              {user.summary.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{item.tanggal}</td>
                  <td className="border px-2 py-1">{item.masuk}</td>
                  <td className="border px-2 py-1">{item.pulang}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
