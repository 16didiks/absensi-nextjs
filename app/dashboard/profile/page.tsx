"use client";
import { useAuth } from "@/context/auth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Profil Karyawan</h1>
      <p>
        <strong>Nama:</strong> {user?.name}
      </p>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>Posisi:</strong> {user?.position}
      </p>
      <p>
        <strong>Nomor HP:</strong> {user?.phone}
      </p>
      {user?.photo && (
        <img
          src={user.photo}
          alt="Foto"
          className="mt-2 w-24 h-24 rounded-full"
        />
      )}
    </div>
  );
}
