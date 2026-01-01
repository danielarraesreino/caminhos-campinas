import type { Dilemma } from "@/features/game-loop/dilemma-types";

interface UserLocation {
	lat: number;
	lng: number;
}

// Haversine Formula to calculate distance in meters
function calculateDistance(loc1: UserLocation, loc2: UserLocation): number {
	const R = 6371e3; // Earth radius in meters
	const φ1 = (loc1.lat * Math.PI) / 180;
	const φ2 = (loc2.lat * Math.PI) / 180;
	const Δφ = ((loc2.lat - loc1.lat) * Math.PI) / 180;
	const Δλ = ((loc2.lng - loc1.lng) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
}

export const DilemmaMatcher = {
	findBestDilemma(
		userInput: string,
		userLocation: UserLocation | null,
		gameDilemmas: Dilemma[],
		services: { id: string; coords: [number, number] }[] = [],
	): Dilemma | null {
		const normalizedInput = userInput
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "");

		// Filter by tags
		const relevantDilemmas = gameDilemmas.filter((d) => {
			// 1. Tag Match (High Precision)
			if (
				d.tags &&
				Array.isArray(d.tags) &&
				d.tags.some((tag: string) => normalizedInput.includes(tag.toLowerCase()))
			) {
				return true;
			}
			// 2. Text Match (Fallback) - Search in Title and Description
			if (!d.title || !d.description) return false;
			const titleMatch = d.title.toLowerCase().includes(normalizedInput);
			const descMatch = d.description.toLowerCase().includes(normalizedInput);

			return titleMatch || descMatch;
		});

		if (relevantDilemmas.length === 0) return null;

		// Rank by Distance & Specificity
		let bestMatch: Dilemma | null = null;
		let minDistance = Infinity;

		for (const dilemma of relevantDilemmas) {
			// 1. If location trigger exists (direct coords)
			if (dilemma.location_trigger && userLocation) {
				const distance = calculateDistance(userLocation, {
					lat: dilemma.location_trigger.lat,
					lng: dilemma.location_trigger.lng,
				});

				if (distance <= dilemma.location_trigger.radius) {
					if (distance < minDistance) {
						minDistance = distance;
						bestMatch = dilemma;
					}
				}
			}
			// 2. Service Location Match (via locationId in trigger)
			else if (
				dilemma.trigger?.type === "LOCATION" &&
				dilemma.trigger.locationId &&
				userLocation
			) {
				const service = services.find(
					(s) => s.id === dilemma.trigger.locationId,
				);
				if (service) {
					const distance = calculateDistance(userLocation, {
						lat: service.coords[0],
						lng: service.coords[1],
					});

					// 500m threshold for Service-based dilemmas
					if (distance <= 500) {
						// High priority match
						return dilemma;
					}
				}
			}
			// 3. If no location trigger (Contextual/Topic based only)
			else if (
				!dilemma.location_trigger &&
				dilemma.trigger?.type !== "LOCATION"
			) {
				if (
					!bestMatch ||
					(!bestMatch.location_trigger &&
						bestMatch.trigger?.type !== "LOCATION")
				) {
					bestMatch = dilemma;
				}
			}
		}

		return bestMatch;
	},
};
