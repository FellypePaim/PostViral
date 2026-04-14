"use client";

import { FolderOpen, Plus, Trash2, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CollectionListProps {
  collections: Record<string, unknown>[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
}

export function CollectionList({
  collections,
  selected,
  onSelect,
  onAdd,
  onDelete,
}: CollectionListProps) {
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  function handleCreate() {
    if (!newName.trim()) return;
    onAdd(newName.trim());
    setNewName("");
    setCreating(false);
  }

  return (
    <div className="w-64 shrink-0 border-r border-border-default pr-4 space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Pastas
        </h3>
        <button
          onClick={() => setCreating(!creating)}
          className="p-1 text-text-secondary hover:text-text-primary cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </div>

      {creating && (
        <div className="flex gap-1.5 mb-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Nome da pasta"
            className="flex-1 px-2 py-1.5 text-sm bg-bg-surface-2 border border-border-default rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:outline-none"
            autoFocus
          />
          <Button size="sm" onClick={handleCreate}>
            OK
          </Button>
        </div>
      )}

      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
          selected === null
            ? "bg-bg-surface-2 text-text-primary"
            : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-1"
        }`}
      >
        <LayoutGrid size={16} />
        Todos os posts
      </button>

      {collections.map((c) => (
        <div
          key={c.id as string}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors group ${
            selected === c.id
              ? "bg-bg-surface-2 text-text-primary"
              : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-1"
          }`}
        >
          <button
            onClick={() => onSelect(c.id as string)}
            className="flex items-center gap-2 flex-1 cursor-pointer text-left"
          >
            <FolderOpen size={16} />
            <span className="truncate">{c.name as string}</span>
          </button>
          <button
            onClick={() => onDelete(c.id as string)}
            className="p-1 opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-400 cursor-pointer"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
