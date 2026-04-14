# Contexto do Projeto - Gerador de Carrosseis com IA

> Ultima atualizacao: 2026-04-13

---

## O que e

Plataforma SaaS B2C para criadores de conteudo gerarem carrosseis virais para Instagram usando IA. O usuario descreve um topico, a IA gera texto e imagens, e o editor visual permite ajustar tudo antes de exportar como imagens prontas para publicar.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16.2.3 (App Router, Turbopack) |
| UI | React 19, TypeScript |
| Estilo | Tailwind CSS v4, Framer Motion |
| Estado | Zustand (editor), React Context (auth) |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Formularios | React Hook Form + Yup |
| Icones | Lucide React |
| Exportacao | Canvas API + JSZip |
| Auth (producao) | Supabase Auth (email/senha) |
| Auth (dev local) | localStorage com cookie `local_auth` |
| Banco (producao) | Supabase PostgreSQL + Storage |
| Banco (dev local) | localStorage simulando CRUD |
| IA texto | Google Gemini API (chave do servidor) |
| IA imagem | Google Gemini Imagen (chave do usuario) |
| Pagamento | InfinityPay (checkout externo) |
| Deploy | nginx + PM2 em VPS Ubuntu |

---

## Estrutura de Arquivos

```
PostViral/
├── app/
│   ├── layout.tsx                    Root layout (Inter, dark, pt-BR)
│   ├── page.tsx                      Redirect / -> /dashboard
│   ├── globals.css                   Design tokens + scrollbar dark
│   ├── error.tsx                     Error boundary global
│   ├── not-found.tsx                 Pagina 404
│   ├── transaction/page.tsx          Ativacao pos-compra (3 etapas)
│   ├── (marketing)/
│   │   ├── layout.tsx                Layout sem navbar
│   │   └── landing/page.tsx          Landing page de marketing
│   ├── (auth)/
│   │   ├── layout.tsx                Layout centralizado
│   │   ├── login/page.tsx            Login (email/senha)
│   │   └── register/page.tsx         Cadastro (email/senha/confirmar)
│   ├── (app)/
│   │   ├── layout.tsx                Navbar + AuthProvider + ToastProvider
│   │   ├── dashboard/page.tsx        Home com quick actions + grid posts
│   │   ├── gerador/page.tsx          Editor de carrosseis (3 paineis)
│   │   ├── organizacao/page.tsx      Pastas + grid filtrado
│   │   ├── calendario/page.tsx       Calendario de conteudo com IA
│   │   ├── tutoriais/page.tsx        Area de membros
│   │   └── configuracoes/page.tsx    Perfil + API key + modelo
│   └── api/
│       ├── auth/set-cookie/route.ts  Sync sessao cookie
│       ├── carousels/route.ts        GET lista, POST criar
│       ├── carousels/[id]/route.ts   GET, PUT, DELETE
│       ├── collections/route.ts      GET lista, POST criar
│       ├── collections/[id]/route.ts PUT, DELETE
│       ├── generate/route.ts         IA texto (6 actions)
│       ├── generate-image/route.ts   IA imagem (Gemini Imagen)
│       ├── upload-image/route.ts     Upload Supabase Storage
│       ├── test-key/route.ts         Validar chave Gemini
│       ├── training-profiles/route.ts CRUD perfis treinamento
│       ├── calendario/route.ts       Gerar calendario com IA
│       ├── broadcast/route.ts        Notificacoes (placeholder)
│       ├── transaction-lookup/route.ts Verificar InfinityPay
│       ├── infinitypay-activate/route.ts Ativar conta
│       └── ativar/route.ts           Criar email/senha
├── components/
│   ├── ui/
│   │   ├── button.tsx                Framer Motion hover/tap, 4 variantes
│   │   ├── card.tsx                  Border subtle, hover opcional
│   │   ├── input.tsx                 Label + error + dark style
│   │   ├── modal.tsx                 AnimatePresence, backdrop blur, ESC
│   │   ├── accordion.tsx             Expand/collapse com chevron
│   │   ├── toast.tsx                 Success/error/info, auto-dismiss
│   │   └── spinner.tsx               SVG animado
│   ├── layout/
│   │   └── navbar.tsx                Logo, 5 links, theme toggle, avatar dropdown
│   ├── providers/
│   │   └── auth-provider.tsx         Context com localStorage auth
│   ├── dashboard/
│   │   ├── quick-actions.tsx         3 cards de acao (Criar IA/Treinar/Zero)
│   │   ├── carousel-card.tsx         Card com badges, tempo, Abrir/Duplicar/Pasta/Excluir
│   │   ├── carousel-grid.tsx         Grid responsivo com skeleton loading
│   │   ├── api-key-banner.tsx        Banner amarelo se API key vazia
│   │   ├── create-wizard.tsx         Modal 4 etapas (Formato/Modo/Config IA/Personalizar)
│   │   └── training-modal.tsx        Modal perfis treinamento (listar/criar)
│   ├── editor/
│   │   ├── editor-layout.tsx         Layout 3 paineis (sidebar + canvas)
│   │   ├── canvas/slide-canvas.tsx   Slides horizontais, overlay, pattern, badge, CTA
│   │   ├── slides/slide-list.tsx     Lista vertical DnD com thumbnails
│   │   ├── toolbar/editor-toolbar.tsx Formato, undo/redo, slide N de M
│   │   └── controls/controls-panel.tsx Sidebar com 9 accordions + rodape fixo
│   └── collections/
│       └── collection-list.tsx       Painel de pastas com criar/excluir
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 createBrowserClient (producao)
│   │   ├── server.ts                 createServerClient (producao)
│   │   └── middleware.ts             Protecao de rotas via cookie local_auth
│   ├── ai/
│   │   ├── gemini-client.ts          Wrapper Gemini API (server-side)
│   │   └── prompts.ts               System prompts para cada action
│   ├── api/
│   │   ├── carousels.ts             Funcoes client-side com authFetch
│   │   └── collections.ts           Funcoes client-side com authFetch
│   ├── editor/
│   │   ├── editor-types.ts          Slide, SlideFormat, EditorState interfaces
│   │   └── slide-defaults.ts        Defaults, fontes, cores, patterns, overlays
│   ├── export/
│   │   ├── dom-to-image.ts          Clone DOM -> Canvas -> Blob
│   │   └── zip-builder.ts           JSZip + download helper
│   ├── payments/
│   │   └── plans.ts                 3 planos InfinityPay + checkout URLs
│   ├── auth-fetch.ts                Wrapper fetch com Bearer token
│   ├── local-auth.ts                Auth completo via localStorage
│   └── local-storage-db.ts          CRUD carousels/collections via localStorage
├── hooks/
│   ├── use-auth.ts                  Re-export do AuthProvider
│   ├── use-carousels.ts             Lista + busca + delete (localStorage)
│   ├── use-collections.ts           CRUD collections (localStorage)
│   ├── use-export.ts                Export single/all slides
│   ├── use-auto-save.ts             Debounce 2s para localStorage
│   ├── use-keyboard-shortcuts.ts    Ctrl+Z, Ctrl+Y, Delete
│   └── use-theme.ts                 Dark/light toggle + localStorage
├── stores/
│   └── editor-store.ts              Zustand: slides, undo/redo (30 niveis), CRUD
├── types/
│   └── database.ts                  Tipagem completa das 6 tabelas
├── ecosystem.config.js              PM2 config
├── nginx.conf                       Reverse proxy template
└── .env.local.example               Variaveis de ambiente
```

