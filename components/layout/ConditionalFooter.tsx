"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

interface ConditionalFooterProps {
  settings?: {
    phone?: string | null;
    address?: string | null;
    whatsappNumber?: string | null;
    mapEmbedUrl?: string | null;
  } | null;
}

export function ConditionalFooter({ settings }: ConditionalFooterProps) {
  const pathname = usePathname();
  
  // Don't show footer on auth pages or admin pages
  if (
    pathname?.includes("/login") ||
    pathname?.includes("/register") ||
    pathname?.includes("/verify") ||
    pathname?.includes("/admin")
  ) {
    return null;
  }

  return <Footer settings={settings} />;
}








