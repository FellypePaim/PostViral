export const SYSTEM_PROMPT = `Voce e um especialista em criacao de carrosseis virais para Instagram.
Suas respostas devem ser em portugues brasileiro.
Quando solicitado a gerar conteudo para slides, retorne APENAS JSON valido sem markdown.`;

export function generateSlidePrompt(topic: string, slideIndex: number, totalSlides: number, profileContext?: string): string {
  return `${profileContext ? `Contexto do perfil: ${profileContext}\n\n` : ""}Gere o conteudo para o slide ${slideIndex + 1} de ${totalSlides} sobre o tema: "${topic}"

${slideIndex === 0 ? "Este e o HOOK (primeiro slide) - deve ser chamativo e gerar curiosidade." : ""}
${slideIndex === totalSlides - 1 ? "Este e o CTA (ultimo slide) - deve convidar a acao (seguir, salvar, compartilhar)." : ""}

Retorne APENAS um JSON neste formato:
{"title": "texto do titulo", "subtitle": "texto do subtitulo"}`;
}

export function refineSlidePrompt(currentTitle: string, currentSubtitle: string, instruction: string): string {
  return `Refine o conteudo deste slide com base na instrucao do usuario.

Titulo atual: "${currentTitle}"
Subtitulo atual: "${currentSubtitle}"
Instrucao: "${instruction}"

Retorne APENAS um JSON: {"title": "novo titulo", "subtitle": "novo subtitulo"}`;
}

export function improveSlidePrompt(currentTitle: string, currentSubtitle: string): string {
  return `Melhore o conteudo deste slide para tornar mais viral e engajador.

Titulo atual: "${currentTitle}"
Subtitulo atual: "${currentSubtitle}"

Retorne APENAS um JSON: {"title": "titulo melhorado", "subtitle": "subtitulo melhorado"}`;
}

export function generateCaptionPrompt(slides: Array<{ title: string; subtitle: string }>): string {
  const content = slides.map((s, i) => `Slide ${i + 1}: ${s.title} - ${s.subtitle}`).join("\n");
  return `Gere uma legenda completa para Instagram baseada neste carrossel:

${content}

A legenda deve:
- Comecar com um hook forte
- Ter emojis estrategicos
- Incluir call-to-action
- Ter hashtags relevantes (5-10)
- Ter entre 150-300 palavras`;
}

export function imagePromptFromSlide(title: string, subtitle: string): string {
  return `Gere um prompt em ingles para gerar uma imagem de fundo para um slide de Instagram com:
Titulo: "${title}"
Subtitulo: "${subtitle}"

O prompt deve descrever uma imagem abstrata/estetica que complemente o texto sem competir com ele.
Retorne APENAS o prompt em ingles, nada mais.`;
}
