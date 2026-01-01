"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderTree,
  MapPin,
  Settings,
} from "lucide-react";

export function AdminSidebar() {
  const t = useTranslations("admin.sidebar");
  const locale = useLocale();
  const pathname = usePathname();

  const navItems = [
    {
      href: `/${locale}/admin`,
      label: t("overview"),
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/admin/users`,
      label: t("users"),
      icon: Users,
    },
    {
      href: `/${locale}/admin/anketas`,
      label: t("anketas"),
      icon: Briefcase,
    },
    {
      href: `/${locale}/admin/categories`,
      label: t("categories"),
      icon: FolderTree,
    },
    {
      href: `/${locale}/admin/cities`,
      label: t("cities"),
      icon: MapPin,
    },
    {
      href: `/${locale}/admin/settings`,
      label: t("settings"),
      icon: Settings,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-surface">
      <div className="flex h-full flex-col">
        <div className="border-b border-border p-6">
          <h2 className="text-lg font-bold text-foreground">{t("adminPanel")}</h2>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground-secondary hover:bg-surface-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

