# Tecnologias Usadas - Caminhos Campinas

## Core
- **Framework Web:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **UI Library:** React 19
- **Estilização:** Tailwind CSS 4 + SASS (SCSS) modules (em alguns componentes legado)

## Backend & Data
- **Banco de Dados (Produção):** PostgreSQL (via Supabase ou Railway)
- **ORM:** Prisma
- **State Local (Offline-first):** PouchDB + IndexedDB
- **Validação:** Zod

## Autenticação
- **Library:** Auth.js (NextAuth v5 beta)
- **Providers:** Google OAuth, Credentials (Login Anônimo)

## Mapas & Geolocalização
- **Map Engine:** Leaflet (React Leaflet)

## IA & LLMs
- **SDK:** Vercel AI SDK
- **Models:** Google Gemini, Groq (Llama 3/Mixtral)

## Tooling & Qualidade
- **Linter/Formatter:** Biome
- **Testes:** Vitest (Unitários), Playwright (E2E)
- **Analytics:** Vercel Analytics, Microsoft Clarity
