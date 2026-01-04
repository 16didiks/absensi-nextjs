"use client";

import { useAuth } from "@/context/auth";
import { useState } from "react";
import api from "@/lib/api";

export default function ProfilePage() {
  const { user, setUser } = useAuth(); // perlu setUser supaya bisa update state user setelah update
  const [photo, setPhoto] = useState(user?.photo || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return <p>Loading...</p>;

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload: any = { photo, phone };
      if (password) payload.password = password;

      const res = await api.put(`/user/${user.id}`, payload);
      setUser(res.data); // update user state
      alert("Profile berhasil diperbarui!");
      setPassword(""); // reset password input
    } catch (err) {
      console.error(err);
      alert("Gagal update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Profil Karyawan</h1>

      <p>
        <strong>Nama:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Posisi:</strong> {user.position}
      </p>

      <div className="mt-4">
        <label className="block mb-1">Foto URL</label>
        <input
          type="text"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        {photo && (
          <img src={photo} alt="Foto" className="w-24 h-24 rounded-full mb-2" />
        )}

        <label className="block mb-1">Nomor HP</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <label className="block mb-1">Password Baru</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
}
