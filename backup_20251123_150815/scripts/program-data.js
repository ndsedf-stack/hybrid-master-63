// ====================================================================
// HYBRID MASTER 51 - PROGRAMME COMPLET DÉFINITIF CORRIGÉ
// ====================================================================
// Version : 2.0 FINALE COMPLÈTE
// Date : Novembre 2025
// Durée : 26 semaines
// Fréquence : 3 séances/semaine (Dimanche, Mardi, Vendredi) + 2 maison
// Structure : 4 blocs + 2 tapers
// Deloads : S6, S12, S18, S24, S26
// ====================================================================

// HELPER : Calculer progression de poids
function calculateWeight(baseWeight, week, increment, frequency) {
  const progressions = Math.floor((week - 1) / frequency);
  const newWeight = baseWeight + (progressions * increment);
  
  // Deload semaines 6, 12, 18, 24, 26 : -40%
  const isDeload = [6, 12, 18, 24, 26].includes(week);
  return isDeload ? Math.round(newWeight * 0.6 * 2) / 2 : newWeight;
}

// HELPER : Déterminer technique bloc
function getBlockTechnique(week) {
  if (week <= 5) return { block: 1, technique: "Tempo 3-1-2", rpe: "6-7" };
  if (week === 6) return { block: 1, technique: "Deload", rpe: "5-6" };
  if (week <= 11) return { block: 2, technique: "Rest-Pause", rpe: "7-8" };
  if (week === 12) return { block: 2, technique: "Deload", rpe: "5-6" };
  if (week <= 17) return { block: 3, technique: "Drop-sets + Myo-reps", rpe: "8" };
  if (week === 18) return { block: 3, technique: "Deload", rpe: "5-6" };
  if (week <= 23) return { block: 4, technique: "Clusters + Myo-reps + Partials", rpe: "8-9" };
  if (week === 24) return { block: 4, technique: "Deload", rpe: "5-6" };
  if (week === 25) return { block: 5, technique: "Peak Week", rpe: "8-9" };
  return { block: 5, technique: "Deload Final", rpe: "5-6" };
}

// HELPER : Exercice biceps dimanche (rotation)
function getBicepExercise(week) {
  const block = getBlockTechnique(week).block;
  // Bloc 1 & 3 : Incline Curl / Bloc 2 & 4 : Spider Curl
  return (block === 1 || block === 3) ? "Incline Curl" : "Spider Curl";
}

// ====================================================================
// GÉNÉRATEUR PROGRAMME 26 SEMAINES
// ====================================================================

