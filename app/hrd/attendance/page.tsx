"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/auth";

export default function HRDAttendancePage() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [summary, setSummary] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/attendances/hrd`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { from: from || "", to: to || "" },
        }
      );
      setSummary(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        Monitoring Absensi Semua Karyawan
      </h1>
      <div className="flex space-x-2 mb-4">
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
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Filter
        </button>
      </div>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">Tanggal</th>
            <th className="border px-2 py-1">Masuk</th>
            <th className="border px-2 py-1">Pulang</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((u) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            u.summary.map((s: any, idx: number) => (
              <tr key={`${u.userId}-${idx}`}>
                <td className="border px-2 py-1">{u.name}</td>
                <td className="border px-2 py-1">{s.tanggal}</td>
                <td className="border px-2 py-1">{s.masuk}</td>
                <td className="border px-2 py-1">{s.pulang}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
