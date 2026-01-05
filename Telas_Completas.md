# Compilação das Telas Completas (Frontend)
Gerado automaticamente em dom 04 jan 2026 21:25:10 -03

## src/features/ui/UnifiedDashboard.tsx
```tsx
"use client";

import {
	BookOpen,
	Gamepad2,
	HeartHandshake,
	MapPin,
	Newspaper,
	Shield,
} from "lucide-react";
import Link from "next/link";

export function UnifiedDashboard() {
	return (
		<div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
			{/* Header */}
			<header className="py-8 px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
							Caminhos CPS <span className="text-slate-500 text-sm">| 019</span>
						</h1>
						<p className="text-slate-400 text-xs mt-1">
							Tecnologia Social & Sobrevivência
						</p>
					</div>
					<div className="flex items-center gap-2 text-xs font-mono text-slate-400">
						<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
						SISTEMA ONLINE
					</div>
				</div>
			</header>

			{/* Main Grid */}
			<main className="max-w-6xl mx-auto px-6 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
					{/* Card 1: JOGAR (Hero) */}
					<Link
						href="/jogar"
						className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-blue-500/50 transition-all duration-300 shadow-2xl hover:shadow-blue-900/20 col-span-1 md:col-span-2 lg:col-span-1 aspect-video lg:aspect-auto flex flex-col justify-between"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent group-hover:from-blue-600/20 transition-all"></div>
						<div className="relative z-10">
							<div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-transform">
								<Gamepad2 size={24} />
							</div>
							<h2 className="text-3xl font-black mb-2 uppercase italic tracking-tight">
								Jogar Simulador
							</h2>
							<p className="text-slate-400 max-w-sm">
								Entre na pele de quem vive nas ruas de Campinas. Enfrente
								dilemas reais, sobreviva à burocracia e busque a autonomia.
							</p>
						</div>
						<div className="relative z-10 mt-6 flex items-center gap-2 text-blue-400 font-bold uppercase text-sm tracking-widest">
							Iniciar Jornada{" "}
							<span className="group-hover:translate-x-1 transition-transform">
								→
							</span>
						</div>
					</Link>

					{/* Card 2: BLOG (Informar) */}
					<Link
						href="/jornal"
						className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-purple-900/10 flex flex-col justify-between"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent group-hover:from-purple-600/20 transition-all"></div>
						<div className="relative z-10">
							<div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
								<Newspaper size={20} />
							</div>
							<h2 className="text-xl font-bold mb-2">Jornal da Rua</h2>
							<p className="text-slate-400 text-sm">
								Notícias, denúncias de violência e tradução de leis (Padre
								Júlio, LOAS) para linguagem acessível.
							</p>
						</div>
					</Link>

					{/* Card 3: CURSO (Aprender) */}
					<Link
						href="/curso"
						className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-emerald-500/50 transition-all duration-300 shadow-xl hover:shadow-emerald-900/10 flex flex-col justify-between"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent group-hover:from-emerald-600/20 transition-all"></div>
						<div className="relative z-10">
							<div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
								<BookOpen size={20} />
							</div>
							<h2 className="text-xl font-bold mb-2">Formação</h2>
							<p className="text-slate-400 text-sm">
								Área educativa para Redutores de Danos e Agentes de Saúde.
								Cursos sobre direitos e cidadania.
							</p>
						</div>
					</Link>

					{/* Card 4: HUB (Apoiar) */}
					<Link
						href="/hub"
						className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-pink-500/50 transition-all duration-300 shadow-xl hover:shadow-pink-900/10 flex flex-col justify-between lg:col-span-1"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-transparent group-hover:from-pink-600/20 transition-all"></div>
						<div className="relative z-10">
							<div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
								<HeartHandshake size={20} />
							</div>
							<h2 className="text-xl font-bold mb-2">Rede de Apoio</h2>
							<p className="text-slate-400 text-sm">
								Mapa de ONGs, cadastro de parceiros e recursos para doadores.
								Conecte-se com quem faz a diferença.
							</p>
						</div>
					</Link>
				</div>

				{/* Footer Info */}
				<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-800 pt-8 text-slate-300 text-sm">
					<div>
						<h3 className="font-bold text-slate-100 mb-2 flex items-center gap-2">
							<Shield size={14} /> Dados Seguros
						</h3>
						<p>
							Plataforma em conformidade com LGPD. Seus dados são anônimos e
							focados em impacto social.
						</p>
					</div>
					<div>
						<h3 className="font-bold text-slate-100 mb-2 flex items-center gap-2">
							<MapPin size={14} /> Campinas / SP
						</h3>
						<p>
							Focado na realidade do DDD 019. Dados baseados no Censo Pop Rua
							2024.
						</p>
					</div>
					<div>
						<p className="text-slate-400">Versão 0.19.0 (Beta)</p>
						<p className="text-slate-400">&copy; 2024 Coletivo A Rua Tem Voz</p>
					</div>
				</div>
			</main>
		</div>
	);
}

```

