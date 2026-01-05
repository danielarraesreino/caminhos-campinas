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
	history: [], // [NEW] Telemetry Log
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
			return { ...state, isPaused: action.payload };

		case "SET_USER_POSITION":
			return { ...state, userPosition: action.payload };

		case "RESET_GAME":
			return INITIAL_STATE;

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

			return {
				...state,
				socialThermometer: newThermometer,
			};
		}

		default:
			return state;
	}
}

// --- Context & Provider ---

// biome-ignore lint/suspicious/noExplicitAny: Legacy context structure
const GameContext = createContext<any>(undefined);
const DOC_ID = "game_state_v1";

const GAME_VERSION = "1.1"; // Census 2024 Refactor & Fixes

export function GameProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
	const [hasHydrated, setHasHydrated] = useState(false);
	const { db } = useOfflineDB();

	// 1. Hydration (Load from PouchDB)
	useEffect(() => {
		if (!db) return;

		const loadState = async () => {
			try {
				const doc = await db.get<SavedGameState>(DOC_ID);
				// biome-ignore lint/suspicious/noExplicitAny: handling PouchDB return type quirks
				const { _id, _rev, ...savedData } = doc as any;
				const savedState = savedData as SavedGameState;

				// VERSION CHECK (Reset if outdated)
				if (savedState.version !== GAME_VERSION) {
					console.warn("♻️ Version mismatch. Resetting game data...");

					// 1. Clear PouchDB
					await db.remove(doc);

					// 2. Clear LocalStorage (Services, etc)
					if (typeof window !== "undefined") {
						localStorage.clear();
					}

					// 3. Reset State
					dispatch({ type: "RESET_GAME" });
					return;
				}

				// GUARANTEE: Social Thermometer Persistence
				if (!savedState.socialThermometer) {
					console.log("🔧 Migrating legacy save: Injecting socialThermometer");
					savedState.socialThermometer = INITIAL_STATE.socialThermometer;
				}

				console.log("✅ Game State Hydrated:", savedState);

				// BUGFIX: Prevent loading "Game Over" state
				if (savedState.health <= 0 || savedState.dignity <= 0) {
					console.warn(
						"⚠️ Corrupt/Dead state detected. Aborting load to force Reset.",
					);
					throw { status: 404 }; // Force "New Game" flow
				}

				dispatch({ type: "SET_STATE", payload: savedState });
				// biome-ignore lint/suspicious/noExplicitAny: error typing
			} catch (err: any) {
				if (err.status === 404) {
					console.log("ℹ️ New Game (No saved state found)");
				} else {
					console.error("❌ Error loading state:", err);
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

			// biome-ignore lint/suspicious/noExplicitAny: debug global
			(window as any).debugSetState = async (newState: GameState) => {
				console.log("🧪 Injecting Debug State:", newState);

				// 1. Update React State
				dispatch({ type: "SET_STATE", payload: newState });

				// 2. Force Persistence immediately
				if (db) {
					try {
						let doc: any = {};
						try {
							doc = await db.get(DOC_ID);
						} catch (_e) {
							doc = { _id: DOC_ID };
						}

						await db.put({
							...doc,
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
	}, [state.phoneBattery, db]);

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

	const clearPersistence = useCallback(async () => {
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
