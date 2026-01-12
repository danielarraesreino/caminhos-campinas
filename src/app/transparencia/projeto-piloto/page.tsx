"use client";

import { ArrowLeft, BookOpen, CheckCircle2, DollarSign, Target, Users } from "lucide-react";
import Link from "next/link";

export default function ProjetoPilotoPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
            {/* Header */}
            <header className="p-6 border-b border-slate-900 sticky top-0 bg-slate-950/90 backdrop-blur-md z-50">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Link href="/apoie" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-400" />
                    </Link>
                    <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                        Projeto Piloto: <span className="text-green-500">Agilizadores Sociais</span>
                    </h1>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">

                {/* SECTION 1: CONCEITO */}
                <section className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase border border-purple-500/30">
                        <BookOpen size={14} /> Metodologia
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white">
                        O Conceito "High Price"
                    </h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Baseado nos estudos do neurocientista <strong>Dr. Carl Hart</strong>, a metodologia parte de uma premissa científica simples: o vício não é uma sentença biológica imutável, mas muitas vezes uma adaptação à falta de alternativas de recompensa ("refletores alternativos").
                    </p>
                    <div className="bg-slate-900 border-l-4 border-purple-500 p-6 rounded-r-xl">
                        <p className="italic text-slate-400">
                            "Quando você oferece alternativas concorrentes atraentes (emprego, dinheiro, propósito, conexão social), o uso de drogas cai drasticamente."
                        </p>
                        <span className="block mt-2 text-sm font-bold text-slate-500">— Dr. Carl Hart (High Price)</span>
                    </div>
                </section>

                {/* SECTION 2: MATEMÁTICA */}
                <section className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase border border-green-500/30">
                        <DollarSign size={14} /> A Matemática da Dignidade
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white">
                        Como funciona o Pagamento?
                    </h2>
                    <p className="text-slate-300">
                        Não é caridade. É um contrato de trabalho formativo de curto prazo (6 dias).
                        O aluno é tratado como um profissional em treinamento.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-[#0c0c0f] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Diária Condicionada</h3>
                                <p className="text-sm text-slate-400">
                                    Valor pago ao final de cada dia, condicionado 100% à presença e participação nas atividades.
                                </p>
                            </div>
                            <div className="mt-6 text-4xl font-black text-green-400">R$ 50,00 <span className="text-sm text-slate-500 font-normal">/ dia</span></div>
                        </div>

                        <div className="bg-[#0c0c0f] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Bônus de Formatura</h3>
                                <p className="text-sm text-slate-400">
                                    Prêmio extra pago na cerimônia de encerramento para quem completar o ciclo.
                                </p>
                            </div>
                            <div className="mt-6 text-4xl font-black text-yellow-400">R$ 100,00 <span className="text-sm text-slate-500 font-normal">/ único</span></div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: ORÇAMENTO */}
                <section className="space-y-8">
                    <div className="inline-flex items-center gap-2 bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase border border-blue-500/30">
                        <Target size={14} /> Transparência Total
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white">
                        Orçamento Aberto (20 Alunos)
                    </h2>

                    <div className="overflow-hidden bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-6 py-4">Item</th>
                                    <th className="px-6 py-4">Cálculo</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                                <tr className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">Bolsas (Diárias)</td>
                                    <td className="px-6 py-4">20 alunos x R$ 50 x 8 dias (estimado c/ margem)</td>
                                    <td className="px-6 py-4 text-right font-mono text-green-400">R$ 8.000,00</td>
                                </tr>
                                <tr className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">Bônus Formatura</td>
                                    <td className="px-6 py-4">20 alunos x R$ 100</td>
                                    <td className="px-6 py-4 text-right font-mono text-green-400">R$ 2.000,00</td>
                                </tr>
                                <tr className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">Alimentação</td>
                                    <td className="px-6 py-4">Café + Almoço + Lanche (6 dias)</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-400">R$ 3.600,00</td>
                                </tr>
                                <tr className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">Materiais Didáticos</td>
                                    <td className="px-6 py-4">Camisetas, Apostilas, Crachás</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-400">R$ 1.400,00</td>
                                </tr>
                                <tr className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">Festa de Encerramento</td>
                                    <td className="px-6 py-4">Bolo, Refrigerante, Decoração (CAPS)</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-400">R$ 970,00</td>
                                </tr>
                                <tr className="bg-slate-950/50 font-bold text-white text-base">
                                    <td className="px-6 py-4" colSpan={2}>TOTAL GERAL</td>
                                    <td className="px-6 py-4 text-right text-green-500">R$ 15.970,00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-slate-500 text-center italic">
                        * Valores estimados com base em cotações locais (Campinas/SP - Jan/2026).
                    </p>
                </section>

                <div className="pt-8">
                    <Link href="/apoie" className="block text-center">
                        <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-black uppercase tracking-wider hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
                            Apoiar este Projeto Agora
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
