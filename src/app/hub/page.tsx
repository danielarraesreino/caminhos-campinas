"use client";

import { ArrowLeft, ExternalLink, HandHeart, Heart, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PARTNERS = [
    {
        name: "Cáritas Arquidiocesana de Campinas",
        description: "Acolhimento de alta complexidade e gestão dos abrigos municipais (Casa São Francisco, Santa Dulce). Referência na defesa de direitos.",
        action: "Encaminhar para Acolhimento",
        tags: ["Abrigo", "Alimentação", "Banho"],
        color: "blue"
    },
    {
        name: "Toca de Assis (Filhas da Pobreza)",
        description: "Apoio espiritual, banho e alimentação para quem está em situação crítica de rua. Um olhar de misericórdia para as feridas da alma e do corpo.",
        action: "Solicitar Banho/Alimento",
        tags: ["Espiritualidade", "Higiene", "Comida"],
        color: "amber"
    },
    {
        name: "Instituto Padre Haroldo",
        description: "Referência nacional em tratamento de dependência química e reinserção social. Abordagem terapêutica humanizada.",
        action: "Buscar Reabilitação",
        tags: ["Saúde", "Reabilitação", "Trabalho"],
        color: "green"
    },
    {
        name: "Rotaract Club Campinas",
        description: "Jovens lideranças movendo ações de voluntariado e campanhas de arrecadação sazonais (Inverno/Natal/Páscoa).",
        action: "Ser Voluntário",
        tags: ["Voluntariado", "Doações", "Juventude"],
        color: "pink"
    },
    {
        name: "Mão Amiga (Grupo Sol)",
        description: "Qualificação profissional com bolsa-auxílio para reinserção no mercado de trabalho. A porta de saída da rua.",
        action: "Ver Cursos",
        tags: ["Trabalho", "Renda", "Cursos"],
        color: "purple"
    },
];

export default function HubPage() {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            Hub de Parceiros
                        </h1>
                        <p className="text-xs text-slate-500">Rede de Proteção Validada - Campinas/SP</p>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8 space-y-8 relative z-10">
                <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <HandHeart size={120} />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 relative z-10">Conecte-se a quem faz a diferença</h2>
                    <p className="text-blue-100 max-w-xl relative z-10 mb-6">
                        Estas organizações operam diariamente nas ruas de Campinas. Seja para buscar ajuda ou oferecer apoio, este é o caminho confiável.
                    </p>
                    <Button variant="secondary" className="font-bold gap-2">
                        <Heart className="w-4 h-4 text-red-500" /> Quero Apoiar a Rede
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {PARTNERS.map((partner) => (
                        <div key={partner.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {partner.name}
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {partner.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                {partner.description}
                            </p>

                            <Button className="w-full justify-between group-hover:bg-blue-600 transition-colors" variant="outline">
                                {partner.action}
                                <ExternalLink className="w-4 h-4 opacity-50" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="text-center pt-8 border-t">
                    <p className="text-slate-500 text-sm">
                        Você representa uma ONG ou coletivo? <Link href="/hub/cadastro" className="text-blue-600 font-bold hover:underline">Cadastre-se no Hub</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
