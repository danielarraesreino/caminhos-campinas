import dilemmasData from "@/data/dilemmas-campinas.json";
import type { Dilemma } from "./dilemma-types";

// biome-ignore lint/suspicious/noExplicitAny: JSON import requires casting
const rawData: any = dilemmasData;
const dataArray = (
	Array.isArray(rawData) ? rawData : rawData?.default || []
) as Dilemma[];

export const GAME_DILEMMAS: Dilemma[] = dataArray;

export const ALL_DILEMMAS: Dilemma[] = [...GAME_DILEMMAS];
