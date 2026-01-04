import type { GameState } from "@/contexts/GameContext";

export type TriggerType =
	| "HUNGER_LOW"
	| "HYGIENE_LOW"
	| "RANDOM"
	| "SOCIAL_STIGMA_HIGH"
	| "LOCATION"
	| "STATUS"
	| "CHAIN"
	| "CHAIN_STEP"
	| "STORYLINE_START"
	| "START_SCENARIO"
	| "TIME_SPECIFIC"
	| "LOCATION_IDLE";

export interface DilemmaOption {
	label: string;
	consequence: string;
	consequence_failure?: string;
	risk?: number; // 0-100
	nextDilemmaId?: string; // ID for chained dilemma (immediate trigger)
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
		inventoryRemove?: string | string[];
		addBuff?: string;
		removeBuff?: string;
		workToolUpdate?: Partial<GameState["workTool"]>;
		documentsUpdate?: Partial<GameState["documents"]>;
		timeAdvance?: number;
		clearInventory?: boolean;
		addiction_risk?: number;
		trust_state?: number;
		cycle_repeat?: boolean;
		employed_formal?: boolean;
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
		inventoryRemove?: string | string[];
		addBuff?: string;
		removeBuff?: string;
		workToolUpdate?: Partial<GameState["workTool"]>;
		documentsUpdate?: Partial<GameState["documents"]>;
		timeAdvance?: number;
		clearInventory?: boolean;
		addiction_risk?: number;
		trust_state?: number;
		cycle_repeat?: boolean;
		employed_formal?: boolean;
	};
	telemetryTag?: {
		ods: string;
		action: string;
		outcome: string;
	};
	pduAction?: {
		type: "INIT" | "NEXT_STAGE" | "COMPLETE_STAGE";
		value: string; // Objective (e.g., "TRABALHO") or Stage ID
	};
}

export interface Dilemma {
	id: string;
	title: string;
	description: string;
	trigger: {
		type: TriggerType;
		value: number | string; // Updated to allow string values (e.g. "PERFIL_NEGRO")
		locationId?: string;
		statusCondition?: Record<string, number>;
		prev_id?: string;
		condition?: "slept_outside" | "no_docs" | "accepted_help";
	};
	source_fact?: string;
	ods?: string[];
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
	requiredGender?: string[]; // "masculino" | "feminino" | "nao-binario" | "trans"
	options: DilemmaOption[];
}
