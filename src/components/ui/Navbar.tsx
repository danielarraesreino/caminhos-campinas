import {
	BarChart,
	BookOpen,
	ChevronDown,
	Database,
	Gamepad,
	HeartHandshake,
	MapPin,
	Menu,
	Newspaper,
	Search,
	Settings,
	ShieldAlert,
	Users,
	Wifi,
	WifiOff,
	X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SyncButton } from "@/components/ui/SyncButton";

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setIsOnline(navigator.onLine);
			const handleOnline = () => setIsOnline(true);
			const handleOffline = () => setIsOnline(false);
			window.addEventListener("online", handleOnline);
			window.addEventListener("offline", handleOffline);
			return () => {
				window.removeEventListener("online", handleOnline);
				window.removeEventListener("offline", handleOffline);
			};
		}
	}, []);

	// Navigation groups based on the 4 proposed pillars
	const sections = [
		{
			id: "survival",
			label: "Sobrevivência",
			icon: <ShieldAlert className="w-4 h-4" />,
			links: [
				{
					href: "/recursos",
					label: "Guia de Rua",
					icon: <MapPin className="w-4 h-4" />,
					color: "text-yellow-400",
				},
				{
					href: "/educacao",
					label: "Educação",
					icon: <BookOpen className="w-4 h-4" />,
				},
				{
					href: "/cofre",
					label: "Meu Cofre",
					icon: <Database className="w-4 h-4" />,
				},
			],
		},
		{
			id: "audit",
			label: "Auditoria",
			icon: <BarChart className="w-4 h-4" />,
			links: [
				{
					href: "/transparencia",
					label: "Transparência",
					icon: <Search className="w-4 h-4" />,
				},
				{
					href: "/impacto",
					label: "O Abismo",
					icon: <BarChart className="w-4 h-4" />,
				},
			],
		},
		{
			id: "voice",
			label: "Voz & Ação",
			icon: <Newspaper className="w-4 h-4" />,
			links: [
				{
					href: "/jornal",
					label: "Jornal da Rua",
					icon: <Newspaper className="w-4 h-4" />,
				},
				{
					href: "/sugerir",
					label: "Sugerir História",
					icon: <Users className="w-4 h-4" />,
				},
			],
		},
		{
			id: "network",
			label: "Rede",
			icon: <HeartHandshake className="w-4 h-4" />,
			links: [
				{
					href: "/hub",
					label: "Parceiros",
					icon: <HeartHandshake className="w-4 h-4" />,
				},
				{
					href: "/curso",
					label: "Formação",
					icon: <Gamepad className="w-4 h-4" />,
				},
			],
		},
	];

	const devLinks = [
		{
			href: "/test-features",
			label: "Validation Lab",
			icon: <Settings className="w-3 h-3" />,
		},
		{
			href: "/auditoria/validar",
			label: "Validar Dados",
			icon: <ShieldAlert className="w-3 h-3" />,
		},
		{
			href: "/jornal/submeter",
			label: "CMS Jornal",
			icon: <Newspaper className="w-3 h-3" />,
		},
		{
			href: "/hub/cadastro",
			label: "Cadastro ONG",
			icon: <HeartHandshake className="w-3 h-3" />,
		},
	];

	return (
		<nav
			className="fixed top-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-xl border-b border-zinc-800/50"
			aria-label="Navegação Principal"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* 1. BRANDING */}
					<Link
						href="/"
						className="flex items-center gap-3 group shrink-0"
						aria-label="Voltar para a página inicial do Caminhos Campinas"
					>
						<div className="relative group-hover:scale-105 transition-transform duration-300">
							<div className="absolute -inset-2 bg-yellow-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
							<img
								src="/logo-cropped.png"
								alt="Logo Caminhos Campinas"
								className="w-12 h-12 object-contain relative z-10"
							/>
						</div>
					</Link>

					{/* 2. DESKTOP MENU */}
					<div className="hidden lg:flex items-center gap-2">
						<Link href="/jogar">
							<Button className="bg-yellow-600 hover:bg-yellow-500 text-black font-black uppercase tracking-widest text-[10px] h-10 px-8 rounded-xl mr-4 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
								Intervir
							</Button>
						</Link>

						<div className="h-6 w-px bg-zinc-800 mx-2" />

						{sections.slice(0, 3).map((section) => (
							<div key={section.id} className="relative group">
								<button
									type="button"
									aria-label={`Abrir menu de sub-seções para ${section.label}`}
									aria-expanded="false"
									className="flex items-center gap-2 text-zinc-400 hover:text-white px-3 py-3 min-h-[44px] rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
								>
									{section.label}
									<ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" />
								</button>
								<div className="absolute top-full left-0 mt-1 w-56 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
									{section.links.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											className={`flex items-center gap-3 px-4 py-3 min-h-[40px] text-xs font-bold ${link.color || "text-zinc-400"} hover:bg-zinc-900 hover:text-white transition-colors`}
											aria-label={`Ir para ${link.label}`}
										>
											{link.icon}
											{link.label}
										</Link>
									))}
								</div>
							</div>
						))}

						<div className="h-10 w-px bg-zinc-800 mx-4" />

						{/* REDE CTA */}
						<Link href="/hub">
							<Button
								variant="ghost"
								size="sm"
								className="text-zinc-400 hover:text-white uppercase tracking-widest text-[9px] font-bold gap-2"
							>
								<HeartHandshake className="w-4 h-4" /> Rede
							</Button>
						</Link>

						<SyncButton />

						{/* CONTROLE DROP DOWN */}
						<div className="relative group">
							<Button
								variant="ghost"
								size="icon"
								className="text-zinc-400 hover:text-yellow-500 hover:bg-zinc-900 rounded-xl h-10 w-10"
								aria-label="Configurações e Centro de Controle"
							>
								<Settings className="w-4 h-4" />
							</Button>
							<div className="absolute top-full right-0 mt-1 w-64 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
								<div className="px-4 py-2 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-900 mb-1">
									Centro de Controle (Lab)
								</div>
								{devLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
									>
										{link.icon}
										{link.label}
									</Link>
								))}
								<button
									type="button"
									onClick={async () => {
										const { telemetry } = await import(
											"@/services/TelemetryService"
										);
										telemetry.exportTelemetryToJson();
									}}
									className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-black text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border-t border-zinc-900 mt-1"
								>
									<Database className="w-4 h-4" /> Export (.json)
								</button>
							</div>
						</div>

						{/* STATUS INDICATOR */}
						<div
							className={`ml-2 p-2 rounded-xl transition-colors ${isOnline ? "text-green-500/30" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}
						>
							{isOnline ? (
								<Wifi className="w-4 h-4" />
							) : (
								<WifiOff className="w-4 h-4 animate-pulse" />
							)}
						</div>
					</div>

					{/* 3. MOBILE MENU BUTTON */}
					<div className="flex lg:hidden items-center gap-4">
						{!isOnline && (
							<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest">
								Offline
							</div>
						)}
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
							aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
						>
							{isOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* 4. MOBILE MENU (Drawer) */}
			{isOpen && (
				<div className="lg:hidden bg-black border-t border-zinc-900 h-screen overflow-y-auto pb-32 animate-in slide-in-from-top-2">
					<div className="px-6 py-8 space-y-8">
						<Link
							href="/jogar"
							onClick={() => setIsOpen(false)}
							className="block"
						>
							<Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-7 text-lg font-black uppercase tracking-[0.2em] rounded-2xl">
								Iniciar Intervenção
							</Button>
						</Link>

						{sections.map((section) => (
							<div key={section.id} className="space-y-3">
								<p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-2">
									{section.label}
								</p>
								<div className="grid grid-cols-1 gap-1">
									{section.links.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											onClick={() => setIsOpen(false)}
											className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-bold transition-all ${
												link.color
													? "bg-yellow-500/5 text-yellow-500 border border-yellow-500/10"
													: "text-zinc-300 bg-zinc-900/40 border border-zinc-800/50"
											}`}
										>
											<div className="p-2 bg-black rounded-lg border border-zinc-800">
												{link.icon}
											</div>
											{link.label}
										</Link>
									))}
								</div>
							</div>
						))}

						<div className="pt-4 space-y-4">
							<Link href="/apoie" onClick={() => setIsOpen(false)}>
								<Button
									variant="outline"
									className="w-full border-zinc-800 py-6 text-zinc-400 text-sm font-black uppercase tracking-widest"
								>
									Apoie a Causa
								</Button>
							</Link>
							<div className="flex justify-center">
								<SyncButton />
							</div>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
