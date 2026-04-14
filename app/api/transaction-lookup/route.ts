import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code } = await request.json();

  if (!code?.trim()) {
    return NextResponse.json({ error: "Codigo obrigatorio" }, { status: 400 });
  }

  // TODO: integrar com API real do InfinityPay
  // Por enquanto retorna sucesso para qualquer codigo valido
  return NextResponse.json({
    valid: true,
    plan: "monthly",
    code: code.trim(),
  });
}
