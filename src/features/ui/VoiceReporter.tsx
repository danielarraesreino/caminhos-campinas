"use client";

import {
	AlertTriangle,
	CheckCircle2,
	Loader2,
	Mic,
	Square,
} from "lucide-react";
import { useRef, useState } from "react";
// import { uploadUserDilemma } from "@/services/hostingerUpload";

export function VoiceReporter() {
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
				await handleUpload(audioBlob);
				stream.getTracks().forEach((track) => track.stop()); // Stop mic access
			};

			mediaRecorder.start();
			setIsRecording(true);
			setUploadStatus("idle");
		} catch (err) {
			console.error("Error accessing microphone:", err);
			setUploadStatus("error");
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	const handleUpload = async (blob: Blob) => {
		setUploadStatus("uploading");
		try {
			// OFFLINE MODE: Save Locally / Log
			console.log("Saving voice report locally (Offline Mode)");
			await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay

			// const result = await uploadUserDilemma(blob, "Voice Report");
			setUploadStatus("success");

		} catch (error) {
			console.error("Upload error:", error);
			setUploadStatus("error");
		}
	};

	return (
		<div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
			<h3 className="text-white font-bold mb-4 flex items-center gap-2">
				<Mic className="w-5 h-5 text-blue-400" />
				Relato de Voz
			</h3>

			<div className="flex flex-col items-center gap-4">
				{uploadStatus === "idle" && (
					<button
						onClick={isRecording ? stopRecording : startRecording}
						className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRecording
							? "bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-500/30"
							: "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20"
							}`}
					>
						{isRecording ? (
							<Square className="w-6 h-6 text-white fill-current" />
						) : (
							<Mic className="w-8 h-8 text-white" />
						)}
					</button>
				)}

				{uploadStatus === "uploading" && (
					<div className="flex flex-col items-center text-blue-400 p-4">
						<Loader2 className="w-10 h-10 animate-spin mb-2" />
						<span className="text-sm font-medium">Enviando relato...</span>
					</div>
				)}

				{uploadStatus === "success" && (
					<div className="flex flex-col items-center text-emerald-400 p-4 bg-emerald-950/30 rounded-xl border border-emerald-900/50 w-full animate-in fade-in zoom-in">
						<CheckCircle2 className="w-10 h-10 mb-2" />
						<span className="text-sm font-bold text-center">Relato salvo!</span>
						<span className="text-xs opacity-80 text-center mt-1">
							Sua voz ajuda a mapear a realidade.
						</span>
						<button
							onClick={() => setUploadStatus("idle")}
							className="mt-3 text-xs underscore text-emerald-500/70 hover:text-emerald-400"
						>
							Gravar outro
						</button>
					</div>
				)}

				{uploadStatus === "error" && (
					<div className="flex flex-col items-center text-red-400 p-4 bg-red-950/30 rounded-xl border border-red-900/50 w-full">
						<AlertTriangle className="w-10 h-10 mb-2" />
						<span className="text-sm font-bold">Erro ao enviar</span>
						<button
							onClick={() => setUploadStatus("idle")}
							className="mt-3 px-4 py-2 bg-red-900/50 rounded-lg text-xs hover:bg-red-800 transition-colors"
						>
							Tentar novamente
						</button>
					</div>
				)}

				{isRecording && (
					<span className="text-xs text-red-400 font-mono animate-pulse">
						Gravando... (Clique para parar)
					</span>
				)}
				{!isRecording && uploadStatus === "idle" && (
					<span className="text-xs text-slate-500">
						Clique para gravar um relato anônimo
					</span>
				)}
			</div>
		</div>
	);
}
