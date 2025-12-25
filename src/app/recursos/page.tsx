"use client";

import {
	AlertCircle,
	AlertTriangle,
	BedDouble,
	BookOpen,
	CheckCircle2,
	FileText,
	MapPin,
	Phone,
	RefreshCw,
	Search,
	ShowerHead,
	Utensils,
} from "lucide-react"; // Updated icons for survival needs
import { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import {
	type ServiceLocation,
	type ServiceType,
	useServices,
} from "@/contexts/ServicesContext";

function ServiceCard({ service }: { service: ServiceLocation }) {
	const { documents, modifyStat } = useGameContext();
	const [enrollmentStatus, setEnrollmentStatus] = useState<
		"idle" | "enrolling" | "enrolled"
	>("idle");
	const [progress, setProgress] = useState(0);

	// Check requirements
	const missingreqs =
		service.requirements?.filter((req: string) => {
			const r = req.toLowerCase();
			if (r.includes("rg") && !documents.hasRG) return true;
			if (r.includes("cpf") && !documents.hasCPF) return true;
			// Simple check for now
			return false;
		}) || [];

	const canEnroll = missingreqs.length === 0;

	const handleEnroll = () => {
		if (!canEnroll) return;
		setEnrollmentStatus("enrolling");

		// Simulation timer
		let p = 0;
		const timer = setInterval(() => {
			p += 5;
			setProgress(p);
			if (p >= 100) {
				clearInterval(timer);
				setEnrollmentStatus("enrolled");
				// Effect?
			}
		}, 100);
	};

	const isEducation = service.type === "educacao";

	return (
		<div
			className={`bg-zinc-900 border ${isEducation ? "border-blue-900/50" : "border-zinc-800"} rounded-xl p-5 active:bg-zinc-800 transition-colors relative overflow-hidden`}
		>
			{isEducation && (
				<div className="absolute top-0 right-0 p-2">
					<BookOpen className="text-blue-500/20 w-12 h-12 -mr-2 -mt-2" />
				</div>
			)}

			<div className="flex justify-between items-start mb-2 relative z-10">
				<h3 className="font-bold text-xl text-white leading-tight">
					{service.name}
				</h3>
				<span
					className={`
					px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider
					${service.type === "alimentacao"
							? "bg-orange-900 text-orange-400"
							: service.type === "abrigo"
								? "bg-indigo-900 text-indigo-400"
								: service.type === "saude"
									? "bg-red-900 text-red-400"
									: service.type === "educacao"
										? "bg-blue-900 text-blue-400"
										: "bg-slate-800 text-slate-400"
						}
				`}
				>
					{service.type}
				</span>
			</div>

			<div className="flex items-start gap-2 text-zinc-400 mb-3 relative z-10">
				<MapPin className="w-4 h-4 shrink-0 mt-1" />
				<p className="text-sm leading-relaxed">
					{service.address || "Endereço não informado"}
				</p>
			</div>

			{/* Education Specifics */}
			{isEducation && service.effects?.money && (
				<div className="mb-4 bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-lg flex items-center justify-between">
					<span className="text-xs text-emerald-400 font-bold uppercase">
						Bolsa / Renda
					</span>
					<span className="text-emerald-300 font-mono font-bold">
						R$ {service.effects.money},00
					</span>
				</div>
			)}

			{service.opening_hours && (
				<p className="text-xs text-zinc-500 font-mono mb-2 bg-black/30 w-fit px-2 py-1 rounded">
					🕒 {service.opening_hours}
				</p>
			)}

			{/* Requirements Logic */}
			{service.requirements && service.requirements.length > 0 && (
				<div className="mb-4 space-y-2">
					{service.requirements.map((req: string, idx: number) => {
						const isMissing = missingreqs.includes(req);
						return (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: Static requirements list
								key={idx}
								className={`flex items-center gap-2 text-xs font-bold px-2 py-1 rounded border ${isMissing ? "bg-red-900/20 border-red-900/50 text-red-400" : "bg-green-900/20 border-green-900/30 text-green-400"}`}
							>
								{isMissing ? (
									<AlertCircle size={12} />
								) : (
									<CheckCircle2 size={12} />
								)}
								{req} {isMissing && "(Falta)"}
							</div>
						);
					})}
				</div>
			)}

			{service.rules && (
				<div className="mb-3 p-2 bg-yellow-900/10 border border-yellow-700/30 rounded text-xs text-yellow-200/80 italic">
					<p>💡 Dica: {service.rules}</p>
				</div>
			)}

			<div className="flex gap-2 mt-4">
				<button
					type="button"
					onClick={() => {
						const url = `https://www.google.com/maps/dir/?api=1&destination=${service.coords[0]},${service.coords[1]}`;
						window.open(url, "_blank");
					}}
					className="flex-1 bg-zinc-800 border border-zinc-700 text-white py-3 rounded-lg font-bold text-sm uppercase flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
				>
					<MapPin className="w-4 h-4" />
					Ver Mapa
				</button>

				{isEducation && (
					<button
						type="button"
						disabled={!canEnroll || enrollmentStatus !== "idle"}
						onClick={handleEnroll}
						className={`flex-1 text-white py-3 rounded-lg font-bold text-sm uppercase flex items-center justify-center gap-2 transition-colors relative overflow-hidden
							${canEnroll
								? enrollmentStatus === "enrolled"
									? "bg-green-600"
									: "bg-blue-600 hover:bg-blue-500"
								: "bg-zinc-800 opacity-50 cursor-not-allowed"
							}
						`}
					>
						{enrollmentStatus === "enrolling" && (
							<div
								className="absolute left-0 top-0 bottom-0 bg-blue-400/30 transition-all duration-100"
								style={{ width: `${progress}%` }}
							/>
						)}

						{enrollmentStatus === "idle" &&
							(canEnroll ? "Inscrever-se" : "Requisitos")}
						{enrollmentStatus === "enrolling" && `Processando ${progress}%`}
						{enrollmentStatus === "enrolled" && (
							<>
								<CheckCircle2 size={16} /> Inscrito
							</>
						)}
					</button>
				)}
			</div>
		</div>
	);
}

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
			type: "alimentacao",
		},
		{
			id: "health",
			label: "Saúde",
			icon: <RefreshCw className="w-6 h-6" />,
			color: "bg-red-500",
			type: "saude",
		},
		{
			id: "hygiene",
			label: "Higiene",
			icon: <ShowerHead className="w-6 h-6" />,
			color: "bg-cyan-500",
			type: "assistencia", // Hygiene is now under Assistencia (Centro Pop)
		},
		{
			id: "shelter",
			label: "Dormir",
			icon: <BedDouble className="w-6 h-6" />,
			color: "bg-indigo-500",
			type: "abrigo",
		},
		{
			id: "assistance",
			label: "Documentos",
			icon: <FileText className="w-6 h-6" />,
			color: "bg-emerald-500",
			type: "assistencia",
		},
		{
			id: "education",
			label: "Formação",
			icon: <BookOpen className="w-6 h-6" />,
			color: "bg-blue-600",
			type: "educacao",
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
						: `Exibindo: ${categories.find((c) => c.type === activeCategory)?.label || activeCategory}`}
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
						<ServiceCard key={service.id} service={service} />
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
