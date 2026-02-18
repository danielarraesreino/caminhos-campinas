"use client";

import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from "react";
import type { SavedGameState } from "@/features/offline-db/types";
import { useOfflineDB } from "@/features/offline-db/useOfflineDB";
import { SavedGameStateSchema } from "@/lib/schemas";
import { TelemetryAction, telemetryService } from "@/services/telemetry";
import type {
	Avatar,
	GameAction,
	GameEvent,
	GameState,
	Item,
	PDUObjective,
	PDUState,
} from "@/types/GameState";

export type {
	Avatar,
	GameAction,
	GameEvent,
	GameState,
	Item,
	PDUObjective,
	PDUState,
};

const INITIAL_STATE: GameState = {
	health: 100,
	hunger: 100,
	hygiene: 50,
	sanity: 80,
	energy: 100,
	dignity: 50,
	socialStigma: 10,
	stabilityGap: 20,
	money: 10,
	pdu: {
		isActive: false,
		objective: null,
		currentStageId: "",
		completedStages: [],
		stressLevel: 0,
	},
	workTool: {
		type: null,
		condition: 100,
		capacity: 0,
		riskFactor: 0,
		isConfiscated: false,
	},
	documents: {
		hasRG: false, // [CRITICAL] Starts without RG for Arc 2
		hasCPF: true,
		hasCarteiraTrabalho: false,
		hasComprovanteResidencia: false,
	},
	socialThermometer: {
		fome: 0,
		higiene: 0,
		violencia: 0,
		saude: 0,
	},
	flags: {}, // [NEW] Narrative flags
	activeBuffs: [],
	isAtShelter: false,
	inventory: [],
	day: 1,
	time: 8,
	resolvedDilemmas: [],
	activeDilemmaId: null,
	criticalHealth: false,
	avatar: null,
	phoneBattery: 100,
	userPosition: null,
	isPaused: false,
	addiction: 0,
	trust: 50, // 0-100, starts neutral
	employed_formal: false,
	citizenship: 0,
	knowledge: 0,
	score: 0,
	security: 0,
	history: [],
	activeArcId: null,
	isProcessingGameOver: false,
	hasHydrated: true,
};

// --- Reducer ---

