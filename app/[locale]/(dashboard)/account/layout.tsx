import { ReactNode } from "react";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="container py-6 md:py-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <AccountSidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

