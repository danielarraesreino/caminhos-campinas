"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
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

	// Define a custom type guard ensuring coords is [number, number]
	const hasValidCoords = (
		s: any,
	): s is {
		coords: [number, number];
		id: string;
		name: string;
		type: string;
	} => {
		return (
			s &&
			Array.isArray(s.coords) &&
			s.coords.length === 2 &&
			s.coords[0] != null &&
			s.coords[1] != null
		);
	};

	// Map services to resources format expected by MapCore (splitting coords [lat, lng] -> lat, lng)
	const resources = (services || []).filter(hasValidCoords).map((s) => {
		const c = s.coords; // TypeScript now knows this is [number, number]
		return {
			id: s.id,
			name: s.name,
			type: s.type as string,
			lat: c[0],
			lng: c[1],
		};
	});

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

	// Movement Mechanic
	const [isWalking, setIsWalking] = useState(false);
	const [walkProgress, setWalkProgress] = useState(0);
	const { phoneBattery, consumeBattery } = useGameContext();

	// FIX: Memoize handleTravel to prevent MapCore re-renders during animation
	const handleTravel = useCallback(
		(lat: number, lng: number) => {
			if (phoneBattery <= 0) {
				alert("Sem bateria! Você não consegue usar o GPS para navegar.");
				// Optionally open GameChat or show toast
				return;
			}

			setIsWalking(true);
			setWalkProgress(0);

			// Consume Battery
			consumeBattery(5);

			// Animate
			let progress = 0;
			const interval = setInterval(() => {
				progress += 5; // 20 steps * 100ms = 2s
				setWalkProgress(progress);
				if (progress >= 100) {
					clearInterval(interval);
					setIsWalking(false);
					setUserPosition([lat, lng]);
				}
			}, 100);
		},
		[phoneBattery, consumeBattery, setUserPosition],
	);

	return (
		<div
			className="flex flex-col h-full w-full bg-slate-100 relative"
			style={{
				filter: phoneBattery === 0 ? "grayscale(100%)" : "none",
				transition: "filter 1s ease",
			}}
		>
			{/* Walking Overlay */}
			{isWalking && (
				<div className="absolute inset-0 z-[2000] bg-black/80 flex flex-col items-center justify-center p-8 backdrop-blur-sm animate-in fade-in">
					<div className="w-16 h-16 bg-blue-600 rounded-full animate-bounce mb-6 flex items-center justify-center shadow-lg shadow-blue-500/50">
						<span className="text-3xl">👣</span>
					</div>
					<h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4">
						Caminhando...
					</h2>
					<div className="w-full max-w-md bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
						<div
							className="bg-blue-500 h-full transition-all duration-100 ease-linear"
							style={{ width: `${walkProgress}%` }}
						/>
					</div>
					<p className="text-slate-400 mt-4 text-xs font-mono">
						Bateria: {Math.max(0, phoneBattery - 5)}% (-5%)
					</p>
				</div>
			)}

			{/* Battery Warnings or Dead State */}
			{phoneBattery <= 0 && (
				<div className="absolute top-0 left-0 w-full bg-red-600 text-white text-xs font-bold p-2 text-center z-[1500]">
					⚠️ BATERIA ESGOTADA: GPS OFFLINE
				</div>
			)}

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
							alert(
								`Você visitou ${res.name} e conseguiu se alimentar! (+20 Fome)`,
							);
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
