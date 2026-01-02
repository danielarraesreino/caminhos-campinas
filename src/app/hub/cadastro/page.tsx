"use client";

import { ArrowLeft, Building2, CheckCircle2, MapPin, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Tipagem interna para evitar dependências quebradas
type ServiceType =
	| "ALIMENTACAO"
	| "ABRIGO"
	| "SAUDE"
	| "ASSISTENCIA"
	| "JURIDICO";

interface Partner {
	id: string;
	name: string;
	type: "ONG" | "COLETIVO" | "RELIGIOSO";
	address: string;
	whatsapp: string;
	services: ServiceType[];
	description: string;
}

export default function HubCadastroPage() {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [partnersList, setPartnersList] = useState<Partner[]>([]);

	// Carrega parceiros já cadastrados (Persistência Local)
	useEffect(() => {
		const saved = localStorage.getItem("hub_partners_db");
		if (saved) setPartnersList(JSON.parse(saved));
	}, []);

	const [formData, setFormData] = useState<Partial<Partner>>({
		type: "ONG",
		services: [],
	});

	const handleServiceToggle = (svc: ServiceType) => {
		const current = formData.services || [];
		const updated = current.includes(svc)
			? current.filter((s) => s !== svc)
			: [...current, svc];
		setFormData({ ...formData, services: updated });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Simula delay de rede e salva no LocalStorage
		setTimeout(() => {
			const newPartner = {
				...formData,
				id: crypto.randomUUID(),
				createdAt: Date.now(),
				status: "PENDENTE",
			} as Partner;

			const updatedList = [...partnersList, newPartner];
			localStorage.setItem("hub_partners_db", JSON.stringify(updatedList));
			setPartnersList(updatedList);

			setSuccess(true);
			setLoading(false);
		}, 1000);
	};

	if (success) {
		return (
			<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
				<div className="w-20 h-20 bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 ring-2 ring-emerald-500/50">
					<CheckCircle2 className="w-10 h-10 text-emerald-400" />
				</div>
				<h2 className="text-2xl font-bold text-white mb-2">
					Cadastro Recebido
				</h2>
				<p className="text-slate-400 max-w-md mb-8">
					Sua organização foi registrada localmente no Hub. Em breve, nossa
					equipe fará a validação para inclusão no mapa oficial.
				</p>
				<div className="flex gap-4">
					<button
						onClick={() => {
							setSuccess(false);
							setFormData({ type: "ONG", services: [] });
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
						<button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
							<ArrowLeft className="w-6 h-6 text-slate-400" />
						</button>
					</Link>
					<h1 className="text-xl font-bold flex items-center gap-2">
						<Building2 className="text-blue-400" />
						Hub de Parceiros
					</h1>
				</div>
			</header>

			<main className="max-w-2xl mx-auto p-4 md:p-8 space-y-8">
				<div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-xl">
					<p className="text-sm text-blue-200">
						<strong>Nota:</strong> Este cadastro alimenta a rede de apoio do
						jogo. As informações são vitais para conectar quem precisa a quem
						ajuda.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
							Nome da Organização
						</label>
						<input
							required
							className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
							placeholder="Ex: Coletivo A Rua Tem Voz"
							value={formData.name || ""}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
								Tipo
							</label>
							<select
								className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
								value={formData.type}
								onChange={(e) =>
									setFormData({ ...formData, type: e.target.value as any })
								}
							>
								<option value="ONG">ONG / OSC</option>
								<option value="COLETIVO">Coletivo</option>
								<option value="RELIGIOSO">Instituição Religiosa</option>
							</select>
						</div>
						<div className="space-y-2">
							<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
								WhatsApp
							</label>
							<input
								required
								className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
								placeholder="(19) 99999-9999"
								value={formData.whatsapp || ""}
								onChange={(e) =>
									setFormData({ ...formData, whatsapp: e.target.value })
								}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
							Endereço / Ponto de Referência
						</label>
						<div className="relative">
							<MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
							<input
								required
								className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
								placeholder="Rua, Número, Bairro (Campinas-SP)"
								value={formData.address || ""}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
							/>
						</div>
					</div>

					<div className="space-y-3">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
							Serviços Oferecidos
						</label>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								"ALIMENTACAO",
								"ABRIGO",
								"SAUDE",
								"ASSISTENCIA",
								"JURIDICO",
							].map((svc) => (
								<button
									key={svc}
									type="button"
									onClick={() => handleServiceToggle(svc as ServiceType)}
									className={`p-3 rounded-lg border text-xs font-bold transition-all ${
										formData.services?.includes(svc as ServiceType)
											? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50"
											: "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"
									}`}
								>
									{svc}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
							Descrição Curta
						</label>
						<textarea
							className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
							placeholder="Descreva brevemente como a organização atua e horários..."
							value={formData.description || ""}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/20"
					>
						{loading ? (
							"Salvando..."
						) : (
							<>
								<Save className="w-5 h-5" /> Confirmar Cadastro
							</>
						)}
					</button>
				</form>

				{/* Lista de Parceiros (Visível apenas para DEV/Teste) */}
				{partnersList.length > 0 && (
					<div className="mt-12 pt-8 border-t border-slate-800">
						<h3 className="text-slate-500 text-xs font-bold uppercase mb-4">
							Organizações Locais ({partnersList.length})
						</h3>
						<div className="space-y-3">
							{partnersList.map((p) => (
								<div
									key={p.id}
									className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex justify-between items-center"
								>
									<div>
										<h4 className="font-bold text-white">{p.name}</h4>
										<p className="text-xs text-slate-500">
											{p.type} • {p.address}
										</p>
									</div>
									<span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
										Pendente
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
