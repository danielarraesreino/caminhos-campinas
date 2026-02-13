"use client";

import { toPng } from "html-to-image";
import { Receipt, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareableDossierProps {
	stats: {
		violations: number;
		barriers: number;
		workStatus: string;
		daysSurvived: number;
	};
	history: Array<{
		id: string;
		tags: string[];
		type: string;
		description: string;
	}>;
	avatarName?: string;
	deathReason?: string;
}

export function ShareableDossier({
	stats,
	history,
	avatarName,
	deathReason,
}: ShareableDossierProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const [isSharing, setIsSharing] = useState(false);

	const generateAndShare = async () => {
		if (!cardRef.current) return;
		setIsSharing(true);

		try {
			// Generate Image
			// [HARDENING] Wait for fonts to load to prevent layout shifts/missing text
			await document.fonts.ready;

			const dataUrl = await toPng(cardRef.current, {
				cacheBust: true,
				pixelRatio: 2,
				backgroundColor: "#020617", // slate-950
			});
			const blob = await (await fetch(dataUrl)).blob();
			const file = new File([blob], "dossie-cidadania-campinas.png", {
				type: blob.type,
			});

			// Native Share
			if (navigator.canShare?.({ files: [file] })) {
				await navigator.share({
					title: "Auditoria de Cidadania - Caminhos Campinas",
					text: `Tentei sobreviver em Campinas como ${avatarName || "Cidadão"}. ${deathReason || ""}. Enfrentei ${stats.violations} violações de direitos em caminhos-campinas.vercel.app`,
					files: [file],
				});
			} else {
				// Fallback: Download
				const link = document.createElement("a");
				link.download = "dossie-cidadania.png";
				link.href = dataUrl;
				link.click();
			}
		} catch (err) {
			console.error("Failed to share:", err);
			alert("Erro ao compartilhar. Tente tirar um print!");
		} finally {
			setIsSharing(false);
		}
	};

	return (
		<div className="flex flex-col items-center gap-6 mt-8">
			{/* The "Hidden" but Rendered Card (Visible for user to see what they share) */}
			<div
				ref={cardRef}
				className="w-[350px] bg-slate-950 border-2 border-slate-800 p-6 rounded-none relative overflow-hidden font-mono text-slate-300 shadow-2xl"
				style={{ fontFamily: "'Courier Prime', monospace" }}
			>
				{/* Decorative Receipt Cutout Effect */}
				<div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBhdGggZD0iTTAgMTAgTDUgMCBMMTAgMTAgWiIgZmlsbD0iIzFZTJmZjMzIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-50"></div>

				<div className="text-center border-b-2 border-dashed border-slate-700 pb-4 mb-4">
					<Receipt className="mx-auto text-slate-500 mb-2" size={32} />
					<h2 className="text-xl font-bold uppercase tracking-widest text-white">
						AUDITORIA DE CIDADANIA
					</h2>
					<p className="text-[10px] text-slate-500 uppercase">
						CAMPINAS/SP • 2025 • PROJETO TRANS-SABERES
					</p>
				</div>

				<div className="space-y-4 text-xs">
					{avatarName && (
						<div className="flex justify-between border-b border-slate-800 pb-2 mb-2">
							<span className="uppercase text-slate-500 text-[10px]">
								Cidadão(ã):
							</span>
							<span className="text-white font-bold">{avatarName}</span>
						</div>
					)}

					{deathReason && (
						<div className="bg-red-950/30 border border-red-900/50 p-2 rounded text-red-200 mb-4 text-center">
							<span className="block text-[9px] uppercase opacity-70 mb-1">
								Causa do Óbito / Falha:
							</span>
							<span className="font-bold text-sm">{deathReason}</span>
						</div>
					)}

					<div className="flex justify-between">
						<span className="uppercase text-slate-500 text-[10px]">
							Sobrevivência:
						</span>
						<span className="text-white font-bold">
							{stats.daysSurvived} {stats.daysSurvived === 1 ? "DIA" : "DIAS"}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="uppercase text-slate-500 text-[10px]">
							Status Trabalho:
						</span>
						<span
							className={
								stats.workStatus === "FORMAL"
									? "text-green-400 font-bold"
									: "text-orange-400 font-bold"
							}
						>
							{stats.workStatus}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="uppercase text-slate-500 text-[10px]">
							Violações Estatais:
						</span>
						<span className="text-red-500 font-bold">
							{stats.violations} REGISTROS
						</span>
					</div>
				</div>

				<div className="my-6 border-y-2 border-dashed border-slate-700 py-4">
					<h3 className="text-center text-xs uppercase font-bold text-slate-400 mb-3">
						-- BARREIRAS ENFRENTADAS (ODS) --
					</h3>
					<div className="space-y-2">
						{history.slice(0, 4).map((event) => (
							<div key={event.id} className="flex gap-2 items-start">
								<span className="text-red-500 font-bold text-sm">[X]</span>
								<div>
									<div className="flex gap-1 flex-wrap mb-1">
										{event.tags.slice(0, 2).map((tag) => (
											<span
												key={tag}
												className="text-[9px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-bold"
											>
												{tag.replace("ODS_", "SDG ")}
											</span>
										))}
									</div>
									<p className="text-[11px] leading-tight opacity-90 text-slate-200">
										{event.description.length > 60
											? `${event.description.substring(0, 60)}...`
											: event.description}
									</p>
								</div>
							</div>
						))}
						{history.length === 0 && (
							<p className="text-center text-[10px] italic opacity-50">
								Nenhuma barreira crítica registrada.
							</p>
						)}
						{history.length > 4 && (
							<p className="text-center text-[10px] pt-1">
								... e mais {history.length - 4} violações.
							</p>
						)}
					</div>
				</div>

				<div className="text-center pt-2">
					<p className="text-[10px] text-slate-400 uppercase mb-1">
						Tente sobreviver à burocracia em:
					</p>
					<p className="text-[14px] font-bold text-white mb-1 tracking-wider">
						caminhos-campinas.vercel.app
					</p>
				</div>

				{/* Scanline Overlay */}
				<div className="absolute inset-0 bg-[url('/scanline.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
			</div>

			<Button
				onClick={generateAndShare}
				disabled={isSharing}
				className="w-full max-w-[350px] bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 text-sm uppercase tracking-widest gap-2"
			>
				{isSharing ? (
					"GERANDO DOSSIÊ..."
				) : (
					<>
						<Share2 size={18} /> COMPARTILHAR DENÚNCIA
					</>
				)}
			</Button>

			<p className="text-[10px] text-slate-500 text-center max-w-[300px]">
				Ao compartilhar, você ajuda a dar visibilidade à "Cidadania Mutilada" e
				pressiona por políticas públicas baseadas em evidências.
			</p>
		</div>
	);
}
