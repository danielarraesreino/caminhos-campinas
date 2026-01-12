import SEED_DATA from "@/data/partners.json";
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

	public validateLocation(lat: number, lng: number): boolean {
		return (
			lat <= CAMPINAS_BOUNDS.north &&
			lat >= CAMPINAS_BOUNDS.south &&
			lng >= CAMPINAS_BOUNDS.west &&
			lng <= CAMPINAS_BOUNDS.east
		);
	}

	public async registerPartner(
		data: Partial<Partner> & {
			category?: string;
			whatsapp?: string;
			pixKey?: string;
		},
	): Promise<{ success: boolean; id?: string; error?: string }> {
		try {
			const payload = {
				name: data.name,
				category: data.category || (data.services?.[0] as string) || "OUTROS",
				whatsapp: data.whatsapp || data.phone || "",
				description: data.description,
				pixKey: data.pixKey || null,
				address: data.address,
				latitude: data.location?.lat,
				longitude: data.location?.lng,
			};

			const response = await fetch("/api/partners", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const result = await response.json();

			if (!response.ok || !result.success) {
				return {
					success: false,
					error: result.error || "Erro ao cadastrar parceiro.",
				};
			}

			return { success: true, id: result.partner.id };
		} catch (error) {
			console.error("API error:", error);
			return { success: false, error: "Falha na conexão com o servidor." };
		}
	}

	public async getPartners(): Promise<Partner[]> {
		try {
			const response = await fetch("/api/partners");
			const result = await response.json();

			if (!response.ok || !result.success) {
				throw new Error(result.error || "Erro ao buscar parceiros.");
			}

			// Map Prisma models back to Partner interface
			return result.data.map((p: any) => ({
				id: p.id,
				name: p.name,
				description: p.description || "",
				type: "ONG", // Default as Prisma model is simpler
				services: [p.category],
				location: {
					lat: p.latitude || -22.9056,
					lng: p.longitude || -47.0608,
				},
				address: p.address || "",
				phone: p.whatsapp,
				verified: p.status === "APPROVED",
				createdAt: new Date(p.createdAt).getTime(),
				constraints: [],
			})) as Partner[];
		} catch (error) {
			console.error("Fetch error:", error);
			// Fallback to seed data if API fails (useful in dev without DB)
			return SEED_DATA.map((p) => ({
				...p,
				location: p.coordinates,
				verified: true,
				createdAt: Date.now(),
				constraints: [],
			})) as unknown as Partner[];
		}
	}

	public async clearPartners(): Promise<void> {
		// Not implemented for API yet (requires admin)
		console.warn("Clear partners not implemented for persistent database.");
	}
}

export const hubService = HubService.getInstance();
