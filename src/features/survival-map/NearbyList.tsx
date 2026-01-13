"use client";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Lock, MapPin, Navigation } from "lucide-react";
import { useCallback, useMemo } from "react";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useGameContext } from "@/contexts/GameContext";
import { useServices } from "@/contexts/ServicesContext";
import { useDenialEvents } from "@/hooks/useDenialEvents";
import { useODSMetrics } from "@/hooks/useODSMetrics";

// import servicesData from "@/data/services-campinas.json"; // Removed direct import

interface ServiceEffect {
	hunger?: number;
	hygiene?: number;
	energy?: number;
	health?: number;
	sanity?: number;
	dignity?: number;
	money?: number;
	stabilityGap?: number;
	addBuff?: string;
}

interface Service {
	id: string;
	name: string;
	type: string;
	coords: number[]; // [lat, lng]
	opening_hours: string;
	description: string;
	effects: ServiceEffect;
	relatedLink?: string;
	action_type?: string;
	url?: string;
}

function calculateDistance(
	lat1: number | undefined | null,
	lon1: number | undefined | null,
	lat2: number | undefined | null,
	lon2: number | undefined | null,
) {
	// 🛡️ BLINDAGEM: Se qualquer coordenada for inválida, retorne Infinity (muito longe)
	if (!lat1 || !lon1 || !lat2 || !lon2) {
		return Number.POSITIVE_INFINITY;
	}

	const R = 6371;
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // in km
}

