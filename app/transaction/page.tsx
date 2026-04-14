"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

type Step = 1 | 2 | 3;

export default function TransactionPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [plan, setPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStep1() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/transaction-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.valid) {
        setPlan(data.plan || "monthly");
        setStep(2);
      } else {
        setError("Codigo invalido");
      }
    } catch {
      setError("Erro ao verificar codigo");
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/infinitypay-activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan, code }),
      });
      const data = await res.json();
      if (data.exists) {
        setError("Conta ja existe. Faca login.");
      } else if (data.success) {
        setStep(3);
      }
    } catch {
      setError("Erro ao verificar email");
    } finally {
      setLoading(false);
    }
  }

  async function handleStep3() {
    if (password !== confirmPassword) {
      setError("Senhas nao conferem");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ativar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, plan }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/login");
      } else {
        setError(data.error || "Erro ao criar conta");
      }
    } catch {
      setError("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <Card className="p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s
                    ? "bg-accent-bg text-accent-text"
                    : "bg-bg-surface-3 text-text-secondary"
                }`}
              >
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
              {s < 3 && <div className={`w-8 h-px ${step > s ? "bg-accent-bg" : "bg-border-default"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">Codigo do Pedido</h2>
            <p className="text-sm text-text-secondary text-center">
              Insira o codigo recebido apos a compra
            </p>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Cole seu codigo aqui"
            />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button onClick={handleStep1} loading={loading} className="w-full">
              Verificar
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">Confirmar Email</h2>
            <p className="text-sm text-text-secondary text-center">
              Informe o email que deseja usar
            </p>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button onClick={handleStep2} loading={loading} className="w-full">
              Continuar
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">Criar Senha</h2>
            <p className="text-sm text-text-secondary text-center">
              Defina uma senha para acessar sua conta
            </p>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha (min. 6 caracteres)"
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar senha"
            />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button onClick={handleStep3} loading={loading} className="w-full">
              Criar conta
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
