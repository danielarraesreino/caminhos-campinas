"use client";

import { ArrowLeft, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AudioReader } from "@/components/ui/AudioReader";
import posts from "@/data/journal-posts.json";

export default function JornalPage() {
	return (
		<div className="min-h-screen bg-black text-slate-100 font-sans relative overflow-hidden">
			{/* Background Image - Realismo Sóbrio */}
			<div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
				<Image
					src="/images/sobrio/jornal.png"
					alt="Fundo Jornal da Rua - Realismo Sóbrio"
					fill
					priority
					className="object-cover"
					quality={85}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/90 to-black" />
			</div>
			<div className="max-w-4xl mx-auto space-y-8 p-6 pt-24 relative z-10">
				<header
					className="flex items-center gap-4 border-b border-slate-800 pb-6"
					aria-label="Cabeçalho do Jornal"
				>
					<Link
						href="/"
						className="p-2 hover:bg-slate-900 rounded-full transition-colors group"
						aria-label="Voltar para a página inicial"
					>
						<ArrowLeft className="w-6 h-6 text-slate-300 group-hover:text-white" />
					</Link>
					<div>
						<h1 className="text-3xl font-black uppercase tracking-tighter text-white">
							Jornal da Rua
						</h1>
						<p className="text-slate-300">
							Notícias, denúncias e a voz de quem vive a cidade.
						</p>
					</div>
				</header>

				<main className="grid gap-6" aria-label="Lista de matérias">
					{posts.map((post) => (
						<article
							key={post.id}
							className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all p-6 shadow-lg backdrop-blur-sm"
						>
							<header className="mb-4">
								<div className="flex justify-between items-start mb-2">
									<div className="flex gap-2 items-center">
										<span className="text-xs font-bold text-blue-300 uppercase tracking-widest bg-blue-900/30 px-2 py-1 rounded">
											{post.category}
										</span>
										<AudioReader
											text={`${post?.title || ""}. ${post?.content || ""}`}
										/>
									</div>
									<time
										className="text-xs text-slate-300 font-mono"
										dateTime={post.date}
									>
										{post.date}
									</time>
								</div>
								<h2 className="text-2xl font-bold text-white mb-2">
									{post.title}
								</h2>
							</header>
							<section>
								<p className="text-slate-200 leading-relaxed font-medium">
									{post.content}
								</p>
								<footer className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
									<div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-500/30">
										<User className="w-4 h-4 text-blue-300" />
									</div>
									<span className="text-xs text-slate-300 font-medium">
										Por <span className="text-slate-100">{post.author}</span>
									</span>
								</footer>
							</section>
						</article>
					))}
				</main>
			</div>
		</div>
	);
}
