import { useCallback, useEffect } from "react";
import { useGameContext } from "@/contexts/GameContext"; // Import Context
import { type TelemetryAction, telemetryService } from "../services/telemetry";

export const useTelemetry = () => {
	// Get Avatar from Context to enrich data
	const { avatar } = useGameContext();

	const sync = useCallback(async () => {
		if (!navigator.onLine) return;

		try {
			const unsynced = await telemetryService.getUnsyncedEvents();
			if (unsynced.length === 0) return;

			// Send to dummy endpoint
			const response = await fetch("/api/sync", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(unsynced),
			});

			if (response.ok) {
				const ids = unsynced.map((e) => e.id);
				await telemetryService.markAsSynced(ids);
				console.log(`Synced ${ids.length} telemetry events`);
			}
		} catch (error) {
			console.error("Telemetry sync failed:", error);
		}
	}, []);

	const trackAction = useCallback(
		async (
			action: TelemetryAction,
			data: Record<string, unknown> = {},
			ods_category?: string,
		) => {
			// ODS 5 & 10 Enrichments
			const demographicData = avatar
				? {
						demographic_gender: avatar.gender,
						demographic_ethnicity: avatar.ethnicity || "unknown", // Fallback
						demographic_age: avatar.ageRange,
						demographic_time_street: avatar.timeOnStreet,
					}
				: {};

			const enrichedMetadata = {
				...data,
				...demographicData,
			};

			await telemetryService.track(action, enrichedMetadata, { ods_category });

			// Try to sync immediately if online
			if (navigator.onLine) {
				sync();
			}
		},
		[sync, avatar], // Avatar is dependency
	);

	// Sync on online event
	useEffect(() => {
		const handleOnline = () => {
			sync();
		};

		window.addEventListener("online", handleOnline);

		// Also sync on mount
		sync();

		return () => {
			window.removeEventListener("online", handleOnline);
		};
	}, [sync]);

	return {
		trackAction,
	};
};
