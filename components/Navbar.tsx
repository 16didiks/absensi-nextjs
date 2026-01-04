"use client";

import { useAuth } from "@/context/auth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <span className="font-bold text-lg">Absensi WFH</span>
      <div className="flex items-center space-x-4">
        <span>{user?.name}</span>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
