"use client";

import { useAuth } from "@/context/auth";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [photo, setPhoto] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/me/profile");
        setProfile(res.data);
        setPhoto(res.data.photo || "");
        setPhone(res.data.phone || "");
      } catch (err) {
        console.error("Gagal ambil data profile", err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile)
    return (
      <p className="text-center mt-20 text-gray-500 font-medium">Loading...</p>
    );

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload: any = { photo, phone };
      if (password) payload.password = password;

      const res = await api.put(`/user/${profile.id}`, payload);
      setProfile(res.data);
      setUser(res.data);
      alert("Profile berhasil diperbarui!");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Gagal update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Profil Karyawan</h1>

      <div className="space-y-3">
        <p>
          <span className="font-semibold">Nama:</span> {profile.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {profile.email}
        </p>
        <p>
          <span className="font-semibold">Posisi:</span> {profile.position}
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex flex-col items-center">
            <label className="block font-medium mb-1">Foto URL</label>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="border p-2 w-full rounded mb-2"
            />

            {photo ? (
              <img
                src={photo}
                alt="Foto"
                className="w-28 h-28 rounded-full border object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 font-medium">
                No Photo
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Nomor HP</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password Baru</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
