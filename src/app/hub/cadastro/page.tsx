"use client";

import {
	AlertTriangle,
	ArrowLeft,
	Building2,
	CheckCircle2,
	Clock,
	MapPin,
	Save,
	Target,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { hubService } from "@/services/hubService";

// Tipos expandidos para incluir ODS
type ServiceType =
	| "ALIMENTACAO"
	| "ABRIGO"
	| "SAUDE"
	| "HIGIENE"
	| "TRABALHO"
	| "JURIDICO"
	| "VETERINARIO"
	| "SAUDE_MENTAL";

type ODSType = "ODS_1" | "ODS_2" | "ODS_3" | "ODS_6" | "ODS_8" | "ODS_16";

interface Partner {
	id: string;
	name: string;
	type: "ONG" | "COLETIVO" | "MOVIMENTO" | "RELIGIOSO" | "PUBLICO";
	address: string;
	whatsapp: string;
	services: ServiceType[];
	odsLinks: ODSType[];
	operatingHours: string;
	description: string;
}

// ODS com descrições para exibição
const ODS_OPTIONS: {
	value: ODSType;
	label: string;
	description: string;
	color: string;
}[] = [
	{
		value: "ODS_1",
		label: "ODS 1: Erradicação da Pobreza",
		description: "Doação de renda, itens ou proteção social",
		color: "text-red-400 border-red-800 bg-red-900/20",
	},
	{
		value: "ODS_2",
		label: "ODS 2: Fome Zero",
		description: "Marmitas, cestas básicas, alimentação",
		color: "text-yellow-400 border-yellow-800 bg-yellow-900/20",
	},
	{
		value: "ODS_3",
		label: "ODS 3: Saúde e Redução de Danos",
		description: "Consultório, psicologia, curativos",
		color: "text-green-400 border-green-800 bg-green-900/20",
	},
	{
		value: "ODS_6",
		label: "ODS 6: Higiene e Saneamento",
		description: "Banho, lavanderia, banheiro",
		color: "text-cyan-400 border-cyan-800 bg-cyan-900/20",
	},
	{
		value: "ODS_8",
		label: "ODS 8: Trabalho e Renda",
		description: "Capacitação, emprego, bolsas",
		color: "text-pink-400 border-pink-800 bg-pink-900/20",
	},
	{
		value: "ODS_16",
		label: "ODS 16: Acesso à Justiça/Documentos",
		description: "RG, CPF, orientação jurídica",
		color: "text-blue-400 border-blue-800 bg-blue-900/20",
	},
];

const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
	{ value: "ALIMENTACAO", label: "🍽️ Alimentação" },
	{ value: "ABRIGO", label: "🏠 Pernoite/Abrigo" },
	{ value: "HIGIENE", label: "🚿 Banho/Higiene" },
	{ value: "SAUDE", label: "🏥 Saúde Geral" },
	{ value: "SAUDE_MENTAL", label: "🧠 Saúde Mental" },
	{ value: "TRABALHO", label: "💼 Trabalho/Renda" },
	{ value: "JURIDICO", label: "⚖️ Jurídico/Docs" },
	{ value: "VETERINARIO", label: "🐕 Veterinário" },
];

