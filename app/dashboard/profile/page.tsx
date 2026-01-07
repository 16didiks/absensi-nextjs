/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/auth";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function ProfilePage() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (msg: string, type: "success" | "error") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const fetchProfile = async () => {
    const res = await api.get("/user/me/profile");
    setProfile(res.data);
    return res.data;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const openModal = () => {
    setPhone(profile.phone || "");
    setPassword("");
    setPhoto(null);
    setPhotoPreview(profile.photo || null);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (phone !== profile.phone) {
        formData.append("phone", phone);
      }

      if (password) {
        formData.append("password", password);
      }

      if (photo) {
        formData.append("photo", photo);
      }

      await api.patch("/user/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = await fetchProfile();
      setUser(updated);

      setShowModal(false);
      showToastMessage("Profile berhasil diperbarui", "success");
    } catch (err: any) {
      showToastMessage(
        err.response?.data?.message || "Gagal update profile",
        "error"
      );
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto mt-16 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-xl mb-6" />
        <div className="h-24 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
          <img
            src={profile.photo || "/avatar.png"}
            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
          />
          <h1 className="text-2xl font-bold mt-4">{profile.name}</h1>
          <p className="opacity-90">{profile.email}</p>
          <span className="inline-block mt-2 px-4 py-1 rounded-full text-sm bg-white/20">
            {profile.position}
          </span>
          <br />
          <button
            onClick={openModal}
            className="mt-5 bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-6 p-8">
          {/* INFORMASI UMUM */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Informasi Umum</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Nama</label>
                <input
                  value={profile.name}
                  disabled
                  className="w-full mt-1 bg-gray-100 border rounded-lg px-3 py-2 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                  value={profile.email}
                  disabled
                  className="w-full mt-1 bg-gray-100 border rounded-lg px-3 py-2 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Posisi</label>
                <input
                  value={profile.position || "-"}
                  disabled
                  className="w-full mt-1 bg-gray-100 border rounded-lg px-3 py-2 text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* KONTAK */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Kontak</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Nomor HP</label>
                <input
                  value={profile.phone || "-"}
                  disabled
                  className="w-full mt-1 bg-gray-100 border rounded-lg px-3 py-2 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Tanggal Bergabung
                </label>
                <input
                  value={new Date(profile.createdAt).toLocaleDateString(
                    "id-ID"
                  )}
                  disabled
                  className="w-full mt-1 bg-gray-100 border rounded-lg px-3 py-2 text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <div className="flex justify-center mb-4">
              <img
                src={photoPreview || profile.photo || "/avatar.png"}
                className="w-24 h-24 rounded-full object-cover border"
              />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowConfirm(true);
              }}
              className="space-y-4"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPhoto(file);
                    setPhotoPreview(URL.createObjectURL(file));
                  }
                }}
              />

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nomor HP"
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password baru (opsional)"
                className="w-full border rounded-lg px-3 py-2"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <p className="mb-4">Yakin simpan perubahan?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-lg text-white shadow-lg ${
            toastType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
