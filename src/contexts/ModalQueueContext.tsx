"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Dilemma } from "@/features/game-loop/dilemma-types";

/**
 * MODAL QUEUE MANAGER
 *
 * Gerencia a fila de eventos visuais/sonoros para evitar sobreposição caótica.
 * Garante que apenas UM modal esteja ativo por vez, respeitando:
 * - Tutorial ativo (tutorialActive)
 * - Narração de áudio em andamento (audioPlaying)
 * - Cooldown de 2 segundos entre modais
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
	audioPlaying: boolean;
	isUIBlocked: boolean;

	// Controle de Modais
	enqueueDilemma: (dilemma: Dilemma, priority?: number) => void;
	processQueue: () => Dilemma | null;
	setActiveModal: (type: ModalType) => void;
	setAudioPlaying: (playing: boolean) => void;

	// Consulta de Estado
	canShowModal: () => boolean;
	clearQueue: () => void;
}

const ModalQueueContext = createContext<ModalQueueContextValue | null>(null);

interface ModalQueueProviderProps {
	children: ReactNode;
	tutorialActive?: boolean; // Integração com GameContext
}

export function ModalQueueProvider({
	children,
	tutorialActive = false,
}: ModalQueueProviderProps) {
	const [pendingEvents, setPendingEvents] = useState<QueuedEvent[]>([]);
	const [activeModal, setActiveModalState] = useState<ModalType>(null);
	const [audioPlaying, setAudioPlaying] = useState(false);
	const [lastModalClosedAt, setLastModalClosedAt] = useState<number>(0);

	// Cooldown de 2 segundos entre modais
	const MODAL_COOLDOWN_MS = 2000;

	/**
	 * Verifica se um modal pode ser exibido
	 */
	const canShowModal = useCallback((): boolean => {
		if (tutorialActive) {
			console.log("[ModalQueue] Blocked: Tutorial is active");
			return false;
		}

		if (activeModal !== null) {
			console.log(
				`[ModalQueue] Blocked: Modal '${activeModal}' is already open`,
			);
			return false;
		}

		if (audioPlaying) {
			console.log("[ModalQueue] Blocked: Audio narration is playing");
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
	}, [tutorialActive, activeModal, audioPlaying, lastModalClosedAt]);

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
		// Strict Audio blocking: If audio is playing, absolutely do not process queue
		if (audioPlaying) {
			console.log("[ModalQueue] Blocked: Audio is playing (Strict Check)");
			return null;
		}

		if (!canShowModal() || pendingEvents.length === 0) {
			return null;
		}

		const nextEvent = pendingEvents[0];
		setPendingEvents((prev) => prev.slice(1));

		console.log(
			`[ModalQueue] Processing dilemma '${nextEvent.dilemma.id}' from queue`,
		);
		return nextEvent.dilemma;
	}, [canShowModal, pendingEvents, audioPlaying]);

	// Debug Audio State
	useEffect(() => {
		console.log(`[ModalQueue] Audio playing state changed: ${audioPlaying}`);
	}, [audioPlaying]);

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

	/**
	 * Auto-processamento da fila quando as condições mudam
	 */
	useEffect(() => {
		if (canShowModal() && pendingEvents.length > 0) {
			// Aguardar um tick para evitar race conditions
			const timer = setTimeout(() => {
				const nextDilemma = processQueue();
				if (nextDilemma) {
					// O componente DilemmaModal deve escutar esta mudança
					// e exibir o modal automaticamente
					console.log(
						`[ModalQueue] Auto-processing dilemma '${nextDilemma.id}'`,
					);
				}
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [canShowModal, pendingEvents.length, processQueue]);

	const value: ModalQueueContextValue = {
		pendingEvents,
		activeModal,
		audioPlaying,
		isUIBlocked: audioPlaying || activeModal !== null,
		enqueueDilemma,
		processQueue,
		setActiveModal,
		setAudioPlaying,
		canShowModal,
		clearQueue,
	};

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
