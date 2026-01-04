"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/auth";

export default function EmployeePage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEmployees(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, [user]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Data Karyawan</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Phone</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td className="border px-2 py-1">{e.name}</td>
              <td className="border px-2 py-1">{e.email}</td>
              <td className="border px-2 py-1">{e.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
