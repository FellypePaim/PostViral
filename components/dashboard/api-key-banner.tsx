"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export function ApiKeyBanner() {
  const { settings, loading } = useAuth();

  if (loading || settings?.gemini_api_key) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-warning/10 border border-warning/20 rounded-[var(--radius-button)] mb-6">
      <AlertTriangle size={18} className="text-warning shrink-0" />
      <p className="text-sm text-warning flex-1">
        Configure sua chave API do Gemini para gerar imagens com IA.
      </p>
      <Link
        href="/configuracoes"
        className="text-sm font-medium text-warning hover:underline shrink-0"
      >
        Configurar
      </Link>
    </div>
  );
}
