import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-text-primary">404</h1>
        <p className="text-text-secondary mt-2">Pagina nao encontrada</p>
        <Link
          href="/dashboard"
          className="inline-block mt-6 px-6 py-2 bg-accent-bg text-accent-text rounded-[var(--radius-button)] text-sm font-medium hover:opacity-90"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
