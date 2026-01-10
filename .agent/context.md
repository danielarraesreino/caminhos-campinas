# Project Context: Caminhos Campinas

## Overview
**Caminhos Campinas** is a "Serious Game" and simulation platform focused on the reality of the homeless population (Pop Rua) in Campinas, Brazil. It combines narrative-driven gameplay, survival mechanics, and social awareness to educate users about the challenges and systemic barriers faced by people living on the streets.

The project uses real-world data (Census 2024) and institutional information (SAMIM, Bom Prato, Centro Pop) to create a high-fidelity simulation of the social service ecosystem in the city.

## Tech Stack
- **Frontend Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with `tw-animate-css`
- **Component Library**: Radix UI (accessible primitives)
- **Offline Storage**: PouchDB / IndexedDB (Offline-first architecture)
- **AI Integration**: AI SDK (Vercel) with Groq (Llama 3 models) for the "Survival Radio" NPC/Chat
- **Mapping**: Leaflet / React-Leaflet
- **Form Management**: React Hook Form + Zod
- **Analytics/Monitoring**: Sentry, Microsoft Clarity, Vercel Analytics
- **Linting/Formatting**: Biome (organizeImports enabled)
- **Testing**: Vitest (Unit) and Playwright (E2E)

## Architecture & Data Flow
1. **State Management**: Centralized `GameContext` using `useReducer` to manage the player's stats (hunger, hygiene, health), inventory, and game loop.
2. **Persistence**: The state is synchronized with a local PouchDB instance for persistence across sessions and offline play.
3. **Module Structure**:
   - `src/features/`: Encapsulates core gameplay logic (game-loop, offline-db, specialized UI).
   - `src/data/`: Contains the "Reality Atlas" and dilemma JSON files that define the game's narrative world based on sociological facts.
   - `src/services/`: Handles telemetry and complex matching logic (e.g., `DilemmaMatcher`).
4. **AI/Chat Flow**: Users interact with the "Survival Radio" via a Push-to-Talk interface. Transcriptions are sent to a Groq-powered backend which returns brief, survival-focused advice based on the current `GameState`.

## Business Rules & Narrative
- **Realismo Sóbrio**: The game avoids gamifying tragedy; it uses realistic multipliers and risks derived from actual statistics (e.g., racial stigma multipliers).
- **Institutional Navigation**: A core loop involves navigating the Plano de Desenvolvimento Único (PDU) to regain documentation and citizenship.
- **Critical Alerts**: System uses Haptics and visual vignettes to signal critical health or sanity levels.
