"use client";

import { useEffect, useState } from "react";
import { Shield, HeartHandshake, ArrowLeft, RefreshCw, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Partner {
    id: string;
    name: string;
    category: string;
    city: string;
    status: string;
    createdAt: string;
}

interface Story {
    id: string;
    content: string;
    source: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"partners" | "stories">("partners");

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetching from standard API routes
            const [pRes, sRes] = await Promise.all([
                fetch("/api/partners"),
                fetch("/api/stories") // POST only? I'll check/fix stories route to allow GET or create list
            ]);

            if (pRes.ok) {
                const pData = await pRes.json();
                setPartners(Array.isArray(pData.partners) ? pData.partners : []);
            }

            if (sRes.ok) {
                const sData = await sRes.json();
                setStories(Array.isArray(sData) ? sData : []);
            }
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <Link href="/auditoria" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Voltar para Auditoria
                        </Link>
                        <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <Shield className="text-blue-500" size={36} />
                            Painel de Controle
                        </h1>
                        <p className="text-slate-400">Visualização de dados brutos e submissões da comunidade.</p>
                    </div>

                    <Button onClick={fetchData} variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 gap-2">
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Atualizar Dados
                    </Button>
                </header>

                <div className="flex gap-4 border-b border-slate-800 pb-px">
                    <button
                        onClick={() => setActiveTab("partners")}
                        className={`pb-4 px-2 font-bold uppercase tracking-widest text-xs transition-all border-b-2 ${activeTab === "partners" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                    >
                        Parcerias ({partners.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("stories")}
                        className={`pb-4 px-2 font-bold uppercase tracking-widest text-xs transition-all border-b-2 ${activeTab === "stories" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                    >
                        Histórias ({stories.length})
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-40 bg-slate-900 rounded-2xl border border-slate-800" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTab === "partners" ? (
                            partners.length === 0 ? (
                                <EmptyState icon={<HeartHandshake size={48} />} title="Nenhum parceiro encontrado" />
                            ) : (
                                partners.map(p => (
                                    <div key={p.id} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 transition-all flex flex-col justify-between group">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                                                    {p.category}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-mono">
                                                    {new Date(p.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors uppercase tracking-tight">{p.name}</h3>
                                            <p className="text-slate-400 text-sm mt-1">{p.city}</p>
                                        </div>
                                        <div className="mt-6 flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500">{p.status || "PENDENTE"}</span>
                                            <Button variant="link" className="text-blue-500 p-0 h-auto text-xs">Ver Detalhes</Button>
                                        </div>
                                    </div>
                                ))
                            )
                        ) : (
                            stories.length === 0 ? (
                                <EmptyState icon={<MessageSquare size={48} />} title="Nenhuma história encontrada" />
                            ) : (
                                stories.map(s => (
                                    <div key={s.id} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-purple-500/50 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 px-2 py-1 rounded">
                                                {s.source}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-mono">
                                                {new Date(s.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-200 text-sm italic leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                                            "{s.content}"
                                        </p>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

function EmptyState({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-900 rounded-3xl">
            <div className="mb-4 opacity-20">{icon}</div>
            <p className="font-bold uppercase tracking-widest text-sm">{title}</p>
        </div>
    );
}
