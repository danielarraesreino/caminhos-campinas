"use client";

import {
	ArrowRight,
	Heart,
	MessageSquare,
	Mic,
	MapPin,
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

<<<<<<< HEAD
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
=======
const slides = [
	{
		title: "Bem-vindo às Ruas",
		description:
			"Este é um Serious Game sobre a realidade da população em situação de rua em Campinas. Após o rompimento dos vínculos familiares (71% dos casos), a rua se tornou sua única opção. Seu objetivo é reconquistar sua cidadania.",
		icon: User,
		color: "text-blue-400",
		bg: "bg-blue-900/20",
	},
	{
		title: "Sobrevivência Diária",
		description:
			"Monitore seus sinais vitais no topo da tela: Fome, Energia, Higiene e Integridade Física. Se algum chegar a zero, você corre riscos graves.",
		icon: Heart,
		color: "text-red-400",
		bg: "bg-red-900/20",
	},
	{
		title: "Plano de Cidadania (PDU)",
		description:
			"Acompanhe seu progresso na barra 'Plano de Vida'. Você começa pela Sobrevivência e deve buscar Documentos (RG/CPF), Benefícios e Autonomia (Trabalho).",
		icon: Shield,
		color: "text-emerald-400",
		bg: "bg-emerald-900/20",
	},
	{
		title: "Sua Voz Importa",
		description:
			"Use o Chat para interagir. Você pode DIGITAR ou FALAR (ícone de microfone). Sua voz é transcrita e enviada para análise para criar respostas mais reais.",
		icon: Mic,
		color: "text-purple-400",
		bg: "bg-purple-900/20",
	},
	{
		title: "Contribua com a Realidade",
		description:
			"O jogo é alimentado por histórias reais. Você pode submeter dilemas que vivenciou ou presenciou para enriquecer a simulação e ajudar na conscientização.",
		icon: MessageSquare,
		color: "text-yellow-400",
		bg: "bg-yellow-900/20",
	},
];
>>>>>>> 9ff5c3fb2de03e1743bce4b51ec2858e1a242085

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
