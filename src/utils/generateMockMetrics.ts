import { toGrid, applyTimeJitter } from "../utils/anonymization";

// Coordenadas centrais aproximadas de Campinas
const CAMPINAS_COORDS = { lat: -22.9064, lng: -47.0616 };

const EVENT_TYPES = ["BUSCA_ABRIGO", "SOLICITACAO_REFEICAO", "DOCUMENTACAO", "SAUDE_EMERGENCIA"];
const ODS_MAP: Record<string, string> = {
    BUSCA_ABRIGO: "ODS_11",
    SOLICITACAO_REFEICAO: "ODS_2",
    DOCUMENTACAO: "ODS_10",
    SAUDE_EMERGENCIA: "ODS_3"
};

export interface MockEvent {
    id: string;
    ods: string;
    type: string;
    grid: string;
    timestamp: number;
    systemic_failure: number; // 0-100
}

export function generateMockMetrics(count = 1000): MockEvent[] {
    const events: MockEvent[] = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
        // Dispersão aleatória em torno do centro (aprox 10km)
        const lat = CAMPINAS_COORDS.lat + (Math.random() - 0.5) * 0.1;
        const lng = CAMPINAS_COORDS.lng + (Math.random() - 0.5) * 0.1;

        const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];

        events.push({
            id: crypto.randomUUID(),
            ods: ODS_MAP[type],
            type,
            grid: toGrid(lat, lng),
            timestamp: applyTimeJitter(now - Math.random() * 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
            systemic_failure: Math.floor(Math.random() * 100)
        });
    }

    return events;
}
