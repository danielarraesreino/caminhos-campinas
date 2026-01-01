"use client";

import { ArrowLeft, ExternalLink, HandHeart, Heart, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { hubService, type Partner } from "@/services/hubService";
import { Award, BadgeCheck, CheckCircle2, MapPin } from "lucide-react";

export default function HubPage() {
	const [partners, setPartners] = useState<Partner[]>([]);

	useEffect(() => {
		setPartners(hubService.getPartners());
	}, []);

	return (
		<div className="min-h-screen bg-slate-50 relative overflow-hidden">
			{/* Decorative Background */}
			<div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
			<div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

			{/* Header */}
			<header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
				<div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
					<Link href="/">
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full hover:bg-slate-100"
						>
							<ArrowLeft className="w-5 h-5 text-slate-600" />
						</Button>
					</Link>
					<div>
						<h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
							<Users className="w-5 h-5 text-blue-600" />
							Hub de Parceiros
						</h1>
						<p className="text-xs text-slate-500">
							Rede de Proteção Validada - Campinas/SP
						</p>
					</div>
				</div>
			</header>

			<main className="max-w-5xl mx-auto px-6 py-8 space-y-8 relative z-10">
				<div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
					<div className="absolute top-0 right-0 p-10 opacity-10">
						<HandHeart size={120} />
					</div>
					<h2 className="text-2xl font-bold mb-4 relative z-10">
						Conecte-se a quem faz a diferença
					</h2>
					<p className="text-blue-100 max-w-xl relative z-10 mb-6">
						Estas organizações operam diariamente nas ruas de Campinas. Seja
						para buscar ajuda ou oferecer apoio, este é o caminho confiável.
					</p>
					<Button variant="secondary" className="font-bold gap-2">
						<Heart className="w-4 h-4 text-red-500" /> Quero Apoiar a Rede
					</Button>
				</div>

				<div className="grid md:grid-cols-2 gap-6">
					{partners.map((partner) => (
						<div
							key={partner.id}
							className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative"
						>
							{/* Verification Badge */}
							<div className="absolute top-4 right-4">
								{partner.verificationLevel === "gold" && (
									<span
										title="Verificação Ouro - Auditado"
										className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider border border-yellow-200"
									>
										<Award className="w-3 h-3" /> Ouro
									</span>
								)}
								{partner.verificationLevel === "official" && (
									<span
										title="Oficial - Governo"
										className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider border border-blue-200"
									>
										<BadgeCheck className="w-3 h-3" /> Oficial
									</span>
								)}
								{partner.verificationLevel === "verified" && (
									<span
										title="Verificado"
										className="flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider border border-slate-200"
									>
										<CheckCircle2 className="w-3 h-3" /> Verificado
									</span>
								)}
							</div>

							<div className="flex justify-between items-start mb-4 pr-20">
								<h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
									{partner.name}
								</h3>
							</div>

							<div className="flex flex-wrap gap-2 mb-4">
								<span
									className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${
										partner.type === "GOVERNO"
											? "bg-purple-100 text-purple-700 border-purple-200"
											: partner.type === "COLETIVO"
												? "bg-pink-100 text-pink-700 border-pink-200"
												: "bg-blue-50 text-blue-600 border-blue-100"
									}`}
								>
									{partner.type}
								</span>
								{partner.services.map((tag) => (
									<span
										key={tag}
										className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded-md"
									>
										{tag}
									</span>
								))}
							</div>

							<p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3 min-h-[60px]">
								{partner.description}
							</p>

							<div className="space-y-3 pt-4 border-t border-slate-50">
								<p className="text-xs text-slate-500 flex items-center gap-2">
									<MapPin className="w-3 h-3 shrink-0" /> {partner.address}
								</p>
								<Button
									className="w-full justify-between group-hover:bg-blue-600 transition-colors text-xs uppercase tracking-widest font-bold"
									variant="outline"
								>
									Visualizar Ação
									<ExternalLink className="w-4 h-4 opacity-50" />
								</Button>
							</div>
						</div>
					))}
				</div>

				<div className="text-center pt-8 border-t">
					<p className="text-slate-500 text-sm">
						Você representa uma ONG ou coletivo?{" "}
						<Link
							href="/hub/cadastro"
							className="text-blue-600 font-bold hover:underline"
						>
							Cadastre-se no Hub
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
