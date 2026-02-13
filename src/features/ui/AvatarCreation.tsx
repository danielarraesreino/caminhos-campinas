"use client";

import {
	ArrowLeft,
	ArrowRight,
	Camera,
	CheckCircle2,
	Info,
	Loader2,
	Shield,
	Sparkles,
	Target,
	Upload,
	User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Avatar, useGameContext } from "@/contexts/GameContext";
import { useToast } from "@/contexts/ToastContext";
import { STORY_ARCS } from "@/data/story-arcs";

interface AvatarCreationProps {
	onComplete: () => void;
	onBack: () => void;
}

// import { getAssetUrl } from "@/utils/getAssetUrl";

const AVATAR_OPTIONS = [
	{
		id: "avatar_1",
		image: "/avatars/avatar_sober_male.png", // "Realismo Sóbrio" - Male
		label: "Retrato A",
		gender: "masculino",
		age: "maduro",
	},
	{
		id: "avatar_2",
		image: "/avatars/avatar_sober_female.png", // "Realismo Sóbrio" - Female
		label: "Retrato B",
		gender: "feminino",
		age: "idoso",
	},
];

// Hugging Face AI Image Generation
async function generateAIPortrait(prompt: string): Promise<string> {
	try {
		const response = await fetch(
			"https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN || ""}`,
				},
				body: JSON.stringify({ inputs: prompt }),
			},
		);

		if (!response.ok) {
			throw new Error("AI generation failed");
		}

		const blob = await response.blob();
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	} catch (error) {
		console.error("AI generation error:", error);
		throw error;
	}
}

