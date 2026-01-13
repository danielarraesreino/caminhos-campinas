import { ArrowRight, Building2, GraduationCap } from "lucide-react";
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
		<div className="min-h-screen bg-slate-50 pb-20 pt-24 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
						Conexão <span className="text-blue-600">Corporativa</span> &{" "}
						<span className="text-purple-600">Educacional</span>
					</h1>
					<p className="text-slate-600 text-lg max-w-2xl mx-auto">
						Sua organização busca impacto real? O Caminhos Campinas oferece
						inteligência social auditável e oportunidades de voluntariado
						técnico.
					</p>
				</div>

				<Tabs defaultValue="company" className="w-full">
					<div className="flex justify-center mb-8">
						<TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-slate-200">
							<TabsTrigger
								value="company"
								className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:font-bold"
							>
								Empresas (ESG)
							</TabsTrigger>
							<TabsTrigger
								value="volunteer"
								className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:font-bold"
							>
								Voluntários
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="company">
						<Card className="border-t-4 border-t-blue-600 shadow-xl">
							<CardHeader>
								<div className="flex items-center gap-4">
									<div className="p-3 bg-blue-100 rounded-lg text-blue-700">
										<Building2 size={32} />
									</div>
									<div>
										<CardTitle>Investimento Social Corporativo</CardTitle>
										<CardDescription>
											Receba relatórios de impacto ODS 1, 3 e 10.
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label>Nome da Empresa</Label>
										<Input placeholder="Ex: Tech Solutions Ltda" />
									</div>
									<div className="space-y-2">
										<Label>CNPJ</Label>
										<Input placeholder="00.000.000/0001-91" />
									</div>
								</div>
								<div className="space-y-2">
									<Label>E-mail Corporativo</Label>
									<Input type="email" placeholder="contato@empresa.com.br" />
								</div>
								<div className="space-y-2">
									<Label>Interesse Principal</Label>
									<select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
										<option>Patrocínio de Turma (Agilizadores)</option>
										<option>Workshop "Custo da Ignorância"</option>
										<option>Relatório de Inteligência de Dados</option>
									</select>
								</div>
								<div className="pt-4">
									<Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold">
										Solicitar Proposta ESG{" "}
										<ArrowRight className="ml-2 w-4 h-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="volunteer">
						<Card className="border-t-4 border-t-purple-600 shadow-xl">
							<CardHeader>
								<div className="flex items-center gap-4">
									<div className="p-3 bg-purple-100 rounded-lg text-purple-700">
										<GraduationCap size={32} />
									</div>
									<div>
										<CardTitle>Voluntariado Técnico</CardTitle>
										<CardDescription>
											Doe horas de conhecimento (Psicologia, Direito, Tech).
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label>Nome Completo</Label>
									<Input placeholder="Seu nome" />
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label>Área de Atuação</Label>
										<Input placeholder="Ex: Psicólogo, Dev, Advogado" />
									</div>
									<div className="space-y-2">
										<Label>WhatsApp</Label>
										<Input placeholder="(19) 99999-9999" />
									</div>
								</div>
								<div className="space-y-2">
									<Label>Disponibilidade</Label>
									<select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
										<option>Aula Única (Convidado)</option>
										<option>Mentoria Recorrente (1x mês)</option>
										<option>Apoio Operacional (Eventos)</option>
									</select>
								</div>
								<div className="pt-4">
									<Button className="w-full bg-purple-600 hover:bg-purple-700 font-bold">
										Cadastrar como Voluntário{" "}
										<ArrowRight className="ml-2 w-4 h-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
