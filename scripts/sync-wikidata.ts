/**
 * Wikidata Sync Script
 * Fetches social services in Campinas from Wikidata and merges with local data.
 *
 * Usage: npm run sync:wikidata
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

// SPARQL endpoint for Wikidata
const WIKIDATA_SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

// SPARQL Query for social services in Campinas
// Includes: shelters (Q1060829), soup kitchens (Q106559804), social assistance centers
const SPARQL_QUERY = `
SELECT DISTINCT ?item ?itemLabel ?itemDescription ?coord ?address ?phone ?website WHERE {
  # Items located in Campinas (Q46629)
  ?item wdt:P131* wd:Q46629 .
  
  # Filter by instance types (shelters, community centers, social services)
  {
    ?item wdt:P31/wdt:P279* wd:Q1060829 .  # shelter
  } UNION {
    ?item wdt:P31/wdt:P279* wd:Q55010306 . # community center
  } UNION {
    ?item wdt:P31/wdt:P279* wd:Q2140665 .  # public health facility
  } UNION {
    ?item wdt:P31/wdt:P279* wd:Q11707 .    # restaurant (for popular restaurants)
    ?item wdt:P5817 wd:Q49848 .            # operated by public body
  }
  
  # Optional properties
  OPTIONAL { ?item wdt:P625 ?coord }
  OPTIONAL { ?item wdt:P6375 ?address }
  OPTIONAL { ?item wdt:P1329 ?phone }
  OPTIONAL { ?item wdt:P856 ?website }
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,en" }
}
ORDER BY ?itemLabel
LIMIT 100
`;

// Service type mapping based on Wikidata item description
type ServiceType = "ABRIGO" | "ALIMENTACAO" | "SAUDE" | "ASSISTENCIA";

interface WikidataResult {
	item: { value: string };
	itemLabel: { value: string };
	itemDescription?: { value: string };
	coord?: { value: string };
	address?: { value: string };
	phone?: { value: string };
	website?: { value: string };
}

interface Service {
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
}

/**
 * Parse Wikidata Point coordinate string to [lat, lng] tuple
 * Format: "Point(longitude latitude)"
 */