function generateProgram() {
  const program = {};
  
  for (let week = 1; week <= 26; week++) {
    const blockInfo = getBlockTechnique(week);
    const isDeload = [6, 12, 18, 24, 26].includes(week);
    
    program[week] = {
      weekNumber: week,
      block: blockInfo.block,
      technique: blockInfo.technique,
      rpeTarget: blockInfo.rpe,
      isDeload: isDeload,
      
      // ============================================================
      // DIMANCHE : DOS + JAMBES LOURDES + BRAS (68 min - 31 séries)
      // ============================================================
      dimanche: {
        name: "DOS + JAMBES LOURDES + BRAS",
        duration: 68,
        totalSets: 31,
        exercises: [
          {
            id: `w${week}_dim_1`,
            name: "Trap Bar Deadlift",
            category: "compound",
            muscle: ["dos", "jambes", "fessiers"],
            sets: 5,
            reps: "6-8",
            rpe: blockInfo.rpe,
            weight: calculateWeight(75, week, 5, 3),
            rest: 120,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 2 && !isDeload ? "Rest-Pause S5 : 6-8 reps → 20s → 2-3 reps" :
                   blockInfo.block === 4 && !isDeload ? "Clusters S5 : 3 reps → 20s → 2 reps → 20s → 2 reps (7 total)" :
                   "Mouvement roi dos/jambes, barre hexagonale"
          },
          {
            id: `w${week}_dim_2`,
            name: "Goblet Squat",
            category: "compound",
            muscle: ["quadriceps", "fessiers"],
            sets: 4,
            reps: 10,
            rpe: blockInfo.rpe,
            weight: calculateWeight(25, week, 2.5, 2),
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 3 && !isDeload ? "Drop-set S4 : 10 reps → -25% → 8-10 reps" :
                   blockInfo.block === 4 && !isDeload ? "Partials S4 : 10 reps → 5 demi-reps amplitude haute" :
                   "Haltère tenu devant poitrine, descente contrôlée"
          },
          {
            id: `w${week}_dim_3`,
            name: "Leg Press",
            category: "compound",
            muscle: ["quadriceps", "fessiers"],
            sets: 4,
            reps: 10,
            rpe: blockInfo.rpe,
            weight: calculateWeight(110, week, 10, 2),
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 3 && !isDeload ? "Drop-set S4 : 10 reps → -25% → 10-12 reps" :
                   blockInfo.block === 4 && !isDeload ? "Clusters S4 : 4 reps → 20s → 3 reps → 20s → 3 reps | Puis 10 reps → 8 quarts reps" :
                   "Pieds largeur épaules, amplitude complète"
          },
          {
            id: `w${week}_dim_4a`,
            name: "Lat Pulldown (prise large)",
            category: "compound",
            muscle: ["dos"],
            sets: 4,
            reps: 10,
            rpe: blockInfo.rpe,
            weight: calculateWeight(60, week, 2.5, 2),
            rest: 90,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Landmine Press",
            notes: blockInfo.block === 3 && !isDeload ? "SUPERSET | Drop-set S4 : 10 reps → -20% → 8-10 reps" :
                   "SUPERSET avec Landmine Press | Prise 1.5× largeur épaules"
          },
          {
            id: `w${week}_dim_4b`,
            name: "Landmine Press",
            category: "compound",
            muscle: ["pectoraux", "épaules"],
            sets: 4,
            reps: 10,
            rpe: blockInfo.rpe,
            weight: calculateWeight(35, week, 2.5, 2),
            rest: 90,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Lat Pulldown (prise large)",
            notes: "SUPERSET avec Lat Pulldown | Barre calée dans coin"
          },
          {
            id: `w${week}_dim_5`,
            name: "Rowing Machine (prise large)",
            category: "compound",
            muscle: ["dos"],
            sets: 4,
            reps: 10,
            rpe: blockInfo.rpe,
            weight: calculateWeight(50, week, 2.5, 2),
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 3 && !isDeload ? "Myo-reps S4 : 10 reps → 5s → 4 mini-sets × 4 reps" :
                   blockInfo.block === 4 && !isDeload ? "Myo-reps S4 : 10 reps → 5s → 4 mini-sets × 4 reps" :
                   "Prise large, coudes extérieur, tirer vers bas pecs"
          },
          {
            id: `w${week}_dim_6a`,
            name: getBicepExercise(week),
            category: "isolation",
            muscle: ["biceps"],
            sets: 4,
            reps: 12,
            rpe: blockInfo.rpe,
            weight: calculateWeight(12, week, 2.5, 3),
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Cable Pushdown",
            notes: blockInfo.block === 1 && !isDeload ? "SUPERSET | Pause 2s bras tendus (étirement max)" :
                   blockInfo.block === 3 && !isDeload ? "SUPERSET | Myo-reps S4 : 12 reps → 5s → 4 mini-sets × 4 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps S4 : 12 reps → 5s → 4 mini-sets × 4 reps" :
                   `SUPERSET | ${getBicepExercise(week) === "Incline Curl" ? "Incline 45° sur banc" : "Spider curl pupitre"}`
          },
          {
            id: `w${week}_dim_6b`,
            name: "Cable Pushdown",
            category: "isolation",
            muscle: ["triceps"],
            sets: 3,
            reps: 12,
            rpe: blockInfo.rpe,
            weight: calculateWeight(20, week, 2.5, 3),
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: getBicepExercise(week),
            notes: blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps S3 : 12 reps → 5s → 4 mini-sets × 4 reps" :
                   "SUPERSET | Coudes fixes le long du corps"
          }
        ]
      },
      
      // ============================================================
      // MARDI : PECS + ÉPAULES + TRICEPS (70 min - 35 séries)
      // ============================================================
      mardi: {
        name: "PECS + ÉPAULES + TRICEPS",
        duration: 70,
        totalSets: 35,
        exercises: [
          {
            id: `w${week}_mar_1`,
            name: "Dumbbell Press",
            category: "compound",
            muscle: ["pectoraux", "épaules", "triceps"],
            sets: 5,
            reps: 10,
            rpe: blockInfo.rpe,
            weight: calculateWeight(22, week, 2.5, 3),
            rest: 105,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 2 && !isDeload ? "Rest-Pause S5 : 10 reps → 20s → 3-4 reps" :
                   blockInfo.block === 3 && !isDeload ? "Drop-set S5 : 10 reps → -25% → 8-10 reps" :
                   blockInfo.block === 4 && !isDeload ? "Clusters S5 : 4 reps → 15s → 3 reps → 15s → 3 reps" :
                   "Banc plat, haltères rotation naturelle (par haltère)"
          },
          {
            id: `w${week}_mar_2`,
            name: "Cable Fly (poulies moyennes)",
            category: "isolation",
            muscle: ["pectoraux"],
            sets: 4,
            reps: 12,
            rpe: blockInfo.rpe,
            weight: calculateWeight(10, week, 2.5, 3),
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 1 && !isDeload ? "Pause 2s bras écartés (étirement pecs max)" :
                   blockInfo.block === 3 && !isDeload ? "Drop-set S4 : 12 reps → -25% → 10-12 reps + Myo-reps S4 : 12 reps → 5s → 5 mini-sets × 5 reps" :
                   blockInfo.block === 4 && !isDeload ? "Myo-reps S4 : 12 reps → 5s → 5 mini-sets × 5 reps" :
                   "Poulies hauteur épaules, bras semi-fléchis"
          },
          {
            id: `w${week}_mar_3`,
            name: "Leg Press léger",
            category: "compound",
            muscle: ["quadriceps", "fessiers"],
            sets: 3,
            reps: 15,
            rpe: blockInfo.rpe,
            weight: calculateWeight(80, week, 10, 3),
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: "Activation légère jambes, pas de fatigue excessive"
          },
          {
            id: `w${week}_mar_4a`,
            name: "Extension Triceps Corde",
            category: "isolation",
            muscle: ["triceps"],
            sets: 5,
            reps: 12,
            rpe: blockInfo.rpe,
            weight: calculateWeight(20, week, 2.5, 3),
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Lateral Raises",
            notes: blockInfo.block === 3 && !isDeload ? "SUPERSET | Drop-set S5 : 12 reps → -20% → 10-12 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps S5 : 12 reps → 5s → 4 mini-sets × 4 reps" :
                   "SUPERSET | Corde poulie haute, coudes fixes"
          },
          {
            id: `w${week}_mar_4b`,
            name: "Lateral Raises",
            category: "isolation",
            muscle: ["épaules"],
            sets: 5,
            reps: 15,
            rpe: blockInfo.rpe,
            weight: calculateWeight(8, week, 2.5, 4),
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Extension Triceps Corde",
            notes: blockInfo.block === 1 && !isDeload ? "SUPERSET | Pause 1s bras horizontaux" :
                   blockInfo.block === 3 && !isDeload ? "SUPERSET | Drop-set S5 : 15 reps → -25% → 12-15 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps S5 : 15 reps → 5s → 5 mini-sets × 5 reps" :
                   "SUPERSET | Coudes fléchis, monter horizontal (haltère)"
          },
          {
            id: `w${week}_mar_5`,
            name: "Face Pull",
            category: "isolation",
            muscle: ["épaules", "dos"],
            sets: 5,
            reps: 15,
            rpe: blockInfo.rpe,
            weight: calculateWeight(20, week, 2.5, 3),
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 1 && !isDeload ? "Pause 1s contraction arrière" :
                   blockInfo.block === 3 && !isDeload ? "Myo-reps S5 : 15 reps → 5s → 5 mini-sets × 5 reps" :
                   blockInfo.block === 4 && !isDeload ? "Myo-reps S5 : 15 reps → 5s → 5 mini-sets × 5 reps" :
                   "Corde poulie haute, tirer vers visage, rotation externe"
          },
          {
            id: `w${week}_mar_6`,
            name: "Rowing Machine (prise serrée)",
            category: "compound",
            muscle: ["dos"],
            sets: 4,
            reps: 12,
            rpe: blockInfo.rpe,
            weight: calculateWeight(50, week, 2.5, 2),
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: "Prise serrée, coudes corps, tirer vers nombril"
          },
          {
            id: `w${week}_mar_7`,
            name: "Overhead Extension (corde, assis)",
            category: "isolation",
            muscle: ["triceps"],
            sets: 4,
            reps: 12,
            rpe: blockInfo.rpe,
            weight: calculateWeight(15, week, 2.5, 3),
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 3 && !isDeload ? "Myo-reps S4 : 12 reps → 5s → 4 mini-sets × 4 reps" :
                   blockInfo.block === 4 && !isDeload ? "Myo-reps S4 : 12 reps → 5s → 4 mini-sets × 4 reps" :
                   "Corde poulie haute, assis, étirement triceps max"
          }
        ]
      },
      
      // ============================================================
      // VENDREDI : DOS + JAMBES LÉGÈRES + BRAS + ÉPAULES (73 min - 33 séries)
      // ============================================================
      vendredi: {
        name: "DOS + JAMBES LÉGÈRES + BRAS + ÉPAULES",
        duration: 73,
        totalSets: 33,
        exercises: [
          {
            id: `w${week}_ven_1`,
            name: "Landmine Row",
            category: "compound",
            muscle: ["dos"],
            sets: 5,
            reps: 10,
            rpe: blockInfo.rpe,
            weight: calculateWeight(55, week, 2.5, 2),
            rest: 105,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 2 && !isDeload ? "Rest-Pause S5 : 10 reps → 20s → 3-4 reps" :
                   blockInfo.block === 3 && !isDeload ? "Drop-set S5 : 10 reps → -20% → 8-10 reps" :
                   blockInfo.block === 4 && !isDeload ? "Clusters S5 : 4 reps → 15s → 3 reps → 15s → 3 reps" :
                   "Barre calée, une main, tirer vers hanche"
          },
          {
            id: `w${week}_ven_2a`,
            name: "Leg Curl",
            category: "isolation",
            muscle: ["ischios"],
            sets: 5,
            reps: 12,
            rpe: blockInfo.rpe,
            weight: calculateWeight(40, week, 5, 3),
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Leg Extension",
            notes: blockInfo.block === 3 && !isDeload ? "SUPERSET | Drop-set S5 : 12 reps → -25% → 10-12 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Partials S5 : 12 reps → 6-8 partials amplitude haute" :
                   "SUPERSET | Allongé ou assis selon machine"
          },
          {
            id: `w${week}_ven_2b`,
            name: "Leg Extension",
            category: "isolation",
            muscle: ["quadriceps"],
            sets: 4,
            reps: 15,
            rpe: blockInfo.rpe,
            weight: calculateWeight(35, week, 5, 3),
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Leg Curl",
            notes: blockInfo.block === 3 && !isDeload ? "SUPERSET | Drop-set S4 : 15 reps → -25% → 12-15 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Partials S4 : 15 reps → 10 partials derniers 30°" :
                   "SUPERSET | Extension complète, contraction 1s"
          },
          {
            id: `w${week}_ven_3a`,
            name: "Cable Fly",
            category: "isolation",
            muscle: ["pectoraux"],
            sets: 4,
            reps: 15,
            rpe: blockInfo.rpe,
            weight: calculateWeight(10, week, 2.5, 3),
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Dumbbell Fly",
            notes: blockInfo.block === 3 && !isDeload ? "SUPERSET | Myo-reps S4 : 15 reps → 5s → 5 mini-sets × 5 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps S4 : 15 reps → 5s → 5 mini-sets × 5 reps" :
                   "SUPERSET | Poulies moyennes, étirement max"
          },
          {
            id: `w${week}_ven_3b`,
            name: "Dumbbell Fly",
            category: "isolation",
            muscle: ["pectoraux"],
            sets: 4,
            reps: 12,
            rpe: blockInfo.rpe,
            weight: calculateWeight(10, week, 2.5, 3),
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Cable Fly",
            notes: blockInfo.block === 1 && !isDeload ? "SUPERSET | Pause 2s bras écartés (étirement pecs)" :
                   blockInfo.block === 3 && !isDeload ? "SUPERSET | Drop-set S4 : 12 reps → -25% → 10-12 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps S4 : 12 reps → 5s → 4 mini-sets × 4 reps" :
                   "SUPERSET | Banc plat, amplitude complète (haltère)"
          },
          {
            id: `w${week}_ven_4a`,
            name: "EZ Bar Curl",
            category: "isolation",
            muscle: ["biceps"],
            sets: 5,
            reps: 12,
            rpe: blockInfo.rpe,
            weight: calculateWeight(25, week, 2.5, 3),
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Overhead Extension",
            notes: blockInfo.block === 1 && !isDeload ? "SUPERSET | Pause 2s bras tendus (étirement biceps)" :
                   blockInfo.block === 3 && !isDeload ? "SUPERSET | Myo-reps S5 : 12 reps → 5s → 4 mini-sets × 4 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps S5 : 12 reps → 5s → 4 mini-sets × 4 reps" :
                   "SUPERSET | Barre EZ, coudes fixes"
          },
          {
            id: `w${week}_ven_4b`,
            name: "Overhead Extension",
            category: "isolation",
            muscle: ["triceps"],
            sets: 3,
            reps: 12,
            rpe: blockInfo.rpe,
            weight: calculateWeight(15, week, 2.5, 3),
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "EZ Bar Curl",
            notes: blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps S3 : 12 reps → 5s → 4 mini-sets × 4 reps" :
                   "SUPERSET | Corde poulie haute, assis, étirement max"
          },
          {
            id: `w${week}_ven_5`,
            name: "Lateral Raises",
            category: "isolation",
            muscle: ["épaules"],
            sets: 3,
            reps: 15,
            rpe: blockInfo.rpe,
            weight: calculateWeight(8, week, 2.5, 4),
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: "Exercice clé deltoïdes, technique parfaite obligatoire"
          },
          {
            id: `w${week}_ven_6`,
            name: "Wrist Curl",
            category: "isolation",
            muscle: ["avant-bras"],
            sets: 3,
            reps: 20,
            rpe: blockInfo.rpe,
            weight: calculateWeight(30, week, 2.5, 4),
            rest: 45,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: "Assis, avant-bras sur cuisses, flexion poignets"
          }
        ]
      },
      
      // ============================================================
      // MAISON : HAMMER CURL (Mardi soir + Jeudi soir)
      // ============================================================
      maison: {
        name: "HAMMER CURL MAISON",
        duration: 5,
        totalSets: 3,
        daysPerWeek: ["Mardi soir", "Jeudi soir"],
        exercises: [
          {
            id: `w${week}_maison_1`,
            name: "Hammer Curl",
            category: "isolation",
            muscle: ["biceps", "avant-bras"],
            sets: 3,
            reps: 12,
            rpe: blockInfo.rpe,
            weight: calculateWeight(12, week, 2.5, 3),
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: "À faire Mardi ET Jeudi soir, prise marteau (haltère)"
          }
        ]
      }
    };
  }
  
  return program;
}

