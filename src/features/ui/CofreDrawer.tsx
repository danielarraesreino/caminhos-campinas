"use client";

import {
	Camera,
	CheckCircle,
	FileText,
	Lock,
	Shield,
	Upload,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { useGameContext } from "@/contexts/GameContext";

interface CofreDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CofreDrawer({ isOpen, onClose }: CofreDrawerProps) {
	const { documents, updateDocuments } = useGameContext();
	const [uploading, setUploading] = useState<string | null>(null);

	const handlePhotoUpload = async (
		docType: "rg" | "cpf",
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(docType);

		// Convert to base64 for persistence in IndexedDB (PouchDB)
		const reader = new FileReader();
		reader.onloadend = () => {
			const base64String = reader.result as string;
			const update =
				docType === "rg"
					? { hasRG: true, rgPhoto: base64String }
					: { hasCPF: true, cpfPhoto: base64String };

			updateDocuments(update);
			setUploading(null);
		};
		reader.readAsDataURL(file);
	};

	return (
		<Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DrawerContent className="bg-zinc-950 border-zinc-800 text-slate-300 max-h-[90vh]">
				<div className="mx-auto w-full max-w-md overflow-y-auto pb-8">
					<DrawerHeader>
						<div className="flex items-center gap-4">
							<div className="p-3 bg-blue-600/20 rounded-2xl">
								<Shield className="w-6 h-6 text-blue-400" />
							</div>
							<div className="text-left">
								<DrawerTitle className="text-xl font-bold text-white tracking-tight">
									Cofre Digital
								</DrawerTitle>
								<DrawerDescription className="text-zinc-400">
									Proteção offline de documentos essenciais
								</DrawerDescription>
							</div>
						</div>
					</DrawerHeader>

					<div className="p-4 grid grid-cols-1 gap-4">
						{/* RG Section */}
						<DocumentItem
							label="RG (Identidade)"
							hasDoc={documents.hasRG}
							photo={documents.rgPhoto}
							isUploading={uploading === "rg"}
							onUpload={(e) => handlePhotoUpload("rg", e)}
						/>

						{/* CPF Section */}
						<DocumentItem
							label="CPF (Cadastro)"
							hasDoc={documents.hasCPF}
							photo={documents.cpfPhoto}
							isUploading={uploading === "cpf"}
							onUpload={(e) => handlePhotoUpload("cpf", e)}
						/>

						{/* Security Message */}
						<div className="mt-4 p-4 rounded-xl bg-blue-900/10 border border-blue-900/20 flex gap-4">
							<Lock className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
							<div>
								<p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">
									Criptografia Local
								</p>
								<p className="text-[11px] text-blue-200/70 leading-relaxed">
									Seus documentos são armazenados exclusivamente neste
									dispositivo (IndexedDB). Sem upload para nuvem. Sem
									rastreamento.
								</p>
							</div>
						</div>
					</div>

					<DrawerFooter>
						<Button
							className="w-full h-14 bg-slate-100 hover:bg-white text-zinc-950 font-bold text-sm uppercase tracking-widest rounded-xl"
							onClick={onClose}
						>
							Fechar Cofre
						</Button>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

interface DocumentItemProps {
	label: string;
	hasDoc: boolean;
	photo?: string;
	isUploading: boolean;
	onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function DocumentItem({
	label,
	hasDoc,
	photo,
	isUploading,
	onUpload,
}: DocumentItemProps) {
	return (
		<div
			className={`p-4 rounded-2xl border transition-all ${hasDoc ? "border-emerald-500/30 bg-emerald-500/5" : "border-zinc-800 bg-zinc-900/50"}`}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div
						className={`p-2 rounded-lg ${hasDoc ? "bg-emerald-500/20" : "bg-zinc-800"}`}
					>
						<FileText
							className={`w-5 h-5 ${hasDoc ? "text-emerald-400" : "text-zinc-500"}`}
						/>
					</div>
					<div>
						<div className="text-sm font-bold text-white tracking-tight">
							{label}
						</div>
						<div className="flex items-center gap-1.5 mt-0.5">
							{hasDoc ? (
								<>
									<CheckCircle className="w-3 h-3 text-emerald-500" />
									<span className="text-[10px] text-emerald-400 uppercase font-black tracking-tighter">
										Protegido
									</span>
								</>
							) : (
								<span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
									Não Identificado
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="relative">
					<input
						type="file"
						accept="image/*"
						capture="environment"
						className="hidden"
						id={`upload-${label}`}
						onChange={onUpload}
						disabled={isUploading}
					/>
					<label
						htmlFor={`upload-${label}`}
						className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
							hasDoc
								? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
								: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
						}`}
					>
						{isUploading ? (
							<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						) : hasDoc ? (
							<>
								<Camera className="w-3.5 h-3.5" />
								Atualizar
							</>
						) : (
							<>
								<Upload className="w-3.5 h-3.5" />
								Digitalizar
							</>
						)}
					</label>
				</div>
			</div>

			{hasDoc && photo && (
				<div className="mt-4 relative aspect-[16/9] w-full bg-black rounded-xl border border-zinc-800 overflow-hidden group">
					<img
						src={photo}
						alt={`Cópia de segurança do ${label}`}
						className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
						<span className="text-[10px] text-zinc-400 font-mono italic">
							Documento_Persistido_v1.idx
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
