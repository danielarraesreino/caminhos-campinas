import {
	runCensusSimulation,
	SimAgent,
} from "../src/features/dashboard/SimulationEngine";

// Simple Assert function
function assert(condition: boolean, message: string) {
	if (!condition) {
		console.error(`❌ FALHA: ${message}`);
		process.exit(1);
	} else {
		console.log(`✅ ${message}`);
	}
}

async function runTest() {
	console.log(
		"🟦 Iniciando Teste de Fidelidade Sociológica (1000 Iterações)...",
	);

	// Config
	const ITERATIONS = 1000;
	const TARGET_FAMILY_CONFLICT_PCT = 71.5;
	const TOLERANCE_PCT = 5.0;

	let totalAgents = 0;
	let familyConflictCount = 0;
	let benefitsDeniedCount = 0;
	let benefitsTotalTried = 0;

	// Run Simulation
	for (let i = 0; i < ITERATIONS; i++) {
		const agents = runCensusSimulation();
		totalAgents += agents.length;

		agents.forEach((agent) => {
			// Count Family Conflict
			if (agent.background.reason === "CONFLITO_FAMILIAR") {
				familyConflictCount++;
			}

			// Count Benefits Barriers
			if (agent.status.benefitsAccess !== "NAO_SOLICITOU") {
				benefitsTotalTried++;
				if (
					agent.status.benefitsAccess === "INDEFERIDO_DOCS" ||
					agent.status.benefitsAccess === "INDEFERIDO_ENDERECO"
				) {
					benefitsDeniedCount++;
				}
			}
		});
	}

	// Results
	const familyConflictPct = (familyConflictCount / totalAgents) * 100;
	const benefitsDeniedPct = (benefitsDeniedCount / benefitsTotalTried) * 100;

	console.log(`\n📊 Resultados Acumulados:`);
	console.log(`   - Total de Agentes Simulados: ${totalAgents}`);
	console.log(
		`   - % Conflito Familiar: ${familyConflictPct.toFixed(2)}% (Meta: ${TARGET_FAMILY_CONFLICT_PCT}%)`,
	);
	console.log(
		`   - % Indeferimento de Benefícios: ${benefitsDeniedPct.toFixed(2)}%`,
	);

	// Validation
	const divergence = Math.abs(familyConflictPct - TARGET_FAMILY_CONFLICT_PCT);
	console.log(`   - Divergência: ${divergence.toFixed(2)}%`);

	assert(
		divergence <= TOLERANCE_PCT,
		`Divergência de Fidelidade (${divergence.toFixed(2)}%) maior que o tolerado (${TOLERANCE_PCT}%). O motor está enviesado!`,
	);

	console.log(
		"\n🏆 SUCESSO: O motor de simulação reflete a realidade do Censo 2024.",
	);
}

runTest();
