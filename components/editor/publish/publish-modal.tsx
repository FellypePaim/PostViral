"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import { getSocialConnections } from "@/lib/social/connections";
import { createScheduledPost } from "@/lib/social/scheduler";
import { PLATFORM_INFO, type SocialPlatform, type SocialConnection } from "@/lib/social/types";
import { Rocket, Calendar, CheckCircle, AlertCircle, Settings } from "lucide-react";
import Link from "next/link";

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
}

export function PublishModal({ open, onClose }: PublishModalProps) {
  const { carouselId, title, slides } = useEditorStore();
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [caption, setCaption] = useState("");
  const [scheduleMode, setScheduleMode] = useState<"now" | "schedule">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("12:00");
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (open) {
      setConnections(getSocialConnections());
      setResult(null);
      setPublishing(false);

      // Pre-generate caption from slides
      const slideTitles = slides.map((s, i) => {
        const prefix = i === 0 ? "" : `${i}. `;
        return `${prefix}${s.title.text}`;
      }).filter(Boolean).join("\n");
      setCaption(slideTitles || title || "");
    }
  }, [open, slides, title]);

  function togglePlatform(platform: SocialPlatform) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  }

  async function handlePublish() {
    if (selectedPlatforms.length === 0 || !carouselId) return;
    setPublishing(true);

    let scheduledFor: string | undefined;
    if (scheduleMode === "schedule" && scheduleDate && scheduleTime) {
      scheduledFor = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString();
    }

    // In a real implementation, we'd export slides to URLs here
    const imageUrls = slides.map((_, i) => `https://storage.example.com/${carouselId}/slide-${i + 1}.jpg`);

    createScheduledPost({
      carousel_id: carouselId,
      platforms: selectedPlatforms,
      caption,
      scheduled_for: scheduledFor,
      image_urls: imageUrls,
    });

    // Simulate publish delay
    await new Promise((r) => setTimeout(r, 2000));
    setPublishing(false);
    setResult("success");
  }

  if (result === "success") {
    return (
      <Modal open={open} onClose={onClose}>
        <div className="text-center py-8">
          <CheckCircle size={48} className="text-green-400 mx-auto" />
          <h3 className="text-lg font-bold mt-4">
            {scheduleMode === "now" ? "Publicado com sucesso!" : "Agendado com sucesso!"}
          </h3>
          <p className="text-sm text-text-secondary mt-2">
            {scheduleMode === "now"
              ? `Seu carrossel foi publicado em ${selectedPlatforms.map((p) => PLATFORM_INFO[p].name).join(", ")}`
              : `Seu carrossel sera publicado em ${scheduleDate} as ${scheduleTime}`}
          </p>
          <Button onClick={onClose} className="mt-6">
            Fechar
          </Button>
        </div>
      </Modal>
    );
  }

  const connectedPlatforms = connections.map((c) => c.platform);

  return (
    <Modal open={open} onClose={onClose} title="Publicar Carrossel" className="max-w-lg">
      <div className="space-y-5">
        {/* Platform selection */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Selecionar redes
          </label>
          <div className="space-y-2 mt-2">
            {(Object.keys(PLATFORM_INFO) as SocialPlatform[]).map((platform) => {
              const info = PLATFORM_INFO[platform];
              const connection = connections.find((c) => c.platform === platform);
              const isConnected = !!connection;

              return (
                <div
                  key={platform}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isConnected
                      ? selectedPlatforms.includes(platform)
                        ? "border-accent-bg bg-accent-bg/5"
                        : "border-border-default hover:border-text-secondary cursor-pointer"
                      : "border-border-subtle opacity-50"
                  }`}
                  onClick={() => isConnected && togglePlatform(platform)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform)}
                      disabled={!isConnected}
                      onChange={() => {}}
                      className="rounded accent-white"
                    />
                    <div>
                      <span className="text-sm font-medium">{info.name}</span>
                      {isConnected ? (
                        <span className="text-xs text-text-secondary ml-2">
                          @{connection.platform_username}
                        </span>
                      ) : (
                        <span className="text-xs text-text-secondary ml-2">
                          nao conectado
                        </span>
                      )}
                    </div>
                  </div>
                  {!isConnected && (
                    <Link
                      href="/configuracoes"
                      className="text-xs text-text-secondary hover:text-text-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Settings size={14} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {connectedPlatforms.length === 0 && (
            <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-xs text-warning flex items-center gap-1.5">
                <AlertCircle size={14} />
                Nenhuma rede conectada.{" "}
                <Link href="/configuracoes" className="underline">
                  Conectar em Configuracoes
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Caption */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Legenda
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Escreva a legenda do post..."
            className="w-full mt-1 bg-bg-surface-2 border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary resize-none h-28"
          />
          <p className="text-[10px] text-text-secondary mt-1 text-right">
            {caption.length} caracteres
          </p>
        </div>

        {/* Schedule */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Quando publicar
          </label>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setScheduleMode("now")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm cursor-pointer ${
                scheduleMode === "now"
                  ? "border-accent-bg bg-accent-bg/5 text-text-primary"
                  : "border-border-default text-text-secondary"
              }`}
            >
              <Rocket size={15} />
              Agora
            </button>
            <button
              onClick={() => setScheduleMode("schedule")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm cursor-pointer ${
                scheduleMode === "schedule"
                  ? "border-accent-bg bg-accent-bg/5 text-text-primary"
                  : "border-border-default text-text-secondary"
              }`}
            >
              <Calendar size={15} />
              Agendar
            </button>
          </div>

          {scheduleMode === "schedule" && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="bg-bg-surface-2 border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary"
              />
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="bg-bg-surface-2 border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handlePublish}
            loading={publishing}
            className="flex-1"
            disabled={selectedPlatforms.length === 0}
          >
            <Rocket size={14} className="mr-1.5" />
            {scheduleMode === "now" ? "Publicar" : "Agendar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
