import type { Metadata } from "next";
import { PLANS, getCheckoutUrl } from "@/lib/payments/plans";

export const metadata: Metadata = {
  title: "Gerador de Carrosseis com IA - Crie posts virais em minutos",
  description: "Plataforma de criacao de carrosseis virais para Instagram usando inteligencia artificial. Crie conteudo profissional em menos de 3 minutos.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
          Crie carrosseis virais para Instagram
          <span className="block text-text-secondary">em menos de 3 minutos</span>
        </h1>
        <p className="text-lg text-text-secondary mt-6 max-w-2xl mx-auto">
          Combine IA poderosa com um editor visual intuitivo. Gere textos, imagens e exporte slides prontos para publicar.
        </p>
        <div className="flex justify-center gap-4 mt-10">
          <a
            href="#pricing"
            className="px-8 py-3 bg-accent-bg text-accent-text rounded-[var(--radius-button)] font-medium hover:opacity-90 transition-opacity"
          >
            Comecar agora
          </a>
          <a
            href="#features"
            className="px-8 py-3 border border-border-default text-text-primary rounded-[var(--radius-button)] font-medium hover:bg-bg-surface-1 transition-colors"
          >
            Ver funcionalidades
          </a>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Tudo que voce precisa</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "IA para textos", desc: "Gere titulos, legendas e conteudo completo com Google Gemini" },
            { title: "IA para imagens", desc: "Crie imagens de fundo unicas com Gemini Imagen" },
            { title: "Editor visual", desc: "Controle total sobre fontes, cores, overlays e layouts" },
            { title: "13 fontes premium", desc: "Inter, Playfair Display, Space Grotesk e mais 10 opcoes" },
            { title: "Exportacao ZIP", desc: "Baixe todos os slides nomeados e prontos para publicar" },
            { title: "Calendario com IA", desc: "Planeje seu conteudo para 7, 14 ou 30 dias com um clique" },
          ].map((f, i) => (
            <div key={i} className="bg-bg-surface-1 border border-border-subtle rounded-[var(--radius-card)] p-6">
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-text-secondary text-sm mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Planos</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-bg-surface-1 border rounded-[var(--radius-card)] p-6 text-center ${
                plan.highlight ? "border-accent-bg scale-105" : "border-border-subtle"
              }`}
            >
              {plan.highlight && (
                <span className="text-xs bg-accent-bg text-accent-text px-3 py-1 rounded-full font-medium">
                  Popular
                </span>
              )}
              <h3 className="text-xl font-bold mt-3">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-text-secondary text-sm">{plan.period}</span>
              </div>
              <a
                href={getCheckoutUrl(plan.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className={`block mt-6 py-3 rounded-[var(--radius-button)] font-medium transition-opacity ${
                  plan.highlight
                    ? "bg-accent-bg text-accent-text hover:opacity-90"
                    : "border border-border-default text-text-primary hover:bg-bg-surface-2"
                }`}
              >
                Assinar
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Perguntas frequentes</h2>
        <div className="space-y-4">
          {[
            { q: "Preciso saber design?", a: "Nao! A IA gera o conteudo e voce ajusta com sliders intuitivos. Templates prontos facilitam ainda mais." },
            { q: "Qual IA e usada?", a: "Google Gemini para texto (incluso) e Gemini Imagen para imagens (sua propria chave API, custos a partir de $0.04/img)." },
            { q: "Posso cancelar a qualquer momento?", a: "Sim. Sem fidelidade. Cancele quando quiser e continue usando ate o fim do periodo pago." },
            { q: "Funciona no celular?", a: "O editor e otimizado para desktop, mas o dashboard e configuracoes funcionam em qualquer dispositivo." },
          ].map((faq, i) => (
            <div key={i} className="bg-bg-surface-1 border border-border-subtle rounded-[var(--radius-card)] p-5">
              <h3 className="font-medium">{faq.q}</h3>
              <p className="text-sm text-text-secondary mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-default py-8 text-center text-sm text-text-secondary">
        <p>Suporte via WhatsApp</p>
        <p className="mt-4 text-xs text-text-secondary/60">
          Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