## src/features/ui/LandingPage.tsx
```tsx
import {
	AlertCircle,
	ArrowRight,
	BarChart3,
	Check,
	Copy,
	Cpu,
	Heart,
	Instagram,
	Loader2,
	MapPin,
	Shield,
	Sparkles,
	Target,
	X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { REAL_DILEMMAS } from "@/features/game-loop/dilemmas-real";
import { getAssetUrl } from "@/utils/getAssetUrl";
import { AvatarCreation } from "./AvatarCreation";
import { OnboardingTutorial } from "./OnboardingTutorial";

export default function LandingPage() {
	const router = useRouter();
	// const [isMenuOpen, setIsMenuOpen] = useState(false); // Removed local menu state
	const [copied, setCopied] = useState(false);
	const [currentBgIndex, setCurrentBgIndex] = useState(0);
	const [showTutorial, setShowTutorial] = useState(false);

	const { clearPersistence, resetGame, avatar } = useGameContext();
	const hasSavedGame = !!avatar;

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentBgIndex((prev) => (prev + 1) % 5);
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	// Map State
	const [_showMap, _setShowMap] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [mode, setMode] = useState<"landing" | "creation">("landing");

	const [showResetConfirm, setShowResetConfirm] = useState(false);

	const handleNewGame = async () => {
		// Confirm logic handled in UI now
		await clearPersistence();
		resetGame();

		const seenTutorial = localStorage.getItem("pop_rua_tutorial_seen");
		if (!seenTutorial) {
			setShowTutorial(true);
		} else {
			setMode("creation");
		}
	};

	const handleContinue = () => {
		router.push("/jogar");
	};

	const { data: _session, status } = useSession();

	// Local Dilemma State
	const [aiLoading, setAiLoading] = useState(false);
	const [dilemma, setDilemma] = useState<{
		scenario: string;
		options: string[];
		raw?: any;
	} | null>(null);
	const [aiFeedback, setAiFeedback] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const pixKey = "19999912915";

	const handleCopyPix = () => {
		navigator.clipboard.writeText(pixKey);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const _scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const generateDilemma = async () => {
		setAiLoading(true);
		setError(null);
		setDilemma(null);
		setAiFeedback(null);

		try {
			// Simulate loading for effect
			await new Promise((resolve) => setTimeout(resolve, 1500));

			const dilemmaList =
				REAL_DILEMMAS && REAL_DILEMMAS.length > 0 ? REAL_DILEMMAS : []; // Safety check

			if (dilemmaList.length === 0) {
				throw new Error("Nenhum dilema disponível no censo.");
			}

			const randomDilemma =
				dilemmaList[Math.floor(Math.random() * dilemmaList.length)];

			if (randomDilemma) {
				setDilemma({
					scenario: randomDilemma.description,
					options: randomDilemma.options.map((o: any) => o.label),
					raw: randomDilemma,
				});
			} else {
				throw new Error("Dilema não encontrado");
			}
		} catch (err) {
			console.error(err);
			setError("Erro ao carregar dilema.");
		} finally {
			setAiLoading(false);
		}
	};

	const solveDilemma = async (actionLabel: string) => {
		setAiLoading(true);
		setError(null);

		try {
			// Simulate processing
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const option = dilemma?.raw?.options.find(
				(o: any) => o.label === actionLabel,
			);

			if (option) {
				setAiFeedback(option.consequence);
			} else {
				setAiFeedback("Consequência não encontrada para esta ação.");
			}
		} catch (_err) {
			setError("Erro ao processar ação.");
		} finally {
			setAiLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-900">
			{/* Navigation */}
			{/* Navigation removed - now in global layout */}

			{/* Hero Section - Funnel of Empathy */}
			<section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative overflow-hidden min-h-[90vh] flex items-center">
				{/* Background Texture - Slideshow */}
				<div className="absolute inset-0">
					{["/assets/images/landing-bg.png"].map((img, index) => (
						<div
							key={img}
							className={`absolute inset-0 bg-cover bg-center mix-blend-overlay transition-opacity duration-1000 ${
								currentBgIndex === index ? "opacity-40" : "opacity-40" // Simplified for single image
							}`}
							style={{ backgroundImage: `url(${getAssetUrl(img)})` }}
						/>
					))}
				</div>

				<div className="max-w-7xl mx-auto relative z-10 w-full">
					<div className="lg:flex lg:items-center lg:gap-16">
						{/* Left Column: The Hook */}
						<div className="lg:w-1/2 text-center lg:text-left">
							<div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
								<span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
								<span className="text-blue-200 font-semibold text-xs tracking-widest uppercase">
									Serious Game & Tecnologia Social • Censo 2024
								</span>
							</div>

							<h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.9] mb-8 tracking-tight">
								A Invisibilidade <br />é uma{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
									Escolha?
								</span>
							</h1>

							<p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light border-l-4 border-blue-500/30 pl-6">
								Entre na pele de uma das{" "}
								<strong className="text-white">1.557 pessoas</strong> que vivem
								nas ruas de Campinas (Censo 2024). <br />A principal causa?{" "}
								<strong className="text-white">Conflitos familiares</strong>,
								não "vagabundagem". Transforme sua empatia em impacto real.
							</p>

							{/* Dual Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
								{/* Primary: New Game / Continue */}
								{hasSavedGame ? (
									<>
										<button
											type="button"
											onClick={handleContinue}
											className="group relative px-8 py-5 bg-green-700 hover:bg-green-600 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-green-900/20 overflow-hidden"
										>
											<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
											<span className="relative flex items-center gap-3">
												<ArrowRight className="h-5 w-5" />
												Continuar Jornada
											</span>
										</button>

										<button
											type="button"
											onClick={() => {
												if (showResetConfirm) {
													handleNewGame();
													setShowResetConfirm(false);
												} else {
													setShowResetConfirm(true);
													setTimeout(() => setShowResetConfirm(false), 5000); // Reset after 5s
												}
											}}
											className={`px-6 py-5 border rounded-2xl font-medium text-sm transition-all ${
												showResetConfirm
													? "bg-red-600 border-red-500 text-white animate-pulse"
													: "bg-transparent border-white/20 hover:bg-white/10 text-slate-300"
											}`}
										>
											{showResetConfirm
												? "Confirmar Reset?"
												: "Novo Jogo (Reset)"}
										</button>
									</>
								) : (
									<button
										type="button"
										onClick={handleNewGame}
										className="group relative px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-900/20 overflow-hidden"
									>
										<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
										<span className="relative flex items-center gap-3">
											<ArrowRight className="h-5 w-5" />
											<ArrowRight className="h-5 w-5" />
											Iniciar Jornada (Simulador)
										</span>
									</button>
								)}

								{/* Secondary: Beneficiary (Discrete but Accessible) */}
								<button
									type="button"
									onClick={() => {
										window.location.href = "/recursos";
									}}
									className="px-8 py-5 bg-transparent border border-slate-700 hover:border-yellow-500/50 text-slate-300 hover:text-yellow-400 rounded-2xl font-medium text-lg transition-all flex items-center justify-center gap-3"
								>
									<div className="flex items-center gap-2">
										<div className="bg-yellow-500/20 p-1 rounded">
											<MapPin className="h-5 w-5 text-yellow-500" />
										</div>
										<div className="flex flex-col items-start leading-none">
											<span>Guia de Rua</span>
											<span className="text-[10px] uppercase font-bold text-yellow-500 tracking-wider">
												Acesso Offline
											</span>
										</div>
									</div>
								</button>
							</div>

							<OnboardingTutorial
								isOpen={showTutorial}
								onClose={() => {
									setShowTutorial(false);
									setMode("creation");
								}}
							/>

							<div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-xs font-mono text-slate-400 opacity-80">
								<span>v0.1.0 Beta</span>
								<span>•</span>
								<span>Campinas, SP</span>
							</div>
						</div>

						{/* Right Column: Visual Proof (Avatar Showcase) */}
						<div className="lg:w-1/2 mt-16 lg:mt-0 relative">
							{mode === "creation" ? (
								<AvatarCreation
									onComplete={() => {
										window.location.href = "/jogar";
									}}
									onBack={() => setMode("landing")}
								/>
							) : (
								<div className="relative">
									{/* Decorative Elements around visual */}
									<div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
									<div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

									<div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-1 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
										<div className="relative rounded-xl overflow-hidden aspect-[4/3] group">
											<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
											{/* Placeholder for Dynamic Avatar Visual - reusing existing logic visually */}
											{/* Placeholder for Dynamic Avatar Visual - CSS City Illustration */}
											<div className="absolute inset-0 bg-slate-900 overflow-hidden">
												{/* Moon/Streetlight */}
												<div className="absolute top-8 right-12 w-16 h-16 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
												<div className="absolute top-10 right-14 w-12 h-12 bg-white rounded-full opacity-10"></div>

												{/* City Skyline Silhouette (CSS) */}
												<div className="absolute bottom-0 left-0 right-0 h-32 bg-slate-950 z-10 flex items-end">
													<div className="w-8 h-16 bg-slate-800 mx-1"></div>
													<div className="w-12 h-24 bg-slate-800 mx-1"></div>
													<div className="w-10 h-10 bg-slate-800 mx-1"></div>
													<div className="w-16 h-32 bg-slate-800 mx-1 relative">
														<div className="absolute top-2 left-2 w-1 h-1 bg-yellow-500 animate-pulse"></div>
														<div className="absolute top-6 right-2 w-1 h-1 bg-yellow-500 animate-pulse delay-75"></div>
													</div>
													<div className="w-6 h-12 bg-slate-800 mx-1"></div>
													<div className="w-20 h-20 bg-slate-800 mx-1"></div>
												</div>

												{/* Character Silhouette */}
												<div className="absolute bottom-0 left-12 z-20 w-8 h-16 bg-black rounded-t-full opacity-80 backdrop-blur-sm transform scale-150"></div>
												<div className="absolute bottom-4 left-16 z-20 w-12 h-8 bg-black rounded-lg transform rotate-12 opacity-80"></div>

												{/* Data Rain / Matrix Effect */}
												<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5 animate-pulse"></div>
											</div>

											{/* Dynamic Text Overlay */}
											<div className="absolute bottom-6 left-6 right-6 z-20">
												<div className="bg-black/50 backdrop-blur-md rounded-lg p-4 border border-white/10">
													<p className="text-white font-medium italic">
														"A cor da pele, o gênero e o tempo de rua alteram a
														dificuldade do jogo. Assim como na vida."
													</p>
													<div className="mt-3 flex items-center gap-2">
														<div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
														<span className="text-xs text-green-400 font-bold uppercase">
															Simulação Baseada em Dados
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			<section
				id="projeto"
				className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20"
			>
				<div className="flex flex-col lg:flex-row gap-16 items-center">
					<div className="lg:w-1/2 space-y-8">
						<div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest">
							Fundamentação Teórica
						</div>
						<h2 className="text-4xl font-black text-slate-900 leading-tight">
							Denunciar a Brutalidade. <br />
							Legitimar o Pertencimento.
						</h2>
						<p className="text-xl text-slate-600 leading-relaxed font-sans">
							Segundo o <strong>Censo 2024</strong>,{" "}
							<strong>1.557 pessoas</strong> vivem nas ruas de Campinas. A
							principal causa não é o vício, mas os{" "}
							<strong>conflitos familiares</strong> (38%). Nosso projeto atua na
							intersecção entre essa realidade dura e a consciência libertadora
							de
							<strong>Paulo Freire</strong>, transformando estatística em
							sujeito político.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
							<div className="space-y-2">
								<h3 className="font-black text-slate-900 uppercase tracking-tight">
									Combate à Fome (ODS 2)
								</h3>
								<p className="text-sm text-slate-600">
									Mapeamento em tempo real de onde falta comida.
								</p>
							</div>
							<div className="space-y-2">
								<h3 className="font-black text-slate-900 uppercase tracking-tight">
									Igualdade Racial (ODS 18)
								</h3>
								<p className="text-sm text-slate-600">
									Foco na população negra (67%), a mais afetada pela exclusão.
								</p>
							</div>
						</div>
					</div>
					<div className="lg:w-1/2 bg-[#0c0c0f] p-10 rounded-[40px] shadow-2xl border border-slate-800 text-white space-y-8 relative overflow-hidden">
						<div className="absolute top-0 right-0 p-8 opacity-5">
							<BarChart3 className="w-64 h-64" />
						</div>
						<h3 className="text-2xl font-black italic uppercase tracking-tighter">
							Portal de Inteligência Social (ESG)
						</h3>
						<p className="text-slate-300 font-sans">
							Não vendemos dados. Geramos evidências. Nossa plataforma monitora
							"Gaps de Serviço" e "Violações de Direitos" em tempo real.
							Transformamos a jogabilidade em relatórios auditáveis para os ODS
							1 (Pobreza), 10 (Desigualdades), 11 (Cidades) e 18 (Igualdade
							Racial).
						</p>
						<button
							type="button"
							onClick={() => {
								window.location.href = "/impacto";
							}}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
						>
							Acessar Dashboard de Impacto <ArrowRight size={20} />
						</button>
						<p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-[0.2em]">
							Dados processados via Protocolo Anti-Chacina (K-5)
						</p>
					</div>
				</div>

				<div className="grid md:grid-cols-2 gap-12 items-center pt-20 border-t border-slate-200">
					<div className="space-y-8">
						<div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 hover:border-blue-200 transition-all group">
							<div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 border border-red-200 group-hover:scale-110 transition-transform">
								<Target className="h-7 w-7 text-red-600" />
							</div>
							<h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">
								Para a Rua (Utilidade)
							</h3>
							<p className="text-slate-600 font-sans leading-relaxed">
								Uma bússola de sobrevivência "Offline-First". Funciona sem
								internet para localizar o Bom Prato, banheiros e tomadas de
								energia, garantindo o direito à cidade mesmo sem plano de dados.
							</p>
						</div>
						<div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 hover:border-pink-200 transition-all group">
							<div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 border border-pink-200 group-hover:scale-110 transition-transform">
								<Heart className="h-7 w-7 text-pink-600" />
							</div>
							<h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">
								Para a Sociedade (Simulador)
							</h3>
							<p className="text-slate-600 font-sans leading-relaxed">
								O jogo combate o estigma da "vadiagem". Você sentirá na pele o
								"Dilema do SAMIM": escolher entre um bico de R$ 20,00 ou
								garantir a entrada no abrigo até as 19h?
							</p>
						</div>
					</div>

					<div className="bg-slate-100 rounded-3xl p-8 relative">
						<h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
							Funcionalidades Principais
						</h3>
						<div className="grid grid-cols-1 gap-4">
							<Link
								href="/cofre"
								className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-green-200"
							>
								<Shield className="h-6 w-6 text-green-600 mt-1 shrink-0" />
								<div>
									<h4 className="font-bold text-slate-900 flex items-center gap-2">
										Cofre Digital{" "}
										<span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">
											Novo
										</span>
									</h4>
									<p className="text-sm text-slate-600">
										Armazenamento seguro de documentos digitalizados na nuvem,
										evitando a perda recorrente de RG e CPF.
									</p>
								</div>
							</Link>
							<div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
								<MapPin className="h-6 w-6 text-orange-600 mt-1 shrink-0" />
								<div>
									<h4 className="font-bold text-slate-900">
										Mapa de Calor Solidário
									</h4>
									<p className="text-sm text-slate-600">
										Mostra em tempo real onde há excesso ou falta de doações na
										cidade, otimizando a logística da caridade.
									</p>
								</div>
							</div>
							<div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
								<Cpu className="h-6 w-6 text-purple-600 mt-1 shrink-0" />
								<div>
									<h4 className="font-bold text-slate-900">IA Generativa</h4>
									<p className="text-sm text-slate-600">
										Uso de IA para traduzir "juridiquês" de editais e leis em
										linguagem simples e acessível.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Map Section - NEW */}
			<section
				id="mapa"
				className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden"
			>
				<div
					className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
					style={{
						backgroundImage: `url(${getAssetUrl("placeholder-map.png")})`,
					}}
				></div>
				<div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
					<div className="inline-block bg-green-500/20 border border-green-400/30 rounded-full px-4 py-1.5 mb-6">
						<span className="text-green-300 font-semibold text-sm tracking-wide uppercase">
							Geolocalização Social
						</span>
					</div>
					<h2 className="text-4xl md:text-5xl font-black mb-6">
						Mapa de Apoio <span className="text-blue-500">Campinas</span>
					</h2>
					<p className="text-xl text-slate-300 max-w-3xl mb-12">
						Encontre abrigos, restaurantes populares (Bom Prato), unidades de
						saúde e pontos de Wi-Fi livre em tempo real. Uma cartografia da
						sobrevivência e da solidariedade.
					</p>

					<div className="w-full max-w-5xl aspect-video bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden relative group">
						{/* Placeholder Map Visual */}
						<div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
							<MapPin className="w-16 h-16 text-slate-500 animate-bounce" />
							<span className="ml-4 text-slate-400 font-mono">
								Carregando mapa da região...
							</span>
						</div>
						{/* Visual Mapa CSS (Holographic Style) */}
						<div className="absolute inset-0 bg-slate-900 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity duration-500">
							{/* Grid Base */}
							<div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

							{/* Abstract Roads */}
							<div className="absolute top-[-10%] bottom-[-10%] left-1/3 w-8 bg-slate-800/50 -rotate-12 border-l border-r border-slate-700/30"></div>
							<div className="absolute top-1/2 left-[-10%] right-[-10%] h-6 bg-slate-800/50 rotate-3 border-t border-b border-slate-700/30"></div>

							{/* POI Markers (Animated) */}
							<div className="absolute top-1/3 right-1/4">
								<div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute"></div>
								<div className="w-3 h-3 bg-blue-500 rounded-full relative"></div>
							</div>
							<div className="absolute bottom-1/3 left-1/4">
								<div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute delay-300"></div>
								<div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
							</div>

							{/* Scanline Effect */}
							<div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-full w-full animate-scan"></div>
						</div>

						{/* Overlay CTA */}
						<div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:backdrop-blur-none group-hover:bg-black/10 transition-all">
							<button
								type="button"
								onClick={() => {
									if (status === "authenticated") {
										window.location.href = "/jogar";
									} else {
										setShowLoginModal(true);
									}
								}}
								className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/30 transform hover:scale-105 transition-all flex items-center gap-2"
							>
								<MapPin className="w-5 h-5" />
								Explorar Mapa Interativo no Jogo
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* AI Demo Section - NEW */}
			<section
				id="demo-ia"
				className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 text-white relative overflow-hidden"
			>
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
					<div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl -top-20 -left-20"></div>
					<div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl bottom-0 right-0"></div>
				</div>

				<div className="max-w-4xl mx-auto px-4 relative z-10">
					<div className="text-center mb-10">
						<div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full text-purple-200 text-sm font-bold mb-4">
							<Sparkles className="h-4 w-4" />
							Powered by Groq API (Llama 3.3)
						</div>
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Teste o Simulador de Empatia
						</h2>
						<p className="text-slate-300 max-w-2xl mx-auto">
							Experimente agora uma versão simplificada do nosso motor de
							narrativa. A IA gera um dilema real e reage às suas decisões,
							demonstrando a complexidade da vida nas ruas.
						</p>
					</div>

					<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl min-h-[400px] flex flex-col">
						{!dilemma ? (
							<div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
								<div className="bg-blue-600/20 p-6 rounded-full mb-6">
									<Cpu className="h-12 w-12 text-blue-400" />
								</div>
								<h3 className="text-xl font-bold text-white mb-2">
									Pronto para começar?
								</h3>
								<p className="text-slate-400 mb-8 max-w-sm">
									A IA irá gerar uma situação única baseada em dados reais de
									Campinas.
								</p>
								<button
									type="button"
									onClick={generateDilemma}
									disabled={aiLoading}
									className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{aiLoading ? (
										<span className="flex items-center gap-2">
											<Loader2 className="h-5 w-5 animate-spin" /> Gerando
											Cenário...
										</span>
									) : (
										<>
											<Sparkles className="h-5 w-5" /> ✨ Gerar Dilema Real
										</>
									)}
								</button>
								{error && (
									<div className="mt-4 text-red-300 bg-red-900/20 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
										<AlertCircle className="h-4 w-4" /> {error}
									</div>
								)}
							</div>
						) : (
							<div className="flex-1 flex flex-col animate-fade-in">
								{/* Scenario Header */}
								<div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
										<span className="text-sm font-mono text-green-400">
											GROQ-LIVE-FEED
										</span>
									</div>
									<button
										type="button"
										onClick={() => setDilemma(null)}
										className="text-xs text-slate-400 hover:text-white transition-colors"
									>
										Reiniciar
									</button>
								</div>

								{/* Scenario Text */}
								<div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6 relative">
									<div className="absolute -top-3 left-4 bg-blue-600 text-xs font-bold px-2 py-1 rounded shadow-sm">
										CENÁRIO
									</div>
									<p className="text-lg leading-relaxed text-slate-100 font-medium">
										"{dilemma?.scenario}"
									</p>
								</div>

								{/* Interaction Area */}
								{/* Interaction Area */}
								{!aiFeedback ? (
									<div className="mt-auto space-y-4">
										<p className="text-sm text-slate-400">Escolha sua ação:</p>
										<div className="flex flex-col gap-3">
											{dilemma?.options?.map((option, _idx) => (
												<button
													type="button"
													key={option}
													onClick={() => solveDilemma(option)}
													disabled={aiLoading}
													className="w-full text-left bg-slate-700/50 hover:bg-blue-600/20 hover:border-blue-500 border border-slate-600 p-4 rounded-xl transition-all group"
												>
													<span className="font-bold text-slate-300 group-hover:text-white">
														{option}
													</span>
												</button>
											))}
										</div>
									</div>
								) : (
									<div className="mt-auto animate-fade-in">
										<div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-xl">
											<div className="flex items-center gap-2 mb-3">
												<Sparkles className="h-4 w-4 text-purple-400" />
												<h3 className="font-bold text-purple-300 text-sm">
													CONSEQUÊNCIA
												</h3>
											</div>
											<p className="text-slate-200">{aiFeedback}</p>
											<button
												type="button"
												onClick={() => {
													setDilemma(null);
													setAiFeedback(null);
												}}
												className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm font-medium transition-colors"
											>
												Testar Outro Cenário
											</button>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
					<p className="text-center text-slate-400 text-xs mt-4">
						* As situações são baseadas em dados reais do Censo Pop Rua 2024.
					</p>
				</div>
			</section>

			{/* Tech Section */}
			<section id="tecnologia" className="py-20 bg-slate-50 text-slate-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="lg:flex lg:items-center lg:justify-between gap-12">
						<div className="lg:w-1/2 mb-10 lg:mb-0">
							<h2 className="text-3xl font-bold mb-6 text-slate-900">
								Inovação Social com Custo Eficiente
							</h2>
							<p className="text-slate-600 mb-6 text-lg">
								Diferente de apps tradicionais que custam milhões, construímos
								esta plataforma usando <strong>Inteligência Artificial</strong>{" "}
								como alavanca de autonomia. Eu não sabia programar, mas sabia o
								que precisava ser feito. A tecnologia me deu a liberdade de
								criar.
							</p>
							<ul className="space-y-4">
								<li className="flex items-center gap-3">
									<div className="bg-green-100 p-2 rounded-full">
										<Check className="h-4 w-4 text-green-600" />
									</div>
									<span className="text-slate-700">
										<strong>Autonomia Real:</strong> Orquestrado por quem vive a
										realidade, sem depender de grandes equipes de TI ou
										burocracia.
									</span>
								</li>
								<li className="flex items-center gap-3">
									<div className="bg-green-100 p-2 rounded-full">
										<Check className="h-4 w-4 text-green-600" />
									</div>
									<span className="text-slate-700">
										<strong>Código como Ferramenta de Poder:</strong> A
										tecnologia deve servir para emancipação. Se eu consegui, nós
										conseguimos.
									</span>
								</li>
								<li className="flex items-center gap-3">
									<div className="bg-green-100 p-2 rounded-full">
										<Check className="h-4 w-4 text-green-600" />
									</div>
									<span className="text-slate-700">
										<strong>Acessibilidade Nativa:</strong> Construído para
										rodar em qualquer celular, porque a informação é um direito
										de todos.
									</span>
								</li>
							</ul>
						</div>
						<div className="lg:w-1/2 bg-white border border-slate-200 p-8 rounded-3xl relative overflow-hidden shadow-lg">
							<div className="relative z-10">
								<h3 className="text-2xl font-bold mb-4 text-blue-900">
									Proposta de Valor ESG
								</h3>
								<p className="mb-6 text-slate-600">
									Para empresas parceiras, oferecemos relatórios de impacto
									social baseados em dados reais, alinhados aos ODS da ONU,
									perfeitos para compor balanços de sustentabilidade.
								</p>
								<button
									type="button"
									onClick={() => router.push("/parceiros")}
									className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
								>
									Seja um Parceiro Corporativo
									<ArrowRight className="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Donation Section */}
			<section id="doar" className="py-24 px-4 sm:px-6 lg:px-8 bg-blue-50">
				<div className="max-w-4xl mx-auto text-center">
					<div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-bold text-sm mb-6 uppercase tracking-wider">
						Faça a Diferença
					</div>
					<h2 className="text-4xl font-extrabold text-slate-900 mb-6">
						Ajude a tirar esse projeto do papel
					</h2>
					<p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
						Sua doação financia o desenvolvimento, a infraestrutura de nuvem e
						as ações de campo do Coletivo A Rua Tem Voz.
					</p>

					<div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-blue-100 max-w-lg mx-auto relative overflow-hidden">
						<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

						<h3 className="text-lg font-medium text-slate-700 mb-2">
							Chave PIX (Celular)
						</h3>

						<div className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-xl p-4 mb-6 group hover:border-blue-400 transition-colors">
							<span className="font-mono text-2xl sm:text-3xl font-bold text-slate-800 tracking-wider">
								{pixKey}
							</span>
							<button
								type="button"
								onClick={handleCopyPix}
								className="ml-4 p-2 bg-white rounded-lg shadow-sm hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all"
								title="Copiar Chave"
							>
								{copied ? (
									<Check className="h-6 w-6 text-green-500" />
								) : (
									<Copy className="h-6 w-6" />
								)}
							</button>
						</div>

						{copied && (
							<div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium animate-fade-in-down">
								Copiado!
							</div>
						)}

						<div className="flex flex-col gap-3">
							<button
								type="button"
								onClick={handleCopyPix}
								className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${copied ? "bg-green-600 hover:bg-green-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30"}`}
							>
								{copied ? "Chave Copiada!" : "Copiar Chave PIX"}
							</button>
							<p className="text-xs text-slate-600 mt-2">
								O valor será destinado integralmente ao desenvolvimento do jogo
								e ações do coletivo.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			{/* Footer moved to global layout */}

			{/* Login Modal */}
			{showLoginModal && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
					<div className="bg-white rounded-2xl w-full max-w-sm relative flex flex-col p-8 shadow-2xl overflow-hidden">
						{/* Background Detail */}
						<div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-50 rounded-full"></div>
						<div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-50 rounded-full"></div>

						<button
							type="button"
							onClick={() => setShowLoginModal(false)}
							className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
							title="Fechar"
						>
							<X className="h-5 w-5" />
						</button>

						<div className="relative text-center mb-8">
							<div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
								<MapPin className="h-6 w-6 text-white" />
							</div>
							<h3 className="text-2xl font-bold text-slate-800">
								Boas-vindas!
							</h3>
							<p className="text-slate-600 text-sm mt-1">
								Escolha como deseja iniciar sua jornada.
							</p>
						</div>

						<div className="space-y-4 relative">
							{/* Google Login Removed for Production Simplification
                            <button
								type="button"
								onClick={() => signIn("google", { callbackUrl: "/jogar" })}
								className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-3.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm group"
							>
								<svg
									className="w-5 h-5"
									viewBox="0 0 24 24"
									aria-labelledby="google-icon-title"
									role="img"
								>
									<title id="google-icon-title">Google</title>
									<path
										fill="currentColor"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="currentColor"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="currentColor"
										d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
									/>
									<path
										fill="currentColor"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
									/>
									</svg>
								Entrar com Google
							</button>

							<div className="relative flex items-center justify-center py-2">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-slate-100"></div>
								</div>
								<span className="relative px-3 bg-white text-xs font-bold text-slate-600 uppercase tracking-widest">
									Ou
								</span>
							</div>
                            */}

							<button
								type="button"
								onClick={() => signIn("credentials", { callbackUrl: "/jogar" })}
								className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
							>
								Acesso Anônimo
								<ArrowRight className="h-4 w-4 opacity-50" />
							</button>
							<p className="text-[10px] text-center text-slate-600 mt-4 leading-relaxed">
								Ao entrar, você concorda em utilizar a plataforma para fins
								educativos e de impacto social positivo.
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

```

## src/app/jogar/page.tsx
```tsx
"use client";

import { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { ImpactReport } from "@/features/dashboard/ImpactReport";
import {
	checkGameOver,
	type GameOverResult,
} from "@/features/game-loop/gameOverConditions";
import { useGameLoop } from "@/features/game-loop/useGameLoop";
import { SurvivalMap } from "@/features/survival-map/SurvivalMap";
import { AvatarCreation } from "@/features/ui/AvatarCreation";
import { DilemmaModal } from "@/features/ui/DilemmaModal";
import { EffectsOverlay } from "@/features/ui/EffectsOverlay";
import { GameChat } from "@/features/ui/GameChat";
import { GameHUD } from "@/features/ui/GameHUD";

import { OnboardingTutorial } from "@/features/ui/OnboardingTutorial";
import { useAudioDirector } from "@/hooks/useAudioDirector";
import { useEventEngine } from "@/hooks/useEventEngine";

export default function GamePage() {
	useGameLoop();
	useAudioDirector(); // [NEW] Immersive Audio System
	const { activeDilemma, resolveDilemma, clearActiveDilemma, triggerDilemma } =
		useEventEngine();
	const gameState = useGameContext();
	const { criticalHealth, sanity, resetGame } = gameState;
	const [gameOverResult, setGameOverResult] = useState<GameOverResult | null>(
		null,
	);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [showTutorial, setShowTutorial] = useState(false);

	useEffect(() => {
		// Check if tutorial was seen
		const tutorialSeen = localStorage.getItem("pop_rua_tutorial_seen");
		if (!tutorialSeen) {
			setShowTutorial(true);
			gameState.setPaused(true);
		}
	}, [gameState.setPaused]);

	// Unpause when tutorial closes (only if no dilemma is active)
	useEffect(() => {
		if (!showTutorial && !activeDilemma) {
			gameState.setPaused(false);
		} else if (showTutorial) {
			gameState.setPaused(true);
		}
	}, [showTutorial, activeDilemma, gameState.setPaused]);

	// [FIX] Ensure Chat closes when a Dilemma starts (so the Modal isn't hidden behind the Chat)
	useEffect(() => {
		if (activeDilemma) {
			setIsChatOpen(false);
		}
	}, [activeDilemma]);

	useEffect(() => {
		const result = checkGameOver(gameState);
		if (result.isGameOver && !gameOverResult) {
			setGameOverResult(result);
		}
	}, [gameState, gameOverResult]);

	// Dead state reset check from previous step
	useEffect(() => {
		if (gameState.avatar && (gameState.health <= 0 || gameState.sanity <= 0)) {
			resetGame();
		}
	}, [gameState.avatar, gameState.health, gameState.sanity, resetGame]);

	const handleRestart = () => {
		setGameOverResult(null);
		resetGame();
	};

	if (!gameState.avatar) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
				<AvatarCreation
					onComplete={() => {
						// Avatar is set in context, re-render will show game
					}}
					onBack={() => {
						window.location.href = "/";
					}}
				/>
			</div>
		);
	}

	// Efeitos visuais de degradação (baseado nas regras de design "Realismo Sóbrio") [2]
	const degradationClasses = [
		criticalHealth
			? "grayscale-50 border-[10px] border-red-900/30 ring-inset ring-8 ring-red-900/20"
			: "",
		sanity < 20 ? "blur-[0.5px]" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		// MUDANÇA 1: h-[100dvh] garante que cabe na tela real do celular sem scroll
		<main className="relative w-full h-[100dvh] bg-slate-900 overflow-hidden">
			<OnboardingTutorial
				isOpen={showTutorial}
				onClose={() => setShowTutorial(false)}
			/>

			{/* World Container - applies degradation only to the game world, not UI overlays */}
			<div className={`absolute inset-0 z-0 ${degradationClasses}`}>
				{/* CAMADA 0: Mapa (Fundo) */}
				<div className="absolute inset-0 z-0">
					<SurvivalMap />
				</div>

				{/* CAMADA 40: HUD e Controles (Sobre o mapa, mas sob modais) */}
				{/* O HUD agora encapsula a barra superior e os botões flutuantes */}
				<div className="relative z-40 w-full h-full pointer-events-none">
					<GameHUD
						onToggleChat={() => setIsChatOpen(!isChatOpen)}
						onToggleMenu={() => window.open("/recursos", "_blank")}
					/>
					<EffectsOverlay />
				</div>
			</div>

			{/* CAMADA 50: Modais de Decisão e Chat (Bloqueantes ou Interativos) */}
			{activeDilemma && (
				<DilemmaModal
					dilemma={activeDilemma}
					onResolve={resolveDilemma}
					onClose={clearActiveDilemma}
					onOpenChat={() => setIsChatOpen(true)}
				/>
			)}

			{isChatOpen && (
				<div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="w-full h-[60vh] md:w-[400px] md:h-[500px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 relative">
						<button
							type="button"
							className="absolute top-2 right-2 p-2 z-10 text-slate-400 hover:text-white"
							onClick={() => setIsChatOpen(false)}
						>
							[X]
						</button>
						<GameChat onDilemmaTriggered={triggerDilemma} />
					</div>
				</div>
			)}

			{/* CAMADA 60: Game Over (Prioridade Máxima) */}
			{gameOverResult?.isGameOver && (
				<div className="absolute inset-0 z-[160] bg-slate-950">
					<ImpactReport
						onRestart={handleRestart}
						gameOverResult={gameOverResult}
					/>
				</div>
			)}
		</main>
	);
}

