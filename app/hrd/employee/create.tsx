"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CreateEmployeePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    position: "",
    photo: "",
    role: "EMPLOYEE",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Nama, Email, dan Password wajib diisi!");
      return;
    }
    try {
      setLoading(true);
      await api.post("/user/register", form);
      alert("Karyawan berhasil ditambahkan!");
      router.push("/hrd/employee");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan karyawan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Tambah Karyawan</h1>

      <label className="block mb-1">Nama</label>
      <input
        name="name"
        type="text"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <label className="block mb-1">Email</label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <label className="block mb-1">Password</label>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <label className="block mb-1">Nomor HP</label>
      <input
        name="phone"
        type="text"
        value={form.phone}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <label className="block mb-1">Posisi</label>
      <input
        name="position"
        type="text"
        value={form.position}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <label className="block mb-1">Foto URL</label>
      <input
        name="photo"
        type="text"
        value={form.photo}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <label className="block mb-1">Role</label>
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      >
        <option value="EMPLOYEE">EMPLOYEE</option>
        <option value="HRD">HRD</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  );
}
