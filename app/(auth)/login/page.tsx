"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { localSignIn } from "@/lib/local-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const schema = yup.object({
  email: yup.string().email("Email invalido").required("Email obrigatorio"),
  password: yup.string().min(6, "Minimo 6 caracteres").required("Senha obrigatoria"),
});

type FormData = yup.InferType<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError("");

    const result = localSignIn(data.email, data.password);

    if (!result.success) {
      setError(result.error || "Erro ao fazer login");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <Card className="p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Entrar</h1>
        <p className="text-sm text-text-secondary mt-1">
          Acesse sua conta para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="password"
          label="Senha"
          type="password"
          placeholder="Sua senha"
          error={errors.password?.message}
          {...register("password")}
        />

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Button type="submit" loading={loading} className="w-full mt-2">
          Entrar
        </Button>
      </form>

      <p className="text-sm text-text-secondary text-center mt-4">
        Nao tem conta?{" "}
        <Link href="/register" className="text-text-primary hover:underline">
          Criar conta
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