// ====================================================================
// GÉNÉRATION DU PROGRAMME COMPLET
// ====================================================================
export const PROGRAM = generateProgram();

// ====================================================================
// INFORMATIONS SUPPLÉMENTAIRES
// ====================================================================
export const PROGRAM_INFO = {
  name: "Hybrid Master 51",
  version: "2.0 Complète Corrigée",
  duration: 26,
  weeksPerBlock: {
    block1: [1, 2, 3, 4, 5],
    deload1: [6],
    block2: [7, 8, 9, 10, 11],
    deload2: [12],
    block3: [13, 14, 15, 16, 17],
    deload3: [18],
    block4: [19, 20, 21, 22, 23],
    deload4: [24],
    block5: [25],
    deload5: [26]
  },
  workoutsPerWeek: 3,
  daysOfWeek: ["Dimanche", "Mardi", "Vendredi"],
  homeworkDays: ["Mardi soir", "Jeudi soir"],
  
  blockTechniques: {
    block1: {
      name: "Fondations Techniques",
      weeks: "1-5",
      technique: "Tempo 3-1-2",
      description: "3s descente, 1s pause, 2s montée",
      pauses: "Cable Fly (2s), Dumbbell Fly (2s), Incline Curl (2s), EZ Bar Curl (2s), Lateral Raises (1s), Face Pull (1s)",
      rpe: "6-7"
    },
    block2: {
      name: "Surcharge Progressive",
      weeks: "7-11",
      technique: "Rest-Pause",
      description: "Dernière série exercices principaux : reps → 20s → 2-4 reps",
      exercises: "Trap Bar DL S5, Dumbbell Press S5, Landmine Row S5",
      rpe: "7-8"
    },
    block3: {
      name: "Surcompensation Métabolique",
      weeks: "13-17",
      technique: "Drop-sets + Myo-reps",
      description: "Drop-sets (-25%) + Myo-reps isolations",
      dropSets: "Goblet, Leg Press, Lat Pulldown, Dumbbell Press, Cable Fly, Extension Triceps, Lateral Raises, Landmine Row, Leg Curl, Leg Extension, Dumbbell Fly",
      myoReps: "Face Pull, Overhead Extension, Incline Curl, Cable Fly, Rowing Machine",
      rpe: "8"
    },
    block4: {
      name: "Intensification Maximale",
      weeks: "19-23",
      technique: "Clusters + Myo-reps + Partials",
      description: "Clusters lourds + Myo-reps isolations + Partials jambes",
      clusters: "Trap Bar DL, Dumbbell Press, Landmine Row, Leg Press",
      myoReps: "TOUTES les isolations",
      partials: "Goblet (+5 demi), Leg Press (+8 quarts), Leg Curl (+6-8), Leg Extension (+10)",
      rpe: "8-9"
    }
  },
  
  deloadProtocol: {
    weeks: [6, 12, 18, 24, 26],
    loadReduction: "-40%",
    tempo: "4-1-2",
    rpe: "5-6",
    purpose: "Récupération complète, prévention surentraînement"
  },
  
  bicepsRotation: {
    block1: "Incline Curl",
    block2: "Spider Curl",
    block3: "Incline Curl",
    block4: "Spider Curl",
    reason: "Incline = étirement max | Spider = contraction max"
  },
  
  expectedResults: {
    leanMass: "+4.5 à 5.5 kg",
    armCircumference: "+2.5 à 3 cm",
    chestCircumference: "+3.5 à 4 cm",
    shoulderCircumference: "+3 à 3.5 cm",
    backCircumference: "+4 à 5 cm",
    thighCircumference: "+3 à 3.5 cm",
    trapBarDeadlift: "75 kg → 120 kg (+45 kg)",
    dumbbellPress: "22 kg → 45 kg/haltère (+23 kg)",
    legPress: "110 kg → 240 kg (+130 kg)",
    rowingMachine: "50 kg → 82.5 kg (+32.5 kg)",
    completionRate: "95%+",
    injuryRisk: "<5%"
  },
  
  weeklyVolume: {
    quadriceps: { direct: 16, indirect: 7, total: 23, frequency: 3, optimal: "18-24" },
    hamstrings: { direct: 10, indirect: 7, total: 17, frequency: 2, optimal: "14-20" },
    glutes: { direct: 9, indirect: 10, total: 19, frequency: 3, optimal: "14-20" },
    back: { direct: 22, indirect: 8, total: 30, frequency: 3, optimal: "18-24" },
    chest: { direct: 17, indirect: 5, total: 22, frequency: 3, optimal: "16-22" },
    rearDelts: { direct: 9, indirect: 3, total: 12, frequency: 2, optimal: "10-14" },
    lateralDelts: { direct: 8, indirect: 2, total: 10, frequency: 3, optimal: "6-10" },
    biceps: { direct: 9, indirect: 10, total: 19, frequency: 3, optimal: "14-20" },
    triceps: { direct: 15, indirect: 5, total: 20, frequency: 3, optimal: "12-18" },
    forearms: { direct: 3, indirect: 13, total: 16, frequency: 3, optimal: "6-12" }
  },
  
  nutrition: {
    protein: "2g/kg poids corps (priorité absolue)",
    carbs: "3-4g/kg (énergie entraînement)",
    fats: "0.8-1g/kg (hormones, santé)",
    surplus: "+300 à +500 kcal/jour",
    preWorkout: "30-40g protéines + 50-60g glucides (1-2h avant)",
    postWorkout: "30g whey + 50g glucides rapides (30 min)",
    beforeBed: "30g caséine + ZMA",
    hydration: "3L/jour + 500ml/heure training"
  },
  
  supplementation: {
    mandatory: {
      protein: "2g/kg répartis",
      creatine: "5g/jour post-training",
      collagen: "10g/jour matin jeun",
      omega3: "3g/jour avec repas",
      vitaminD3: "4000 UI/jour matin",
      zma: "30 min avant coucher",
      wheyIsolate: "30g post-training",
      fastCarbs: "50g post-training",
      electrolytes: "1 dose pendant training"
    },
    optional: {
      glucosamineChondroitin: "1500mg/jour",
      curcumin: "500mg matin",
      magnesiumBisglycinate: "400mg soir"
    }
  },
  
  recovery: {
    sleep: "7h30 minimum (optimal 8h)",
    bedtime: "Régulier, 18-19°C, obscurité totale",
    overtrainingSignals: [
      "Insomnie persistante (>3 nuits)",
      "Douleur articulaire aiguë",
      "Fatigue extrême constante",
      "Perte motivation totale",
      "Régression force 2 séances",
      "FC repos +10 bpm vs normale"
    ],
    actionIfOvertrained: [
      "Deload anticipé (1 sem -50%)",
      "Sommeil 9h minimum",
      "Massage/kiné si douleurs",
      "Retour progressif"
    ]
  },
  
  warmup: {
    phase1: "Cardio 5 min 60-70% FC max",
    phase2: "Mobilité 5 min (rotations épaules, cat-cow, leg swings, poignets/chevilles, dislocations)",
    phase3: "Spécifique : 40% 8 reps → 60% 5 reps → 80% 3 reps → 90% 1 rep → 100% travail"
  },
  
  safetyRules: {
    golden: [
      "Technique > Charge TOUJOURS",
      "Douleur ≠ Courbature",
      "Progression conservative",
      "Respiration : inspirer descente, expirer montée",
      "Amplitude contrôlée"
    ],
    stopSignals: [
      "Douleur articulaire aiguë",
      "Craquement tendon",
      "Engourdissement",
      "Perte force soudaine",
      "Vertiges/nausées",
      "Douleur thoracique"
    ]
  },
  
  progressionCriteria: {
    increase: "RPE ≤6 sur 2 séances + technique parfaite + aucune douleur",
    maintain: "RPE 7-8 constant + technique légèrement dégradée",
    decrease: "RPE >9 deux séances + technique dégradée + douleur"
  }
};

