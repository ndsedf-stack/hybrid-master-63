// =============================================================================
// SESSION STORAGE - Module de sauvegarde des séances
// =============================================================================

export class WorkoutSessionManager {
    constructor() {
        this.sessionKey = 'current_workout_session';
        this.historyKey = 'workout_history';
        this.currentSession = this.loadSession() || this.createNewSession();
    }

    // =========================================================================
    // CRÉATION ET CHARGEMENT
    // =========================================================================

    createNewSession() {
        const session = {
            id: this.generateSessionId(),
            date: new Date().toISOString(),
            week: null,
            day: null,
            exercises: [],
            status: 'in_progress', // 'in_progress' | 'completed' | 'abandoned'
            startTime: Date.now(),
            endTime: null
        };
        
        this.saveSession(session);
        return session;
    }

    loadSession() {
        try {
            const data = localStorage.getItem(this.sessionKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Erreur chargement session:', error);
            return null;
        }
    }

    saveSession(session = this.currentSession) {
        try {
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            console.log('💾 Session sauvegardée:', {
                id: session.id,
                exercises: session.exercises.length,
                status: session.status
            });
        } catch (error) {
            console.error('❌ Erreur sauvegarde session:', error);
        }
    }

    // =========================================================================
    // INITIALISATION SÉANCE
    // =========================================================================

    startWorkout(weekNumber, dayName, exercises) {
        this.currentSession.week = weekNumber;
        this.currentSession.day = dayName;
        this.currentSession.plannedExercises = exercises.map(ex => ({
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            tempo: ex.tempo,
            rest: ex.rest
        }));
        
        this.saveSession();
        
        console.log('🏋️ Séance démarrée:', {
            week: weekNumber,
            day: dayName,
            exercises: exercises.length
        });
    }

    // =========================================================================
    // SAUVEGARDE SÉRIE
    // =========================================================================

    saveSet(exerciseName, setData) {
        // Trouver ou créer l'exercice dans la session
        let exercise = this.currentSession.exercises.find(ex => ex.name === exerciseName);
        
        if (!exercise) {
            exercise = {
                name: exerciseName,
                sets: []
            };
            this.currentSession.exercises.push(exercise);
        }

        // Ajouter la série
        const setRecord = {
            set_number: setData.set_number,
            reps_completed: setData.reps_completed,
            reps_planned: setData.reps_planned,
            tempo_respected_count: setData.tempo_respected_count,
            tempo_respected_detail: setData.tempo_respected_detail,
            time_under_tension: setData.time_under_tension,
            rest_time: setData.rest_time,
            timestamp: setData.timestamp || new Date().toISOString()
        };

        exercise.sets.push(setRecord);
        this.saveSession();

        console.log('✅ Série sauvegardée:', {
            exercise: exerciseName,
            set: setData.set_number,
            reps: `${setData.reps_completed}/${setData.reps_planned}`,
            tempo_ok: `${setData.tempo_respected_count}/${setData.reps_completed}`
        });

        return setRecord;
    }

    // =========================================================================
    // FIN DE SÉANCE
    // =========================================================================

    completeWorkout() {
        this.currentSession.status = 'completed';
        this.currentSession.endTime = Date.now();
        this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
        
        this.saveSession();
        this.archiveSession();

        console.log('🎉 Séance terminée:', {
            duration: this.formatDuration(this.currentSession.duration),
            exercises: this.currentSession.exercises.length,
            totalSets: this.getTotalSets()
        });
    }

    abandonWorkout() {
        this.currentSession.status = 'abandoned';
        this.currentSession.endTime = Date.now();
        this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
        
        this.saveSession();
        this.archiveSession();

        console.log('⚠️ Séance abandonnée');
    }

    // =========================================================================
    // ARCHIVAGE
    // =========================================================================

    archiveSession() {
        try {
            // Charger l'historique
            const history = this.loadHistory();
            
            // Ajouter la session actuelle
            history.push(this.currentSession);
            
            // Garder seulement les 30 dernières séances
            if (history.length > 30) {
                history.shift();
            }
            
            // Sauvegarder
            localStorage.setItem(this.historyKey, JSON.stringify(history));
            
            // Supprimer la session actuelle
            localStorage.removeItem(this.sessionKey);
            
            console.log('📦 Session archivée:', {
                id: this.currentSession.id,
                historySize: history.length
            });
            
        } catch (error) {
            console.error('❌ Erreur archivage:', error);
        }
    }

    loadHistory() {
        try {
            const data = localStorage.getItem(this.historyKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Erreur chargement historique:', error);
            return [];
        }
    }

    // =========================================================================
    // STATISTIQUES
    // =========================================================================

    getSessionStats() {
        const totalSets = this.getTotalSets();
        const totalReps = this.getTotalReps();
        const avgTempoRespect = this.getAvgTempoRespect();
        const timeUnderTension = this.getTotalTimeUnderTension();

        return {
            exercises: this.currentSession.exercises.length,
            totalSets,
            totalReps,
            avgTempoRespect,
            timeUnderTension,
            duration: Date.now() - this.currentSession.startTime
        };
    }

    getTotalSets() {
        return this.currentSession.exercises.reduce((total, ex) => {
            return total + ex.sets.length;
        }, 0);
    }

    getTotalReps() {
        return this.currentSession.exercises.reduce((total, ex) => {
            return total + ex.sets.reduce((sum, set) => sum + set.reps_completed, 0);
        }, 0);
    }

    getAvgTempoRespect() {
        let totalReps = 0;
        let tempoRespected = 0;

        this.currentSession.exercises.forEach(ex => {
            ex.sets.forEach(set => {
                totalReps += set.reps_completed;
                tempoRespected += set.tempo_respected_count;
            });
        });

        return totalReps > 0 ? Math.round((tempoRespected / totalReps) * 100) : 0;
    }

    getTotalTimeUnderTension() {
        return this.currentSession.exercises.reduce((total, ex) => {
            return total + ex.sets.reduce((sum, set) => sum + (set.time_under_tension || 0), 0);
        }, 0);
    }

    // =========================================================================
    // UTILITAIRES
    // =========================================================================

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // =========================================================================
    // RESET
    // =========================================================================

    clearSession() {
        localStorage.removeItem(this.sessionKey);
        this.currentSession = this.createNewSession();
        console.log('🗑️ Session effacée');
    }

    clearHistory() {
        localStorage.removeItem(this.historyKey);
        console.log('🗑️ Historique effacé');
    }

    clearAll() {
        this.clearSession();
        this.clearHistory();
        console.log('🗑️ Toutes les données effacées');
    }
}
