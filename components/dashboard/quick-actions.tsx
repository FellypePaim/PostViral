"use client";

import { useRouter } from "next/navigation";
import { Wand2, Brain, PenTool } from "lucide-react";
import { Card } from "@/components/ui/card";

const actions = [
  {
    icon: Wand2,
    title: "Criar com IA",
    description: "Gere um carrossel completo com inteligencia artificial",
    action: "ai",
  },
  {
    icon: Brain,
    title: "Treinar Carrossel",
    description: "Use um perfil de treinamento para personalizar a IA",
    action: "train",
  },
  {
    icon: PenTool,
    title: "Criar do Zero",
    description: "Comece com um canvas em branco e crie manualmente",
    action: "blank",
  },
];

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const router = useRouter();

  function handleClick(action: string) {
    if (action === "blank") {
      router.push("/gerador?new=1");
    } else {
      onAction(action);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.action}
            hover
            className="p-5"
            onClick={() => handleClick(item.action)}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-bg-surface-3 rounded-lg">
                <Icon size={20} className="text-text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
