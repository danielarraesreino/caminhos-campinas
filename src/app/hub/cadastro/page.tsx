"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOfflineDB } from "@/features/offline-db/useOfflineDB";
import { ArrowLeft, CheckCircle2, HeartHandshake } from "lucide-react";
import Link from "next/link";

interface PartnerForm {
	name: string;
	area: string;
	whatsapp: string;
	pix: string;
}

export default function PartnerRegistrationPage() {
	const { saveLocally } = useOfflineDB("partner_requests");
	const [isSuccess, setIsSuccess] = useState(false);

	const { register, handleSubmit, setValue } = useForm<PartnerForm>();

	const onSubmit = async (data: PartnerForm) => {
		try {
			await saveLocally({
				...data,
				type: "partner_request",
				createdAt: new Date().toISOString(),
			});
			setIsSuccess(true);
		} catch (error) {
			console.error("Failed to save", error);
		}
	};

	if (isSuccess) {
		return (
			<div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
				<div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
					<CheckCircle2 className="w-8 h-8 text-green-500" />
				</div>
				<h1 className="text-2xl font-black text-white mb-2">Cadastro Salvo Localmente!</h1>
				<p className="text-slate-400 mb-8 max-w-sm mx-auto">
					Seus dados foram armazenados no dispositivo e serão sincronizados com a rede assim que possível.
				</p>
				<Link href="/">
					<Button variant="outline" className="border-slate-800 text-slate-300 hover:text-white">
						Voltar ao Início
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#050507] text-slate-200">
			<header className="p-6 border-b border-slate-900 flex items-center gap-4">
				<Link href="/">
					<Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
						<ArrowLeft size={20} />
					</Button>
				</Link>
				<h1 className="text-xl font-bold flex items-center gap-2">
					<HeartHandshake className="text-blue-500" /> Hub de Parceiros
				</h1>
			</header>

			<main className="max-w-xl mx-auto p-6 md:p-10">
				<div className="mb-8">
					<h2 className="text-3xl font-black text-white mb-2">Junte-se à Rede</h2>
					<p className="text-slate-400">
						Coletivos, ONGs e Movimentos Sociais: cadastrem-se para aparecer no mapa e receber doações diretas.
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
					<div className="space-y-2">
						<Label htmlFor="name" className="text-xs uppercase tracking-widest text-slate-500">Nome do Coletivo / ONG</Label>
						<Input
							id="name"
							placeholder="Ex: Banho Solidário Campinas"
							className="bg-slate-950 border-slate-800 focus:border-blue-500"
							{...register("name", { required: true })}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="area" className="text-xs uppercase tracking-widest text-slate-500">Área de Atuação</Label>
						<Select onValueChange={(val: string) => setValue("area", val)}>
							<SelectTrigger className="bg-slate-950 border-slate-800">
								<SelectValue placeholder="Selecione a área principal" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="alimentacao">Alimentação / Marmitas</SelectItem>
								<SelectItem value="higiene">Banho / Higiene</SelectItem>
								<SelectItem value="juridico">Apoio Jurídico</SelectItem>
								<SelectItem value="saude">Saúde / Redução de Danos</SelectItem>
								<SelectItem value="acolhimento">Acolhimento / Escuta</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="whatsapp" className="text-xs uppercase tracking-widest text-slate-500">WhatsApp de Contato</Label>
						<Input
							id="whatsapp"
							placeholder="(19) 99999-9999"
							className="bg-slate-950 border-slate-800 focus:border-blue-500"
							{...register("whatsapp", { required: true })}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="pix" className="text-xs uppercase tracking-widest text-slate-500">Chave Pix (Para Doações)</Label>
						<Input
							id="pix"
							placeholder="CNPJ, E-mail ou Aleatória"
							className="bg-slate-950 border-slate-800 focus:border-blue-500"
							{...register("pix")}
						/>
						<p className="text-[10px] text-slate-500">
							* A chave será exibida publicamente para doadores.
						</p>
					</div>

					<Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold uppercase tracking-widest text-sm rounded-xl mt-6">
						Salvar Cadastro (Offline)
					</Button>
				</form>
			</main>
		</div>
	);
}
