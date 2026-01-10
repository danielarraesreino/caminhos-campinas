/**
 * Simulation script to validate Reality Atlas status decay and risk logic.
 */
import { REALITY_NODES, RiskCalculators } from "./src/data/RealityAtlas";
import { GameState } from "./src/types/GameState";

const mockState: Partial<GameState> = {
    health: 100,
    hunger: 50,
    hygiene: 50,
    sanity: 80,
    energy: 100,
    dignity: 50,
    socialStigma: 60,
    avatar: {
        name: "Test User",
        gender: "masculino",
        ethnicity: "pardo",
        ageRange: "adulto",
        timeOnStreet: "recente",
        startingSkill: "nenhuma"
    }
};

console.log("=== SIMULAÇÃO CAMINHOS CAMPINAS: REALITY ATLAS ===\n");

REALITY_NODES.forEach(node => {
    console.log(`Local: ${node.name}`);
    console.log(`Descrição: ${node.description}`);

    node.risks.forEach(risk => {
        const prob = RiskCalculators.calculateFinalProbability(risk, node, mockState as GameState);
        console.log(`  - Risco: ${risk.label} | Chance Social: ${(prob * 100).toFixed(1)}%`);
    });

    node.resources.forEach(res => {
        console.log(`  - Recurso: ${res.label} | Impacto: ${JSON.stringify(res.impact)}`);
    });
    console.log("----------------------------------\n");
});
