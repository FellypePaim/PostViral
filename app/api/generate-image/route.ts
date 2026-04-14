import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const { prompt, aspectRatio, apiKey, preferredModel } = await request.json();

  if (!apiKey) {
    return NextResponse.json({ error: "API key do Gemini nao fornecida" }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ error: "Prompt obrigatorio" }, { status: 400 });
  }

  const model = preferredModel || "gemini-2.0-flash-exp";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `Generate an image: ${prompt}` }],
            },
          ],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
            ...(aspectRatio && { aspectRatio }),
          },
        }),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error: `Gemini Imagen error: ${error}` }, { status: 500 });
    }

    const data = await res.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: { inlineData?: unknown }) => p.inlineData);

    if (imagePart?.inlineData) {
      const { data: base64, mimeType } = imagePart.inlineData;
      const imageUrl = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({ imageUrl });
    }

    return NextResponse.json({ error: "Nenhuma imagem gerada" }, { status: 500 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro na geracao de imagem";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
