import type { Dilemma } from "./dilemma-types";
import { GAME_DILEMMAS } from "./dilemmas";
import { EXPANSION_DILEMMAS } from "./dilemmas-expansion";
import { REAL_DILEMMAS } from "./dilemmas-real";

export const ALL_DILEMMAS: Dilemma[] = [
	...GAME_DILEMMAS,
	...REAL_DILEMMAS,
	...EXPANSION_DILEMMAS,
];
