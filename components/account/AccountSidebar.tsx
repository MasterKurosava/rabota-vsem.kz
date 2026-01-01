"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { 
  FileText, 
  User, 
  Shield, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/server/actions/auth";

const menuItems = [
  { href: "/account/anketa", icon: FileText, key: "anketa" },
  { href: "/account/profile", icon: User, key: "profile" },
  { href: "/account/security", icon: Shield, key: "security" },
] as const;

export function AccountSidebar() {
  const t = useTranslations("account");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full justify-between"
        >
          <span>{t("menu")}</span>
          {mobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-6 h-fit border-r-2 border-border/60 pr-8",
          "lg:block",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">{t("accountTitle")}</h2>
          <div className="h-px bg-border" />
        </div>
        
        <nav className="space-y-2 flex flex-col">
          {menuItems.map((item) => {
            const Icon = item.icon;
            let isActive = false;
            
            if (item.href === "/account/anketa") {
              // Активна если мы на /account и не на других подстраницах
              isActive = pathname === "/account/anketa" || 
                (pathname?.startsWith("/account/anketa") && !pathname.includes("/edit") && !pathname.includes("/new"));
            } else {
              isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all",
                  "hover:bg-surface-muted",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface-muted/50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-8 border-t border-border/60">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all",
              "text-destructive hover:bg-destructive/10 hover:text-destructive"
            )}
          >
            <LogOut className="h-5 w-5" />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

