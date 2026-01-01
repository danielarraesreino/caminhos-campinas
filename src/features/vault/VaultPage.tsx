"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export function VaultPage() {
	const { data: session } = useSession();
	const [isGuestMode, setIsGuestMode] = useState(false);

	const handleGoogleLogin = () => {
		signIn("google", { callbackUrl: "/vault" });
	};

	const handleGuestAccess = () => {
		setIsGuestMode(true);
	};

	const showVault = session || isGuestMode;

	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
			<h2 className="text-2xl font-bold mb-4 text-slate-100">
				🔐 Cofre Digital
			</h2>
			<p className="text-slate-400 mb-8 max-w-sm">
				Guarde cópias seguras de seus documentos (RG, CPF, Carteira de
				Trabalho).
				{isGuestMode
					? " (Modo Visitante: Dados salvos apenas neste dispositivo)"
					: " (Modo Cloud: Dados salvos na nuvem)"}
			</p>

			{showVault ? (
				<div className="space-y-4">
					<div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
						<p className="text-sm text-green-400 mb-2">Conectado como:</p>
						{session ? (
							<>
								<p className="font-bold text-white">{session.user?.name}</p>
								<p className="text-xs text-slate-500">{session.user?.email}</p>
							</>
						) : (
							<p className="font-bold text-white">Visitante (Local)</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<button className="p-4 bg-blue-900/50 hover:bg-blue-800 border border-blue-700 rounded-lg flex flex-col items-center gap-2 transition-colors">
							<span className="text-2xl">📄</span>
							<span className="text-sm font-bold text-blue-200">Meus Docs</span>
						</button>
						<button className="p-4 bg-green-900/50 hover:bg-green-800 border border-green-700 rounded-lg flex flex-col items-center gap-2 transition-colors">
							<span className="text-2xl">📤</span>
							<span className="text-sm font-bold text-green-200">
								Novo Upload
							</span>
						</button>
					</div>

					<button
						onClick={() => {
							if (session) signOut();
							else setIsGuestMode(false);
						}}
						className="px-6 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm rounded-full transition-colors"
					>
						Sair do Cofre
					</button>
				</div>
			) : (
				<div className="space-y-4">
					<button
						onClick={handleGoogleLogin}
						className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
						title="Desabilitado temporariamente para ajustes de API"
						disabled
					>
						<img
							src="https://authjs.dev/img/providers/google.svg"
							alt="Google Logo"
							className="w-5 h-5"
						/>
						Entrar com Google (Em Breve)
					</button>

					<div className="relative flex items-center justify-center py-2">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-slate-700"></div>
						</div>
						<span className="relative px-3 bg-slate-950 text-xs font-bold text-slate-500 uppercase tracking-widest">
							Ou
						</span>
					</div>

					<button
						onClick={handleGuestAccess}
						className="w-full px-6 py-3 bg-slate-800 border-2 border-slate-700 text-slate-300 rounded-lg font-bold hover:bg-slate-700 hover:text-white transition-all"
					>
						Acessar como Visitante
					</button>
				</div>
			)}
		</div>
	);
}
