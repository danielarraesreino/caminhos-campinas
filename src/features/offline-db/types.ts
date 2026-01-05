import type { GameState } from "@/types/GameState";

export interface SavedGameState extends GameState {
	_id: string;
	_rev?: string;
	version: string;
}
