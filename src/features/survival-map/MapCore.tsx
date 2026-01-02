"use client";

import L from "leaflet";
import { useEffect, memo } from "react";
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

// Dynamic Icon Factory
const getIconForType = (type: string) => {
	let colorUrl = "marker-icon-2x-blue.png"; // Default

	if (type === "shelter" || type === "abrigo" || type === "albergue") {
		colorUrl = "marker-icon-2x-violet.png";
	} else if (type === "food" || type === "alimentacao") {
		colorUrl = "marker-icon-2x-orange.png";
	} else if (type === "health" || type === "saude") {
		colorUrl = "marker-icon-2x-red.png";
	} else if (type === "work" || type === "educacao") {
		colorUrl = "marker-icon-2x-gold.png";
	} else if (type === "assistencia") {
		colorUrl = "marker-icon-2x-blue.png"; // Default blue
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
	onTravel?: (lat: number, lng: number) => void;
	onResourceInteract?: (res: any) => void;
}

<<<<<<< HEAD
export default function MapCore({
	userPosition,
	resources,
=======
const MapCore = memo(function MapCore({
	userPosition,
	resources,
	onTravel,
>>>>>>> 9ff5c3fb2de03e1743bce4b51ec2858e1a242085
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
				<Marker
					key={res.id}
					position={[res.lat, res.lng]}
					icon={getIconForType(res.type)}
				>
					<Popup>
						<div className="flex flex-col gap-2 min-w-[150px]">
<<<<<<< HEAD
							<strong className="text-sm font-bold">{res.name}</strong>
							<span className="text-xs uppercase tracking-wide text-slate-500 font-bold">
								{res.type}
							</span>
							<hr className="border-slate-200" />
=======
							<div>
								<strong className="text-sm text-slate-900">{res.name}</strong>
								<br />
								<span className="text-xs text-gray-500 uppercase tracking-wide">
									{res.type}
								</span>
							</div>
>>>>>>> 9ff5c3fb2de03e1743bce4b51ec2858e1a242085
							<button
								type="button"
								onClick={() => {
									onTravel?.(res.lat, res.lng);
									onResourceInteract?.(res);
								}}
								className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded shadow-md transition-colors w-full"
							>
								👣 Ir e Interagir
							</button>
						</div>
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
});

export default MapCore;
