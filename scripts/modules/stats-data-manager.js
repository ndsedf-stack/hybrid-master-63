// stats-data-manager.js - GESTION AUTOMATIQUE DES DONNÉES

/**
 * MAPPING EXERCICES → MUSCLES
 * Définit les muscles primaires et secondaires pour chaque exercice
 */
const EXERCISE_MUSCLE_MAP = {
    // DOS
    'Trap Bar Deadlift': { primary: ['DOS', 'JAMBES'], secondary: ['FESSIERS', 'TRAPÈZES'] },
    'Landmine Row': { primary: ['DOS'], secondary: ['BICEPS', 'AVANT-BRAS'] },
    'Rowing Machine (prise large)': { primary: ['DOS'], secondary: ['BICEPS'] },
    'Rowing Machine (prise serrée)': { primary: ['DOS'], secondary: ['BICEPS'] },
    'Lat Pulldown (prise large)': { primary: ['DOS'], secondary: ['BICEPS'] },
    
    // PECS
    'Dumbbell Press': { primary: ['PECS'], secondary: ['TRICEPS', 'ÉPAULES'] },
    'Landmine Press': { primary: ['PECS'], secondary: ['ÉPAULES', 'TRICEPS'] },
    'Cable Fly (poulies moyennes)': { primary: ['PECS'], secondary: [] },
    'Cable Fly': { primary: ['PECS'], secondary: [] },
    'Dumbbell Fly': { primary: ['PECS'], secondary: [] },
    
    // JAMBES
    'Goblet Squat': { primary: ['QUADRICEPS'], secondary: ['FESSIERS'] },
    'Leg Press': { primary: ['QUADRICEPS'], secondary: ['FESSIERS'] },
    'Leg Press léger': { primary: ['QUADRICEPS'], secondary: ['FESSIERS'] },
    'Leg Curl': { primary: ['ISCHIOS'], secondary: [] },
    'Leg Extension': { primary: ['QUADRICEPS'], secondary: [] },
    
    // ÉPAULES
    'Lateral Raises': { primary: ['ÉPAULES'], secondary: [] },
    'Face Pull': { primary: ['ÉPAULES'], secondary: ['DOS'] },
    
    // BICEPS
    'Incline Curl': { primary: ['BICEPS'], secondary: [] },
    'Spider Curl': { primary: ['BICEPS'], secondary: [] },
    'EZ Bar Curl': { primary: ['BICEPS'], secondary: ['AVANT-BRAS'] },
    'Hammer Curl': { primary: ['BICEPS'], secondary: ['AVANT-BRAS'] },
    
    // TRICEPS
    'Cable Pushdown': { primary: ['TRICEPS'], secondary: [] },
    'Extension Triceps Corde': { primary: ['TRICEPS'], secondary: [] },
    'Overhead Extension (corde, assis)': { primary: ['TRICEPS'], secondary: [] },
    'Overhead Extension': { primary: ['TRICEPS'], secondary: [] },
    
    // AVANT-BRAS
    'Wrist Curl': { primary: ['AVANT-BRAS'], secondary: [] }
};

/**
 * CLASSE PRINCIPALE - GESTIONNAIRE DE DONNÉES
 */
export class StatsDataManager {
    constructor() {
        this.sessions = [];
        this.loadSessions();
    }

    /**
     * Charge les sessions depuis localStorage
     */
    loadSessions() {
        try {
            const stored = localStorage.getItem('completedSessions');
            this.sessions = stored ? JSON.parse(stored) : [];
            console.log(`📊 ${this.sessions.length} sessions chargées`);
        } catch (error) {
            console.error('❌ Erreur chargement sessions:', error);
            this.sessions = [];
        }
    }

