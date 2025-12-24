"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { telemetryService } from "@/services/telemetry";

export function DataExport() {
	const [loading, setLoading] = useState(false);

	const handleExport = async () => {
		setLoading(true);
		try {
			const events = await telemetryService.getAllEvents();

			if (events.length === 0) {
				alert("Não há dados para exportar.");
				setLoading(false);
				return;
			}

			// Feedback Visual de Auditoria (Step 3)
			alert(
				"⬇️ Exportando Relatório de Transparência\n(Dados Anonimizados conforme ODS 17.18)",
			);

			// Define CSV headers
			const headers = [
				"event_id",
				"session_hash", // Changed from id to explicit session hash
				"timestamp",
				"action_type",
				"ods_category",
				"outcome",
				"demographic_gender",
				"demographic_ethnicity",
				"demographic_age",
				"demographic_time_street",
				"grid_location", // Explicit naming
			];

			// Convert data to CSV rows
			const csvRows = events.map((event) => {
				const meta = event.metadata as any;

				// Privacy Audit: Ensure simpler location usage
				// meta.location is already anonymized (grid), but we ensure we don't access meta.lat/lng

				return [
					event.id,
					event.user_hash || "anonymous",
					new Date(event.timestamp).toISOString(),
					event.action_type,
					event.ods_category || "N/A",
					meta.outcome || "N/A",
					meta.demographic_gender || "N/A",
					meta.demographic_ethnicity || "N/A",
					meta.demographic_age || "N/A",
					meta.demographic_time_street || "N/A",
					meta.location || "N/A",
				]
					.map((value) => `"${String(value).replace(/"/g, '""')}"`)
					.join(",");
			});

			const csvContent = [headers.join(","), ...csvRows].join("\n");
			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = url;
			link.setAttribute(
				"download",
				`telemetry_export_${new Date().toISOString()}.csv`,
			);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Export failed", error);
			alert("Erro ao exportar dados.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button
			onClick={handleExport}
			disabled={loading}
			variant="outline"
			className="gap-2 border-blue-500 text-blue-400 hover:bg-blue-900/20"
		>
			<Download size={16} />
			{loading ? "Gerando CSV..." : "Baixar Dados para Pesquisa (CSV)"}
		</Button>
	);
}
