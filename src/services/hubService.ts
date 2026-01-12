import { Partner } from "@/types/Partner";

export const hubService = {
	async registerPartner(
		data: Omit<Partner, "id" | "status" | "createdAt">,
	): Promise<Partner> {
		const response = await fetch("/api/partners", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!response.ok) throw new Error("Falha ao registrar parceiro");
		return response.json();
	},

	async getPartners(status?: string): Promise<Partner[]> {
		const url = status ? `/api/partners?status=${status}` : "/api/partners";
		const response = await fetch(url);
		if (!response.ok) throw new Error("Falha ao buscar parceiros");
		return response.json();
	},
};
