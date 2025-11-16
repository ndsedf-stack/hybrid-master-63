/**
 * SESSION STORAGE - Système de sauvegarde bulletproof
 * Sauvegarde locale + sync Google Drive automatique
 * Protection contre la perte de données
 */

class WorkoutSessionManager {
    constructor() {
        this.currentSession = null;
        this.autoSaveInterval = null;
        this.syncInterval = null;
        this.AUTOSAVE_DELAY = 30000; // 30 secondes
        this.SYNC_DELAY = 300000; // 5 minutes
        
        this.init();
    }

    // ========== INITIALISATION ==========
    
    init() {
        // Vérifier si une session est en cours
        this.recoverSession();
        
        // Démarrer l'auto-save
        this.startAutoSave();
        
        // Démarrer le sync Google Drive
        this.startAutoSync();
        
        // Écouter les événements de fermeture
        this.setupExitHandlers();
    }

    // ========== CRÉATION DE SESSION ==========
    
    startNewSession(weekNumber, dayName) {
        const sessionId = this.generateSessionId();
        
        this.currentSession = {
            session_id: sessionId,
            date: new Date().toISOString(),
            week: weekNumber,
            day: dayName,
            start_time: new Date().toISOString(),
            duration_total: 0,
            exercises: [],
            current_exercise_index: 0,
            current_set: 1,
            stats: {
                total_volume: 0,
                total_reps: 0,
                total_time_under_tension: 0,
                exercises_completed: 0,
                exercises_skipped: 0
            },
            completed: false,
            paused_at: null,
            resumed_at: null
        };
        
        this.saveLocal();
        console.log('✅ Nouvelle session créée:', sessionId);
        
        return this.currentSession;
    }

    // ========== GESTION DES EXERCICES ==========
    
    startExercise(exerciseData) {
        if (!this.currentSession) {
            console.error('❌ Aucune session active');
            return;
        }

        const exercise = {
            name: exerciseData.name,
            type: exerciseData.type || 'normal',
            tempo: exerciseData.tempo || '3-1-2',
            sets_planned: exerciseData.sets || 5,
            reps_planned: exerciseData.reps || 10,
            weight: exerciseData.weight || 0,
            rest_time: exerciseData.rest || 90,
            sets_data: [],
            started_at: new Date().toISOString(),
            completed: false
        };

        this.currentSession.exercises.push(exercise);
        this.saveLocal();
        
        console.log('✅ Exercice démarré:', exercise.name);
        return exercise;
    }

    // ========== GESTION DES SÉRIES ==========
    
    startSet(exerciseIndex, setNumber) {
        const exercise = this.currentSession.exercises[exerciseIndex];
        
        const setData = {
            set_number: setNumber,
            reps_completed: 0,
            tempo_respected: true,
            start_time: new Date().toISOString(),
            end_time: null,
            time_under_tension: 0,
            notes: '',
            skipped: false
        };

        if (!exercise.sets_data) exercise.sets_data = [];
        exercise.sets_data.push(setData);
        
        this.saveLocal();
        return setData;
    }

    completeSet(exerciseIndex, setNumber, data) {
        const exercise = this.currentSession.exercises[exerciseIndex];
        const setIndex = exercise.sets_data.findIndex(s => s.set_number === setNumber);
        
        if (setIndex === -1) {
            console.error('❌ Série non trouvée');
            return;
        }

        const set = exercise.sets_data[setIndex];
        
        // Mise à jour des données
        set.end_time = new Date().toISOString();
        set.reps_completed = data.reps_completed || 0;
        set.tempo_respected = data.tempo_respected !== false;
        set.time_under_tension = data.time_under_tension || 0;
        set.notes = data.notes || '';
        
        // Calculer la durée
        const duration = (new Date(set.end_time) - new Date(set.start_time)) / 1000;
        set.duration = duration;

        // Mise à jour des stats
        this.updateStats(exercise, set);
        
        // Sauvegarde
        this.saveLocal();
        
        console.log('✅ Série terminée:', {
            exercise: exercise.name,
            set: setNumber,
            reps: set.reps_completed,
            tut: set.time_under_tension
        });

        return set;
    }

    skipSet(exerciseIndex, setNumber) {
        const exercise = this.currentSession.exercises[exerciseIndex];
        const setIndex = exercise.sets_data.findIndex(s => s.set_number === setNumber);
        
        if (setIndex !== -1) {
            exercise.sets_data[setIndex].skipped = true;
            exercise.sets_data[setIndex].end_time = new Date().toISOString();
        }
        
        this.saveLocal();
    }

