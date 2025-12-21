import {
	AlertCircle,
	ArrowRight,
	Check,
	Copy,
	Cpu,
	Heart,
	Instagram,
	Loader2,
	MapPin,
	Menu,
	Shield,
	Smartphone,
	Sparkles,
	Target,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { SurvivalMap } from "../survival-map/SurvivalMap";
import { AvatarCreation } from "./AvatarCreation";

export default function LandingPage() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	// Map State
	const [showMap, setShowMap] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [mode, setMode] = useState<"landing" | "creation">("landing");

	const { data: session, status } = useSession();

	// AI State
	const [aiLoading, setAiLoading] = useState(false);
	const [dilemma, setDilemma] = useState<{
		scenario: string;
		options: string[];
	} | null>(null);
	const [aiFeedback, setAiFeedback] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const pixKey = "19999912915";

	const handleCopyPix = () => {
		navigator.clipboard.writeText(pixKey);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		setIsMenuOpen(false);
	};

	// Gemini API Call Helper - Agora usa API Route segura
	const callGemini = async (prompt: string) => {
		const response = await fetch("/api/gemini", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ prompt }),
		});

		const data = await response.json();

		if (!data.success) {
			throw new Error(data.error || "Erro ao processar requisição");
		}

		return data.text || "Sem resposta da IA.";
	};

	const generateDilemma = async () => {
		setAiLoading(true);
		setError(null);
		setDilemma(null);
		setAiFeedback(null);

		const systemPrompt = `Você é o motor narrativo de um 'Serious Game' sobre a população em situação de rua.
        Gere um cenário curto (máx 50 palavras) e urgente.
        Forneça exatamente 3 opções de ação curtas (máx 5 palavras cada).
        Responda ESTRITAMENTE em JSON neste formato:
        {
            "scenario": "Texto do cenário...",
            "options": ["Opção 1", "Opção 2", "Opção 3"]
        }`;

		try {
			const text = await callGemini(systemPrompt);
			const cleanText = text?.replace(/```json|```/g, "").trim();
			const json = JSON.parse(cleanText || "{}");

			if (json.scenario && Array.isArray(json.options)) {
				setDilemma(json);
			} else {
				throw new Error("Formato inválido da IA");
			}
		} catch (err) {
			console.error(err);
			setError("Erro ao gerar dilema. Tente novamente.");
		} finally {
			setAiLoading(false);
		}
	};

	const solveDilemma = async (action: string) => {
		setAiLoading(true);
		setError(null);

		const systemPrompt = `Contexto: Jogo sério população de rua.
        Cenário: "${dilemma?.scenario}"
        Ação Escolhida: "${action}"
        
        Analise a consequência (máx 40 palavras). Seja realista e educativo.`;

		try {
			const text = await callGemini(systemPrompt);
			setAiFeedback(text || "Sem resposta.");
		} catch (_err) {
			setError("Erro ao processar ação.");
		} finally {
			setAiLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-900">
			{/* Navigation */}
			<nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-slate-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center gap-2">
							<div className="bg-blue-600 p-2 rounded-lg">
								<MapPin className="h-6 w-6 text-white" />
							</div>
							<span className="font-bold text-xl tracking-tight text-slate-800">
								Caminhos <span className="text-blue-600">Campinas</span>
							</span>
						</div>

						{/* Desktop Menu */}
						<div className="hidden md:flex items-center space-x-8">
							<button
								type="button"
								onClick={() => scrollToSection("projeto")}
								className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
							>
								O Projeto
							</button>
							<button
								type="button"
								onClick={() => setShowMap(true)}
								className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
							>
								<MapPin className="w-4 h-4 text-green-600" /> Mapa de Apoio
							</button>
							<button
								type="button"
								onClick={() => scrollToSection("demo-ia")}
								className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
							>
								<Sparkles className="w-4 h-4 text-purple-500" /> Demo IA
							</button>
							<button
								type="button"
								onClick={() => scrollToSection("tecnologia")}
								className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
							>
								Tecnologia
							</button>
							<a
								href="/recursos"
								className="text-slate-600 hover:text-blue-600 font-medium transition-colors border border-blue-100 px-3 py-1 rounded-full hover:bg-blue-50"
							>
								Recursos
							</a>
							{status === "authenticated" ? (
								<button
									type="button"
									onClick={() => (window.location.href = "/jogar")}
									className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
								>
									Jogar
								</button>
							) : (
								<button
									type="button"
									onClick={() => setShowLoginModal(true)}
									className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
								>
									Entrar
								</button>
							)}
							<button
								type="button"
								onClick={() => scrollToSection("doar")}
								className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
							>
								Apoiar Agora
							</button>
						</div>

						{/* Mobile Menu Button */}
						<div className="md:hidden">
							<button
								type="button"
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="text-slate-600 p-2"
							>
								{isMenuOpen ? (
									<X className="h-6 w-6" />
								) : (
									<Menu className="h-6 w-6" />
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden bg-white border-b border-slate-200 animate-fade-in">
						<div className="px-4 pt-2 pb-6 space-y-2">
							<button
								type="button"
								onClick={() => scrollToSection("projeto")}
								className="block w-full text-left px-3 py-3 text-slate-600 font-medium border-b border-slate-100"
							>
								O Projeto
							</button>
							<button
								type="button"
								onClick={() => scrollToSection("demo-ia")}
								className="block w-full text-left px-3 py-3 text-slate-600 font-medium border-b border-slate-100 flex items-center gap-2"
							>
								<Sparkles className="w-4 h-4 text-purple-500" /> Demo IA
							</button>
							<button
								type="button"
								onClick={() => scrollToSection("tecnologia")}
								className="block w-full text-left px-3 py-3 text-slate-600 font-medium border-b border-slate-100"
							>
								Tecnologia
							</button>
							<button
								type="button"
								onClick={() =>
									status === "authenticated"
										? (window.location.href = "/jogar")
										: setShowLoginModal(true)
								}
								className="block w-full text-left px-3 py-3 text-slate-600 font-medium border-b border-slate-100"
							>
								{status === "authenticated" ? "Jogar" : "Entrar"}
							</button>
							<button
								type="button"
								onClick={() => scrollToSection("doar")}
								className="block w-full mt-4 text-center bg-blue-600 text-white px-3 py-3 rounded-lg font-bold"
							>
								Apoiar Agora
							</button>
						</div>
					</div>
				)}
			</nav>

			{/* Hero Section */}
			<section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
				<div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/city-fields.png')]"></div>
				<div className="max-w-7xl mx-auto relative z-10 text-center lg:text-left lg:flex lg:items-center lg:gap-16">
					<div className="lg:w-1/2">
						<div className="inline-block bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-6">
							<span className="text-blue-300 font-semibold text-sm tracking-wide uppercase">
								Serious Game & Tecnologia Social
							</span>
						</div>
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
							Reintegrando vidas através da{" "}
							<span className="text-blue-400">tecnologia</span> e{" "}
							<span className="text-pink-500">empatia</span>.
						</h1>
						<p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
							Um jogo digital inovador desenvolvido em Campinas para conectar a
							sociedade civil à realidade da população em situação de rua,
							facilitando o acesso a direitos e estimulando a solidariedade
							real.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
							<button
								type="button"
								onClick={() => scrollToSection("doar")}
								className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
							>
								<Heart className="h-5 w-5 fill-current" />
								Fazer uma Doação
							</button>
							<button
								type="button"
								onClick={() =>
									status === "authenticated"
										? (window.location.href = "/jogar")
										: setShowLoginModal(true)
								}
								className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2 transform hover:-translate-y-1"
							>
								<ArrowRight className="h-5 w-5" />
								{status === "authenticated" ? "CONTINUAR JOGANDO" : "INICIAR JORNADA"}
							</button>
							<button
								type="button"
								onClick={() => scrollToSection("demo-ia")}
								className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
							>
								<Sparkles className="h-5 w-5 text-purple-300" />
								Testar Demo IA
							</button>
						</div>
					</div>
					<div className="lg:w-1/2 mt-12 lg:mt-0">
						{mode === "creation" ? (
							<AvatarCreation
								onComplete={() => (window.location.href = "/jogar")}
								onBack={() => setMode("landing")}
							/>
						) : (
							<div className="relative mx-auto w-full max-w-md lg:max-w-full">
								<div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 relative overflow-hidden group">
									<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
										<Smartphone className="w-32 h-32 text-white" />
									</div>
									<div className="space-y-6">
										<div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
											<div className="flex items-center gap-3 mb-2">
												<div className="h-3 w-3 rounded-full bg-red-500"></div>
												<h3 className="text-slate-200 font-semibold text-sm uppercase">
													Dilema Real #12
												</h3>
											</div>
											<p className="text-white font-medium">
												"Você precisa da 2ª via do RG para conseguir um emprego,
												mas o Poupatempo exige agendamento online e você não tem
												internet."
											</p>
											<div className="mt-4 grid grid-cols-2 gap-2">
												<button
													type="button"
													className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 py-2 rounded-lg text-sm border border-blue-500/30 transition-colors"
												>
													Procurar Wi-Fi Livre
												</button>
												<button
													type="button"
													className="bg-slate-600/40 hover:bg-slate-600/60 text-slate-300 py-2 rounded-lg text-sm border border-slate-500/30 transition-colors"
												>
													Pedir ajuda na rua
												</button>
											</div>
										</div>
										<div className="flex items-center justify-between text-slate-400 text-sm">
											<span className="flex items-center gap-1">
												<Users className="h-4 w-4" /> +1.300 pessoas impactadas
											</span>
											<span className="flex items-center gap-1">
												<MapPin className="h-4 w-4" /> Campinas, SP
											</span>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* The Problem & Solution Section */}
			<section
				id="projeto"
				className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
			>
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl font-bold text-slate-900 mb-4">
						Por que um jogo?
					</h2>
					<p className="text-lg text-slate-600">
						A população em situação de rua em Campinas cresceu cerca de 40% nos
						últimos anos. As barreiras não são apenas a falta de teto, mas a
						burocracia, a falta de informação e a invisibilidade social.
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-12 items-center">
					<div className="space-y-8">
						<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-100 transition-colors">
							<div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
								<Target className="h-6 w-6 text-red-600" />
							</div>
							<h3 className="text-xl font-bold text-slate-900 mb-2">
								Para a População de Rua
							</h3>
							<p className="text-slate-600">
								Um utilitário gamificado que transforma a burocracia em missões
								claras. O app orienta onde comer, como tirar documentos e onde
								encontrar abrigo, oferecendo recompensas reais por cada passo de
								autonomia conquistado.
							</p>
						</div>
						<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-100 transition-colors">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
								<Heart className="h-6 w-6 text-blue-600" />
							</div>
							<h3 className="text-xl font-bold text-slate-900 mb-2">
								Para a Sociedade Civil
							</h3>
							<p className="text-slate-600">
								Um simulador de empatia que coloca o cidadão diante dos dilemas
								reais da rua, combatendo o preconceito. Além disso, funciona
								como um "Hub de Doações Inteligentes", mostrando onde sua ajuda
								é mais necessária.
							</p>
						</div>
					</div>

					<div className="bg-slate-100 rounded-3xl p-8 relative">
						<h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
							Funcionalidades Principais
						</h3>
						<div className="grid grid-cols-1 gap-4">
							<div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
								<Shield className="h-6 w-6 text-green-600 mt-1 shrink-0" />
								<div>
									<h4 className="font-bold text-slate-900">Cofre Digital</h4>
									<p className="text-sm text-slate-600">
										Armazenamento seguro de documentos digitalizados na nuvem,
										evitando a perda recorrente de RG e CPF.
									</p>
								</div>
							</div>
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
							Powered by Gemini API
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
										<>
											<Loader2 className="h-5 w-5 animate-spin" /> Gerando
											Cenário...
										</>
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
											GEMINI-LIVE-FEED
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
										<label className="text-sm text-slate-400">
											Escolha sua ação:
										</label>
										<div className="flex flex-col gap-3">
											{dilemma?.options?.map((option, idx) => (
												<button
													type="button"
													key={idx}
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
												<h4 className="font-bold text-purple-300 text-sm">
													CONSEQUÊNCIA
												</h4>
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
					<p className="text-center text-slate-500 text-xs mt-4">
						* As respostas são geradas por Inteligência Artificial e servem
						apenas para simulação educativa.
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
								Diferente de apps tradicionais que custam milhões, utilizamos a
								plataforma <strong>Google Antigravity</strong> e o modelo{" "}
								<strong>Gemini 3</strong>.
							</p>
							<ul className="space-y-4">
								<li className="flex items-center gap-3">
									<div className="bg-green-100 p-2 rounded-full">
										<Check className="h-4 w-4 text-green-600" />
									</div>
									<span className="text-slate-700">
										Desenvolvimento Ágil (Agent-First Development)
									</span>
								</li>
								<li className="flex items-center gap-3">
									<div className="bg-green-100 p-2 rounded-full">
										<Check className="h-4 w-4 text-green-600" />
									</div>
									<span className="text-slate-700">
										Custos de manutenção reduzidos via automação
									</span>
								</li>
								<li className="flex items-center gap-3">
									<div className="bg-green-100 p-2 rounded-full">
										<Check className="h-4 w-4 text-green-600" />
									</div>
									<span className="text-slate-700">
										Acessibilidade nativa para dispositivos simples
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
									onClick={() =>
										window.open(
											"https://instagram.com/coletivoaruatemvoz",
											"_blank",
										)
									}
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

						<h3 className="text-lg font-medium text-slate-500 mb-2">
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
							<p className="text-xs text-slate-400 mt-2">
								O valor será destinado integralmente ao desenvolvimento do jogo
								e ações do coletivo.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col md:flex-row justify-between items-center gap-8">
						<div className="text-center md:text-left">
							<h4 className="text-white text-lg font-bold mb-2">
								Caminhos Campinas
							</h4>
							<p className="text-sm max-w-xs">
								Uma iniciativa para transformar a realidade das ruas através da
								tecnologia social.
							</p>
						</div>

						<div className="flex flex-col items-center">
							<span className="text-sm font-medium text-slate-500 mb-2">
								Siga o Coletivo
							</span>
							<a
								href="https://www.instagram.com/coletivoaruatemvoz"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-white hover:text-pink-500 transition-colors bg-slate-800 px-4 py-2 rounded-full"
							>
								<Instagram className="h-5 w-5" />
								@COLETIVOARUATEMVOZ
							</a>
						</div>
					</div>
					<div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs">
						<p>
							&copy; 2025 Coletivo A Rua Tem Voz. Todos os direitos reservados.
						</p>
						<p className="mt-2">Desenvolvido com Antigravity IDE & Gemini 3.</p>
					</div>
				</div>
			</footer>

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
						>
							<X className="h-5 w-5" />
						</button>

						<div className="relative text-center mb-8">
							<div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
								<MapPin className="h-6 w-6 text-white" />
							</div>
							<h3 className="text-2xl font-bold text-slate-800">Boas-vindas!</h3>
							<p className="text-slate-500 text-sm mt-1">
								Escolha como deseja iniciar sua jornada.
							</p>
						</div>

						<div className="space-y-4 relative">
							<button
								type="button"
								onClick={() => signIn("google", { callbackUrl: "/jogar" })}
								className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-3.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm group"
							>
								<svg className="w-5 h-5" viewBox="0 0 24 24">
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
								<span className="relative px-3 bg-white text-xs font-bold text-slate-400 uppercase tracking-widest">
									Ou
								</span>
							</div>

							<button
								type="button"
								onClick={() => signIn("credentials", { callbackUrl: "/jogar" })}
								className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
							>
								Acesso Anônimo
								<ArrowRight className="h-4 w-4 opacity-50" />
							</button>
							<p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
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
