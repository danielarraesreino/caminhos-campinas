"use client";

import {
	ArrowRight,
	Award,
	BookOpen,
	MapPin,
	Users,
	Video,
} from "lucide-react";
import Link from "next/link";

export default function ResourcesPage() {
	const resources = [
		{
			category: "Capacitação Profissional",
			items: [
				{
					title: "Curso Básico de Elétrica",
					provider: "Fundação Paulistana",
					duration: "40h",
					type: "Presencial",
				},
				{
					title: "Panificação Artesanal",
					provider: "Fundo Social SP",
					duration: "20h",
					type: "Presencial",
				},
				{
					title: "Empreendedorismo na Rua",
					provider: "Sebrae",
					duration: "15h",
					type: "Online",
				},
			],
		},
		{
			category: "Educação Digital",
			items: [
				{
					title: "Como usar o Caixa Tem",
					provider: "Gov.br",
					duration: "30min",
					type: "Vídeo",
				},
				{
					title: "Criando seu Currículo no Celular",
					provider: "CATe",
					duration: "1h",
					type: "Tutorial",
				},
				{
					title: "Segurança na Internet",
					provider: "Ong Recode",
					duration: "2h",
					type: "Curso",
				},
			],
		},
	];

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
			{/* Header */}
			<header className="bg-blue-600 text-white py-12 px-4 shadow-lg">
				<div className="max-w-5xl mx-auto">
					<Link
						href="/"
						className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors"
					>
						<ArrowRight className="h-4 w-4 rotate-180 mr-2" /> Voltar para
						Início
					</Link>
					<h1 className="text-3xl md:text-5xl font-bold mb-4">
						Hub de Recursos
					</h1>
					<p className="text-xl text-blue-100 max-w-2xl">
						Acesso simplificado a cursos, capacitações e serviços essenciais
						para a autonomia.
					</p>
				</div>
			</header>

			{/* Categories */}
			<div className="max-w-5xl mx-auto px-4 -mt-8">
				<div className="grid md:grid-cols-3 gap-6 mb-12">
					<div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
						<div className="bg-orange-100 p-3 rounded-full">
							<Video className="h-6 w-6 text-orange-600" />
						</div>
						<div>
							<span className="block text-2xl font-bold text-slate-900">
								12
							</span>
							<span className="text-sm text-slate-500">Videoaulas</span>
						</div>
					</div>
					<div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
						<div className="bg-green-100 p-3 rounded-full">
							<MapPin className="h-6 w-6 text-green-600" />
						</div>
						<div>
							<span className="block text-2xl font-bold text-slate-900">
								05
							</span>
							<span className="text-sm text-slate-500">Locais Físicos</span>
						</div>
					</div>
					<div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
						<div className="bg-purple-100 p-3 rounded-full">
							<Award className="h-6 w-6 text-purple-600" />
						</div>
						<div>
							<span className="block text-2xl font-bold text-slate-900">
								03
							</span>
							<span className="text-sm text-slate-500">Certificados</span>
						</div>
					</div>
				</div>

				{/* Resource Lists */}
				<div className="space-y-12">
					{resources.map((section, idx) => (
						<div key={idx}>
							<h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
								<BookOpen className="h-6 w-6 text-blue-600" />
								{section.category}
							</h2>
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{section.items.map((item, i) => (
									<div
										key={i}
										className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden"
									>
										<div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>
										<h3 className="font-bold text-lg text-slate-900 mb-2">
											{item.title}
										</h3>
										<div className="flex items-center justify-between text-sm text-slate-500 mt-4">
											<span className="flex items-center gap-1">
												<Users className="h-4 w-4" /> {item.provider}
											</span>
											<span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold uppercase">
												{item.type}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				{/* CTA */}
				<div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
					<h2 className="text-3xl font-bold mb-4">
						Tem um curso ou oferta de emprego?
					</h2>
					<p className="text-blue-100 mb-8 max-w-xl mx-auto">
						Parceiros empresariais podem cadastrar vagas e treinamentos
						diretamente na nossa plataforma.
					</p>
					<button
						type="button"
						className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
					>
						Cadastrar Oportunidade
					</button>
				</div>
			</div>
		</div>
	);
}