```

## src/app/hub/page.tsx
```tsx
import partnersData from "@/data/partners.json";

export default function HubPage() {
	return (
		<div className="min-h-screen bg-slate-950 text-white p-8">
			<h1 className="text-4xl font-bold mb-4">Hub de Parceiros & Mapa</h1>
			<p className="mb-8 text-lg text-slate-300">
				Conheça a rede de apoio que sustenta a população em situação de rua em
				Campinas.
				<br />
				<span className="text-sm text-slate-500">
					Dados baseados em instituições reais.
				</span>
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{partnersData.map((partner) => (
					<div
						key={partner.id}
						className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-blue-500/50 transition-colors"
					>
						<div className="flex justify-between items-start mb-4">
							<h2 className="text-xl font-bold text-blue-100">
								{partner.name}
							</h2>
							<span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
								{partner.type}
							</span>
						</div>

						<p className="text-slate-400 text-sm mb-4 min-h-[40px]">
							{partner.description}
						</p>

						<div className="space-y-2 text-sm text-slate-300 mb-6">
							<div className="flex items-center gap-2">
								<span className="text-slate-500">📍</span>
								<span>{partner.address}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-slate-500">📞</span>
								<span>{partner.contact}</span>
							</div>
						</div>

						<div className="flex flex-wrap gap-2 mt-auto">
							{partner.services.map((service) => (
								<span
									key={service}
									className="text-xs px-2 py-1 rounded-full bg-blue-900/30 text-blue-300 border border-blue-900/50"
								>
									{service}
								</span>
							))}
						</div>
					</div>
				))}
			</div>

			<div className="mt-12 p-6 bg-slate-900/50 border border-dashed border-slate-800 rounded-lg text-center">
				<p className="text-slate-400">
					Você representa uma organização e quer fazer parte da rede?
				</p>
				<button
					type="button"
					className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors"
				>
					Cadastrar Instituição (Em Breve)
				</button>
			</div>
		</div>
	);
}

