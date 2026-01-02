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

// Helper to safely get array from JSON import (handles ES modules default export if needed)
// biome-ignore lint/suspicious/noExplicitAny: JSON imports can be unpredictable in build
const safeArray = (data: any): any[] => {
	if (Array.isArray(data)) return data;
	if (data && Array.isArray(data.default)) return data.default;
	return [];
};

// Merge all datasets with normalization and deduplication
const ALL_SERVICES_MAP = new Map<string, ServiceLocation>();

// 1. Process Base Services
safeArray(SERVICES_DATA).forEach((s) => {
	if (s && typeof s === "object" && s.id) {
		ALL_SERVICES_MAP.set(s.id, {
			...s,
			type: s.type as ServiceType,
			effects: s.effects || {},
		});
	}
});

// 2. Process Education Services (overrides/augments)
safeArray(EDUCATION_DATA).forEach((s) => {
	if (s && typeof s === "object" && s.id) {
		// If it already exists, education might be an extra metadata layer
		const existing = ALL_SERVICES_MAP.get(s.id);
		ALL_SERVICES_MAP.set(s.id, {
			...existing,
			...s,
			type: "EDUCATION" as ServiceType,
			category: "Educação Online",
			coords:
				s.coords || existing?.coords || ([-22.905, -47.06] as [number, number]),
			opening_hours: s.opening_hours || "24h",
			effects: s.effects || existing?.effects || {},
		});
	}
});

// 3. Process Expansion Services (overrides/augments)
safeArray(EXPANSION_DATA).forEach((s) => {
	if (s && typeof s === "object" && s.id) {
		const existing = ALL_SERVICES_MAP.get(s.id);
		ALL_SERVICES_MAP.set(s.id, {
			...existing,
			...s,
			coords: (s.coordinates || existing?.coords) as [number, number],
			requirements: s.requirements || existing?.requirements || [],
			effects: s.effects || existing?.effects || {},
		});
	}
});

const ALL_SERVICES = Array.from(ALL_SERVICES_MAP.values());

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
	coords: [number, number] | null;
	address?: string;
	category?: string;
	description?: string;
	rules?: string;
	requirements?: string[];
	phone?: string;
	opening_hours?: string; // Optional
	forbidden_items?: string[];
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
		security?: number;
	};
	interactions?: any[]; // Keep interactions flexible
	action_type?: "map" | "link"; // New: Link vs Map intent
	url?: string; // New: URL for online actions
	relatedLink?: string; // New: External link for side actions (e.g. scheduling)
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
	const [services, setServices] = useState<ServiceLocation[]>(ALL_SERVICES);
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
				refreshServices: async () => {},
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
