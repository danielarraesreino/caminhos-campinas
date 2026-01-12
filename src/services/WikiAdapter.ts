/**
 * WikiAdapter Service
 *
 * Provides utilities for working with Wikidata in the browser context.
 * Converts Wikidata format to the game's Service format and handles fallbacks.
 */

export type ServiceType = "ABRIGO" | "ALIMENTACAO" | "SAUDE" | "ASSISTENCIA";

export interface Service {
	id: string;
	name: string;
	type: ServiceType;
	category?: string;
	address?: string;
	description?: string;
	opening_hours?: string;
	coords: [number, number];
	phone?: string;
	effects?: Record<string, number>;
	source?: "wikidata" | "local";
	wikidata_id?: string;
	synonyms?: string[];
}

interface WikidataService {
	item: { value: string };
	itemLabel: { value: string };
	itemDescription?: { value: string };
	coord?: { value: string };
	address?: { value: string };
}

/**
 * Extract Wikidata ID from item URI
 * Example: "http://www.wikidata.org/entity/Q12345" -> "Q12345"
 */
export function extractWikidataId(itemUri: string): string {
	const match = itemUri.match(/Q\d+$/);
	return match ? match[0] : "";
}

/**
 * Build Wikipedia URL from Wikidata ID or article slug
 */
export function getWikipediaUrl(wikiContext: string, lang = "pt"): string {
	// If it's a Wikidata ID (Q-number), use Special:GoToWikidata
	if (/^Q\d+$/.test(wikiContext)) {
		return `https://${lang}.wikipedia.org/wiki/Special:GoToLinkedPage/wikidata/${wikiContext}`;
	}
	// Otherwise, assume it's a Wikipedia article slug
	return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(wikiContext)}`;
}

/**
 * Parse Wikidata Point coordinate string to [lat, lng] tuple
 * Format: "Point(longitude latitude)"
 */
export function parseWikidataCoordinates(
	coordString: string,
): [number, number] | null {
	const match = coordString.match(/Point\(([^ ]+) ([^ ]+)\)/);
	if (match) {
		const lng = parseFloat(match[1]);
		const lat = parseFloat(match[2]);
		if (!isNaN(lat) && !isNaN(lng)) {
			return [lat, lng];
		}
	}
	return null;
}

/**
 * Infer service type from label and description
 */
export function inferServiceType(
	label: string,
	description?: string,
): ServiceType {
	const text = `${label} ${description || ""}`.toLowerCase();

	if (
		text.includes("abrigo") ||
		text.includes("shelter") ||
		text.includes("albergue") ||
		text.includes("casa de passagem")
	) {
		return "ABRIGO";
	}
	if (
		text.includes("restaurante") ||
		text.includes("comida") ||
		text.includes("aliment") ||
		text.includes("refeit") ||
		text.includes("bom prato")
	) {
		return "ALIMENTACAO";
	}
	if (
		text.includes("saúde") ||
		text.includes("saude") ||
		text.includes("caps") ||
		text.includes("hospital") ||
		text.includes("ubs") ||
		text.includes("consultório")
	) {
		return "SAUDE";
	}
	return "ASSISTENCIA";
}

/**
 * Convert a single Wikidata result to our Service format
 */
export function convertWikidataToService(
	result: WikidataService,
): Service | null {
	if (!result.coord) {
		return null; // Skip items without coordinates
	}

	const coords = parseWikidataCoordinates(result.coord.value);
	if (!coords) {
		return null;
	}

	const wikidataId = extractWikidataId(result.item.value);
	const name = result.itemLabel.value;

	return {
		id: `wikidata_${wikidataId}`,
		name,
		type: inferServiceType(name, result.itemDescription?.value),
		description: result.itemDescription?.value,
		address: result.address?.value,
		coords,
		source: "wikidata",
		wikidata_id: wikidataId,
	};
}

/**
 * Merge Wikidata services with local services
 * Local services take priority for existing entries (they have more detailed info)
 * Wikidata provides new entries and wikidata_id enrichment
 */
export function mergeServices(
	wikidataServices: Service[],
	localServices: Service[],
): Service[] {
	const merged = new Map<string, Service>();

	// Add local services first
	for (const service of localServices) {
		merged.set(service.id, { ...service, source: "local" });
	}

	// Add new Wikidata services or enrich existing ones
	for (const wikiService of wikidataServices) {
		// Check for matching local service by name similarity
		const matchingLocal = localServices.find(
			(local) =>
				local.name
					.toLowerCase()
					.includes(wikiService.name.toLowerCase().split(" ")[0]) ||
				wikiService.name
					.toLowerCase()
					.includes(local.name.toLowerCase().split(" ")[0]),
		);

		if (matchingLocal) {
			// Enrich existing local service with Wikidata ID
			const existing = merged.get(matchingLocal.id)!;
			merged.set(matchingLocal.id, {
				...existing,
				wikidata_id: wikiService.wikidata_id,
			});
		} else {
			// Add new service from Wikidata
			merged.set(wikiService.id, wikiService);
		}
	}

	return Array.from(merged.values());
}

/**
 * Load services from the merged JSON file
 * Falls back to local services if merged file doesn't exist
 */
export async function loadMergedServices(): Promise<Service[]> {
	try {
		// Try merged file first
		const response = await fetch("/data/services-merged.json");
		if (response.ok) {
			return await response.json();
		}
	} catch {
		console.warn("services-merged.json not found, using local fallback");
	}

	// Fallback to local services
	try {
		const response = await fetch("/data/services-campinas.json");
		if (response.ok) {
			return await response.json();
		}
	} catch {
		console.error("Failed to load any services");
	}

	return [];
}
