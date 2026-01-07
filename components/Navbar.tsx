"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // untuk user dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // untuk nav items mobile

  const navItems = [
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/attendance", label: "Absen" },
    { href: "/dashboard/summary", label: "Summary" },
  ];

  const hrdItems = [
    { href: "/hrd/employee", label: "Data Karyawan" },
    { href: "/hrd/summary", label: "Summary Karyawan" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white shadow-md px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="font-bold text-lg">Absensi WFH</div>

        {/* Hamburger mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Nav items desktop */}
        <div className="hidden md:flex gap-4 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1 rounded transition-colors ${
                isActive(item.href)
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user?.role === "HRD" &&
            hrdItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1 rounded transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            ))}

          {/* User dropdown desktop */}
          {user && (
            <div className="relative ml-4">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition"
              >
                <span className="text-gray-700 font-medium">{user.name}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                  <div className="px-4 py-2 text-gray-700 border-b">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nav items mobile */}
      {mobileOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded transition-colors ${
                isActive(item.href)
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user?.role === "HRD" &&
            hrdItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          {user && (
            <button
              onClick={logout}
              className="text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
