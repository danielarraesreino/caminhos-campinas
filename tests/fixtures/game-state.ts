import { test as base } from "../e2e/fixtures";

// Default mock state for a logged-in player
const MOCK_PLAYER_STATE = {
	_id: "game_state_v1",
	version: "1.1",
	health: 100,
	hunger: 0,
	hygiene: 90,
	sanity: 100,
	energy: 100,
	dignity: 50,
	socialStigma: 0,
	stabilityGap: 20,
	money: 20,
	day: 1,
	time: 8,
	activeBuffs: [],
	isAtShelter: false,
	inventory: [],
	resolvedDilemmas: [],
	activeDilemmaId: null,
	criticalHealth: false,
	phoneBattery: 85,
	userPosition: null,
	isPaused: false,
	addiction: 0,
	trust: 50,
	employed_formal: false,
	history: [],
	pdu: {
		isActive: false,
		objective: null,
		currentStageId: "",
		completedStages: [],
		stressLevel: 0,
	},
	workTool: {
		type: null,
		condition: 100,
		capacity: 0,
		riskFactor: 0,
		isConfiscated: false,
	},
	documents: {
		hasRG: false,
		hasCPF: false,
		hasComprovanteResidencia: false,
	},
	avatar: {
		name: "Testador Fixture",
		gender: "masculino",
		ethnicity: "pardo",
		ageRange: "adulto",
		timeOnStreet: "recente",
		startingSkill: "nenhuma",
		avatarImage: "/avatars/avatar_1.png",
	},
};

type GameStateFixture = {
	gameState: {
		injectGameState: (customState?: any) => Promise<void>;
	};
};

export const test = base.extend<GameStateFixture>({
	gameState: async ({ page }, use) => {
		// Navigate to root to load the app and context
		await page.goto("/");

		const inject = async (customState: any = {}) => {
			const stateToInject = { ...MOCK_PLAYER_STATE, ...customState };

			// Wait for hydration or simply override
			// We wait for the window property to be available
			await page.waitForFunction(
				() => (window as any).debugSetState !== undefined,
				null,
				{ timeout: 5000 },
			);

			await page.evaluate(async (data) => {
				await (window as any).debugSetState(data);
			}, stateToInject);

			// Allow React to process the update
			await page.waitForTimeout(500);
		};

		await use({ injectGameState: inject });
	},
});
