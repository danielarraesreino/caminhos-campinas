"use client";

import React from "react";
import { EcoButton } from "@/components/ui/EcoButton";
import { EcoCard } from "@/components/ui/EcoCard";
import { type Item, useGameContext } from "@/contexts/GameContext";
import { useServices } from "@/contexts/ServicesContext";
import { NearbyList } from "@/features/survival-map/NearbyList";
import { useTelemetry } from "@/hooks/useTelemetry";
import { TelemetryAction } from "@/services/telemetry";

export default function TestFeaturesPage() {
	const { services, loading, error, refreshServices } = useServices();
	const {
		hunger,
		health,
		money: cash,
		eat,
		sleep,
		work,
		inventory,
		addToInventory,
	} = useGameContext();
	const { trackAction } = useTelemetry();

	const [isOnline, setIsOnline] = React.useState(true);

	const mockItem: Item = {
		id: `test-item-${Date.now()}`,
		name: "Papelão Coletado",
		weight: 2.5,
		type: "valioso",
	};

	React.useEffect(() => {
		setIsOnline(navigator.onLine);
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return (
		<div className="bg-black min-h-screen p-8 text-white space-y-8">
			<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
				Feature Validation Lab (Refactored)
			</h1>

			{/* 1. Eco Design System */}
			<section className="space-y-4 border border-zinc-800 p-6 rounded-xl">
				<h2 className="text-xl font-semibold mb-4">1. Eco Design System</h2>
				<div className="flex flex-wrap gap-4">
					<EcoButton
						variant="primary"
						onClick={() => console.log("Primary Click")}
					>
						Primary Action
					</EcoButton>
					<EcoButton variant="danger">Danger Zone</EcoButton>
					<EcoButton variant="ghost">Ghost Button</EcoButton>
					<EcoButton variant="primary" size="icon">
						★
					</EcoButton>
				</div>
				<EcoCard className="mt-4">
					<h3 className="font-bold">EcoCard Component</h3>
					<p className="text-zinc-400">
						Pure black background for OLED efficiency.
					</p>
				</EcoCard>
			</section>

			{/* 2. Game Context & Telemetry */}
			<section className="space-y-4 border border-zinc-800 p-6 rounded-xl">
				<h2 className="text-xl font-semibold">
					2. Game Context State (Single Source)
				</h2>
				<div className="grid grid-cols-4 gap-4 text-center mb-4">
					<div className="p-3 bg-zinc-900 rounded">
						Hunger:{" "}
						<span className={hunger < 20 ? "text-red-500" : "text-green-500"}>
							{hunger}
						</span>
					</div>
					<div className="p-3 bg-zinc-900 rounded">Health: {health}</div>
					<div className="p-3 bg-zinc-900 rounded">
						Cash: R$ {cash.toFixed(2)}
					</div>
					<div className="p-3 bg-zinc-900 rounded">
						Items: {inventory.length}
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<EcoButton variant="ghost" onClick={() => eat(10)}>
						Eat (+10)
					</EcoButton>
					<EcoButton variant="ghost" onClick={() => work(1)}>
						Work 1h (+R$10)
					</EcoButton>
					<EcoButton variant="danger" onClick={() => sleep(false)}>
						Unsafe Sleep (Telemetry)
					</EcoButton>
					<EcoButton variant="primary" onClick={() => addToInventory(mockItem)}>
						Add Weight (2.5kg)
					</EcoButton>
				</div>

				<div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
					<h3 className="text-sm font-bold text-zinc-400 mb-2">
						Inventário (Peso Total:{" "}
						{inventory
							.reduce((acc: number, i: any) => acc + i.weight, 0)
							.toFixed(1)}
						kg)
					</h3>
					<div className="flex flex-wrap gap-2">
						{inventory.map((item: any) => (
							<span
								key={item.id}
								className="text-xs px-2 py-1 bg-zinc-800 rounded"
							>
								{item.name} ({item.weight}kg)
							</span>
						))}
					</div>
				</div>

				<div className="mt-4">
					<h3 className="text-sm font-bold text-zinc-500 mb-2">
						Manual Telemetry
					</h3>
					<EcoButton
						variant="primary"
						onClick={() => trackAction(TelemetryAction.CLICK, { demo: true })}
					>
						Track 'CLICK' Event
					</EcoButton>
				</div>
			</section>

			{/* 3. Services Context */}
			<section className="space-y-4 border border-zinc-800 p-6 rounded-xl">
				<h2 className="text-xl font-semibold">
					3. Offline Services Manager & Nearby List
				</h2>

				<div className="flex justify-between items-center">
					<p className="text-sm text-zinc-400">
						Data Source: {isOnline ? "Online/Cached" : "Offline Storage"}
					</p>
					<EcoButton
						size="sm"
						variant="ghost"
						onClick={() => refreshServices()}
					>
						Refresh
					</EcoButton>
				</div>

				{loading && <p>Loading services...</p>}
				{error && <p className="text-red-500">{error}</p>}

				<div className="grid gap-6 md:grid-cols-2">
					<div>
						<h3 className="mb-2 font-bold text-zinc-400">
							All Services ({services.length})
						</h3>
						<div className="space-y-2">
							{services.map((service) => (
								<EcoCard key={service.id} className="border-zinc-800">
									<div className="flex justify-between items-start">
										<h3 className="font-bold text-lg">{service.name}</h3>
										<span className="text-xs px-2 py-1 bg-zinc-900 rounded capitalize">
											{service.type}
										</span>
									</div>
									<p className="text-sm text-zinc-400 mt-2">
										{service.address}
									</p>
								</EcoCard>
							))}
						</div>
					</div>

					<div>
						<h3 className="mb-2 font-bold text-zinc-400">
							Nearby List (Mock User @ Campinas Center)
						</h3>
						<NearbyList />
					</div>
				</div>
			</section>
		</div>
	);
}
