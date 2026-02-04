"use server";

import { prisma } from "@/lib/prisma";

type SyncResult = {
    success: boolean;
    savedEvents: number;
    savedStories: number;
    error?: string;
};

export async function syncOfflineData(
    telemetryEvents: any[],
    userStories: any[]
): Promise<SyncResult> {
    console.log("Starting sync...", {
        events: telemetryEvents?.length,
        stories: userStories?.length,
    });

    if (!Array.isArray(telemetryEvents) || !Array.isArray(userStories)) {
        return {
            success: false,
            savedEvents: 0,
            savedStories: 0,
            error: "Invalid data format. Expected arrays.",
        };
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            let savedEvents = 0;
            let savedStories = 0;

            // 1. Sync Telemetry
            if (telemetryEvents.length > 0) {
                // Map to Prisma model
                const eventsToCreate = telemetryEvents.map((evt) => ({
                    sessionId: evt.id || "unknown_session", // storing uuid in sessionId as the 'id' in schema is uuid default
                    eventType: evt.type,
                    payload: evt.data || {},
                    createdAt: evt.timestamp ? new Date(evt.timestamp) : new Date(),
                }));

                // We use createMany for efficiency
                const eventsResult = await tx.telemetryEvent.createMany({
                    data: eventsToCreate,
                    skipDuplicates: true // Avoid crashing on double sync
                });
                savedEvents = eventsResult.count;
            }

            // 2. Sync Stories
            if (userStories.length > 0) {
                const storiesToCreate = userStories.map((story) => ({
                    content: story.text,
                    source: "web-offline-form",
                    isVerified: false,
                    createdAt: story.timestamp ? new Date(story.timestamp) : new Date(),
                }));

                const storiesResult = await tx.communityStory.createMany({
                    data: storiesToCreate,
                    skipDuplicates: true // Assuming potential duplicates handling or let it create copy
                });
                savedStories = storiesResult.count;
            }

            return { savedEvents, savedStories };
        });

        return {
            success: true,
            savedEvents: result.savedEvents,
            savedStories: result.savedStories,
        };
    } catch (error) {
        console.error("Sync failed:", error);
        return {
            success: false,
            savedEvents: 0,
            savedStories: 0,
            error: "Database connection failed or transaction error.",
        };
    }
}
