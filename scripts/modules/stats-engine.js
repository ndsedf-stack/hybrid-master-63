// ============================================
// STATS ENGINE - Calculs avancés hypertrophie
// ============================================

class StatsEngine {
    constructor() {
        this.sessions = [];
        this.bodyMeasurements = [];
        this.personalRecords = [];
    }

    // ============================================
    // VOLUME & INTENSITÉ
    // ============================================
    
    calculateVolumeByMuscle(sessions) {
        const muscleVolume = {};
        
        sessions.forEach(session => {
            session.exercises?.forEach(exercise => {
                const muscle = exercise.primaryMuscle || 'unknown';
                const volume = exercise.sets * exercise.reps * exercise.weight;
                
                if (!muscleVolume[muscle]) {
                    muscleVolume[muscle] = { volume: 0, sets: 0, exercises: new Set() };
                }
                
                muscleVolume[muscle].volume += volume;
                muscleVolume[muscle].sets += exercise.sets;
                muscleVolume[muscle].exercises.add(exercise.name);
            });
        });
        
        // Ajouter seuil optimal (10-20 séries/semaine)
        Object.keys(muscleVolume).forEach(muscle => {
            const sets = muscleVolume[muscle].sets;
            muscleVolume[muscle].status = sets < 10 ? 'sous-optimal' : sets > 20 ? 'sur-optimal' : 'optimal';
            muscleVolume[muscle].setsPerWeek = sets;
        });
        
        return muscleVolume;
    }
    
    calculateIntensityDistribution(sessions) {
        const zones = {
            'force': 0,      // >85% 1RM
            'hypertrophie': 0, // 65-85% 1RM
            'endurance': 0   // <65% 1RM
        };
        
        sessions.forEach(session => {
            session.exercises?.forEach(exercise => {
                const estimated1RM = exercise.weight * (1 + exercise.reps / 30);
                const intensity = (exercise.weight / estimated1RM) * 100;
                
                if (intensity > 85) zones.force += exercise.sets;
                else if (intensity >= 65) zones.hypertrophie += exercise.sets;
                else zones.endurance += exercise.sets;
            });
        });
        
        return zones;
    }
    
    calculateTimeUnderTension(exercise) {
        // Format tempo: "3-1-2" = 3s eccentrique, 1s pause, 2s concentrique
        const tempo = exercise.tempo?.split('-').map(Number) || [3, 1, 2];
        const tutPerRep = tempo.reduce((a, b) => a + b, 0);
        return tutPerRep * exercise.reps * exercise.sets;
    }

    // ============================================
    // QUALITÉ ENTRAÎNEMENT
    // ============================================
    
    analyzeRIR(sessions) {
        const rirData = [];
        
        sessions.forEach(session => {
            session.exercises?.forEach(exercise => {
                const rir = exercise.rir || (10 - exercise.rpe);
                rirData.push({
                    exercise: exercise.name,
                    rir: rir,
                    date: session.date,
                    muscle: exercise.primaryMuscle
                });
            });
        });
        
        const avgRIR = rirData.reduce((sum, d) => sum + d.rir, 0) / rirData.length;
        
        return {
            average: avgRIR,
            distribution: rirData,
            quality: avgRIR < 2 ? 'proche échec' : avgRIR < 4 ? 'optimal' : 'trop facile'
        };
    }
    
    analyzeTempoDistribution(sessions) {
        const tempos = { controlled: 0, explosive: 0, standard: 0 };
        
        sessions.forEach(session => {
            session.exercises?.forEach(exercise => {
                const tempo = exercise.tempo || '3-1-2';
                const [ecc, pause, conc] = tempo.split('-').map(Number);
                
                if (ecc >= 3 && conc >= 2) tempos.controlled += exercise.sets;
                else if (ecc <= 1 || conc <= 1) tempos.explosive += exercise.sets;
                else tempos.standard += exercise.sets;
            });
        });
        
        return tempos;
    }
    
    analyzeExerciseVariation(sessions, weeks = 4) {
        const exercisesByMuscle = {};
        
        sessions.slice(-weeks * 3).forEach(session => {
            session.exercises?.forEach(exercise => {
                const muscle = exercise.primaryMuscle;
                if (!exercisesByMuscle[muscle]) exercisesByMuscle[muscle] = new Set();
                exercisesByMuscle[muscle].add(exercise.name);
            });
        });
        
        const variation = {};
        Object.keys(exercisesByMuscle).forEach(muscle => {
            variation[muscle] = exercisesByMuscle[muscle].size;
        });
        
        return variation;
    }

    // ============================================
    // RÉCUPÉRATION & CHARGE
    // ============================================
    
    calculateCumulativeFatigue(sessions) {
        let fatigue = 0;
        
        sessions.forEach(session => {
            session.exercises?.forEach(exercise => {
                const volume = exercise.sets * exercise.reps * exercise.weight;
                const intensity = exercise.rpe || 7;
                fatigue += (volume * intensity) / 1000;
            });
        });
        
        return {
            index: fatigue,
            level: fatigue < 50 ? 'faible' : fatigue < 100 ? 'modérée' : 'élevée',
            recommendation: fatigue > 100 ? 'Deload recommandé' : 'Continue'
        };
    }
    
    analyzeRestPeriods(sessions) {
        const restPeriods = [];
        
        sessions.forEach(session => {
            session.exercises?.forEach(exercise => {
                restPeriods.push(exercise.rest || 120);
            });
        });
        
        const avgRest = restPeriods.reduce((a, b) => a + b, 0) / restPeriods.length;
        
        return {
            average: avgRest,
            type: avgRest < 60 ? 'cardio' : avgRest > 180 ? 'force' : 'hypertrophie',
            distribution: restPeriods
        };
    }
    
