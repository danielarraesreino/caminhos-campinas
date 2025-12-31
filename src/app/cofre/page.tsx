"use client";

import { ArrowLeft, CreditCard, FileText, Lock, ShieldCheck, Upload, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function VaultPage() {
    const [isUnlocked, setIsUnlocked] = useState(false);

    // --- Tela de Desbloqueio (Simulada) ---
    if (!isUnlocked) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />

                <div className="relative z-10 max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="bg-slate-900/50 p-6 rounded-full inline-block mb-4 border border-slate-800">
                        <Lock className="w-16 h-16 text-blue-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Seus Documentos,<br />Sua Identidade.
                    </h1>

                    <p className="text-slate-400 text-lg leading-relaxed">
                        Na rua, perder o RG é perder a cidadania. Guarde fotos seguras dos seus documentos aqui.
                        Se o papel molhar ou for roubado, o digital garante seu atendimento no Poupatempo.
                    </p>

                    <Button
                        onClick={() => setIsUnlocked(true)}
                        size="lg"
                        className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
                    >
                        <ShieldCheck className="mr-2 w-5 h-5" /> Criar Chave de Acesso Segura
                    </Button>

                    <p className="text-xs text-slate-600 max-w-xs mx-auto">
                        🔒 Seus dados ficam salvos APENAS no seu celular (Local Storage). Ninguém, nem nós, tem acesso.
                    </p>
                </div>
            </div>
        );
    }

    // --- Dashboard do Cofre ---
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <header className="border-b border-slate-800 p-4 sticky top-0 bg-slate-900/90 backdrop-blur z-50">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2 text-green-400 bg-green-950/30 px-3 py-1 rounded-full border border-green-900/50">
                        <Lock className="w-3 h-3" />
                        <span className="text-xs font-bold uppercase tracking-wider">Criptografado (K-5)</span>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <DocCard icon={<CreditCard className="text-blue-400" />} title="RG (Identidade)" desc="Essencial para BPC" count={0} />
                    <DocCard icon={<FileText className="text-green-400" />} title="CPF" desc="Auxílios do Governo" count={0} />
                    <DocCard icon={<Wallet className="text-amber-400" />} title="Carteira de Trabalho" desc="Vagas de Emprego" count={0} />
                    <DocCard icon={<ActivityIcon className="text-red-400" />} title="Receitas Médicas" desc="Retirada no Posto" count={0} />
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-center space-y-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="text-slate-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Adicionar Novo Documento</h3>
                        <p className="text-sm text-slate-400">Tire uma foto legível frente e verso.</p>
                    </div>
                    <Button variant="outline" className="w-full border-slate-600 hover:bg-slate-700 text-slate-300">
                        Selecionar Foto da Galeria
                    </Button>
                </div>
            </main>
        </div>
    );
}

function DocCard({ icon, title, desc, count }: any) {
    return (
        <Card className="bg-slate-800 border-slate-700 p-4 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
                <span className="text-xs font-mono text-slate-500">{count} ARQ</span>
            </div>
            <h3 className="font-bold text-sm text-slate-200 mb-1">{title}</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{desc}</p>
        </Card>
    )
}

function ActivityIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
