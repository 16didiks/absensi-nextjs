/* eslint-disable @next/next/no-sync-scripts */
import { ReactNode } from "react";
import { AuthProvider } from "@/context/auth";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Absensi WFH</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gray-50 text-gray-800 font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
