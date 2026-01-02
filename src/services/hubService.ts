import SEED_DATA from "@/data/partners-campinas.json";
import type { Partner } from "@/types/Partner";

const STORAGE_KEY = "caminhos_hub_partners_v1";

// Campinas Bounding Box
const CAMPINAS_BOUNDS = {
	north: -22.7,
	south: -23.1,
	west: -47.3,
	east: -46.9,
};

export class HubService {
	private static instance: HubService;

	private constructor() {}

	public static getInstance(): HubService {
		if (!HubService.instance) {
			HubService.instance = new HubService();
		}
		return HubService.instance;
	}

	private getStoredPartners(): Partner[] {
		if (typeof window === "undefined") return [];
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) return JSON.parse(stored);

		// Seeding initial data if empty
		const initialPartners = SEED_DATA.map((p) => ({
			...p,
			location: p.coordinates, // Mapping coordinates to location
			verified: true, // Trusted sources
			createdAt: Date.now(),
		})) as unknown as Partner[]; // Cast to match Partner type slightly different structure

		this.savePartners(initialPartners);
		return initialPartners;
	}

	private savePartners(partners: Partner[]): void {
		if (typeof window === "undefined") return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
	}

	public validateLocation(lat: number, lng: number): boolean {
		return (
			lat <= CAMPINAS_BOUNDS.north &&
			lat >= CAMPINAS_BOUNDS.south &&
			lng >= CAMPINAS_BOUNDS.west &&
			lng <= CAMPINAS_BOUNDS.east
		);
	}

	public async registerPartner(
		data: Omit<Partner, "id" | "verified" | "createdAt">,
	): Promise<{ success: boolean; id?: string; error?: string }> {
		// Simulate a small network delay for UX realism
		await new Promise((resolve) => setTimeout(resolve, 600));

		// 1. Validation
		if (!this.validateLocation(data.location.lat, data.location.lng)) {
			return {
				success: false,
				error: "Localização fora do perímetro de Campinas (DDD 019).",
			};
		}

		// 2. Persistence
		try {
			const partners = this.getStoredPartners();

			const newPartner: Partner = {
				...data,
				id: crypto.randomUUID(),
				verified: false, // Default unverified
				createdAt: Date.now(),
			};

			partners.push(newPartner);
			this.savePartners(partners);

			console.log("[HubService] Partner persisted:", newPartner);
			return { success: true, id: newPartner.id };
		} catch (error) {
			console.error("Storage error:", error);
			return { success: false, error: "Falha ao salvar no dispositivo." };
		}
	}

	public async getPartners(): Promise<Partner[]> {
		// Simulate network fetch
		await new Promise((resolve) => setTimeout(resolve, 300));
		return this.getStoredPartners();
	}

	public async clearPartners(): Promise<void> {
		if (typeof window !== "undefined") {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

export const hubService = HubService.getInstance();
