"use client";

import {
	ArrowLeft,
	ArrowRight,
	Camera,
	Info,
	Shield,
	Sparkles,
	Target,
	User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Avatar, useGameContext } from "@/contexts/GameContext";

interface AvatarCreationProps {
	onComplete: () => void;
	onBack: () => void;
}

import { getAssetUrl } from "@/utils/getAssetUrl";

const AVATAR_OPTIONS = [
	{
		id: "avatar_1",
		image: getAssetUrl("avatars/avatar_1.png"),
		label: "Identidade A",
		gender: "masculino",
		age: "maduro",
	},
	{
		id: "avatar_2",
		image: getAssetUrl("avatars/avatar_2.png"),
		label: "Identidade B",
		gender: "trans",
		age: "adulto",
	},
];

export function AvatarCreation({ onComplete, onBack }: AvatarCreationProps) {
	const { setAvatar, resetGame } = useGameContext();
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState<Avatar>({
		name: "",
		gender: "masculino",
		ethnicity: "branco",
		ageRange: "adulto",
		timeOnStreet: "recente",
		startingSkill: "nenhuma",
		avatarImage: AVATAR_OPTIONS[0].image,
	});

	const [isSaving, setIsSaving] = useState(false);

	const handleNext = async () => {
		if (step < 5) {
			setStep(step + 1);
		} else {
			setIsSaving(true);
			try {
				await resetGame(); // Ensure DB is cleared first
				setAvatar(formData);
				// Small delay to ensure state propagation/persistence start
				await new Promise((resolve) => setTimeout(resolve, 500));
				onComplete();
			} catch (error) {
				console.error("Erro ao salvar avatar:", error);
				setIsSaving(false);
			}
		}
	};

	const handleBack = () => {
		if (step > 1) setStep(step - 1);
		else onBack();
	};

	const updateField = (field: keyof Avatar, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[650px] w-full max-w-2xl mx-auto p-8 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-2xl animate-fade-in relative overflow-hidden">
			{/* Decorative elements */}
			<div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
			<div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl"></div>

			{/* Header */}
			<div className="w-full mb-10 text-center relative z-10">
				<div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-4 py-1.5 rounded-full text-blue-300 text-xs font-black mb-6 uppercase tracking-widest">
					<User className="h-4 w-4" />
					Construção de Identidade
				</div>
				<h2 className="text-4xl font-black text-white mb-2 italic tracking-tighter">
					Quem é você nesta jornada?
				</h2>
				<p className="text-slate-400 text-sm font-sans">
					Cada detalhe molda as interações e desafios que virão.
				</p>

				<div className="flex justify-center gap-2 mt-8">
					{[1, 2, 3, 4, 5].map((s) => (
						<div
							key={s}
							className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step >= s ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-slate-800"}`}
						/>
					))}
				</div>
			</div>

			{/* Step Content */}
			<div className="w-full flex-1 relative z-10">
				{step === 1 && (
					<div className="space-y-8 animate-slide-up">
						<div className="space-y-4">
							<label
								htmlFor="avatar-name"
								className="block text-sm font-black text-slate-400 uppercase tracking-widest"
							>
								Como seu personagem é chamado?
							</label>
							<Input
								id="avatar-name"
								value={formData.name}
								onChange={(e) => updateField("name", e.target.value)}
								placeholder="Ex: Zé do Pátio, Maria da Praça..."
								className="bg-slate-800/50 border-slate-700 text-white h-14 text-xl font-bold focus:ring-blue-500 rounded-2xl placeholder:text-slate-600"
							/>
						</div>
						<div className="grid grid-cols-2 gap-6">
							<div className="space-y-4">
								<label className="block text-sm font-black text-slate-400 uppercase tracking-widest">
									Gênero
								</label>
								<select
									title="Selecione o gênero"
									className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white font-bold focus:ring-blue-500"
									value={formData.gender}
									onChange={(e) => updateField("gender", e.target.value)}
								>
									<option value="masculino">Masculino</option>
									<option value="feminino">Feminino</option>
									<option value="trans">Trans / Travesti</option>
									<option value="nao-binario">Não-binário</option>
								</select>
							</div>
							<div className="space-y-4">
								<label className="block text-sm font-black text-slate-400 uppercase tracking-widest">
									Faixa Etária
								</label>
								<select
									title="Selecione a faixa etária"
									className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white font-bold focus:ring-blue-500"
									value={formData.ageRange}
									onChange={(e) => updateField("ageRange", e.target.value)}
								>
									<option value="jovem">Jovem (18-29)</option>
									<option value="adulto">Adulto (30-59)</option>
									<option value="idoso">Idoso (60+)</option>
								</select>
							</div>
						</div>
					</div>
				)}

				{step === 2 && (
					<div className="space-y-8 animate-slide-up">
						<div className="flex items-center gap-3 mb-2">
							<Camera size={20} className="text-blue-500" />
							<label className="block text-sm font-black text-slate-400 uppercase tracking-widest">
								Selecione uma Imagem de Identidade
							</label>
						</div>
						<div className="grid grid-cols-2 gap-8">
							{AVATAR_OPTIONS.map((opt) => (
								<button
									type="button"
									key={opt.id}
									onClick={() => updateField("avatarImage", opt.image)}
									className={`relative aspect-square rounded-3xl overflow-hidden border-4 transition-all duration-300 group
										${formData.avatarImage === opt.image ? "border-blue-500 scale-105 shadow-[0_0_40px_rgba(59,130,246,0.3)]" : "border-slate-800 hover:border-slate-600"}
									`}
								>
									<Image
										src={opt.image}
										alt={opt.label}
										fill
										className={`object-cover ${formData.avatarImage === opt.id ? "opacity-100" : "opacity-40 hover:opacity-100"} transition-opacity`}
									/>
									<div
										className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-transform
										${formData.avatarImage === opt.image ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"}
									`}
									>
										<span className="text-white font-black text-xs uppercase tracking-tighter">
											{opt.label}
										</span>
									</div>
								</button>
							))}
						</div>
					</div>
				)}

				{step === 3 && (
					<div className="space-y-6 animate-slide-up">
						<label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
							Etnia (Fator de Estigma Social Inicial)
						</label>
						<div className="grid grid-cols-2 gap-4">
							{["branco", "preto", "pardo", "indigena"].map((eth) => (
								<button
									type="button"
									key={eth}
									onClick={() => updateField("ethnicity", eth)}
									className={`p-6 rounded-2xl border-2 text-left transition-all relative group ${formData.ethnicity === eth ? "bg-blue-600 border-blue-400 scale-[1.02] shadow-xl" : "bg-slate-800/40 border-slate-800 hover:border-slate-600"}`}
								>
									<span
										className={`capitalize font-black text-lg ${formData.ethnicity === eth ? "text-white" : "text-slate-300"}`}
									>
										{eth}
									</span>
									{eth === "preto" || eth === "pardo" ? (
										<p
											className={`text-[10px] font-bold mt-2 flex items-center gap-1 uppercase ${formData.ethnicity === eth ? "text-blue-100" : "text-blue-500"}`}
										>
											<Shield className="h-4 w-4" /> Maior risco de abordagem
										</p>
									) : (
										<p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-tighter">
											Baixo estigma inicial
										</p>
									)}
								</button>
							))}
						</div>
					</div>
				)}

				{step === 4 && (
					<div className="space-y-6 animate-slide-up">
						<p className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
							Tempo de Sobrevivência na Rua
						</p>
						<div className="flex flex-col gap-5">
							<button
								type="button"
								onClick={() => updateField("timeOnStreet", "recente")}
								className={`p-8 rounded-3xl border-2 text-left transition-all ${formData.timeOnStreet === "recente" ? "bg-blue-600 border-blue-400 shadow-2xl" : "bg-slate-800/40 border-slate-800"}`}
							>
								<div className="flex justify-between items-center mb-3">
									<span
										className={`font-black uppercase tracking-tight text-xl ${formData.timeOnStreet === "recente" ? "text-white" : "text-slate-200"}`}
									>
										Recém-chegado
									</span>
									<Sparkles className="h-6 w-6 text-yellow-400" />
								</div>
								<p className="text-sm text-blue-100/80 font-sans italic">
									"A memória da casa ainda é viva, mas as noites são frias e
									confusas."
								</p>
								<div className="mt-6 flex gap-3">
									<span className="text-[10px] bg-white/20 px-3 py-1 rounded-full text-white font-black uppercase tracking-widest">
										+ Resiliência Psíquica
									</span>
									<span className="text-[10px] bg-red-400/20 px-3 py-1 rounded-full text-red-100 font-black uppercase tracking-widest">
										- Senso de Direção
									</span>
								</div>
							</button>
							<button
								type="button"
								onClick={() => updateField("timeOnStreet", "veterano")}
								className={`p-8 rounded-3xl border-2 text-left transition-all ${formData.timeOnStreet === "veterano" ? "bg-blue-600 border-blue-400 shadow-2xl" : "bg-slate-800/40 border-slate-800"}`}
							>
								<div className="flex justify-between items-center mb-3">
									<span
										className={`font-black uppercase tracking-tight text-xl ${formData.timeOnStreet === "veterano" ? "text-white" : "text-slate-200"}`}
									>
										Veterano
									</span>
									<Target className="h-6 w-6 text-orange-500" />
								</div>
								<p className="text-sm text-blue-100/80 font-sans italic">
									"Conheço cada marquise de Campinas, mas o corpo pede
									descanso."
								</p>
								<div className="mt-6 flex gap-3">
									<span className="text-[10px] bg-white/20 px-3 py-1 rounded-full text-white font-black uppercase tracking-widest">
										+ Recursos Iniciais
									</span>
									<span className="text-[10px] bg-red-400/20 px-3 py-1 rounded-full text-red-100 font-black uppercase tracking-widest">
										- Sanidade Crítica
									</span>
								</div>
							</button>
						</div>
					</div>
				)}

				{step === 5 && (
					<div className="space-y-10 animate-slide-up">
						<div className="flex flex-col md:flex-row gap-10 items-center bg-blue-600/10 border border-blue-500/20 p-10 rounded-[40px]">
							<div className="relative w-40 h-40 rounded-3xl overflow-hidden border-4 border-blue-500 shadow-2xl flex-none">
								<Image
									src={formData.avatarImage || AVATAR_OPTIONS[0].image}
									alt="Avatar Final"
									fill
									className="object-cover"
								/>
							</div>
							<div className="space-y-4 flex-1 text-left w-full">
								<h3 className="text-3xl font-black text-white italic">
									{formData.name}
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<InfoItem label="Gênero" value={formData.gender} />
									<InfoItem label="Etnia" value={formData.ethnicity} />
									<InfoItem label="Idade" value={formData.ageRange} />
									<InfoItem label="Contexto" value={formData.timeOnStreet} />
								</div>
							</div>
						</div>
						<div className="flex items-start gap-4 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl text-left">
							<div className="bg-yellow-500/20 p-2 rounded-lg">
								<Info className="h-6 w-6 text-yellow-400 shrink-0" />
							</div>
							<p className="text-sm text-yellow-200/80 leading-relaxed font-sans">
								<strong>Importante:</strong> Suas características baseadas em
								fatos sociológicos da Região de Campinas determinarão como
								instituições (SOS Rua, Guarda Municipal) e cidadãos interagem
								com você.
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Footer Buttons */}
			<div className="w-full flex gap-4 mt-12 relative z-10">
				<Button
					variant="ghost"
					onClick={handleBack}
					className="flex-1 text-slate-500 hover:text-white font-black uppercase tracking-widest h-14 rounded-2xl"
				>
					<ArrowLeft className="h-4 w-4 mr-2" /> Voltar
				</Button>
				<Button
					onClick={handleNext}
					disabled={(step === 1 && !formData.name) || isSaving}
					className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest h-14 rounded-2xl transition-all shadow-xl shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isSaving
						? "Salvando..."
						: step === 5
							? "Iniciar Jornada"
							: "Próximo Passo"}{" "}
					<ArrowRight className="h-4 w-4 ml-2" />
				</Button>
			</div>
		</div>
	);
}

function InfoItem({ label, value }: { label: string; value: string }) {
	return (
		<div className="space-y-1">
			<span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">
				{label}
			</span>
			<span className="text-white font-bold capitalize">{value}</span>
		</div>
	);
}