function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "SET_STATE": {
			// Ensure PDU structure exists if loading legacy state
			const loadedState = action.payload;
			if (!loadedState.pdu) {
				loadedState.pdu = INITIAL_STATE.pdu;
			}
			return {
				...state,
				...loadedState,
				isPaused: action.payload.activeDilemmaId !== null,
			};
		}

		case "INIT_PDU":
			return {
				...state,
				pdu: {
					isActive: true,
					objective: action.payload.objective,
					currentStageId: "entrevista_inicial",
					completedStages: [],
					stressLevel: 0,
				},
			};

		case "UPDATE_PDU_STAGE":
			return {
				...state,
				pdu: {
					...state.pdu,
					currentStageId: action.payload.stageId,
				},
			};

		case "COMPLETE_PDU_STAGE":
			if (state.pdu.completedStages.includes(action.payload.stageId))
				return state;
			return {
				...state,
				pdu: {
					...state.pdu,
					completedStages: [
						...state.pdu.completedStages,
						action.payload.stageId,
					],
				},
			};

		case "MODIFY_STAT": {
			const { stat, amount } = action.payload;
			const currentValue = state[stat as keyof GameState];
			if (typeof currentValue !== "number") return state;

			let newValue = currentValue + amount;

			if (stat !== "money") {
				newValue = Math.max(0, Math.min(100, newValue));
			} else {
				newValue = Math.max(0, newValue);
			}

			const newState = { ...state, [stat]: newValue };

			if (stat === "hunger" && newValue === 0) {
				newState.health = Math.max(0, state.health - 5);
			}

			if (stat === "health" || (stat === "hunger" && newValue === 0)) {
				newState.criticalHealth = newState.health < 20;
			}

			return newState;
		}

		case "ADD_MONEY":
			return {
				...state,
				money: Math.max(0, state.money + action.payload),
			};

		case "ADVANCE_TIME": {
			if (state.isPaused) return state;
			let newTime = state.time + action.payload;
			let newDay = state.day;

			if (newTime >= 24) {
				newTime -= 24;
				newDay += 1;
			}
			return { ...state, time: newTime, day: newDay };
		}

		case "RESOLVE_DILEMMA":
			return {
				...state,
				resolvedDilemmas: [...state.resolvedDilemmas, action.payload],
			};

		case "SET_ACTIVE_DILEMMA":
			return {
				...state,
				activeDilemmaId: action.payload,
				isPaused: action.payload !== null,
			};

		case "SET_AT_SHELTER":
			return { ...state, isAtShelter: action.payload };

		case "SET_WORK_TOOL":
			return { ...state, workTool: action.payload };

		case "ADD_BUFF":
			if (state.activeBuffs.includes(action.payload)) return state;
			return { ...state, activeBuffs: [...state.activeBuffs, action.payload] };

		case "REMOVE_BUFF":
			return {
				...state,
				activeBuffs: state.activeBuffs.filter((b) => b !== action.payload),
			};

		case "ADD_INVENTORY":
			return { ...state, inventory: [...state.inventory, action.payload] };

		case "REMOVE_INVENTORY":
			return {
				...state,
				inventory: state.inventory.filter((i) => i.id !== action.payload),
			};

		case "SET_AVATAR":
			return { ...state, avatar: action.payload };

		case "SET_PAUSED":
			if (state.isPaused === action.payload) return state;
			return { ...state, isPaused: action.payload };

		case "SET_USER_POSITION":
			return { ...state, userPosition: action.payload };

		case "RESET_GAME":
			return {
				...INITIAL_STATE,
				time: new Date().getHours(),
			};

		case "SLEEP":
			return {
				...state,
				health: Math.min(100, state.health + 20),
				energy: 100, // Fully restored
				hunger: Math.max(0, state.hunger - 10),
				time: (state.time + 8) % 24,
			};

		case "UPDATE_DOCUMENTS":
			return {
				...state,
				documents: {
					...state.documents,
					...action.payload,
				},
			};

		case "SET_EMPLOYED_FORMAL":
			return { ...state, employed_formal: action.payload };

		case "SET_ACTIVE_ARC":
			return { ...state, activeArcId: action.payload };
		case "SET_PROCESSING_GAME_OVER":
			return { ...state, isProcessingGameOver: action.payload };

		case "LOG_EVENT":
			return { ...state, history: [...state.history, action.payload] };

		case "SET_FLAG":
			return {
				...state,
				flags: { ...state.flags, [action.payload.key]: action.payload.value },
			};

		case "REGISTER_OCCURRENCE": {
			const text = action.payload.toLowerCase();
			const newThermometer = { ...state.socialThermometer };

			// Simple Regex Keyword Analysis
			if (/(fome|comida|rango|barriga)/.test(text)) newThermometer.fome++;
			if (/(banheiro|banho|higiene|sanit|sujo|menstru)/.test(text))
				newThermometer.higiene++;
			if (/(seguran|policia|roubo|medo|agress|viol)/.test(text))
				newThermometer.violencia++;
			if (/(doen|saude|dor|medic|hospital|upa)/.test(text))
				newThermometer.saude++;

			return { ...state, socialThermometer: newThermometer };
		}

		default:
			return state;
	}
}

// --- Context & Provider ---

export interface GameContextType extends GameState {
	dispatch: React.Dispatch<GameAction>;
	modifyStat: (stat: keyof GameState, amount: number) => void;
	addMoney: (amount: number) => void;
	advanceTime: (hours: number) => void;
	markDilemmaResolved: (dilemmaId: string) => void;
	setActiveDilemma: (dilemmaId: string | null) => void;
	setAtShelter: (isAtShelter: boolean) => void;
	setWorkTool: (tool: GameState["workTool"]) => void;
	addBuff: (buff: string) => void;
	removeBuff: (buff: string) => void;
	addToInventory: (itemOrId: Item | string) => void;
	removeFromInventory: (itemId: string) => void;
	setAvatar: (avatar: Avatar) => void;
	setPaused: (value: boolean) => void;
	setUserPosition: (position: [number, number] | null) => void;
	eat: (amount: number) => void;
	sleep: (isSafe: boolean) => Promise<void>;
	work: (hours: number) => void;
	consumeBattery: (amount: number) => void;
	resetGame: () => Promise<void>;
	initPDU: (objective: PDUObjective) => void;
	updatePduStage: (stageId: string) => void;
	completePduStage: (stageId: string) => void;
	updateDocuments: (updates: Partial<GameState["documents"]>) => void;
	setEmployedFormal: (isEmployed: boolean) => void;
	logEvent: (event: GameEvent) => void;
	setFlag: (key: string, value: boolean) => void;
	setIsProcessingGameOver: (value: boolean) => void;
	registerOccurrence: (text: string) => void;
	setActiveArc: (arcId: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);
const DOC_ID = "game_state_v1";

const GAME_VERSION = "1.1"; // Census 2024 Refactor & Fixes

export function GameProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(gameReducer, {
		...INITIAL_STATE,
		time: typeof window !== "undefined" ? new Date().getHours() : 8,
	});
	const [hasHydrated, setHasHydrated] = useState(false);
	const { db } = useOfflineDB();

