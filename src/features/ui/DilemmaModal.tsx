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
import type { Dilemma } from "@/features/game-loop/dilemmas";
import { useAudio } from "@/hooks/useAudio";
import { TelemetryAction, telemetryService } from "@/services/telemetry";

interface DilemmaModalProps {
	dilemma: Dilemma | null;
	onResolve: (optionIndex: number) => void;
	onClose: () => void;
}

export function DilemmaModal({
	dilemma,
	onResolve,
	onClose,
}: DilemmaModalProps) {
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const { playAmbience, stopAll } = useAudio();

	// Effect to manage audio
	useEffect(() => {
		if (dilemma?.audioId) {
			playAmbience(dilemma.audioId);
		}

		return () => {
			if (dilemma?.audioId) {
				stopAll();
			}
		};
	}, [dilemma, playAmbience, stopAll]);

	if (!dilemma) return null;

	const handleOptionSelect = (index: number) => {
		setSelectedOption(index);

		// Telemetria Ética (Step 4)
		const option = dilemma.options[index];
		if (option.telemetryTag) {
			telemetryService.track(
				TelemetryAction.DECISION_MADE,
				option.telemetryTag,
				option.telemetryTag.ods,
			);
		}
	};

	const handleContinue = () => {
		if (selectedOption !== null) {
			onResolve(selectedOption);
		} else {
			onClose();
		}
		setSelectedOption(null);
		stopAll(); // Ensure audio stops when closing/continuing
	};

	const currentOption =
		selectedOption !== null ? dilemma.options[selectedOption] : null;

	return (
		<Dialog
			open={!!dilemma}
			onOpenChange={(open) => {
				if (!open) handleContinue();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-[500px] max-h-[85vh] flex flex-col border border-slate-800 bg-black text-slate-300 rounded-none p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]"
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
									<InteractiveText text={currentOption.consequence} />
								) : (
									<InteractiveText text={dilemma.description} />
								)}
							</div>
						</DialogDescription>
					</DialogHeader>

					<div className="mt-8">
						{!currentOption && (
							<div className="flex flex-col gap-2">
								{dilemma.options.map((option, index) => (
									<Button
										key={option.label}
										type="button"
										variant="outline"
										className="justify-start h-auto py-3 px-4 text-left whitespace-normal border-slate-900 bg-black text-slate-500 hover:bg-slate-900 hover:text-white transition-all font-mono text-xs uppercase tracking-widest rounded-none group"
										onClick={() => handleOptionSelect(index)}
									>
										<span className="mr-3 opacity-0 group-hover:opacity-100 text-blue-900 transition-opacity">
											{">> "}
										</span>
										{option.label}
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
