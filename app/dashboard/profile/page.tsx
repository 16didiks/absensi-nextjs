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
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-3xl font-bold">Profil Karyawan</h1>
          <p className="text-blue-100 mt-1">{profile.email}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Info readonly */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center md:col-span-1">
              {photo ? (
                <img
                  src={photo}
                  alt="Foto"
                  className="w-32 h-32 rounded-full border-2 border-blue-200 object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 font-medium">
                  No Photo
                </div>
              )}
            </div>
            <div className="md:col-span-2 space-y-2">
              <p>
                <span className="font-semibold">Nama:</span> {profile.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {profile.email}
              </p>
              <p>
                <span className="font-semibold">Posisi:</span>{" "}
                {profile.position}
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Form update */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Foto URL</label>
              <input
                type="text"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Nomor HP</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Password Baru</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
