import { useCallback, useState } from "react";
import { useServices } from "@/contexts/ServicesContext";
import type { Dilemma } from "@/features/game-loop/dilemma-types";
// Dilemmas data import - assuming it's available or we maintain a subset here?
// Ideally we should import from a central dilemma registry.
// For now, I will use a placeholder or assume imports are possible.
// Wait, the prompt implies "create system". I will import dilemmas from existing file if possible.
import { ALL_DILEMMAS as dilemmas } from "@/features/game-loop/all-dilemmas";
import { DilemmaMatcher } from "@/services/DilemmaMatcher";

export function useDilemmaMatcher() {
	const { services } = useServices();
	// Assuming game context might keep track of precise user location or we pass it in.
	// The prompt says "Recalculate distance of player". Usually player pos is in SurvivalMap.
	// We will accept location as argument to be flexible.

	const [lastMatch, setLastMatch] = useState<Dilemma | null>(null);

	const findMatch = useCallback(
		(userInput: string, userCoords: [number, number] | null) => {
			const locationObj = userCoords
				? { lat: userCoords[0], lng: userCoords[1] }
				: null;

			const normalize = (s: string) =>
				s
					.toLowerCase()
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "");
			const input = normalize(userInput);

			// 2. Crie a lista de alvos APENAS com quem tem coordenadas válidas
			const targetServices = services.filter(
				(s): s is typeof s & { coords: [number, number] } => {
					return !!s.coords && Array.isArray(s.coords) && s.coords.length === 2;
				},
			);

			const bomPrato = targetServices.find((s) =>
				s.name.toLowerCase().includes("bom prato"),
			);
			const consultorio = targetServices.find(
				(s) => s.type === "SAUDE" || s.name.includes("Consultório"),
			);

			// Explicit Dynamic Checks as requested
			if (input.includes("fome") && locationObj) {
				const bpCoords =
					bomPrato && bomPrato.coords && Array.isArray(bomPrato.coords)
						? bomPrato.coords
						: null;
				if (bomPrato && bpCoords && bpCoords.length === 2) {
					const dist = calculateDist(
						locationObj.lat,
						locationObj.lng,
						bpCoords[0],
						bpCoords[1],
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
				const cr = targetServices.find(
					(s) => s.type === "SAUDE" || s.name.includes("Consultório"),
				);
				const crCoords =
					cr && cr.coords && Array.isArray(cr.coords) ? cr.coords : null;
				if (cr && crCoords && crCoords.length === 2) {
					const _dist = calculateDist(
						locationObj.lat,
						locationObj.lng,
						crCoords[0],
						crCoords[1],
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
			const serviceLocations = services
				.filter(
					(s): s is typeof s & { coords: [number, number] } =>
						!!s.coords &&
						Array.isArray(s.coords) &&
						s.coords.length === 2 &&
						s.coords[0] != null &&
						s.coords[1] != null,
				)
				.map((s) => {
					// Explicitly capture and check again (though predicate guarantees it)
					const coordsToUse = s.coords;
					return {
						id: s.id,
						coords: coordsToUse,
					};
				});

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
