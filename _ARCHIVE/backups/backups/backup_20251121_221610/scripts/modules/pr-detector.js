// ============================================
// PR DETECTOR - Détection automatique records
// ============================================

class PRDetector {
    constructor() {
        this.records = this.loadRecords();
    }
    
    loadRecords() {
        try {
            const data = localStorage.getItem('personalRecords');
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    }
    
    checkForPR(exercise, weight, reps) {
        const key = exercise.toLowerCase().replace(/\s+/g, '_');
        const estimated1RM = weight * (1 + reps / 30);
        
        if (!this.records[key] || estimated1RM > this.records[key].estimated1RM) {
            const oldRecord = this.records[key];
            
            this.records[key] = {
                exercise: exercise,
                weight: weight,
                reps: reps,
                estimated1RM: estimated1RM,
                date: new Date().toISOString()
            };
            
            this.saveRecords();
            
            return {
                isPR: true,
                exercise: exercise,
                newWeight: weight,
                oldWeight: oldRecord?.weight || 0,
                improvement: oldRecord ? ((weight - oldRecord.weight) / oldRecord.weight * 100).toFixed(1) : 100
            };
        }
        
        return { isPR: false };
    }
    
    getAllRecords() {
        return Object.values(this.records).sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
    }
    
    saveRecords() {
        localStorage.setItem('personalRecords', JSON.stringify(this.records));
    }
}

window.PRDetector = PRDetector;