---

## Design System

| Token | Valor |
|-------|-------|
| Background | `#0a0a0a` |
| Surface 1 | `#111111` |
| Surface 2 | `#1a1a1a` |
| Surface 3 | `#222222` |
| Texto primario | `#ffffff` |
| Texto secundario | `#a1a1a6` |
| Borda | `rgba(255,255,255,0.08)` |
| Accent (CTA) | `#ffffff` bg + `#000000` text |
| Warning | `#f59e0b` |
| Border radius card | `16px` |
| Border radius button | `10px` |
| Fonte UI | Inter |
| Fontes editor | Inter, Playfair Display, Caveat, Space Grotesk, Syne, Outfit, DM Sans, Raleway, Bebas Neue, Montserrat, Plus Jakarta Sans, Manrope, Urbanist |

---

## Fluxos Principais Implementados

### 1. Cadastro/Login (local)
`/register` -> preenche email+senha -> localStorage salva user+session+settings -> cookie `local_auth` -> redirect `/dashboard`

### 2. Dashboard
3 quick actions + grid de posts gerados com busca e acoes (Abrir/Duplicar/Pasta/Excluir)

### 3. Criar com IA (wizard 4 etapas)
Etapa 1: Formato (Carrossel/Quadrado/Stories) + Estilo (Minimalista/Profile)
Etapa 2: Modo (Usar IA / Criacao Manual)
Etapa 3: Tema + referencia + num slides + opcoes imagem
Etapa 4: @instagram + combo fontes + identidade visual hex
-> Loading animado -> redirect para editor com slides gerados

