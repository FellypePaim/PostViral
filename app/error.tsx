"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-primary">Erro</h1>
        <p className="text-text-secondary mt-2">Algo deu errado</p>
        <p className="text-xs text-text-secondary/60 mt-1">{error.message}</p>
        <button
          onClick={reset}
          className="inline-block mt-6 px-6 py-2 bg-accent-bg text-accent-text rounded-[var(--radius-button)] text-sm font-medium hover:opacity-90 cursor-pointer"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
