/**
 * SUPERSET TRACKER MODULE
 * Track and analyze supersets performance
 */

class SupersetTracker {
    constructor() {
        this.supersets = this.loadSupersets();
    }

    /**
     * Détecter les supersets dans une séance
     */
    detectSupersets(workout) {
        const supersets = [];
        const exercises = workout.exercises || [];
        
        for (let i = 0; i < exercises.length - 1; i++) {
            if (exercises[i].isSuperset && exercises[i + 1]) {
                supersets.push({
                    exercise1: exercises[i].name,
                    exercise2: exercises[i + 1].name,
                    sets: exercises[i].sets,
                    date: new Date().toISOString()
                });
                i++; // Skip next exercise
            }
        }
        
        return supersets;
    }

    /**
     * Sauvegarder un superset effectué
     */
    logSuperset(superset) {
        this.supersets.push({
            ...superset,
            timestamp: Date.now()
        });
        this.saveSupersets();
    }

    /**
     * Obtenir les stats des supersets
     */
    getStats(period = 'week') {
        const now = Date.now();
        const periodMs = {
            'week': 7 * 24 * 60 * 60 * 1000,
            'month': 30 * 24 * 60 * 60 * 1000,
            'all': Infinity
        };

        const filtered = this.supersets.filter(ss => 
            (now - ss.timestamp) <= periodMs[period]
        );

        return {
            total: filtered.length,
            totalSets: filtered.reduce((sum, ss) => sum + ss.sets, 0),
            mostCommon: this.getMostCommonSuperset(filtered),
            byWeek: this.groupByWeek(filtered)
        };
    }

    /**
     * Superset le plus fréquent
     */
    getMostCommonSuperset(supersets) {
        const counts = {};
        
        supersets.forEach(ss => {
            const key = `${ss.exercise1}+${ss.exercise2}`;
            counts[key] = (counts[key] || 0) + 1;
        });

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        
        if (sorted.length === 0) return null;
        
        const [combo, count] = sorted[0];
        const [ex1, ex2] = combo.split('+');
        
        return { exercise1: ex1, exercise2: ex2, count };
    }

    /**
     * Grouper par semaine pour graphique
     */
    groupByWeek(supersets) {
        const weeks = {};
        
        supersets.forEach(ss => {
            const week = this.getWeekNumber(new Date(ss.timestamp));
            weeks[week] = (weeks[week] || 0) + 1;
        });

        return Object.entries(weeks)
            .map(([week, count]) => ({ week: parseInt(week), count }))
            .sort((a, b) => a.week - b.week);
    }

    /**
     * Obtenir le numéro de semaine
     */
    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    /**
     * Charger depuis localStorage
     */
    loadSupersets() {
        try {
            const data = localStorage.getItem('hybrid_supersets');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading supersets:', e);
            return [];
        }
    }

    /**
     * Sauvegarder dans localStorage
     */
    saveSupersets() {
        try {
            localStorage.setItem('hybrid_supersets', JSON.stringify(this.supersets));
        } catch (e) {
            console.error('Error saving supersets:', e);
        }
    }
}

// Exposer globalement
window.SupersetTracker = SupersetTracker;

console.log('✅ SupersetTracker module loaded');
