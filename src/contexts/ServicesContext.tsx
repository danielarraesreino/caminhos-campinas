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
	const [services, setServices] = useState<ServiceLocation[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadFromStorage = useCallback(() => {
		if (typeof window === "undefined") return null;
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				return JSON.parse(stored) as ServiceLocation[];
			}
		} catch (e) {
			console.warn("Failed to parse services from storage", e);
		}
		return null;
	}, []);

	const saveToStorage = useCallback((data: ServiceLocation[]) => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch (e) {
			console.warn("Failed to save services to storage", e);
		}
	}, []);

	const fetchServices = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// Try reading from storage first to show something immediately
			const cached = loadFromStorage();
			if (cached) {
				setServices(cached);
			}

			// If we are online, fetch fresh data
			if (navigator.onLine) {
				const response = await fetch("/data/services-campinas.json");
				if (!response.ok) throw new Error("Failed to fetch services");
				const data: ServiceLocation[] = await response.json();

				setServices(data);
				saveToStorage(data);
			}
		} catch (err) {
			console.error(err);
			if (!loadFromStorage()) {
				setError("Erro ao carregar serviços. Verifique sua conexão.");
			}
		} finally {
			setLoading(false);
		}
	}, [loadFromStorage, saveToStorage]);

	useEffect(() => {
		fetchServices();
	}, [fetchServices]);

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
				refreshServices: fetchServices,
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
