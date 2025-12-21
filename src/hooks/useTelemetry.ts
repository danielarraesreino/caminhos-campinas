import { useCallback, useEffect } from "react";
import { type TelemetryAction, telemetryService } from "../services/telemetry";

export const useTelemetry = () => {
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
		async (action: TelemetryAction, data: Record<string, any> = {}) => {
			await telemetryService.track(action, data);

			// Try to sync immediately if online
			if (navigator.onLine) {
				// Debounce or just fire and forget?
				// For requirement "attempt to send", we call sync.
				// We catch errors inside sync so it won't crash the app.
				sync();
			}
		},
		[sync],
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
