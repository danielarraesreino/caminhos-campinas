"use client";

import { BarChart3, MapPin, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { data: _session, status } = useSession();
	const pathname = usePathname();
	const router = useRouter();

	// Close menu when route changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: Trigger on route change
	useEffect(() => {
		setIsMenuOpen(false);
	}, [pathname]);

	const handleNavigation = (sectionId: string) => {
		if (pathname !== "/") {
			router.push(`/#${sectionId}`);
			return;
		}

		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		setIsMenuOpen(false);
	};

	return (
		<nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-slate-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link href="/" className="flex items-center gap-2">
						<div className="bg-blue-600 p-2 rounded-lg">
							<MapPin className="h-6 w-6 text-white" />
						</div>
						<span className="font-bold text-xl tracking-tight text-slate-800">
							Caminhos <span className="text-blue-600">Campinas</span>
						</span>
					</Link>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-8">
						<button
							type="button"
							onClick={() => handleNavigation("projeto")}
							className="text-slate-600 hover:text-blue-600 font-bold transition-colors uppercase tracking-widest text-xs"
						>
							A Rua Tem Voz
						</button>
						<Link
							href="/impacto"
							className="text-blue-600 hover:text-blue-800 font-bold transition-colors flex items-center gap-1 uppercase tracking-widest text-xs"
						>
							<BarChart3 className="w-4 h-4" /> Painel de Impacto
						</Link>
						<Link
							href="/#mapa"
							className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1 uppercase tracking-widest text-xs"
						>
							<MapPin className="w-4 h-4 text-green-600" /> Mapa de Apoio
						</Link>
						<button
							type="button"
							onClick={() => handleNavigation("demo-ia")}
							className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1 uppercase tracking-widest text-xs"
						>
							<Sparkles className="w-4 h-4 text-purple-500" /> Demo IA
						</button>
						{status === "authenticated" ? (
							<Link
								href="/jogar"
								className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
							>
								Continuar Jornada
							</Link>
						) : (
							<button
								type="button"
								// Opens login modal only if on landing page, otherwise redirects to home (or login page if we had one)
								// Since logic for opening modal is in LandingPage, we might need a Global Context for LoginModal or just redirect to custom login page.
								// For now, if not on home, redirect to home with query param? Or just redirect to /api/auth/signin
								onClick={() => {
									if (pathname === "/") {
										// This is tricky because the modal state is inside LandingPage.
										// We might need to expose it or move it up.
										// For simplicity now:
										window.location.href = "/api/auth/signin";
									} else {
										window.location.href = "/api/auth/signin";
									}
								}}
								className="text-slate-600 hover:text-blue-600 font-bold uppercase tracking-widest text-xs"
							>
								Entrar
							</button>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							type="button"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-slate-600 p-2"
							aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
						>
							{isMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="md:hidden bg-white border-b border-slate-200 animate-fade-in">
					<div className="px-4 pt-2 pb-6 space-y-2">
						<button
							type="button"
							onClick={() => handleNavigation("projeto")}
							className="block w-full text-left px-3 py-3 text-slate-600 font-medium border-b border-slate-100"
						>
							O Projeto
						</button>
						<button
							type="button"
							onClick={() => handleNavigation("demo-ia")}
							className="block w-full text-left px-3 py-3 text-slate-600 font-medium border-b border-slate-100 flex items-center gap-2"
						>
							<Sparkles className="w-4 h-4 text-purple-500" /> Demo IA
						</button>
						<button
							type="button"
							onClick={() => handleNavigation("tecnologia")}
							className="block w-full text-left px-3 py-3 text-slate-600 font-medium border-b border-slate-100"
						>
							Tecnologia
						</button>
						<button
							type="button"
							onClick={() => {
								if (status === "authenticated") {
									router.push("/jogar");
								} else {
									window.location.href = "/api/auth/signin";
								}
							}}
							className="block w-full text-left px-3 py-3 text-slate-600 font-medium border-b border-slate-100"
						>
							{status === "authenticated" ? "Jogar" : "Entrar"}
						</button>
						<button
							type="button"
							onClick={() => handleNavigation("doar")}
							className="block w-full mt-4 text-center bg-blue-600 text-white px-3 py-3 rounded-lg font-bold"
						>
							Apoiar Agora
						</button>
					</div>
				</div>
			)}
		</nav>
	);
}
