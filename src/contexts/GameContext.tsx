"use client";

import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useOfflineDB } from "@/features/offline-db/useOfflineDB";
import { TelemetryAction, telemetryService } from "@/services/telemetry";

export interface Avatar {
	name: string;
	gender: "masculino" | "feminino" | "trans" | "nao-binario";
	ethnicity: "branco" | "preto" | "pardo" | "indigena";
	ageRange: "jovem" | "adulto" | "idoso";
	timeOnStreet: "recente" | "veterano";
	startingSkill: "reciclagem" | "artesao" | "vendedor" | "nenhuma";
	avatarImage?: string;
}

export interface Item {
	id: string;
	name: string;
	weight: number;
	type: "valioso" | "sobrevivencia";
}

export interface GameState {
	health: number;
	hunger: number;
	hygiene: number;
	sanity: number;
	energy: number;
	dignity: number;
	socialStigma: number;
	stabilityGap: number;
	money: number;
	workTool: {
		type: "CARRINHO_RECICLAGEM" | "SACO_PRETO" | null;
		condition: number; // 0-100
		capacity: number; // kg
		riskFactor: number;
	};
	activeBuffs: string[];
	isAtShelter: boolean;
	inventory: Item[];
	day: number;
	time: number;
	resolvedDilemmas: string[];
	activeDilemmaId: string | null;
	criticalHealth: boolean;
	avatar: Avatar | null;
	isPaused: boolean;
}

interface GameContextProps extends GameState {
	modifyStat: (
		stat: keyof Omit<
			GameState,
			| "inventory"
			| "day"
			| "time"
			| "resolvedDilemmas"
			| "activeBuffs"
			| "workTool"
			| "criticalHealth"
			| "avatar"
			| "isPaused"
		>,
		amount: number,
	) => void;
	addMoney: (amount: number) => void;
	advanceTime: (hours: number) => void;
	markDilemmaResolved: (id: string) => void;
	setActiveDilemma: (id: string | null) => void;
	setAtShelter: (value: boolean) => void;
	setWorkTool: (tool: GameState["workTool"]) => void;
	addBuff: (buff: string) => void;
	removeBuff: (buff: string) => void;
	addToInventory: (item: Item | string) => void;
	removeFromInventory: (itemId: string) => void;
	setAvatar: (avatar: Avatar) => void;
	setPaused: (value: boolean) => void;
	eat: (amount: number) => void;
	sleep: (isSafe: boolean) => Promise<void>;
	work: (hours: number) => void;
	resetGame: () => void;
}

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
	workTool: {
		type: null,
		condition: 100,
		capacity: 0,
		riskFactor: 0,
	},
	activeBuffs: [],
	isAtShelter: false,
	inventory: [],
	resolvedDilemmas: [],
	activeDilemmaId: null,
	day: 1,
	time: 8,
	criticalHealth: false,
	avatar: null,
	isPaused: false,
};