export function AvatarCreation({ onComplete, onBack }: AvatarCreationProps) {
	const { setAvatar, resetGame, setActiveArc } = useGameContext();
	const { showToast } = useToast();
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
	const [activeArcId, setLocalActiveArcId] = useState<string | null>(null);

	const [isSaving, setIsSaving] = useState(false);
	const [isGeneratingAI, setIsGeneratingAI] = useState(false);
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);

	const handleNext = async () => {
		console.log("[AvatarCreation] Moving from step", step);
		if (step < 6) {
			setStep(step + 1);
		} else {
			setIsSaving(true);
			try {
				await resetGame(); // Ensure DB is cleared first
				setAvatar(formData);
				if (activeArcId) {
					setActiveArc(activeArcId);
				}
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

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setUploadedImage(reader.result as string);
				updateField("avatarImage", reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleGenerateAIImage = async () => {
		console.log("[AvatarCreation] Starting AI Generation...");
		setIsGeneratingAI(true);
		try {
			const prompt = `A highly realistic, documentary-style portrait of a ${formData.ageRange} person who identifies as ${formData.gender.replace("_", " ")}, ${formData.ethnicity} ethnicity, living on the streets of Campinas, Brazil. Natural lighting, solemn expression, premium photography, shallow depth of field.`;
			const imageUrl = await generateAIPortrait(prompt);
			console.log(
				"[AvatarCreation] AI Generation success, image size:",
				imageUrl?.length,
			);
			setUploadedImage(imageUrl);
			updateField("avatarImage", imageUrl);
			showToast("Retrato gerado com sucesso!", "success");
		} catch (error) {
			console.warn("[AvatarCreation] Failed to generate AI image:", error);
			showToast(
				"Erro ao gerar retrato IA. Escolha uma foto da galeria ou envie sua própria imagem.",
				"error",
			);
		} finally {
			console.log("[AvatarCreation] AI Generation finished");
			setIsGeneratingAI(false);
		}
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
					{[1, 2, 3, 4, 5, 6].map((s) => (
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
								onKeyDown={(e) => {
									if (e.key === "Enter" && formData.name?.trim()) {
										handleNext();
									}
								}}
								className="bg-slate-800/50 border-slate-700 text-white h-14 text-xl font-bold focus:ring-blue-500 rounded-2xl placeholder:text-slate-600"
							/>
						</div>
						<div className="grid grid-cols-2 gap-6">
							<div className="space-y-4">
								<label
									htmlFor="avatar-gender"
									className="block text-sm font-black text-slate-400 uppercase tracking-widest"
								>
									Gênero
								</label>
								<select
									id="avatar-gender"
									title="Selecione o gênero"
									data-testid="avatar-gender-select"
									className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white font-bold focus:ring-blue-500"
									value={formData.gender}
									onChange={(e) => updateField("gender", e.target.value)}
								>
									<option value="masculino">Masculino</option>
									<option value="feminino">Feminino</option>
									<option value="mulher_trans">Mulher Trans</option>
									<option value="homem_trans">Homem Trans</option>
									<option value="travesti">Travesti</option>
									<option value="nao-binario">Não-binário</option>
								</select>
							</div>
							<div className="space-y-4">
								<label
									htmlFor="avatar-age"
									className="block text-sm font-black text-slate-400 uppercase tracking-widest"
								>
									Faixa Etária
								</label>
								<select
									id="avatar-age"
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
							<span className="block text-sm font-black text-slate-400 uppercase tracking-widest">
								Selecione uma Imagem de Identidade
							</span>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
							{AVATAR_OPTIONS.map((opt) => (
								<button
									type="button"
									key={opt.id}
									onClick={() => updateField("avatarImage", opt.image)}
									className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-300 group
										${formData.avatarImage === opt.image ? "border-blue-500 scale-105 shadow-[0_0_40px_rgba(59,130,246,0.3)]" : "border-slate-800 hover:border-slate-600"}
									`}
								>
									<Image
										src={opt.image}
										alt={opt.label}
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										className={`object-cover ${formData.avatarImage === opt.image ? "opacity-100" : "opacity-80 hover:opacity-100"} transition-opacity grayscale hover:grayscale-0`}
									/>
									<div
										className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent transition-transform
										${formData.avatarImage === opt.image ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"}
									`}
									>
										<span className="text-white font-black text-[10px] uppercase tracking-tighter">
											{opt.label}
										</span>
									</div>
								</button>
							))}

							{/* CUSTOM UPLOAD PREVIEW */}
							{uploadedImage && (
								<button
									type="button"
									onClick={() => updateField("avatarImage", uploadedImage)}
									className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-300 group
										${formData.avatarImage === uploadedImage ? "border-blue-500 scale-105 shadow-[0_0_40px_rgba(59,130,246,0.3)]" : "border-slate-800 hover:border-slate-600"}
									`}
								>
									<Image
										src={uploadedImage}
										alt="Upload"
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										className="object-cover"
									/>
									<div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 drop-shadow-lg">
										<CheckCircle2 size={12} className="text-white" />
									</div>
								</button>
							)}

							{/* UPLOAD BUTTON */}
							<label className="relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 group hover:border-blue-500 transition-colors bg-slate-900/40 cursor-pointer">
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageUpload}
								/>
								<Upload className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
								<span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-400 uppercase text-center px-2">
									Carregar Foto
								</span>
							</label>

							{/* AI GENERATION BUTTON */}
							<button
								type="button"
								onClick={handleGenerateAIImage}
								disabled={isGeneratingAI}
								className={`relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 group hover:border-blue-500 transition-colors bg-slate-900/40
									${isGeneratingAI ? "cursor-wait opacity-80" : "cursor-pointer"}
								`}
							>
								{isGeneratingAI ? (
									<Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
								) : (
									<Sparkles className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
								)}
								<span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-400 uppercase text-center px-2">
									{isGeneratingAI ? "Gerando..." : "Criar com IA"}
								</span>
							</button>
						</div>
					</div>
				)}

				{step === 3 && (
					<div className="space-y-6 animate-slide-up">
						<span className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
							Etnia (Fator de Estigma Social Inicial)
						</span>
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
					<div className="space-y-6 animate-slide-up overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-slate-800">
						<span className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
							Escolha seu Caminho (Arco Narrativo)
						</span>
						<div className="grid grid-cols-1 gap-4">
							{Object.values(STORY_ARCS).map((arc) => (
								<button
									type="button"
									key={arc.id}
									onClick={() => setLocalActiveArcId(arc.id)}
									className={`p-5 rounded-2xl border-2 text-left transition-all relative group ${activeArcId === arc.id ? "bg-blue-600 border-blue-400 scale-[1.01] shadow-xl" : "bg-slate-800/40 border-slate-800 hover:border-slate-600"}`}
								>
									<div className="flex justify-between items-center mb-1">
										<span
											className={`font-black text-lg ${activeArcId === arc.id ? "text-white" : "text-slate-200"}`}
										>
											{arc.name}
										</span>
										<div className="flex gap-1">
											{arc.ods.map((ods) => (
												<span
													key={ods}
													className="text-[9px] bg-blue-900/50 px-2 py-0.5 rounded text-blue-200 border border-blue-500/30"
												>
													{ods}
												</span>
											))}
										</div>
									</div>
									<p
										className={`text-xs leading-relaxed ${activeArcId === arc.id ? "text-blue-100" : "text-slate-400"}`}
									>
										{arc.description}
									</p>
									{activeArcId === arc.id && (
										<div className="mt-2 text-[10px] font-bold text-blue-200 uppercase tracking-widest flex items-center gap-2">
											<div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
											Caminho Selecionado
										</div>
									)}
								</button>
							))}
						</div>
					</div>
				)}

				{step === 6 && (
					<div className="space-y-10 animate-slide-up">
						<div className="flex flex-col md:flex-row gap-10 items-center bg-blue-600/10 border border-blue-500/20 p-10 rounded-[40px]">
							<div className="relative w-40 h-40 rounded-3xl overflow-hidden border-4 border-blue-500 shadow-2xl flex-none">
								<Image
									src={formData.avatarImage || AVATAR_OPTIONS[0].image}
									alt="Avatar Final"
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
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
									<InfoItem
										label="Arco"
										value={
											activeArcId
												? STORY_ARCS[
														activeArcId.toUpperCase().replace(/-/g, "_")
													]?.name || activeArcId
												: "Nenhum"
										}
									/>
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
					className="flex-1 text-slate-400 hover:text-white font-black uppercase tracking-widest h-14 rounded-2xl"
					aria-label="Voltar para o passo anterior"
				>
					<ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" /> Voltar
				</Button>
				<Button
					onClick={handleNext}
					disabled={(step === 1 && !formData.name?.trim()) || isSaving}
					className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest h-14 rounded-2xl transition-all shadow-xl shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed group"
				>
					{isSaving
						? "Salvando..."
						: step === 6
							? "Iniciar Jornada"
							: "Próximo Passo"}{" "}
					<ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
