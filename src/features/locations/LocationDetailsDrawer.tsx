"use client";

import {
	Coffee,
	Heart,
	Navigation,
	ShieldAlert,
	Sparkles,
	Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import type { Location } from "@/types/GameState";

interface LocationDetailsDrawerProps {
	location: Location | null;
	isOpen: boolean;
	onClose: () => void;
}

export function LocationDetailsDrawer({
	location,
	isOpen,
	onClose,
}: LocationDetailsDrawerProps) {
	if (!location) return null;

	return (
		<Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DrawerContent className="bg-zinc-950 border-t border-zinc-800 h-[80vh]">
				<div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-800 mb-4 mt-2" />

				<div className="px-6 pb-8 overflow-y-auto">
					<DrawerHeader className="px-0">
						<div className="flex items-center gap-2 mb-1">
							<Badge
								variant="outline"
								className="bg-zinc-900 text-zinc-400 border-zinc-800 text-[10px] uppercase"
							>
								Localidade Real
							</Badge>
						</div>
						<DrawerTitle className="text-3xl font-bold text-zinc-100 mb-2">
							{location.name}
						</DrawerTitle>
						<DrawerDescription className="text-zinc-400 text-base italic leading-relaxed">
							{location.description}
						</DrawerDescription>
					</DrawerHeader>

					<div className="space-y-8 mt-4">
						{/* Resources Section */}
						<div>
							<h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
								<Sparkles size={14} /> Recursos e Impacto
							</h4>
							<div className="grid gap-3">
								{location.resources.map((res) => (
									<div
										key={res.id}
										className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl"
									>
										<div className="flex justify-between items-center mb-3">
											<span className="font-bold text-zinc-200">
												{res.label}
											</span>
											<span className="text-xs font-mono text-zinc-500">
												{res.timeRequired}h requeridas
											</span>
										</div>
										<div className="flex flex-wrap gap-3">
											{res.impact.map((imp, idx) => (
												<div
													key={idx}
													className="flex items-center gap-1.5 text-sm bg-zinc-950 border border-zinc-800 px-2 py-1 rounded"
												>
													{imp.stat === "hunger" && (
														<Coffee size={14} className="text-zinc-400" />
													)}
													{imp.stat === "health" && (
														<Heart size={14} className="text-zinc-400" />
													)}
													{imp.stat === "energy" && (
														<Zap size={14} className="text-zinc-400" />
													)}
													<span className="text-zinc-300">
														{imp.amount > 0 ? "+" : ""}
														{imp.amount} {imp.stat}
													</span>
												</div>
											))}
											{res.cost > 0 && (
												<div className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
													Custo: R$ {res.cost.toFixed(2)}
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Risks Section */}
						<div>
							<h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
								<ShieldAlert size={14} /> Fatores de Risco
							</h4>
							<div className="space-y-3">
								{location.risks.map((risk) => (
									<div
										key={risk.id}
										className="flex items-start gap-3 p-3 rounded-lg border border-zinc-900 bg-zinc-900/20"
									>
										<div className="bg-zinc-800 p-2 rounded-md mt-1">
											<ShieldAlert size={16} className="text-zinc-400" />
										</div>
										<div>
											<p className="font-bold text-sm text-zinc-300">
												{risk.label}
											</p>
											<p className="text-xs text-zinc-500 mt-1">
												{risk.description}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<DrawerFooter className="px-6 py-4 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
					<button
						type="button"
						onClick={() => {
							console.log(`Deslocando para ${location.name}...`);
							onClose();
						}}
						className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-white/5"
					>
						<Navigation size={18} />
						Ir para este local
					</button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
