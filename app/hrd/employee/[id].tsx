"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

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

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/user/${id}`);
        setForm({ ...res.data, password: "" });
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data karyawan");
        router.push("/hrd/employee");
      }
    };
    fetchEmployee();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = { ...form };
      if (!payload.password) delete payload.password; // jangan kirim password kosong
      await api.put(`/user/${id}`, payload);
      alert("Data karyawan berhasil diperbarui");
      router.push("/hrd/employee");
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui karyawan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Edit Karyawan</h1>

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

      <label className="block mb-1">Password Baru</label>
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
        className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  );
}
