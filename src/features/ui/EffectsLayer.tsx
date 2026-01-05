"use client";

import { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

export function EffectsLayer() {
    // Subscribing to game state
    const { health, sanity, activeDilemmaId } = useGameContext();

    // Look up active dilemma for immediate sensory feedback
    // We use require to avoid circular dependencies if any, and to dynamically load the data
    const activeDilemma = activeDilemmaId
        ? require("@/features/game-loop/dilemmas").GAME_DILEMMAS.find(
            (d: any) => d.id === activeDilemmaId,
        )
        : null;

    const [visualState, setVisualState] = useState<
        "NORMAL" | "DANGER" | "DEPRESSED" | "ADRENALINE"
    >("NORMAL");

    useEffect(() => {
        // 1. Priority: Active Dilemma Feedback (The "Scare")
        if (activeDilemma && activeDilemma.intensity === "HIGH") {
            if (activeDilemma.aspect === "SECURITY") {
                setVisualState("ADRENALINE"); // Tunnel vision, red borders
                return;
            }
            if (
                activeDilemma.aspect === "HEALTH" ||
                activeDilemma.aspect === "FOOD"
            ) {
                setVisualState("DANGER"); // Slow red pulse
                return;
            }
        }

        // 2. Continuous Critical State (The "Survival")
        if (health < 30) {
            setVisualState("DANGER");
            return;
        }

        if (sanity < 30) {
            setVisualState("DEPRESSED"); // Gray and blurry world
            return;
        }

        setVisualState("NORMAL");
    }, [health, sanity, activeDilemma]);

    // If normal, render nothing to save performance
    if (visualState === "NORMAL") return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-40 pointer-events-none transition-all duration-1000",
                // Danger/Health Effect (Blood/Pain)
                visualState === "DANGER" &&
                "shadow-[inset_0_0_100px_rgba(255,0,0,0.4)] animate-pulse bg-red-900/10",

                // Adrenaline/Security Effect (Tunnel Vision)
                visualState === "ADRENALINE" &&
                "shadow-[inset_0_0_150px_rgba(220,38,38,0.6)] border-[20px] border-red-500/20",

                // Depression/Sanity Effect (Sober Realism - Color Loss)
                visualState === "DEPRESSED" &&
                "backdrop-grayscale-[100%] backdrop-blur-[2px] bg-slate-900/30",
            )}
        />
    );
}
