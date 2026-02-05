import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ParceriasPage() {
	return (
		<main className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
				<Image
					src="/images/sobrio/recursos.png"
					alt="Fundo Parcerias - Realismo Sóbrio"
					fill
					priority
					className="object-cover"
					quality={85}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
			</div>

			<div className="relative z-10 pt-24 pb-20 max-w-4xl mx-auto px-4 space-y-12">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">
						Conexão <span className="text-blue-500">Corporativa</span> &{" "}
						<span className="text-purple-500">Educacional</span>
					</h1>
					<p className="text-slate-300 text-lg max-w-2xl mx-auto">
						Sua organização busca impacto real? O Caminhos Campinas oferece
						inteligência social auditável e oportunidades de voluntariado
						técnico.
					</p>
				</div>

				<Tabs defaultValue="company" className="w-full">
					<div className="flex justify-center mb-8">
						<TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-slate-900 border border-slate-800">
							<TabsTrigger
								value="company"
								className="data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 data-[state=active]:font-bold text-slate-400 hover:text-white"
							>
								Empresas (ESG)
							</TabsTrigger>
							<TabsTrigger
								value="volunteer"
								className="data-[state=active]:bg-slate-800 data-[state=active]:text-purple-400 data-[state=active]:font-bold text-slate-400 hover:text-white"
							>
								Voluntários
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="company">
						<Card className="border-t-4 border-t-blue-600 shadow-xl bg-slate-900/80 backdrop-blur-sm border-x border-b border-slate-800">
							<CardHeader>
								<div className="flex items-center gap-4">
									<div className="p-3 bg-blue-900/40 rounded-lg text-blue-400 border border-blue-500/20">
										<Building2 size={32} />
									</div>
									<div>
										<CardTitle className="text-white">
											Investimento Social Corporativo
										</CardTitle>
										<CardDescription className="text-slate-400">
											Receba relatórios de impacto ODS 1, 3 e 10.
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label className="text-slate-300">Nome da Empresa</Label>
										<Input
											className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
											placeholder="Ex: Tech Solutions Ltda"
										/>
									</div>
									<div className="space-y-2">
										<Label className="text-slate-300">CNPJ</Label>
										<Input
											className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
											placeholder="00.000.000/0001-91"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label className="text-slate-300">E-mail Corporativo</Label>
									<Input
										className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
										type="email"
										placeholder="contato@empresa.com.br"
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-slate-300">Interesse Principal</Label>
									<select className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
										<option>Patrocínio de Turma (Agilizadores)</option>
										<option>Workshop "Custo da Ignorância"</option>
										<option>Relatório de Inteligência de Dados</option>
									</select>
								</div>
								<div className="pt-4">
									<Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-white">
										Solicitar Proposta ESG{" "}
										<ArrowRight className="ml-2 w-4 h-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="volunteer">
						<Card className="border-t-4 border-t-purple-600 shadow-xl bg-slate-900/80 backdrop-blur-sm border-x border-b border-slate-800">
							<CardHeader>
								<div className="flex items-center gap-4">
									<div className="p-3 bg-purple-900/40 rounded-lg text-purple-400 border border-purple-500/20">
										<GraduationCap size={32} />
									</div>
									<div>
										<CardTitle className="text-white">
											Voluntariado Técnico
										</CardTitle>
										<CardDescription className="text-slate-400">
											Doe horas de conhecimento (Psicologia, Direito, Tech).
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label className="text-slate-300">Nome Completo</Label>
									<Input
										className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
										placeholder="Seu nome"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label className="text-slate-300">Área de Atuação</Label>
										<Input
											className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
											placeholder="Ex: Psicólogo, Dev, Advogado"
										/>
									</div>
									<div className="space-y-2">
										<Label className="text-slate-300">WhatsApp</Label>
										<Input
											className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
											placeholder="(19) 99999-9999"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label className="text-slate-300">Disponibilidade</Label>
									<select className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
										<option>Aula Única (Convidado)</option>
										<option>Mentoria Recorrente (1x mês)</option>
										<option>Apoio Operacional (Eventos)</option>
									</select>
								</div>
								<div className="pt-4">
									<Button className="w-full bg-purple-600 hover:bg-purple-700 font-bold text-white">
										Cadastrar como Voluntário{" "}
										<ArrowRight className="ml-2 w-4 h-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</main>
	);
}
