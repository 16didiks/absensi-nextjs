"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import api from "@/lib/api";
import Link from "next/link";

export default function EmployeePage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get("/user");
      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data karyawan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah yakin ingin menghapus karyawan ini?")) return;
    try {
      await api.delete(`/user/${id}`);
      setEmployees(employees.filter((e) => e.id !== id));
      alert("Karyawan berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus karyawan");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-2">
        <h1 className="text-xl font-bold">Data Karyawan</h1>
        <Link
          href="/hrd/employee/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tambah Karyawan
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Nama</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Phone</th>
                  <th className="border px-2 py-1">Posisi</th>
                  <th className="border px-2 py-1">Role</th>
                  <th className="border px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{e.name}</td>
                    <td className="border px-2 py-1">{e.email}</td>
                    <td className="border px-2 py-1">{e.phone}</td>
                    <td className="border px-2 py-1">{e.position}</td>
                    <td className="border px-2 py-1">{e.role}</td>
                    <td className="border px-2 py-1 flex gap-2">
                      <Link
                        href={`/hrd/employee/${e.id}`}
                        className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card */}
          <div className="md:hidden flex flex-col gap-3">
            {employees.map((e) => (
              <div key={e.id} className="border rounded p-3 bg-white shadow-sm">
                <p>
                  <strong>Nama:</strong> {e.name}
                </p>
                <p>
                  <strong>Email:</strong> {e.email}
                </p>
                <p>
                  <strong>Phone:</strong> {e.phone}
                </p>
                <p>
                  <strong>Posisi:</strong> {e.position}
                </p>
                <p>
                  <strong>Role:</strong> {e.role}
                </p>
                <div className="flex gap-2 mt-2">
                  <Link
                    href={`/hrd/employee/${e.id}`}
                    className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500 flex-1 text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600 flex-1 text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
