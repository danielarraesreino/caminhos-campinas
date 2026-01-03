"use client";

import { X } from "lucide-react";
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
}: DilemmaModalProps) {
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [outcome, setOutcome] = useState<"success" | "failure" | null>(null);
	const { playAmbience, stopAmbience } = useAudioSystem();
	const { trackDilemmaDecision } = useODSTracker();

	// Effect to manage audio
	useEffect(() => {
		if (dilemma?.audioId) {
			playAmbience(dilemma.audioId);
		}

		return () => {
			if (dilemma?.audioId) {
				stopAmbience();
			}
		};
	}, [dilemma, playAmbience, stopAmbience]);

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

				{/* Close Button - Fixed */}
				<button
					type="button"
					onClick={handleContinue}
					className="absolute top-4 right-4 text-slate-700 hover:text-white transition-colors p-1 z-10"
					aria-label="Fechar modal"
				>
					<X size={16} />
				</button>

				<div className="p-8 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
					<DialogHeader className="space-y-4">
						<DialogTitle className="text-xl font-mono uppercase tracking-[0.3em] text-slate-100 pr-10 border-b border-slate-900 pb-4">
							{currentOption
								? "Impacto_Sistêmico"
								: dilemma.title.replace(" ", "_")}
						</DialogTitle>
						<DialogDescription
							className="text-slate-400 text-base leading-relaxed font-serif italic pt-2"
							asChild
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
											<div className="not-italic bg-slate-900/80 border-l-2 border-blue-600 p-5 font-mono text-[11px] space-y-3 mt-6 shadow-inner">
												<div className="flex justify-between items-center">
													<div className="text-blue-500 font-bold tracking-[0.2em] uppercase flex items-center gap-2">
														<span className="w-2 h-2 bg-blue-500 animate-pulse rounded-full" />
														AUDITORIA_SOCIO_TECNICA.LOG
													</div>
													<div className="text-slate-600 text-[9px]">
														REF: CENSO_2024_CAMPINAS
													</div>
												</div>

												{dilemma.source_fact && (
													<div className="text-slate-200 leading-relaxed border-b border-slate-800 pb-3">
														<span className="text-blue-500/50 mr-2">
															[FATO]:
														</span>
														{dilemma.source_fact}
													</div>
												)}

												{dilemma.ods && (
													<div className="space-y-2">
														<div className="text-slate-500 uppercase text-[9px] tracking-widest">
															Compromisso Global (ONU):
														</div>
														<div className="flex gap-2 flex-wrap">
															{dilemma.ods.map((ods) => (
																<span
																	key={ods}
																	className="bg-blue-600/20 text-blue-400 px-2 py-0.5 border border-blue-500/30 font-bold"
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
							<div className="flex flex-col gap-2">
								{dilemma.options.map((option: DilemmaOption, index: number) => (
									<Button
										key={option.label}
										type="button"
										variant="outline"
										className="justify-between h-auto py-3 px-4 text-left whitespace-normal border-slate-900 bg-black text-slate-500 hover:bg-slate-900 hover:text-white transition-all font-mono text-xs uppercase tracking-widest rounded-none group"
										onClick={() => handleOptionSelect(index)}
									>
										<div className="flex items-center">
											<span className="mr-3 opacity-0 group-hover:opacity-100 text-blue-900 transition-opacity">
												{">> "}
											</span>
											{option.label}
										</div>
										{option.risk && option.risk > 0 && (
											<span className="text-[10px] text-red-500 font-bold ml-2">
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
								className="w-full bg-slate-100 hover:bg-white text-black font-mono font-bold py-4 text-xs uppercase tracking-[0.4em] rounded-none"
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
