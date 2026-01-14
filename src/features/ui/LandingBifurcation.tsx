"use client";

import { useState } from "react";
import { Gamepad2, MapPin, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";

type JourneyType = "simulation" | "survival" | null;

/**
 * LandingBifurcation - Two-Path Onboarding
 * 
 * Separa dois públicos mantendo o jogo como ferramenta core:
 * 1. "Vivenciar a Jornada" - Para doadores/educadores querendo entender a realidade
 * 2. "Começar Agora"  - Para quem está vivendo a situação (interface de sobrevivência)
 */
export function LandingBifurcation() {
    const [journeyType, setJourneyType] = useState<JourneyType>(null);

    // Renderizar bifurcação apenas na primeira visita
    if (journeyType === null) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <div className="max-w-5xl w-full space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
                            Caminhos
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                Campinas
                            </span>
                        </h1>
                        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                            Simulador de <span className="text-white font-bold">sobrevivência em situação de rua</span>
                            {" "}- Baseado em dados reais do Censo Pop Rua 2024
                        </p>
                    </div>

                    {/* Two-Path Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* PATH 1: Para Educadores/Doadores - Tom Empático */}
                        <button
                            type="button"
                            onClick={() => setJourneyType("simulation")}
                            className="group relative p-8 md:p-10 bg-gradient-to-br from-violet-950/80 to-slate-900/80 border-2 border-violet-700/60 rounded-2xl hover:border-violet-500 hover:shadow-2xl hover:shadow-violet-500/20 hover:scale-[1.01] transition-all duration-300 text-left overflow-hidden"
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 space-y-5">
                                <div className="w-14 h-14 rounded-xl bg-violet-600/30 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-600/40 transition-all">
                                    <Gamepad2 size={28} />
                                </div>

                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tight">
                                        Vivenciar a Jornada
                                    </h2>
                                    <p className="text-violet-200/90 text-sm md:text-base leading-relaxed mb-3">
                                        <span className="font-bold text-violet-300">Simulador imersivo</span> que transforma estatísticas em experiência.
                                        Cada barreira que você enfrenta gera evidência sobre falhas da rede de proteção social.
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="px-2.5 py-1 bg-violet-600/40 text-violet-200 text-[11px] rounded-md font-semibold border border-violet-500/30">
                                            📊 Auditoria social
                                        </span>
                                        <span className="px-2.5 py-1 bg-violet-600/40 text-violet-200 text-[11px] rounded-md font-semibold border border-violet-500/30">
                                            🎓 Educadores
                                        </span>
                                        <span className="px-2.5 py-1 bg-violet-600/40 text-violet-200 text-[11px] rounded-md font-semibold border border-violet-500/30">
                                            🤝 Doadores
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-violet-300 font-bold uppercase text-xs md:text-sm tracking-wider pt-2">
                                    Iniciar simulação
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </div>
                            </div>

                            {/* Decorative corner accent */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-500/20 to-transparent rounded-bl-full" />
                        </button>

                        {/* PATH 2: Para Pop Rua - Tom Utilitário/Survival */}
                        <button
                            type="button"
                            onClick={() => setJourneyType("survival")}
                            className="group relative p-8 md:p-10 bg-gradient-to-br from-black via-zinc-950 to-black border-2 border-yellow-500 rounded-2xl hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/30 hover:scale-[1.01] transition-all duration-300 text-left overflow-hidden"
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 group-hover:bg-yellow-500/30 transition-all">
                                        <MapPin size={28} />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black text-xs font-black rounded-full animate-pulse">
                                        <Zap size={14} />
                                        RÁPIDO
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-yellow-400 mb-2 uppercase tracking-tight flex items-baseline gap-2">
                                        Começar Agora
                                    </h2>
                                    <p className="text-yellow-100 font-semibold text-sm md:text-base leading-relaxed mb-3">
                                        <span className="text-yellow-300">Simulador de sobrevivência.</span> Aprenda rotas, horários e recursos vitais.
                                        <span className="block mt-1 text-yellow-200/80">
                                            ✓ Funciona 100% offline • ✓ Salva progresso • ✓ Sem cadastro
                                        </span>
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="px-2.5 py-1 bg-yellow-500/90 text-black text-[11px] rounded-md font-black">
                                            🗺️ Mapa de recursos
                                        </span>
                                        <span className="px-2.5 py-1 bg-yellow-500/90 text-black text-[11px] rounded-md font-black">
                                            🕐 Horários reais
                                        </span>
                                        <span className="px-2.5 py-1 bg-yellow-500/90 text-black text-[11px] rounded-md font-black">
                                            📴 100% offline
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-yellow-400 font-black uppercase text-xs md:text-sm tracking-wider pt-2">
                                    Acessar simulador
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </div>
                            </div>

                            {/* Decorative corner accent */}
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-500/20 to-transparent rounded-tr-full" />
                        </button>
                    </div>

                    {/* Credibilidade / Footer Legal */}
                    <div className="text-center space-y-3 pt-4">
                        <p className="text-slate-500 text-xs max-w-xl mx-auto leading-relaxed">
                            Baseado no <span className="text-slate-400 font-semibold">Censo Pop Rua 2024</span> e{" "}
                            <span className="text-slate-400 font-semibold">Decreto Federal 7.053/2009</span>
                            {" "}• Auditoria Cidadã em Tempo Real
                        </p>
                        <div className="flex items-center justify-center gap-3 text-[10px] text-slate-600 uppercase tracking-wider">
                            <span>Offline-First</span>
                            <span>•</span>
                            <span>Open Data</span>
                            <span>•</span>
                            <span>LGPD-Compliant</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Redirecionar baseado na escolha
    if (journeyType === "simulation") {
        // Doadores/Educadores vão para o jogo (experiência de reflexão)
        window.location.href = "/jogar";
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="text-white text-lg font-medium">Carregando simulador...</div>
                    <div className="text-slate-500 text-sm">Preparando experiência imersiva</div>
                </div>
            </div>
        );
    }

    if (journeyType === "survival") {
        // Pop Rua vai DIRETO PRO JOGO (ferramenta core de sobrevivência)
        window.location.href = "/jogar";
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="text-yellow-400 text-lg font-bold">
                        Carregando simulador de sobrevivência...
                    </div>
                    <div className="text-yellow-200/60 text-sm">Modo offline ativado</div>
                </div>
            </div>
        );
    }

    return null;
}
