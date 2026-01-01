import type { GameState } from "@/contexts/GameContext";

export type TriggerType =
	| "HUNGER_LOW"
	| "HYGIENE_LOW"
	| "RANDOM"
	| "SOCIAL_STIGMA_HIGH"
	| "LOCATION"
	| "STATUS"
	| "CHAIN";

export interface DilemmaOption {
	label: string;
	consequence: string;
	consequence_failure?: string;
	risk?: number; // 0-100
	nextDilemmaId?: string; // ID of the next dilemma to trigger immediately
	effect: Partial<
		Omit<
			GameState,
			| "inventory"
			| "day"
			| "time"
			| "resolvedDilemmas"
			| "activeDilemmaId"
			| "activeBuffs"
			| "workTool"
			| "criticalHealth"
		>
	> & {
		inventoryAdd?: string;
		addBuff?: string;
		removeBuff?: string;
		workToolUpdate?: Partial<GameState["workTool"]>;
		timeAdvance?: number;
		// Special handling for inventory clear or specific changes
		clearInventory?: boolean;
	};
	effect_failure?: Partial<
		Omit<
			GameState,
			| "inventory"
			| "day"
			| "time"
			| "resolvedDilemmas"
			| "activeDilemmaId"
			| "activeBuffs"
			| "workTool"
			| "criticalHealth"
		>
	> & {
		inventoryAdd?: string;
		addBuff?: string;
		removeBuff?: string;
		workToolUpdate?: Partial<GameState["workTool"]>;
		timeAdvance?: number;
		clearInventory?: boolean;
	};
	telemetryTag?: {
		ods: string;
		action: string;
		outcome: string;
		violation_type?: string;
		resource_gap?: string;
	};
}

export interface Dilemma {
	id: string;
	title: string;
	description: string;
	trigger: {
		type: TriggerType;
		value: number;
		locationId?: string;
		statusCondition?: Record<string, number>;
	};
	tags?: string[];
	glossaryTerms?: string[];
	location_trigger?: {
		lat: number;
		lng: number;
		radius: number; // em metros
	};
	audioId?: string;
	ambience?: string;
	soundEffect?: string;
	prerequisite?: string;
	repeatable?: boolean;
	options: DilemmaOption[];
}

// --- DATA DRIVEN DILEMMAS (JSON FACTORY) ---
import dilemmasData from "@/data/dilemmas-campinas.json";

// Cast JSON data to Dilemma[] to ensure type safety (or define a Zod schema for runtime validation)
// Using 'as unknown as Dilemma[]' here effectively trusts the JSON structure matches the interface.
// Ideally, we would map it to ensure all fields like 'function' or 'complex objects' are handled if they exist.
// Since our JSON structure matches the Dilemma interface (serialized), this works for now.
export const GAME_DILEMMAS: Dilemma[] = dilemmasData as unknown as Dilemma[];

export const ALL_DILEMMAS: Dilemma[] = [...GAME_DILEMMAS];
