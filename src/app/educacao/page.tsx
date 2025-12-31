"use client";

import { ArrowLeft, BookOpen, GraduationCap, ShieldAlert, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EducationPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-blue-900 text-white pb-20 pt-8 px-6 rounded-b-[40px] shadow-2xl relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16" />

                <header className="flex items-center gap-4 mb-8 relative z-10">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="text-blue-100 hover:bg-blue-800 hover:text-white rounded-full">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">Formação & Autonomia</h1>
                </header>

                <div className="space-y-2 relative z-10">
                    <Badge className="bg-blue-500/30 text-blue-100 hover:bg-blue-500/30 border-blue-400/20">Módulo Piloto 2024</Badge>
                    <h2 className="text-3xl font-black leading-tight">De Sobrevivente<br />a Educador.</h2>
                    <p className="text-blue-200 mt-2 max-w-sm">
                        Conhecimento é a única coisa que não podem tirar de você. Aprenda seus direitos e proteja sua comunidade.
                    </p>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-6 -mt-10 space-y-6 pb-10">
                <ModuleCard
                    icon={<ShieldAlert className="w-8 h-8 text-amber-600" />}
                    title="Direitos Humanos e Abordagem"
                    desc="Como se portar numa abordagem policial (O que é legal/ilegal). O direito de ir e vir e a posse de pertences."
                    status="Disponível"
                    color="amber"
                />

                <ModuleCard
                    icon={<BookOpen className="w-8 h-8 text-emerald-600" />}
                    title="Redução de Danos"
                    desc="Uso seguro de substâncias, prevenção de ISTs e como acessar o Consultório na Rua sem medo de internação."
                    status="Disponível"
                    color="emerald"
                />

                <ModuleCard
                    icon={<Wallet className="w-8 h-8 text-purple-600" />}
                    title="Acesso à Renda"
                    desc="Como acessar o Bolsa Família e BPC mesmo sem endereço fixo (Declaração de Pessoas em Situação de Rua)."
                    status="Em Breve"
                    color="purple"
                    disabled
                />

                <div className="pt-8 text-center">
                    <Button variant="outline" className="gap-2">
                        <GraduationCap className="w-4 h-4" /> Ver Certificados Disponíveis
                    </Button>
                </div>
            </main>
        </div>
    );
}

function ModuleCard({ icon, title, desc, status, color, disabled }: any) {
    const bgColors: Record<string, string> = {
        amber: "bg-amber-50 group-hover:bg-amber-100 border-amber-100",
        emerald: "bg-emerald-50 group-hover:bg-emerald-100 border-emerald-100",
        purple: "bg-purple-50 group-hover:bg-purple-100 border-purple-100",
    };

    const textColors: Record<string, string> = {
        amber: "text-amber-900",
        emerald: "text-emerald-900",
        purple: "text-purple-900",
    };

    return (
        <Card className={`p-6 border-2 transition-all group cursor-pointer ${disabled ? "opacity-60 grayscale cursor-not-allowed" : "hover:scale-[1.02] shadow-lg hover:shadow-xl"} ${bgColors[color]}`}>
            <div className="flex items-start gap-4">
                <div className={`p-3 bg-white rounded-2xl shadow-sm ${disabled ? "" : "group-hover:rotate-6 transition-transform"}`}>
                    {icon}
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className={`font-black text-lg ${textColors[color]}`}>{title}</h3>
                        <Badge variant={disabled ? "outline" : "default"} className={disabled ? "" : "bg-blue-600"}>{status}</Badge>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
                </div>
            </div>
        </Card>
    )
}
