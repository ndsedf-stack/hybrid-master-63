// data-manager-ultra.js - GESTION DATA OPTIMISÉE

// ============================================
//  CONNEXION LOCALSTORAGE INTELLIGENT
// ============================================

export class DataManager {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 min
        this.listeners = new Map();
        this.initStorageListener();
    }
    
    // ============================================
    //  RÉCUPÉRATION SESSIONS
    // ============================================
    
    getCompletedSessions(period = 'all') {
        const cacheKey = `sessions_${period}`;
        
        // Check cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheExpiry) {
                return cached.data;
            }
        }
        
        // Fetch from storage
        const sessions = this.fetchSessions(period);
        
        // Update cache
        this.cache.set(cacheKey, {
            data: sessions,
            timestamp: Date.now()
        });
        
        return sessions;
    }
    
    fetchSessions(period) {
        try {
            const stored = localStorage.getItem('completedSessions');
            if (!stored) return [];
            
            const allSessions = JSON.parse(stored);
            
            if (period === 'all') return allSessions;
            
            const cutoffDate = this.getPeriodCutoff(period);
            return allSessions.filter(s => new Date(s.date) >= cutoffDate);
            
        } catch (error) {
            console.error('Error fetching sessions:', error);
            return [];
        }
    }
    
    getPeriodCutoff(period) {
        const now = new Date();
        const cutoff = new Date(now);
        
        switch(period) {
            case 'week':
                cutoff.setDate(now.getDate() - 7);
                break;
            case 'month':
                cutoff.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                cutoff.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                cutoff.setFullYear(now.getFullYear() - 1);
                break;
        }
        
        return cutoff;
    }
    
    // ============================================
    //  CALCULS STATS AVANCÉS
    // ============================================
    
    getMuscleGroupStats(period = 'month') {
        const sessions = this.getCompletedSessions(period);
        const muscleGroups = {};
        
        sessions.forEach(session => {
            if (!session.exercises) return;
            
            session.exercises.forEach(ex => {
                const muscle = ex.muscle || 'Autre';
                
                if (!muscleGroups[muscle]) {
                    muscleGroups[muscle] = {
                        totalSets: 0,
                        totalReps: 0,
                        totalVolume: 0,
                        exercises: new Set(),
                        sessions: 0
                    };
                }
                
                const sets = ex.sets || [];
                sets.forEach(set => {
                    muscleGroups[muscle].totalSets++;
                    muscleGroups[muscle].totalReps += set.reps || 0;
                    muscleGroups[muscle].totalVolume += (set.reps || 0) * (set.weight || 0);
                });
                
                muscleGroups[muscle].exercises.add(ex.name);
                muscleGroups[muscle].sessions++;
            });
        });
        
        // Convert to array with percentages
        const total = Object.values(muscleGroups).reduce((sum, g) => sum + g.totalVolume, 0);
        
        return Object.entries(muscleGroups).map(([name, data]) => ({
            name,
            ...data,
            exercises: Array.from(data.exercises),
            percentage: total > 0 ? (data.totalVolume / total) * 100 : 0
        }));
    }
    
    getProgressionData(period = 'month') {
        const sessions = this.getCompletedSessions(period);
        
        // Group by week
        const weeklyData = {};
        
        sessions.forEach(session => {
            const date = new Date(session.date);
            const weekKey = this.getWeekKey(date);
            
            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = {
                    totalVolume: 0,
                    totalSets: 0,
                    totalReps: 0,
                    sessions: 0,
                    date: date
                };
            }
            
            if (session.exercises) {
                session.exercises.forEach(ex => {
                    const sets = ex.sets || [];
                    sets.forEach(set => {
                        weeklyData[weekKey].totalSets++;
                        weeklyData[weekKey].totalReps += set.reps || 0;
                        weeklyData[weekKey].totalVolume += (set.reps || 0) * (set.weight || 0);
                    });
                });
            }
            
            weeklyData[weekKey].sessions++;
        });
        
        return Object.values(weeklyData).sort((a, b) => a.date - b.date);
    }
    
    getWeekKey(date) {
        const year = date.getFullYear();
        const week = this.getWeekNumber(date);
        return `${year}-W${week}`;
    }
    
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }
    
    getIntensityZones(period = 'month') {
        const sessions = this.getCompletedSessions(period);
        const zones = { Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0 };
        
        sessions.forEach(session => {
            if (!session.exercises) return;
            
            session.exercises.forEach(ex => {
                const sets = ex.sets || [];
                sets.forEach(set => {
                    const reps = set.reps || 0;
                    
                    // Classification par reps
                    if (reps >= 15) zones.Z1++;
                    else if (reps >= 12) zones.Z2++;
                    else if (reps >= 8) zones.Z3++;
                    else if (reps >= 5) zones.Z4++;
                    else zones.Z5++;
                });
            });
        });
        
        const total = Object.values(zones).reduce((sum, count) => sum + count, 0);
        
        return Object.entries(zones).map(([zone, count]) => ({
            zone,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0
        }));
    }
    
    getVolumeLoad(period = 'month') {
        const progression = this.getProgressionData(period);
        
        return progression.map(week => ({
            week: week.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
            volume: week.totalVolume,
            sets: week.totalSets,
            sessions: week.sessions
        }));
    }
    
    getGlobalScore(period = 'month') {
        const sessions = this.getCompletedSessions(period);
        
        let totalVolume = 0;
        let totalSets = 0;
        let totalSessions = sessions.length;
        let consistency = 0;
        
        sessions.forEach(session => {
            if (!session.exercises) return;
            
            session.exercises.forEach(ex => {
                const sets = ex.sets || [];
                sets.forEach(set => {
                    totalSets++;
                    totalVolume += (set.reps || 0) * (set.weight || 0);
                });
            });
        });
        
        // Calcul consistency (sessions régulières)
        if (sessions.length > 0) {
            const dates = sessions.map(s => new Date(s.date)).sort((a, b) => a - b);
            const intervals = [];
            
            for (let i = 1; i < dates.length; i++) {
                const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
                intervals.push(diff);
            }
            
            const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
            consistency = avgInterval <= 4 ? 100 : Math.max(0, 100 - (avgInterval - 4) * 10);
        }
        
        // Score global (0-100)
        const volumeScore = Math.min(100, (totalVolume / 50000) * 100);
        const frequencyScore = Math.min(100, (totalSessions / 12) * 100);
        
        return {
            score: Math.round((volumeScore * 0.4 + frequencyScore * 0.3 + consistency * 0.3)),
            volume: totalVolume,
            sets: totalSets,
            sessions: totalSessions,
            consistency: Math.round(consistency)
        };
    }
    
    // ============================================
    //  BADGES & ACHIEVEMENTS
    // ============================================
    
    getBadges(period = 'month') {
        const badges = [];
        const sessions = this.getCompletedSessions(period);
        const globalScore = this.getGlobalScore(period);
        
        // Record personnel
        if (globalScore.volume > this.getPersonalRecord()) {
            badges.push({ type: 'record', label: 'RECORD' });
        }
        
        // Consistency
        if (globalScore.consistency >= 90) {
            badges.push({ type: 'consistent', label: 'CONSISTENT' });
        }
        
        // High volume
        if (globalScore.volume >= 40000) {
            badges.push({ type: 'overload', label: 'OVERLOAD' });
        }
        
        // Streak
        const streak = this.calculateStreak(sessions);
        if (streak >= 7) {
            badges.push({ type: 'streak', label: `${streak}J STREAK` });
        }
        
        return badges;
    }
    
    getPersonalRecord() {
        const allTime = this.getGlobalScore('all');
        return allTime.volume;
    }
    
    calculateStreak(sessions) {
        if (sessions.length === 0) return 0;
        
        const dates = sessions.map(s => new Date(s.date).toDateString());
        const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
        
        let streak = 0;
        let currentDate = new Date();
        
        for (let date of uniqueDates) {
            const sessionDate = new Date(date);
            const diff = (currentDate - sessionDate) / (1000 * 60 * 60 * 24);
            
            if (diff <= streak + 1) {
                streak++;
                currentDate = sessionDate;
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    // ============================================
    //  LISTENERS & REACTIVITY
    // ============================================
    
    initStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'completedSessions') {
                this.clearCache();
                this.notifyListeners();
            }
        });
    }
    
    onChange(id, callback) {
        this.listeners.set(id, callback);
    }
    
    offChange(id) {
        this.listeners.delete(id);
    }
    
    notifyListeners() {
        this.listeners.forEach(callback => callback());
    }
    
    clearCache() {
        this.cache.clear();
    }
    
    // ============================================
    //  EXPORT DATA
    // ============================================
    
    exportData(period = 'all') {
        const sessions = this.getCompletedSessions(period);
        const stats = {
            period,
            exportDate: new Date().toISOString(),
            sessions: sessions.length,
            muscleGroups: this.getMuscleGroupStats(period),
            progression: this.getProgressionData(period),
            intensityZones: this.getIntensityZones(period),
            volumeLoad: this.getVolumeLoad(period),
            globalScore: this.getGlobalScore(period),
            badges: this.getBadges(period)
        };
        
        return stats;
    }
}