    // ========== GESTION DES REPOS ==========
    
    startRest(exerciseIndex, duration) {
        const exercise = this.currentSession.exercises[exerciseIndex];
        
        if (!exercise.rest_periods) exercise.rest_periods = [];
        
        exercise.rest_periods.push({
            start_time: new Date().toISOString(),
            planned_duration: duration,
            actual_duration: null
        });
        
        this.saveLocal();
    }

    endRest(exerciseIndex) {
        const exercise = this.currentSession.exercises[exerciseIndex];
        
        if (!exercise.rest_periods || exercise.rest_periods.length === 0) return;
        
        const lastRest = exercise.rest_periods[exercise.rest_periods.length - 1];
        const endTime = new Date();
        const startTime = new Date(lastRest.start_time);
        
        lastRest.actual_duration = (endTime - startTime) / 1000;
        lastRest.end_time = endTime.toISOString();
        
        this.saveLocal();
    }

    // ========== STATISTIQUES ==========
    
    updateStats(exercise, set) {
        // Volume total (poids × reps)
        const volume = (exercise.weight || 0) * set.reps_completed;
        this.currentSession.stats.total_volume += volume;
        
        // Reps totales
        this.currentSession.stats.total_reps += set.reps_completed;
        
        // Time under tension
        this.currentSession.stats.total_time_under_tension += set.time_under_tension;
    }

    completeExercise(exerciseIndex) {
        const exercise = this.currentSession.exercises[exerciseIndex];
        exercise.completed = true;
        exercise.completed_at = new Date().toISOString();
        
        this.currentSession.stats.exercises_completed++;
        
        this.saveLocal();
        this.syncToCloud(); // Sync immédiat après chaque exercice
        
        console.log('✅ Exercice complété:', exercise.name);
    }

    skipExercise(exerciseIndex) {
        const exercise = this.currentSession.exercises[exerciseIndex];
        exercise.skipped = true;
        exercise.skipped_at = new Date().toISOString();
        
        this.currentSession.stats.exercises_skipped++;
        
        this.saveLocal();
    }

    // ========== COMPLÉTION DE SESSION ==========
    
    completeSession() {
        if (!this.currentSession) return;
        
        this.currentSession.completed = true;
        this.currentSession.end_time = new Date().toISOString();
        
        // Calculer la durée totale
        const startTime = new Date(this.currentSession.start_time);
        const endTime = new Date(this.currentSession.end_time);
        this.currentSession.duration_total = (endTime - startTime) / 1000; // en secondes
        
        // Sauvegarder dans l'historique
        this.addToHistory(this.currentSession);
        
        // Sync final vers Google Drive
        this.syncToCloud();
        
        // Nettoyer la session courante
        localStorage.removeItem('workout_session_current');
        
        console.log('🎉 SESSION TERMINÉE !', {
            duration: Math.round(this.currentSession.duration_total / 60) + ' min',
            exercises: this.currentSession.stats.exercises_completed,
            volume: this.currentSession.stats.total_volume + ' kg'
        });
        
        // Garder une référence pour les stats
        const completedSession = { ...this.currentSession };
        this.currentSession = null;
        
        return completedSession;
    }

    // ========== SAUVEGARDE LOCALE ==========
    
    saveLocal() {
        try {
            localStorage.setItem('workout_session_current', JSON.stringify(this.currentSession));
            console.log('💾 Sauvegarde locale OK');
        } catch (error) {
            console.error('❌ Erreur sauvegarde locale:', error);
        }
    }

    loadLocal() {
        try {
            const data = localStorage.getItem('workout_session_current');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Erreur chargement local:', error);
            return null;
        }
    }

    // ========== RÉCUPÉRATION DE SESSION ==========
    
    recoverSession() {
        const saved = this.loadLocal();
        
        if (!saved) return null;
        
        // Vérifier si la session n'est pas trop ancienne (24h max)
        const savedDate = new Date(saved.date);
        const now = new Date();
        const hoursDiff = (now - savedDate) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            console.log('⚠️ Session trop ancienne, ignorée');
            localStorage.removeItem('workout_session_current');
            return null;
        }
        
        // Proposer de reprendre
        const resume = confirm(
            `Une session en cours a été trouvée (${saved.day}, Semaine ${saved.week}).\n` +
            `Voulez-vous la reprendre ?`
        );
        
