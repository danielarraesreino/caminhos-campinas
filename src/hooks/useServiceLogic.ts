import type { GameState } from "@/contexts/GameContext";
import type { ServiceLocation } from "@/contexts/ServicesContext";

export interface ServiceAccess {
	allowed: boolean;
	reason?: string;
}

export function useServiceLogic() {
	const checkServiceAvailability = (
		service: ServiceLocation,
		gameState: GameState,
	): ServiceAccess => {
		const { time, workTool, documents, hygiene } = gameState;

		// 1. Checagem de Horário (Time Check)
		if (service.opening_hours) {
			const hours = service.opening_hours.toLowerCase();
			const currentHour = time; // 0-23

			// Parse "HH:MM - HH:MM"
			const rangeMatch = hours.match(/(\d{1,2})[:h].*?-.*?(\d{1,2})[:h]/);

			// Simple keywords
			const isComercial =
				hours.includes("comercial") || hours.includes("08:00 - 18:00");

			if (rangeMatch) {
				const start = parseInt(rangeMatch[1]);
				const end = parseInt(rangeMatch[2]);

				// Handle ranges that cross midnight (e.g. 23:00 - 04:00)
				if (start < end) {
					if (currentHour < start || currentHour >= end) {
						return { allowed: false, reason: `Fechado. Abre às ${start}h.` };
					}
				} else {
					// Crosses midnight
					if (currentHour < start && currentHour >= end) {
						return { allowed: false, reason: `Fechado. Abre às ${start}h.` };
					}
				}
			} else if (isComercial) {
				if (currentHour < 8 || currentHour >= 18) {
					return {
						allowed: false,
						reason: "Fechado. Horário Comercial (08h às 18h).",
					};
				}
			} else if (hours.includes("noturno")) {
				// Assuming night means roughly 18h to 06h
				if (currentHour >= 6 && currentHour < 18) {
					return { allowed: false, reason: "Fechado durante o dia." };
				}
			}
		}

		// 2. SAMIM / Abrigo Check (Explicit Rule)
		if (service.id === "samim" || service.type === "shelter") {
			if (workTool.type === "CARRINHO_RECICLAGEM" && !workTool.isConfiscated) {
				return {
					allowed: false,
					reason: "Regra do local: Proibido entrada de carroças",
				};
			}
		}

		// 3. Checagem de Documentos (Specific Requirements)
		if (service.requirements && service.requirements.length > 0) {
			for (const req of service.requirements) {
				const r = req.toLowerCase();
				if (r.includes("documento")) {
					if (!documents.hasRG && !documents.hasCPF) {
						return {
							allowed: false,
							reason: "Exige Documento (RG ou CPF) que você não possui.",
						};
					}
				}
				if (r.includes("higiene >")) {
					const val = parseInt(r.replace(/[^0-9]/g, ""));
					if (!isNaN(val) && hygiene <= val) {
						return {
							allowed: false,
							reason: `Exige Higiene acima de ${val}. Você está muito sujo.`,
						};
					}
				}
			}
		}

		// 4. Checagem de Regras Genéricas (Legacy)
		if (service.rules) {
			const rules = service.rules.toLowerCase();
			if (
				rules.includes("proibido carroça") ||
				rules.includes("não permite carroça")
			) {
				if (
					workTool.type === "CARRINHO_RECICLAGEM" &&
					!workTool.isConfiscated
				) {
					return {
						allowed: false,
						reason: "Não é permitido entrar com Carroça de Reciclagem.",
					};
				}
			}
		}

		return { allowed: true };
	};

	return { checkServiceAvailability };
}
