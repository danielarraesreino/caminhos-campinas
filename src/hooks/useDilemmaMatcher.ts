import { useCallback, useState } from "react";
import { useServices } from "@/contexts/ServicesContext";
import { ALL_DILEMMAS as dilemmas } from "@/features/game-loop/dilemmas"; // Corrected import
import type { Dilemma } from "@/features/game-loop/dilemma-types";
import { DilemmaMatcher } from "@/services/DilemmaMatcher";

export function useDilemmaMatcher() {
	const { services } = useServices();
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

			// 1. Filter services with valid coordinates
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

			// Explicit Dynamic Checks
			if (input.includes("fome") && locationObj) {
				if (bomPrato && bomPrato.coords) {
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
						} as unknown as Dilemma;
					}
				}
			}

			if (
				(input.includes("dor") || input.includes("machucado")) &&
				locationObj
			) {
				if (consultorio && consultorio.coords) {
					const dist = calculateDist(
						locationObj.lat,
						locationObj.lng,
						consultorio.coords[0],
						consultorio.coords[1],
					);
					if (dist <= 1000) {
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
			}

			// Fallback to generic matcher
			const serviceLocations = targetServices.map((s) => ({
				id: s.id,
				coords: s.coords,
			}));

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
