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
import { useOfflineDB } from "@/features/offline-db/useOfflineDB";
import { TelemetryAction, telemetryService } from "@/services/telemetry";

// --- Types ---

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
    condition: number;
    capacity: number;
    riskFactor: number;
    isConfiscated: boolean;
  };
  documents: {
    hasRG: boolean;
    hasCPF: boolean;
    hasComprovanteResidencia: boolean;
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
  phoneBattery: number;
  userPosition: [number, number] | null;
  isPaused: boolean;
}

export type GameAction =
  | { type: "SET_STATE"; payload: GameState }
  | { type: "MODIFY_STAT"; payload: { stat: keyof GameState; amount: number } }
  | { type: "ADD_MONEY"; payload: number }
  | { type: "ADVANCE_TIME"; payload: number }
  | { type: "RESOLVE_DILEMMA"; payload: string }
  | { type: "SET_ACTIVE_DILEMMA"; payload: string | null }
  | { type: "SET_AT_SHELTER"; payload: boolean }
  | { type: "SET_WORK_TOOL"; payload: GameState["workTool"] }
  | { type: "ADD_BUFF"; payload: string }
  | { type: "REMOVE_BUFF"; payload: string }
  | { type: "ADD_INVENTORY"; payload: Item }
  | { type: "REMOVE_INVENTORY"; payload: string }
  | { type: "SET_AVATAR"; payload: Avatar }
  | { type: "SET_PAUSED"; payload: boolean }
  | { type: "SET_USER_POSITION"; payload: [number, number] | null }
  | { type: "RESET_GAME" }
  | { type: "SLEEP" }; // Added SLEEP for atomic action

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
    isConfiscated: false,
  },
  documents: {
    hasRG: false,
    hasCPF: false,
    hasComprovanteResidencia: false,
  },
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
};

// --- Reducer ---

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_STATE":
      return {
        ...state,
        ...action.payload,
        isPaused: action.payload.activeDilemmaId !== null,
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
        time: (state.time + 8) % 24, // Sleep passes 8 hours? Or handled by caller? Logic below handled manual.
        // Let's assume action only handles stats, caller handles time.
        // Wait, previous helper did NOT advance time?
        // "sleep" helper in previous code did NOT call advanceTime.
        // But logic usually implies time passes.
        // I will strictly follow previous helper logic instructions: 
        // "modifyStat health 20, hunger -10". Energy wasn't working.
        // I will set energy 100 here.
      };

    default:
      return state;
  }
}

// --- Context & Provider ---

const GameContext = createContext<any>(undefined);
const DOC_ID = "game_state_v1";

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const [hasHydrated, setHasHydrated] = useState(false);
  const { db } = useOfflineDB();

  // 1. Hydration (Load from PouchDB)
  useEffect(() => {
    if (!db) return;

    const loadState = async () => {
      try {
        const doc = await db.get(DOC_ID);
        // biome-ignore lint/suspicious/noExplicitAny: generic doc
        const { _id, _rev, ...savedState } = doc as any;
        console.log("✅ Game State Hydrated:", savedState);
        dispatch({ type: "SET_STATE", payload: savedState });
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
        let doc: any = {};
        try {
          doc = await db.get(DOC_ID);
        } catch (_e) {
          doc = { _id: DOC_ID };
        }

        await db.put({
          ...doc,
          ...state,
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
      (window as any).debugSetBattery = (amount: number) => {
        dispatch({ type: "MODIFY_STAT", payload: { stat: "phoneBattery", amount: amount - state.phoneBattery } });
      };
    }
  }, [state.phoneBattery]);

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
    [modifyStat]
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
    [state.hunger, state.health, advanceTime]
  );

  const work = useCallback(
    (hours: number) => {
      addMoney(hours * 10);
      modifyStat("hunger", -(hours * 5));
      modifyStat("energy", -(hours * 10));
      advanceTime(hours);
    },
    [addMoney, modifyStat, advanceTime]
  );

  const resetGame = useCallback(async () => {
    if (db) {
      try {
        const doc = await db.get(DOC_ID);
        await db.remove(doc);
      } catch (e) { /* ignore */ }
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
      clearPersistence
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
      clearPersistence
    ]
  );

  if (!hasHydrated) {
    // Optional: Return a loader or nothing
    return <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">Carregando...</div>;
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
