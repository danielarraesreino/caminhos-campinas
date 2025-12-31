import { useCallback } from "react";
import type { ServiceType } from "@/contexts/ServicesContext";
import { TelemetryAction, telemetryService } from "@/services/telemetry";

// ODS Mappings
const SERVICE_ODS_MAP: Record<ServiceType, string> = {
	alimentacao: "ODS 2 - Fome Zero e Agricultura Sustentável",
	abrigo: "ODS 11 - Cidades e Comunidades Sustentáveis",
	saude: "ODS 3 - Saúde e Bem-Estar",
	assistencia: "ODS 1 - Erradicação da Pobreza", // General Social Assistance
	work: "ODS 8 - Trabalho Decente e Crescimento Econômico",
	educacao: "ODS 4 - Educação de Qualidade",
	education: "ODS 4 - Educação de Qualidade",
	job_training: "ODS 8 - Trabalho Decente e Crescimento Econômico",
	tech: "ODS 9 - Indústria, Inovação e Infraestrutura",
	comércio: "ODS 12 - Consumo e Produção Responsáveis", // Loose mapping
	privado: "ODS 10 - Redução das Desigualdades", // Generic fallback
};

export function useODSTracker() {
	const trackAction = useCallback(
		async (
			actionName: string,
			odsTarget: string,
			metadata: Record<string, any> = {},
		) => {
			await telemetryService.track(
				TelemetryAction.ODS_METRIC,
				{
					action: actionName,
					...metadata,
				},
				{ ods_category: odsTarget }, // This maps to ods_category in TelemetryEvent
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
				{ ods_category: odsTag || "ODS 16 - Paz, Justiça e Instituições Eficazes" },
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
