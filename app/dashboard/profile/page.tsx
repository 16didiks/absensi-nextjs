"use client";
import { useAuth } from "@/context/auth";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function ProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, setUser } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Confirm modal
  const [showConfirm, setShowConfirm] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/me/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Gagal ambil data profile", err);
      showToastMessage("Gagal ambil data profile", "error");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const openModal = () => {
    if (!profile) return;
    setPhoto(profile.photo || "");
    setPhone(profile.phone || "");
    setPassword("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = { photo, phone };
      if (password) payload.password = password;

      const res = await api.patch("/user/me", payload);
      setProfile(res.data);
      setUser(res.data);
      setPassword("");
      closeModal();
      showToastMessage("Profile berhasil diperbarui!", "success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      showToastMessage(
        err.response?.data?.message || "Gagal update profile",
        "error"
      );
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (!profile)
    return (
      <p className="text-center mt-20 text-gray-500 font-medium">Loading...</p>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-blue-100 mt-1">{profile.email}</p>
          <p className="mt-1">{profile.position}</p>
          <button
            onClick={openModal}
            className="mt-4 bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Foto"
                className="w-32 h-32 rounded-full border-2 border-blue-200 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 font-medium">
                No Photo
              </div>
            )}
          </div>
          <div className="space-y-2 flex-1">
            <p>
              <span className="font-semibold">Nama:</span> {profile.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
            <p>
              <span className="font-semibold">Posisi:</span> {profile.position}
            </p>
            <p>
              <span className="font-semibold">Nomor HP:</span>{" "}
              {profile.phone || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowConfirm(true); // open confirm modal
              }}
              className="flex flex-col gap-4"
            >
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

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
            <h3 className="text-lg font-bold mb-4">Konfirmasi Update</h3>
            <p className="mb-4">Yakin ingin menyimpan perubahan ini?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Ya, Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50">
          <div
            className={`${
              toastType === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            } px-4 py-3 rounded shadow-lg flex items-center gap-2 animate-slide-in`}
          >
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
