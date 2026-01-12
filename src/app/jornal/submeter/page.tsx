"use client";

import { ArrowLeft, Mic, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SubmeterJornalPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        // Simulating API call for now (or connect to our new API if ready)
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1500);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <Send className="text-white w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Relato Enviado!</h2>
                <p className="text-slate-400 max-w-sm mb-8">Nossa equipe vai analisar sua denúncia/poesia. Se aprovada, ela aparecerá no Jornal da Rua.</p>
                <Link href="/jornal" className="text-blue-400 hover:underline">Voltar para o Jornal</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
            <header className="p-6 border-b border-slate-900 sticky top-0 bg-slate-950/90 backdrop-blur-md z-50">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <Link href="/jornal" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-400" />
                    </Link>
                    <h1 className="text-xl font-bold">Submeter Relato</h1>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8">
                    <h2 className="text-lg font-bold text-white mb-2">A Rua tem Voz</h2>
                    <p className="text-sm text-slate-400">
                        Este espaço é seu. Conte o que a mídia oficial não mostra.
                        Pode ser uma denúncia anônima, um poema sobre o frio ou uma história de superação.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Título (Opcional)</label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ex: O frio da Aquidaban..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Categoria</label>
                        <select className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors">
                            <option value="DENUNCIA">Denúncia</option>
                            <option value="RELATO">Relato Pessoal</option>
                            <option value="POESIA">Poesia / Arte</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Seu Texto</label>
                        <textarea required rows={8} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Escreva aqui..."></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" className="px-4 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-colors flex items-center gap-2">
                            <Mic size={18} /> Gravar Áudio (Breve)
                        </button>
                        <button disabled={loading} type="submit" className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? "Enviando..." : "Enviar Relato"} <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