// ====================================================================
// CLASSE PROGRAMDATA (API COMPLÈTE)
// ====================================================================
export class ProgramData {
  constructor() {
    this.program = PROGRAM;
    this.info = PROGRAM_INFO;
    this.currentWeek = 1;
  }
  getWeek(weekNumber) {
    if (weekNumber < 1 || weekNumber > 26) {
        throw new Error(`Semaine invalide : ${weekNumber}`);
    }
    
    // 🔍 DEBUG
    console.log('🔍 getWeek appelée avec:', weekNumber);
    console.log('🔍 Type de this.program:', typeof this.program);
    console.log('🔍 Keys de this.program:', Object.keys(this.program).slice(0, 5));
    console.log('🔍 this.program[1]:', this.program[1]);
    console.log('🔍 this.program[weekNumber]:', this.program[weekNumber]);
    
    return this.program[weekNumber];
  }

  getWorkout(weekNumber, day) {
    const week = this.getWeek(weekNumber);
    const validDays = ['dimanche', 'mardi', 'vendredi', 'maison'];
    if (!validDays.includes(day.toLowerCase())) {
      throw new Error(`Jour invalide : ${day}`);
    }
    return week[day.toLowerCase()];
  }

  getWorkoutExercises(weekNumber, day) {
    const workout = this.getWorkout(weekNumber, day);
    return workout.exercises;
  }

