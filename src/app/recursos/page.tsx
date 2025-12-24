"use client";

import {
	AlertTriangle,
	BedDouble,
	FileText,
	MapPin,
	Phone,
	RefreshCw,
	Search,
	ShowerHead,
	Utensils,
} from "lucide-react"; // Updated icons for survival needs
import { useEffect, useState } from "react";
import { type ServiceType, useServices } from "@/contexts/ServicesContext";

export default function ResourcesPage() {
	const { services, loading, refreshServices, filterServices } = useServices();
	const [activeCategory, setActiveCategory] = useState<ServiceType | "all">(
		"all",
	);
	const [isOffline, setIsOffline] = useState(false);

	// Maslow Categories for Quick Access
	// Maslow Categories for Quick Access
	const categories = [
		{
			id: "food",
			label: "Alimentação",
			icon: <Utensils className="w-6 h-6" />,
			color: "bg-orange-500",
			type: "food",
		},
		{
			id: "health",
			label: "Saúde",
			icon: <RefreshCw className="w-6 h-6" />,
			color: "bg-red-500",
			type: "health",
		},
		{
			id: "hygiene",
			label: "Higiene",
			icon: <ShowerHead className="w-6 h-6" />,
			color: "bg-cyan-500",
			type: "hygiene",
		},
		{
			id: "shelter",
			label: "Dormir",
			icon: <BedDouble className="w-6 h-6" />,
			color: "bg-indigo-500",
			type: "shelter",
		},
		{
			id: "assistance",
			label: "Documentos",
			icon: <FileText className="w-6 h-6" />,
			color: "bg-emerald-500",
			type: "assistance",
		},
	];

	// Monitor Online Status
	useEffect(() => {
		setIsOffline(!navigator.onLine);
		window.addEventListener("online", () => setIsOffline(false));
		window.addEventListener("offline", () => setIsOffline(true));
		return () => {
			window.removeEventListener("online", () => setIsOffline(false));
			window.removeEventListener("offline", () => setIsOffline(true));
		};
	}, []);

	// Filter Logic
	const displayedServices =
		activeCategory === "all"
			? services
			: filterServices(activeCategory as ServiceType);

	return (
		<div className="min-h-screen bg-black font-sans text-white pb-24 pt-4 px-4">
			{/* High Contrast Header */}
			<header className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
				<div>
					<h1 className="text-3xl font-black text-yellow-400 uppercase tracking-tighter">
						Guia de Rua
					</h1>
					<p className="text-zinc-400 text-sm">
						{isOffline ? (
							<span className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
								<AlertTriangle className="w-4 h-4" /> MODO OFFLINE
							</span>
						) : (
							<span className="flex items-center gap-2 text-green-500 text-xs">
								<span className="w-2 h-2 bg-green-500 rounded-full"></span>{" "}
								Conectado
							</span>
						)}
					</p>
				</div>
				<button
					type="button"
					onClick={() => refreshServices()}
					className="p-3 bg-zinc-900 rounded-full active:bg-zinc-800 transition-colors"
					aria-label="Atualizar lista"
				>
					<RefreshCw
						className={`w-6 h-6 text-zinc-400 ${loading ? "animate-spin" : ""}`}
					/>
				</button>
			</header>

			{/* Maslow Buttons (Big Targets) */}
			<div className="grid grid-cols-2 gap-3 mb-8">
				{categories.map((cat) => (
					<button
						type="button"
						key={cat.id}
						onClick={() => setActiveCategory(cat.type as ServiceType)}
						className={`
							p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95
							${activeCategory === cat.type ? `${cat.color} text-white ring-4 ring-white/20` : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"}
						`}
					>
						<div
							className={`${activeCategory === cat.type ? "text-white" : "text-zinc-500"}`}
						>
							{cat.icon}
						</div>
						<span className="font-bold text-lg uppercase tracking-wide">
							{cat.label}
						</span>
					</button>
				))}
			</div>

			{/* Emergency Banner */}
			<div className="bg-red-900/40 border border-red-500/30 rounded-xl p-4 mb-8 flex items-center justify-between">
				<div>
					<h3 className="text-red-400 font-bold uppercase text-sm">
						Emergência Médica?
					</h3>
					<p className="text-white font-black text-2xl">Ligue 192</p>
				</div>
				<a
					href="tel:192"
					className="bg-red-600 text-white p-3 rounded-full animate-pulse"
					aria-label="Ligar para emergência 192"
				>
					<Phone className="w-6 h-6" />
				</a>
			</div>

			{/* Filter Status */}
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-zinc-400 font-medium">
					{activeCategory === "all"
						? "Todos os recursos"
						: `Exibindo: ${activeCategory}`}
				</h2>
				<span className="bg-zinc-900 px-3 py-1 rounded-full text-xs font-mono text-zinc-500">
					{displayedServices.length} locais
				</span>
			</div>

			{/* List */}
			<div className="space-y-3">
				{loading ? (
					<p className="text-center text-zinc-500 py-10">
						Carregando mapa de sobrevivência...
					</p>
				) : displayedServices.length > 0 ? (
					displayedServices.map((service) => (
						<div
							key={service.id}
							className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 active:bg-zinc-800 transition-colors"
						>
							<div className="flex justify-between items-start mb-2">
								<h3 className="font-bold text-xl text-white leading-tight">
									{service.name}
								</h3>
								<span
									className={`
									px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider
									${
										service.type === "food"
											? "bg-orange-900 text-orange-400"
											: service.type === "shelter"
												? "bg-indigo-900 text-indigo-400"
												: service.type === "health"
													? "bg-red-900 text-red-400"
													: "bg-slate-800 text-slate-400"
									}
								`}
								>
									{service.type}
								</span>
							</div>

							<div className="flex items-start gap-2 text-zinc-400 mb-3">
								<MapPin className="w-4 h-4 shrink-0 mt-1" />
								<p className="text-sm leading-relaxed">
									{service.address || "Endereço não informado"}
								</p>
							</div>

							{service.opening_hours && (
								<p className="text-xs text-zinc-500 font-mono mb-2 bg-black/30 w-fit px-2 py-1 rounded">
									🕒 {service.opening_hours}
								</p>
							)}

							{service.requirements && service.requirements.length > 0 && (
								<div className="mb-2 flex flex-wrap gap-1">
									{service.requirements.map((req, idx) => (
										<span
											key={`${idx}-${req}`}
											className="text-[10px] bg-red-900/40 text-red-200 border border-red-900/50 px-2 py-0.5 rounded uppercase font-bold"
										>
											Exige: {req}
										</span>
									))}
								</div>
							)}

							{service.rules && (
								<div className="mb-3 p-2 bg-yellow-900/10 border border-yellow-700/30 rounded text-xs text-yellow-200/80 italic">
									<p>💡 Dica: {service.rules}</p>
								</div>
							)}

							<button
								type="button"
								onClick={() => {
									const url = `https://www.google.com/maps/dir/?api=1&destination=${service.coords[0]},${service.coords[1]}`;
									window.open(url, "_blank");
								}}
								className="w-full bg-zinc-800 border border-zinc-700 text-white py-3 rounded-lg font-bold text-sm uppercase flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
							>
								<MapPin className="w-4 h-4" />
								Ver no Mapa
							</button>
						</div>
					))
				) : (
					<div className="text-center py-10 opacity-50">
						<Search className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
						<p>Nenhum serviço encontrado nesta categoria.</p>
						<button
							type="button"
							onClick={() => setActiveCategory("all")}
							className="mt-4 text-yellow-500 underline text-sm"
						>
							Ver tudo
						</button>
					</div>
				)}
			</div>

			{/* Mapa do Site / Navegação Completa */}
			<div className="mt-16 pt-8 border-t border-zinc-800">
				<h2 className="text-2xl font-black text-blue-500 uppercase tracking-tighter mb-6">
					Navegação do Site
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<a
						href="/"
						className="block bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group"
					>
						<h3 className="text-white font-bold group-hover:text-blue-400">
							🏠 Início
						</h3>
						<p className="text-zinc-500 text-xs mt-1">
							Página inicial e apresentação do projeto
						</p>
					</a>
					<a
						href="/jogar"
						className="block bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group"
					>
						<h3 className="text-white font-bold group-hover:text-blue-400">
							🎮 Simulador
						</h3>
						<p className="text-zinc-500 text-xs mt-1">
							Jogue o simulador de sobrevivência
						</p>
					</a>
					<a
						href="/impacto"
						className="block bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group"
					>
						<h3 className="text-white font-bold group-hover:text-blue-400">
							📊 Dados de Impacto
						</h3>
						<p className="text-zinc-500 text-xs mt-1">
							Dashboard de dados abertos e telemetria
						</p>
					</a>
					<a
						href="/sobre"
						className="block bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group"
					>
						<h3 className="text-white font-bold group-hover:text-blue-400">
							ℹ️ Sobre
						</h3>
						<p className="text-zinc-500 text-xs mt-1">
							Conceito, equipe e metodologia
						</p>
					</a>
					<a
						href="/apoie"
						className="block bg-blue-900/10 border border-blue-500/30 p-4 rounded-xl hover:bg-blue-900/20 transition-colors group"
					>
						<h3 className="text-blue-400 font-bold group-hover:text-blue-300">
							🤝 Apoie
						</h3>
						<p className="text-zinc-500 text-xs mt-1">
							Saiba como contribuir com a causa
						</p>
					</a>
				</div>
			</div>
		</div>
	);
}
