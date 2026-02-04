"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		setLoading(true);
		await signIn("google", { callbackUrl: "/cofre" });
	};

	return (
		<div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
				<Image
					src="/images/sobrio/cofre.png"
					alt="Fundo Cofre - Realismo Sóbrio"
					fill
					priority
					className="object-cover"
					quality={85}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/90 to-black" />
			</div>

			<div className="relative z-10 max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500 text-center">
				{/* Header Icon */}
				<div className="bg-slate-900/50 p-6 rounded-full inline-block mb-4 border border-slate-800 shadow-xl">
					<ShieldCheck className="w-16 h-16 text-blue-500" />
				</div>

				<div>
					<h1 className="text-3xl font-black text-white tracking-tight mb-2">
						Acesso ao Cofre & Curadoria
					</h1>
					<p className="text-slate-400 text-lg leading-relaxed">
						Proteja seus documentos no Cofre Digital ou colabore validando a realidade do jogo.
					</p>
				</div>

				<div className="pt-4 space-y-4">
					<Button
						onClick={handleLogin}
						disabled={loading}
						size="lg"
						className="w-full h-14 text-lg font-bold bg-white text-slate-900 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-3"
					>
						{loading ? (
							<span className="animate-pulse">Conectando...</span>
						) : (
							<>
								<svg className="w-5 h-5" viewBox="0 0 24 24">
									<title>Google Logo</title>
									<path
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										fill="#4285F4"
									/>
									<path
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										fill="#34A853"
									/>
									<path
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										fill="#FBBC05"
									/>
									<path
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										fill="#EA4335"
									/>
								</svg>
								Entrar com Google
							</>
						)}
					</Button>

					<div className="relative my-4">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-slate-800" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-slate-950 px-2 text-slate-500">
								Ou (Modo Desenvolvimento)
							</span>
						</div>
					</div>

					<Button
						onClick={() => signIn("credentials", { callbackUrl: "/cofre" })}
						disabled={loading}
						variant="outline"
						className="w-full h-12 mb-4 text-slate-300 border-slate-700 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
					>
						Entrar como Visitante
					</Button>

					<Link href="/jogar" className="block">
						<Button
							variant="ghost"
							className="w-full text-slate-500 hover:text-white"
						>
							<ArrowLeft className="mr-2 w-4 h-4" /> Voltar ao Jogo
						</Button>
					</Link>
				</div>

				<p className="text-xs text-slate-600 max-w-xs mx-auto pt-8">
					🔒 Seus dados são criptografados. Nós não temos acesso aos seus
					arquivos.
				</p>
			</div>
		</div>
	);
}
