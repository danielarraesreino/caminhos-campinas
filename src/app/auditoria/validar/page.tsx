"use client";

import { Check, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
// import { DILEMMAS_CAMPINAS } from "@/data/dilemmas-campinas"; // Import real data if possible, or fetch
// import { EcoButton } from "@/components/ui/EcoButton";

// Mocking data fetch for simplicity in this prototype phase
const MOCK_DILEMMA = {
    id: "dilema_samim_01",
    title: "O Dilema do SAMIM",
    description: "São 17h30. Você está na região do Mercado Municipal. Um comerciante oferece R$ 20,00 para você descarregar um caminhão. O SAMIM fecha às 19h00 (tolerância zero). O trajeto a pé leva 40 minutos. Se você aceitar o trabalho, corre risco de perder o pernoite.",
    consequence: "Perda da vaga no abrigo; Exposição ao frio/risco noturno; Ganho financeiro imediato mas exclusão do sistema de acolhimento."
};

export default function ValidacaoAuditPage() {
    const [dilemma, setDilemma] = useState<any>(MOCK_DILEMMA);
    const [feedback, setFeedback] = useState<"pass" | "fail" | null>(null);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to save validation (e.g. to DB Post)
        setSubmitted(true);
    };

    const nextDilemma = () => {
        setSubmitted(false);
        setFeedback(null);
        setComment("");
        // Logic to fetch next random dilemma
        // setDilemma(getRandomDilemma());
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                    <Check size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Validação Registrada</h2>
                <p className="text-slate-400 mb-8">Base de dados atualizada. Obrigado pelo rigor técnico.</p>
                <button onClick={nextDilemma} className="px-6 py-3 bg-slate-800 rounded-xl hover:bg-slate-700">Auditar Próximo Cenário</button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-20">
            <header className="bg-slate-900 text-white p-6 shadow-lg">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold uppercase tracking-wider">Auditoria Técnica</h1>
                        <p className="text-xs text-slate-400">Ambiente de Validação Profissional (CRP/CRESS)</p>
                    </div>
                    <div className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                        BETA
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">

                {/* ESQUERDA: O CENÁRIO */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Cenário sob Auditoria</h3>
                        <h2 className="text-2xl font-black text-slate-800 mb-4">{dilemma.title}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            "{dilemma.description}"
                        </p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Consequência Prevista</h4>
                            <p className="text-sm text-slate-700">{dilemma.consequence}</p>
                        </div>
                    </div>
                </div>

                {/* DIREITA: O FORMULÁRIO */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 h-fit">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h3 className="font-bold text-slate-900 border-b pb-2">Parecer Técnico</h3>

                        <div className="space-y-3">
                            <p className="text-sm font-medium text-slate-700">Este cenário reflete a realidade das ruas de Campinas?</p>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setFeedback("pass")} className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${feedback === 'pass' ? 'bg-green-600 text-white border-green-600 ring-2 ring-green-200' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                    <ThumbsUp size={18} /> Sim, realista
                                </button>
                                <button type="button" onClick={() => setFeedback("fail")} className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${feedback === 'fail' ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-200' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                    <ThumbsDown size={18} /> Não / Incorreto
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Comentário Técnico (Obrigatório)</label>
                            <textarea
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                                rows={4}
                                placeholder="Ex: O horário de fechamento do SAMIM mudou para 19h30 no inverno..."
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <button type="button" className="w-full mb-3 py-3 bg-slate-100 text-slate-500 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                                Pular Cenário
                            </button>
                            <button type="submit" disabled={!feedback || !comment} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                Registrar Validação
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
