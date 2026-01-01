"use client";

import { useGameContext } from "@/contexts/GameContext";
import { useODSMetrics } from "@/hooks/useODSMetrics";
import { Lock, MapPin, Navigation, Wallet } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useServices } from "@/contexts/ServicesContext";
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
		[modifyStat, addBuff, addMoney, trackServiceAccess, money],
	);

	if (!userPosition) return <div>Aguardando GPS...</div>;

	return (
		<div className="space-y-4 p-4 pb-20">
			<h2 className="text-xl font-bold font-heading">Serviços Próximos</h2>

			<div className="flex flex-col gap-3">
				{services.map((service) => {
					let allowed = true;
					let reasons: string[] = [];
					try {
						const check = checkAvailability(service);
						allowed = check.allowed;
						reasons = check.reasons;
					} catch (err) {
						console.error(
							"Critical error checking service availability:",
							service?.id,
							err,
						);
						return null;
					}
					const distanceDisplay =
						service.distance < 1
							? `${Math.round(service.distance * 1000)}m`
							: `${service.distance.toFixed(1)}km`;

					return (
						<div
							key={service.id}
							className={`relative overflow-hidden rounded-lg border p-3 ${allowed ? "bg-card" : "bg-muted/50 opacity-80"}`}
						>
							<div className="flex justify-between items-start">
								<div>
									<h3 className="font-bold">{service.name}</h3>
									<p className="text-xs text-muted-foreground">
										{service.type} • {distanceDisplay}
									</p>
								</div>
								<span className="text-xs font-mono bg-secondary px-2 py-1 rounded">
									{service.opening_hours}
								</span>
							</div>

							<p className="text-sm mt-2 line-clamp-2">{service.description}</p>

							{!allowed && (
								<div className="mt-2 rounded bg-red-900/20 p-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
									<Lock size={12} />
									{reasons.join(" ")}
								</div>
							)}

							<div className="mt-3 flex gap-2">
								<button
									onClick={() => handleUseService(service)}
									disabled={!allowed}
									className="flex-1 bg-primary text-primary-foreground h-9 px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
								>
									{allowed ? "Utilizar Serviço" : "Indisponível"}
								</button>
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
									className={`flex items-center justify-center min-w-[36px] px-2 h-9 border rounded hover:opacity-90 transition-colors ${service.action_type === "link" ? "bg-blue-100 text-blue-700 border-blue-200" : "hover:bg-muted text-blue-500 hover:text-blue-600 hover:border-blue-200"}`}
									title={
										service.action_type === "link"
											? "Acessar Site do Curso"
											: "Ver no Google Maps"
									}
								>
									{service.action_type === "link" ? (
										<span className="text-xs font-bold mr-1">Link</span>
									) : (
										<Navigation size={16} />
									)}
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
