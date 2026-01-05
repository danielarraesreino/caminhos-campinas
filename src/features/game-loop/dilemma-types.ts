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
	consequence_success?: string; // [NEW] For probabilistic outcomes
	risk?: number; // 0-100
	chance?: number; // [NEW] 0-1 (Success probability)
	action?: "SET_FLAG" | "START_QUEST"; // [NEW] Special Logic Actions
	flag?: string; // [NEW] Payload for SET_FLAG
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

export interface DilemmaConditions {
	gender?: "masculino" | "feminino" | "nao-binario" | "trans" | "all";
	minHealth?: number;
	requiredItem?: string;
	requiredFlag?: string;
}

export type DilemmaAspect =
	| "SECURITY"
	| "HEALTH"
	| "FOOD"
	| "HYGIENE"
	| "WORK"
	| "FAMILY"
	| "SOCIAL";

export interface Dilemma {
	id: string;
	arcId?: string;
	nextDilemmaId?: string;
	title: string;
	description: string;
	aspect?: DilemmaAspect; // Optional for now to avoid breaking existing data immediately
	intensity?: "LOW" | "HIGH";
	conditions?: DilemmaConditions;
	trigger: {
		type: TriggerType;
		value: number | string; // Updated to allow string values (e.g. "PERFIL_NEGRO")
		locationId?: string;
		statusCondition?: Record<string, number>;
		prev_id?: string;
		condition?: string; // Updated to allow "state.documents.hasRG" expressions
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
	occurrenceCount?: number; // Termômetro Social: quantas vezes isso foi relatado
	relatedKeywords?: string[]; // Para agrupar relatos livres (ex: "fome", "comida")
	requiredGender?: string[]; // Legacy support, prefer 'conditions.gender'
	options: DilemmaOption[];
}
