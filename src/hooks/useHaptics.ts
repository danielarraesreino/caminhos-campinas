"use client";

import { useCallback } from "react";

export const useHaptics = () => {
    const vibrate = useCallback((pattern: number | number[]) => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore vibration errors (feature policy, etc)
            }
        }
    }, []);

    return {
        triggerImpact: useCallback(() => vibrate(200), [vibrate]), // Heavy damage
        triggerClick: useCallback(() => vibrate(15), [vibrate]), // UI Tap
        triggerSuccess: useCallback(() => vibrate([50, 50, 50]), [vibrate]), // Achievement/Gain
        triggerWarning: useCallback(() => vibrate([100, 50, 100]), [vibrate]), // Low stats
    };
};
