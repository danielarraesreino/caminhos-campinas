import type { Dilemma } from "./dilemma-types";
import { GAME_DILEMMAS } from "./dilemmas";
import { REAL_DILEMMAS } from "./dilemmas-real";

export const ALL_DILEMMAS: Dilemma[] = [...GAME_DILEMMAS, ...REAL_DILEMMAS];
