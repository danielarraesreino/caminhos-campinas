import dilemmasData from "@/data/dilemmas-campinas.json";
import type { Dilemma } from "./dilemma-types";

// biome-ignore lint/suspicious/noExplicitAny: JSON import requires casting
const rawData: any = dilemmasData;
const dataArray = (
	Array.isArray(rawData) ? rawData : rawData?.default || []
) as Dilemma[];

export const GAME_DILEMMAS: Dilemma[] = dataArray;

export const ALL_DILEMMAS: Dilemma[] = [...GAME_DILEMMAS];

// Debug logging
console.log(`[Dilemmas] Loaded ${GAME_DILEMMAS.length} dilemmas from JSON`);
if (GAME_DILEMMAS.length > 0) {
	console.log(`[Dilemmas] First dilemma:`, GAME_DILEMMAS[0]?.id);
	console.log(
		`[Dilemmas] Sample IDs:`,
		GAME_DILEMMAS.slice(0, 5).map((d) => d.id),
	);
}