    calculateProgressionStreak(sessions) {
        let streak = 0;
        const weeklyProgress = this.getWeeklyProgress(sessions);
        
        for (let i = weeklyProgress.length - 1; i >= 0; i--) {
            if (weeklyProgress[i].progressed) streak++;
            else break;
        }
        
        return streak;
    }

    // ============================================
    // LONG TERME
    // ============================================
    
    calculateForceHypertrophyRatio(sessions) {
        const early = sessions.slice(0, Math.floor(sessions.length / 3));
        const recent = sessions.slice(-Math.floor(sessions.length / 3));
        
        const earlyAvgWeight = this.getAverageWeight(early);
        const recentAvgWeight = this.getAverageWeight(recent);
        
        const earlyVolume = this.getTotalVolume(early);
        const recentVolume = this.getTotalVolume(recent);
        
        return {
            forceProgress: ((recentAvgWeight - earlyAvgWeight) / earlyAvgWeight * 100).toFixed(1),
            volumeProgress: ((recentVolume - earlyVolume) / earlyVolume * 100).toFixed(1)
        };
    }
    
    analyzeMuscleSYmmetry(sessions) {
        const unilateralExercises = sessions.flatMap(s => 
            s.exercises?.filter(e => e.isUnilateral) || []
        );
        
        const symmetry = {};
        
        unilateralExercises.forEach(exercise => {
            const muscle = exercise.primaryMuscle;
            if (!symmetry[muscle]) symmetry[muscle] = { left: 0, right: 0 };
            
            if (exercise.side === 'left') symmetry[muscle].left += exercise.volume;
            else if (exercise.side === 'right') symmetry[muscle].right += exercise.volume;
        });
        
        Object.keys(symmetry).forEach(muscle => {
            const diff = Math.abs(symmetry[muscle].left - symmetry[muscle].right);
            const total = symmetry[muscle].left + symmetry[muscle].right;
            symmetry[muscle].imbalance = ((diff / total) * 100).toFixed(1);
        });
        
        return symmetry;
    }
    
    analyzeByBlock(sessions, week) {
        const block = Math.floor((week - 1) / 6) + 1;
        const blockSessions = sessions.filter(s => {
            const sessionWeek = s.week || 1;
            return Math.floor((sessionWeek - 1) / 6) + 1 === block;
        });
        
        return {
            block: block,
            phase: ['Hypertrophie', 'Force', 'Puissance', 'Pic'][block - 1],
            volume: this.getTotalVolume(blockSessions),
            intensity: this.getAverageIntensity(blockSessions),
            sessions: blockSessions.length
        };
    }

    // ============================================
    // HELPERS
    // ============================================
    
    getWeeklyProgress(sessions) {
        // Grouper par semaine et détecter progression
        const weeks = {};
        sessions.forEach(s => {
            const week = s.week || 1;
            if (!weeks[week]) weeks[week] = [];
            weeks[week].push(s);
        });
        
        return Object.keys(weeks).map(week => ({
            week: parseInt(week),
            progressed: this.detectProgress(weeks[week])
        }));
    }
    
    detectProgress(sessions) {
        // Détecter si au moins un exercice a progressé
        return sessions.some(s => 
            s.exercises?.some(e => e.progressedFromLast)
        );
    }
    
    getAverageWeight(sessions) {
        const weights = sessions.flatMap(s => 
            s.exercises?.map(e => e.weight) || []
        );
        return weights.reduce((a, b) => a + b, 0) / weights.length;
    }
    
    getTotalVolume(sessions) {
        return sessions.reduce((total, session) => {
            return total + (session.exercises?.reduce((sum, e) => 
                sum + (e.sets * e.reps * e.weight), 0
            ) || 0);
        }, 0);
    }
    
    getAverageIntensity(sessions) {
        const intensities = sessions.flatMap(s => 
            s.exercises?.map(e => e.rpe || 7) || []
        );
        return intensities.reduce((a, b) => a + b, 0) / intensities.length;
    }
    
    // ============================================
    // MUSCLES TRAVAILLÉS PAR SEMAINE
    // ============================================
    
    getMusclesWorkedThisWeek(sessions, currentWeek) {
        const weekSessions = sessions.filter(s => s.week === currentWeek);
        const muscles = {
            primary: {},
            secondary: {}
        };
        
        weekSessions.forEach(session => {
            session.exercises?.forEach(exercise => {
                // Muscles primaires
                const primary = exercise.primaryMuscle;
                if (!muscles.primary[primary]) {
                    muscles.primary[primary] = { sets: 0, volume: 0, exercises: [] };
                }
                muscles.primary[primary].sets += exercise.sets;
                muscles.primary[primary].volume += exercise.sets * exercise.reps * exercise.weight;
                muscles.primary[primary].exercises.push(exercise.name);
                
                // Muscles secondaires
                exercise.secondaryMuscles?.forEach(secondary => {
                    if (!muscles.secondary[secondary]) {
                        muscles.secondary[secondary] = { sets: 0, volume: 0 };
                    }
                    muscles.secondary[secondary].sets += Math.floor(exercise.sets * 0.5);
                    muscles.secondary[secondary].volume += Math.floor(exercise.sets * exercise.reps * exercise.weight * 0.3);
                });
            });
        });
        
        return muscles;
    }
}

// Export
window.StatsEngine = StatsEngine;
