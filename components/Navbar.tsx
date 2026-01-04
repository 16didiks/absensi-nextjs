"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link href="/dashboard/profile" className="hover:underline">
          Profile
        </Link>
        <Link href="/dashboard/attendance" className="hover:underline">
          Absen
        </Link>
        <Link href="/dashboard/summary" className="hover:underline">
          Summary
        </Link>

        {user?.role === "HRD" && (
          <>
            <Link href="/hrd/employee" className="hover:underline">
              Data Karyawan
            </Link>
            <Link href="/hrd/summary" className="hover:underline">
              Summary Karyawan
            </Link>
          </>
        )}
      </div>
      {user && (
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