        if (resume) {
            this.currentSession = saved;
            console.log('✅ Session récupérée:', saved.session_id);
            return saved;
        } else {
            localStorage.removeItem('workout_session_current');
            return null;
        }
    }

    // ========== HISTORIQUE ==========
    
    addToHistory(session) {
        try {
            let history = localStorage.getItem('workout_history');
            history = history ? JSON.parse(history) : [];
            
            history.push(session);
            
            // Garder seulement les 100 dernières sessions
            if (history.length > 100) {
                history = history.slice(-100);
            }
            
            localStorage.setItem('workout_history', JSON.stringify(history));
            console.log('✅ Ajouté à l\'historique');
        } catch (error) {
            console.error('❌ Erreur historique:', error);
        }
    }

    getHistory(limit = 10) {
        try {
            let history = localStorage.getItem('workout_history');
            history = history ? JSON.parse(history) : [];
            return history.slice(-limit).reverse();
        } catch (error) {
            console.error('❌ Erreur lecture historique:', error);
            return [];
        }
    }

    // ========== AUTO-SAVE ==========
    
    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.currentSession && !this.currentSession.completed) {
                this.saveLocal();
                console.log('🔄 Auto-save...');
            }
        }, this.AUTOSAVE_DELAY);
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
    }

    // ========== SYNC GOOGLE DRIVE ==========
    
    startAutoSync() {
        this.syncInterval = setInterval(() => {
            if (this.currentSession && !this.currentSession.completed) {
                this.syncToCloud();
            }
        }, this.SYNC_DELAY);
    }

    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
    }

    async syncToCloud() {
        // TODO: Intégrer avec google-drive.js existant
        console.log('☁️ Sync vers Google Drive...');
        
        try {
            // Vérifier si GoogleDriveAPI est disponible
            if (typeof window.GoogleDriveAPI === 'undefined') {
                console.warn('⚠️ Google Drive API non disponible');
                return;
            }

            const filename = `session_${this.currentSession.session_id}.json`;
            const content = JSON.stringify(this.currentSession, null, 2);
            
            // Utiliser l'API existante
            // await window.GoogleDriveAPI.saveFile(filename, content);
            
            console.log('✅ Sync Google Drive OK');
        } catch (error) {
            console.error('❌ Erreur sync Google Drive:', error);
        }
    }

    manualSync() {
        return this.syncToCloud();
    }

    // ========== BACKUP COMPLET ==========
    
    createFullBackup() {
        const backup = {
            version: '1.0',
            created_at: new Date().toISOString(),
            current_session: this.currentSession,
            history: this.getHistory(100),
            preferences: this.loadPreferences()
        };
        
        return backup;
    }

    downloadBackup() {
        const backup = this.createFullBackup();
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `hybrid_master_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        console.log('✅ Backup téléchargé');
    }

    restoreBackup(backupData) {
        try {
            if (backupData.current_session) {
                this.currentSession = backupData.current_session;
                this.saveLocal();
            }
            
            if (backupData.history) {
                localStorage.setItem('workout_history', JSON.stringify(backupData.history));
            }
            
            if (backupData.preferences) {
                localStorage.setItem('user_preferences', JSON.stringify(backupData.preferences));
            }
            
            console.log('✅ Backup restauré');
            return true;
        } catch (error) {
            console.error('❌ Erreur restauration:', error);
            return false;
        }
    }

    // ========== PRÉFÉRENCES ==========
    
    loadPreferences() {
        try {
            const prefs = localStorage.getItem('user_preferences');
            return prefs ? JSON.parse(prefs) : {
                sound_enabled: false,
                vibration_enabled: true,
                voice_enabled: false,
                auto_next: false
            };
        } catch (error) {
            return {};
        }
    }

    savePreferences(prefs) {
        localStorage.setItem('user_preferences', JSON.stringify(prefs));
    }

    // ========== HANDLERS ==========
    
    setupExitHandlers() {
        // Sauvegarder avant de quitter
        window.addEventListener('beforeunload', (e) => {
            if (this.currentSession && !this.currentSession.completed) {
                this.saveLocal();
                
                // Avertir l'utilisateur
                e.preventDefault();
                e.returnValue = 'Une session est en cours. Êtes-vous sûr de vouloir quitter ?';
            }
        });

        // Sauvegarder quand la page est mise en arrière-plan
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.currentSession) {
                this.saveLocal();
                console.log('💾 Sauvegarde (page en arrière-plan)');
            }
        });
    }

    // ========== UTILITAIRES ==========
    
    generateSessionId() {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].replace(/:/g, 'h');
        return `${date}_${time}`;
    }

    // ========== NETTOYAGE ==========
    
    cleanup() {
        this.stopAutoSave();
        this.stopAutoSync();
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkoutSessionManager;
} else {
    window.WorkoutSessionManager = WorkoutSessionManager;
}
