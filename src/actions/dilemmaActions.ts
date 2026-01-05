"use server";

import { supabase } from "@/lib/supabaseClient";

export async function submitDilemmaSuggestion(
	_prevState: any,
	formData: FormData,
) {
	const narrative_text = formData.get("narrative_text") as string;
	const option_a = formData.get("option_a") as string;
	const option_b = formData.get("option_b") as string;
	const barrier_fact = formData.get("barrier_fact") as string;
	const location = formData.get("location") as string;
	const contact_info = formData.get("contact_info") as string;

	if (!narrative_text || !barrier_fact || !option_a || !option_b) {
		return { success: false, message: "Campos obrigatórios faltando." };
	}

	// Construct options JSON
	const dilemma_options = [
		{ label: option_a, type: "primary" },
		{ label: option_b, type: "secondary" },
	];

	try {
		const { error } = await supabase.from("dilemma_suggestions").insert([
			{
				narrative_text,
				dilemma_options,
				barrier_fact,
				location,
				contact_info,
			},
		]);

		if (error) {
			console.error("Supabase Error:", error);
			return { success: false, message: "Erro ao salvar no banco de dados." };
		}

		return {
			success: true,
			message: "Sugestão enviada com sucesso! A rua foi ouvida.",
		};
	} catch (error) {
		console.error("Server Action Error:", error);
		return { success: false, message: "Erro interno no servidor." };
	}
}
