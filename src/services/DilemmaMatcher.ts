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

		// Collect all matching dilemmas with a score
		const matches: { dilemma: Dilemma; score: number }[] = [];

		for (const d of gameDilemmas) {
			let score = 0;

			// 1. Tag Match (Highest priority)
			if (d.tags && Array.isArray(d.tags)) {
				for (const tag of d.tags) {
					const normalizedTag = tag.toLowerCase();
					if (normalizedTag === normalizedInput) {
						score += 20; // Exact tag match
					} else if (normalizedTag.includes(normalizedInput)) {
						score += 10; // Partial tag match
					}
				}
			}

			// 2. Title Match
			if (d.title && d.title.toLowerCase().includes(normalizedInput)) {
				score += 5;
			}

			// 3. Description Match (Lowest priority fallback)
			if (d.description && d.description.toLowerCase().includes(normalizedInput)) {
				score += 1;
			}

			if (score > 0) {
				matches.push({ dilemma: d, score });
			}
		}

		if (matches.length === 0) return null;

		// Sort matches by score descending
		matches.sort((a, b) => b.score - a.score);

		// Now pick the best one considering location
		let bestMatch: Dilemma | null = null;
		let highestScore = -1;
		let minDistance = Infinity;

		// We only consider the top matches (those with the highest score)
		const topScore = matches[0].score;
		const candidates = matches.filter((m) => m.score >= topScore * 0.8 || m.score > 10); // Include high-relevance matches

		for (const { dilemma, score } of candidates) {
			// A. High-Priority: Location Trigger match
			if (dilemma.location_trigger && userLocation) {
				const distance = calculateDistance(userLocation, {
					lat: dilemma.location_trigger.lat,
					lng: dilemma.location_trigger.lng,
				});

				if (distance <= dilemma.location_trigger.radius) {
					// Direct location match within radius wins if distance is closer
					if (distance < minDistance) {
						minDistance = distance;
						bestMatch = dilemma;
						highestScore = score + 50; // Boost location matches
					}
					continue;
				}
			}

			// B. Service Location Match
			if (
				dilemma.trigger?.type === "LOCATION" &&
				dilemma.trigger.locationId &&
				userLocation
			) {
				const service = services.find((s) => s.id === dilemma.trigger.locationId);
				if (service?.coords && service.coords.length === 2) {
					const distance = calculateDistance(userLocation, {
						lat: service.coords[0],
						lng: service.coords[1],
					});

					if (distance <= 500) {
						// Nearby service match
						if (score + 30 > highestScore) {
							highestScore = score + 30;
							bestMatch = dilemma;
						}
						continue;
					}
				}
			}

			// C. Normal Relevance Match
			if (score > highestScore) {
				highestScore = score;
				bestMatch = dilemma;
			}
		}

		return bestMatch;
	},
};
