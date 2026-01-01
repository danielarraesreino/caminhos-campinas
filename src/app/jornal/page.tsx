"use client";

import posts from "@/data/journal-posts.json";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

export default function JornalPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            <div className="max-w-4xl mx-auto space-y-8 p-6 pt-24">
                <header className="flex items-center gap-4 border-b border-slate-800 pb-6">
                    <Link href="/" className="p-2 hover:bg-slate-900 rounded-full transition-colors group">
                        <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                            Jornal da Rua
                        </h1>
                        <p className="text-slate-400">Notícias, denúncias e a voz de quem vive a cidade.</p>
                    </div>
                </header>

                <div className="grid gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all p-6 shadow-lg">
                            <div className="mb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-900/20 px-2 py-1 rounded">
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-slate-500 font-mono">{post.date}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">{post.title}</h2>
                            </div>
                            <div>
                                <p className="text-slate-300 leading-relaxed">{post.content}</p>
                                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-500/30">
                                        <User className="w-4 h-4 text-blue-300" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">Por <span className="text-slate-200">{post.author}</span></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