	const resetGame = useCallback(async () => {
		if (db) {
			try {
				const doc = await db.get(DOC_ID);
				await db.remove(doc);
			} catch (_e) {
				/* ignore */
			}
		}
		dispatch({ type: "RESET_GAME" });
	}, [db]);

	// 1. Hydration (Load from PouchDB)
	useEffect(() => {
		if (!db) return;

		const loadState = async () => {
			try {
				const doc = await db.get<SavedGameState>(DOC_ID);

				// 🛡️ Runtime Validation with Zod
				const parseResult = SavedGameStateSchema.safeParse(doc);

				if (!parseResult.success) {
					console.error("❌ Save data validation failed:", parseResult.error);
					// If validation fails, we can either:
					// 1. Reset completely (safest)
					// 2. Try to use partial data (risky)
					// Prompt says: "logue o erro silenciosamente, mas NÃO quebre a UI" and "use o valor default"
					// We will treat it as a critical corruption if it doesn't match schema (except maybe version migration).

					// But wait, if it's just a missing field that Zod defaults would handle, `safeParse` would SUCCEED if the input was clean enough to match the structure or if we used `.default()`.
					// Since I used `.default()` extensivey, many missing fields are auto-filled.
					// If it FAILS, it means there are invalid types (e.g. string vs number) that couldn't be coerced/accepted.
					console.warn(
						"⚠️ Corrupt state detected. using INITIAL_STATE fallback.",
					);
					dispatch({ type: "SET_STATE", payload: INITIAL_STATE });
					return;
				}

				const validState = parseResult.data;
				const { _id, _rev, ...savedData } = validState;

				// VERSION CHECK
				if (savedData.version !== GAME_VERSION) {
					console.warn("♻️ Version mismatch. Resetting game data...");
					await db.remove(doc);
					if (typeof window !== "undefined") localStorage.clear();
					dispatch({ type: "RESET_GAME" });
					return;
				}

				// Additional Logic Checks (Game Over state prevention)
				if (savedData.health <= 0 || savedData.dignity <= 0) {
					console.warn("⚠️ Corrupt/Dead state detected. Aborting load.");
					throw { status: 404 };
				}

				console.log("✅ Game State Hydrated & Validated", savedData);
				dispatch({
					type: "SET_STATE",
					payload: {
						...INITIAL_STATE,
						...savedData,
						hasHydrated: true,
					} as GameState,
				});
			} catch (err) {
				const error = err as { status?: number };
				if (error.status === 404) {
					console.log("ℹ️ New Game (No saved state found)");
				} else {
					console.error("❌ Error loading state:", err);
					// Failsafe: Ensure we start with something valid even on DB error
					dispatch({
						type: "SET_STATE",
						payload: {
							...INITIAL_STATE,
							time: new Date().getHours(),
							hasHydrated: true,
						},
					});
				}
			} finally {
				setHasHydrated(true);
			}
		};

		loadState();
	}, [db]);

	// 2. Auto-Save (Persist to PouchDB)
	useEffect(() => {
		if (!db || !hasHydrated) return;

		const saveState = async () => {
			try {
				let doc: Record<string, unknown> = {};
				try {
					doc = await db.get(DOC_ID);
				} catch (_e) {
					doc = { _id: DOC_ID };
				}

				await db.put({
					...doc,
					...state,
					version: GAME_VERSION, // Inject Version
					_id: DOC_ID,
				});
				console.log("💾 Auto-saved");
			} catch (err) {
				console.error("❌ Auto-save failed:", err);
			}
		};

		// Debounce save? For now, simple transition or just triggering on critical changes.
		// The prompt asks for "autosave a cada alteração crítica".
		// Using a timeout to debounce slightly is good practice.
		const timeout = setTimeout(saveState, 1000);
		return () => clearTimeout(timeout);
	}, [state, db, hasHydrated]);

