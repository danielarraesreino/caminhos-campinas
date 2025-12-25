import { useCallback, useState } from "react";
import { useServices } from "@/contexts/ServicesContext";
import type { Dilemma } from "@/features/game-loop/dilemmas";
// Dilemmas data import - assuming it's available or we maintain a subset here?
// Ideally we should import from a central dilemma registry.
// For now, I will use a placeholder or assume imports are possible.
// Wait, the prompt implies "create system". I will import dilemmas from existing file if possible.
import { ALL_DILEMMAS as dilemmas } from "@/features/game-loop/dilemmas";
import { DilemmaMatcher } from "@/services/DilemmaMatcher";

export function useDilemmaMatcher() {
	const { services } = useServices();
	// Assuming game context might keep track of precise user location or we pass it in.
	// The prompt says "Recalculate distance of player". Usually player pos is in SurvivalMap.
	// We will accept location as argument to be flexible.

	const [lastMatch, setLastMatch] = useState<Dilemma | null>(null);

	const findMatch = useCallback(
		(userInput: string, userCoords: [number, number] | null) => {
			// Map services to the format expected by DilemmaMatcher
			const serviceLocations = services.map((s) => ({
				id: s.id,
				coords: s.coords,
			}));

			const locationObj = userCoords
				? { lat: userCoords[0], lng: userCoords[1] }
				: null;

			// Custom Logic requested: "fome" + <500m "Bom Prato" -> Suggestion
			// We can pre-process this rule before calling the generic matcher, OR rely on the generic matcher
			// if we add a "dilemma" that triggers on these conditions.
			// User asked to "Calculate distance... If player says 'fome' and <500m 'Bom Prato', return card".
			// This implies generating a dynamic dilemma-like object if not found in static list.

			const normalize = (s: string) =>
				s
					.toLowerCase()
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "");
			const input = normalize(userInput);

			// Explicit Dynamic Checks as requested
			if (input.includes("fome") && locationObj) {
				const bomPrato = services.find((s) =>
					s.name.toLowerCase().includes("bom prato"),
				);
				if (bomPrato) {
					const dist = calculateDist(
						locationObj.lat,
						locationObj.lng,
						bomPrato.coords[0],
						bomPrato.coords[1],
					);
					if (dist <= 500) {
						return {
							id: "dynamic_fome_bp",
							title: "Fome Perto do Bom Prato",
							text: `Você está a ${Math.round(dist)}m do Bom Prato. Eles servem refeições a preços populares.`,
							options: [
								{
									label: "Ir para Bom Prato",
									action: (state: any) => ({
										...state,
										hunger: Math.min(100, state.hunger + 50),
										money: state.money - 1,
									}),
								},
							],
						} as unknown as Dilemma; // Casting for compatibility
					}
				}
			}

			if (
				(input.includes("dor") || input.includes("machucado")) &&
				locationObj
			) {
				const consultorio = services.find(
					(s) => s.type === "saude" || s.name.includes("Consultório"),
				);
				if (consultorio) {
					const _dist = calculateDist(
						locationObj.lat,
						locationObj.lng,
						consultorio.coords[0],
						consultorio.coords[1],
					);
					// Relaxed distance for health? Or keep 500m? Assuming global or nearest.
					// Let's standardise on finding the NEAREST health service.
					// The prompt specifically mentioned "Consultório na Rua".

					return {
						id: "dynamic_health_cr",
						title: "Atendimento de Saúde",
						text: "Você mencionou dor. O 'Consultório na Rua' oferece atendimento gratuito e sem burocracia.",
						options: [
							{
								label: "Buscar atendimento",
								action: (state: any) => ({
									...state,
									health: Math.min(100, state.health + 20),
								}),
							},
						],
					} as unknown as Dilemma;
				}
			}

			// Fallback to generic matcher
			const match = DilemmaMatcher.findBestDilemma(
				userInput,
				locationObj,
				dilemmas,
				serviceLocations,
			);
			setLastMatch(match);
			return match;
		},
		[services],
	);

	return { findMatch, lastMatch };
}

// Helper duplication (should be shared utility but inlining for hook simplicity as requested)
function calculateDist(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
): number {
	const R = 6371e3;
	const φ1 = (lat1 * Math.PI) / 180;
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}
