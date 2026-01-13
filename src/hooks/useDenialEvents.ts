/**
 * Hook para gerenciar eventos de negação de acesso (Auditoria Social)
 * Persiste em localStorage para análise offline
 */

import { useCallback, useEffect, useState } from "react";
import type { ODSTarget } from "@/types/GameState";

export type DenialType =
	| "ACCESS_DENIED" // Acesso negado por falta de documento/dinheiro
	| "HOSTILE_ARCH" // Arquitetura hostil (Lei Padre Júlio)
	| "INSTITUTIONAL_VIOLENCE" // Violência institucional (Rapa, GCM)
	| "CLOSED_SERVICE" // Serviço fechado quando deveria estar aberto
	| "CAPACITY_EXCEEDED"; // Vagas esgotadas

export interface DenialEvent {
	id: string;
	coords: [number, number];
	type: DenialType;
	odsViolated: ODSTarget;
	serviceId?: string;
	serviceName?: string;
	reason: string;
	timestamp: number;
}

const STORAGE_KEY = "caminhos_denial_events";
const MAX_EVENTS = 500;

/**
 * Cores oficiais dos ODS da ONU para visualização no mapa
 */
export const ODS_COLORS: Record<
	string,
	{ fill: string; stroke: string; label: string }
> = {
	"1.3": {
		fill: "rgba(229, 36, 59, 0.5)",
		stroke: "#7f1d1d",
		label: "Pobreza",
	},
	"1.4": {
		fill: "rgba(229, 36, 59, 0.5)",
		stroke: "#7f1d1d",
		label: "Pobreza",
	},
	"2.1": { fill: "rgba(221, 166, 58, 0.5)", stroke: "#92400e", label: "Fome" },
	"3.5": { fill: "rgba(76, 159, 56, 0.5)", stroke: "#14532d", label: "Saúde" },
	"3.8": { fill: "rgba(76, 159, 56, 0.5)", stroke: "#14532d", label: "Saúde" },
	"6.2": {
		fill: "rgba(38, 189, 226, 0.5)",
		stroke: "#0e7490",
		label: "Higiene",
	},
	"8.5": {
		fill: "rgba(162, 25, 66, 0.5)",
		stroke: "#831843",
		label: "Trabalho",
	},
	"10.2": {
		fill: "rgba(221, 19, 103, 0.5)",
		stroke: "#9d174d",
		label: "Desigualdade",
	},
	"11.1": {
		fill: "rgba(253, 157, 36, 0.5)",
		stroke: "#c2410c",
		label: "Moradia",
	},
	"16.9": {
		fill: "rgba(0, 104, 157, 0.5)",
		stroke: "#1e3a5f",
		label: "Documentos",
	},
	"18": { fill: "rgba(25, 72, 106, 0.5)", stroke: "#1e3a5f", label: "Racismo" },
};

/**
 * Verifica se um timestamp é período noturno (18h-06h)
 */
export function isNightTime(timestamp: number): boolean {
	const date = new Date(timestamp);
	const hour = date.getHours();
	return hour >= 18 || hour < 6;
}

/**
 * Mapeia tipo de serviço para ODS violado quando acesso é negado
 */
export function getODSForServiceType(serviceType: string): ODSTarget {
	const type = serviceType.toUpperCase();
	switch (type) {
		case "ALIMENTACAO":
			return "2.1";
		case "ABRIGO":
		case "PERNOITE":
			return "11.1";
		case "SAUDE":
		case "HEALTH_MENTAL":
			return "3.8";
		case "HIGIENE":
			return "6.2";
		case "TRABALHO":
			return "8.5";
		case "DOCUMENTOS":
		case "CIDADANIA":
			return "16.9";
		case "ASSISTENCIA":
			return "1.3";
		default:
			return "1.4";
	}
}

/**
 * Hook para gerenciar eventos de negação
 */
