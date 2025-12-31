
import partnersData from '@/data/partners-campinas.json';

export interface Partner {
    id: string;
    name: string;
    type: "ONG" | "COLETIVO" | "GOVERNO";
    services: string[];
    description: string;
    address: string;
    contact: string;
    coords: number[];
    verificationLevel: "gold" | "verified" | "official";
}

const STORAGE_KEY = 'partners_hub_data';

export const hubService = {
    loadInitialData: () => {
        if (typeof window === 'undefined') return;

        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            console.log('🌱 Seeding Hub Data with Real Partners...');
            localStorage.setItem(STORAGE_KEY, JSON.stringify(partnersData));
        }
    },

    getPartners: (): Partner[] => {
        if (typeof window === 'undefined') return partnersData as Partner[];
        // Fallback to static if SSR, but usually we run this in useEffect

        hubService.loadInitialData(); // Ensure seeded

        const data = localStorage.getItem(STORAGE_KEY);
        try {
            return JSON.parse(data || '[]');
        } catch (e) {
            console.error('Failed to parse partners data', e);
            return partnersData as Partner[];
        }
    },

    addPartner: (partner: Partner) => {
        const partners = hubService.getPartners();
        partners.push(partner);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
    }
};
