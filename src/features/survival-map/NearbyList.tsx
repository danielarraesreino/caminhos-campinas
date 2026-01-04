"use client";

import { Lock, MapPin, Navigation } from "lucide-react";

import { useCallback, useMemo } from "react";
import { useGameContext } from "@/contexts/GameContext";

import { useServices } from "@/contexts/ServicesContext";
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
	const { services: contextServices } = useServices(); // Use context services
	const { trackServiceAccess } = useODSMetrics();

	const services = useMemo(() => {
		if (!userPosition || !contextServices) return contextServices || [];

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

	if (!userPosition) return null;

	return (
		<div className="fixed bottom-0 left-0 w-full z-40 pb-6 pointer-events-none">
			<div className="px-4 mb-2 pointer-events-auto flex items-center justify-between">
				<h2 className="text-sm font-bold font-heading text-white drop-shadow-md uppercase tracking-wider bg-black/50 px-2 rounded">
					Serviços Próximos
				</h2>
				<div className="text-[10px] text-slate-300 bg-black/50 px-2 rounded">
					Deslize para ver →
				</div>
			</div>

			<div className="flex overflow-x-auto gap-3 px-4 pb-4 snap-x snap-mandatory pointer-events-auto no-scrollbar mask-gradient-right">
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
							className={`relative flex-none w-[85vw] max-w-[320px] snap-center overflow-hidden rounded-xl border p-4 shadow-xl transition-all
                                ${
																	allowed
																		? "bg-slate-900/95 border-slate-700 text-slate-100 backdrop-blur-md"
																		: "bg-slate-950/90 border-slate-800 text-slate-500 grayscale opacity-80"
																}`}
						>
							<div className="flex justify-between items-start mb-2">
								<div>
									<h3
										className={`font-bold text-lg leading-tight ${allowed ? "text-white" : "text-slate-400"}`}
									>
										{service.name}
									</h3>
									<p className="text-xs text-blue-400 font-mono mt-0.5 flex items-center gap-1">
										<MapPin size={10} />
										{service.type} • {distanceDisplay}
									</p>
								</div>
								<span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 whitespace-nowrap">
									{service.opening_hours}
								</span>
							</div>

							<p className="text-sm text-slate-300 mb-4 line-clamp-2 h-10 leading-relaxed">
								{service.description}
							</p>

							{!allowed && (
								<div className="mb-3 rounded bg-red-950/30 border border-red-900/50 p-2 text-xs text-red-400 flex items-center gap-2">
									<Lock size={12} className="flex-none" />
									<span className="line-clamp-1">{reasons[0]}</span>
								</div>
							)}

							<div className="flex gap-2 mt-auto">
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

								{/* ACTION BUTTONS */}
								<div className="flex gap-2">
									{service.relatedLink && (
										<button
											type="button"
											onClick={() => window.open(service.relatedLink, "_blank")}
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
											} else if (service.coords && service.coords.length >= 2) {
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
				{/* Spacer to allow last item to be fully visible if needed */}
				<div className="w-2 flex-none" />
			</div>
		</div>
	);
}
