"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import type { Dilemma } from "@/features/game-loop/dilemma-types";

/**
 * MODAL QUEUE MANAGER
 *
 * Gerencia a fila de eventos visuais para evitar sobreposição caótica.
 * Garante que apenas UM modal esteja ativo por vez.
 */

export type ModalType = "tutorial" | "dilemma" | "chat" | "gameover" | null;

interface QueuedEvent {
	dilemma: Dilemma;
	priority: number; // 0-10 (10 = highest)
	timestamp: number;
}

interface ModalQueueContextValue {
	// Estado da Fila
	pendingEvents: QueuedEvent[];
	activeModal: ModalType;
	isUIBlocked: boolean; // Agora reflete apenas se há modal ativo

	// Controle de Modais
	enqueueDilemma: (dilemma: Dilemma, priority?: number) => void;
	processQueue: () => Dilemma | null;
	setActiveModal: (type: ModalType) => void;

	// Consulta de Estado
	canShowModal: () => boolean;
	clearQueue: () => void;
}

const ModalQueueContext = createContext<ModalQueueContextValue | null>(null);

import { useGameContext } from "./GameContext";

interface ModalQueueProviderProps {
	children: ReactNode;
}

export function ModalQueueProvider({ children }: ModalQueueProviderProps) {
	const _gameContext = useGameContext();

	const [pendingEvents, setPendingEvents] = useState<QueuedEvent[]>([]);
	const [activeModal, setActiveModalState] = useState<ModalType>(null);
	const [lastModalClosedAt, setLastModalClosedAt] = useState<number>(0);

	// Refs para controle de fluxo
	const isProcessingRef = useRef(false);
	const lastQueueUpdateRef = useRef<number>(0);

	// Cooldown de 2 segundos entre modais
	const MODAL_COOLDOWN_MS = 2000;

	/**
	 * Verifica se um modal pode ser exibido
	 */
	const canShowModal = useCallback((): boolean => {
		// Guard: Prevenir se estiver processando
		if (isProcessingRef.current) {
			return false;
		}

		if (activeModal !== null) {
			console.log(
				`[ModalQueue] Blocked: Modal '${activeModal}' is already open`,
			);
			return false;
		}

		const timeSinceLastModal = Date.now() - lastModalClosedAt;
		if (timeSinceLastModal < MODAL_COOLDOWN_MS) {
			console.log(
				`[ModalQueue] Cooldown: ${MODAL_COOLDOWN_MS - timeSinceLastModal}ms remaining`,
			);
			return false;
		}

		return true;
	}, [activeModal, lastModalClosedAt]);

	/**
	 * Adiciona um dilema à fila com prioridade
	 */
	const enqueueDilemma = useCallback((dilemma: Dilemma, priority = 5) => {
		const queuedEvent: QueuedEvent = {
			dilemma,
			priority,
			timestamp: Date.now(),
		};

		setPendingEvents((prev) => {
			const updated = [...prev, queuedEvent];
			// Ordena por prioridade (maior primeiro) e depois por timestamp
			updated.sort((a, b) => {
				if (a.priority !== b.priority) {
					return b.priority - a.priority;
				}
				return a.timestamp - b.timestamp;
			});
			return updated;
		});

		console.log(
			`[ModalQueue] Enqueued dilemma '${dilemma.id}' with priority ${priority}`,
		);
	}, []);

	/**
	 * Processa a fila e retorna o próximo dilema a ser exibido
	 */
	const processQueue = useCallback((): Dilemma | null => {
		// Guard 1: Prevenir re-entrância
		if (isProcessingRef.current) {
			return null;
		}

		// Guard 2: Throttle entre processamentos (100ms mínimo)
		const now = Date.now();
		if (now - lastQueueUpdateRef.current < 100) {
			return null;
		}

		if (!canShowModal() || pendingEvents.length === 0) {
			return null;
		}

		isProcessingRef.current = true;
		lastQueueUpdateRef.current = now;

		try {
			const nextEvent = pendingEvents[0];
			setPendingEvents((prev) => prev.slice(1));

			console.log(
				`[ModalQueue] Processing dilemma '${nextEvent.dilemma.id}' from queue`,
			);

			return nextEvent.dilemma;
		} finally {
			// Liberar lock com pequeno delay
			setTimeout(() => {
				isProcessingRef.current = false;
			}, 50);
		}
	}, [canShowModal, pendingEvents]);

	/**
	 * Define o tipo de modal ativo
	 */
	const setActiveModal = useCallback((type: ModalType) => {
		setActiveModalState(type);

		if (type === null) {
			// Modal fechado - registrar timestamp para cooldown
			setLastModalClosedAt(Date.now());
			console.log("[ModalQueue] Modal closed, starting cooldown");
		} else {
			console.log(`[ModalQueue] Modal opened: ${type}`);
		}
	}, []);

	/**
	 * Limpa toda a fila (útil para reset de jogo)
	 */
	const clearQueue = useCallback(() => {
		setPendingEvents([]);
		console.log("[ModalQueue] Queue cleared");
	}, []);

	const value = useMemo(
		() => ({
			pendingEvents,
			activeModal,
			isUIBlocked: activeModal !== null,
			enqueueDilemma,
			processQueue,
			setActiveModal,
			canShowModal,
			clearQueue,
		}),
		[
			pendingEvents,
			activeModal,
			enqueueDilemma,
			processQueue,
			setActiveModal,
			canShowModal,
			clearQueue,
		],
	);

	return (
		<ModalQueueContext.Provider value={value}>
			{children}
		</ModalQueueContext.Provider>
	);
}

/**
 * Hook para acessar o Modal Queue
 */
export function useModalQueue(): ModalQueueContextValue {
	const context = useContext(ModalQueueContext);
	if (!context) {
		throw new Error("useModalQueue must be used within ModalQueueProvider");
	}
	return context;
}
