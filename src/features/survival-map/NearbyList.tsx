"use client";

import { useMemo } from "react";
import { EcoButton } from "@/components/ui/EcoButton";
import { EcoCard } from "@/components/ui/EcoCard";
import { useServices } from "@/contexts/ServicesContext";
import { useGameContext } from "@/contexts/GameContext";

interface NearbyListProps {
	userPosition: [number, number] | null;
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

function deg2rad(deg: number): number {
	return deg * (Math.PI / 180);
}

export function NearbyList({ userPosition }: NearbyListProps) {
	const { services } = useServices();
	const { modifyStat, addMoney, addBuff, advanceTime, socialStigma, hygiene } =
		useGameContext();

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

	const handleUseService = (service: any) => {
		if (!service.effects) {
			alert(
				"Este serviço não possui efeitos imediatos, mas você pode ir até lá.",
			);
			return;
		}

		// Aplicar efeitos
		Object.entries(service.effects).forEach(([key, value]) => {
			if (typeof value === "number") {
				if (key === "money") {
					addMoney(value);
				} else {
					modifyStat(key as any, value);
				}
			} else if (key === "addBuff" && typeof value === "string") {
				addBuff(value);
			}
		});

		// Custo de tempo padrão: 1 hora
		advanceTime(1);

		alert(`${service.name} utilizado. Efeitos aplicados.`);
	};

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
							? (service as any).distance < 1
								? `${Math.round((service as any).distance * 1000)}m`
								: `${(service as any).distance.toFixed(1)}km`
							: null;

					return (
						<EcoCard
							key={service.id}
							className="border-zinc-800 p-4 bg-zinc-950/50 backdrop-blur-sm group hover:border-emerald-500/30 transition-colors"
						>
							<div className="flex justify-between items-start">
								<div className="flex-1">
									<h4 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
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
									</div>
									{service.description && (
										<p className="text-xs text-zinc-400 mt-2 line-clamp-2 italic">
											{service.description}
										</p>
									)}
								</div>
							</div>

							<div className="mt-4 flex gap-2">
								<EcoButton
									variant="ghost"
									size="sm"
									className="flex-1 text-[10px] uppercase font-bold h-9 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
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
									disabled={
										(service.type === "comércio" ||
											service.type === "privado") &&
										socialStigma > 70 &&
										hygiene < 30
									}
									className="flex-1 text-[10px] uppercase font-bold h-9 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:bg-zinc-700 disabled:cursor-not-allowed"
									onClick={() => handleUseService(service)}
								>
									{(service.type === "comércio" ||
										service.type === "privado") &&
									socialStigma > 70 &&
									hygiene < 30
										? "Barrado"
										: "Utilizar"}
								</EcoButton>
							</div>
							{(service.type === "comércio" || service.type === "privado") &&
								socialStigma > 70 &&
								hygiene < 30 && (
									<p className="text-[10px] text-red-400 mt-2 text-center font-medium animate-pulse">
										"O segurança barrou sua entrada pela sua aparência."
									</p>
								)}
						</EcoCard>
					);
				})}
			</div>
		</div>
	);
}
