import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/ai/gemini-client";
import {
  SYSTEM_PROMPT,
  generateSlidePrompt,
  refineSlidePrompt,
  improveSlidePrompt,
  generateCaptionPrompt,
  imagePromptFromSlide,
} from "@/lib/ai/prompts";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  try {
    let result: string;

    switch (action) {
      case "generate-slide": {
        const { topic, slideIndex, totalSlides, profileContext } = body;
        const prompt = generateSlidePrompt(topic, slideIndex, totalSlides, profileContext);
        result = await generateWithGemini(prompt, SYSTEM_PROMPT);
        break;
      }
      case "refine": {
        const { currentTitle, currentSubtitle, instruction } = body;
        const prompt = refineSlidePrompt(currentTitle, currentSubtitle, instruction);
        result = await generateWithGemini(prompt, SYSTEM_PROMPT);
        break;
      }
      case "improve": {
        const { currentTitle, currentSubtitle } = body;
        const prompt = improveSlidePrompt(currentTitle, currentSubtitle);
        result = await generateWithGemini(prompt, SYSTEM_PROMPT);
        break;
      }
      case "custom": {
        const { prompt: userPrompt, slides } = body;
        const prompt = slides ? generateCaptionPrompt(slides) : userPrompt;
        result = await generateWithGemini(prompt, SYSTEM_PROMPT);
        break;
      }
      case "image-prompt":
      case "slide-image-prompt": {
        const { currentTitle, currentSubtitle, title, subtitle } = body;
        const t = currentTitle || title || "";
        const s = currentSubtitle || subtitle || "";
        const prompt = imagePromptFromSlide(t, s);
        result = await generateWithGemini(prompt);
        break;
      }
      default:
        return NextResponse.json({ error: "Action invalida" }, { status: 400 });
    }

    // Try to parse JSON from result
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch {
      // Not JSON, return as text
    }

    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro na geracao";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