const GameContext = createContext<GameContextProps | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<GameState>(INITIAL_STATE);
	const [hasHydrated, setHasHydrated] = useState(false);
	const db = useOfflineDB();

	// ID do documento no PouchDB
	const DOC_ID = "current_game_state";

	// Load from PouchDB
	useEffect(() => {
		let isMounted = true;
		if (!db) return;

		async function loadState() {
			if (!db || !isMounted) return;
			try {
				const doc: any = await db.get(DOC_ID);
				if (!isMounted) return;

				// biome-ignore lint/performance/noDelete: we want to strip PouchDB metadata
				delete doc._id;
				// biome-ignore lint/performance/noDelete: we want to strip PouchDB metadata
				delete doc._rev;

				setState((prev) => ({
					...prev,
					...doc,
					// Garante que isPaused seja consistente
					isPaused: doc.activeDilemmaId !== null,
				}));
			} catch (e: any) {
				if (e.status !== 404 && isMounted) {
					console.error("Failed to load game state from PouchDB", e);
				}
			} finally {
				if (isMounted) setHasHydrated(true);
			}
		}

		loadState();
		return () => {
			isMounted = false;
		};
	}, [db]);

	// Debounced Save to PouchDB
	useEffect(() => {
		const isMounted = true;
		if (!hasHydrated || !db) return;

		const timeoutId = setTimeout(async () => {
			try {
				if (!db || !isMounted) return;

				let rev: string | undefined;
				try {
					const existing: any = await db.get(DOC_ID);
					if (!isMounted) return;
					rev = existing._rev;
				} catch (e: any) {
					if (e.status !== 404) {
						if (!isMounted) return;
						// If it's a connection error, skip this save
						if (
							e.name === "InvalidStateError" ||
							e.message?.includes("closing")
						) {
							console.warn("Database connection is closing, skipping save");
							return;
						}
						throw e;
					}
				}

				await db.put({
					_id: DOC_ID,
					_rev: rev,
					...state,
				});
			} catch (e: any) {
				// Silently handle closing connection errors or common IndexedDB failures
				if (
					e.name === "InvalidStateError" ||
					e.message?.includes("closing") ||
					e.message?.includes("connection is closing")
				) {
					console.warn(
						"Database connection already closed or closing - temporary state preserved in RAM",
					);
				} else {
					console.error("Critical failure saving game state to PouchDB", e);
				}
			}
		}, 1000); // 1-second debounce

		return () => clearTimeout(timeoutId);
	}, [state, hasHydrated, db]);

	// Sync isPaused with activeDilemmaId
	useEffect(() => {
		if (state.activeDilemmaId !== null && !state.isPaused) {
			setState((prev) => ({ ...prev, isPaused: true }));
		} else if (state.activeDilemmaId === null && state.isPaused) {
			setState((prev) => ({ ...prev, isPaused: false }));
		}
	}, [state.activeDilemmaId, state.isPaused]);

	const modifyStat = useCallback((stat: any, amount: number) => {
		setState((prev) => {
			let newValue = (prev[stat as keyof GameState] as number) + amount;

			if (stat !== "money") {
				newValue = Math.max(0, Math.min(100, newValue));
			} else {
				newValue = Math.max(0, newValue);
			}

			const newState = { ...prev, [stat]: newValue };

			if (stat === "hunger" && newValue === 0) {
				newState.health = Math.max(0, prev.health - 5);
			}

			if (stat === "health" || (stat === "hunger" && newValue === 0)) {
				newState.criticalHealth = newState.health < 20;
			}

			return newState;
		});
	}, []);

	const addMoney = useCallback((amount: number) => {
		setState((prev) => ({
			...prev,
			money: Math.max(0, prev.money + amount),
		}));
	}, []);

	const advanceTime = useCallback((hours: number) => {
		setState((prev) => {
			if (prev.isPaused) return prev; // Security check

			let newTime = prev.time + hours;
			let newDay = prev.day;

			if (newTime >= 24) {
				newTime -= 24;
				newDay += 1;
			}

			return { ...prev, time: newTime, day: newDay };
		});
	}, []);

	const markDilemmaResolved = useCallback((id: string) => {
		setState((prev) => ({
			...prev,
			resolvedDilemmas: [...prev.resolvedDilemmas, id],
		}));
	}, []);

	const setActiveDilemma = useCallback((id: string | null) => {
		setState((prev) => ({
			...prev,
			activeDilemmaId: id,
			isPaused: id !== null,
		}));
	}, []);

	const setAtShelter = useCallback((value: boolean) => {
		setState((prev) => ({ ...prev, isAtShelter: value }));
	}, []);

	const setWorkTool = useCallback((tool: GameState["workTool"]) => {
		setState((prev) => ({ ...prev, workTool: tool }));
	}, []);

	const addBuff = useCallback((buff: string) => {
		setState((prev) => ({
			...prev,
			activeBuffs: prev.activeBuffs.includes(buff)
				? prev.activeBuffs
				: [...prev.activeBuffs, buff],
		}));
	}, []);

	const removeBuff = useCallback((buff: string) => {
		setState((prev) => ({
			...prev,
			activeBuffs: prev.activeBuffs.filter((b) => b !== buff),
		}));
	}, []);

	const addToInventory = useCallback((itemOrId: Item | string) => {
		setState((prev) => {
			const newItem: Item =
				typeof itemOrId === "string"
					? { id: itemOrId, name: itemOrId, weight: 1, type: "sobrevivencia" }
					: itemOrId;

			return {
				...prev,
				inventory: prev.inventory.some((i) => i.id === newItem.id)
					? prev.inventory
					: [...prev.inventory, newItem],
			};
		});
	}, []);

	const removeFromInventory = useCallback((itemId: string) => {
		setState((prev) => ({
			...prev,
			inventory: prev.inventory.filter((i) => i.id !== itemId),
		}));
	}, []);

	const setAvatar = useCallback((avatar: Avatar) => {
		setState((prev) => {
			const newState = { ...prev, avatar };

			if (avatar.ethnicity === "preto" || avatar.ethnicity === "pardo") {
				newState.socialStigma += 15;
			}
			if (avatar.gender === "trans" || avatar.gender === "feminino") {
				newState.sanity -= 5;
				newState.stabilityGap += 5;
			}
			if (avatar.timeOnStreet === "veterano") {
				newState.sanity -= 20;
				newState.stabilityGap -= 10;
				newState.workTool = {
					type: "CARRINHO_RECICLAGEM",
					condition: 50,
					capacity: 100,
					riskFactor: 30,
				};
			}

			return newState;
		});
	}, []);

	const setPaused = useCallback((value: boolean) => {
		setState((prev) => ({ ...prev, isPaused: value }));
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
			setState((prev) => ({
				...prev,
				health: Math.min(100, prev.health + 20),
				energy: 100,
				hunger: Math.max(0, prev.hunger - 10),
			}));
		},
		[state.hunger, state.health],
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
				// ignore if doc not found
			}
		}
		setState(INITIAL_STATE);
	}, [db]);

	const value = useMemo(
		() => ({
			...state,
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
			eat,
			sleep,
			work,
			resetGame,
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
			eat,
			sleep,
			work,
			resetGame,
		],
	);

	if (!hasHydrated) return null;

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
	const context = useContext(GameContext);
	if (context === undefined) {
		throw new Error("useGameContext must be used within a GameProvider");
	}
	return context;
}
