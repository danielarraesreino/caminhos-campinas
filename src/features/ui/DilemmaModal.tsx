"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Dilemma } from "@/features/game-loop/dilemmas";

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

	if (!dilemma) return null;

	const handleOptionSelect = (index: number) => {
		setSelectedOption(index);
		onResolve(index);
	};

	const handleContinue = () => {
		setSelectedOption(null);
		onClose();
	};

	const currentOption =
		selectedOption !== null ? dilemma.options[selectedOption] : null;

	return (
		<Dialog open={!!dilemma} onOpenChange={() => {}}>
			<DialogContent className="sm:max-w-[500px] border-2 border-blue-500 bg-slate-900 text-white">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-blue-400">
						{currentOption ? "Impacto Educativo" : dilemma.title}
					</DialogTitle>
					<DialogDescription className="text-slate-300 text-lg leading-relaxed pt-4">
						{currentOption ? currentOption.consequence : dilemma.description}
					</DialogDescription>
				</DialogHeader>

				<div className="py-6">
					{!currentOption && (
						<div className="flex flex-col gap-3">
							{dilemma.options.map((option, index) => (
								<Button
									key={index}
									type="button"
									variant="outline"
									className="justify-start h-auto py-4 px-6 text-left whitespace-normal border-slate-700 hover:bg-blue-600 hover:text-white transition-all text-slate-100"
									onClick={() => handleOptionSelect(index)}
								>
									{option.label}
								</Button>
							))}
						</div>
					)}
				</div>

				<DialogFooter>
					{currentOption && (
						<Button
							type="button"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg"
							onClick={handleContinue}
						>
							Continuar Jornada
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
