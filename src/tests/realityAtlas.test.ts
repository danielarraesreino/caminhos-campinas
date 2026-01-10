import { describe, expect, it } from "vitest";
import {
	REALITY_ATLAS,
	REALITY_NODES,
	RiskCalculators,
	SOBRIO_CONSTANTS,
} from "@/data/RealityAtlas";
import type { GameState, Location, RiskFactor } from "@/types/GameState";

describe("RealityAtlas Data Integrity", () => {
	it("should have at least 3 locations in REALITY_NODES", () => {
		expect(REALITY_NODES.length).toBeGreaterThanOrEqual(3);
	});

	it("each location should have required fields", () => {
		for (const loc of REALITY_NODES) {
			expect(loc.id).toBeDefined();
			expect(loc.name).toBeDefined();
			expect(loc.coords).toBeDefined();
			expect(loc.coords.lat).toBeDefined();
			expect(loc.coords.lng).toBeDefined();
			expect(loc.description).toBeDefined();
			expect(Array.isArray(loc.resources)).toBe(true);
			expect(Array.isArray(loc.risks)).toBe(true);
			expect(typeof loc.stigmaMultiplier).toBe("number");
			expect(typeof loc.sanityDrainBase).toBe("number");
		}
	});

	it("SOBRIO_CONSTANTS should have valid ranges", () => {
		expect(SOBRIO_CONSTANTS.BASE_POLICE_RISK).toBeGreaterThan(0);
		expect(SOBRIO_CONSTANTS.BASE_POLICE_RISK).toBeLessThanOrEqual(1);
		expect(SOBRIO_CONSTANTS.STIGMA_MULTIPLIER_CENTER).toBeGreaterThan(1);
	});
});

describe("REALITY_ATLAS Structure", () => {
	it("should have LOCATIONS with correct structure", () => {
		expect(REALITY_ATLAS.LOCATIONS.CENTRO).toBeDefined();
		expect(REALITY_ATLAS.LOCATIONS.CENTRO.coords.lat).toBeCloseTo(-22.9055, 2);
		expect(REALITY_ATLAS.LOCATIONS.BOM_PRATO).toBeDefined();
		expect(REALITY_ATLAS.LOCATIONS.CENTRO_POP).toBeDefined();
	});

	it("should have NEIGHBORHOOD_MODIFIERS with policeActivity", () => {
		expect(
			REALITY_ATLAS.NEIGHBORHOOD_MODIFIERS.CENTRO_HISTORICO.policeActivity,
		).toBe(1.8);
		expect(
			REALITY_ATLAS.NEIGHBORHOOD_MODIFIERS.TAQUARAL_CAMBUI.policeActivity,
		).toBe(2.0);
	});

	it("SOCIAL_STATS should reflect real census data", () => {
		// Realismo Sóbrio: 50% mais abordagens para pessoas negras
		expect(
			REALITY_ATLAS.SOCIAL_STATS.VETOR_RACIAL.NEGATIVO_ESTIGMA_PRETO_PARDO,
		).toBe(1.5);

		// Censo Pop Rua 2024: 52% das violências de agentes públicos
		expect(REALITY_ATLAS.SOCIAL_STATS.VIOLENCE_SOURCE.PUBLIC_AGENTS).toBe(0.52);
	});
});

describe("RiskCalculators Logic (Realismo Sóbrio)", () => {
	const mockLocation: Location = {
		id: "test_location",
		name: "Test Location",
		coords: { lat: -22.9, lng: -47.0 },
		description: "Test",
		resources: [],
		risks: [],
		stigmaMultiplier: 1.5,
		sanityDrainBase: -2,
	};

	const mockRisk: RiskFactor = {
		id: "test_risk",
		label: "Test Risk",
		probability: 0.2,
		intensity: 2.0,
		description: "Test risk",
	};

	it("should increase probability when socialStigma is high", () => {
		const lowStigmaState = {
			socialStigma: 30,
			avatar: { ethnicity: "branco" as const },
		} as unknown as GameState;

		const highStigmaState = {
			socialStigma: 80,
			avatar: { ethnicity: "branco" as const },
		} as unknown as GameState;

		const probLow = RiskCalculators.calculateFinalProbability(
			mockRisk,
			mockLocation,
			lowStigmaState,
		);
		const probHigh = RiskCalculators.calculateFinalProbability(
			mockRisk,
			mockLocation,
			highStigmaState,
		);

		expect(probHigh).toBeGreaterThan(probLow);
	});

	it("should apply racial stigma multiplier for preto/pardo (Realismo Sóbrio)", () => {
		const whiteState = {
			socialStigma: 0,
			avatar: { ethnicity: "branco" as const },
		} as unknown as GameState;

		const blackState = {
			socialStigma: 0,
			avatar: { ethnicity: "preto" as const },
		} as unknown as GameState;

		const probWhite = RiskCalculators.calculateFinalProbability(
			mockRisk,
			mockLocation,
			whiteState,
		);
		const probBlack = RiskCalculators.calculateFinalProbability(
			mockRisk,
			mockLocation,
			blackState,
		);

		// Multiplicador de 1.5 para pessoas negras conforme dados do Censo
		expect(probBlack).toBe(probWhite * 1.5);
	});

	it("should cap probability at 0.95 (never 100% certain)", () => {
		const extremeRisk: RiskFactor = {
			...mockRisk,
			probability: 0.9,
		};

		const extremeState = {
			socialStigma: 100,
			avatar: { ethnicity: "preto" as const },
		} as unknown as GameState;

		const highStigmaLocation: Location = {
			...mockLocation,
			stigmaMultiplier: 3.0,
		};

		const prob = RiskCalculators.calculateFinalProbability(
			extremeRisk,
			highStigmaLocation,
			extremeState,
		);

		expect(prob).toBeLessThanOrEqual(0.95);
	});

	it("calculateImpact should return correct values for police approach", () => {
		const policeRisk: RiskFactor = {
			id: "abordagem_policial",
			label: "Abordagem GM/PM",
			probability: 0.15,
			intensity: 3.0,
			description: "Test",
		};

		const impact = RiskCalculators.calculateImpact(policeRisk, {} as GameState);

		expect(impact.sanityImpact).toBe(-15); // -5 * 3.0 intensity
		expect(impact.healthImpact).toBe(-10); // Special case for police
		expect(impact.dignityImpact).toBe(-30); // -10 * 3.0 intensity
	});
});
