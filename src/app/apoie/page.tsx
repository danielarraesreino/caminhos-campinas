"use client";

import React, { useState } from 'react';
import {
	Heart,
	Users,
	ArrowRight,
	CheckCircle2,
	Globe,
	ShieldCheck,
	QrCode,
	Copy,
	MapPin,
	Smartphone,
	Coffee,
	Phone
} from 'lucide-react';

// Identidade Visual "Trabalho Justo" - Mais humana e acolhedora
const colors = {
	primary: "bg-slate-900",
	secondary: "bg-blue-700",
	accent: "bg-amber-500", // Cor de alerta/atenção, comum em sinalização urbana
	background: "bg-slate-50",
	text: "text-slate-800"
};

export default function FundraisingPage() {
	const [activeTab, setActiveTab] = useState<'individuals' | 'companies'>('individuals'); // Padrão: Pessoas Físicas
	const [copied, setCopied] = useState(false);

	const pixKey = "19999912915";

	const handleCopyPix = () => {
		// Tenta copiar para a área de transferência
		navigator.clipboard.writeText(pixKey).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}).catch(() => {
			// Fallback simples se a API não estiver disponível
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	return (
		<div className={`min-h-screen ${colors.background} font-sans text-slate-800`}>

			{/* Navbar Simples */}
			<nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center fixed w-full top-0 z-50 shadow-sm">
				<div className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
					<div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-serif font-bold">T</div>
					TRABALHO JUSTO
				</div>
				<div className="hidden md:flex gap-6 text-sm font-medium text-slate-600 items-center">
					<a href="#" className="hover:text-blue-700 transition-colors">O Projeto</a>
					<div className="flex items-center gap-2 text-slate-500 text-xs bg-slate-100 px-3 py-1 rounded-full">
						<Phone size={12} />
						(19) 99991-2915
					</div>
					<button
						type="button"
						onClick={() => document.getElementById('doar')?.scrollIntoView({ behavior: 'smooth' })}
						className="text-blue-700 font-bold hover:underline"
					>
						Doar Agora
					</button>
				</div>
			</nav>

			{/* Hero Section - Focado em Narrativa e Empatia */}
			<header className="bg-slate-900 text-white pt-32 pb-24 px-6 relative overflow-hidden">
				{/* Elementos de fundo abstratos (mapa da cidade) */}
				<div className="absolute inset-0 opacity-10 pointer-events-none">
					<svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
						<path d="M0 50 Q 50 0 100 50 T 200 50" stroke="white" strokeWidth="0.5" fill="none" />
						<path d="M0 70 Q 50 20 100 70 T 200 70" stroke="white" strokeWidth="0.5" fill="none" />
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
							<span className="text-amber-400">Agora você vai entender a jornada.</span>
						</h1>
						<p className="text-lg text-slate-300 mb-8 leading-relaxed">
							O "Caminhos Campinas" não é apenas um jogo. É uma janela para a realidade de 1.300 pessoas que vivem nas ruas da nossa cidade.
							Ao apoiar o <strong>Trabalho Justo</strong>, você financia a tecnologia que dá visibilidade a essa luta e apoia diretamente a rede de proteção.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<button
								type="button"
								onClick={() => document.getElementById('doar')?.scrollIntoView({ behavior: 'smooth' })}
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
									<span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dilema Real #42</span>
								</div>
								<div className="text-xs font-mono text-slate-400">18:45 PM</div>
							</div>

							{/* Conteúdo do Dilema */}
							<div className="space-y-4 mb-6">
								<p className="font-serif text-lg leading-snug text-slate-700">
									"O abrigo municipal (SAMIM) exige entrada até às 19h. Mas você conseguiu um 'bico' de vigia de carros que vai até às 20h e paga R$ 20,00."
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
						onClick={() => setActiveTab('individuals')}
						className={`flex-1 md:flex-none px-8 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'individuals' ? 'bg-amber-500 text-slate-900 shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
					>
						<Heart size={18} /> Para Pessoas (Você)
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('companies')}
						className={`flex-1 md:flex-none px-8 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'companies' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
					>
						<Globe size={18} /> Apoio Institucional
					</button>
				</div>
			</div>

			<main id="doar" className="max-w-5xl mx-auto px-6 py-20">

				{/* CONTEÚDO PARA PESSOAS FÍSICAS (O Foco Principal) */}
				{activeTab === 'individuals' && (
					<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

						{/* Por que doar? - Narrativa de Relevância */}
						<section className="text-center max-w-3xl mx-auto">
							<h2 className="text-3xl font-bold text-slate-900 mb-6">Por que este projeto importa para você?</h2>
							<p className="text-slate-600 text-lg leading-relaxed mb-8">
								Vivemos na mesma cidade, mas em mundos diferentes. O <strong>Trabalho Justo</strong> usa a tecnologia para quebrar a indiferença.
								Ao apoiar, você não está apenas "dando dinheiro". Você está financiando uma ferramenta de educação que combate o preconceito
								e conecta quem quer ajudar com quem precisa de ajuda.
							</p>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
								<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
									<Smartphone className="text-blue-600 mb-3" size={24} />
									<h3 className="font-bold text-slate-900 mb-2">Acesso à Informação</h3>
									<p className="text-sm text-slate-500">Mapeamos serviços reais (Bom Prato, CRAS, Abrigos) facilitando o acesso para quem precisa.</p>
								</div>
								<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
									<MapPin className="text-amber-500 mb-3" size={24} />
									<h3 className="font-bold text-slate-900 mb-2">Visibilidade Real</h3>
									<p className="text-sm text-slate-500">Mostramos os "pontos invisíveis" da cidade e as histórias de quem vive neles.</p>
								</div>
								<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
									<ShieldCheck className="text-emerald-600 mb-3" size={24} />
									<h3 className="font-bold text-slate-900 mb-2">Cidadania Digital</h3>
									<p className="text-sm text-slate-500">Promovemos o direito à cidade e a documentação básica através da conscientização.</p>
								</div>
							</div>
						</section>

						<div className="border-t border-slate-200 my-12"></div>

						{/* Opções de Doação - Focadas em Impacto Direto */}
						<div>
							<h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Escolha seu nível de impacto</h2>
							<div className="grid md:grid-cols-3 gap-8">

								{/* Nível 1: Apoio Básico */}
								<div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 overflow-hidden">
									<div className="h-3 bg-blue-500"></div>
									<div className="p-8">
										<div className="flex justify-between items-start mb-4">
											<div className="bg-blue-100 p-3 rounded-full text-blue-700">
												<Coffee size={24} />
											</div>
											<span className="text-2xl font-bold text-slate-900">R$ 30</span>
										</div>
										<h3 className="text-lg font-bold text-slate-900 mb-2">Apoio Conectado</h3>
										<p className="text-slate-500 text-sm mb-6 min-h-[60px]">
											Ajuda a manter a plataforma "Trabalho Justo" no ar, garantindo que as informações sobre abrigos e refeições estejam sempre atualizadas.
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
									<div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg">MAIS ESCOLHIDO</div>
									<div className="p-8">
										<div className="flex justify-between items-start mb-4">
											<div className="bg-amber-500/20 p-3 rounded-full text-amber-400">
												<ShieldCheck size={24} />
											</div>
											<span className="text-2xl font-bold text-white">R$ 50</span>
										</div>
										<h3 className="text-lg font-bold text-white mb-2">Kit Cidadania</h3>
										<p className="text-slate-300 text-sm mb-6 min-h-[60px]">
											Equivale ao custo de ajudar uma pessoa a tirar a 2ª via do RG (taxas + fotos + transporte), o documento essencial para sair da rua.
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
											<span className="text-2xl font-bold text-slate-900">R$ 100</span>
										</div>
										<h3 className="text-lg font-bold text-slate-900 mb-2">Rede Fortalecida</h3>
										<p className="text-slate-500 text-sm mb-6 min-h-[60px]">
											Apoia a logística dos voluntários parceiros (como o Coletivo A Rua Tem Voz) na distribuição de kits de higiene e dignidade menstrual.
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
							<div className="absolute -top-12 -right-12 text-slate-100 opacity-50 transform rotate-12">
								<QrCode size={200} />
							</div>

							<h3 className="text-slate-900 text-xl font-bold mb-2 relative z-10">Faça um PIX Direto</h3>
							<p className="text-slate-500 text-sm mb-6 relative z-10">
								Apoie diretamente através da chave PIX (Celular):
							</p>

							<div className="relative z-10 flex flex-col items-center justify-center gap-2 mb-6">
								<div
									onClick={handleCopyPix}
									className="bg-slate-100 hover:bg-slate-200 cursor-pointer px-6 py-4 rounded-xl border border-slate-300 font-mono text-slate-800 text-xl font-bold flex items-center gap-3 transition-colors shadow-sm"
								>
									19 99991-2915
									{copied ? <CheckCircle2 size={20} className="text-emerald-600" /> : <Copy size={20} className="text-slate-400" />}
								</div>
								<p className="text-xs text-emerald-600 font-medium h-4">
									{copied ? "Chave copiada!" : "Clique para copiar"}
								</p>
							</div>

							<div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200 inline-block text-left w-full">
								<div className="grid grid-cols-2 gap-y-2">
									<span className="text-slate-400 text-xs uppercase font-bold">Banco:</span>
									<span className="font-bold">Banco Neon</span>

									<span className="text-slate-400 text-xs uppercase font-bold">Nome:</span>
									<span className="font-bold">Daniel Arraes Reino</span>

									<span className="text-slate-400 text-xs uppercase font-bold">Contato:</span>
									<span>(19) 99991-2915</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* CONTEÚDO INSTITUCIONAL (Sem venda de dados) */}
				{activeTab === 'companies' && (
					<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="text-center max-w-2xl mx-auto">
							<h2 className="text-3xl font-bold text-slate-900 mb-4">Sua empresa na construção de uma cidade justa.</h2>
							<p className="text-slate-600">
								Não vendemos dados. Construímos pontes. O Apoio Institucional permite que sua marca financie a manutenção da plataforma tecnológica que serve tanto à população de rua quanto aos assistentes sociais.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
							<div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
								<h3 className="text-xl font-bold mb-4 text-slate-900">Parceiro Mantenedor</h3>
								<p className="text-slate-600 mb-6 text-sm leading-relaxed">
									Ideal para empresas que querem fortalecer sua agenda ESG apoiando a inovação social. Sua marca aparecerá como apoiadora da tecnologia cívica de Campinas.
								</p>
								<ul className="space-y-3 mb-8">
									<li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 size={16} className="text-emerald-500" /> Logo no rodapé do Jogo e Site</li>
									<li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 size={16} className="text-emerald-500" /> Menção no Relatório Anual de Atividades</li>
									<li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 size={16} className="text-emerald-500" /> Selo "Empresa Cidadã"</li>
								</ul>
								<button type="button" className="w-full py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800">
									Entrar em Contato
								</button>
							</div>

							<div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
								<h3 className="text-xl font-bold mb-4 text-slate-900">Apoio Técnico (Pro Bono)</h3>
								<p className="text-slate-600 mb-6 text-sm leading-relaxed">
									Sua empresa pode doar horas de desenvolvimento, design ou infraestrutura de servidores para manter o "Trabalho Justo" operando com custo zero.
								</p>
								<ul className="space-y-3 mb-8">
									<li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 size={16} className="text-blue-500" /> Agradecimento especial nos Créditos</li>
									<li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 size={16} className="text-blue-500" /> Workshop de Impacto Social para sua equipe</li>
								</ul>
								<button type="button" className="w-full py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50">
									Oferecer Serviço
								</button>
							</div>
						</div>
					</div>
				)}
			</main>

			{/* Footer Profissional */}
			<footer className="bg-white border-t border-slate-200 py-12 mt-12">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid md:grid-cols-4 gap-8 mb-8 text-sm text-slate-600">
						<div className="col-span-1 md:col-span-2">
							<div className="font-bold text-slate-900 mb-4 flex items-center gap-2">
								<div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white font-serif text-xs">T</div>
								TRABALHO JUSTO
							</div>
							<p className="max-w-xs mb-4">
								Uma iniciativa independente de tecnologia social. Conectando doadores, voluntários e serviços públicos para uma Campinas mais humana.
							</p>

							{/* Contatos Adicionados */}
							<div className="space-y-1 mb-4 text-slate-500">
								<div className="flex items-center gap-2 font-medium">
									<Phone size={14} className="text-blue-700" />
									(19) 99991-2915
								</div>
								<div className="flex items-center gap-2 font-medium">
									<Phone size={14} className="text-blue-700" />
									(19) 99325-7342
								</div>
							</div>

							<div className="flex gap-4">
								{/* Ícones de redes sociais fictícios */}
								<div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 cursor-pointer">IG</div>
								<div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 cursor-pointer">TW</div>
							</div>
						</div>
						<div>
							<div className="font-bold text-slate-900 mb-4">TRANSPARÊNCIA</div>
							<ul className="space-y-2">
								<li><a href="#" className="hover:text-blue-600">Nossa Missão</a></li>
								<li><a href="#" className="hover:text-blue-600">Prestação de Contas 2024</a></li>
								<li><a href="#" className="hover:text-blue-600">Estatuto Social</a></li>
							</ul>
						</div>
						<div>
							<div className="font-bold text-slate-900 mb-4">APOIO TÉCNICO</div>
							<ul className="space-y-2">
								<li>Coletivo A Rua Tem Voz</li>
								<li>Rede de Dados Abertos</li>
								<li>Cáritas Campinas (Parceiro)</li>
							</ul>
						</div>
					</div>
					<div className="text-center border-t border-slate-100 pt-8 text-xs text-slate-400">
						&copy; 2025 Trabalho Justo. Desenvolvido com tecnologia de código aberto.
						<br />Este projeto respeita a LGPD e não comercializa dados de usuários.
					</div>
				</div>
			</footer>
		</div>
	);
}
