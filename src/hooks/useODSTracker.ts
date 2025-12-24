import { useCallback } from "react";
import type { ServiceType } from "@/contexts/ServicesContext";
import { TelemetryAction, telemetryService } from "@/services/telemetry";

// ODS Mappings
const SERVICE_ODS_MAP: Record<ServiceType, string> = {
	food: "ODS 2 - Fome Zero e Agricultura Sustentável",
	shelter: "ODS 11 - Cidades e Comunidades Sustentáveis",
	health: "ODS 3 - Saúde e Bem-Estar",
	hygiene: "ODS 6 - Água Potável e Saneamento",
	assistance: "ODS 1 - Erradicação da Pobreza", // General Social Assistance
	work: "ODS 8 - Trabalho Decente e Crescimento Econômico",
	comércio: "ODS 12 - Consumo e Produção Responsáveis", // Loose mapping
	privado: "ODS 10 - Redução das Desigualdades", // Generic fallback
};

export function useODSTracker() {
	const trackAction = useCallback(
		async (
			actionName: string,
			odsTarget: string,
			metadata: Record<string, unknown> = {},
		) => {
			await telemetryService.track(
				TelemetryAction.ODS_METRIC,
				{
					action: actionName,
					...metadata,
				},
				odsTarget, // This maps to ods_category in TelemetryEvent
			);
		},
		[],
	);

	const trackServiceUse = useCallback(
		async (serviceName: string, serviceType: ServiceType) => {
			const ods =
				SERVICE_ODS_MAP[serviceType] || "ODS 1 - Erradicação da Pobreza";

			await trackAction(`USO_SERVICO_${serviceType.toUpperCase()}`, ods, {
				service_name: serviceName,
				service_type: serviceType,
			});
		},
		[trackAction],
	);

	const trackDilemmaDecision = useCallback(
		async (dilemmaId: string, choiceLabel: string, odsTag?: string) => {
			await telemetryService.track(
				TelemetryAction.DECISION_MADE,
				{
					dilemma_id: dilemmaId,
					choice: choiceLabel,
				},
				odsTag || "ODS 16 - Paz, Justiça e Instituições Eficazes",
			);
		},
		[],
	);

	return {
		trackAction,
		trackServiceUse,
		trackDilemmaDecision,
	};
}
