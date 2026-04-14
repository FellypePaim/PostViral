import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, plan, code } = await request.json();

  if (!email?.trim()) {
    return NextResponse.json({ error: "Email obrigatorio" }, { status: 400 });
  }

  const supabase = await createClient();

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === email);

  if (existing) {
    return NextResponse.json({
      exists: true,
      message: "Conta ja existe. Faca login.",
    });
  }

  return NextResponse.json({
    success: true,
    email,
    plan: plan || "monthly",
    code,
    step: "create-password",
  });
}
