"use client";

import { useCallback } from "react";
import { telemetryService, TelemetryAction } from "@/services/telemetry";

export enum ODS {
    ERRADICACAO_POBREZA = "ODS_1",
    FOME_ZERO = "ODS_2",
    SAUDE_BEM_ESTAR = "ODS_3",
    REDUCAO_DESIGUALDADES = "ODS_10",
    CIDADES_SUSTENTAVEIS = "ODS_11",
}

export function useODSMetrics() {
    const trackODS = useCallback(async (ods: ODS, meta: string, details: Record<string, any> = {}) => {
        await telemetryService.track(TelemetryAction.ODS_METRIC, {
            ods,
            meta,
            ...details,
            timestamp: Date.now(),
        });

        if (process.env.NODE_ENV === 'development') {
            console.log(`[ODS Metric] ${ods} - Meta ${meta}:`, details);
        }
    }, []);

    const trackServiceAccess = useCallback((serviceType: string, serviceName: string) => {
        // Mapeamento lógico: buscar abrigo -> ODS 11 (Cidades Sustentáveis)
        if (serviceType === "ABRIGO" || serviceType === "PERNOITE") {
            trackODS(ODS.CIDADES_SUSTENTAVEIS, "11.1", { serviceType, serviceName });
        }
        // Buscar comida -> ODS 2 (Fome Zero)
        else if (serviceType === "ALIMENTACAO" || serviceType === "REFEICAO") {
            trackODS(ODS.FOME_ZERO, "2.1", { serviceType, serviceName });
        }
        // Documentação -> ODS 10 (Redução de Desigualdades)
        else if (serviceType === "DOCUMENTACAO" || serviceType === "CIDADANIA") {
            trackODS(ODS.REDUCAO_DESIGUALDADES, "10.3", { serviceType, serviceName });
        }
    }, [trackODS]);

    return {
        trackODS,
        trackServiceAccess,
    };
}
