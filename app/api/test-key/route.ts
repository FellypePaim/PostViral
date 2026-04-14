import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get("key");

  if (!apiKey) {
    return NextResponse.json({ valid: false, error: "Key obrigatoria" });
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (res.ok) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false, error: "Chave invalida" });
  } catch {
    return NextResponse.json({ valid: false, error: "Erro ao validar" });
  }
}
