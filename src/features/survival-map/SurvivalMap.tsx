"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { useServices } from "@/contexts/ServicesContext";
import { NearbyList } from "./NearbyList";

const MapCore = dynamic(() => import("./MapCore"), {
	loading: () => (
		<p className="text-center p-10">Carregando mapa interativo...</p>
	),
	ssr: false,
});

export function SurvivalMap() {
	const { userPosition, setUserPosition, eat, modifyStat } = useGameContext();
	const [loadingLocation, setLoadingLocation] = useState(false);

	// Use ServicesContext for real data
	const { services } = useServices();

	// Map services to resources format expected by MapCore (splitting coords [lat, lng] -> lat, lng)
	const resources = services
		.filter((s): s is ServiceLocation & { coords: [number, number] } => !!s.id && !!s.coords)
		.map((s) => ({
			id: s.id,
			name: s.name,
			type: s.type,
			lat: s.coords[0], // Safe access due to filter
			lng: s.coords[1],
		}));

	useEffect(() => {
		// Only fetch if not already set (or we could force refresh? Let's respect existing if valid)
		if (userPosition) return;

		setLoadingLocation(true);
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setUserPosition([
						position.coords.latitude,
						position.coords.longitude,
					]);
					setLoadingLocation(false);
				},
				(error) => {
					console.error("Erro de geolocalização:", error);
					setLoadingLocation(false);
				},
			);
		} else {
			setLoadingLocation(false);
		}
	}, [setUserPosition, userPosition]);

	return (
		<div className="flex flex-col h-full w-full bg-slate-100">
			<div className="relative w-full h-[55%] flex-none border-b-2 border-slate-200 shadow-inner overflow-hidden">
				{loadingLocation && (
					<div className="absolute top-2 right-2 z-[1000] bg-white/90 px-3 py-1 rounded-full shadow text-xs font-bold text-blue-600 animate-pulse">
						Buscando sua localização...
					</div>
				)}

				{/* Floating SOS Button */}
				<a
					href={`https://wa.me/?text=SOS! Estou em situação de emergência. Minha localização aproximada: ${userPosition ? `${userPosition[0]},${userPosition[1]}` : "Desconhecida"}`}
					target="_blank"
					rel="noopener noreferrer"
					className="absolute top-4 left-4 z-[1000] bg-red-600 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition-transform hover:scale-105 flex items-center gap-2"
				>
					🚨 SOS EMERGÊNCIA
				</a>

				<MapCore
					userPosition={userPosition}
					resources={resources}
					onResourceInteract={(res: any) => {
						console.log("Interagindo com:", res.name);
						const type = res.type.toUpperCase();
						// Interaction logic mapping - Portuguese Only
						if (type === "ALIMENTACAO") {
							eat(20);
							alert(`Você visitou ${res.name} e conseguiu se alimentar! (+20 Fome)`);
						} else if (type === "SAUDE") {
							modifyStat("health", 15);
							alert(`Você recebeu atendimento em ${res.name}. (+15 Saúde)`);
						} else if (type === "ABRIGO") {
							modifyStat("energy", 30);
							alert(`Você conseguiu descansar em ${res.name}. (+30 Energia)`);
						} else if (type === "ASSISTENCIA") {
							modifyStat("dignity", 10);
							alert(`Você recebeu apoio em ${res.name}. (+10 Dignidade)`);
						} else {
							alert(`Você visitou ${res.name}.`);
						}
					}}
				/>
			</div>

			{/* Nearby List Area - Scrollable */}
			<div className="flex-1 overflow-y-auto p-4 bg-slate-900 border-t border-slate-800">
				<NearbyList />
			</div>
		</div>
	);
}
