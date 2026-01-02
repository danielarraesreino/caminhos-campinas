"use client";

import {
	ArrowRight,
	Heart,
	MessageSquare,
	Mic,
	Shield,
	User,
	X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface OnboardingTutorialProps {
	isOpen: boolean;
	onClose: () => void;
}

import onboardingData from "@/data/onboarding.json";

// Map string names to Lucide components
const IconMap: Record<string, React.ElementType> = {
	User,
	Heart,
	Shield,
	Mic,
	MessageSquare,
};

const slides = onboardingData.map((slide) => ({
	...slide,
	icon: IconMap[slide.iconName] || User, // Fallback to User icon
}));

export function OnboardingTutorial({
	isOpen,
	onClose,
}: OnboardingTutorialProps) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [dontShowAgain, setDontShowAgain] = useState(false);

	const [isExiting, setIsExiting] = useState(false);

	const handleNext = async () => {
		if (currentSlide < slides.length - 1) {
			setCurrentSlide(currentSlide + 1);
		} else {
			setIsExiting(true);
			// Defer close to allow UI update
			await new Promise((resolve) => setTimeout(resolve, 50));
			handleClose();
		}
	};

	const handleClose = () => {
		if (dontShowAgain) {
			localStorage.setItem("pop_rua_tutorial_seen", "true");
		}
		onClose();
	};

	if (!isOpen) return null;

	const SlideIcon = slides[currentSlide].icon;

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px] border-slate-700 bg-slate-950 text-white">
				<DialogHeader>
					<div className="flex justify-between items-center mb-4">
						<DialogTitle className="text-xl font-bold">
							Tutorial ({currentSlide + 1}/{slides.length})
						</DialogTitle>
						<button
							type="button"
							onClick={handleClose}
							className="text-slate-400 hover:text-white"
							aria-label="Fechar tutorial"
						>
							<X size={20} />
						</button>
					</div>
				</DialogHeader>

				<div className="flex flex-col items-center text-center py-6 min-h-[250px]">
					<div
						className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 border-slate-800 ${slides[currentSlide].bg}`}
					>
						<SlideIcon className={`w-10 h-10 ${slides[currentSlide].color}`} />
					</div>
					<h3
						className={`text-2xl font-bold mb-4 ${slides[currentSlide].color}`}
					>
						{slides[currentSlide].title}
					</h3>
					<p className="text-slate-300 leading-relaxed px-4">
						{slides[currentSlide].description}
					</p>
				</div>

				<div className="flex justify-center gap-2 mb-6">
					{slides.map((_, idx) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: slides are static constant
							key={idx}
							className={`h-1.5 rounded-full transition-all duration-300 ${
								idx === currentSlide ? "w-6 bg-blue-500" : "w-1.5 bg-slate-700"
							}`}
						/>
					))}
				</div>

				<DialogFooter className="flex-col sm:flex-row gap-4 items-center sm:justify-between w-full">
					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="dont-show"
							checked={dontShowAgain}
							onChange={(e) => setDontShowAgain(e.target.checked)}
							className="w-4 h-4 rounded border-slate-500 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 accent-blue-600"
						/>
						<label
							htmlFor="dont-show"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-400 cursor-pointer select-none"
						>
							Não mostrar novamente
						</label>
					</div>
					<Button
						onClick={handleNext}
						disabled={isExiting}
						className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-all active:scale-95"
					>
						{isExiting ? (
							<span className="flex items-center gap-2">
								<span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Carregando...
							</span>
						) : currentSlide === slides.length - 1 ? (
							"Começar Jogo"
						) : (
							"Próximo"
						)}
						{!isExiting && <ArrowRight className="ml-2 w-4 h-4" />}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
