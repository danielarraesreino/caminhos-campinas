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
