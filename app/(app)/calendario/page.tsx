"use client";

import { useState } from "react";
import { Plus, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { authFetch } from "@/lib/auth-fetch";

interface CalendarDay {
  day: number;
  type: string;
  title: string;
  description: string;
}

interface CalendarData {
  id: string;
  niche: string;
  period: number;
  days_data: CalendarDay[];
  created_at: string;
}

const contentTypeLabels: Record<string, string> = {
  educativo: "Educativo",
  engajamento: "Engajamento",
  vendas: "Vendas",
  "dica-rapida": "Dica rapida",
};

const contentTypeColors: Record<string, string> = {
  educativo: "bg-blue-500/20 text-blue-400",
  engajamento: "bg-green-500/20 text-green-400",
  vendas: "bg-purple-500/20 text-purple-400",
  "dica-rapida": "bg-amber-500/20 text-amber-400",
};

export default function CalendarioPage() {
  const [calendars, setCalendars] = useState<CalendarData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [niche, setNiche] = useState("");
  const [period, setPeriod] = useState(7);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["educativo", "engajamento", "vendas", "dica-rapida"]);
  const { toast } = useToast();

  async function handleGenerate() {
    if (!niche.trim()) return;
    setGenerating(true);
    try {
      const res = await authFetch("/api/calendario", {
        method: "POST",
        body: JSON.stringify({ niche, period, contentTypes: selectedTypes }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCalendars((prev) => [data, ...prev]);
      setModalOpen(false);
      setNiche("");
      toast("Calendario gerado com sucesso", "success");
    } catch {
      toast("Erro ao gerar calendario", "error");
    } finally {
      setGenerating(false);
    }
  }

  function toggleType(type: string) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendario de Conteudo</h1>
          <p className="text-text-secondary text-sm mt-1">
            Planeje seu conteudo com IA
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} className="mr-1.5" />
          Novo calendario
        </Button>
      </div>

      {calendars.length === 0 && (
        <div className="text-center py-20">
          <Calendar size={48} className="mx-auto text-text-secondary/30 mb-4" />
          <p className="text-text-secondary">Nenhum calendario criado</p>
          <p className="text-sm text-text-secondary/60 mt-1">
            Clique em "Novo calendario" para gerar ideias de conteudo com IA
          </p>
        </div>
      )}

      {calendars.map((cal) => (
        <Card key={cal.id} className="p-5">
          <h3 className="font-semibold text-lg mb-3">{cal.niche} - {cal.period} dias</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {(cal.days_data || []).map((day, i) => (
              <div key={i} className="bg-bg-surface-2 rounded-lg p-3 border border-border-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-secondary">Dia {day.day}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${contentTypeColors[day.type] || "bg-bg-surface-3 text-text-secondary"}`}>
                    {contentTypeLabels[day.type] || day.type}
                  </span>
                </div>
                <h4 className="text-sm font-medium">{day.title}</h4>
                <p className="text-xs text-text-secondary mt-1">{day.description}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo calendario">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary">Nicho/tema</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Ex: Marketing digital para pequenas empresas"
              className="w-full mt-1 bg-bg-surface-3 border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary"
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary">Periodo</label>
            <div className="flex gap-2 mt-1">
              {[7, 14, 30].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${
                    period === p ? "bg-accent-bg text-accent-text" : "bg-bg-surface-3 text-text-secondary"
                  }`}
                >
                  {p} dias
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Tipos de conteudo</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {Object.entries(contentTypeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleType(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${
                    selectedTypes.includes(key) ? "bg-accent-bg text-accent-text" : "bg-bg-surface-3 text-text-secondary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleGenerate} loading={generating} className="w-full">
            <Sparkles size={16} className="mr-1.5" />
            Gerar calendario
          </Button>
        </div>
      </Modal>
    </div>
  );
}
