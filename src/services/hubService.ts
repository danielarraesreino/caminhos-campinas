import { Partner } from "@/types/Partner";

/**
 * Service para interagir com a API de Parceiros.
 * Substitui o antigo localStorage.
 */
export const hubService = {
	async registerPartner(data: Omit<Partner, "id" | "status" | "createdAt" | "updatedAt">) {
		const res = await fetch("/api/partners", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const error = await res.json();
			throw new Error(error.error || "Erro ao registrar parceiro.");
		}

		return await res.json();
	},

	async getPartners() {
		const res = await fetch("/api/partners", {
			method: "GET",
		});

		if (!res.ok) {
			// Fallback or empty array on error
			console.error("Erro ao buscar parceiros");
			return [];
		}

		const json = await res.json();
		return json.data || [];
	}
};
