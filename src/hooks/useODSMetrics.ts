"use client";

import { useCallback } from "react";
import { TelemetryAction, telemetryService } from "@/services/telemetry";

export enum ODS {
	ERRADICACAO_POBREZA = "ODS_1",
	FOME_ZERO = "ODS_2",
	SAUDE_BEM_ESTAR = "ODS_3",
	AGUA_SANEAMENTO = "ODS_6",
	TRABALHO_DECENTE = "ODS_8",
	REDUCAO_DESIGUALDADES = "ODS_10",
	CIDADES_SUSTENTAVEIS = "ODS_11",
	PAZ_JUSTICA = "ODS_16",
	IGUALDADE_RACIAL = "ODS_18",
}

export function useODSMetrics() {
	const trackODS = useCallback(
		async (ods: ODS, meta: string, details: Record<string, any> = {}) => {
			await telemetryService.track(TelemetryAction.ODS_METRIC, {
				ods,
				meta,
				...details,
				timestamp: Date.now(),
			});

			if (process.env.NODE_ENV === "development") {
				console.log(`[ODS Metric] ${ods} - Meta ${meta}:`, details);
			}
		},
		[],
	);

	const trackServiceAccess = useCallback(
		(serviceType: string, serviceName: string) => {
			// Mapeamento lógico: buscar abrigo -> ODS 11 (Cidades Sustentáveis)
			if (serviceType === "ABRIGO" || serviceType === "PERNOITE") {
				trackODS(ODS.CIDADES_SUSTENTAVEIS, "11.1", {
					serviceType,
					serviceName,
				});
			}
			// Buscar comida -> ODS 2 (Fome Zero)
			else if (serviceType === "ALIMENTACAO" || serviceType === "REFEICAO") {
				trackODS(ODS.FOME_ZERO, "2.1", { serviceType, serviceName });
			}
			// Documentação -> ODS 16 (Paz e Justiça)
			else if (serviceType === "DOCUMENTOS") {
				trackODS(ODS.PAZ_JUSTICA, "16.9", {
					serviceType,
					serviceName,
				});
			}
			// Cidadania/LGBT -> ODS 10 (Redução de Desigualdades)
			else if (serviceType === "CIDADANIA" || serviceType === "LGBT") {
				trackODS(ODS.REDUCAO_DESIGUALDADES, "10.2", {
					serviceType,
					serviceName,
				});
			}
			// Trabalho -> ODS 8 (Trabalho Decente)
			else if (serviceType === "TRABALHO") {
				trackODS(ODS.TRABALHO_DECENTE, "8.5", {
					serviceType,
					serviceName,
				});
			}
			// Saúde -> ODS 3 (Saúde e Bem-estar)
			else if (serviceType === "SAUDE" || serviceType === "HEALTH_MENTAL") {
				trackODS(ODS.SAUDE_BEM_ESTAR, "3.8", {
					serviceType,
					serviceName,
				});
			}
			// Higiene -> ODS 6 (Água e Saneamento)
			else if (serviceType === "HIGIENE") {
				trackODS(ODS.AGUA_SANEAMENTO, "6.2", {
					serviceType,
					serviceName,
				});
			}
			// Assistência Social -> ODS 1 (Erradicação da Pobreza)
			else if (serviceType === "ASSISTENCIA") {
				trackODS(ODS.ERRADICACAO_POBREZA, "1.3", {
					serviceType,
					serviceName,
				});
			}
		},
		[trackODS],
	);

	return {
		trackODS,
		trackServiceAccess,
	};
}
