"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wand2,
  FolderOpen,
  CalendarDays,
  BookOpen,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  Sparkles,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "@/hooks/use-theme";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/gerador", label: "Gerador", icon: Wand2 },
  { href: "/organizacao", label: "Organizacao", icon: FolderOpen },
  { href: "/calendario", label: "Calendario", icon: CalendarDays },
  { href: "/tutoriais", label: "Tutoriais", icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, settings, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = settings?.display_name || user?.email?.split("@")[0] || "Usuario";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <nav className="sticky top-0 z-40 border-b border-border-default bg-bg-primary/80 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="text-lg font-bold text-text-primary mr-6 flex items-center gap-2"
          >
            <Sparkles size={20} />
            <span className="hidden sm:inline">PostFlow</span>
          </Link>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/") || (item.href === "/gerador" && pathname.startsWith("/gerador"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-bg-surface-2 text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-1"
                }`}
              >
                <Icon size={16} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Theme + Avatar Dropdown */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer rounded-lg hover:bg-bg-surface-1"
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-bg-surface-1 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-bg-surface-3 flex items-center justify-center text-xs font-medium text-text-primary border border-border-default">
                {initials}
              </div>
              <ChevronDown size={14} className="text-text-secondary hidden sm:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-bg-surface-2 border border-border-default rounded-xl shadow-2xl py-2 w-56 z-50">
                <div className="px-3 py-2 border-b border-border-default">
                  <p className="text-sm font-medium text-text-primary truncate">{displayName}</p>
                  <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/configuracoes"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface-3 transition-colors"
                  >
                    <Settings size={15} />
                    Configuracoes
                  </Link>
                  <Link
                    href="/configuracoes"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface-3 transition-colors"
                  >
                    <User size={15} />
                    Novidades
                  </Link>
                </div>
                <div className="border-t border-border-default pt-1">
                  <button
                    onClick={() => { setDropdownOpen(false); signOut(); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-bg-surface-3 transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
