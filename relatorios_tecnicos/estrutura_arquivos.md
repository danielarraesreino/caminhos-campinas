# Estrutura de Arquivos - Caminhos Campinas

## Raiz
- `.env` (Configurações de ambiente)
- `package.json` (Dependências e scripts)
- `next.config.mjs` (Configurações do Next.js)
- `tsconfig.json` (Configurações TypeScript)
- `biome.json` (Linter/Formatter)
- `prisma/schema.prisma` (Schema do Banco de Dados)

## Source (`src/`)

### `src/app` (Next.js App Router)
- `layout.tsx` (Layout Root)
- `page.tsx` (Home Page)
- `globals.css` (Estilos globais Tailwind)
- `jogar/page.tsx` (Página principal do jogo)
- `login/` (Autenticação)
- `api/` (Rotas de API Backend)
  - `auth/[...nextauth]/route.ts` (NextAuth Handler)

### `src/features` (Feature-based Modules)
- `game-loop/` (Lógica central do jogo)
- `ui/` (Componentes de Interface do Jogo: HUD, Chat, Dilemas)
- `audio/` (Sistema de Áudio Imersivo)
- `survival-map/` (Mapa interativo Leaflet)
- `locations/` (Sistema de Locais/Atlas)

### `src/hooks` (Custom React Hooks)
- `useEventEngine.ts` (Motor de eventos e dilemas)
- `useGameLoop.ts` (Loop temporal do jogo)
- `useAudioDirector.ts` (Direção de áudio dinâmica)
- `useModalQueue.ts` (Gerenciamento de filas de modais)

### `src/contexts` (State Management)
- `GameContext.tsx` (Estado global do jogo: stats, inventário, flags)
- `ModalQueueContext.tsx` (Estado da fila de modais)

### `src/data`
- `dilemmas.ts` / `story-arcs.ts` (Conteúdo narrativo estático/dinâmico)

### `src/auth.ts`
- Configuração central do NextAuth (Google + Anônimo)
