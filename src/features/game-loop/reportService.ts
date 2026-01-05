import { GAME_DILEMMAS } from "./dilemmas";
import type { Dilemma } from "./dilemma-types";

// In a real backend, this would query the DB. 
// Locally, we'll simulate "Global Stats" by combining static data + local session increments.
//Ideally, we would sync this with the server.

export interface ReportResult {
    status: "MATCH_FOUND" | "NEW_REPORT";
    message: string;
    matchedDilemmaId?: string;
    updatedCount?: number;
}

export function processUserReport(text: string): ReportResult {
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedText = normalize(text);

    // 1. Search for Keywords
    let bestMatch: Dilemma | null = null;
    let maxKeywords = 0;

    for (const dilemma of GAME_DILEMMAS) {
        if (!dilemma.relatedKeywords) continue;

        let matchCount = 0;
        for (const keyword of dilemma.relatedKeywords) {
            if (normalizedText.includes(normalize(keyword))) {
                matchCount++;
            }
        }

        if (matchCount > maxKeywords) {
            maxKeywords = matchCount;
            bestMatch = dilemma;
        }
    }

    // 2. Logic: Heatmap vs New Issue
    if (bestMatch && maxKeywords > 0) {
        // Mocking the "Global Count" - in reality, this comes from the DB
        const baseCount = bestMatch.occurrenceCount || Math.floor(Math.random() * 500) + 50;
        const newCount = baseCount + 1;

        return {
            status: "MATCH_FOUND",
            message: `Este problema já foi relatado ${newCount.toLocaleString()} vezes. Você não está sozinho. Adicionamos seu peso a essa estatística.`,
            matchedDilemmaId: bestMatch.id,
            updatedCount: newCount
        };
    }

    return {
        status: "NEW_REPORT",
        message: "Seu relato traz uma perspectiva nova. Registramos como um 'Alerta Silencioso' para análise."
    };
}
