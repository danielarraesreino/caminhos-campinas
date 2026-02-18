"use client";

import L from "leaflet";
import { memo, useEffect } from "react";
import {
	CircleMarker,
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
} from "react-leaflet";
import { ODS_REGISTRY } from "@/data/ods-registry";
import type { ODSTarget } from "@/types/GameState";

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

// Dynamic Icon Factory
const getIconForType = (type: string) => {
	let colorUrl = "marker-icon-2x-blue.png"; // Default

	if (type === "shelter" || type === "abrigo" || type === "albergue") {
		colorUrl = "marker-icon-2x-violet.png";
	} else if (type === "food" || type === "alimentacao") {
		colorUrl = "marker-icon-2x-orange.png";
	} else if (type === "health" || type === "saude") {
		colorUrl = "marker-icon-2x-red.png";
	} else if (type === "work" || type === "educacao" || type === "trabalho") {
		colorUrl = "marker-icon-2x-gold.png";
	} else if (type === "assistencia") {
		colorUrl = "marker-icon-2x-blue.png";
	} else if (type === "documentos" || type === "cidadania") {
		colorUrl = "marker-icon-2x-green.png";
	}

	return new L.Icon({
		iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/${colorUrl}`,
		shadowUrl:
			"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});
};

/**
 * Mapeia tipo de serviço para meta ODS principal
 */
function getODSForType(type: string): ODSTarget {
	const t = type.toUpperCase();
	switch (t) {
		case "ALIMENTACAO":
			return "2.1";
		case "ABRIGO":
			return "11.1";
		case "SAUDE":
			return "3.8";
		case "ASSISTENCIA":
			return "1.3";
		case "DOCUMENTOS":
			return "16.9";
		case "TRABALHO":
			return "8.5";
		case "HIGIENE":
			return "6.2";
		case "CIDADANIA":
			return "10.2";
		default:
			return "1.4";
	}
}

/**
 * Verifica se é um serviço público que merece texto de advocacy
 */
function isPublicService(name: string): boolean {
	const publicKeywords = [
		"CRAS",
		"CREAS",
		"Centro POP",
		"CAPS",
		"UBS",
		"SAMIM",
		"Poupatempo",
		"CPAT",
		"DAS",
	];
	return publicKeywords.some((k) =>
		name.toUpperCase().includes(k.toUpperCase()),
	);
}

function MapController({ center }: { center: [number, number] }) {
	const map = useMap();
	useEffect(() => {
		if (center) {
			map.flyTo(center, 15);
		}
	}, [center, map]);
	return null;
}

interface DenialPoint {
	coords: [number, number];
	count: number;
	types: string[];
	primaryODS?: string;
	color?: { fill: string; stroke: string };
}

interface MapCoreProps {
	userPosition: [number, number] | null;
	resources: {
		id: string | number;
		name: string;
		type: string;
		lat: number;
		lng: number;
		odsTargets?: string[];
	}[];
	denialPoints?: DenialPoint[];
	showDenials?: boolean;
	onTravel?: (lat: number, lng: number) => void;
	// biome-ignore lint/suspicious/noExplicitAny: Generic resource interaction
	onResourceInteract?: (res: any) => void;
}

const MapCore = memo(function MapCore({
	userPosition,
	resources,
	denialPoints = [],
	showDenials = false,
	onTravel,
	onResourceInteract,
}: MapCoreProps) {
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

			{/* Denial Heatmap Layer (Círculos com cores ODS) */}
			{showDenials &&
				denialPoints.map((point, idx) => {
					const radius = 15 + point.count * 5; // Raio baseado na frequência
					// Usa cores ODS do ponto ou fallback para vermelho
					const fillColor = point.color?.fill || "rgba(220, 38, 38, 0.5)";
					const strokeColor = point.color?.stroke || "#7f1d1d";

					return (
						<CircleMarker
							key={`denial-${point.coords[0]}-${point.coords[1]}-${idx}`}
							center={point.coords}
							radius={radius}
							pathOptions={{
								fillColor,
								fillOpacity: 0.6,
								color: strokeColor,
								weight: 2,
							}}
							aria-label={`Zona de direito negado com ${point.count} ocorrência${point.count > 1 ? "s" : ""}`}
						>
							<Popup>
								<div className="text-center p-2">
									<span className="text-2xl">🚫</span>
									<h3 className="font-bold text-red-700 mt-1">
										Zona de Direito Negado
									</h3>
									<p className="text-xs text-gray-600 mt-1">
										{point.count} ocorrência{point.count > 1 ? "s" : ""}{" "}
										registrada{point.count > 1 ? "s" : ""}
									</p>
									{point.primaryODS && (
										<p className="text-[10px] text-purple-600 mt-2 font-medium">
											Violação do ODS {point.primaryODS}
										</p>
									)}
								</div>
							</Popup>
						</CircleMarker>
					);
				})}

			{/* User Marker */}
			{userPosition && (
				<Marker
					position={userPosition}
					icon={UserIcon}
					title="Sua localização"
					alt="Sua localização atual no mapa"
				>
					<Popup>
						<strong>Você está aqui</strong>
					</Popup>
				</Marker>
			)}

			{/* Resources Markers */}
			{resources.map((res) => {
				const odsTarget = getODSForType(res.type);
				const odsInfo = ODS_REGISTRY[odsTarget];
				const isPublic = isPublicService(res.name);

				return (
					<Marker
						key={res.id}
						position={[res.lat, res.lng]}
						icon={getIconForType(res.type)}
						title={`${res.name} (${res.type})`}
						alt={`${res.name} - Tipo: ${res.type}`}
					>
						<Popup>
							<div className="flex flex-col gap-2 min-w-[200px]">
								<div>
									<strong className="text-sm text-slate-900">{res.name}</strong>
									<br />
									<span className="text-xs text-gray-500 uppercase tracking-wide">
										{res.type}
									</span>
								</div>

								{/* Tag ODS */}
								{odsInfo && (
									<div
										className="text-[10px] px-2 py-1 rounded-full inline-flex items-center gap-1 w-fit"
										style={{
											backgroundColor: `${odsInfo.color}20`,
											color: odsInfo.color,
										}}
									>
										<span>🎯</span>
										<span>
											Meta {odsTarget}: {odsInfo.label}
										</span>
									</div>
								)}

								{/* Advocacy Text para serviços públicos */}
								{isPublic && (
									<div className="mt-2 pt-2 border-t border-gray-200">
										<p className="text-[11px] text-purple-700 leading-relaxed">
											<strong>⚖️ Equipamento Público:</strong> Este serviço é
											vital para o cumprimento da{" "}
											<strong>Meta {odsTarget}</strong> dos ODS. Se estiver
											fechado ou negar atendimento,{" "}
											<a
												href="/sugerir"
												className="underline text-blue-600 font-bold"
											>
												denuncie aqui
											</a>
											.
										</p>
									</div>
								)}

								<button
									type="button"
									onClick={() => {
										onTravel?.(res.lat, res.lng);
										onResourceInteract?.(res);
									}}
									className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded shadow-md transition-colors w-full mt-2"
								>
									👣 Ir e Interagir
								</button>
							</div>
						</Popup>
					</Marker>
				);
			})}
		</MapContainer>
	);
});

export default MapCore;
