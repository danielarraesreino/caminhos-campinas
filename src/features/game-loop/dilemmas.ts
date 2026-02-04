import dilemmasData from "@/data/dilemmas-campinas.json";
import type { Dilemma } from "./dilemma-types";

// [FIX] Ensure Robust Loading (User provided hint about import vs fetch)
// Using direct import is safer for offline-first, but we sanitize the output.
const rawData = dilemmasData as unknown;
const dataArray = (Array.isArray(rawData) ? rawData : (rawData as { default: Dilemma[] }).default || []) as Dilemma[];

export const GAME_DILEMMAS: Dilemma[] = dataArray;

export const ALL_DILEMMAS: Dilemma[] = [...GAME_DILEMMAS];

// Debug logging
console.log(`[Dilemmas] Loaded ${GAME_DILEMMAS.length} dilemmas from JSON`);
if (GAME_DILEMMAS.length > 0) {
	console.log(`[Dilemmas] First dilemma:`, GAME_DILEMMAS[0]?.id);
}
