"use client";

import {
	BarChart,
	Building2,
	FileText,
	Gamepad,
	MapPin,
	Menu,
	Wifi,
	WifiOff,
	X,
} from "lucide-react";
import Link from "next/link";
<<<<<<< HEAD
import { useState } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> 9ff5c3fb2de03e1743bce4b51ec2858e1a242085
import { BatteryIndicator } from "@/components/ui/BatteryIndicator";
import { Button } from "@/components/ui/button";

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setIsOnline(navigator.onLine);
			const handleOnline = () => setIsOnline(true);
			const handleOffline = () => setIsOnline(false);
			window.addEventListener("online", handleOnline);
			window.addEventListener("offline", handleOffline);
			return () => {
				window.removeEventListener("online", handleOnline);
				window.removeEventListener("offline", handleOffline);
			};
		}
	}, []);

	// Navigation groups for separate personas
	const primaryLinks = [
		{
			href: "/jogar",
			label: "Simulador",
			icon: <Gamepad className="w-4 h-4" />,
		},
		{
			href: "/impacto",
			label: "Dados Abertos",
			icon: <BarChart className="w-4 h-4" />,
		},
		{
			href: "/transparencia",
			label: "Transparência",
			icon: <FileText className="w-4 h-4" />,
		},
		{
			href: "/jornal",
			label: "Jornal da Rua",
			icon: <FileText className="w-4 h-4" />,
		},
		{
			href: "/parceiros",
			label: "Parceiros ESG",
			icon: <Building2 className="w-4 h-4" />,
		},
	];

	const utilityLinks = [
		{
			href: "/recursos",
			label: "Guia de Rua",
			icon: <MapPin className="w-4 h-4" />,
			className: "text-yellow-400 hover:text-yellow-300 font-bold", // Visual distinction for survival tools
		},
	];

	// Hide Navbar on Game Page only (immersive mode)
	// const pathname = usePathname();
	// if (pathname === "/jogar") return null;

	return (
		<nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-[100]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* 1. BRANDING */}
					<Link href="/" className="flex items-center gap-2 group">
						<div className="w-8 h-8 bg-blue-600 group-hover:bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white transition-colors">
							C
						</div>
						<span className="font-bold text-xl tracking-tight text-white transition-colors">
							Caminhos{" "}
							<span className="text-blue-500 group-hover:text-blue-400">
								Campinas
							</span>
						</span>
					</Link>

					{/* 2. DESKTOP MENU (Bifurcated) */}
					{/* Changed md:flex to lg:flex to avoid overflow on medium screens */}
					<div className="hidden lg:flex items-center gap-6">
						{/* Group A: Empathy & Data */}
						<div className="flex items-center space-x-1 border-r border-zinc-800 pr-6">
							<Link
								href="/"
								className="text-zinc-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
							>
								Início
							</Link>
							{primaryLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-zinc-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
								>
									{link.icon}
									{link.label}
								</Link>
							))}
						</div>

						{/* Group B: Survival Utility (Highlighted) */}
						{utilityLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-yellow-500/20 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all ${link.className}`}
							>
								{link.icon}
								{link.label}
							</Link>
						))}

						{/* CTA */}
						<Link href="/apoie">
							<Button
								variant="default"
								className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-900/20"
							>
								<span className="hidden xl:inline">Apoie Agora</span>
								<span className="xl:hidden">Apoiar</span>
							</Button>
						</Link>

						{/* Offline Indicator */}
						<div
							title={isOnline ? "Você está Online" : "Modo Offline Ativo"}
							className={`flex items-center justify-center p-2 rounded-full transition-colors ${isOnline ? "text-green-500/50" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}
						>
							{isOnline ? (
								<Wifi className="w-4 h-4" />
							) : (
								<WifiOff className="w-4 h-4 animate-pulse" />
							)}
						</div>
					</div>

					{/* 3. MOBILE MENU BUTTON */}
					<div className="-mr-2 flex lg:hidden">
						<div className="mr-4 flex lg:hidden items-center">
							{!isOnline && (
								<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/30 border border-red-500/30 text-red-200 text-xs font-bold animate-pulse">
									<WifiOff className="w-3 h-3" />
									<span className="sr-only">Offline</span>
								</div>
							)}
						</div>
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
							aria-expanded={isOpen ? "true" : "false"}
						>
							<span className="sr-only">Abrir menu principal</span>
							{isOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* 4. MOBILE MENU (Drawer) */}
			{isOpen && (
				<div className="lg:hidden bg-zinc-950 border-b border-zinc-800 animate-in slide-in-from-top-2">
					<div className="px-4 pt-2 pb-6 space-y-4">
						{/* Mobile Group A */}
						<div className="space-y-1">
							<p className="text-xs uppercase tracking-widest text-zinc-600 font-bold px-3 py-2">
								Explorar
							</p>
							<Link
								href="/"
								onClick={() => setIsOpen(false)}
								className="block px-3 py-3 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900"
							>
								Início
							</Link>
							{primaryLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setIsOpen(false)}
									className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900"
								>
									{link.icon}
									{link.label}
								</Link>
							))}
						</div>

						<div className="border-t border-zinc-800 my-2"></div>

						{/* Mobile Group B: Utility */}
						<div className="space-y-1">
							<p className="text-xs uppercase tracking-widest text-yellow-600 font-bold px-3 py-2">
								Utilidade Pública
							</p>
							{utilityLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setIsOpen(false)}
									className={`flex items-center gap-3 px-3 py-3 rounded-md text-base bg-yellow-950/20 border border-yellow-900/30 ${link.className}`}
								>
									{link.icon}
									{link.label}
								</Link>
							))}
						</div>

						<div className="pt-2">
							<Link href="/apoie" onClick={() => setIsOpen(false)}>
								<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-bold">
									Apoie a Causa
								</Button>
							</Link>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
