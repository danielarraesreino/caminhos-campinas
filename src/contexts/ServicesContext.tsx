"use client";

import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

export type ServiceType =
	| "ALIMENTACAO"
	| "ABRIGO"
	| "SAUDE"
	| "ASSISTENCIA"
	| "ADMINISTRATIVO";

export interface ServiceLocation {
	id: string;
	name: string;
	type: ServiceType;
	coords: [number, number];
	opening_hours: string;
	address?: string;
	category?: string;
	description?: string;
	rules?: string;
	requirements?: string[];
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

import SERVICES_DATA from "@/data/services-campinas.json";

export function ServicesProvider({ children }: { children: React.ReactNode }) {
	const [services, setServices] = useState<ServiceLocation[]>(SERVICES_DATA as unknown as ServiceLocation[]); // Cast if type mismatch
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
