import type { Dilemma } from "./dilemma-types";
import dilemmasData from "@/data/dilemmas-campinas.json";

// biome-ignore lint/suspicious/noExplicitAny: JSON import requires casting
export const GAME_DILEMMAS: Dilemma[] = dilemmasData as any as Dilemma[];

export const ALL_DILEMMAS: Dilemma[] = [...GAME_DILEMMAS];