	// --- E2E Testing Helper ---
	useEffect(() => {
		// Expose state mutator for Playwright
		if (typeof window !== "undefined") {
			// biome-ignore lint/suspicious/noExplicitAny: debug global
			(window as any).debugSetBattery = (amount: number) => {
				dispatch({
					type: "MODIFY_STAT",
					payload: {
						stat: "phoneBattery",
						amount: amount - state.phoneBattery,
					},
				});
			};

			// [NEW] Global Debug Object for manual testing
			(window as any).__GAME_DEBUG__ = {
				modifyStat: (stat: string, amount: number) => {
					dispatch({
						type: "MODIFY_STAT",
						payload: { stat: stat as any, amount },
					});
				},
				setState: (newState: Partial<GameState>) => {
					dispatch({
						type: "SET_STATE",
						payload: { ...state, ...newState } as GameState,
					});
				},
				triggerDilemma: (id: string) => {
					dispatch({ type: "SET_ACTIVE_DILEMMA", payload: id });
				},
				reset: () => resetGame(),
			};

			// biome-ignore lint/suspicious/noExplicitAny: debug global
			(window as any).debugSetState = async (newState: Partial<GameState>) => {
				console.log("🧪 Injecting Debug State:", newState);

				// 1. Update React State
				dispatch({
					type: "SET_STATE",
					payload: { ...state, ...newState } as GameState,
				});

				// 2. Force Persistence immediately
				if (db) {
					try {
						let doc: Partial<SavedGameState> = {};
						try {
							doc = await db.get(DOC_ID);
						} catch (_e) {
							doc = { _id: DOC_ID };
						}

						await db.put({
							...doc,
							...state,
							...newState,
							version: GAME_VERSION,
							_id: DOC_ID,
						});
						console.log("🧪 Debug State Persisted to DB");
					} catch (err) {
						console.error("❌ Debug Persist failed:", err);
					}
				}
			};
		}
	}, [db, state, resetGame]);

	// --- Helpers ---

	const modifyStat = useCallback((stat: keyof GameState, amount: number) => {
		dispatch({ type: "MODIFY_STAT", payload: { stat, amount } });
	}, []);

	const addMoney = useCallback((amount: number) => {
		dispatch({ type: "ADD_MONEY", payload: amount });
	}, []);

	const advanceTime = useCallback((hours: number) => {
		dispatch({ type: "ADVANCE_TIME", payload: hours });
	}, []);

	const markDilemmaResolved = useCallback((dilemmaId: string) => {
		dispatch({ type: "RESOLVE_DILEMMA", payload: dilemmaId });
	}, []);

	const setActiveDilemma = useCallback((dilemmaId: string | null) => {
		dispatch({ type: "SET_ACTIVE_DILEMMA", payload: dilemmaId });
	}, []);

	const setAtShelter = useCallback((isAtShelter: boolean) => {
		dispatch({ type: "SET_AT_SHELTER", payload: isAtShelter });
	}, []);

	const setWorkTool = useCallback((tool: GameState["workTool"]) => {
		dispatch({ type: "SET_WORK_TOOL", payload: tool });
	}, []);

	const addBuff = useCallback((buff: string) => {
		dispatch({ type: "ADD_BUFF", payload: buff });
	}, []);

	const removeBuff = useCallback((buff: string) => {
		dispatch({ type: "REMOVE_BUFF", payload: buff });
	}, []);

	const addToInventory = useCallback((itemOrId: Item | string) => {
		const newItem: Item =
			typeof itemOrId === "string"
				? { id: itemOrId, name: itemOrId, weight: 1, type: "sobrevivencia" }
				: itemOrId;
		dispatch({ type: "ADD_INVENTORY", payload: newItem });
	}, []);

	const removeFromInventory = useCallback((itemId: string) => {
		dispatch({ type: "REMOVE_INVENTORY", payload: itemId });
	}, []);

	const setAvatar = useCallback((avatar: Avatar) => {
		dispatch({ type: "SET_AVATAR", payload: avatar });
	}, []);

	const setPaused = useCallback((value: boolean) => {
		dispatch({ type: "SET_PAUSED", payload: value });
	}, []);

