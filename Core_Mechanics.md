import type { GameState } from "./store";

export type TriggerType = "HUNGER_LOW" | "HYGIENE_LOW" | "RANDOM";

export interface DilemmaOption {
	label: string;
	consequence: string;
	effect: Partial<Omit<GameState, "actions" | "inventory" | "day" | "time">>;
}

export interface Dilemma {
	id: string;
	title: string;
	description: string;
	trigger: {
		type: TriggerType;
		value: number;
	};
	options: DilemmaOption[];
}

export const GAME_DILEMMAS: Dilemma[] = [
	{
		id: "hunger-emergency",
		title: "Fome Apertando",
		description:
			"O dia está acabando e sua barriga dói de fome. Você precisa encontrar algo para comer logo ou sua saúde começará a declinar rapidamente.",
		trigger: { type: "HUNGER_LOW", value: 30 },
		options: [
			{
				label: "Ir ao Bom Prato (R$ 1)",
				consequence:
					"O Bom Prato é uma rede de restaurantes populares em São Paulo/Campinas que garante alimentação de qualidade por um preço simbólico. Você comeu bem e economizou.",
				effect: { hunger: 80, money: -1 },
			},
			{
				label: "Comprar Salgado na Rua (R$ 5)",
				consequence:
					"Comprar comida de rua é mais rápido, mas muito mais caro para quem não tem renda fixa. Você gastou quase tudo o que tinha.",
				effect: { hunger: 40, money: -5 },
			},
			{
				label: "Pedir Ajuda na Praça",
				consequence:
					"Pedir ajuda é um direito, mas a constante exposição e o estigma podem afetar seu bem-estar emocional e sanidade ao longo do tempo.",
				effect: { hunger: 20, sanity: -10 },
			},
		],
	},
	{
		id: "hygiene-crisis",
		title: "A Necessidade do Banho",
		description:
			"Você não toma um banho completo há dias. O cansaço físico e o desconforto estão começando a afetar sua disposição e como as pessoas interagem com você.",
		trigger: { type: "HYGIENE_LOW", value: 20 },
		options: [
			{
				label: "Procurar Centro Pop",
				consequence:
					"Os Centros Pop são unidades públicas onde é possível tomar banho, lavar roupas e receber atendimento social. Você se sente renovado e recebeu um kit de higiene.",
				effect: { hygiene: 90, sanity: 5 },
			},
			{
				label: "Usar Chafariz/Rio",
				consequence:
					"Banhar-se em locais públicos impróprios pode expor você a doenças e é perigoso. Sua higiene melhorou pouco e sua saúde sofreu.",
				effect: { hygiene: 30, health: -10 },
			},
		],
	},
	{
		id: "social-approach",
		title: "Abordagem na Praça",
		description:
			"Um educador social do coletivo 'A Rua Tem Voz' se aproxima com um sorriso, oferecendo informações sobre seus direitos e serviços disponíveis na cidade.",
		trigger: { type: "RANDOM", value: 0.1 },
		options: [
			{
				label: "Ouvir e fazer o cadastro",
				consequence:
					"Estar documentado e cadastrado em redes de apoio é o primeiro passo para a autonomia. Você agora sabe onde buscar ajuda jurídica e documentação.",
				effect: { sanity: 10 },
			},
		],
	},
];
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface GameState {
	// Atributos de Sobrevivência (0-100)
	health: number;
	hunger: number;
	hygiene: number;
	sanity: number;
	energy: number;

	// Recursos
	money: number;
	inventory: string[];

	// Tempo
	day: number;
	time: number; // 0-24h
	resolvedDilemmas: string[];

	// Ações
	actions: {
		modifyStat: (
			stat: keyof Omit<GameState, "actions" | "inventory" | "day" | "time" | "resolvedDilemmas">,
			amount: number,
		) => void;
		addMoney: (amount: number) => void;
		advanceTime: (hours: number) => void;
		markDilemmaResolved: (id: string) => void;
		resetGame: () => void;
	};
}

const INITIAL_STATE = {
	health: 100,
	hunger: 100, // 100 = Cheio, 0 = Fome
	hygiene: 50, // Começa sujo
	sanity: 80,
	energy: 100,
	money: 0,
	inventory: [],
	resolvedDilemmas: [],
	day: 1,
	time: 8, // Começa às 8h
};

export const useGameStore = create<GameState>()(
	persist(
		(set) => ({
			...INITIAL_STATE,

			actions: {
				markDilemmaResolved: (id) =>
					set((state) => ({
						resolvedDilemmas: [...state.resolvedDilemmas, id],
					})),
				modifyStat: (stat, amount) =>
					set((state) => {
						const newValue = Math.max(
							0,
							Math.min(100, (state[stat] as number) + amount),
						);
						// Se Fome zerar, Saúde cai
						if (stat === "hunger" && newValue === 0) {
							return { [stat]: newValue, health: Math.max(0, state.health - 5) };
						}
						return { [stat]: newValue };
					}),
				addMoney: (amount) => set((state) => ({ money: state.money + amount })),
				advanceTime: (hours) =>
					set((state) => {
						let newTime = state.time + hours;
						let newDay = state.day;

						if (newTime >= 24) {
							newTime -= 24;
							newDay += 1;
						}

						return { time: newTime, day: newDay };
					}),
				resetGame: () => set(INITIAL_STATE),
			},
		}),
		{
			name: "pop-rua-save-v1",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) =>
				Object.fromEntries(
					Object.entries(state).filter(([key]) => key !== "actions"),
				) as GameState,
		},
	),
);

export const useGameActions = () => useGameStore((state) => state.actions);
import { useEffect } from "react";
import { useGameStore } from "./store";