```

## src/app/cofre/page.tsx
```tsx
"use client";

import {
	ArrowLeft,
	CreditCard,
	FileText,
	Lock,
	ShieldCheck,
	Upload,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function VaultPage() {
	const [isUnlocked, setIsUnlocked] = useState(false);

	// --- Tela de Desbloqueio (Simulada) ---
	if (!isUnlocked) {
		return (
			<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
				{/* Decorative Background */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />

				<div className="relative z-10 max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
					<div className="bg-slate-900/50 p-6 rounded-full inline-block mb-4 border border-slate-800">
						<Lock className="w-16 h-16 text-blue-500" />
					</div>

					<h1 className="text-3xl font-bold text-white tracking-tight">
						Seus Documentos,
						<br />
						Sua Identidade.
					</h1>

					<p className="text-slate-400 text-lg leading-relaxed">
						Na rua, perder o RG é perder a cidadania. Guarde fotos seguras dos
						seus documentos aqui. Se o papel molhar ou for roubado, o digital
						garante seu atendimento no Poupatempo.
					</p>

					<Button
						onClick={() => setIsUnlocked(true)}
						size="lg"
						className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
					>
						<ShieldCheck className="mr-2 w-5 h-5" /> Criar Chave de Acesso
						Segura
					</Button>

					<p className="text-xs text-slate-600 max-w-xs mx-auto">
						🔒 Seus dados ficam salvos APENAS no seu celular (Local Storage).
						Ninguém, nem nós, tem acesso.
					</p>
				</div>
			</div>
		);
	}

	// --- Dashboard do Cofre ---
	return (
		<div className="min-h-screen bg-slate-900 text-slate-100">
			<header className="border-b border-slate-800 p-4 sticky top-0 bg-slate-900/90 backdrop-blur z-50">
				<div className="max-w-xl mx-auto flex items-center justify-between">
					<Link href="/">
						<Button
							variant="ghost"
							size="icon"
							className="text-slate-400 hover:text-white"
						>
							<ArrowLeft className="w-5 h-5" />
						</Button>
					</Link>
					<div className="flex items-center gap-2 text-green-400 bg-green-950/30 px-3 py-1 rounded-full border border-green-900/50">
						<Lock className="w-3 h-3" />
						<span className="text-xs font-bold uppercase tracking-wider">
							Criptografado (K-5)
						</span>
					</div>
				</div>
			</header>

			<main className="max-w-xl mx-auto p-6 space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<DocCard
						icon={<CreditCard className="text-blue-400" />}
						title="RG (Identidade)"
						desc="Essencial para BPC"
						count={0}
					/>
					<DocCard
						icon={<FileText className="text-green-400" />}
						title="CPF"
						desc="Auxílios do Governo"
						count={0}
					/>
					<DocCard
						icon={<Wallet className="text-amber-400" />}
						title="Carteira de Trabalho"
						desc="Vagas de Emprego"
						count={0}
					/>
					<DocCard
						icon={<ActivityIcon className="text-red-400" />}
						title="Receitas Médicas"
						desc="Retirada no Posto"
						count={0}
					/>
				</div>

				<div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-center space-y-4">
					<div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto">
						<Upload className="text-slate-400" />
					</div>
					<div>
						<h3 className="font-bold text-white">Adicionar Novo Documento</h3>
						<p className="text-sm text-slate-400">
							Tire uma foto legível frente e verso.
						</p>
					</div>
					<Button
						variant="outline"
						className="w-full border-slate-600 hover:bg-slate-700 text-slate-300"
					>
						Selecionar Foto da Galeria
					</Button>
				</div>
			</main>
		</div>
	);
}

interface DocCardProps {
	icon: React.ReactNode;
	title: string;
	desc: string;
	count: number;
}

function DocCard({ icon, title, desc, count }: DocCardProps) {
	return (
		<Card className="bg-slate-800 border-slate-700 p-4 hover:border-blue-500/50 transition-colors cursor-pointer group">
			<div className="flex justify-between items-start mb-3">
				<div className="p-2 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform">
					{icon}
				</div>
				<span className="text-xs font-mono text-slate-500">{count} ARQ</span>
			</div>
			<h3 className="font-bold text-sm text-slate-200 mb-1">{title}</h3>
			<p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
				{desc}
			</p>
		</Card>
	);
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			role="img"
			aria-label="Ícone de Atividade"
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
		</svg>
	);
}

```

## src/app/impacto/page.tsx
```tsx
"use client";
import {
	AlertTriangle,
	Droplets,
	Heart,
	Home,
	Shield,
	Users,
	Utensils,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CENSUS_REALITY } from "@/data/census-reality";
import { ODSExplainer } from "@/features/dashboard/ODSExplainer";
import {
	runCensusSimulation,
	type SimAgent,
} from "@/features/dashboard/SimulationEngine";

export default function ImpactPage() {
	const [data, setData] = useState<SimAgent[]>([]);

	useEffect(() => {
		setData(runCensusSimulation());
	}, []);

	const stats = useMemo(() => {
		if (data.length === 0)
			return {
				total: 0,
				housingDeficit: 0,
				foodInsecurity: 0,
				sanitationCrisis: 0,
				menstrualPoverty: 0,
				racialGap: 0,
			};

		const total = data.length;
		const housing = data.filter((a) => !a.status.sheltered).length;
		const food = data.filter((a) => a.status.hungry).length;
		const sanitation = data.filter(
			(a) => a.status.sanitationAccess === "RUA",
		).length;
		const menstrual = data.filter(
			(a) => a.demographics.gender === "FEMININO" && !a.status.menstrualDignity,
		).length;
		const racial = data.filter(
			(a) => a.demographics.race === "PRETA_PARDA",
		).length;

		return {
			total,
			housingDeficit: Math.round((housing / total) * 100),
			foodInsecurity: Math.round((food / total) * 100),
			sanitationCrisis: Math.round((sanitation / total) * 100),
			menstrualPoverty: Math.round((menstrual / total) * 100),
			racialGap: Math.round((racial / total) * 100),
		};
	}, [data]);

	return (
		<div className="min-h-screen bg-slate-950 text-white p-8">
			<header className="mb-12">
				<h1 className="text-4xl font-bold mb-2">
					Painel de Inteligência Social
				</h1>
				<p className="text-slate-400">
					Simulação baseada no Censo Pop. Rua Campinas 2024 (1.557 pessoas
					mapeadas)
				</p>
			</header>

			{/* KPIs de Impacto */}
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
				<KpiCard
					title="População Mapeada"
					value={stats.total.toString()}
					icon={<Users className="text-blue-400" />}
					desc="Vidas simuladas hoje"
				/>
				<KpiCard
					title="Déficit Habitacional"
					value={`${stats.housingDeficit}%`}
					icon={<Home className="text-red-400" />}
					desc="Dormindo na rua hoje (ODS 11)"
					alert
				/>
				<KpiCard
					title="Risco de Fome"
					value={`${stats.foodInsecurity}%`}
					icon={<Utensils className="text-orange-400" />}
					desc="Sem acesso a refeição (ODS 2)"
				/>
				<KpiCard
					title="Crise Sanitária"
					value={`${stats.sanitationCrisis}%`}
					icon={<Droplets className="text-purple-400" />}
					desc="Sem acesso a banheiro (ODS 6)"
					alert
				/>
				<KpiCard
					title="Dignidade Menstrual"
					value={`${stats.menstrualPoverty}%`}
					icon={<Droplets className="text-pink-400" />}
					desc="Mulheres sem insumos (ODS 3)"
				/>
				<KpiCard
					title="ODS 18 - Equidade Racial"
					value={`${stats.racialGap}%`}
					icon={<AlertTriangle className="text-yellow-400" />}
					desc="Pretos ou Pardos (Desigualdade)"
				/>
			</div>

			{/* Visualização da Lacuna (Supply vs Demand) */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
					<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
						<Home className="w-5 h-5 text-blue-500" />
						Capacidade de Acolhimento (Campinas)
					</h2>

					{/* Gráfico de Barras CSS Puro */}
					<div className="space-y-6">
						<div>
							<div className="flex justify-between text-sm mb-2">
								<span className="text-slate-400">Demanda Real (Censo)</span>
								<span className="font-bold">1.557 Pessoas</span>
							</div>
							<div className="h-4 bg-slate-700 rounded-full overflow-hidden">
								<div className="h-full bg-red-500 w-full animate-pulse"></div>
							</div>
						</div>

						<div>
							<div className="flex justify-between text-sm mb-2">
								<span className="text-slate-400">
									Vagas Disponíveis (SAMIM + OSCs)
								</span>
								<span className="font-bold text-green-400">~300 Vagas</span>
							</div>
							<div className="h-4 bg-slate-700 rounded-full overflow-hidden">
								{/* 300 é aprox 19% de 1557 */}
								<div className="h-full bg-green-500 w-[19%]"></div>
							</div>
							<p className="text-xs text-red-400 mt-2">
								⚠️ 1.257 pessoas sem vaga garantida esta noite.
							</p>
						</div>
					</div>
				</div>

				{/* Insight Qualitativo */}
				<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
					<h2 className="text-xl font-bold mb-4">Análise de Inteligência</h2>
					<ul className="space-y-4 text-sm text-slate-300">
						<li className="flex gap-3">
							<span className="text-purple-400 font-bold">
								ALERTA SANITÁRIO:
							</span>
							{stats.sanitationCrisis}% da população simulada foi forçada a usar
							a rua para necessidades fisiológicas hoje, devido a barreiras em
							comércios e falta de banheiros públicos 24h.
						</li>
						<li className="flex gap-3">
							<span className="text-red-500 font-bold">CRÍTICO:</span>O sistema
							detectou que a "Barreira do RG" impede 19% da população de acessar
							o Bom Prato (exige cadastro/documento em alguns casos).
						</li>
						<li className="flex gap-3">
							<span className="text-green-500 font-bold">OPORTUNIDADE:</span>O
							"Consultório na Rua" é o serviço mais eficaz para reduzir danos,
							mas opera com apenas 3 equipes para 1.557 pessoas.
						</li>
					</ul>
				</div>
			</div>

			{/* SEÇÃO NOVA: Auditoria Sociotécnica (Solicitada pelo Censo 2024) */}
			<div className="mt-12 border-t border-slate-800 pt-12">
				<h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
					<span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />A
					Realidade Invisível
				</h2>
				<p className="text-slate-400 mb-8 max-w-3xl">
					Auditoria cruzada: Dados oficiais do Censo Pop Rua 2024 vs. Mitos
					Sociais. A tecnologia e a violência institucional operam como
					barreiras invisíveis.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{/* CARD 1: Exclusão Digital */}
					<div className="bg-slate-900/50 p-6 rounded-2xl border border-red-900/30 ring-1 ring-red-900/10">
						<h3 className="text-lg font-bold text-red-200 mb-6 flex items-center gap-2">
							<div className="p-2 bg-red-950 rounded-lg">
								<AlertTriangle className="w-4 h-4 text-red-500" />
							</div>
							Barreira Digital (Acesso Negado)
						</h3>

						<div className="space-y-6">
							<div className="relative pt-2">
								<div className="flex justify-between text-xs uppercase tracking-widest font-bold mb-2">
									<span className="text-slate-300">Sem Celular</span>
									<span className="text-white">
										{CENSUS_REALITY.digitalExclusion.noPhone}%
									</span>
								</div>
								<div className="h-2 bg-slate-800 rounded-full overflow-hidden">
									<div
										className="h-full bg-red-600 rounded-full"
										style={{
											width: `${CENSUS_REALITY.digitalExclusion.noPhone}%`,
										}}
									/>
								</div>
							</div>

							<div className="relative pt-2">
								<div className="flex justify-between text-xs uppercase tracking-widest font-bold mb-2">
									<span className="text-slate-300">Tem Celular, Sem Dados</span>
									<span className="text-white">
										{CENSUS_REALITY.digitalExclusion.noData}%
									</span>
								</div>
								<div className="h-2 bg-slate-800 rounded-full overflow-hidden">
									<div
										className="h-full bg-orange-500 rounded-full"
										style={{
											width: `${CENSUS_REALITY.digitalExclusion.noData}%`,
										}}
									/>
								</div>
								<p className="text-[10px] text-orange-400/80 mt-2 leading-relaxed">
									A exigência de agendamento online (Poupatempo/CRAS) bloqueia
									45% (Sem dados) + 20% (Sem aparelho) ={" "}
									<strong>65% da população</strong>.
								</p>
							</div>
						</div>
					</div>

					{/* CARD 2: Violência Institucional */}
					<div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
						<h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
							<div className="p-2 bg-slate-800 rounded-lg">
								<Shield className="w-4 h-4 text-blue-400" />
							</div>
							Quem agride na rua?
						</h3>

						<div className="flex items-end justify-center gap-4 h-[140px] mb-4">
							<div className="w-full flex flex-col items-center gap-2 group">
								<span className="text-2xl font-black text-red-400">
									{CENSUS_REALITY.violenceSource.publicAgents}%
								</span>
								<div
									className="w-full bg-red-900/50 border border-red-500 rounded-t-lg transition-all group-hover:bg-red-900/80"
									style={{
										height: `${CENSUS_REALITY.violenceSource.publicAgents}%`,
									}}
								/>
								<span className="text-[10px] uppercase font-bold text-center text-slate-400">
									Agentes do Estado
									<br />
									(PM, GM)
								</span>
							</div>

							<div className="w-full flex flex-col items-center gap-2 group">
								<span className="text-2xl font-black text-slate-400">
									{CENSUS_REALITY.violenceSource.civilians}%
								</span>
								<div
									className="w-full bg-slate-800 border border-slate-600 rounded-t-lg transition-all group-hover:bg-slate-700"
									style={{
										height: `${CENSUS_REALITY.violenceSource.civilians}%`,
									}}
								/>
								<span className="text-[10px] uppercase font-bold text-center text-slate-400">
									Sociedade Civil
								</span>
							</div>
						</div>
						<p className="text-xs text-slate-500 mt-4 text-center">
							ODS 16 Violado: A instituição que deveria proteger é a principal
							autora da violência.
						</p>
					</div>

					{/* CARD 3: Causa Raiz (Mito vs Realidade) */}
					<div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
						<h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
							<div className="p-2 bg-slate-800 rounded-lg">
								<Heart className="w-4 h-4 text-purple-400" />
							</div>
							Por que estão na rua?
						</h3>

						<div className="space-y-4">
							<div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm font-bold text-purple-300">
										Conflitos Familiares
									</span>
									<span className="text-xl font-black text-white">
										{CENSUS_REALITY.causes.familyConflict}%
									</span>
								</div>
								<div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
									<div
										style={{
											width: `${CENSUS_REALITY.causes.familyConflict}%`,
										}}
										className="h-full bg-purple-500"
									/>
								</div>
							</div>

							<div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 opacity-70">
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm font-bold text-slate-400">
										Álcool/Drogas
									</span>
									<span className="text-xl font-black text-slate-400">
										~30%
									</span>
								</div>
								<div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
									<div
										style={{ width: "30%" }}
										className="h-full bg-slate-600"
									/>
								</div>
							</div>

							<div className="text-xs text-slate-400 italic bg-purple-900/20 p-3 rounded-lg border border-purple-500/20">
								"Aporofobia se baseia no mito do vício. A realidade é o
								rompimento de vínculos."
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ODS Explainer - Contexto Global */}
			<div className="mt-12">
				<ODSExplainer />
			</div>
		</div>
	);
}

function KpiCard({
	title,
	value,
	icon,
	desc,
	alert = false,
}: {
	title: string;
	value: string;
	icon: React.ReactNode;
	desc: string;
	alert?: boolean;
}) {
	return (
		<div
			className={`p-6 rounded-xl border ${alert ? "bg-red-950/40 border-red-500/50" : "bg-slate-900 border-slate-800"}`}
		>
			<div className="flex justify-between items-start mb-4">
				<div>
					<h3 className="text-slate-200 text-sm font-bold">{title}</h3>
					<p className="text-3xl font-black mt-1 text-white">{value}</p>
				</div>
				<div className="p-3 bg-slate-800 rounded-lg">{icon}</div>
			</div>
			<p className="text-xs text-slate-300">{desc}</p>
		</div>
	);
}

```

## src/app/jornal/page.tsx
```tsx
"use client";

import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import posts from "@/data/journal-posts.json";

export default function JornalPage() {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
			<div className="max-w-4xl mx-auto space-y-8 p-6 pt-24">
				<header className="flex items-center gap-4 border-b border-slate-800 pb-6">
					<Link
						href="/"
						className="p-2 hover:bg-slate-900 rounded-full transition-colors group"
					>
						<ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
					</Link>
					<div>
						<h1 className="text-3xl font-black uppercase tracking-tighter text-white">
							Jornal da Rua
						</h1>
						<p className="text-slate-400">
							Notícias, denúncias e a voz de quem vive a cidade.
						</p>
					</div>
				</header>

				<div className="grid gap-6">
					{posts.map((post) => (
						<div
							key={post.id}
							className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all p-6 shadow-lg"
						>
							<div className="mb-4">
								<div className="flex justify-between items-start mb-2">
									<span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-900/20 px-2 py-1 rounded">
										{post.category}
									</span>
									<span className="text-xs text-slate-500 font-mono">
										{post.date}
									</span>
								</div>
								<h2 className="text-2xl font-bold text-white mb-2">
									{post.title}
								</h2>
							</div>
							<div>
								<p className="text-slate-300 leading-relaxed">{post.content}</p>
								<div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
									<div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-500/30">
										<User className="w-4 h-4 text-blue-300" />
									</div>
									<span className="text-xs text-slate-400 font-medium">
										Por <span className="text-slate-200">{post.author}</span>
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

```

## src/app/apoie/page.tsx
```tsx
"use client";

import {
	ArrowRight,
	Check,
	CheckCircle2,
	Coffee,
	Copy,
	Download,
	Globe,
	Heart,
	Instagram,
	MapPin,
	Phone,
	QrCode,
	ShieldCheck,
	Smartphone,
	Users,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Identidade Visual "Trabalho Justo" - Mais humana e acolhedora
const colors = {
	primary: "bg-slate-900",
	secondary: "bg-blue-700",
	accent: "bg-amber-500", // Cor de alerta/atenção, comum em sinalização urbana
	background: "bg-slate-50",
	text: "text-slate-800",
};

export default function FundraisingPage() {
	const [activeTab, setActiveTab] = useState<"individuals" | "companies">(
		"individuals",
	); // Padrão: Pessoas Físicas
	const [copied, setCopied] = useState(false);

	const pixKey = "19999912915";

	const handleCopyPix = () => {
		// Tenta copiar para a área de transferência
		navigator.clipboard
			.writeText(pixKey)
			.then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			})
			.catch(() => {
				// Fallback simples se a API não estiver disponível
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			});
	};

	return (
		<div
			className={`min-h-screen ${colors.background} font-sans text-slate-800`}
		>
			{/* Hero Section - Focado em Narrativa e Empatia */}
			<header className="bg-slate-900 text-white pt-32 pb-24 px-6 relative overflow-hidden">
				{/* Elementos de fundo abstratos (mapa da cidade) */}
				<div className="absolute inset-0 opacity-10 pointer-events-none">
					<svg
						className="w-full h-full"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
						aria-labelledby="bg-pattern-title"
					>
						<title id="bg-pattern-title">Padrão de fundo abstrato</title>
						<path
							d="M0 50 Q 50 0 100 50 T 200 50"
							stroke="white"
							strokeWidth="0.5"
							fill="none"
						/>
						<path
							d="M0 70 Q 50 20 100 70 T 200 70"
							stroke="white"
							strokeWidth="0.5"
							fill="none"
						/>
					</svg>
				</div>

				<div className="max-w-5xl mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
					<div>
						<div className="inline-flex items-center gap-2 bg-amber-500/20 px-3 py-1 rounded-full text-xs font-bold mb-6 text-amber-400 border border-amber-500/30">
							<span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
							Campanha "A Rua Tem Voz"
						</div>
						<h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
							Você passa por eles todos os dias. <br />
							<span className="text-amber-400">
								Agora você vai entender a jornada.
							</span>
						</h1>
						<p className="text-lg text-slate-300 mb-8 leading-relaxed">
							O "Caminhos Campinas" não é apenas um jogo. É uma janela para a
							realidade de 1.557 pessoas que vivem nas ruas da nossa cidade. Ao
							apoiar, você financia diretamente:
							<ul className="list-disc pl-5 mt-2 space-y-1">
								<li>
									<strong>1. Tecnologia Social:</strong> Manutenção do servidor
									e IA (Chatbot de voz).
								</li>
								<li>
									<strong>2. Educação:</strong> Bolsa-Formação para 29
									educadores sociais (ex-população de rua).
								</li>
								<li>
									<strong>3. Inteligência de Dados:</strong> Monitoramento de
									violações de direitos para políticas públicas.
								</li>
							</ul>
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="https://apoia.se/coletivoaruatemvoz"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 bg-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-700 transition-all shadow-lg hover:shadow-pink-500/30 transform hover:-translate-y-1"
							>
								<Heart
									className="animate-pulse"
									size={20}
									fill="currentColor"
								/>
								Campanha no Apoia.se (Recorrente)
							</a>
							<a
								href="#pix"
								className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-lg transform hover:-translate-y-1"
							>
								<Wallet size={20} />
								Doar via PIX (Único)
							</a>
						</div>
						<div className="flex flex-col sm:flex-row gap-4">
							<button
								type="button"
								onClick={() =>
									document
										.getElementById("doar")
										?.scrollIntoView({ behavior: "smooth" })
								}
								className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
							>
								Fazer Parte da Mudança <ArrowRight size={20} />
							</button>
						</div>
					</div>

					{/* Card: O Dilema (Substituindo o Dashboard de Dados) */}
					<div className="relative hidden md:block group perspective">
						<div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
						<div className="relative bg-white text-slate-800 rounded-xl p-6 shadow-2xl transform transition-transform duration-500 hover:rotate-1">
							{/* Header do Card (Simulando o Jogo) */}
							<div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-red-500"></div>
									<span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
										Dilema Real #42
									</span>
								</div>
								<div className="text-xs font-mono text-slate-400">18:45 PM</div>
							</div>

							{/* Conteúdo do Dilema */}
							<div className="space-y-4 mb-6">
								<p className="font-serif text-lg leading-snug text-slate-700">
									"O abrigo municipal (SAMIM) exige entrada até às 19h. Mas você
									conseguiu um 'bico' de vigia de carros que vai até às 20h e
									paga R$ 20,00."
								</p>
								<div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm text-slate-600 italic">
									O que você escolhe?
								</div>
							</div>

							{/* Opções (Botões visuais apenas) */}
							<div className="grid grid-cols-2 gap-3">
								<div className="border border-slate-200 p-3 rounded-lg text-center opacity-50 text-xs">
									Garantir a cama (Perde R$ 20)
								</div>
								<div className="bg-slate-900 text-white p-3 rounded-lg text-center text-xs font-bold shadow-lg">
									Trabalhar (Dorme na rua)
								</div>
							</div>

							<div className="mt-4 pt-4 border-t border-slate-100 text-center">
								<p className="text-xs text-blue-600 font-medium">
									Apoie para que ninguém precise fazer essa escolha.
								</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Seletor de Público */}
			<div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
				<div className="bg-white rounded-xl shadow-xl p-1.5 inline-flex w-full md:w-auto gap-2 border border-slate-200">
					<button
						type="button"
						onClick={() => setActiveTab("individuals")}
						className={`flex-1 md:flex-none px-8 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "individuals" ? "bg-amber-500 text-slate-900 shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
					>
						<Heart size={18} /> Para Pessoas (Você)
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("companies")}
						className={`flex-1 md:flex-none px-8 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "companies" ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
					>
						<Globe size={18} /> Apoio Institucional
					</button>
				</div>
			</div>

			<main id="doar" className="max-w-5xl mx-auto px-6 py-20">
				{/* CONTEÚDO PARA PESSOAS FÍSICAS (O Foco Principal) */}
				{activeTab === "individuals" && (
					<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
						{/* Por que doar? - Narrativa de Relevância */}
						<section className="text-center max-w-3xl mx-auto">
							<h2 className="text-3xl font-bold text-slate-900 mb-6">
								Por que este projeto importa para você?
							</h2>
							<p className="text-slate-600 text-lg leading-relaxed mb-8">
								Vivemos na mesma cidade, mas em mundos diferentes. O{" "}
								<strong>Coletivo A Rua Tem Voz</strong> usa a tecnologia para
								quebrar a indiferença. Ao apoiar, você não está apenas "dando
								dinheiro". Você está financiando uma ferramenta de educação que
								combate o preconceito e conecta quem quer ajudar com quem
								precisa de ajuda.
							</p>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
								<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
									<Smartphone className="text-blue-600 mb-3" size={24} />
									<h3 className="font-bold text-slate-900 mb-2">
										Acesso à Informação
									</h3>
									<p className="text-sm text-slate-500">
										Mapeamos serviços reais (Bom Prato, CRAS, Abrigos)
										facilitando o acesso para quem precisa.
									</p>
								</div>
								<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
									<MapPin className="text-amber-500 mb-3" size={24} />
									<h3 className="font-bold text-slate-900 mb-2">
										Visibilidade Real
									</h3>
									<p className="text-sm text-slate-500">
										Mostramos os "pontos invisíveis" da cidade e as histórias de
										quem vive neles.
									</p>
								</div>
								<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
									<ShieldCheck className="text-emerald-600 mb-3" size={24} />
									<h3 className="font-bold text-slate-900 mb-2">
										Cidadania Digital
									</h3>
									<p className="text-sm text-slate-500">
										Promovemos o direito à cidade e a documentação básica
										através da conscientização.
									</p>
								</div>
							</div>
						</section>
						{/* Footer removido em favor do Footer global */}

						<div className="border-t border-slate-200 my-12"></div>

						{/* Opções de Doação - Focadas em Impacto Direto */}
						<div>
							<h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
								Escolha seu nível de impacto
							</h2>
							<div className="grid md:grid-cols-3 gap-8">
								{/* Nível 1: Apoio Básico */}
								<div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 overflow-hidden">
									<div className="h-3 bg-blue-500"></div>
									<div className="p-8">
										<div className="flex justify-between items-start mb-4">
											<div className="bg-blue-100 p-3 rounded-full text-blue-700">
												<Coffee size={24} />
											</div>
											<span className="text-2xl font-bold text-slate-900">
												R$ 30
											</span>
										</div>
										<h3 className="text-lg font-bold text-slate-900 mb-2">
											Apoio Conectado
										</h3>
										<p className="text-slate-500 text-sm mb-6 min-h-[60px]">
											Ajuda a manter a plataforma do Coletivo no ar, garantindo
											que as informações sobre abrigos e refeições estejam
											sempre atualizadas.
										</p>
										<button
											type="button"
											onClick={() => handleCopyPix()}
											className="w-full py-3 rounded-lg border-2 border-blue-600 text-blue-700 font-bold hover:bg-blue-50 transition-colors"
										>
											Doar R$ 30
										</button>
									</div>
								</div>

								{/* Nível 2: Impacto Social (Destaque) */}
								<div className="group bg-slate-900 rounded-2xl shadow-xl hover:shadow-2xl border border-slate-700 transition-all duration-300 overflow-hidden relative transform md:-translate-y-4">
									<div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
										MAIS ESCOLHIDO
									</div>
									<div className="p-8">
										<div className="flex justify-between items-start mb-4">
											<div className="bg-amber-500/20 p-3 rounded-full text-amber-400">
												<ShieldCheck size={24} />
											</div>
											<span className="text-2xl font-bold text-white">
												R$ 50
											</span>
										</div>
										<h3 className="text-lg font-bold text-white mb-2">
											Kit Cidadania
										</h3>
										<p className="text-slate-300 text-sm mb-6 min-h-[60px]">
											Equivale ao custo de ajudar uma pessoa a tirar a 2ª via do
											RG (taxas + fotos + transporte), o documento essencial
											para sair da rua.
										</p>
										<button
											type="button"
											onClick={() => handleCopyPix()}
											className="w-full py-3 rounded-lg bg-amber-500 text-slate-900 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-900/20"
										>
											Doar R$ 50
										</button>
									</div>
								</div>

								{/* Nível 3: Rede de Apoio */}
								<div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 overflow-hidden">
									<div className="h-3 bg-emerald-500"></div>
									<div className="p-8">
										<div className="flex justify-between items-start mb-4">
											<div className="bg-emerald-100 p-3 rounded-full text-emerald-700">
												<Users size={24} />
											</div>
											<span className="text-2xl font-bold text-slate-900">
												R$ 100
											</span>
										</div>
										<h3 className="text-lg font-bold text-slate-900 mb-2">
											Rede Fortalecida
										</h3>
										<p className="text-slate-500 text-sm mb-6 min-h-[60px]">
											Apoia a logística dos voluntários parceiros (como o
											Coletivo A Rua Tem Voz) na distribuição de kits de higiene
											e dignidade menstrual.
										</p>
										<button
											type="button"
											onClick={() => handleCopyPix()}
											className="w-full py-3 rounded-lg border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-50 transition-colors"
										>
											Doar R$ 100
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* PIX Area */}
						<div className="bg-white rounded-xl p-8 border-2 border-slate-900 text-center max-w-xl mx-auto shadow-xl relative overflow-hidden">
							<div className="absolute -top-12 -right-12 opacity-10 transform rotate-12">
								<QrCode size={200} />
							</div>

							<h3 className="text-slate-900 text-xl font-bold mb-2 relative z-10">
								Faça um PIX Direto
							</h3>
							<p className="text-slate-500 text-sm mb-6 relative z-10">
								Escaneie com seu app de banco:
							</p>

							<div className="relative z-10 flex flex-col items-center justify-center gap-4 mb-6">
								<div className="bg-white p-4 rounded-xl border-2 border-slate-900 shadow-lg">
									<QRCodeSVG
										value="00020101021226580014br.gov.bcb.pix013619999912915025204000053039865802BR5919Daniel Arraes Reino6008CAMPINAS62070503***6304E2CA" // Exemplo de Payload CRC16 Realista (Simulado válido)
										size={180}
										level={"H"}
										includeMargin={true}
									/>
								</div>

								<button
									type="button"
									onClick={handleCopyPix}
									className="bg-slate-100 hover:bg-slate-200 cursor-pointer px-6 py-4 rounded-xl border border-slate-300 font-mono text-slate-800 text-lg font-bold flex items-center gap-3 transition-colors shadow-sm w-full justification-center"
								>
									<span className="truncate">19 99991-2915</span>
									{copied ? (
										<CheckCircle2
											size={24}
											className="text-emerald-600 shrink-0"
										/>
									) : (
										<Copy size={24} className="text-slate-400 shrink-0" />
									)}
								</button>

								<p className="text-xs text-emerald-600 font-medium h-4">
									{copied ? "Chave copiada!" : "Clique para copiar"}
								</p>
							</div>

							<div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200 inline-block text-left w-full">
								<div className="grid grid-cols-2 gap-y-2">
									<span className="text-slate-400 text-xs uppercase font-bold">
										Banco:
									</span>
									<span className="font-bold">Banco Neon</span>

									<span className="text-slate-400 text-xs uppercase font-bold">
										Nome:
									</span>
									<span className="font-bold">Daniel Arraes Reino</span>

									<span className="text-slate-400 text-xs uppercase font-bold">
										Contato:
									</span>
									<span>(19) 99991-2915</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* CONTEÚDO INSTITUCIONAL (Sem venda de dados) */}
				{activeTab === "companies" && (
					<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="text-center max-w-2xl mx-auto">
							<h2 className="text-3xl font-bold text-slate-900 mb-4">
								Sua empresa na construção de uma cidade justa.
							</h2>
							<p className="text-slate-600">
								Não vendemos dados. Construímos pontes. O Apoio Institucional
								permite que sua marca financie a manutenção da plataforma
								tecnológica que serve tanto à população de rua quanto aos
								assistentes sociais.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
							<div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
								<h3 className="text-xl font-bold mb-4 text-slate-900">
									Parceiro Mantenedor
								</h3>
								<p className="text-slate-600 mb-6 text-sm leading-relaxed">
									Ideal para empresas que querem fortalecer sua agenda ESG
									apoiando a inovação social. Sua marca aparecerá como apoiadora
									da tecnologia cívica de Campinas.
								</p>
								<ul className="space-y-3 mb-8">
									<li className="flex items-center gap-2 text-sm text-slate-700">
										<CheckCircle2 size={16} className="text-emerald-500" /> Logo
										no rodapé do Jogo e Site
									</li>
									<li className="flex items-center gap-2 text-sm text-slate-700">
										<CheckCircle2 size={16} className="text-emerald-500" />{" "}
										Menção no Relatório Anual de Atividades
									</li>
									<li className="flex items-center gap-2 text-sm text-slate-700">
										<CheckCircle2 size={16} className="text-emerald-500" /> Selo
										"Empresa Cidadã"
									</li>
								</ul>
								<button
									type="button"
									className="w-full py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
								>
									Entrar em Contato
								</button>
							</div>

							<div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
								<h3 className="text-xl font-bold mb-4 text-slate-900">
									Apoio Técnico (Pro Bono)
								</h3>
								<p className="text-slate-600 mb-6 text-sm leading-relaxed">
									Sua empresa pode doar horas de desenvolvimento, design ou
									infraestrutura de servidores para manter o "Caminhos Campinas"
									operando com custo zero.
								</p>
								<ul className="space-y-3 mb-8">
									<li className="flex items-center gap-2 text-sm text-slate-700">
										<CheckCircle2 size={16} className="text-blue-500" />{" "}
										Agradecimento especial nos Créditos
									</li>
									<li className="flex items-center gap-2 text-sm text-slate-700">
										<CheckCircle2 size={16} className="text-blue-500" />{" "}
										Workshop de Impacto Social para sua equipe
									</li>
								</ul>
								<button
									type="button"
									className="w-full py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
								>
									Oferecer Serviço
								</button>
							</div>
						</div>
					</div>
				)}
			</main>

			{/* SEÇÃO DE TRANSPARÊNCIA E ORÇAMENTO (NOVO) */}
			<section className="bg-slate-100 py-16 border-t border-slate-200">
				<div className="max-w-5xl mx-auto px-6">
					<div className="text-center mb-12">
						<div className="inline-block bg-slate-200 text-slate-700 px-4 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-4">
							Prestação de Contas
						</div>
						<h2 className="text-3xl font-bold text-slate-900 mb-4">
							Transparência do Projeto: <br />
							<span className="text-blue-700">
								Formação de Educadores Sociais
							</span>
						</h2>
						<p className="text-slate-600 max-w-2xl mx-auto">
							Entenda exatamente para onde vai seu dinheiro. Nossa meta inicial
							é financiar a formação da primeira turma piloto de 20 alunos,
							baseada na metodologia de
							<strong> Paulo Freire</strong> ("Educação como Prática da
							Liberdade") e <strong>Milton Santos</strong>.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-12 items-start">
						{/* COLUNA 1: ORÇAMENTO */}
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Meta da Campanha</span>
										<span className="text-emerald-600 font-bold">
											R$ 13.970,00
										</span>
									</CardTitle>
									<CardDescription>
										Custo total para formação de 20 alunos (16h)
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Progress Bar */}
									<div className="space-y-2">
										<div className="flex justify-between text-xs font-medium text-slate-500">
											<span>Arrecadado: R$ 698,50 (5%)</span>
											<span>100%</span>
										</div>
										<Progress value={5} className="h-2 bg-slate-100" />{" "}
										{/* indicatorClassName="bg-emerald-500" - assumindo padrao shadcn */}
									</div>

									{/* Breakdown */}
									<div className="space-y-4">
										<div>
											<h4 className="font-bold text-xs uppercase text-slate-400 mb-2 border-b border-slate-100 pb-1">
												Recursos Humanos
											</h4>
											<ul className="space-y-2 text-sm">
												<li className="flex justify-between">
													<span>2 Coordenadores</span>
													<span className="font-mono text-slate-600">
														R$ 4.200,00
													</span>
												</li>
												<li className="flex justify-between">
													<span>2 Educadores Sociais</span>
													<span className="font-mono text-slate-600">
														R$ 2.520,00
													</span>
												</li>
											</ul>
										</div>
										<div>
											<h4 className="font-bold text-xs uppercase text-slate-400 mb-2 border-b border-slate-100 pb-1">
												Logística e Materiais
											</h4>
											<ul className="space-y-2 text-sm">
												<li className="flex justify-between">
													<span>Alimentação (20 pessoas)</span>
													<span className="font-mono text-slate-600">
														R$ 3.950,00
													</span>
												</li>
												<li className="flex justify-between">
													<span>Material Didático</span>
													<span className="font-mono text-slate-600">
														R$ 1.400,00
													</span>
												</li>
												<li className="flex justify-between">
													<span>Material Impresso</span>
													<span className="font-mono text-slate-600">
														R$ 1.000,00
													</span>
												</li>
												<li className="flex justify-between">
													<span>Transporte/Locomoção</span>
													<span className="font-mono text-slate-600">
														R$ 900,00
													</span>
												</li>
											</ul>
										</div>
									</div>

									<div className="pt-4 border-t border-slate-100 flex justify-between items-center font-bold text-lg">
										<span>TOTAL</span>
										<span>R$ 13.970,00</span>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* COLUNA 2: METODOLOGIA */}
						<div className="space-y-6">
							<div className="space-y-4">
								<h3 className="font-bold text-xl text-slate-900">
									O Que Será Ensinado?
								</h3>
								<p className="text-sm text-slate-600">
									A ementa foi desenhada para promover autonomia política e
									técnica.
								</p>

								{/* Módulos Custom Accordion-like */}
								<div className="space-y-3">
									{[
										{
											title: "Módulo 1: Direitos Humanos",
											desc: "Definição histórica e violações específicas contra a população de rua.",
										},
										{
											title: "Módulo 2: Acesso a Serviços",
											desc: "Mapeamento das redes de saúde (SUS), segurança e assistência em Campinas.",
										},
										{
											title: "Módulo 3: Organização Política",
											desc: "Estratégias de organização coletiva e entendimento do papel do Estado.",
										},
										{
											title: "Módulo 4: Advocacia",
											desc: "Instrumentos legais para denúncia de violações e estratégias de defesa.",
										},
										{
											title: "Módulos 5 a 8: Formação de Multiplicadores",
											desc: "Preparação prática para alunos se tornarem educadores pares nos abrigos.",
										},
									].map((mod) => (
										<div
											key={mod.title}
											className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-blue-300 transition-colors"
										>
											<div className="flex items-start gap-3">
												<div className="bg-blue-100 p-1.5 rounded-full mt-0.5 text-blue-600">
													<Check size={14} />
												</div>
												<div>
													<h4 className="font-bold text-slate-900 text-sm">
														{mod.title}
													</h4>
													<p className="text-slate-500 text-xs mt-1">
														{mod.desc}
													</p>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="bg-blue-600/5 border border-blue-600/20 rounded-xl p-6 text-center space-y-4">
								<h4 className="font-bold text-blue-800">
									Quer ver o conteúdo completo?
								</h4>
								<p className="text-sm text-blue-700/80">
									Disponibilizamos o documento técnico original para auditoria
									pública.
								</p>
								<a
									href="/downloads/projeto-pedagogico-completo.docx"
									download
									className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
								>
									<Download size={18} />
									Baixar Projeto Pedagógico (DOCX)
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer removido em favor do Footer global */}
			<div className="font-bold text-slate-900 text-xs uppercase tracking-wide">
				Desenvolvedor / Responsa
			</div>
			<div className="font-bold text-slate-800 text-sm">
				Daniel (Japa / Oclinhos)
			</div>
		</div>
	);
}

```

## src/app/recursos/page.tsx
```tsx
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

```

