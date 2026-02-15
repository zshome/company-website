"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import AdminShell from "./AdminShell";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
