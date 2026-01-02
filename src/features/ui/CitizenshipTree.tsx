"use client";

import { CheckCircle2, Circle, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useGameContext } from "@/contexts/GameContext";

export function CitizenshipTree() {
	const { documents, workTool } = useGameContext();

	// Logic for stages
	const hasSurvival = true; // Always active
	const hasDocs = documents?.hasRG || false;
	const hasBenefits = documents?.hasCPF || false; // Proxy for CadÚnico/Benefits as per plan
	// "Autonomia" -> Work Tool or Job. Checking workTool existence.
	const hasAutonomy = workTool?.type !== null && workTool?.type !== undefined;

	// Calculate overall progress (0 to 100)
	// 4 stages: 25% each?
	// If survival (always) -> 25%
	// + docs -> 50%
	// + benefits -> 75%
	// + autonomy -> 100%
	let progressValue = 25;
	if (hasDocs) progressValue += 25;
	if (hasBenefits) progressValue += 25;
	if (hasAutonomy) progressValue += 25;

	const steps = [
		{ label: "Sobrevivência", active: hasSurvival, icon: Circle },
		{ label: "Documentos", active: hasDocs, icon: CheckCircle2 },
		{ label: "Benefícios", active: hasBenefits, icon: CheckCircle2 },
		{ label: "Autonomia", active: hasAutonomy, icon: Trophy },
	];

	return (
		<div className="w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 p-2 md:p-4">
			<div className="max-w-4xl mx-auto flex flex-col gap-2">
				<div className="flex justify-between items-center text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">
					<span>Plano de Vida (PDU)</span>
					<span className="text-emerald-400">{progressValue}% Concluído</span>
				</div>

				<Progress
					value={progressValue}
					className="h-2 bg-slate-800"
					indicatorClassName="bg-emerald-500 transition-all duration-1000"
				/>

				<div className="flex justify-between mt-2">
					{steps.map((step) => {
						const Icon = step.icon;
						return (
							<div
								key={step.label}
								className={`flex flex-col items-center gap-1 ${step.active ? "text-emerald-400" : "text-slate-600"}`}
							>
								<div
									className={`p-1 rounded-full border-2 ${step.active ? "border-emerald-500 bg-emerald-950" : "border-slate-700 bg-slate-900"}`}
								>
									<Icon
										size={12}
										className={
											step.active ? "text-emerald-400" : "text-slate-600"
										}
									/>
								</div>
								<span className="text-[10px] font-bold uppercase hidden md:block">
									{step.label}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