export function useGameLoop() {
	const modifyStat = useGameStore((state) => state.actions.modifyStat);
	const health = useGameStore((state) => state.health);

	useEffect(() => {
		// Loop de decadência passiva a cada 10 segundos na vida real (simula passagem do tempo)
		// No produto final, isso será atrelado a ações, não apenas tempo real.
		const interval = setInterval(() => {
			// Se saúde zerar, game over (aqui só para de drenar)
			if (health <= 0) return;

			modifyStat("hunger", -1); // Fome aumenta (valor desce)
			modifyStat("hygiene", -0.5); // Fica sujo
			modifyStat("energy", -0.5); // Cansa
		}, 10000);

		return () => clearInterval(interval);
	}, [modifyStat, health]);
}
import { create } from "zustand";
import { TelemetryAction, telemetryService } from "@/services/telemetry";

export interface Item {
	id: string;
	name: string;
	value: number;
}

interface PlayerState {
	hunger: number;
	health: number;
	cash: number;
	inventory: Item[];

	// Actions
	eat: (amount: number) => void;
	sleep: (isSafe: boolean) => void;
	work: (hours: number) => void;
	addToInventory: (item: Item) => void;
	removeFromInventory: (itemId: string) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
	hunger: 50,
	health: 80,
	cash: 10.0,
	inventory: [],

	eat: (amount: number) => {
		set((state) => {
			const newHunger = Math.min(100, state.hunger + amount);
			return { hunger: newHunger };
		});
	},

	sleep: (isSafe: boolean) => {
		if (!isSafe) {
			telemetryService.track(TelemetryAction.GAME_EVENT, {
				type: "RISKY_SLEEP",
				hunger: get().hunger,
				health: get().health,
			});
		}

		set((state) => {
			// Sleep restores health but reduces hunger slightly over time (implied)
			// For simplicity here: +20 health, -10 hunger
			const newHealth = Math.min(100, state.health + 20);
			const newHunger = Math.max(0, state.hunger - 10);

			// If risky sleep, chance of losing items or health hurt?
			// Requirement says just track action for now.
			// We can add a small penalty for risky sleep logic if implied,
			// but user only asked for "dispare trackAction".

			if (newHunger === 0) {
				telemetryService.track(TelemetryAction.GAME_EVENT, {
					type: "GAME_OVER_HUNGER",
				});
			}

			return { health: newHealth, hunger: newHunger };
		});
	},

	work: (hours: number) => {
		set((state) => {
			// Work: +Cash, -Hunger, -Health (maybe)
			// arbitrary balance: 10 cash/hour, -5 hunger/hour
			const earned = hours * 10;
			const hungerCost = hours * 5;

			const newCash = state.cash + earned;
			const newHunger = Math.max(0, state.hunger - hungerCost);

			if (newHunger === 0) {
				telemetryService.track(TelemetryAction.GAME_EVENT, {
					type: "GAME_OVER_HUNGER",
				});
			}

			return { cash: newCash, hunger: newHunger };
		});
	},

	addToInventory: (item: Item) => {
		set((state) => ({ inventory: [...state.inventory, item] }));
	},

	removeFromInventory: (itemId: string) => {
		set((state) => ({
			inventory: state.inventory.filter((i) => i.id !== itemId),
		}));
	},
}));
"use client";

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// Fix for default marker icon
// @ts-expect-error
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Icons
const UserIcon = new L.Icon({
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

const ResourceIcon = new L.Icon({
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

function MapController({ center }: { center: [number, number] }) {
	const map = useMap();
	useEffect(() => {
		if (center) {
			map.flyTo(center, 15);
		}
	}, [center, map]);
	return null;
}

interface MapCoreProps {
	userPosition: [number, number] | null;
	resources: {
		id: string | number;
		name: string;
		type: string;
		lat: number;
		lng: number;
	}[];
}

export default function MapCore({ userPosition, resources }: MapCoreProps) {
	// Default to Campinas center if no user position
	const defaultPosition: [number, number] = [-22.90556, -47.06083];
	const initialPosition = userPosition || defaultPosition;

	return (
		<MapContainer
			center={initialPosition}
			zoom={13}
			scrollWheelZoom={true}
			className="h-full w-full z-0"
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			<MapController center={initialPosition} />

			{/* User Marker */}
			{userPosition && (
				<Marker position={userPosition} icon={UserIcon}>
					<Popup>
						<strong>Você está aqui</strong>
					</Popup>
				</Marker>
			)}

			{/* Resources Markers */}
			{resources.map((res) => (
				<Marker key={res.id} position={[res.lat, res.lng]} icon={ResourceIcon}>
					<Popup>
						<strong>{res.name}</strong>
						<br />
						<span className="text-xs text-gray-600">{res.type}</span>
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useServices } from "@/contexts/ServicesContext";
import { NearbyList } from "./NearbyList";

const MapCore = dynamic(() => import("./MapCore"), {
	loading: () => <p className="text-center p-10">Carregando mapa interativo...</p>,
	ssr: false,
});

export function SurvivalMap() {
	const [userPosition, setUserPosition] = useState<[number, number] | null>(
		null,
	);
	const [loadingLocation, setLoadingLocation] = useState(false);

	// Use ServicesContext for real data
	const { services } = useServices();

	// Map services to resources format expected by MapCore (splitting coords [lat, lng] -> lat, lng)
	const resources = services.map((s) => ({
		id: s.id,
		name: s.name,
		type: s.type,
		lat: s.coords[0],
		lng: s.coords[1],
	}));

	useEffect(() => {
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
	}, []);


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

				<MapCore userPosition={userPosition} resources={resources} />
			</div>

			{/* Nearby List Area - Scrollable */}
			<div className="flex-1 overflow-y-auto p-4 bg-slate-900 border-t border-slate-800">
				<NearbyList userPosition={userPosition} />
			</div>
		</div>
	);
}
