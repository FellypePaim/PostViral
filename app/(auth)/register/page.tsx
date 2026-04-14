"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { localSignUp } from "@/lib/local-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const schema = yup.object({
  email: yup.string().email("Email invalido").required("Email obrigatorio"),
  password: yup.string().min(6, "Minimo 6 caracteres").required("Senha obrigatoria"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Senhas nao conferem")
    .required("Confirme sua senha"),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
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

    const result = localSignUp(data.email, data.password);

    if (!result.success) {
      setError(result.error || "Erro ao criar conta");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Criar conta</h1>
        <p className="text-sm text-text-secondary mt-1">
          Cadastre-se para comecar a criar carrosseis
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
          placeholder="Minimo 6 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          id="confirmPassword"
          label="Confirmar senha"
          type="password"
          placeholder="Repita a senha"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Button type="submit" loading={loading} className="w-full mt-2">
          Criar conta
        </Button>
      </form>

      <p className="text-sm text-text-secondary text-center mt-4">
        Ja tem conta?{" "}
        <Link href="/login" className="text-text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </Card>
  );
}
