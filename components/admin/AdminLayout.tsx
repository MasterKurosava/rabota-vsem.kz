"use client";

import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        <div className="container py-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}



