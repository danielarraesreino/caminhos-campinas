"use client";

import React, { useState } from 'react';
import { Heart, Server, ShieldCheck, Users, Coffee, Code, AlertTriangle, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ApoiePage() {
	const [copied, setCopied] = useState(false);

	// Chave PIX PESSOAL APENAS PARA O DEV (Tech Stack)
	const devPixKey = "19999912915";

	const handleCopyPix = () => {
		navigator.clipboard.writeText(devPixKey);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="min-h-screen bg-slate-50 pb-20">
			{/* Header */}
			<div className="bg-slate-900 text-white py-16 px-4">
				<div className="max-w-4xl mx-auto text-center space-y-4">
					<h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
						Quem financia a mudança?
					</h1>
					<p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
						A transparência é nossa regra. Dividimos o apoio em dois pilares:
						a <strong>Tecnologia</strong> (que mantém o sistema) e a <strong>Vida</strong> (que transforma as pessoas).
					</p>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 -mt-10 grid md:grid-cols-2 gap-8">

				{/* PILAR 1: AÇÃO SOCIAL (INSTITUCIONAL) */}
				<Card className="shadow-xl border-t-4 border-t-green-600">
					<CardHeader>
						<div className="flex items-center gap-3 mb-2">
							<div className="p-3 bg-green-100 rounded-full text-green-700">
								<Users size={24} />
							</div>
							<div>
								<CardTitle className="text-2xl font-bold text-slate-800">Fundo Educacional</CardTitle>
								<CardDescription>Projeto Piloto: Agilizadores Sociais</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="p-4 bg-slate-100 rounded-lg text-sm text-slate-600">
							<p className="font-semibold mb-2">Objetivo: R$ 13.970,00</p>
							<ul className="list-disc pl-4 space-y-1">
								<li>Bolsas para 20 alunos (R$ 400/cada)</li>
								<li>Alimentação e Transporte</li>
								<li>Formatura e Certificação</li>
							</ul>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between text-xs font-bold uppercase text-slate-500">
								<span>Arrecadado: R$ 0,00</span>
								<span>Meta: R$ 13.970,00</span>
							</div>
							<Progress value={0} className="h-3" />
						</div>

						<div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg flex gap-3 items-start">
							<AlertTriangle className="text-yellow-600 shrink-0" size={20} />
							<div className="text-sm text-yellow-800">
								<span className="font-bold">Status: Em Trâmite Institucional.</span>
								<br />
								Os recursos deste fundo serão geridos por entidade parceira auditada (em tratativas com FEAC/Cândido Ferreira).
								<span className="block mt-2 font-medium">Aguarde a liberação da conta oficial para doar para o curso.</span>
							</div>
						</div>

						<div className="text-xs text-center text-slate-400">
							* Economia Solidária: Profissionais técnicos doaram R$ 45.000+ em horas de trabalho para viabilizar este projeto.
						</div>
					</CardContent>
				</Card>

				{/* PILAR 2: TECNOLOGIA (DEV/INFRA) */}
				<Card className="shadow-xl border-t-4 border-t-blue-600 bg-slate-900 text-slate-100">
					<CardHeader>
						<div className="flex items-center gap-3 mb-2">
							<div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
								<Server size={24} />
							</div>
							<div>
								<CardTitle className="text-2xl font-bold text-white">Infraestrutura & Dev</CardTitle>
								<CardDescription className="text-slate-400">Mantenha o sistema online</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						<p className="text-slate-300">
							Eu sou um desenvolvedor independente. Enquanto o fundo social não sai,
							preciso pagar os custos reais para manter o <strong>Caminhos Campinas</strong> no ar.
						</p>

						<div className="space-y-3">
							<div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
								<Server className="text-blue-400" size={18} />
								<span className="text-sm">Servidores Vercel & Banco de Dados</span>
							</div>
							<div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
								<Globe className="text-purple-400" size={18} />
								<span className="text-sm">Domínio .org.br & APIs de IA</span>
							</div>
							<div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
								<Coffee className="text-amber-400" size={18} />
								<span className="text-sm">Sobrevivência do Desenvolvedor</span>
							</div>
						</div>

						<div className="pt-4">
							<p className="text-sm text-slate-400 mb-3 text-center">
								Apoie diretamente a pessoa física que coda o projeto:
							</p>

							<Button
								onClick={handleCopyPix}
								className={`w-full py-6 text-lg font-bold transition-all ${copied
										? "bg-green-600 hover:bg-green-700 text-white"
										: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50"
									}`}
							>
								<Code className="mr-2" size={20} />
								{copied ? "Chave Copiada!" : "Copiar PIX do Dev (R$ 2.000 meta)"}
							</Button>
							<p className="text-center text-xs text-slate-500 mt-2 font-mono">
								Chave: {devPixKey} (Daniel Arraes / Banco Neon)
							</p>
						</div>
					</CardContent>
				</Card>

			</div>
		</div>
	);
}
