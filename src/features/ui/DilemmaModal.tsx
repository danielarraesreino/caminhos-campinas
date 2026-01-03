"use client";

import { MessageSquare, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { InteractiveText } from "@/components/ui/InteractiveText";
import type {
	Dilemma,
	DilemmaOption,
} from "@/features/game-loop/dilemma-types";
import { useAudioSystem } from "@/hooks/useAudioSystem";
import { useODSTracker } from "@/hooks/useODSTracker";

interface DilemmaModalProps {
	dilemma: Dilemma | null;
	onResolve: (optionIndex: number, outcome: "success" | "failure") => void;
	onClose: () => void;
}

export function DilemmaModal({
	dilemma,
	onResolve,
	onClose,
	onOpenChat,
}: DilemmaModalProps & { onOpenChat?: () => void }) {
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [outcome, setOutcome] = useState<"success" | "failure" | null>(null);
	const { playAmbience, stopAmbience } = useAudioSystem();
	const { trackDilemmaDecision } = useODSTracker();

	// A11y States
	const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%, 1.2 = 120%
	const [isSpeaking, setIsSpeaking] = useState(false);

	const toggleSpeech = () => {
		if (isSpeaking) {
			window.speechSynthesis.cancel();
			setIsSpeaking(false);
		} else {
			const textToRead = currentOption
				? outcome === "failure" && currentOption.consequence_failure
					? currentOption.consequence_failure
					: currentOption.consequence
				: `${dilemma?.description}. ${dilemma?.source_fact ? `Fato: ${dilemma.source_fact}` : ""}`;

			const utterance = new SpeechSynthesisUtterance(textToRead);
			utterance.lang = "pt-BR";
			utterance.onend = () => setIsSpeaking(false);
			window.speechSynthesis.speak(utterance);
			setIsSpeaking(true);
		}
	};

	const toggleZoom = () => {
		setZoomLevel((prev) => (prev >= 1.4 ? 1 : prev + 0.2));
	};

	// Effect to manage audio
	useEffect(() => {
		if (dilemma?.audioId) {
			playAmbience(dilemma.audioId);
		}

		return () => {
			if (dilemma?.audioId) {
				stopAmbience();
			}
			window.speechSynthesis.cancel();
		};
	}, [dilemma?.audioId, playAmbience, stopAmbience]);

	if (!dilemma) return null;

	const handleOptionSelect = (index: number) => {
		try {
			const option = dilemma.options[index];

			// Logic for Risk/Dice Roll
			let result: "success" | "failure" = "success";
			if (option.risk && option.risk > 0) {
				const roll = Math.random() * 100;
				if (roll < option.risk) {
					result = "failure";
				}
			}

			// Force failure if risk is 100
			if (option.risk === 100) result = "failure";

			setSelectedOption(index);
			setOutcome(result);

			// Telemetria Ética (Step 4)
			// Use ODS Tracker
			const odsTag = option.telemetryTag?.ods;
			trackDilemmaDecision(dilemma.id, option.label, odsTag).catch(
				console.error,
			);
		} catch (error) {
			console.error("Error in dilemma option select:", error);
			// Fallback: Just close if everything fails? Or show error?
			// For now, assume state set failed or option lookup failed.
		}
	};

	const handleContinue = () => {
		if (selectedOption !== null && outcome) {
			onResolve(selectedOption, outcome);
		} else {
			onClose();
		}
		setSelectedOption(null);
		setOutcome(null);
		stopAmbience(); // Ensure audio stops when closing/continuing
	};

	const currentOption =
		selectedOption !== null ? dilemma.options[selectedOption] : null;

	// Determine text to show based on outcome
	let feedbackText = "";
	if (currentOption) {
		if (outcome === "failure" && currentOption.consequence_failure) {
			feedbackText = currentOption.consequence_failure;
		} else {
			feedbackText = currentOption.consequence;
		}
	} else {
		feedbackText = dilemma.description;
	}

	return (
		<Dialog
			open={!!dilemma}
			onOpenChange={(open) => {
				if (!open) handleContinue();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-[500px] max-h-[85vh] flex flex-col border border-slate-800 bg-black text-slate-300 rounded-none p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] z-[100]"
			>
				{/* Header decorativo técnico */}
				<div className="h-1 w-full bg-slate-900 shrink-0" />

				{/* A11y Controls - Top Right */}
				<div className="absolute top-4 right-12 flex gap-2 z-20">
					{/* Zoom Button */}
					<button
						type="button"
						onClick={toggleZoom}
						className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 p-1.5 rounded transition-colors border border-slate-700"
						aria-label="Aumentar texto"
						title="Aumentar texto"
					>
						<span className="text-xs font-bold">A+</span>
					</button>

					{/* TTS Button */}
					<button
						type="button"
						onClick={toggleSpeech}
						className={`p-1.5 rounded transition-colors border ${
							isSpeaking
								? "bg-blue-900/50 border-blue-500 text-blue-400"
								: "bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800"
						}`}
						aria-label="Ler texto em voz alta"
						title="Ouvir Dilema"
					>
						{isSpeaking ? (
							<span className="animate-pulse">🔊</span>
						) : (
							<span>🔈</span>
						)}
					</button>

					{/* Chat Button */}
					{onOpenChat && (
						<button
							type="button"
							onClick={onOpenChat}
							className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 p-1.5 rounded transition-colors border border-slate-700"
							aria-label="Abrir Chat"
							title="Consultar Mestre"
						>
							<MessageSquare size={14} />
						</button>
					)}
				</div>

				{/* Close Button - Fixed */}
				<button
					type="button"
					onClick={handleContinue}
					className="absolute top-4 right-3 text-slate-500 hover:text-white transition-colors p-1.5 z-20"
					aria-label="Fechar modal"
				>
					<X size={18} />
				</button>

				<div className="p-8 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
					<DialogHeader className="space-y-4">
						<DialogTitle className="text-xl font-mono uppercase tracking-[0.3em] text-slate-100 pr-32 border-b border-slate-900 pb-4">
							{currentOption
								? "Impacto_Sistêmico"
								: dilemma.title.replace(" ", "_")}
						</DialogTitle>
						<DialogDescription
							className="text-slate-300 text-base leading-relaxed font-serif italic pt-2"
							asChild
							style={{ fontSize: `${zoomLevel}rem`, lineHeight: 1.6 }}
						>
							<div>
								{currentOption ? (
									<div
										className={
											outcome === "failure" ? "text-red-400" : "text-blue-300"
										}
									>
										{outcome === "failure" && (
											<span className="block mb-2 font-bold uppercase text-xs tracking-tighter">
												[FALHA NO RISCO]
											</span>
										)}
										{outcome === "success" && currentOption.risk ? (
											<span className="block mb-2 font-bold uppercase text-green-400 text-xs tracking-tighter">
												[SUCESSO]
											</span>
										) : null}
										<InteractiveText text={feedbackText} />
									</div>
								) : (
									<div className="space-y-6">
										<InteractiveText text={dilemma.description} />

										{/* Reality Fact Integration - Auditoria Sociotécnica */}
										{(dilemma.source_fact || dilemma.ods) && (
											<div className="not-italic bg-slate-900/80 border-l-4 border-blue-600 p-6 space-y-4 mt-8 shadow-inner rounded-r-lg">
												<div className="flex justify-between items-center border-b border-slate-800 pb-2">
													<div className="text-blue-400 font-bold tracking-widest uppercase flex items-center gap-2 text-xs">
														<span className="w-2 h-2 bg-blue-500 animate-pulse rounded-full" />
														AUDITORIA_REAL
													</div>
													<div className="text-slate-400 text-[10px] font-mono">
														REF: CENSO_2024_CAMPINAS
													</div>
												</div>

												{dilemma.source_fact && (
													<div className="text-slate-100 leading-relaxed text-sm font-medium">
														<span className="text-blue-400 font-bold mr-2 uppercase text-xs">
															[FATO VERIFICADO]:
														</span>
														{dilemma.source_fact}
													</div>
												)}

												{dilemma.ods && (
													<div className="space-y-2 pt-2">
														<div className="text-slate-400 uppercase text-[10px] tracking-widest font-bold">
															Compromisso Global (ONU):
														</div>
														<div className="flex gap-2 flex-wrap">
															{dilemma.ods.map((ods) => (
																<span
																	key={ods}
																	className="bg-blue-900/30 text-blue-300 px-3 py-1 border border-blue-500/30 font-bold text-xs rounded"
																>
																	{ods}
																</span>
															))}
														</div>
													</div>
												)}
											</div>
										)}
									</div>
								)}
							</div>
						</DialogDescription>
					</DialogHeader>

					<div className="mt-8">
						{!currentOption && (
							<div className="flex flex-col gap-3">
								{dilemma.options.map((option: DilemmaOption, index: number) => (
									<Button
										key={option.label}
										type="button"
										variant="outline"
										className="justify-between h-auto py-4 px-5 text-left whitespace-normal border-slate-800 bg-slate-950/50 text-slate-300 hover:bg-slate-900 hover:text-white transition-all font-mono text-sm uppercase tracking-widest rounded group"
										style={{
											fontSize: `${Math.max(0.875, zoomLevel * 0.8)}rem`,
										}} // Scale button text slightly less aggresive
										onClick={() => handleOptionSelect(index)}
									>
										<div className="flex items-center">
											<span className="mr-3 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity font-bold">
												{">> "}
											</span>
											{option.label}
										</div>
										{option.risk && option.risk > 0 && (
											<span className="text-xs text-red-400 font-bold ml-2 bg-red-950/50 px-2 py-1 rounded border border-red-900/50">
												⚠️ {option.risk}% RISCO
											</span>
										)}
									</Button>
								))}
							</div>
						)}
					</div>

					<DialogFooter className="mt-8 border-t border-slate-900 pt-6 flex flex-col gap-4">
						{currentOption?.telemetryTag && (
							<div className="flex items-center justify-center gap-2 text-[10px] text-blue-500 font-mono tracking-widest uppercase opacity-80 animate-pulse">
								<div className="w-2 h-2 bg-blue-500 rounded-full" />
								Dado Anônimo Registrado:{" "}
								{currentOption.telemetryTag.ods.replace(/_/g, " ")}
							</div>
						)}
						{currentOption && (
							<Button
								type="button"
								className="w-full bg-white hover:bg-slate-200 text-black font-mono font-bold py-4 text-sm uppercase tracking-[0.2em]"
								onClick={handleContinue}
							>
								RETOMAR_JORNADA.EXE
							</Button>
						)}
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
