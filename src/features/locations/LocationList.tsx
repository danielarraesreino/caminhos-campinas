"use client";

import { useState } from "react";
import { REALITY_NODES } from "@/data/RealityAtlas";
import type { Location } from "@/types/GameState";
import { LocationCard } from "./LocationCard";
import { LocationDetailsDrawer } from "./LocationDetailsDrawer";

export function LocationList() {
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(
		null,
	);

	return (
		<div className="w-full h-full flex flex-col space-y-4 px-4 pb-24">
			<div className="mb-2">
				<h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
					Exploração Urbana
				</h2>
				<p className="text-xs text-zinc-600 font-mono mt-1">
					Cidade de Campinas / SP
				</p>
			</div>

			<div className="space-y-4">
				{REALITY_NODES.map((location) => (
					<LocationCard
						key={location.id}
						location={location}
						onClick={() => setSelectedLocation(location)}
					/>
				))}
			</div>

			<LocationDetailsDrawer
				location={selectedLocation}
				isOpen={selectedLocation !== null}
				onClose={() => setSelectedLocation(null)}
			/>
		</div>
	);
}
