<<<<<<< HEAD
import type { GameState } from "@/contexts/GameContext";

// import { REAL_DILEMMAS } from "./dilemmas-real"; // Circular dependency removed

// --- REALITY INJECTED DILEMMAS (SOCIOLOGIA_BRASILEIRA_E_CAMPINAS) ---
// --- REALITY INJECTED DILEMMAS (SOCIOLOGIA_BRASILEIRA_E_CAMPINAS) ---
=======
>>>>>>> 9ff5c3fb2de03e1743bce4b51ec2858e1a242085
import dilemmasData from "@/data/dilemmas-campinas.json";
import type { Dilemma } from "./dilemma-types";

// biome-ignore lint/suspicious/noExplicitAny: JSON import requires casting
const rawData: any = dilemmasData;
const dataArray = (
	Array.isArray(rawData) ? rawData : rawData?.default || []
) as Dilemma[];

<<<<<<< HEAD
// ALL_DILEMMAS moved to all-dilemmas.ts to avoid circular dependency
=======
export const GAME_DILEMMAS: Dilemma[] = dataArray;

export const ALL_DILEMMAS: Dilemma[] = [...GAME_DILEMMAS];
>>>>>>> 9ff5c3fb2de03e1743bce4b51ec2858e1a242085
