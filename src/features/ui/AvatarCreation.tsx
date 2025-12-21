"use client";

import { useState } from "react";
import {
	User,
	Shield,
	Info,
	ArrowRight,
	ArrowLeft,
	Heart,
	Target,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameContext, type Avatar } from "@/contexts/GameContext";

interface AvatarCreationProps {
	onComplete: () => void;
	onBack: () => void;
}

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
	});

	const handleNext = () => {
		if (step < 4) setStep(step + 1);
		else {
			resetGame();
			setAvatar(formData);
			onComplete();
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
		<div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-2xl mx-auto p-6 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-fade-in">
			{/* Header */}
			<div className="w-full mb-8 text-center">
				<div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-blue-300 text-xs font-bold mb-4">
					<User className="h-3 w-3" />
					CONSTRUÇÃO DE IDENTIDADE
				</div>
				<h2 className="text-3xl font-bold text-white mb-2">
					Quem é você na rua?
				</h2>
				<div className="flex justify-center gap-2 mt-4">
					{[1, 2, 3, 4].map((s) => (
						<div
							key={s}
							className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= s ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-slate-700"}`}
						/>
					))}
				</div>
			</div>

			{/* Step Content */}
			<div className="w-full flex-1">
				{step === 1 && (
					<div className="space-y-6 animate-slide-up">
						<div>
							<label className="block text-sm font-medium text-slate-400 mb-2">
								Como seu personagem é chamado?
							</label>
							<Input
								value={formData.name}
								onChange={(e) => updateField("name", e.target.value)}
								placeholder="Ex: Zé do Pátio, Maria da Praça..."
								className="bg-slate-800/50 border-slate-700 text-white h-12 focus:ring-blue-500"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-400 mb-2">
									Gênero
								</label>
								<select
									title="Selecione o gênero"
									className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-blue-500"
									value={formData.gender}
									onChange={(e) => updateField("gender", e.target.value)}
								>
									<option value="masculino">Masculino</option>
									<option value="feminino">Feminino</option>
									<option value="trans">Trans / Travesti</option>
									<option value="nao-binario">Não-binário</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-400 mb-2">
									Idade
								</label>
								<select
									title="Selecione a faixa etária"
									className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-blue-500"
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
					<div className="space-y-6 animate-slide-up">
						<label className="block text-sm font-medium text-slate-400 mb-4">
							Etnia (Afeta o estigma social inicial)
						</label>
						<div className="grid grid-cols-2 gap-3">
							{["branco", "preto", "pardo", "indigena"].map((eth) => (
								<button
									key={eth}
									onClick={() => updateField("ethnicity", eth)}
									className={`p-4 rounded-xl border text-left transition-all ${formData.ethnicity === eth ? "bg-blue-600 border-blue-400 scale-[1.02] shadow-lg" : "bg-slate-800/40 border-slate-700 hover:border-slate-500"}`}
								>
									<span className="capitalize font-bold text-white">{eth}</span>
									{eth === "preto" || eth === "pardo" ? (
										<p className="text-[10px] text-blue-200 mt-1 flex items-center gap-1">
											<Shield className="h-3 w-3" /> + ESTIGMA SOCIAL
										</p>
									) : (
										<p className="text-[10px] text-slate-500 mt-1">
											Estigma padrão
										</p>
									)}
								</button>
							))}
						</div>
					</div>
				)}

				{step === 3 && (
					<div className="space-y-6 animate-slide-up">
						<label className="block text-sm font-medium text-slate-400 mb-4">
							Tempo em situação de rua
						</label>
						<div className="flex flex-col gap-4">
							<button
								onClick={() => updateField("timeOnStreet", "recente")}
								className={`p-6 rounded-2xl border text-left transition-all ${formData.timeOnStreet === "recente" ? "bg-blue-600 border-blue-400 shadow-lg" : "bg-slate-800/40 border-slate-700"}`}
							>
								<div className="flex justify-between items-center mb-2">
									<span className="font-bold text-white text-lg">
										Recém-chegado
									</span>
									<Sparkles className="h-5 w-5 text-yellow-400" />
								</div>
								<p className="text-sm text-blue-100">
									"Ainda tenho fôlego, mas me perco fácil no centro."
								</p>
								<div className="mt-4 flex gap-2">
									<span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white">
										+ SANIDADE
									</span>
									<span className="text-[10px] bg-red-400/20 px-2 py-0.5 rounded text-red-200">
										- EXPERIÊNCIA
									</span>
								</div>
							</button>
							<button
								onClick={() => updateField("timeOnStreet", "veterano")}
								className={`p-6 rounded-2xl border text-left transition-all ${formData.timeOnStreet === "veterano" ? "bg-blue-600 border-blue-400 shadow-lg" : "bg-slate-800/40 border-slate-700"}`}
							>
								<div className="flex justify-between items-center mb-2">
									<span className="font-bold text-white text-lg">Veterano</span>
									<Target className="h-5 w-5 text-orange-400" />
								</div>
								<p className="text-sm text-blue-100">
									"Conheço cada marquise, mas a alma pesa."
								</p>
								<div className="mt-4 flex gap-2">
									<span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white">
										+ CARRINHO INICIAL
									</span>
									<span className="text-[10px] bg-red-400/20 px-2 py-0.5 rounded text-red-200">
										- SANIDADE CRÍTICA
									</span>
								</div>
							</button>
						</div>
					</div>
				)}

				{step === 4 && (
					<div className="space-y-6 animate-slide-up text-center">
						<div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl mb-8">
							<h3 className="text-xl font-bold text-white mb-4">
								Resumo da Identidade
							</h3>
							<div className="space-y-3 text-left max-w-xs mx-auto">
								<p className="text-slate-300 flex items-center justify-between">
									<span>Nome:</span>{" "}
									<span className="text-white font-bold">{formData.name}</span>
								</p>
								<p className="text-slate-300 flex items-center justify-between">
									<span>Gênero:</span>{" "}
									<span className="text-white capitalize">
										{formData.gender}
									</span>
								</p>
								<p className="text-slate-300 flex items-center justify-between">
									<span>Etnia:</span>{" "}
									<span className="text-white capitalize">
										{formData.ethnicity}
									</span>
								</p>
								<p className="text-slate-300 flex items-center justify-between">
									<span>Situação:</span>{" "}
									<span className="text-white capitalize">
										{formData.timeOnStreet}
									</span>
								</p>
							</div>
						</div>
						<div className="flex items-start gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-left">
							<Info className="h-5 w-5 text-yellow-400 shrink-0 mt-1" />
							<p className="text-xs text-yellow-200/80 leading-relaxed">
								Suas características definem como as instituições e a população
								de Campinas interagem com você. Este é um simulador baseado na
								realidade sociológica local.
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Footer Buttons */}
			<div className="w-full flex gap-4 mt-8">
				<Button
					variant="ghost"
					onClick={handleBack}
					className="flex-1 text-slate-400 hover:text-white"
				>
					<ArrowLeft className="h-4 w-4 mr-2" /> Voltar
				</Button>
				<Button
					onClick={handleNext}
					disabled={step === 1 && !formData.name}
					className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-blue-500/25"
				>
					{step === 4 ? "INICIAR JORNADA" : "CONTINUAR"}{" "}
					<ArrowRight className="h-4 w-4 ml-2" />
				</Button>
			</div>
		</div>
	);
}
