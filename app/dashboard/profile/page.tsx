"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import axios from "axios";

export default function ProfilePage() {
  const { user, accessToken } = useAuth();
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (accessToken) fetchProfile();
  }, [accessToken]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/me/profile`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setPhone(res.data.phone);
      setPhoto(res.data.photo);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
        { phone, photo, password },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert("Profile updated!");
      setPassword(""); // clear password
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Profil Karyawan</h2>
      <p className="mb-2">
        <strong>Nama:</strong> {user?.name}
      </p>
      <p className="mb-2">
        <strong>Email:</strong> {user?.email}
      </p>
      <p className="mb-4">
        <strong>Posisi:</strong> Software Engineer
      </p>

      <label className="block mb-2">Foto URL</label>
      <input
        type="text"
        className="w-full mb-4 p-2 border rounded"
        value={photo}
        onChange={(e) => setPhoto(e.target.value)}
      />

      <label className="block mb-2">Nomor HP</label>
      <input
        type="text"
        className="w-full mb-4 p-2 border rounded"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label className="block mb-2">Password Baru</label>
      <input
        type="password"
        className="w-full mb-4 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        onClick={handleUpdate}
      >
        Update Profile
      </button>
    </div>
  );
}