function parseCoordinates(coordString: string): [number, number] | null {
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
 * Extract Wikidata ID from item URI
 */
function extractWikidataId(itemUri: string): string {
	const match = itemUri.match(/Q\d+$/);
	return match ? match[0] : itemUri;
}

/**
 * Infer service type from description
 */
function inferServiceType(label: string, description?: string): ServiceType {
	const text = `${label} ${description || ""}`.toLowerCase();

	if (
		text.includes("abrigo") ||
		text.includes("shelter") ||
		text.includes("albergue")
	) {
		return "ABRIGO";
	}
	if (
		text.includes("restaurante") ||
		text.includes("comida") ||
		text.includes("aliment") ||
		text.includes("refeit")
	) {
		return "ALIMENTACAO";
	}
	if (
		text.includes("saúde") ||
		text.includes("saude") ||
		text.includes("caps") ||
		text.includes("hospital") ||
		text.includes("ubs")
	) {
		return "SAUDE";
	}
	return "ASSISTENCIA";
}

/**
 * Convert Wikidata result to Service format
 */
function convertToService(result: WikidataResult): Service | null {
	const coords = result.coord ? parseCoordinates(result.coord.value) : null;

	// Skip items without coordinates (we need them for the map)
	if (!coords) {
		console.log(`⚠️ Skipping "${result.itemLabel.value}" - no coordinates`);
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
		phone: result.phone?.value,
		source: "wikidata",
		wikidata_id: wikidataId,
	};
}

/**
 * Fetch services from Wikidata SPARQL endpoint
 */
async function fetchFromWikidata(): Promise<WikidataResult[]> {
	console.log("🔍 Querying Wikidata for social services in Campinas...");

	const url = new URL(WIKIDATA_SPARQL_ENDPOINT);
	url.searchParams.set("query", SPARQL_QUERY);
	url.searchParams.set("format", "json");

	const response = await fetch(url.toString(), {
		headers: {
			Accept: "application/sparql-results+json",
			"User-Agent":
				"CaminhosCampinas/1.0 (https://caminhos-campinas.vercel.app)",
		},
	});

	if (!response.ok) {
		throw new Error(
			`Wikidata query failed: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data.results?.bindings || [];
}

/**
 * Load local services-campinas.json as fallback
 */
function loadLocalServices(): Service[] {
	const localPath = join(process.cwd(), "public/data/services-campinas.json");

	if (!existsSync(localPath)) {
		console.warn("⚠️ Local services file not found at:", localPath);
		return [];
	}

	const content = readFileSync(localPath, "utf-8");
	const services = JSON.parse(content) as Service[];

	// Mark all as local source
	return services.map((s) => ({ ...s, source: "local" as const }));
}

/**
 * Merge Wikidata and local services, preferring Wikidata when available
 */
function mergeServices(
	wikidataServices: Service[],
	localServices: Service[],
): Service[] {
	const merged = new Map<string, Service>();

	// Add local services first (lower priority)
	for (const service of localServices) {
		merged.set(service.id, service);
	}

	// Add Wikidata services (higher priority for new items)
	for (const service of wikidataServices) {
		// Check if there's a matching local service by name similarity
		const existingLocal = localServices.find(
			(s) =>
				s.name
					.toLowerCase()
					.includes(service.name.toLowerCase().split(" ")[0]) ||
				service.name.toLowerCase().includes(s.name.toLowerCase().split(" ")[0]),
		);

		if (existingLocal) {
			// Merge: keep local effects/detailed info, update with Wikidata coords if better
			merged.set(existingLocal.id, {
				...existingLocal,
				wikidata_id: service.wikidata_id,
				source: "local" as const,
			});
		} else {
			// New service from Wikidata
			merged.set(service.id, service);
		}
	}

	return Array.from(merged.values());
}

/**
 * Main sync function
 */
async function syncWikidata(): Promise<void> {
	console.log("🚀 Starting Wikidata sync...\n");

	try {
		// 1. Fetch from Wikidata
		const wikidataResults = await fetchFromWikidata();
		console.log(
			`📥 Received ${wikidataResults.length} results from Wikidata\n`,
		);

		// 2. Convert to Service format
		const wikidataServices = wikidataResults
			.map(convertToService)
			.filter((s): s is Service => s !== null);
		console.log(`✅ Converted ${wikidataServices.length} valid services\n`);

		// 3. Load local fallback
		const localServices = loadLocalServices();
		console.log(`📂 Loaded ${localServices.length} local services\n`);

		// 4. Merge services
		const mergedServices = mergeServices(wikidataServices, localServices);
		console.log(`🔀 Merged total: ${mergedServices.length} services\n`);

		// 5. Save merged result
		const outputPath = join(process.cwd(), "public/data/services-merged.json");
		writeFileSync(outputPath, JSON.stringify(mergedServices, null, 2), "utf-8");
		console.log(`💾 Saved to: ${outputPath}\n`);

		// 6. Summary
		const wikidataCount = mergedServices.filter(
			(s) => s.source === "wikidata",
		).length;
		const localCount = mergedServices.filter(
			(s) => s.source === "local",
		).length;
		console.log("📊 Summary:");
		console.log(`   - From Wikidata: ${wikidataCount}`);
		console.log(`   - From Local:    ${localCount}`);
		console.log(`   - Total:         ${mergedServices.length}`);
		console.log("\n✨ Sync complete!");
	} catch (error) {
		console.error("❌ Sync failed:", error);

		// Fallback: copy local services if Wikidata fails
		console.log("\n🔄 Falling back to local services only...");
		const localServices = loadLocalServices();
		const outputPath = join(process.cwd(), "public/data/services-merged.json");
		writeFileSync(outputPath, JSON.stringify(localServices, null, 2), "utf-8");
		console.log(
			`💾 Saved ${localServices.length} local services to: ${outputPath}`,
		);
	}
}

// Run if executed directly
syncWikidata();
