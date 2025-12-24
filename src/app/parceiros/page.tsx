"use client";

import { ArrowLeft, Building2, TrendingUp, ShieldCheck, Globe, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ParceirosPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors font-medium"
                    >
                        <ArrowLeft size={20} />
                        <span>Voltar</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-xl tracking-tight text-slate-900">Caminhos Campinas</span>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">Corporate</span>
                    </div>
                    <a href="mailto:contato@caminhoscampinas.org" className="text-sm font-semibold text-blue-600 hover:underline">
                        Fale com a Diretoria
                    </a>
                </div>
            </header>

            <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-sm font-medium">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span>Conformidade ESG & Compliance</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                            Transforme responsabilidade social em <span className="text-blue-600">dados auditáveis.</span>
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                            Sua empresa precisa reportar contribuições para os ODS (Objetivos de Desenvolvimento Sustentável)?
                            Nós geramos métricas reais de impacto para os ODS 1, 2 e 11.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button type="button" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                                Quero ser Parceiro
                            </button>
                            <button type="button" className="bg-white text-slate-700 border border-slate-300 px-8 py-4 rounded-lg font-bold hover:bg-slate-50 transition-all active:scale-95">
                                Baixar Mídia Kit
                            </button>
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <TrendingUp className="text-blue-600 mb-3" size={32} />
                                <div className="text-4xl font-bold text-slate-900 mb-1">ODS 1</div>
                                <div className="text-sm text-slate-500 font-medium">Erradicação da Pobreza</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <Globe className="text-emerald-500 mb-3" size={32} />
                                <div className="text-4xl font-bold text-slate-900 mb-1">ODS 11</div>
                                <div className="text-sm text-slate-500 font-medium">Cidades Sustentáveis</div>
                            </div>
                            <div className="col-span-2 bg-slate-900 text-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm font-medium text-slate-400">ROI Social Estimado</div>
                                    <span className="text-emerald-400 font-bold">+400%</span>
                                </div>
                                <div className="text-2xl font-bold">R$ 45.000 / mês</div>
                                <div className="text-xs text-slate-500 mt-1">Economia gerada para o setor público</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Value Proposition */}
                <section className="mb-24">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Por que investir no Caminhos Campinas?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Relatórios de Inteligência",
                                desc: "Acesso a dashboards exclusivos com mapa de calor de demandas sociais e gargalos de serviço público."
                            },
                            {
                                title: "Brand Safety & Purpose",
                                desc: "Associe sua marca a uma solução tecnológica premiada, não apenas a assistencialismo pontual."
                            },
                            {
                                title: "Dedução Fiscal",
                                desc: "Projetos enquadrados nas leis de incentivo à cultura e inovação social."
                            }
                        ].map((feature, i) => (
                            <div key={feature.title} className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6 font-bold text-xl group-hover:scale-110 transition-transform">
                                    {i + 1}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sponsorship Tiers */}
                <section className="bg-slate-900 rounded-[2.5rem] p-12 lg:p-20 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-6">Adote uma Tecnologia</h2>
                        <p className="text-lg text-slate-300 mb-12">
                            Escolha qual funcionalidade sua empresa quer apadrinhar e receba o selo <strong className="text-white">Empresa Amiga da Rua</strong>.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/15 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold">Cota Server</h3>
                                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">R$ 200/mês</span>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-center gap-2 text-slate-300">
                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                        <span>Logo no Rodapé do App</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-300">
                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                        <span>Relatório Mensal Simplificado</span>
                                    </li>
                                </ul>
                                <button type="button" className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors">
                                    Selecionar
                                </button>
                            </div>

                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 border border-white/20 p-8 rounded-2xl transform md:-translate-y-4 shadow-2xl shadow-blue-900/50">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold">Cota Mantenedor</h3>
                                    <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded">Sob Consulta</span>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-center gap-2 text-white">
                                        <CheckCircle2 size={16} className="text-emerald-300" />
                                        <span>Selo "Empresa Amiga da Rua"</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-white">
                                        <CheckCircle2 size={16} className="text-emerald-300" />
                                        <span>Acesso total ao Data Lake</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-white">
                                        <CheckCircle2 size={16} className="text-emerald-300" />
                                        <span>Workshop de Impacto Social</span>
                                    </li>
                                </ul>
                                <button type="button" className="w-full bg-emerald-400 text-slate-900 font-bold py-3 rounded-lg hover:bg-emerald-300 transition-colors">
                                    Falar com Consultor
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
