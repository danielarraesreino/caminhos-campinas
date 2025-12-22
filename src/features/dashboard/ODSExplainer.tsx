"use client";

import React from "react";
import { Info, Home, Heart, GraduationCap, ShieldAlert } from "lucide-react";

export function ODSExplainer() {
    return (
        <div className="space-y-8 bg-slate-950/40 border border-slate-900 p-8 rounded-lg shadow-2xl">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                    <Info className="text-blue-500" size={28} />
                    Direitos e Metas Globais (ODS)
                </h2>
                <div className="h-1 w-20 bg-blue-600 rounded-full" />
            </div>

            <p className="text-lg text-slate-300 leading-relaxed font-sans max-w-3xl">
                Os Objetivos de Desenvolvimento Sustentável (Agenda 2030) da ONU representam um compromisso global.
                Para quem vive na rua, porém, essas metas não são apenas estatísticas: são <strong>direitos vitais</strong> que estão sendo violados diariamente.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ODSItem
                    icon={<Home size={24} />}
                    title="ODS 11.1: Direito à Moradia"
                    desc="O 'Direito à Cidade' começa com um teto seguro. Sem um endereço ou local de repouso digno, o estado de alerta constante impede qualquer desenvolvimento humano ou cidadania básica."
                    color="text-blue-400"
                    bgColor="bg-blue-500/5"
                    borderColor="border-blue-900/30"
                />
                <ODSItem
                    icon={<Heart size={24} />}
                    title="ODS 3: Saúde e Bem-estar"
                    desc="A vida nas ruas acelera a degradação física e mental. Garantir acesso à saúde (como o Consultório na Rua) é a base para a redução de danos e a preservação da dignidade."
                    color="text-red-400"
                    bgColor="bg-red-500/5"
                    borderColor="border-red-900/30"
                />
                <ODSItem
                    icon={<GraduationCap size={24} />}
                    title="ODS 4: Educação de Qualidade"
                    desc="A autonomia vem pelo conhecimento. Contudo, é uma barreira intransponível tentar estudar ou se capacitar enquanto o corpo luta contra a privação severa de sono e alimentação."
                    color="text-purple-400"
                    bgColor="bg-purple-500/5"
                    borderColor="border-purple-900/30"
                />
                <ODSItem
                    icon={<ShieldAlert size={24} />}
                    title="ODS 10: Redução das Desigualdades"
                    desc="Onde o Estado falha na assistência e proteção, o sistema criminal costuma ser a única resposta. Combater a criminalização da pobreza é fundamental para a justiça social."
                    color="text-orange-400"
                    bgColor="bg-orange-500/5"
                    borderColor="border-orange-900/30"
                />
            </div>
        </div>
    );
}

function ODSItem({ icon, title, desc, color, bgColor, borderColor }: { icon: React.ReactNode, title: string, desc: string, color: string, bgColor: string, borderColor: string }) {
    return (
        <div className={`p-6 border ${borderColor} ${bgColor} rounded-md hover:bg-black/40 transition-all group`}>
            <div className={`flex items-center gap-3 mb-3 font-bold text-lg ${color}`}>
                <div className="p-2 rounded-full bg-black/50 border border-white/5 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span>{title}</span>
            </div>
            <p className="text-base text-slate-400 leading-relaxed font-sans">{desc}</p>
        </div>
    );
}
