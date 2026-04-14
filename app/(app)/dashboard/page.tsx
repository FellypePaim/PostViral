"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Brain, PenTool, FolderOpen } from "lucide-react";
import { useCarousels } from "@/hooks/use-carousels";
import { CarouselGrid } from "@/components/dashboard/carousel-grid";
import { ApiKeyBanner } from "@/components/dashboard/api-key-banner";
import { CreateWizard } from "@/components/dashboard/create-wizard";
import { TrainingModal } from "@/components/dashboard/training-modal";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

const quickActions = [
  {
    icon: Sparkles,
    title: "Criar com IA",
    desc: "De um topico e deixe a IA montar o carrossel completo - texto, layout e imagens.",
    button: "Comecar →",
    action: "ai" as const,
  },
  {
    icon: Brain,
    title: "Treinar Carrossel",
    desc: "Configure seu nicho, tom e instrucoes uma vez. A IA usa seu perfil em todos os carrosseis.",
    button: "Configurar →",
    action: "train" as const,
  },
  {
    icon: PenTool,
    title: "Criar do Zero",
    desc: "Abra o editor e construa seu carrossel manualmente, slide por slide, com controle total.",
    button: "Abrir editor →",
    action: "blank" as const,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { carousels, loading, search, setSearch, reload, remove } = useCarousels();
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);

  function handleAction(action: "ai" | "train" | "blank") {
    switch (action) {
      case "ai":
        setWizardOpen(true);
        break;
      case "train":
        setTrainingOpen(true);
        break;
      case "blank":
        router.push("/gerador?new=1");
        break;
    }
  }

  async function handleDelete(id: string) {
    remove(id);
    toast("Carrossel excluido", "success");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
  }

  return (
    <div className="space-y-6">
      <ApiKeyBanner />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.action} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-bg-surface-3 rounded-lg">
                    <Icon size={18} className="text-text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <button
                onClick={() => handleAction(item.action)}
                className="mt-4 w-full py-2 text-xs font-medium bg-bg-surface-2 hover:bg-bg-surface-3 border border-border-default rounded-lg text-text-primary transition-colors cursor-pointer"
              >
                {item.button}
              </button>
            </Card>
          );
        })}
      </div>

      {/* Posts section */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Posts gerados
        </h2>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onBlur={() => setSearch(searchInput)}
              className="w-48 pl-8 pr-3 py-1.5 bg-bg-surface-1 border border-border-default rounded-lg text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-bg/30"
            />
          </form>
          <button
            onClick={() => router.push("/organizacao")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary border border-border-default rounded-lg hover:bg-bg-surface-1 cursor-pointer"
          >
            <FolderOpen size={13} />
            Organizacao
          </button>
        </div>
      </div>

      <CarouselGrid
        carousels={carousels}
        loading={loading}
        onDelete={handleDelete}
        onReload={reload}
      />

      <CreateWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
      <TrainingModal open={trainingOpen} onClose={() => setTrainingOpen(false)} />
    </div>
  );
}
