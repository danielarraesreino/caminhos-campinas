CRITICAL: Always validate against src/data/RealityAtlas.ts for narrative integrity.

# Technical Rules & Governance: Caminhos Campinas

## General Principles
- **Offline-First**: Every feature must work without an internet connection using PouchDB/IndexedDB. Cloud sync is secondary.
- **Narrative Integrity**: Changes to dilemmas or stats must be cross-referenced with `RealityAtlas.ts` to ensure consistency with the game's sociological foundation.
- **Mobile-First**: The UI must be optimized for PWA/Mobile usage (Vaul drawers instead of modals where possible).

## TypeScript & Logic
- **Strict Typing**: No `any` types for new core logic. Use interfaces from `src/types/GameState.ts`.
- **Validation**: Use Zod schemas in `src/lib/schemas.ts` for any data coming from external sources or disk.
- **Context Usage**: Use the `useGameContext` hook for all state interactions. Avoid lifting state unnecessarily if it belongs in the global game store.

## Styling & UI (Tailwind CSS 4)
- **Theme Adherence**: Use the "Realismo Sóbrio" theme (Zinc/Slate palettes). Avoid vibrant gamey colors unless specifically representing a status (e.g., Critical Health).
- **Accessibility**: All interactive elements MUST include `aria-label` or `aria-describedby` for screen readers. Modals/Dialogs must include a `DialogTitle` (even if `sr-only`).
- **Performance**: Minimize heavy animations that could drain battery on mobile devices.

## AI & Speech
- **Response Length**: AI responses via `route.ts` must remain under 150 characters to ensure fast TTS and "radio-like" efficiency.
- **Speech API**: Use the `useNativeSpeech` hook for STT/TTS; do not use external cloud-based speech synthesis unless essential.

## Security & Secrets
- **Environment Variables**: NEVER commit `.env` or hardcode keys. Always use `process.env`.
- **Sanitization**: Sanitize user inputs in the `GameChat` before sending them to the AI SDK to prevent prompt injection or XSS.

## Linting & Quality
- **Biome**: Always run `npm run lint` or `npm run format` before pushing. Biome is used for organizing imports.
- **Tests**: New features should include unit tests in `src/tests` or E2E tests in `tests/` if they involve complex user flows.
