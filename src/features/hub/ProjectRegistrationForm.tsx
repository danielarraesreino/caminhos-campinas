"use client";

import { useState } from "react";
import { hubService } from "@/services/hubService";

// Mapeamento área -> categoria do banco
const AREA_TO_CATEGORY: Record<string, string> = {
	food: "ALIMENTACAO",
	health: "SAUDE",
	education: "EDUCACAO",
	shelter: "ABRIGO",
	rights: "JURIDICO",
};

export function ProjectRegistrationForm() {
	const [formData, setFormData] = useState({
		name: "",
		organization: "",
		area: "food",
		contact: "",
		description: "",
		needs: "",
		address: "",
		pixKey: "",
	});

	const [submitted, setSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const result = await hubService.registerPartner({
				name: `${formData.name} (${formData.organization})`,
				category: AREA_TO_CATEGORY[formData.area] || "ALIMENTACAO",
				whatsapp: formData.contact,
				description: `${formData.description}${formData.needs ? `\n\nNecessidades: ${formData.needs}` : ""}`,
				address: formData.address || undefined,
				pixKey: formData.pixKey || undefined,
			});

			if (!result.success) {
				throw new Error(result.error || "Erro ao cadastrar parceiro");
			}

			console.log("✅ Parceiro cadastrado:", result.id);
			setSubmitted(true);
		} catch (err) {
			console.error("❌ Erro no cadastro:", err);
			setError(err instanceof Error ? err.message : "Erro desconhecido");
		} finally {
			setIsLoading(false);
		}
	};

	if (submitted) {
		return (
			<div className="p-6 bg-green-900/20 border border-green-500 rounded-lg text-center">
				<h3 className="text-xl font-bold text-green-400 mb-2">
					Projeto Cadastrado!
				</h3>
				<p className="text-gray-300">
					Obrigado por fortalecer a rede. Seu cadastro está em análise e será
					publicado após validação.
				</p>
				<button
					type="button"
					onClick={() => {
						setSubmitted(false);
						setFormData({
							name: "",
							organization: "",
							area: "food",
							contact: "",
							description: "",
							needs: "",
							address: "",
							pixKey: "",
						});
					}}
					className="mt-4 text-sm text-green-400 underline hover:text-green-300"
				>
					Cadastrar outro projeto
				</button>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700"
		>
			{error && (
				<div className="p-3 bg-red-900/30 border border-red-500 rounded text-red-300 text-sm">
					{error}
				</div>
			)}

			<div>
				<label
					htmlFor="project-name"
					className="block text-sm font-medium text-slate-300 mb-1"
				>
					Nome do Projeto *
				</label>
				<input
					id="project-name"
					type="text"
					name="name"
					required
					value={formData.name}
					onChange={handleChange}
					className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
					placeholder="Ex: Marmita Solidária"
				/>
			</div>

			<div>
				<label
					htmlFor="organization"
					className="block text-sm font-medium text-slate-300 mb-1"
				>
					Organização / Coletivo *
				</label>
				<input
					id="organization"
					type="text"
					name="organization"
					required
					value={formData.organization}
					onChange={handleChange}
					className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
					placeholder="Ex: Associação de Moradores..."
				/>
			</div>

			<div>
				<label
					htmlFor="area"
					className="block text-sm font-medium text-slate-300 mb-1"
				>
					Área de Atuação *
				</label>
				<select
					id="area"
					name="area"
					value={formData.area}
					onChange={handleChange}
					className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
				>
					<option value="food">Alimentação</option>
					<option value="health">Saúde / Higiene</option>
					<option value="education">Educação / Capacitação</option>
					<option value="shelter">Moradia / Acolhimento</option>
					<option value="rights">Direitos / Documentação</option>
				</select>
			</div>

			<div>
				<label
					htmlFor="contact"
					className="block text-sm font-medium text-slate-300 mb-1"
				>
					WhatsApp ou Telefone *
				</label>
				<input
					id="contact"
					type="text"
					name="contact"
					required
					value={formData.contact}
					onChange={handleChange}
					className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
					placeholder="(19) 99999-9999"
				/>
			</div>

			<div>
				<label
					htmlFor="address"
					className="block text-sm font-medium text-slate-300 mb-1"
				>
					Endereço de Atuação
				</label>
				<input
					id="address"
					type="text"
					name="address"
					value={formData.address}
					onChange={handleChange}
					className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
					placeholder="Rua, número - Bairro"
				/>
			</div>

			<div>
				<label
					htmlFor="description"
					className="block text-sm font-medium text-slate-300 mb-1"
				>
					Descrição Breve *
				</label>
				<textarea
					id="description"
					name="description"
					required
					value={formData.description}
					onChange={handleChange}
					rows={3}
					className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
					placeholder="O que o projeto faz e onde atua?"
				/>
			</div>

			<div>
				<label
					htmlFor="needs"
					className="block text-sm font-medium text-slate-300 mb-1"
				>
					Principais Necessidades
				</label>
				<textarea
					id="needs"
					name="needs"
					value={formData.needs}
					onChange={handleChange}
					rows={2}
					className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
					placeholder="Ex: Voluntários, Doação de Alimentos, Roupas..."
				/>
			</div>

			<div>
				<label
					htmlFor="pixKey"
					className="block text-sm font-medium text-slate-300 mb-1"
				>
					Chave PIX para Doações
				</label>
				<input
					id="pixKey"
					type="text"
					name="pixKey"
					value={formData.pixKey}
					onChange={handleChange}
					className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
					placeholder="CPF, e-mail ou chave aleatória"
				/>
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-wait text-white font-bold rounded-lg transition-colors shadow-lg"
			>
				{isLoading ? "Cadastrando..." : "Cadastrar Projeto"}
			</button>
		</form>
	);
}
