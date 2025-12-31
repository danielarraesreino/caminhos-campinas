export type TelemetryEventType =
    | "SHOCK_EVENT"
    | "RESOURCE_GAP"
    | "BARRIER_DIGITAL"
    | "GAME_START"
    | "GAME_OVER"
    | "ODS_ACTION";

export interface TelemetryEvent {
    id: string;
    type: TelemetryEventType;
    timestamp: string; // ISO String
    data: Record<string, any>;
    odsTag?: string; // ODS 1, 2, 8, etc.
}

const STORAGE_KEY = "caminhos_campinas_telemetry";

class TelemetryService {
    private events: TelemetryEvent[] = [];
    private static instance: TelemetryService;

    private constructor() {
        this.loadEvents();
    }

    public static getInstance(): TelemetryService {
        if (!TelemetryService.instance) {
            TelemetryService.instance = new TelemetryService();
        }
        return TelemetryService.instance;
    }

    private loadEvents() {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    this.events = JSON.parse(stored);
                } catch (e) {
                    console.error("Failed to parse telemetry data", e);
                    this.events = [];
                }
            }
        }
    }

    private saveTimeout: NodeJS.Timeout | null = null;

    private saveEvents() {
        if (typeof window !== "undefined") {
            if (this.saveTimeout) clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
            }, 5000); // Save every 5 seconds max
        }
    }

    public track(type: TelemetryEventType, data: Record<string, any> = {}, odsTag?: string) {
        const event: TelemetryEvent = {
            id: crypto.randomUUID(),
            type,
            timestamp: new Date().toISOString(),
            data,
            odsTag,
        };

        this.events.push(event);
        this.saveEvents();
        console.log(`[Telemetry] ${type}`, event);
    }

    public getEvents(): TelemetryEvent[] {
        return this.events;
    }

    public getAggregatedStats() {
        const totalGames = this.events.filter(e => e.type === "GAME_START").length;
        const violations = this.events.filter(e => e.type === "SHOCK_EVENT").length;
        const resourceGaps = this.events.filter(e => e.type === "RESOURCE_GAP").length;

        // Group by ODS
        const odsCounts: Record<string, number> = {};
        this.events.forEach(e => {
            if (e.odsTag) {
                odsCounts[e.odsTag] = (odsCounts[e.odsTag] || 0) + 1;
            }
        });

        return {
            totalGames: Math.max(totalGames, 1), // Avoid div by zero
            violations,
            resourceGaps,
            odsCounts
        };
    }

    public clearData() {
        this.events = [];
        this.saveEvents();
    }
}

export const telemetry = TelemetryService.getInstance();
