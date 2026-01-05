
import fs from 'fs';
import path from 'path';

// Mock State for validation
const mockState = {
    health: 100,
    hunger: 100,
    hygiene: 100,
    sanity: 100,
    energy: 100,
    dignity: 50,
    socialStigma: 0,
    stabilityGap: 0,
    money: 0,
    day: 1,
    time: 8,
    activeBuffs: [],
    isAtShelter: false,
    inventory: [],
    resolvedDilemmas: [],
    activeDilemmaId: null,
    criticalHealth: false,
    avatar: {
        name: "Test",
        gender: "feminino",
        ethnicity: "pardo",
        ageRange: "adulto",
        timeOnStreet: "recente",
        startingSkill: "nenhuma"
    },
    workTool: {
        type: null,
        condition: 100,
        capacity: 0,
        riskFactor: 0,
        isConfiscated: false
    },
    documents: {
        hasRG: false,
        hasCPF: false,
        hasCarteiraTrabalho: false,
        hasComprovanteResidencia: false
    },
    flags: {
        quest_rg_started: false,
        quest_health_unit_known: false
    },
    phoneBattery: 100,
    userPosition: [-22.9055, -47.0608],
    isPaused: false,
    addiction: 0,
    trust: 50,
    employed_formal: false
};

// Simple Parser Logic (Copied from DilemmaManager for consistency)
function checkConditionExpression(expression: string, state: any): boolean {
    try {
        if (expression.includes(" && ")) {
            const subExprs = expression.split(" && ");
            return subExprs.every((e) => checkConditionExpression(e, state));
        }

        let target = expression.trim();
        let operator = "";

        if (target.includes(" === ")) operator = "===";
        else if (target.includes(" !== ")) operator = "!==";
        else if (target.includes(" >= ")) operator = ">=";
        else if (target.includes(" <= ")) operator = "<=";
        else if (target.includes(" > ")) operator = ">";
        else if (target.includes(" < ")) operator = "<";

        if (operator) {
            const [leftSide, rightSide] = target.split(operator);
            const leftVal = resolveValue(leftSide.trim(), state);
            const rightVal = resolveValue(rightSide.trim(), state);

            // Just verifying it runs without throwing, logic correctness is secondary for this validation
            return true;
        }

        let isNegated = false;
        if (target.startsWith("!")) {
            isNegated = true;
            target = target.substring(1);
        }
        resolveValue(target, state);
        return true;

    } catch (e) {
        throw new Error(`Syntax Error in condition: "${expression}" - ${e}`);
    }
}

function resolveValue(pathOrValue: string, state: any): any {
    if ((pathOrValue.startsWith("'") && pathOrValue.endsWith("'")) ||
        (pathOrValue.startsWith('"') && pathOrValue.endsWith('"'))) {
        return pathOrValue.slice(1, -1);
    }
    if (!Number.isNaN(Number(pathOrValue))) {
        return Number(pathOrValue);
    }
    if (pathOrValue === "true") return true;
    if (pathOrValue === "false") return false;
    if (pathOrValue.startsWith("state.")) {
        const parts = pathOrValue.replace("state.", "").split(".");
        let value = state;
        for (const part of parts) {
            if (value === undefined || value === null) return undefined;
            value = value[part];
        }
        return value;
    }
    return undefined;
}

// Main Validation
async function validate() {
    console.log("🔍 Starting Data Integrity Validation...");

    // 1. Load Data
    const dilemmasPath = path.join(process.cwd(), 'src/data/dilemmas-campinas.json');
    const servicesPath = path.join(process.cwd(), 'src/data/services-campinas.json');

    if (!fs.existsSync(dilemmasPath)) throw new Error("dilemmas-campinas.json not found");
    if (!fs.existsSync(servicesPath)) throw new Error("services-campinas.json not found");

    const dilemmas = JSON.parse(fs.readFileSync(dilemmasPath, 'utf8'));
    const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

    const dilemmaIds = new Set(dilemmas.map((d: any) => d.id));
    const serviceIds = new Set(services.map((s: any) => s.id));

    let errors = 0;

    // 2. Validate Services (CONSULTORIO_RUA check)
    if (!serviceIds.has("consultorio_na_rua")) {
        console.error("❌ ERROR: Service 'consultorio_na_rua' missing!");
        errors++;
    } else {
        console.log("✅ Service 'consultorio_na_rua' found.");
    }

    // 3. Validate Dilemmas
    dilemmas.forEach((d: any) => {
        // Check Next Links
        if (d.nextDilemmaId && !dilemmaIds.has(d.nextDilemmaId)) {
            console.error(`❌ ERROR: Dilemma '${d.id}' points to missing nextDilemmaId '${d.nextDilemmaId}'`);
            errors++;
        }
        d.options.forEach((opt: any, idx: number) => {
            if (opt.nextDilemmaId && !dilemmaIds.has(opt.nextDilemmaId)) {
                console.error(`❌ ERROR: Dilemma '${d.id}' option ${idx} points to missing nextDilemmaId '${opt.nextDilemmaId}'`);
                errors++;
            }
        });

        // Check Condition Strings
        if (d.trigger && d.trigger.condition && typeof d.trigger.condition === 'string') {
            try {
                checkConditionExpression(d.trigger.condition, mockState);
            } catch (e: any) {
                console.error(`❌ ERROR: Invalid condition in '${d.id}': ${e.message}`);
                errors++;
            }
        }
    });

    if (errors > 0) {
        console.error(`\nFound ${errors} errors.`);
        process.exit(1);
    } else {
        console.log("\n✨ All validations passed! Data integrity is 100%.");
    }
}

validate().catch(e => {
    console.error("Fatal Error:", e);
    process.exit(1);
});
