import type { GameState } from "@/contexts/GameContext";

export type TriggerType =
	| "HUNGER_LOW"
	| "HYGIENE_LOW"
	| "RANDOM"
	| "SOCIAL_STIGMA_HIGH"
	| "LOCATION"
<<<<<<< HEAD
	| "STATUS";
=======
	| "STATUS"
	| "CHAIN"
	| "LOCATION_IDLE";
>>>>>>> 9ff5c3fb2de03e1743bce4b51ec2858e1a242085

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
<<<<<<< HEAD
=======
	glossaryTerms?: string[];
>>>>>>> 9ff5c3fb2de03e1743bce4b51ec2858e1a242085
	location_trigger?: {
		lat: number;
		lng: number;
		radius: number; // em metros
	};
	audioId?: string;
	ambience?: string;
	soundEffect?: string;
	prerequisite?: string;
<<<<<<< HEAD
=======
	repeatable?: boolean;
>>>>>>> 9ff5c3fb2de03e1743bce4b51ec2858e1a242085
	options: DilemmaOption[];
}
