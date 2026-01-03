import type { GameState } from "@/contexts/GameContext";

export type TriggerType =
	| "HUNGER_LOW"
	| "HYGIENE_LOW"
	| "RANDOM"
	| "SOCIAL_STIGMA_HIGH"
	| "LOCATION"
	| "STATUS"
	| "CHAIN"
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
		addBuff?: string;
		removeBuff?: string;
		workToolUpdate?: Partial<GameState["workTool"]>;
		timeAdvance?: number;
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
		value: number;
		locationId?: string;
		statusCondition?: Record<string, number>;
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