export function useDenialEvents() {
	const [events, setEvents] = useState<DenialEvent[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Carregar eventos do localStorage
	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored) as DenialEvent[];
				setEvents(parsed);
			}
		} catch (e) {
			console.error("[DenialEvents] Erro ao carregar eventos:", e);
		}
		setIsLoaded(true);
	}, []);

	// Persistir eventos quando mudam
	useEffect(() => {
		if (!isLoaded) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
		} catch (e) {
			console.error("[DenialEvents] Erro ao salvar eventos:", e);
		}
	}, [events, isLoaded]);

	const addEvent = useCallback(
		(event: Omit<DenialEvent, "id" | "timestamp">) => {
			const newEvent: DenialEvent = {
				...event,
				id: crypto.randomUUID(),
				timestamp: Date.now(),
			};

			setEvents((prev) => {
				const updated = [newEvent, ...prev];
				if (updated.length > MAX_EVENTS) {
					return updated.slice(0, MAX_EVENTS);
				}
				return updated;
			});

			console.log(
				`[DenialEvents] Registrada violação ODS ${event.odsViolated}:`,
				event.reason,
			);
			return newEvent;
		},
		[],
	);

	const clearEvents = useCallback(() => {
		setEvents([]);
		localStorage.removeItem(STORAGE_KEY);
	}, []);

	/**
	 * Retorna eventos agrupados com cores ODS (para heatmap)
	 */
	const getHeatmapData = useCallback(
		(nightOnly: boolean = false) => {
			const filtered = nightOnly
				? events.filter((e) => isNightTime(e.timestamp))
				: events;

			const grouped = new Map<
				string,
				{
					coords: [number, number];
					count: number;
					types: DenialType[];
					primaryODS: ODSTarget;
					color: { fill: string; stroke: string };
				}
			>();

			for (const event of filtered) {
				const key = `${event.coords[0].toFixed(4)},${event.coords[1].toFixed(4)}`;
				const existing = grouped.get(key);
				if (existing) {
					existing.count++;
					if (!existing.types.includes(event.type)) {
						existing.types.push(event.type);
					}
				} else {
					const odsColor = ODS_COLORS[event.odsViolated] || ODS_COLORS["1.4"];
					grouped.set(key, {
						coords: event.coords,
						count: 1,
						types: [event.type],
						primaryODS: event.odsViolated,
						color: { fill: odsColor.fill, stroke: odsColor.stroke },
					});
				}
			}

			return Array.from(grouped.values());
		},
		[events],
	);

	const getStatistics = useCallback(() => {
		const byODS: Record<string, number> = {};
		const byType: Record<string, number> = {};
		const nightCount = events.filter((e) => isNightTime(e.timestamp)).length;

		for (const event of events) {
			byODS[event.odsViolated] = (byODS[event.odsViolated] || 0) + 1;
			byType[event.type] = (byType[event.type] || 0) + 1;
		}

		return {
			total: events.length,
			byODS,
			byType,
			nightCount,
			last24h: events.filter(
				(e) => Date.now() - e.timestamp < 24 * 60 * 60 * 1000,
			).length,
		};
	}, [events]);

	/**
	 * Gera relatório de denúncia formatado para advocacy
	 * K-ANONYMITY: Não inclui coordenadas exatas ou IDs de usuários
	 */
	const generateReport = useCallback(
		(hoursBack: number = 48) => {
			const cutoff = Date.now() - hoursBack * 60 * 60 * 1000;
			const recentEvents = events.filter((e) => e.timestamp >= cutoff);

			if (recentEvents.length === 0) {
				return `Nenhuma violação registrada nas últimas ${hoursBack} horas.`;
			}

			const byODS: Record<string, { count: number; services: string[] }> = {};
			const nightCount = recentEvents.filter((e) =>
				isNightTime(e.timestamp),
			).length;

			for (const event of recentEvents) {
				const odsLabel = ODS_COLORS[event.odsViolated]?.label || "Outros";
				if (!byODS[odsLabel]) {
					byODS[odsLabel] = { count: 0, services: [] };
				}
				byODS[odsLabel].count++;
				if (
					event.serviceName &&
					!byODS[odsLabel].services.includes(event.serviceName)
				) {
					byODS[odsLabel].services.push(event.serviceName);
				}
			}

			const lines = [
				`══════════════════════════════════════════════════════════`,
				`RELATÓRIO DE VIOLAÇÕES DE DIREITOS - CAMINHOS CAMPINAS`,
				`══════════════════════════════════════════════════════════`,
				`Período: Últimas ${hoursBack} horas`,
				`Data de geração: ${new Date().toLocaleString("pt-BR")}`,
				`Município: Campinas/SP (Região Metropolitana)`,
				``,
				`RESUMO ESTATÍSTICO:`,
				`- Total de violações registradas: ${recentEvents.length}`,
				`- Violações noturnas (18h-06h): ${nightCount} (${Math.round((nightCount / recentEvents.length) * 100)}%)`,
				``,
				`DETALHAMENTO POR TIPO DE DIREITO NEGADO:`,
			];

			for (const [label, data] of Object.entries(byODS)) {
				lines.push(`• ${label}: ${data.count} ocorrência(s)`);
				if (data.services.length > 0) {
					lines.push(
						`  Serviços afetados: ${data.services.slice(0, 5).join(", ")}`,
					);
				}
			}

			lines.push(``);
			lines.push(`══════════════════════════════════════════════════════════`);
			lines.push(`CANAIS DE DENÚNCIA:`);
			lines.push(`──────────────────────────────────────────────────────────`);
			lines.push(`📞 Disque 100 - Direitos Humanos (24h, gratuito)`);
			lines.push(`📞 Defensoria Pública SP: 0800-773-4340`);
			lines.push(
				`📧 MP-SP Cidadão: www.mpsp.mp.br/portal/page/portal/atendimento`,
			);
			lines.push(`📍 CREAS Campinas: (19) 3772-2500`);
			lines.push(``);
			lines.push(`══════════════════════════════════════════════════════════`);
			lines.push(`DISCLAIMER LEGAL:`);
			lines.push(`──────────────────────────────────────────────────────────`);
			lines.push(`Dados gerados via plataforma de ciência cidadã "Caminhos`);
			lines.push(`Campinas". Indicadores proxy para monitoramento dos ODS`);
			lines.push(`1 (Pobreza), 2 (Fome), 3 (Saúde), 6 (Água), 11 (Cidades)`);
			lines.push(
				`e 16 (Justiça). Metodologia baseada em registros voluntários.`,
			);
			lines.push(``);
			lines.push(`⚖️ Decreto 7.053/2009 - Política Nacional Pop. Rua`);
			lines.push(`⚖️ Lei 14.489/2023 - Lei Padre Júlio Lancellotti`);
			lines.push(`══════════════════════════════════════════════════════════`);
			lines.push(`NOTA DE ANONIMATO: Este relatório NÃO contém coordenadas`);
			lines.push(`exatas ou identificadores de usuários, em conformidade com`);
			lines.push(
				`o Protocolo Anti-Represália para população em situação de rua.`,
			);
			lines.push(`══════════════════════════════════════════════════════════`);

			return lines.join("\n");
		},
		[events],
	);

	return {
		events,
		addEvent,
		clearEvents,
		getHeatmapData,
		getStatistics,
		generateReport,
		isLoaded,
	};
}
