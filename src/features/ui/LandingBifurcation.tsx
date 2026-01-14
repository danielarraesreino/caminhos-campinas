"use client";

import { useState } from "react";
import { Gamepad2, MapPin, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";

type JourneyType = "simulation" | "survival" | null;

/**
 * LandingBifurcation - Funil de Empatia
 * 
 * Two-path onboarding que separa claramente os dois públicos:
 * 1. "Vivenciar a Jornada" - Simulador imersivo para doadores/educadores
 * 2. "Preciso de Ajuda Agora" - Guia utilitário para pessoas em vulnerabilidade
 */
export function LandingBifurcation() {
    const [journeyType, setJourneyType] = useState<JourneyType>(null);

    // Renderizar bifurcação apenas na primeira visita
    if (journeyType === null) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <div className="max-w-4xl w-full space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tight">
                            Caminhos
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                Campinas
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Escolha sua jornada na plataforma de auditoria social e
                            reconhecimento territorial
                        </p>
                    </div>

                    {/* Two-Path Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* PATH 1: Simulador Imersivo */}
                        <button
                            type="button"
                            onClick={() => setJourneyType("simulation")}
                            className="group relative p-10 bg-gradient-to-br from-violet-950/50 to-slate-900 border-2 border-violet-800/50 rounded-3xl hover:border-violet-600 hover:scale-[1.02] transition-all duration-300 text-left overflow-hidden"
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 space-y-6">
                                <div className="w-16 h-16 rounded-2xl bg-violet-600/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                                    <Gamepad2 size={32} />
                                </div>

                                <div>
                                    <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">
                                        Vivenciar a Jornada
                                    </h2>
                                    <p className="text-slate-300 leading-relaxed mb-4">
                                        Simulador imersivo que transforma dados em experiência. Cada
                                        barreira que você enfrenta gera evidência sobre falhas da
                                        rede de proteção social.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-violet-600/30 text-violet-300 text-xs rounded-full font-mono">
                                            Para doadores
                                        </span>
                                        <span className="px-3 py-1 bg-violet-600/30 text-violet-300 text-xs rounded-full font-mono">
                                            Educadores
                                        </span>
                                        <span className="px-3 py-1 bg-violet-600/30 text-violet-300 text-xs rounded-full font-mono">
                                            Auditoria social
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-violet-400 font-bold uppercase text-sm tracking-wider">
                                    Iniciar simulação
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </button>

                        {/* PATH 2: Guia Utilitário */}
                        <button
                            type="button"
                            onClick={() => setJourneyType("survival")}
                            className="group relative p-10 bg-black border-2 border-yellow-400 rounded-3xl hover:border-yellow-300 hover:scale-[1.02] transition-all duration-300 text-left overflow-hidden"
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 space-y-6">
                                <div className="w-16 h-16 rounded-2xl bg-yellow-400/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                                    <MapPin size={32} />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <h2 className="text-3xl font-black text-yellow-400 uppercase tracking-tight">
                                            Sobrevivência Real
                                        </h2>
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-400 text-black text-xs rounded-full font-bold">
                                            <Zap size={12} />
                                            JOGUE
                                        </div>
                                    </div>
                                    <p className="text-yellow-200 font-semibold leading-relaxed mb-4">
                                        Simulador de sobrevivência que ensina rotas, horários e
                                        recursos vitais. Funciona 100% offline depois do primeiro
                                        acesso. Salva seu progresso mesmo sem internet.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-yellow-400 text-black text-xs rounded-full font-bold">
                                            Mapa de recursos
                                        </span>
                                        <span className="px-3 py-1 bg-yellow-400 text-black text-xs rounded-full font-bold">
                                            Horários reais
                                        </span>
                                        <span className="px-3 py-1 bg-yellow-400 text-black text-xs rounded-full font-bold">
                                            100% offline
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase text-sm tracking-wider">
                                    Começar simulação de sobrevivência
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Footer Legal */}
                    <div className="text-center text-slate-500 text-xs">
                        <p>
                            Baseado no Censo Pop Rua 2024 e Decreto Federal 7.053/2009 •
                            Auditoria Cidadã em Tempo Real
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Redirecionar baseado na escolha
    if (journeyType === "simulation") {
        // Redirecionar para o simulador (/jogar)
        window.location.href = "/jogar";
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white text-lg">Carregando simulador...</div>
            </div>
        );
    }

    if (journeyType === "survival") {
        // Pop rua vai DIRETO PRO JOGO (ferramenta core de sobrevivência)
        window.location.href = "/jogar";
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-yellow-400 text-lg font-bold">
                    Carregando simulador de sobrevivência...
                </div>
            </div>
        );
    }

    return null;
}
