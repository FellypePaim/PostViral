"use client";

import { Card } from "@/components/ui/card";
import { PlayCircle, Clock, BookOpen, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const modules = [
  {
    title: "Modulo 1 - Como usar a ferramenta",
    lessons: [
      { title: "Introducao ao PostFlow", duration: 8, desc: "Visao geral completa da plataforma, onde cada recurso esta e como navegar do zero ao primeiro carrossel.", status: "em-breve" as const },
      { title: "Mais aulas em breve", duration: 0, desc: "", status: "slot" as const },
    ],
  },
  {
    title: "Modulo 2 - Principios de Design",
    lessons: [
      { title: "Fundamentos do design para redes sociais", duration: 14, desc: "O que faz um design funcionar no feed: proporcao, contraste, tipografia e como guiar o olhar do seguidor.", status: "em-breve" as const },
      { title: "Mais aulas em breve", duration: 0, desc: "", status: "slot" as const },
    ],
  },
];

export default function TutoriaisPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Area de Membros</h1>
        <p className="text-text-secondary text-sm mt-1">
          Aprenda a dominar o PostFlow e os principios de design
        </p>
        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-bg-surface-1 border border-border-subtle rounded-lg">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-text-secondary">Aulas chegando em breve - gravacao em andamento</span>
        </div>
      </div>

      {modules.map((mod, mi) => (
        <div key={mi} className="space-y-2">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <BookOpen size={16} />
            {mod.title}
          </h2>
          <div className="space-y-2">
            {mod.lessons.map((lesson, li) => (
              <Card key={li} className={`p-4 ${lesson.status === "slot" ? "border-dashed" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {lesson.status === "slot" ? (
                      <Plus size={18} className="text-text-secondary/30" />
                    ) : (
                      <PlayCircle size={18} className="text-text-secondary/40" />
                    )}
                    <div>
                      <h3 className="text-sm font-medium">{lesson.title}</h3>
                      {lesson.desc && (
                        <p className="text-xs text-text-secondary mt-0.5 max-w-md">{lesson.desc}</p>
                      )}
                      {lesson.duration > 0 && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock size={11} className="text-text-secondary" />
                          <span className="text-[11px] text-text-secondary">{lesson.duration} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {lesson.status === "em-breve" && (
                    <span className="text-[10px] bg-bg-surface-3 text-text-secondary px-2.5 py-1 rounded-full font-medium">
                      EM BREVE
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Card className="p-6 text-center bg-bg-surface-2 border-border-default">
        <p className="text-sm text-text-secondary mb-3">Quer ver a ferramenta em acao agora?</p>
        <Button variant="secondary">
          <ExternalLink size={14} className="mr-1.5" />
          Ver no YouTube
        </Button>
      </Card>
    </div>
  );
}