export default function HubCadastroPage() {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [partnersList, setPartnersList] = useState<Partner[]>([]);

	useEffect(() => {
		const loadPartners = async () => {
			const data = await hubService.getPartners();
			// Map to local interface
			const mapped = data.map((p: any) => ({
				id: p.id,
				name: p.name,
				type: "ONG" as const,
				address: p.address || "",
				whatsapp: p.phone || p.whatsapp || "",
				services: p.services || [],
				odsLinks: [], // Not supported in DB yet
				operatingHours: "",
				description: p.description || "",
			}));
			setPartnersList(mapped);
		};
		loadPartners();
	}, []);

	const [formData, setFormData] = useState<Partial<Partner>>({
		type: "ONG",
		services: [],
		odsLinks: [],
	});

	const handleServiceToggle = (svc: ServiceType) => {
		const current = formData.services || [];
		const updated = current.includes(svc)
			? current.filter((s) => s !== svc)
			: [...current, svc];
		setFormData({ ...formData, services: updated });
	};

	const handleODSToggle = (ods: ODSType) => {
		const current = formData.odsLinks || [];
		const updated = current.includes(ods)
			? current.filter((o) => o !== ods)
			: [...current, ods];
		setFormData({ ...formData, odsLinks: updated });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Mapear o tipo do frontend para a categoria do backend (NGO, GOV, COMPANY)
		const categoryMap: Record<string, "NGO" | "GOV" | "COMPANY"> = {
			ONG: "NGO",
			COLETIVO: "NGO",
			MOVIMENTO: "NGO",
			RELIGIOSO: "NGO",
			PUBLICO: "GOV",
		};

		// 🧼 Sanitizar WhatsApp: remover qualquer caractere não numérico para passar no regex do backend
		const cleanWhatsapp = formData.whatsapp?.replace(/\D/g, "");

		const partnerData = {
			name: formData.name || "Sem Nome",
			address: formData.address || "",
			whatsapp: cleanWhatsapp,
			description: `${formData.description}\n\nHorário: ${formData.operatingHours}\nODS: ${formData.odsLinks?.join(", ")}`,
			category: categoryMap[formData.type || "ONG"] || "NGO",
		};

		try {
			const result = await hubService.registerPartner(partnerData as any);
			console.log("Success:", result);
			setSuccess(true);
			alert("Cadastro realizado com sucesso! Aguardando aprovação.");
			// Refresh list
			const data = await hubService.getPartners();
			const mapped = data.map((p: any) => ({
				id: p.id,
				name: p.name,
				type: "ONG" as const,
				address: p.address,
				whatsapp: (p as any).phone || "",
				services: p.services as any,
				odsLinks: [],
				operatingHours: "",
				description: p.description,
			}));
			setPartnersList(mapped);
		} catch (err) {
			console.error("Erro ao cadastrar:", err);
			alert("Erro ao cadastrar. Tente novamente.");
		}
		setLoading(false);
	};

	if (success) {
		return (
			<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
				<div className="w-20 h-20 bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 ring-2 ring-emerald-500/50">
					<CheckCircle2 className="w-10 h-10 text-emerald-400" />
				</div>
				<h2 className="text-2xl font-bold text-white mb-2">
					Organização Registrada no Censo da Solidariedade
				</h2>
				<p className="text-slate-400 max-w-md mb-8">
					Sua organização agora faz parte do mapeamento de impacto social
					vinculado às metas ODS da ONU. Em breve, nossa equipe fará a validação
					para inclusão no mapa oficial.
				</p>
				<div className="flex gap-4">
					<button
						type="button"
						onClick={() => {
							setSuccess(false);
							setFormData({ type: "ONG", services: [], odsLinks: [] });
						}}
						className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
					>
						Cadastrar Outra
					</button>
					<Link
						href="/jogar"
						className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
					>
						Voltar ao Jogo
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
			{/* Header */}
			<header className="bg-slate-900/50 border-b border-slate-800 p-4 sticky top-0 z-10 backdrop-blur-md">
				<div className="max-w-2xl mx-auto flex items-center gap-4">
					<Link href="/">
						<button
							type="button"
							className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
						>
							<ArrowLeft className="w-6 h-6 text-slate-400" />
						</button>
					</Link>
					<h1 className="text-xl font-bold flex items-center gap-2">
						<Building2 className="text-blue-400" />
						Censo da Solidariedade
					</h1>
				</div>
			</header>

			<main className="max-w-2xl mx-auto p-4 md:p-8 space-y-8">
				{/* MANIFESTO - Texto de Impacto */}
				<div className="bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-700/50 p-6 rounded-2xl space-y-4">
					<div className="flex items-start gap-3">
						<AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
						<div>
							<h2 className="text-lg font-bold text-white mb-2">
								Sua organização é invisível para o sistema oficial?
							</h2>
							<p className="text-slate-300 leading-relaxed">
								Cadastre-se aqui. O{" "}
								<strong className="text-blue-400">Caminhos Campinas</strong>{" "}
								cruza sua localização com a demanda real das ruas. Ao se
								cadastrar, você não entra apenas em um mapa;{" "}
								<strong className="text-white">
									você ajuda a preencher a lacuna de dados entre o Censo oficial
									(1.300 pessoas) e a realidade das ruas (2.300+ no CadÚnico).
								</strong>
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-700">
						<Target size={14} className="text-purple-400" />
						Cada cadastro alimenta a auditoria dos ODS (Objetivos de
						Desenvolvimento Sustentável) da ONU.
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Nome */}
					<div className="space-y-2">
						<label
							htmlFor="org-name"
							className="text-xs font-bold uppercase tracking-wider text-slate-500"
						>
							Nome da Organização *
						</label>
						<input
							id="org-name"
							required
							value={formData.name || ""}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
							placeholder="Ex: Cozinha Solidária do Centro"
						/>
					</div>

					{/* Tipo e WhatsApp */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label
								htmlFor="org-type"
								className="text-xs font-bold uppercase tracking-wider text-slate-500"
							>
								Tipo *
							</label>
							<select
								id="org-type"
								value={formData.type}
								onChange={(e) =>
									setFormData({
										...formData,
										type: e.target.value as Partner["type"],
									})
								}
								className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
							>
								<option value="ONG">ONG / OSC</option>
								<option value="COLETIVO">Coletivo</option>
								<option value="MOVIMENTO">Movimento Social</option>
								<option value="RELIGIOSO">Igreja/Religioso</option>
								<option value="PUBLICO">Serviço Público</option>
							</select>
						</div>
						<div className="space-y-2">
							<label
								htmlFor="org-whatsapp"
								className="text-xs font-bold uppercase tracking-wider text-slate-500"
							>
								WhatsApp *
							</label>
							<input
								id="org-whatsapp"
								required
								value={formData.whatsapp || ""}
								onChange={(e) =>
									setFormData({ ...formData, whatsapp: e.target.value })
								}
								className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
								placeholder="(19) 99999-9999"
							/>
						</div>
					</div>

					{/* Endereço */}
					<div className="space-y-2">
						<label
							htmlFor="org-address"
							className="text-xs font-bold uppercase tracking-wider text-slate-500"
						>
							Endereço / Ponto de Referência *
						</label>
						<div className="relative">
							<MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
							<input
								id="org-address"
								required
								value={formData.address || ""}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
								className="w-full pl-10 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
								placeholder="Rua, número, bairro (ou ponto de referência)"
							/>
						</div>
					</div>

					{/* Horário - CRÍTICO */}
					<div className="space-y-2">
						<label
							htmlFor="org-hours"
							className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2"
						>
							<Clock size={14} className="text-yellow-400" />
							Horário de "Portas Abertas" * (A fome tem hora)
						</label>
						<input
							id="org-hours"
							required
							value={formData.operatingHours || ""}
							onChange={(e) =>
								setFormData({ ...formData, operatingHours: e.target.value })
							}
							className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
							placeholder="Ex: Seg-Sex 12h-14h / Sábados 18h-20h"
						/>
					</div>

					{/* Serviços */}
					<div className="space-y-3">
						<p className="text-xs font-bold uppercase tracking-wider text-slate-500">
							Serviços Oferecidos *
						</p>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							{SERVICE_OPTIONS.map((svc) => (
								<button
									key={svc.value}
									type="button"
									onClick={() => handleServiceToggle(svc.value)}
									className={`p-3 rounded-lg border text-xs font-bold transition-all ${
										formData.services?.includes(svc.value)
											? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50"
											: "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"
									}`}
								>
									{svc.label}
								</button>
							))}
						</div>
					</div>

					{/* ODS - OBRIGATÓRIO */}
					<div className="space-y-4 pt-4 border-t border-slate-800">
						<div className="flex items-center gap-2">
							<Target className="w-5 h-5 text-purple-400" />
							<p className="text-sm font-bold text-white">
								Vínculo com Metas ODS (Obrigatório)
							</p>
						</div>
						<p className="text-xs text-slate-400">
							Marque quais objetivos da ONU sua organização ajuda a cumprir.
							Isso gera dados para a auditoria social.
						</p>
						<div className="space-y-2">
							{ODS_OPTIONS.map((ods) => (
								<button
									key={ods.value}
									type="button"
									onClick={() => handleODSToggle(ods.value)}
									className={`w-full p-4 rounded-lg border text-left transition-all ${
										formData.odsLinks?.includes(ods.value)
											? ods.color +
												" ring-2 ring-offset-2 ring-offset-slate-950 ring-white/20"
											: "bg-slate-900 border-slate-800 hover:border-slate-600"
									}`}
								>
									<div className="font-bold text-sm mb-1">
										{formData.odsLinks?.includes(ods.value) ? "✓ " : "○ "}
										{ods.label}
									</div>
									<div className="text-xs text-slate-400">
										{ods.description}
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Descrição */}
					<div className="space-y-2">
						<label
							htmlFor="org-desc"
							className="text-xs font-bold uppercase tracking-wider text-slate-500"
						>
							Descrição Curta
						</label>
						<textarea
							id="org-desc"
							className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
							placeholder="Descreva brevemente como a organização atua..."
							value={formData.description || ""}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
						/>
					</div>

					<button
						type="submit"
						disabled={loading || (formData.odsLinks?.length || 0) === 0}
						className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/20"
					>
						{loading ? (
							"Salvando..."
						) : (
							<>
								<Save className="w-5 h-5" /> Registrar no Censo da Solidariedade
							</>
						)}
					</button>

					{(formData.odsLinks?.length || 0) === 0 && (
						<p className="text-center text-xs text-yellow-500">
							⚠️ Selecione pelo menos um ODS para continuar
						</p>
					)}
				</form>

				{/* Lista de Parceiros */}
				{partnersList.length > 0 && (
					<div className="mt-12 pt-8 border-t border-slate-800">
						<h3 className="text-slate-500 text-xs font-bold uppercase mb-4">
							Organizações Locais ({partnersList.length})
						</h3>
						<div className="space-y-3">
							{partnersList.map((p) => (
								<div
									key={p.id}
									className="bg-slate-900 p-4 rounded-lg border border-slate-800"
								>
									<div className="flex justify-between items-start">
										<div>
											<h4 className="font-bold text-white">{p.name}</h4>
											<p className="text-xs text-slate-500">
												{p.type} • {p.address}
											</p>
											{p.odsLinks && (
												<div className="flex gap-1 mt-2 flex-wrap">
													{p.odsLinks.map((ods) => (
														<span
															key={ods}
															className="text-[10px] px-2 py-0.5 bg-purple-900/50 text-purple-300 rounded"
														>
															{ods.replace("_", " ")}
														</span>
													))}
												</div>
											)}
										</div>
										<span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
											Pendente
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
