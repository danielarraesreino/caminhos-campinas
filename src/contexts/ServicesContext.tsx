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
	| "food"
	| "shelter"
	| "health"
	| "hygiene"
	| "assistance"
	| "work"
	| "comércio"
	| "privado";

export interface ServiceLocation {
	id: string;
	name: string;
	type: ServiceType;
	coords: [number, number];
	opening_hours: string;
	address?: string;
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
			// For this offline-first requirement, if we have cached data, we might not want to block or error hard.
			// But let's try to update it.
			if (navigator.onLine) {
				const response = await fetch("/data/services-campinas.json");
				if (!response.ok) throw new Error("Failed to fetch services");
				const data: ServiceLocation[] = await response.json();

				setServices(data);
				saveToStorage(data);
			} else if (!cached) {
				setError("Offline e nenhum dado salvo encontrado.");
			}
		} catch (err) {
			console.error(err);
			// If fetch fails but we had cache, we are fine, just maybe show a warning log.
			// If we didn't have cache, set error.
			if (!loadFromStorage()) {
				setError("Erro ao carregar serviços.");
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
			return services.filter((s) => s.type === type);
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
