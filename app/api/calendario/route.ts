import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/ai/gemini-client";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });

  const { niche, period, contentTypes } = await request.json();

  const prompt = `Gere um calendario de conteudo para Instagram com ${period} dias sobre o nicho: "${niche}".

Tipos de conteudo permitidos: ${(contentTypes || ["educativo", "engajamento", "vendas", "dica-rapida"]).join(", ")}

Para cada dia, gere uma ideia de post com: dia (numero), tipo de conteudo, titulo do post, descricao curta.

Retorne APENAS um JSON array neste formato:
[{"day": 1, "type": "educativo", "title": "Titulo do post", "description": "Descricao curta"}]`;

  try {
    const result = await generateWithGemini(prompt);
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    let daysData = [];
    if (jsonMatch) {
      daysData = JSON.parse(jsonMatch[0]);
    }

    const { data, error } = await supabase
      .from("calendars")
      .insert({
        user_id: user.id,
        niche,
        period: period || 7,
        content_types: contentTypes,
        days_data: daysData,
      } as never)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao gerar calendario";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
