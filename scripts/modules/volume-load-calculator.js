// ==================================================================
// VOLUME LOAD CALCULATOR - HYBRID MASTER 63
// Calcule le Volume Load réel depuis workout_history
// ==================================================================

export class VolumeLoadCalculator {
  constructor() {
    this.history = this.loadHistory();
  }

  loadHistory() {
    try {
      const data = localStorage.getItem('workout_history');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Erreur lecture historique:', error);
      return [];
    }
  }

  // Calcule le Volume Load de la semaine en cours
  getCurrentWeekVolumeLoad() {
    const currentWeek = this.getCurrentWeekNumber();
    return this.getWeekVolumeLoad(currentWeek);
  }

  // Calcule le Volume Load d'une semaine spécifique
  getWeekVolumeLoad(weekNumber) {
    const weekSessions = this.history.filter(session => {
      return session.week === weekNumber && session.completed;
    });

    let totalVolume = 0;
    let totalSets = 0;
    let totalTUT = 0;

    weekSessions.forEach(session => {
      // Utilise le volume déjà calculé dans la session
      if (session.stats && session.stats.total_volume) {
        totalVolume += session.stats.total_volume;
      }

      // Calcule les sets
      if (session.exercises) {
        session.exercises.forEach(exercise => {
          if (exercise.sets_data && exercise.sets_data.length > 0) {
            totalSets += exercise.sets_data.length;
          }
        });
      }

      // Calcule le TUT
      if (session.stats && session.stats.total_time_under_tension) {
        totalTUT += session.stats.total_time_under_tension;
      }
    });

    return {
      weekNumber: weekNumber,
      totalVolume: totalVolume,
      totalSets: totalSets,
      totalTUT: totalTUT,
      sessionsCount: weekSessions.length,
      inOptimalZone: totalVolume >= 15000 && totalVolume <= 22000
    };
  }

  // Récupère le numéro de semaine actuel (1-26)
  getCurrentWeekNumber() {
    // Cherche la semaine la plus récente dans l'historique
    if (this.history.length === 0) return 1;

    const sortedHistory = [...this.history].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    return sortedHistory[0].week || 1;
  }

  // Récupère toutes les stats de toutes les semaines
  getAllWeeksStats() {
    const weeks = new Map();

    this.history.forEach(session => {
      if (!session.completed) return;

      const weekNum = session.week;
      if (!weeks.has(weekNum)) {
        weeks.set(weekNum, {
          totalVolume: 0,
          totalSets: 0,
          totalTUT: 0,
          sessions: []
        });
      }

      const weekData = weeks.get(weekNum);
      
      if (session.stats && session.stats.total_volume) {
        weekData.totalVolume += session.stats.total_volume;
      }

      if (session.stats && session.stats.total_time_under_tension) {
        weekData.totalTUT += session.stats.total_time_under_tension;
      }

      if (session.exercises) {
        session.exercises.forEach(exercise => {
          if (exercise.sets_data) {
            weekData.totalSets += exercise.sets_data.length;
          }
        });
      }

      weekData.sessions.push(session);
    });

    return Array.from(weeks.entries()).map(([weekNum, data]) => ({
      week: weekNum,
      volume: data.totalVolume,
      sets: data.totalSets,
      tut: data.totalTUT,
      sessionsCount: data.sessions.length,
      inOptimalZone: data.totalVolume >= 15000 && data.totalVolume <= 22000
    }));
  }

  // Calcule les stats des 4 dernières semaines
  getLastFourWeeksStats() {
    const currentWeek = this.getCurrentWeekNumber();
    const stats = [];

    for (let i = 0; i < 4; i++) {
      const weekNum = currentWeek - i;
      if (weekNum > 0) {
        stats.push(this.getWeekVolumeLoad(weekNum));
      }
    }

    return stats.reverse();
  }

  // Export des données pour debugging
  exportStats() {
    return {
      currentWeek: this.getCurrentWeekNumber(),
      currentWeekStats: this.getCurrentWeekVolumeLoad(),
      lastFourWeeks: this.getLastFourWeeksStats(),
      allWeeks: this.getAllWeeksStats(),
      totalSessions: this.history.length,
      completedSessions: this.history.filter(s => s.completed).length
    };
  }
}

// Export global pour utilisation dans d'autres scripts
window.VolumeLoadCalculator = VolumeLoadCalculator;
