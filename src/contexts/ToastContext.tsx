"use client";

import { X } from "lucide-react";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}

interface ToastContextType {
	showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const showToast = useCallback(
		(message: string, type: ToastType = "info", duration = 3000) => {
			const id = Math.random().toString(36).substring(2, 9);
			setToasts((prev) => [...prev, { id, message, type, duration }]);
		},
		[],
	);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 p-4 max-w-sm w-full pointer-events-none">
				{toasts.map((toast) => (
					<ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
				))}
			</div>
		</ToastContext.Provider>
	);
}

function ToastItem({
	toast,
	onRemove,
}: {
	toast: ToastMessage;
	onRemove: (id: string) => void;
}) {
	// Auto remove
	useEffect(() => {
		const timer = setTimeout(() => {
			onRemove(toast.id);
		}, toast.duration || 3000);
		return () => clearTimeout(timer);
	}, [toast.id, toast.duration, onRemove]);

	const styles = {
		success: "bg-emerald-600 text-white border-emerald-500",
		error: "bg-red-600 text-white border-red-500",
		warning: "bg-amber-500 text-black border-amber-400",
		info: "bg-blue-600 text-white border-blue-500",
	};

	return (
		<div
			className={`
        pointer-events-auto
        flex items-center justify-between
        px-4 py-3 rounded-lg shadow-2xl border
        animate-in slide-in-from-right-full fade-in duration-300
        ${styles[toast.type]}
      `}
			role="alert"
		>
			<span className="text-sm font-bold tracking-wide mr-4">
				{toast.message}
			</span>
			<button
				type="button"
				onClick={() => onRemove(toast.id)}
				className="p-1 hover:bg-black/20 rounded-full transition-colors"
				aria-label="Fechar notificação"
			>
				<X size={14} />
			</button>
		</div>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}
