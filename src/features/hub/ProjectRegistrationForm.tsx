"use client";

import { useState } from "react";
import { ECO_COLORS } from "@/components/ui/design-tokens";

export function ProjectRegistrationForm() {
	const [formData, setFormData] = useState({
		name: "",
		organization: "",
		area: "food",
		contact: "",
		description: "",
		needs: "",
	});

	const [submitted, setSubmitted] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Projeto Submetido:", formData);
		// Aqui entraria a integração com Backend/Google Sheets
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<div className="p-6 bg-green-900/20 border border-green-500 rounded-lg text-center">
				<h3 className="text-xl font-bold text-green-400 mb-2">
					Projeto Cadastrado!
				</h3>
				<p className="text-gray-300">
					Obrigado por fortalecer a rede. Entraremos em contato em breve para
					validar as informações.
				</p>
				<button
					onClick={() => setSubmitted(false)}
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
			<div>
				<label className="block text-sm font-medium text-slate-300 mb-1">
					Nome do Projeto
				</label>
				<input
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
				<label className="block text-sm font-medium text-slate-300 mb-1">
					Organização / Coletivo
				</label>
				<input
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
				<label className="block text-sm font-medium text-slate-300 mb-1">
					Área de Atuação
				</label>
				<select
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
				<label className="block text-sm font-medium text-slate-300 mb-1">
					Contato (WhatsApp/Email)
				</label>
				<input
					type="text"
					name="contact"
					required
					value={formData.contact}
					onChange={handleChange}
					className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-slate-300 mb-1">
					Descrição Breve
				</label>
				<textarea
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
				<label className="block text-sm font-medium text-slate-300 mb-1">
					Principais Necessidades
				</label>
				<textarea
					name="needs"
					value={formData.needs}
					onChange={handleChange}
					rows={2}
					className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
					placeholder="Ex: Voluntários, Doação de Alimentos, Roupas..."
				/>
			</div>

			<button
				type="submit"
				className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg"
			>
				Cadastrar Projeto
			</button>
		</form>
	);
}