export function NearbyList() {
	const { userPosition, money, documents, modifyStat, addBuff, addMoney } =
		useGameContext();
	const { services: contextServices } = useServices();
	const { trackServiceAccess } = useODSMetrics();
	const { addEvent: addDenialEvent } = useDenialEvents();

	const services = useMemo(() => {
		if (!contextServices) return [];

		if (!userPosition) {
			return contextServices.map((s: any) => ({
				...s,
				distance: Number.POSITIVE_INFINITY,
			}));
		}

		return contextServices
			.map((s: any) => {
				const hasCoords =
					s.coords && Array.isArray(s.coords) && s.coords.length === 2;
				const dist = hasCoords
					? calculateDistance(
							userPosition[0],
							userPosition[1],
							s.coords[0],
							s.coords[1],
						)
					: Number.POSITIVE_INFINITY;
				return { ...s, distance: dist };
			})
			.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));
	}, [userPosition, contextServices]);

	const checkAvailability = (service: Service) => {
		let allowed = true;
		const reasons: string[] = [];

		// 1. Money Constraint
		if (service.effects?.money && service.effects.money < 0) {
			const cost = Math.abs(service.effects.money);
			if (money < cost) {
				allowed = false;
				reasons.push(
					`Custo: R$ ${cost.toFixed(2)}. Você não tem o valor necessário.`,
				);
			}
		}

		// 2. Document Constraint
		if (service.id === "cpat-centro" || service.id === "samim") {
			if (!documents.hasRG) {
				allowed = false;
				reasons.push("Exige documento (RG) para atendimento.");
			}
		}

		return { allowed, reasons };
	};

	const handleUseService = useCallback(
		async (service: Service) => {
			// Apply Effects
			const { effects } = service;
			if (!effects) return; // Safeguard

			if (effects.hunger) modifyStat("hunger", effects.hunger);
			if (effects.hygiene) modifyStat("hygiene", effects.hygiene);
			if (effects.energy) modifyStat("energy", effects.energy);
			if (effects.health) modifyStat("health", effects.health);
			if (effects.sanity) modifyStat("sanity", effects.sanity);
			if (effects.dignity) modifyStat("dignity", effects.dignity);
			if (effects.stabilityGap)
				modifyStat("stabilityGap", effects.stabilityGap);

			if (effects.money) {
				addMoney(effects.money); // Negative adds subtracts
			}

			if (effects.addBuff) {
				addBuff(effects.addBuff);
			}

			// DISPARO DE TELEMETRIA ODS
			let actionType = "OUTROS";
			const type = service.type.toUpperCase();
			if (type === "ABRIGO") actionType = "ABRIGO"; // ODS 11.1
			if (type === "ALIMENTACAO") actionType = "ALIMENTACAO"; // ODS 2.1
			if (type === "SAUDE") actionType = "SAUDE"; // ODS 3.8
			if (type === "ASSISTENCIA") actionType = "CIDADANIA"; // ODS 10

			trackServiceAccess(actionType, service.name);
		},
		[modifyStat, addBuff, addMoney, trackServiceAccess],
	);

	// Find nearest service for the "Pill" trigger
	const nearestService = services[0];
	const nearestDistanceDisplay = nearestService
		? nearestService.distance < 1
			? `${Math.round(nearestService.distance * 1000)}m`
			: `${nearestService.distance.toFixed(1)}km`
		: "";

	if (!userPosition) return null;

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<button
					type="button"
					className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-10 hover:bg-slate-800 transition-all active:scale-95 group max-w-[90vw]"
				>
					<div className="bg-blue-600 p-1.5 rounded-full animate-pulse group-hover:animate-none">
						<Navigation size={16} className="text-white" />
					</div>
					<div className="flex flex-col items-start">
						<span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-0.5">
							Serviço mais próximo
						</span>
						<span className="font-bold text-sm truncate max-w-[200px] text-white">
							{nearestService
								? `${nearestService.name} (${nearestDistanceDisplay})`
								: "Nenhum serviço mapeado perto"}
						</span>
					</div>
					<div className="ml-2 border-l border-slate-700 pl-3 text-slate-500">
						Ver todos
					</div>
				</button>
			</DrawerTrigger>

			<DrawerContent className="bg-slate-950 border-t border-slate-800 h-[85vh]">
				<VisuallyHidden.Root>
					<DrawerTitle>Recursos Disponíveis</DrawerTitle>
				</VisuallyHidden.Root>
				<div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-800 mb-6 mt-4" />
				<div className="px-4 pb-4 overflow-y-auto h-full space-y-4">
					<h2 className="text-xl font-bold text-white mb-4 px-2">
						Recursos Disponíveis
					</h2>

					{services.map((service) => {
						let allowed = true;
						let reasons: string[] = [];
						try {
							const check = checkAvailability(service);
							allowed = check.allowed;
							reasons = check.reasons;
						} catch (err) {
							console.error("availability check error", err);
							return null;
						}
						const distanceDisplay =
							service.distance < 1
								? `${Math.round(service.distance * 1000)}m`
								: `${service.distance.toFixed(1)}km`;

						return (
							<div
								key={service.id}
								className={`w-full rounded-xl border p-4 shadow-sm transition-all
                                ${
																	allowed
																		? "bg-slate-900/50 border-slate-800 text-slate-100"
																		: "bg-slate-950/30 border-slate-800/50 text-slate-500 grayscale opacity-80"
																}`}
							>
								<div className="flex justify-between items-start mb-2">
									<div>
										<h3
											className={`font-bold text-lg leading-tight ${allowed ? "text-white" : "text-slate-400"}`}
										>
											{service.name}
										</h3>
										<p className="text-xs text-blue-400 font-mono mt-1 flex items-center gap-1">
											<MapPin size={10} />
											{service.type} • {distanceDisplay}
										</p>
									</div>
									<span className="text-[10px] font-mono bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-800 whitespace-nowrap">
										{service.opening_hours}
									</span>
								</div>

								<p className="text-sm text-slate-300 mb-4 leading-relaxed">
									{service.description}
								</p>

								{!allowed && (
									<div className="mb-3 rounded bg-red-950/20 border border-red-900/30 p-2 text-xs text-red-500 flex items-center gap-2">
										<Lock size={12} className="flex-none" />
										<span className="line-clamp-1">{reasons[0]}</span>
									</div>
								)}

								<div className="flex gap-2 mt-2">
									<button
										type="button"
										onClick={() => handleUseService(service)}
										disabled={!allowed}
										className={`flex-1 h-10 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all active:scale-95
                                        ${
																					allowed
																						? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
																						: "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
																				}`}
									>
										{allowed ? "Utilizar" : "Bloqueado"}
									</button>

									<div className="flex gap-2">
										{service.relatedLink && (
											<button
												type="button"
												onClick={() =>
													window.open(service.relatedLink, "_blank")
												}
												className="h-10 w-10 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-blue-400 rounded-lg flex items-center justify-center"
												title="Agendar"
											>
												📅
											</button>
										)}

										<button
											type="button"
											onClick={() => {
												if (service.action_type === "link" && service.url) {
													window.open(service.url, "_blank");
												} else if (
													service.coords &&
													service.coords.length >= 2
												) {
													const [lat, lng] = service.coords;
													window.open(
														`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
														"_blank",
													);
												}
											}}
											className="h-10 w-10 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-emerald-400 rounded-lg flex items-center justify-center"
										>
											<Navigation size={18} />
										</button>
									</div>
								</div>
							</div>
						);
					})}
					{/* Spacer for bottom safe area */}
					<div className="h-10" />
				</div>
			</DrawerContent>
		</Drawer>
	);
}