### 4. Editor de Carrosseis
- Sidebar esquerda: 9 accordions (Gerar IA, Identidade Visual, Imagem Fundo, Overlay, Fundo, Titulo&Subtitulo com controles completos, Badge, CTA, Templates)
- Canvas central: slides horizontais scroll, numerados, drag handles, botao +
- Toolbar: formato, undo/redo, slide N de M, add/delete
- Rodape fixo: Baixar Slide N, Salvar, Baixar Todos, Gerar Legenda
- Status bar: slide/total, dimensoes, tema, status save
- Auto-save: debounce 2s para localStorage
- Atalhos: Ctrl+Z, Ctrl+Y, Delete

### 5. Organizacao
Painel pastas (criar/excluir) + grid filtrado por pasta + busca

### 6. Calendario
Modal: nicho + periodo (7/14/30 dias) + tipos conteudo -> gera com IA

### 7. Configuracoes
Tab Perfil (nome, email, plano, alterar senha, sair) + Tab API & IA (chave Gemini mascarada, testar, modelos imagem)

### 8. Tutoriais
2 modulos com aulas "Em Breve" + CTA YouTube

### 9. Ativacao (transaction)
3 etapas: codigo pedido -> email -> criar senha

### 10. Landing Page
Hero + features + pricing 3 planos + FAQ + footer

---

## O que Funciona Agora (100% local, sem APIs externas)

- Cadastro e login com localStorage
- Protecao de rotas via middleware (cookie)
- CRUD carrosseis e colecoes no localStorage
- Editor completo com todos os controles visuais
- Wizard 4 etapas gerando slides localmente
- Perfis de treinamento salvos no localStorage
- Undo/redo no editor (30 niveis)
- DnD para reordenar slides
- Auto-save a cada 2s
- Theme toggle (dark/light)
- Navbar com avatar dropdown
- Todas as paginas navegaveis

---

## O que Falta / Proximos Passos

### Prioridade Alta

1. **Conectar Gemini API real** - Colocar `GEMINI_API_KEY` valida no `.env.local`. As API routes `/api/generate` e `/api/calendario` ja estao prontas e vao funcionar imediatamente.

2. **Geracao de imagem com IA no editor** - O botao "Gerar Imagem com IA" na sidebar precisa de fluxo client-side que chama `/api/generate-image` com a apiKey do usuario. A API route ja existe.

3. **Upload de imagem funcional** - Conectar o drag-and-drop de imagem de fundo ao `/api/upload-image` ou salvar como base64 no localStorage para dev local.

4. **Modal de Legenda + Hashtags** - O botao "Gerar Legenda" no rodape da sidebar precisa abrir um modal que chama `/api/generate` com action `custom` e exibe a legenda editavel com botao "Copiar tudo".

