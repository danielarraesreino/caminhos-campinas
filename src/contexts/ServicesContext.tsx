"use client";

import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

import SERVICES_DATA from "@/data/services-campinas.json";
import EDUCATION_DATA from "@/data/services-education.json";
import EXPANSION_DATA from "@/data/services-expansion.json";

// Merge all datasets with normalization
const ALL_SERVICES = [
	...SERVICES_DATA.map((s) => ({ ...s, type: s.type as ServiceType })),
	...EDUCATION_DATA.map((s) => ({
		...s,
		type: "EDUCATION" as ServiceType,
		category: "Educação Online",
		coords: [-22.905, -47.06] as [number, number], // Default center for online
		opening_hours: "24h",
	})),
	...EXPANSION_DATA.map((s) => ({
		...s,
		coords: s.coordinates as [number, number], // Map coordinates -> coords
		requirements: s.requirements || [],
	})),
] as ServiceLocation[];

export type ServiceType =
	| "ALIMENTACAO"
	| "ABRIGO"
	| "SAUDE"
	| "ASSISTENCIA"
	| "TRABALHO"
	| "EDUCATION"
	| "DOCUMENTS"
	| "HEALTH_MENTAL"
	| "OUTRO";

export interface ServiceLocation {
	id: string;
	name: string;
	type: ServiceType | string; // Allow string for raw JSON compatibility
	coords: [number, number];
	opening_hours: string;
	address?: string;
	category?: string;
	description?: string;
	rules?: string;
	requirements?: string[];
	phone?: string;
	effects?: {
		hunger?: number;
		health?: number;
		hygiene?: number;
		sanity?: number;
		energy?: number;
		dignity?: number;
		money?: number;
		stabilityGap?: number;
		addBuff?: string;
		security?: number; // Added from bagageiro check
	};
}

interface ServicesContextProps {
	services: ServiceLocation[];
	loading: boolean;
	error: string | null;
	filterServices: (type: ServiceType | "all") => ServiceLocation[];
	refreshServices: () => Promise<void>;
}

const ServicesContext = createContext<ServicesContextProps | undefined>(
	undefined,
);

const STORAGE_KEY = "services_data";

export function ServicesProvider({ children }: { children: React.ReactNode }) {
	const [services, setServices] = useState<ServiceLocation[]>(
		ALL_SERVICES,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Optional: Still allow local storage override if we plan to support dynamic updates
	/* const loadFromStorage = useCallback(() => { ... */

	// Since the data is static and imported, we don't need a frantic fetch effect.
	// If we want to simulate async or allow overrides, we can keep some logic, 
	// but for now, direct import fulfills "read from this JSON".


	const filterServices = useCallback(
		(type: ServiceType | "all") => {
			if (type === "all") return services;

			// Enhanced filtering: include services that PROVIDE the benefit, even if main type differs
			return services.filter((s) => {
				const isExactMatch = s.type === type;
				if (isExactMatch) return true;

				// Cross-category checks based on effects
				if (type === "ALIMENTACAO" && (s.effects?.hunger || 0) > 0) return true;

				if (type === "SAUDE" && (s.effects?.health || 0) > 0) return true;
				if (
					type === "ABRIGO" &&
					(s.effects?.energy || 0) > 0 &&
					s.type !== "ABRIGO" // Avoid self-match loop if type was already checked (though isExactMatch covers it)
				)
					return true;

				return false;
			});
		},
		[services],
	);

	return (
		<ServicesContext.Provider
			value={{
				services,
				loading,
				error,
				filterServices,
				refreshServices: async () => { },
			}}
		>
			{children}
		</ServicesContext.Provider>
	);
}

export function useServices() {
	const context = useContext(ServicesContext);
	if (context === undefined) {
		throw new Error("useServices must be used within a ServicesProvider");
	}
	return context;
}
