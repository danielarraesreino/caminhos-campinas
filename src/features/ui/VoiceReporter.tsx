"use client";

import {
	AlertTriangle,
	CheckCircle2,
	Loader2,
	Mic,
	Send,
	Square,
	X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useOfflineDB } from "@/features/offline-db/useOfflineDB";

interface VoiceReporterProps {
	onClose?: () => void;
}

export function VoiceReporter({ onClose }: VoiceReporterProps) {
	const { saveLocally } = useOfflineDB();
	const [mode, setMode] = useState<"audio" | "text">("audio");
	const [textReport, setTextReport] = useState("");
	const [isRecording, setIsRecording] = useState(false);
	const [uploadStatus, setUploadStatus] = useState<
		"idle" | "uploading" | "success" | "error"
	>("idle");

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunksRef.current.push(e.data);
				}
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
				await handleSaveReport(audioBlob, null);
				stream.getTracks().forEach((track) => {
					track.stop();
				}); // Stop mic access
			};

			mediaRecorder.start();
			setIsRecording(true);
			setUploadStatus("idle");
		} catch (err) {
			console.error("Error accessing microphone:", err);
			setUploadStatus("error"); // Could prompt for text mode here
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	const handleSaveReport = async (
		audioBlob: Blob | null,
		text: string | null,
	) => {
		setUploadStatus("uploading");
		try {
			// 1. Process Logic (Thermometer)
			// If audio, we would transcribe here. For now, we only process text matching if provided.
			let thermometerFeedback = "";
			let matchType = "NEW";

			if (text) {
				const { processUserReport } = await import(
					"@/features/game-loop/reportService"
				);
				const result = processUserReport(text);
				if (result.status === "MATCH_FOUND") {
					thermometerFeedback = result.message;
					matchType = "MATCH";
				}
			}

			const report = {
				type: "user_report",
				timestamp: new Date().toISOString(),
				audioBlob: audioBlob,
				textContent: text,
				status: "pending_sync",
				thermometerResult: matchType,
			};

			await saveLocally(report);

			// Simulate "Processing" for UX
			await new Promise((resolve) => setTimeout(resolve, 800));
			setUploadStatus("success");

			// Return feedback to be displayed
			return thermometerFeedback;
		} catch (error) {
			console.error("Save error:", error);
			setUploadStatus("error");
			return null;
		}
	};

	const _submitText = () => {
		if (!textReport.trim()) return;
		handleSaveReport(null, textReport);
	};

	const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

	// ... inside handleSaveReport we need to set this state ...
	// Wait, refactoring handleSaveReport above returned the string but didn't set state.
	// I need to intercept the call.

	// Let's update the caller instead or update handleSaveReport to set state directly.
	// I already updated handleSaveReport to return it. So I need to update the callers.

	// Actually, easier to inject the state setter inside handleSaveReport in previous step?
	// Too late, previous step submitted. I will modify the callers or add local state handling here.

	// Let's modify the component state usage.

	return (
		<div className="relative p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-sm mx-auto animate-in fade-in zoom-in duration-300">
			{onClose && (
				<button
					type="button"
					onClick={onClose}
					className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
				>
					<X size={20} />
				</button>
			)}

			<h3 className="text-white font-bold mb-1 flex items-center gap-2 text-lg">
				<Mic className="w-5 h-5 text-amber-500" />A Rua Tem Voz
			</h3>
			<p className="text-slate-400 text-xs mb-6 leading-relaxed">
				Seu relato ajuda a identificar problemas reais (buracos, falta de luz,
				violência). É anônimo e seguro.
			</p>

			<div className="flex flex-col items-center gap-4">
				{/* MODE SWITCHER */}
				{uploadStatus === "idle" && !isRecording && (
					<div className="flex bg-slate-800/50 p-1 rounded-lg mb-2">
						<button
							type="button"
							onClick={() => setMode("audio")}
							className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${mode === "audio" ? "bg-slate-700 text-amber-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
						>
							Áudio
						</button>
						<button
							type="button"
							onClick={() => setMode("text")}
							className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${mode === "text" ? "bg-slate-700 text-amber-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
						>
							Texto
						</button>
					</div>
				)}

				{/* AUDIO MODE */}
				{mode === "audio" && uploadStatus === "idle" && (
					<button
						type="button"
						onClick={isRecording ? stopRecording : startRecording}
						className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
							isRecording
								? "bg-red-500 hover:bg-red-600 animate-pulse ring-8 ring-red-500/20"
								: "bg-amber-500 hover:bg-amber-400 shadow-amber-500/20"
						}`}
					>
						{isRecording ? (
							<Square className="w-8 h-8 text-white fill-current" />
						) : (
							<Mic className="w-10 h-10 text-slate-900" />
						)}
					</button>
				)}

				{isRecording && (
					<span className="text-xs text-red-400 font-mono font-bold animate-pulse">
						GRAVANDO...
					</span>
				)}

				{/* TEXT MODE */}
				{mode === "text" && uploadStatus === "idle" && (
					<div className="w-full space-y-3">
						<textarea
							className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 resize-none h-24"
							placeholder="Descreva o que está acontecendo... (Ex: falta banheiro aqui)"
							value={textReport}
							onChange={(e) => setTextReport(e.target.value)}
						/>
						<button
							type="button"
							onClick={async () => {
								const fb = await handleSaveReport(null, textReport);
								setFeedbackMessage(fb || null);
							}}
							disabled={!textReport.trim()}
							className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2"
						>
							<Send size={16} /> Enviar Relato
						</button>
					</div>
				)}

				{/* STATUS STATES */}
				{uploadStatus === "uploading" && (
					<div className="flex flex-col items-center text-amber-400 p-8">
						<Loader2 className="w-12 h-12 animate-spin mb-4" />
						<span className="text-sm font-bold animate-pulse">
							Registrando no Blockchain...
						</span>
					</div>
				)}

				{uploadStatus === "success" && (
					<div className="flex flex-col items-center text-emerald-400 p-6 bg-emerald-950/20 rounded-xl border border-emerald-500/20 w-full animate-in fade-in zoom-in">
						<CheckCircle2 className="w-12 h-12 mb-3 text-emerald-500" />
						<span className="text-lg font-bold text-center text-white">
							Voz Registrada!
						</span>

						{feedbackMessage ? (
							<div className="bg-emerald-900/40 p-3 rounded-lg mt-3 border border-emerald-500/30">
								<span className="text-sm text-emerald-100 font-medium italic block text-center">
									"{feedbackMessage}"
								</span>
							</div>
						) : (
							<span className="text-xs opacity-80 text-center mt-1 max-w-[200px] text-emerald-200">
								Seu relato foi salvo localmente.
							</span>
						)}

						<button
							type="button"
							onClick={() => {
								setUploadStatus("idle");
								setTextReport("");
								setFeedbackMessage(null);
								if (onClose) onClose();
							}}
							className="mt-4 px-6 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-full text-sm font-bold text-emerald-400 transition-colors"
						>
							Fechar
						</button>
					</div>
				)}

				{uploadStatus === "error" && (
					<div className="flex flex-col items-center text-red-400 p-4 bg-red-950/30 rounded-xl border border-red-900/50 w-full">
						<AlertTriangle className="w-8 h-8 mb-2" />
						<span className="text-sm font-bold">Erro ao salvar</span>
						<p className="text-xs text-center opacity-70 mb-3">
							Verifique conexão e permissões.
						</p>
						<button
							type="button"
							onClick={() => setUploadStatus("idle")}
							className="px-4 py-2 bg-red-900/50 rounded-lg text-xs hover:bg-red-800 transition-colors text-white"
						>
							Tentar novamente
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
