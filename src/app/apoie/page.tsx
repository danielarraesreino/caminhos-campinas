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
	MapPin,
	Phone,
	QrCode,
	ShieldCheck,
	Smartphone,
	Users,
	Instagram,
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
									].map((mod, idx) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: Static content order
										<div
											key={idx}
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