// ============================================
//  INSTANCE GLOBALE
// ============================================

const dataManager = new DataManager();

window.DataManager = dataManager;

export default dataManager;

    // ============================================
    //  MIGRATION WORKOUT_HISTORY → COMPLETED_SESSIONS
    // ============================================
    
    migrateWorkoutHistory() {
        try {
            const workoutHistory = localStorage.getItem('workout_history');
            const completedSessions = localStorage.getItem('completedSessions');
            
            // Si déjà migré, skip
            if (!workoutHistory || completedSessions) {
                console.log('✅ Données déjà migrées ou pas de workout_history');
                return;
            }
            
            const oldData = JSON.parse(workoutHistory);
            
            // Convertir au nouveau format
            const newData = oldData
                .filter(session => session.completed)
                .map(session => ({
                    date: session.date,
                    exercises: session.exercises || []
                }));
            
            // Sauvegarder dans le nouveau format
            localStorage.setItem('completedSessions', JSON.stringify(newData));
            
            console.log(`✅ Migration réussie: ${newData.length} sessions migrées`);
            
            // Optionnel: garder l'ancien en backup
            localStorage.setItem('workout_history_backup', workoutHistory);
            
        } catch (error) {
            console.error('❌ Erreur migration:', error);
        }
    }
    
    // Auto-migration au démarrage
    init() {
        this.migrateWorkoutHistory();
    }
}

// ============================================
//  INSTANCE GLOBALE
// ============================================

const dataManager = new DataManager();

// Auto-migration au démarrage
dataManager.init();

window.DataManager = dataManager;

export default dataManager;

