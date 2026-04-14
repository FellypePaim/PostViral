import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, plan } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha obrigatorios" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Senha deve ter pelo menos 6 caracteres" }, { status: 400 });
  }

  const supabase = await createClient();

  // Create user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  if (authData.user) {
    // Create user settings with plan
    const expiresAt = new Date();
    switch (plan) {
      case "weekly":
        expiresAt.setDate(expiresAt.getDate() + 7);
        break;
      case "annual":
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        break;
      default:
        expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    await supabase.from("user_settings").insert({
      user_id: authData.user.id,
      plan: plan || "monthly",
      plan_expires_at: expiresAt.toISOString(),
    } as never);
  }

  return NextResponse.json({
    success: true,
    message: "Conta criada com sucesso",
  });
}
