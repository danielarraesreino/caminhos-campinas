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
import { useEffect, useMemo, useState } from "react";
import { AudioReader } from "@/components/ui/AudioReader";
import { useGameContext } from "@/contexts/GameContext";
import {
	type ServiceLocation,
	type ServiceType,
	useServices,
} from "@/contexts/ServicesContext";
import { VoiceInput } from "@/features/ui/VoiceInput";

function ServiceCard({ service }: { service: ServiceLocation }) {
	const { documents, modifyStat } = useGameContext();
	const { coords: _coords } = service;
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

	// Check forbidden items
	const { workTool, inventory } = useGameContext();
	const forbiddenViolations =
		service.forbidden_items?.filter((item: string) => {
			// Check if it matches worktool
			if (
				item === "Carrinho de Reciclagem" &&
				workTool?.type === "CARRINHO_RECICLAGEM"
			) {
				return true;
			}
			// Check inventory
			// biome-ignore lint/suspicious/noExplicitAny: Context is loosely typed
			if (inventory.some((i: any) => i.name === item)) return true;
			return false;
		}) || [];

	const canEnroll =
		missingreqs.length === 0 && forbiddenViolations.length === 0;

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

	const isEducation = false; // "educacao" removed from ServiceType, handled as ASSISTENCIA generally or via specific ID checking if needed.
	// We can check category if we want specific styling for education
	const _isEducationStyle =
		service.type === "EDUCACAO" ||
		service.type === "DOCUMENTS" ||
		service.category === "Qualificação Profissional" ||
		service.category === "Geração de Renda";

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
					${
						service.type === "ALIMENTACAO"
							? "bg-orange-900 text-orange-400"
							: service.type === "ABRIGO"
								? "bg-indigo-900 text-indigo-400"
								: service.type === "SAUDE"
									? "bg-red-900 text-red-400"
									: service.type === "EDUCACAO"
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
						R$ {service.effects?.money},00
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

			{/* Forbidden Items Warning */}
			{service.forbidden_items && service.forbidden_items.length > 0 && (
				<div className="mb-4 space-y-2">
					{service.forbidden_items.map((item: string, _idx: number) => {
						const isViolated = forbiddenViolations.includes(item);
						if (!isViolated) return null; // Only show if violated? Or show as warning? Usually warnings are good to know beforehand.
						// Let's show only if violated for now to declutter, or always show as restriction.
						// The prompt implies "entrada bloqueada", showing the reason is good.
						return (
							<div
								key={`forbidden-${item}`}
								className="flex items-center gap-2 text-xs font-bold px-2 py-1 rounded border bg-red-950 border-red-900 text-red-500 animate-pulse"
							>
								<AlertTriangle size={12} />
								Proibido: {item}
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
						const localCoords = service.coords;
						if (service.action_type === "link" && service.url) {
							window.open(service.url, "_blank");
						} else if (
							localCoords &&
							Array.isArray(localCoords) &&
							localCoords.length === 2
						) {
							const url = `https://www.google.com/maps/dir/?api=1&destination=${localCoords[0]},${localCoords[1]}`;
							window.open(url, "_blank");
						}
					}}
					className={`flex-1 border text-white py-3 rounded-lg font-bold text-sm uppercase flex items-center justify-center gap-2 transition-colors ${service.action_type === "link" ? "bg-blue-800 border-blue-700 hover:bg-blue-700" : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"}`}
				>
					{service.action_type === "link" ? (
						<>
							<div className="w-4 h-4">🔗</div>
							Acessar Curso
						</>
					) : (
						<>
							<MapPin className="w-4 h-4" />
							Ver Mapa
						</>
					)}
				</button>

				{isEducation && (
					<button
						type="button"
						disabled={!canEnroll || enrollmentStatus !== "idle"}
						onClick={handleEnroll}
						className={`flex-1 text-white py-3 rounded-lg font-bold text-sm uppercase flex items-center justify-center gap-2 transition-colors relative overflow-hidden
							${
								canEnroll
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

				{service.interactionType === "BONDING" && (
					<button
						type="button"
						onClick={() => {
							if (confirm("Conversar com a equipe? (+Sanidade, +Dignidade)")) {
								modifyStat("sanity", 20);
								modifyStat("dignity", 10);
								alert(
									"Você foi acolhido. Alguém ouviu sua história sem julgar. (Sanidade Recuperada)",
								);
							}
						}}
						className="flex-1 bg-pink-900/50 border border-pink-500/30 text-pink-300 py-3 rounded-lg font-bold text-sm uppercase flex items-center justify-center gap-2 hover:bg-pink-900/80 transition-colors"
					>
						❤️ Desabafar
					</button>
				)}
			</div>
		</div>
	);
}

export default function ResourcesPage() {
	const { services, loading, refreshServices } = useServices();
	const [activeCategory, setActiveCategory] = useState<ServiceType | "all">(
		"all",
	);
	const [isOffline, setIsOffline] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// Maslow Categories for Quick Access
	// Maslow Categories for Quick Access
	const categories = [
		{
			id: "food",
			label: "Alimentação",
			icon: <Utensils className="w-6 h-6" />,
			color: "bg-orange-500",
			type: "ALIMENTACAO",
		},
		{
			id: "health",
			label: "Saúde",
			icon: <Phone className="w-6 h-6" />,
			color: "bg-red-500",
			type: "SAUDE",
		},
		{
			id: "hygiene",
			label: "Higiene",
			icon: <ShowerHead className="w-6 h-6" />,
			color: "bg-cyan-500",
			type: "ASSISTENCIA",
		},
		{
			id: "shelter",
			label: "Abrigo",
			icon: <BedDouble className="w-6 h-6" />,
			color: "bg-indigo-500",
			type: "ABRIGO",
		},
		{
			id: "assistance",
			label: "Documentos",
			icon: <FileText className="w-6 h-6" />,
			color: "bg-emerald-500",
			type: "DOCUMENTS",
		},
		{
			id: "education",
			label: "Trabalho",
			icon: <BookOpen className="w-6 h-6" />,
			color: "bg-blue-500",
			type: "EDUCACAO",
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

	// Filter Logic with Search (Fully contained for reliability)
	const displayedServices = useMemo(() => {
		let filtered = [...(services || [])];

		// 1. Filter by category
		if (activeCategory !== "all") {
			filtered = filtered.filter((s) => {
				const isExactMatch = s.type === activeCategory;
				if (isExactMatch) return true;

				// Cross-category checks based on effects (parity with ServicesContext)
				if (activeCategory === "ALIMENTACAO" && (s.effects?.hunger || 0) > 0)
					return true;
				if (activeCategory === "SAUDE" && (s.effects?.health || 0) > 0)
					return true;
				if (
					activeCategory === "ABRIGO" &&
					(s.effects?.energy || 0) > 0 &&
					s.type !== "ABRIGO"
				)
					return true;

				return false;
			});
		}

		// 2. Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			filtered = filtered.filter((s) => {
				const name = s.name?.toLowerCase() || "";
				const address = s.address?.toLowerCase() || "";
				const category = s.category?.toLowerCase() || "";
				// Safely check tags if they exist in the raw data
				const serviceWithTags = s as ServiceLocation & { tags?: string[] };
				const tags = Array.isArray(serviceWithTags.tags)
					? serviceWithTags.tags.join(" ").toLowerCase()
					: "";

				return (
					name.includes(query) ||
					address.includes(query) ||
					category.includes(query) ||
					tags.includes(query)
				);
			});
		}

		return filtered;
	}, [services, activeCategory, searchQuery]);

	// Dynamic Audio Description
	const audioDescription = useMemo(() => {
		if (searchQuery.trim()) {
			const count = displayedServices.length;
			if (count === 0) {
				return `Nenhum resultado encontrado para: ${searchQuery}`;
			}
			const names = displayedServices
				.slice(0, 3)
				.map((s) => s.name)
				.join(", ");
			return `${count} resultado${count > 1 ? "s" : ""} para ${searchQuery}: ${names}${count > 3 ? ` e mais ${count - 3}` : ""}`;
		}

		if (activeCategory === "all") {
			return "Guia de Rua. Recursos de sobrevivência e apoio em Campinas. Alimentação, saúde, higiene, abrigo e documentos.";
		}

		const categoryName =
			categories.find((c) => c.type === activeCategory)?.label ||
			activeCategory;
		const count = displayedServices.length;
		if (count === 0) {
			return `Nenhum serviço de ${categoryName} encontrado.`;
		}
		const names = displayedServices
			.slice(0, 3)
			.map((s) => s.name)
			.join(", ");
		return `${categoryName}. ${count} local${count > 1 ? "is" : ""} encontrado${count > 1 ? "s" : ""}: ${names}${count > 3 ? ` e mais ${count - 3}` : ""}`;
	}, [activeCategory, displayedServices, searchQuery]);

	return (
		<div className="min-h-screen bg-black font-sans text-white pb-24 pt-24 px-4">
			{/* High Contrast Header */}
			<header className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
				<div>
					<h1 className="text-3xl font-black text-yellow-400 uppercase tracking-tighter">
						Guia de Rua
					</h1>
					<div className="flex items-center gap-2">
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
			<div className="sticky top-20 z-30 -mx-4 px-4 py-4 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 mb-6 shadow-xl">
				{/* [NEW] Search Bar with Voice Input */}
				<div className="flex gap-2 mb-4">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
						<input
							type="text"
							placeholder="Buscar serviços..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
						/>
					</div>
					<VoiceInput
						onTranscription={(text) => setSearchQuery(text)}
						disabled={false}
					/>
				</div>

				{/* [NEW] Dynamic Audio Reader */}
				<AudioReader text={audioDescription} />
			</div>

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
					<h2 className="text-red-400 font-bold uppercase text-sm">
						Emergência Médica?
					</h2>
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

			{/* --- Início do Patch: Resgate da Educação --- */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-4">
					<h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
						<span className="text-yellow-500">⚡</span> Formação & Autonomia
					</h2>
				</div>

				<a href="/educacao" className="block group">
					<div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all shadow-lg">
						<div className="flex justify-between items-start">
							<div>
								<h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
									De Sobrevivente a Educador
								</h3>
								<p className="text-slate-400 text-sm mt-2 leading-relaxed">
									Conhecimento é a única coisa que não podem levar no 'rapa'.
									Acesse cursos sobre Direitos Humanos, Redução de Danos e
									Acesso à Renda.
								</p>
							</div>
							<div className="bg-slate-950 p-3 rounded-full group-hover:bg-yellow-500/10 transition-colors">
								{/* Ícone de Capelo/Graduação ou Livro */}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-yellow-500"
									aria-labelledby="svg-edu-title"
								>
									<title id="svg-edu-title">
										Ícone de Educação e Autonomia
									</title>
									<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
									<path d="M6 12v5c3 3 9 3 12 0v-5" />
								</svg>
							</div>
						</div>
						<div className="mt-4 flex items-center text-xs font-medium text-yellow-500 uppercase tracking-wider">
							Acessar Módulos Gratuitos <span className="ml-2">→</span>
						</div>
					</div>
				</a>
			</div>
			{/* --- Fim do Patch --- */}

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