  getExerciseProgression(exerciseName) {
    const progression = [];
    for (let week = 1; week <= 26; week++) {
      const weekData = this.getWeek(week);
      ['dimanche', 'mardi', 'vendredi', 'maison'].forEach(day => {
        const workout = weekData[day];
        const exercise = workout.exercises.find(ex => ex.name === exerciseName);
        if (exercise) {
          progression.push({
            week,
            day,
            weight: exercise.weight,
            sets: exercise.sets,
            reps: exercise.reps,
            technique: weekData.technique,
            isDeload: weekData.isDeload,
            notes: exercise.notes
          });
        }
      });
    }
    return progression;
  }

  getAllExercises() {
    const exercisesSet = new Set();
    for (let week = 1; week <= 26; week++) {
      const weekData = this.getWeek(week);
      ['dimanche', 'mardi', 'vendredi', 'maison'].forEach(day => {
        weekData[day].exercises.forEach(ex => {
          exercisesSet.add(ex.name);
        });
      });
    }
    return Array.from(exercisesSet).sort();
  }

  getWeekVolume(weekNumber) {
    const week = this.getWeek(weekNumber);
    let totalSets = 0;
    let totalReps = 0;
    let totalWeight = 0;
    ['dimanche', 'mardi', 'vendredi', 'maison'].forEach(day => {
      week[day].exercises.forEach(ex => {
        const setsCount = typeof ex.sets === 'number' ? ex.sets : 1;
        totalSets += setsCount;
        const repsNum = typeof ex.reps === 'string' ? parseInt(ex.reps.split('-')[0]) : ex.reps;
        totalReps += setsCount * repsNum;
        totalWeight += setsCount * repsNum * ex.weight;
      });
    });
    return {
      totalSets,
      totalReps,
      totalWeight: Math.round(totalWeight),
      weekNumber
    };
  }