	const setUserPosition = useCallback((position: [number, number] | null) => {
		dispatch({ type: "SET_USER_POSITION", payload: position });
	}, []);

	const eat = useCallback(
		(amount: number) => {
			modifyStat("hunger", amount);
			modifyStat("energy", 5);
		},
		[modifyStat],
	);

	const sleep = useCallback(
		async (isSafe: boolean) => {
			if (!isSafe) {
				await telemetryService.track(TelemetryAction.GAME_EVENT, {
					type: "RISKY_SLEEP",
					hunger: state.hunger,
					health: state.health,
				});
			}
			dispatch({ type: "SLEEP" });
			// Usually sleep advances time too.
			advanceTime(8);
		},
		[state.hunger, state.health, advanceTime],
	);

	const work = useCallback(
		(hours: number) => {
			addMoney(hours * 10);
			modifyStat("hunger", -(hours * 5));
			modifyStat("energy", -(hours * 10));
			advanceTime(hours);
		},
		[addMoney, modifyStat, advanceTime],
	);

	const _clearPersistence = useCallback(async () => {
		if (db) {
			try {
				const doc = await db.get(DOC_ID);
				await db.remove(doc);
				console.log("🔥 Persistence cleared");
			} catch (_e) {
				// ignore
			}
		}
	}, [db]);

	const initPDU = useCallback((objective: PDUObjective) => {
		dispatch({ type: "INIT_PDU", payload: { objective } });
	}, []);

	const updatePduStage = useCallback((stageId: string) => {
		dispatch({ type: "UPDATE_PDU_STAGE", payload: { stageId } });
	}, []);

	const completePduStage = useCallback((stageId: string) => {
		dispatch({ type: "COMPLETE_PDU_STAGE", payload: { stageId } });
	}, []);

	const setActiveArc = useCallback((arcId: string | null) => {
		dispatch({ type: "SET_ACTIVE_ARC", payload: arcId });
	}, []);

	const setIsProcessingGameOver = useCallback((value: boolean) => {
		dispatch({ type: "SET_PROCESSING_GAME_OVER", payload: value });
	}, []);

	const value = useMemo(
		() => ({
			...state,
			dispatch,
			modifyStat,
			addMoney,
			advanceTime,
			markDilemmaResolved,
			setActiveDilemma,
			setAtShelter,
			setWorkTool,
			addBuff,
			removeBuff,
			addToInventory,
			removeFromInventory,
			setAvatar,
			setPaused,
			setUserPosition,
			eat,
			sleep,
			work,
			consumeBattery: (amount: number) => modifyStat("phoneBattery", -amount),
			resetGame,
			initPDU,
			updatePduStage,
			completePduStage,
			updateDocuments: (updates: Partial<GameState["documents"]>) =>
				dispatch({ type: "UPDATE_DOCUMENTS", payload: updates }),
			setEmployedFormal: (isEmployed: boolean) =>
				dispatch({ type: "SET_EMPLOYED_FORMAL", payload: isEmployed }),
			logEvent: (event: GameEvent) =>
				dispatch({ type: "LOG_EVENT", payload: event }),
			setFlag: (key: string, value: boolean) =>
				dispatch({ type: "SET_FLAG", payload: { key, value } }),
			registerOccurrence: (text: string) =>
				dispatch({ type: "REGISTER_OCCURRENCE", payload: text }),
			setActiveArc,
			setIsProcessingGameOver,
			hasHydrated, // [CRITICAL] Export hydration status
		}),
		[
			state,
			modifyStat,
			addMoney,
			advanceTime,
			markDilemmaResolved,
			setActiveDilemma,
			setAtShelter,
			setWorkTool,
			addBuff,
			removeBuff,
			addToInventory,
			removeFromInventory,
			setAvatar,
			setPaused,
			setUserPosition,
			eat,
			sleep,
			work,
			resetGame,
			initPDU,
			updatePduStage,
			completePduStage,
			setActiveArc,
			hasHydrated,
			setIsProcessingGameOver,
		],
	);

	if (!hasHydrated) {
		// Optional: Return a loader or nothing
		return (
			<div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
				Carregando...
			</div>
		);
	}

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
	const context = useContext(GameContext);
	if (context === undefined) {
		throw new Error("useGameContext must be used within a GameProvider");
	}
	return context;
}
