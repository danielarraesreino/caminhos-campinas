import { useEffect, useRef, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { REAL_DILEMMAS as GAME_DILEMMAS } from "./dilemmas-real"; // Using the real dilemmas file
import { TelemetryAction, telemetryService } from "@/services/telemetry";

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useGameLoop() {
  const {
    time,
    health,
    hunger,
    hygiene,
    sanity,
    energy,
    dignity,
    socialStigma,
    activeBuffs,
    modifyStat,
    advanceTime,
    activeDilemmaId,
    setActiveDilemma,
    resolvedDilemmas,
    isPaused,
    avatar,
    inventory,
    workTool,
    removeFromInventory,
    setWorkTool,
    isAtShelter,
    userPosition,
    addBuff,
    removeBuff
  } = useGameContext();

  const [isRaining, setIsRaining] = useState(false);
  // Battery State: 1.0 = 100%
  const [batteryLevel, setBatteryLevel] = useState(1.0); 

  // Refs to prevent effects running on every render
  const lastHourRef = useRef(time);

  // --- Helpers ---
  const getSanityDecayMultiplier = (stigma: number) => 1 + stigma / 100;

  const applyWeatherEffects = (state: any, raining: boolean) => {
    // Return distinct effects to be applied
    // This function calculates projected changes but doesn't apply them directly
    const effects: any = {};
    if (raining && !state.isAtShelter) {
       effects.health = state.health - 1; // Rain hurts
       if (state.workTool?.type === "CARRINHO_RECICLAGEM") {
           // Rust or wet cardboard?
       }
    }
    return effects;
  };

  const processRandomEvents = (state: any) => {
      // Placeholder for "O Rapa"
      if (Math.random() < 0.005) { // 0.5% chance per tick
          // O Rapa logic
          return {
              workTool: { ...state.workTool, isConfiscated: true },
              dignity: state.dignity - 10
          };
      }
      return null;
  };

  const checkShelterBarrier = () => {
       // Logic to check if user can enter shelter (ignored for now as mostly handled in NearbyList)
  };

  const checkBattery = async () => {
     if (typeof navigator !== "undefined" && "getBattery" in navigator) {
         try {
             // biome-ignore lint/suspicious/noExplicitAny: experimental api
             const battery = await (navigator as any).getBattery();
             setBatteryLevel(battery.level);
             
             if (battery.level < 0.05) {
                 if (!activeBuffs.includes("SEM_BATERIA")) {
                     addBuff("SEM_BATERIA");
                 }
             } else {
                 if (activeBuffs.includes("SEM_BATERIA")) {
                     removeBuff("SEM_BATERIA");
                 }
             }
         } catch (e) {
             // ignore
         }
     }
  };

  // --- Main Tick (Real-time to Game-time) ---
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // Advance Logic (Decay Stats) happens every Real World Loop
      // Assume 10 seconds = 1 hour? Or 10 seconds = X minutes?
      // Implementation uses 10000ms.
      
      // Calculate Decay
      let hngDecay = 2; // Base Hunger
      let hygDecay = 1; // Base Hygiene
      let enrDecay = 1; // Base Energy
      let snyDecay = 0.5 * getSanityDecayMultiplier(socialStigma);

      // Class Modifiers
      if (avatar) {
        if (avatar.ageRange === "jovem") hngDecay += 0.1;
        if (avatar.ageRange === "idoso") enrDecay += 0.1;
        if (avatar.timeOnStreet === "recente") snyDecay += 0.1;
      }

      // Inventory Weight Penalty
      const totalWeight = inventory.reduce((acc: number, i: any) => acc + i.weight, 0);
      if (totalWeight > 10 && workTool.type !== "CARRINHO_RECICLAGEM") {
        enrDecay += 0.3;
      }

      // Rain
      if (isRaining && !isAtShelter) {
          snyDecay += 1;
          hngDecay += 0.5; // Cold makes you hungry
          modifyStat("health", -0.5); // Getting wet risks health
      }

      // Apply
      modifyStat("hunger", -hngDecay);
      modifyStat("hygiene", -hygDecay);
      modifyStat("energy", -enrDecay);
      modifyStat("sanity", -snyDecay);

      // Random Events
      const rand = processRandomEvents({ dignity, workTool });
      if (rand) {
          if (rand.workTool) setWorkTool(rand.workTool);
          if (rand.dignity) modifyStat("dignity", rand.dignity - dignity); // Set new dignity
      }

      // Check Battery
      checkBattery();

      // Advance Time
      advanceTime(1); 
    }, 10000); // 10s per tick (1 hour)

    return () => clearInterval(interval);
  }, [
    health, hunger, hygiene, sanity, energy, socialStigma,
    isPaused, modifyStat, advanceTime, avatar, inventory, 
    workTool, isRaining, isAtShelter, removeFromInventory, 
    setWorkTool, activeBuffs, addBuff, removeBuff, dignity
  ]);


  // --- Systemic Events (Triggered by Time Change) ---
  useEffect(() => {
    if (time !== lastHourRef.current) {
      checkSystemicEvents(time);
      lastHourRef.current = time;
      
      // Random Rain change every hour
      if (Math.random() < 0.2) setIsRaining(true);
      else setIsRaining(false);
    }

    function checkSystemicEvents(currentHour: number) {
      if (activeDilemmaId) return;

      // 1. SAMIM BARRIER (Geolocalization)
      // "Se perto do SAMIM (>19h), proibição de carroça/dilema"
      if (userPosition && currentHour >= 19) {
          const SAMIM_LAT = -22.9038;
          const SAMIM_LNG = -47.0652;
          
          const dist = calculateDistance(
              userPosition[0], 
              userPosition[1], 
              SAMIM_LAT, 
              SAMIM_LNG
          );

          if (dist < 0.3) { // 300m radius
              const dilemaId = "abrigo_samim_01"; 
              const hasResolved = resolvedDilemmas.includes(dilemaId);
              if (!hasResolved) {
                  setActiveDilemma(dilemaId);
                  return;
              }
          }
      }

      // 2. Cold Night (Without Shelter)
      if (currentHour >= 22 || currentHour < 5) {
          if (!isAtShelter) {
              const hasCardboard = inventory.some((i: any) => i.name === "Papelão");
              if (hasCardboard) {
                  modifyStat("health", -1);
                  modifyStat("sanity", -1);
              } else {
                  modifyStat("health", -3);
                  modifyStat("sanity", -3);
              }
          }
      }

      // 3. Narrative Dilemmas Trigger
      for (const dilemma of GAME_DILEMMAS) {
          if (resolvedDilemmas.includes(dilemma.id)) continue;
          if (dilemma.prerequisite && !resolvedDilemmas.includes(dilemma.prerequisite)) continue;

          let triggered = false;
          const { type, value } = dilemma.trigger;

          switch (type) {
              case "RANDOM":
                  if (Math.random() < value) triggered = true;
                  break;
              case "HUNGER_LOW":
                  if (hunger < value) triggered = true;
                  break;
              case "HYGIENE_LOW":
                   if (hygiene < value) triggered = true;
                   break;
              case "SOCIAL_STIGMA_HIGH":
                   if (socialStigma > value) triggered = true;
                   break;
          }

          /* Hard Constraint for ODS 2 (Hunger) - Force dilemma if critical */
          if (hunger < 10 && !resolvedDilemmas.includes("fome_extrema_01")) {
              // Assuming ID exists for now, or fallback
          }

          if (triggered) {
              setActiveDilemma(dilemma.id);
              return;
          }
      }

      // 4. CAPS Sedation Systemic Effect
      if (activeBuffs.includes("SEDADO_CAPS")) {
          modifyStat("energy", -5);
      }
    }
  }, [
    time, activeDilemmaId, resolvedDilemmas, hunger, hygiene, activeBuffs, 
    isAtShelter, inventory, setActiveDilemma, modifyStat, socialStigma, userPosition
  ]);

  return { isRaining, batteryLevel };
}