  getAllWeeks() {
    const weeks = [];
    for (let i = 1; i <= 26; i++) {
      weeks.push(this.getWeek(i));
    }
    return weeks;
  }

  isDeloadWeek(weekNumber) {
    return [6, 12, 18, 24, 26].includes(weekNumber);
  }

  getBlock(weekNumber) {
    const week = this.getWeek(weekNumber);
    return week.block;
  }

  getTechnique(weekNumber) {
    const week = this.getWeek(weekNumber);
    return week.technique;
  }

  getSupersetsForDay(weekNumber, day) {
    const workout = this.getWorkout(weekNumber, day);
    const supersets = [];
    const exercises = workout.exercises;
    
    for (let i = 0; i < exercises.length; i++) {
      if (exercises[i].isSuperset) {
        const partner = exercises.find(ex => 
          ex.supersetWith === exercises[i].name || 
          exercises[i].supersetWith === ex.name
        );
        if (partner) {
          supersets.push({
            exercise1: exercises[i],
            exercise2: partner
          });
        }
      }
    }
    return supersets;
  }

  getBicepExerciseForWeek(weekNumber) {
    return getBicepExercise(weekNumber);
  }

  exportToJSON() {
    return JSON.stringify({
      program: this.program,
      info: this.info
    }, null, 2);
  }

  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.program = data.program;
      this.info = data.info;
      return true;
    } catch (error) {
      console.error('Erreur import JSON:', error);
      return false;
    }
  }

  validateProgram() {
    const errors = [];
    if (Object.keys(this.program).length !== 26) {
      errors.push(`Nombre semaines incorrect : ${Object.keys(this.program).length}`);
    }
    for (let week = 1; week <= 26; week++) {
      try {
        const weekData = this.getWeek(week);
        ['dimanche', 'mardi', 'vendredi', 'maison'].forEach(day => {
          if (!weekData[day]) {
            errors.push(`S${week} : jour ${day} manquant`);
          } else if (!weekData[day].exercises || weekData[day].exercises.length === 0) {
            errors.push(`S${week} ${day} : aucun exercice`);
          }
        });
        if (!weekData.block) errors.push(`S${week} : 'block' manquant`);
        if (!weekData.technique) errors.push(`S${week} : 'technique' manquant`);
      } catch (error) {
        errors.push(`S${week} : ${error.message}`);
      }
    }
    return {
      isValid: errors.length === 0,
      errors,
      totalWeeks: Object.keys(this.program).length,
      totalExercises: this.getAllExercises().length
    };
  }

  // Méthodes utilitaires supplémentaires
  getProgressionSummary() {
    const summary = {};
    const allExercises = this.getAllExercises();
    
    allExercises.forEach(exerciseName => {
      const progression = this.getExerciseProgression(exerciseName);
      if (progression.length > 0) {
        const first = progression[0];
        const last = progression[progression.length - 1];
        summary[exerciseName] = {
          startWeight: first.weight,
          endWeight: last.weight,
          totalGain: last.weight - first.weight,
          percentageIncrease: ((last.weight - first.weight) / first.weight * 100).toFixed(1) + '%'
        };
      }
    });
    
    return summary;
  }

  getWeekSummary(weekNumber) {
    const week = this.getWeek(weekNumber);
    const volume = this.getWeekVolume(weekNumber);
    
    
    return {
      weekNumber,
      block: week.block,
      technique: week.technique,
      isDeload: week.isDeload,
      rpeTarget: week.rpeTarget,
      totalSets: volume.totalSets,
      totalReps: volume.totalReps,
      totalWeight: volume.totalWeight,
      workouts: {
        dimanche: {
          name: week.dimanche.name,
          duration: week.dimanche.duration,
          exercises: week.dimanche.exercises.length
        },
        mardi: {
          name: week.mardi.name,
          duration: week.mardi.duration,
          exercises: week.mardi.exercises.length
        },
        vendredi: {
          name: week.vendredi.name,
          duration: week.vendredi.duration,
          exercises: week.vendredi.exercises.length
        },
        maison: {
          name: week.maison.name,
          duration: week.maison.duration,
          exercises: week.maison.exercises.length
        }
      }
    };
  }

  // ✅ AJOUTE CETTE MÉTHODE AVANT LA FERMETURE DE LA CLASSE
  getDaysList() {
    return ['dimanche', 'mardi', 'vendredi', 'maison'];
  }
} // ← fermeture unique de la classe

// ====================================================================
// EXPORT PAR DÉFAUT
// ====================================================================
// Export par défaut ET global pour superset-injector
const programData = new ProgramData();
window.programData = programData;
export default programData;
