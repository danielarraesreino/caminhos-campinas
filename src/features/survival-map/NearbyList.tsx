"use client";

import { useCallback, useMemo, useTransition } from "react";
import { EcoButton } from "@/components/ui/EcoButton";
import { EcoCard } from "@/components/ui/EcoCard";
import { InteractiveText } from "@/components/ui/InteractiveText";
import { useGameContext } from "@/contexts/GameContext";
import { useServices } from "@/contexts/ServicesContext";
import { useToast } from "@/contexts/ToastContext";
import { useServiceLogic } from "@/hooks/useServiceLogic";

interface NearbyListProps {
	userPosition: [number, number] | null;
}

function deg2rad(deg: number): number {
	return deg * (Math.PI / 180);
}

function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
): number {
	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(lat2 - lat1);
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // Distance in km
	return d;
}

export function NearbyList({ userPosition }: NearbyListProps) {
	const { services } = useServices();
	const gameState = useGameContext();
	const { modifyStat, addMoney, addBuff, advanceTime } = gameState; // Destructure helpers
	const [_isPending, startTransition] = useTransition();
	const { checkServiceAccess } = useServiceLogic();

	const sortedServices = useMemo(() => {
		if (!userPosition) return services;

		return [...services]
			.map((service) => {
				const dist = calculateDistance(
					userPosition[0],
					userPosition[1],
					service.coords[0],
					service.coords[1],
				);
				return { ...service, distance: dist };
			})
			.sort((a, b) => (a.distance || 0) - (b.distance || 0));
	}, [services, userPosition]);

	const { showToast } = useToast();

	// Optimize with useCallback and useTransition to avoid blocking UI
	const handleUseService = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: Legacy service type
		(service: any) => {
			// Validation (Double check in handler if user bypasses UI)
			const access = checkServiceAccess(service, gameState);
			if (!access.allowed) {
				showToast(`🚫 Acesso Negado: ${access.reason}`, "error");
				return;
			}

			if (!service.effects) {
				showToast(
					"Este serviço não possui efeitos imediatos, mas você pode ir até lá.",
					"info",
				);
				return;
			}

			// Use startTransition to avoid blocking the UI thread
			startTransition(() => {
				// Aplicar efeitos
				Object.entries(service.effects).forEach(([key, value]) => {
					if (typeof value === "number") {
						if (key === "money") {
							addMoney(value);
						} else {
							// biome-ignore lint/suspicious/noExplicitAny: dynamic stat key
							modifyStat(key as any, value);
						}
					} else if (key === "addBuff" && typeof value === "string") {
						addBuff(value);
					}
				});

				// Custo de tempo padrão: 1 hora
				advanceTime(1);

				showToast(`${service.name} utilizado com sucesso!`, "success");
			});
		},
		[
			addMoney,
			modifyStat,
			addBuff,
			advanceTime,
			checkServiceAccess,
			gameState,
			showToast,
		],
	);

	return (
		<div className="space-y-4">
			<h3 className="text-xl font-bold text-white">
				Rede de Apoio Próxima (Campinas)
			</h3>

			{!userPosition && (
				<p className="text-zinc-500 text-sm italic">
					Aguardando localização para calcular distâncias e disponibilidade...
				</p>
			)}

			<div className="flex flex-col gap-3">
				{sortedServices.map((service) => {
					const distanceFormatted =
						"distance" in service
							? // biome-ignore lint/suspicious/noExplicitAny: distance property injected
								(service as any).distance < 1
								? // biome-ignore lint/suspicious/noExplicitAny: distance property injected
									`${Math.round((service as any).distance * 1000)}m`
								: // biome-ignore lint/suspicious/noExplicitAny: distance property injected
									`${(service as any).distance.toFixed(1)}km`
							: null;

					const access = checkServiceAccess(service, gameState);
					const isBlocked = !access.allowed;

					return (
						<EcoCard
							key={service.id}
							className={`border-zinc-800 p-4 transition-colors ${isBlocked ? "bg-zinc-950/80 grayscale-[0.5]" : "bg-zinc-950/50 backdrop-blur-sm group hover:border-emerald-500/30"}`}
						>
							<div className="flex justify-between items-start">
								<div className="flex-1">
									<h4
										className={`font-bold text-lg transition-colors ${isBlocked ? "text-zinc-500" : "text-white group-hover:text-emerald-400"}`}
									>
										{service.name}
									</h4>
									<div className="flex gap-2 items-center mt-1">
										<span className="text-[10px] px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded uppercase font-bold tracking-wider">
											{service.type}
										</span>
										{distanceFormatted && (
											<span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-900/10 px-2 rounded">
												{distanceFormatted}
											</span>
										)}
										{isBlocked && (
											<span className="text-[10px] px-2 py-0.5 bg-red-900/40 text-red-400 border border-red-900/50 rounded uppercase font-bold tracking-wider flex items-center gap-1">
												🔒 Bloqueado
											</span>
										)}
									</div>
									{service.description && (
										<div className="text-xs text-zinc-400 mt-2 line-clamp-2 italic">
											<InteractiveText text={service.description} />
										</div>
									)}
								</div>
							</div>

							<div className="mt-4 flex gap-2">
								<EcoButton
									variant="ghost"
									size="sm"
									aria-label={`Traçar rota para ${service.name}`}
									className="flex-1 text-[10px] uppercase font-bold min-h-[48px] h-auto bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
									onClick={() => {
										const url = `https://www.google.com/maps/dir/?api=1&destination=${service.coords[0]},${service.coords[1]}`;
										window.open(url, "_blank");
									}}
								>
									Traçar Rota
								</EcoButton>
								<EcoButton
									variant="primary"
									size="sm"
									aria-label={
										isBlocked
											? `Serviço bloqueado: ${service.name}`
											: `Utilizar serviço ${service.name}`
									}
									className={`flex-1 text-[10px] uppercase font-bold min-h-[48px] h-auto shadow-lg ${isBlocked ? "bg-zinc-800 text-red-400 hover:bg-zinc-800 cursor-not-allowed border border-red-900/30" : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20"}`}
									onClick={() => {
										if (isBlocked) {
											showToast(`🚫 ACESSO NEGADO: ${access.reason}`, "error");
										} else {
											handleUseService(service);
										}
									}}
								>
									{isBlocked ? "Indisponível" : "Utilizar"}
								</EcoButton>
							</div>

							{isBlocked && (
								<div className="text-[10px] text-red-400/80 mt-2 text-center font-medium animate-pulse">
									<InteractiveText text={access.reason || "Acesso restrito."} />
								</div>
							)}
						</EcoCard>
					);
				})}
			</div>
		</div>
	);
}