    /**
     * Filtre les sessions selon une période
     */
    getSessionsInPeriod(days = 28) {
        const now = new Date();
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        
        return this.sessions.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate >= cutoff;
        });
    }

    /**
     * MUSCLES : Calcule volume, intensité, fatigue par muscle
     */
    getMuscleData(options = {}) {
        const {
            period = 28, // jours
            topN = 6,     // nombre de muscles à retourner
            includeSecondary = true
        } = options;

        const recentSessions = this.getSessionsInPeriod(period);
        
        if (recentSessions.length === 0) {
            console.warn('⚠️ Aucune session - utilisation données démo');
            return this._getDemoMuscleData();
        }

        // Accumulation des données par muscle
        const muscleData = {
            'PECS': { volume: 0, sets: 0, intensity: 0, count: 0 },
            'DOS': { volume: 0, sets: 0, intensity: 0, count: 0 },
            'JAMBES': { volume: 0, sets: 0, intensity: 0, count: 0 },
            'QUADRICEPS': { volume: 0, sets: 0, intensity: 0, count: 0 },
            'ISCHIOS': { volume: 0, sets: 0, intensity: 0, count: 0 },
            'FESSIERS': { volume: 0, sets: 0, intensity: 0, count: 0 },
            'ÉPAULES': { volume: 0, sets: 0, intensity: 0, count: 0 },
            'BICEPS': { volume: 0, sets: 0, intensity: 0, count: 0 },
            'TRICEPS': { volume: 0, sets: 0, intensity: 0, count: 0 },
            'TRAPÈZES': { volume: 0, sets: 0, intensity: 0, count: 0 },
            'AVANT-BRAS': { volume: 0, sets: 0, intensity: 0, count: 0 }
        };

        recentSessions.forEach(session => {
            if (!session.exercises || !Array.isArray(session.exercises)) return;

            session.exercises.forEach(exercise => {
                const mapping = EXERCISE_MUSCLE_MAP[exercise.name];
                if (!mapping) {
                    console.warn(`⚠️ Exercice non mappé: ${exercise.name}`);
                    return;
                }

                if (!exercise.sets || !Array.isArray(exercise.sets)) return;

                exercise.sets.forEach(set => {
                    const weight = parseFloat(set.weight) || 0;
                    const reps = parseInt(set.reps) || 0;
                    const rm = parseFloat(set.rm) || 0;
                    const volume = weight * reps;

                    // Muscles primaires (100% contribution)
                    mapping.primary.forEach(muscle => {
                        if (muscleData[muscle]) {
                            muscleData[muscle].volume += volume;
                            muscleData[muscle].sets += 1;
                            if (rm > 0) {
                                const intensity = (weight / rm) * 100;
                                muscleData[muscle].intensity += intensity;
                                muscleData[muscle].count += 1;
                            }
                        }
                    });

                    // Muscles secondaires (50% contribution)
                    if (includeSecondary) {
                        mapping.secondary.forEach(muscle => {
                            if (muscleData[muscle]) {
                                muscleData[muscle].volume += volume * 0.5;
                                muscleData[muscle].sets += 0.5;
                                if (rm > 0) {
                                    const intensity = (weight / rm) * 100 * 0.5;
                                    muscleData[muscle].intensity += intensity;
                                    muscleData[muscle].count += 0.5;
                                }
                            }
                        });
                    }
                });
            });
        });

        // Formater les résultats
        const muscles = [];
        Object.keys(muscleData).forEach(muscleName => {
            const data = muscleData[muscleName];
            
            if (data.volume > 0) {
                const avgIntensity = data.count > 0 ? data.intensity / data.count : 0;
                const fatigue = Math.min(100, (data.sets / 20) * 100);
                const activation = Math.min(100, avgIntensity * 0.8 + 20);
                const recovery = Math.max(0, 100 - fatigue);
                const avgVolume = data.volume / (recentSessions.length || 1);
                const isPR = avgVolume > 1500;
                
                muscles.push({
                    name: muscleName,
                    volume: Math.round(data.volume),
                    sets: Math.round(data.sets),
                    intensity: Math.round(avgIntensity),
                    fatigue: Math.round(fatigue),
                    activation: Math.round(activation),
                    recovery: Math.round(recovery),
                    rpe: (avgIntensity / 10).toFixed(1),
                    isPR: isPR,
                    color: this._getMuscleColor(muscleName)
                });
            }
        });

        // Trier par volume et prendre le top N
        muscles.sort((a, b) => b.volume - a.volume);
        const topMuscles = muscles.slice(0, topN);
        
        // Normaliser les valeurs pour le radar
        const maxVolume = Math.max(...topMuscles.map(m => m.volume));
        topMuscles.forEach(muscle => {
            muscle.normalized = muscle.volume / maxVolume;
        });

        return {
            muscles: topMuscles,
            total: muscles,
            period: period,
            sessionCount: recentSessions.length
        };
    }

    /**
     * PROGRESSION HEBDOMADAIRE : Volume par semaine
     */
    getWeeklyProgress(options = {}) {
        const { weeks = 4 } = options;

        const recentSessions = this.getSessionsInPeriod(weeks * 7);
        
        if (recentSessions.length === 0) {
            return this._getDemoWeeklyData(weeks);
        }

        const now = new Date();
        const weeklyData = {};

        recentSessions.forEach(session => {
            const sessionDate = new Date(session.date);
            const weekNumber = Math.floor((now - sessionDate) / (7 * 24 * 60 * 60 * 1000));
            const weekKey = weeks - Math.min(weekNumber, weeks - 1);
            
            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = { volume: 0, sets: 0, intensity: 0, count: 0 };
            }

            if (session.exercises && Array.isArray(session.exercises)) {
                session.exercises.forEach(exercise => {
                    if (exercise.sets && Array.isArray(exercise.sets)) {
                        exercise.sets.forEach(set => {
                            const weight = parseFloat(set.weight) || 0;
                            const reps = parseInt(set.reps) || 0;
                            const rm = parseFloat(set.rm) || 0;
                            
                            weeklyData[weekKey].volume += weight * reps;
                            weeklyData[weekKey].sets += 1;
                            
                            if (rm > 0) {
                                weeklyData[weekKey].intensity += (weight / rm) * 100;
                                weeklyData[weekKey].count += 1;
                            }
                        });
                    }
                });
            }
        });

        // Formater
        const result = [];
        for (let i = 1; i <= weeks; i++) {
            const data = weeklyData[i] || { volume: 0, sets: 0, intensity: 0, count: 0 };
            const avgIntensity = data.count > 0 ? data.intensity / data.count : 0;
            
            result.push({
                week: i,
                volume: Math.round(data.volume),
                sets: Math.round(data.sets),
                intensity: Math.round(avgIntensity),
                label: `S${i}`
            });
        }

        return result;
    }

    /**
     * SCORE GLOBAL : Calcul d'un score sur 100
     */
    getGlobalScore() {
        const recentSessions = this.getSessionsInPeriod(7);
        
        if (recentSessions.length === 0) {
            return {
                score: 0,
                breakdown: {
                    consistency: 0,
                    volume: 0,
                    intensity: 0,
                    recovery: 0
                }
            };
        }

        // Consistance (nombre de séances / 5 * 25)
        const consistency = Math.min(25, (recentSessions.length / 5) * 25);
        
        // Volume (basé sur le volume total)
        let totalVolume = 0;
        let totalSets = 0;
        let totalIntensity = 0;
        let intensityCount = 0;

        recentSessions.forEach(session => {
            if (session.exercises && Array.isArray(session.exercises)) {
                session.exercises.forEach(exercise => {
                    if (exercise.sets && Array.isArray(exercise.sets)) {
                        exercise.sets.forEach(set => {
                            const weight = parseFloat(set.weight) || 0;
                            const reps = parseInt(set.reps) || 0;
                            const rm = parseFloat(set.rm) || 0;
                            
                            totalVolume += weight * reps;
                            totalSets += 1;
                            
                            if (rm > 0) {
                                totalIntensity += (weight / rm) * 100;
                                intensityCount += 1;
                            }
                        });
                    }
                });
            }
        });

        const volume = Math.min(25, (totalVolume / 100000) * 25);
        const intensity = intensityCount > 0 ? Math.min(25, (totalIntensity / intensityCount / 100) * 25) : 0;
        
        // Recovery (basé sur l'équilibre des séances)
        const recovery = Math.min(25, (7 - Math.abs(recentSessions.length - 3)) / 7 * 25);

        const score = Math.round(consistency + volume + intensity + recovery);

        return {
            score: score,
            breakdown: {
                consistency: Math.round(consistency),
                volume: Math.round(volume),
                intensity: Math.round(intensity),
                recovery: Math.round(recovery)
            },
            sessions: recentSessions.length,
            totalVolume: Math.round(totalVolume),
            totalSets: totalSets
        };
    }

    /**
     * INTENSITÉ PAR ZONES : Répartition des sets par zone d'intensité
     */
    getIntensityZones() {
        const recentSessions = this.getSessionsInPeriod(28);
        
        if (recentSessions.length === 0) {
            return {
                zones: [
                    { name: 'Légère (<60%)', value: 0, color: '#22c55e' },
                    { name: 'Modérée (60-75%)', value: 0, color: '#eab308' },
                    { name: 'Intense (75-85%)', value: 0, color: '#f97316' },
                    { name: 'Maximale (>85%)', value: 0, color: '#ef4444' }
                ],
                total: 0
            };
        }

        const zones = {
            light: 0,    // < 60%
            moderate: 0, // 60-75%
            intense: 0,  // 75-85%
            maximal: 0   // > 85%
        };

        recentSessions.forEach(session => {
            if (session.exercises && Array.isArray(session.exercises)) {
                session.exercises.forEach(exercise => {
                    if (exercise.sets && Array.isArray(exercise.sets)) {
                        exercise.sets.forEach(set => {
                            const weight = parseFloat(set.weight) || 0;
                            const rm = parseFloat(set.rm) || 0;
                            
                            if (rm > 0 && weight > 0) {
                                const intensity = (weight / rm) * 100;
                                
                                if (intensity < 60) zones.light++;
                                else if (intensity < 75) zones.moderate++;
                                else if (intensity < 85) zones.intense++;
                                else zones.maximal++;
                            }
                        });
                    }
                });
            }
        });

        const total = zones.light + zones.moderate + zones.intense + zones.maximal;

        return {
            zones: [
                { 
                    name: 'Légère (<60%)', 
                    value: zones.light, 
                    percent: total > 0 ? Math.round((zones.light / total) * 100) : 0,
                    color: '#22c55e' 
                },
                { 
                    name: 'Modérée (60-75%)', 
                    value: zones.moderate,
                    percent: total > 0 ? Math.round((zones.moderate / total) * 100) : 0,
                    color: '#eab308' 
                },
                { 
                    name: 'Intense (75-85%)', 
                    value: zones.intense,
                    percent: total > 0 ? Math.round((zones.intense / total) * 100) : 0,
                    color: '#f97316' 
                },
                { 
                    name: 'Maximale (>85%)', 
                    value: zones.maximal,
                    percent: total > 0 ? Math.round((zones.maximal / total) * 100) : 0,
                    color: '#ef4444' 
                }
            ],
            total: total
        };
    }

    /**
     * Couleur par muscle
     */
    _getMuscleColor(muscleName) {
        const colors = {
            'PECS': '#06b6d4',
            'DOS': '#22d3ee',
            'JAMBES': '#0ea5e9',
            'QUADRICEPS': '#0284c7',
            'ISCHIOS': '#0369a1',
            'FESSIERS': '#075985',
            'ÉPAULES': '#fb923c',
            'BICEPS': '#f97316',
            'TRICEPS': '#ea580c',
            'TRAPÈZES': '#c2410c',
            'AVANT-BRAS': '#9a3412'
        };
        return colors[muscleName] || '#06b6d4';
    }

    /**
     * Données de démo pour muscles
     */
    _getDemoMuscleData() {
        return {
            muscles: [
                { name: 'PECS', volume: 2230, sets: 16, intensity: 75, fatigue: 70, activation: 85, recovery: 30, rpe: 7.5, isPR: false, normalized: 1, color: '#06b6d4' },
                { name: 'DOS', volume: 2156, sets: 18, intensity: 72, fatigue: 75, activation: 82, recovery: 25, rpe: 7.2, isPR: true, normalized: 0.97, color: '#22d3ee' },
                { name: 'JAMBES', volume: 2336, sets: 14, intensity: 80, fatigue: 65, activation: 88, recovery: 35, rpe: 8.0, isPR: false, normalized: 1.05, color: '#0ea5e9' },
                { name: 'ÉPAULES', volume: 2347, sets: 16, intensity: 78, fatigue: 70, activation: 86, recovery: 30, rpe: 7.8, isPR: true, normalized: 1.05, color: '#fb923c' },
                { name: 'BICEPS', volume: 2989, sets: 18, intensity: 75, fatigue: 75, activation: 85, recovery: 25, rpe: 7.5, isPR: false, normalized: 1.34, color: '#f97316' },
                { name: 'TRICEPS', volume: 1847, sets: 14, intensity: 72, fatigue: 65, activation: 82, recovery: 35, rpe: 7.2, isPR: false, normalized: 0.83, color: '#ea580c' }
            ],
            total: [],
            period: 28,
            sessionCount: 12
        };
    }

    /**
     * Données de démo pour progression hebdomadaire
     */
    _getDemoWeeklyData(weeks) {
        const demo = [
            { week: 1, volume: 28000, sets: 156, intensity: 75, label: 'S1' },
            { week: 2, volume: 29500, sets: 164, intensity: 78, label: 'S2' },
            { week: 3, volume: 27800, sets: 152, intensity: 72, label: 'S3' },
            { week: 4, volume: 31200, sets: 172, intensity: 80, label: 'S4' }
        ];
        return demo.slice(0, weeks);
    }
}

/**
 * HELPERS - Fonctions rapides
 */

// Instance singleton
let dataManager = null;

function getDataManager() {
    if (!dataManager) {
        dataManager = new StatsDataManager();
    }
    return dataManager;
}

export function getMuscleData(options) {
    return getDataManager().getMuscleData(options);
}

export function getWeeklyProgress(options) {
    return getDataManager().getWeeklyProgress(options);
}

export function getGlobalScore() {
    return getDataManager().getGlobalScore();
}

export function getIntensityZones() {
    return getDataManager().getIntensityZones();
}

export function reloadData() {
    dataManager = new StatsDataManager();
    return dataManager;
}
