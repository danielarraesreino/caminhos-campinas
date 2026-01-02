import type { GameState } from "@/contexts/GameContext";

// import { REAL_DILEMMAS } from "./dilemmas-real"; // Circular dependency removed

// --- REALITY INJECTED DILEMMAS (SOCIOLOGIA_BRASILEIRA_E_CAMPINAS) ---
// --- REALITY INJECTED DILEMMAS (SOCIOLOGIA_BRASILEIRA_E_CAMPINAS) ---
import dilemmasData from "@/data/dilemmas-campinas.json";
import type { Dilemma } from "./dilemma-types";

// biome-ignore lint/suspicious/noExplicitAny: JSON import requires casting
export const GAME_DILEMMAS: Dilemma[] = dilemmasData as any as Dilemma[];

// ALL_DILEMMAS moved to all-dilemmas.ts to avoid circular dependency
