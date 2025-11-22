// ============================================
// CALCULATORS - Warm-up & Plate loading
// ============================================

class Calculators {
    // Warm-up calculator
    calculateWarmup(workingWeight, workingSets = 3) {
        const warmupSets = [];
        
        // Set 1: 40% × 8 reps
        warmupSets.push({
            weight: Math.round(workingWeight * 0.4 / 2.5) * 2.5,
            reps: 8,
            rpe: 3
        });
        
        // Set 2: 60% × 5 reps
        warmupSets.push({
            weight: Math.round(workingWeight * 0.6 / 2.5) * 2.5,
            reps: 5,
            rpe: 5
        });
        
        // Set 3: 80% × 3 reps
        warmupSets.push({
            weight: Math.round(workingWeight * 0.8 / 2.5) * 2.5,
            reps: 3,
            rpe: 7
        });
        
        return warmupSets;
    }
    
    // Plate calculator
    calculatePlates(targetWeight, barWeight = 20) {
        const weightPerSide = (targetWeight - barWeight) / 2;
        const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
        const plates = [];
        
        let remaining = weightPerSide;
        
        for (const plate of availablePlates) {
            while (remaining >= plate) {
                plates.push(plate);
                remaining -= plate;
            }
        }
        
        return {
            perSide: plates,
            total: plates.reduce((a, b) => a + b, 0) * 2 + barWeight,
            difference: Math.abs(targetWeight - (plates.reduce((a, b) => a + b, 0) * 2 + barWeight))
        };
    }
    
    // Estimateur 1RM
    estimate1RM(weight, reps) {
        // Formule Epley
        return weight * (1 + reps / 30);
    }
    
    // Calculateur % 1RM
    calculatePercentage1RM(weight, oneRM) {
        return (weight / oneRM * 100).toFixed(1);
    }
}

window.Calculators = Calculators;