5. **Exportacao real (DOM->Canvas)** - A pipeline `dom-to-image.ts` usa SVG foreignObject que tem limitacoes com cross-origin. Avaliar usar `html2canvas` como fallback ou renderizar server-side.

### Prioridade Media

6. **Migrar para Supabase** - Criar projeto Supabase, rodar os SQLs de `types/database.ts`, trocar `local-auth.ts`/`local-storage-db.ts` pelo Supabase real. Os API routes ja usam Supabase - so precisa configurar as env vars.

7. **Destaque de palavra funcional** - Os chips de palavras no titulo/subtitulo precisam renderizar como clicaveis e aplicar cor/formatacao (negrito, italico, sublinhado, riscado) por palavra individual no canvas.

8. **Templates de estilo** - Implementar salvar/carregar templates no localStorage (ou Supabase). O accordion "Templates de Estilo" tem o input mas nao salva ainda.

9. **Perfis de treinamento no wizard** - Na etapa 3 do wizard, adicionar dropdown para selecionar perfil treinado e injetar o contexto no prompt da IA.

10. **Responsividade mobile** - O editor e focado em desktop. Adaptar sidebar para collapsible/bottom-sheet em telas menores.

### Prioridade Baixa

11. **InfinityPay real** - Trocar os placeholders em `/api/transaction-lookup` e `/api/infinitypay-activate` pela API real do InfinityPay.

12. **Suporte a imagem de referencia** - No wizard etapa 3 e no editor "Gerar com IA", implementar upload de ate 5 imagens de referencia que sao enviadas ao Gemini.

13. **Grade de imagens** - Implementar o toggle "Mostrar grade" que overlay um grid visual no canvas para alinhamento.

14. **Indicadores de quantidade (bolinhas)** - Renderizar as bolinhas de navegacao no slide (como no Instagram).

15. **Copiar layout / Aplicar no proximo slide** - Botoes que copiam as configs visuais de um slide para outro.

16. **Tutoriais reais** - Gravar e embedar videos de tutorial com YouTube.

17. **Landing page interativa** - Adicionar animacoes CSS (marquee, fadeInUp, pulse-glow), video demo, popup de oferta anual.

18. **SEO e meta tags** - Configurar Open Graph, Twitter Cards, sitemap, robots.txt.

---

## Banco de Dados (SQL pronto para Supabase)

```sql
-- user_settings
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  gemini_api_key TEXT,
  preferred_image_model TEXT DEFAULT 'gemini-2.0-flash-exp',
  display_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'weekly',
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- collections
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- carousels
CREATE TABLE carousels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT,
  topic TEXT,
  post_style TEXT DEFAULT 'minimalista',
  slide_count INTEGER DEFAULT 1,
  thumbnail TEXT,
  collection_id UUID REFERENCES collections(id),
  slides_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- templates
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  preview_url TEXT,
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- training_profiles
CREATE TABLE training_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  instagram_handle TEXT,
  niche TEXT,
  target_audience TEXT,
  tone_of_voice TEXT,
  content_type TEXT,
  extra_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- calendars
CREATE TABLE calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  niche TEXT NOT NULL,
  period INTEGER DEFAULT 7,
  content_types TEXT[],
  days_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS em todas as tabelas: auth.uid() = user_id
```

---

## Variaveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=         # URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Anon key do Supabase
SUPABASE_SERVICE_ROLE_KEY=        # Service role key (server-side)
GEMINI_API_KEY=                   # Chave Gemini para geracao de texto
NEXT_PUBLIC_APP_URL=              # URL da aplicacao
```

---

## Comandos

```bash
npm run dev      # Dev server com Turbopack (porta 3000)
npm run build    # Build de producao
npm run start    # Inicia servidor de producao
npm run lint     # ESLint
```

---

## Numeros

- 60+ arquivos de codigo
- 15 API routes
- 11 paginas
- 20 componentes
- 7 hooks customizados
- 1 Zustand store
- 6 tabelas no schema
- 13 fontes no editor
- 9 secoes de controle no editor
- Build passando 100%
