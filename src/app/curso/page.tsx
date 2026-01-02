"use client";

import {
	ArrowLeft,
	BookOpen,
	Download,
	HardHat,
	Phone,
	Send,
	User,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function CoursePage() {
	const [contactMethod, setContactMethod] = useState<
		"whatsapp" | "email" | "proxy"
	>("whatsapp");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
		// Simulate API call
		setTimeout(() => setSubmitted(false), 3000);
	};

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
			<div className="max-w-4xl mx-auto space-y-8 p-6 pt-24">
				{/* Header */}
				<header className="flex items-center gap-4 border-b border-slate-800 pb-6">
					<Link
						href="/"
						className="p-2 hover:bg-slate-900 rounded-full transition-colors group"
					>
						<ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
					</Link>
					<div>
						<h1 className="text-3xl font-black uppercase tracking-tighter text-white">
							Formação de Agentes
						</h1>
						<p className="text-slate-400">
							Capacitação Técnica e Redução de Danos
						</p>
					</div>
				</header>

				<div className="grid md:grid-cols-2 gap-12">
					{/* Course Details */}
					<div className="space-y-8">
						<section className="space-y-4">
							<div className="inline-block bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5">
								<span className="text-emerald-300 font-bold text-xs uppercase tracking-widest">
									Turma Piloto 2026
								</span>
							</div>
							<h2 className="text-2xl font-bold text-white leading-tight">
								Agente de Redução de Danos e Tecnologia Social
							</h2>
							<p className="text-slate-300 leading-relaxed">
								Formação gratuita para pessoas com trajetória de rua. Aprenda a
								usar dados, leis e tecnologia para transformar a sua realidade e
								a da sua comunidade.
							</p>
						</section>

						<section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
							<h3 className="font-bold text-white flex items-center gap-2">
								<BookOpen className="w-5 h-5 text-blue-400" />O que você vai
								aprender:
							</h3>
							<ul className="space-y-3 text-sm text-slate-400">
								<li className="flex items-start gap-3">
									<span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
									Cartografia Social: Mapeando serviços e territórios.
								</li>
								<li className="flex items-start gap-3">
									<span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
									Direito de Rua: Como acessar LOAS, Auxílios e Documentos.
								</li>
								<li className="flex items-start gap-3">
									<span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
									Redução de Danos: Cuidado entre pares e saúde mental.
								</li>
							</ul>
							<div className="pt-4 border-t border-slate-800">
								<a
									href="/assets/docs/ementa-curso-piloto.txt"
									download
									className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg text-sm font-bold transition-colors w-full border border-slate-700 hover:border-slate-600"
								>
									<Download className="w-4 h-4" /> Baixar Ementa Completa (.txt)
								</a>
							</div>
						</section>
					</div>

					{/* Inscription Form */}
					<div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
						<div className="mb-6">
							<h3 className="text-xl font-bold text-white mb-1">
								Inscrição Rápida
							</h3>
							<p className="text-sm text-slate-400">
								Garanta sua vaga na lista de espera.
							</p>
						</div>

						{submitted ? (
							<div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl text-center space-y-2 animate-in fade-in zoom-in">
								<div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-400">
									<Send size={24} />
								</div>
								<h4 className="font-bold text-white">Inscrição Enviada!</h4>
								<p className="text-sm text-emerald-200">
									Entraremos em contato em breve.
								</p>
								<Button
									onClick={() => setSubmitted(false)}
									variant="ghost"
									className="text-xs text-slate-400 mt-4 h-auto p-0 hover:text-white hover:bg-transparent"
								>
									Nova inscrição
								</Button>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-5">
								<div className="space-y-2">
									<Label htmlFor="name">Seu Nome Completo</Label>
									<Input
										id="name"
										placeholder="Como você quer ser chamado?"
										required
										className="bg-slate-950 border-slate-800 focus:border-blue-500 text-white"
									/>
								</div>

								<div className="space-y-2">
									<Label>Forma de Contato</Label>
									<div className="grid grid-cols-3 gap-2">
										<button
											type="button"
											onClick={() => setContactMethod("whatsapp")}
											className={`p-2 rounded-lg text-xs font-bold border transition-all ${contactMethod === "whatsapp"
													? "bg-green-600 border-green-500 text-white"
													: "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
												}`}
										>
											Whatsapp
										</button>
										<button
											type="button"
											onClick={() => setContactMethod("email")}
											className={`p-2 rounded-lg text-xs font-bold border transition-all ${contactMethod === "email"
													? "bg-blue-600 border-blue-500 text-white"
													: "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
												}`}
										>
											E-mail
										</button>
										<button
											type="button"
											onClick={() => setContactMethod("proxy")}
											className={`p-2 rounded-lg text-xs font-bold border transition-all ${contactMethod === "proxy"
													? "bg-purple-600 border-purple-500 text-white"
													: "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
												}`}
										>
											Recado
										</button>
									</div>
								</div>

								<div className="space-y-4 p-4 bg-slate-950 rounded-xl border border-slate-800/50">
									{contactMethod === "whatsapp" && (
										<div className="space-y-2 animate-in slide-in-from-left-2">
											<Label htmlFor="phone">Seu Whatsapp</Label>
											<div className="relative">
												<Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
												<Input
													id="phone"
													type="tel"
													placeholder="(19) 99999-9999"
													required
													className="pl-9 bg-slate-900 border-slate-800 text-white"
												/>
											</div>
										</div>
									)}

									{contactMethod === "email" && (
										<div className="space-y-2 animate-in slide-in-from-left-2">
											<Label htmlFor="email">Seu E-mail</Label>
											<Input
												id="email"
												type="email"
												placeholder="exemplo@email.com"
												required
												className="bg-slate-900 border-slate-800 text-white"
											/>
										</div>
									)}

									{contactMethod === "proxy" && (
										<div className="space-y-4 animate-in slide-in-from-left-2">
											<div className="space-y-2">
												<Label htmlFor="proxyName" className="text-purple-300">
													Nome da Pessoa de Referência
												</Label>
												<div className="relative">
													<User className="absolute left-3 top-2.5 h-4 w-4 text-purple-500" />
													<Input
														id="proxyName"
														placeholder="Ex: Maria (Assistente Social)"
														required
														className="pl-9 bg-slate-900 border-slate-800 text-white"
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label
													htmlFor="proxyService"
													className="text-purple-300"
												>
													Local de Referência (Serviço)
												</Label>
												<div className="relative">
													<HardHat className="absolute left-3 top-2.5 h-4 w-4 text-purple-500" />
													<Select required>
														<SelectTrigger
															id="proxyService"
															className="pl-9 bg-slate-900 border-slate-800 text-white"
														>
															<SelectValue placeholder="Selecione o local..." />
														</SelectTrigger>
														<SelectContent className="bg-slate-900 border-slate-800 text-white">
															<SelectItem value="caps_ad">CAPS AD</SelectItem>
															<SelectItem value="centro_pop">
																Centro Pop
															</SelectItem>
															<SelectItem value="consultorio">
																Consultório na Rua
															</SelectItem>
															<SelectItem value="albergue">
																Albergue / Samim
															</SelectItem>
															<SelectItem value="outro">Outro</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>
											<p className="text-xs text-slate-500 italic">
												* Entraremos em contato com esta pessoa para te avisar
												sobre o curso.
											</p>
										</div>
									)}
								</div>

								<Button
									type="submit"
									className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg"
								>
									Realizar Pré-Inscrição
								</Button>
							</form>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
