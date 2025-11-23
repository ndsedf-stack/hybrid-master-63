// GÉNÉRATEUR DE DONNÉES DÉMO - 1 MOIS D'HISTORIQUE
// Utilise les VRAIS exercices du programData

const programData = {
  "semaine1": {
    "jour1": {
      "nom": "FULL BODY A",
      "exercices": [
        { "nom": "Back Squat", "series": 4, "reps": 8, "repos": 180, "muscle": "quadriceps", "poids": 100 },
        { "nom": "Bench Press", "series": 4, "reps": 8, "repos": 150, "muscle": "pectoraux", "poids": 80 },
        { "nom": "Bent Over Row", "series": 4, "reps": 10, "repos": 120, "muscle": "dos", "poids": 70 },
        { "nom": "Overhead Press", "series": 3, "reps": 10, "repos": 120, "muscle": "epaules", "poids": 50 }
      ]
    },
    "jour3": {
      "nom": "FULL BODY B",
      "exercices": [
        { "nom": "Deadlift", "series": 4, "reps": 6, "repos": 180, "muscle": "dos", "poids": 120 },
        { "nom": "Incline Bench", "series": 4, "reps": 10, "repos": 150, "muscle": "pectoraux", "poids": 70 },
        { "nom": "Front Squat", "series": 3, "reps": 10, "repos": 120, "muscle": "quadriceps", "poids": 80 },
        { "nom": "Pull Ups", "series": 4, "reps": 8, "repos": 120, "muscle": "dos", "poids": 0 }
      ]
    },
    "jour5": {
      "nom": "FULL BODY C",
      "exercices": [
        { "nom": "Romanian Deadlift", "series": 4, "reps": 10, "repos": 120, "muscle": "ischio", "poids": 90 },
        { "nom": "Dips", "series": 4, "reps": 10, "repos": 120, "muscle": "pectoraux", "poids": 0 },
        { "nom": "Leg Press", "series": 4, "reps": 12, "repos": 120, "muscle": "quadriceps", "poids": 180 },
        { "nom": "Barbell Curl", "series": 3, "reps": 12, "repos": 90, "muscle": "biceps", "poids": 30 }
      ]
    }
  }
};

function generateDemoData() {
  const completedSessions = [];
  const workoutHistory = [];
  
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  let sessionId = 1;
  
  // Génère 4 semaines complètes (3 séances par semaine)
  for (let week = 1; week <= 4; week++) {
    const sessions = ['jour1', 'jour3', 'jour5'];
    
    sessions.forEach((jour, index) => {
      const sessionDate = new Date(oneMonthAgo);
      sessionDate.setDate(oneMonthAgo.getDate() + (week - 1) * 7 + index * 2);
      
      const program = programData.semaine1[jour];
      const exercises = [];
      let totalVolume = 0;
      let totalTUT = 0;
      
      program.exercices.forEach((ex, i) => {
        // Variation réaliste des poids (85-105% du poids de base)
        const variation = 0.85 + Math.random() * 0.2;
        const weight = Math.round(ex.poids * variation);
        const estimatedMax = weight * 1.3;
        
        const exerciseData = {
          id: `ex_${sessionId}_${i}`,
          name: ex.nom,
          primaryMuscle: ex.muscle,
          muscle: ex.muscle,
          sets: ex.series,
          reps: ex.reps,
          weight: weight,
          estimatedMax: estimatedMax,
          rest: ex.repos,
          completed: true
        };
        
        exercises.push(exerciseData);
        
        const volume = weight * ex.reps * ex.series;
        totalVolume += volume;
        totalTUT += ex.reps * ex.series * 3; // ~3 sec par rep
      });
      
      // completedSessions format
      completedSessions.push({
        id: `session_${sessionId}`,
        date: sessionDate.toISOString(),
        name: program.nom,
        week: week,
        day: jour,
        exercises: exercises,
        completed: true,
        stats: {
          total_volume: totalVolume,
          total_time_under_tension: totalTUT,
          duration: exercises.length * 15 // ~15 min par exercice
        }
      });
      
      // workout_history format (pour Volume Load)
      workoutHistory.push({
        date: sessionDate.toISOString().split('T')[0],
        week: week,
        day: jour,
        completed: true,
        exercises: exercises,
        stats: {
          total_volume: totalVolume,
          total_time_under_tension: totalTUT
        }
      });
      
      sessionId++;
    });
  }
  
  // Sauvegarde dans localStorage
  localStorage.setItem('completedSessions', JSON.stringify(completedSessions));
  localStorage.setItem('workout_history', JSON.stringify(workoutHistory));
  
  console.log('✅ DONNÉES DÉMO GÉNÉRÉES !');
  console.log(`📊 ${completedSessions.length} sessions créées sur 4 semaines`);
  console.log(`💪 Volume total: ${completedSessions.reduce((sum, s) => sum + s.stats.total_volume, 0).toFixed(0)} kg`);
  console.log('🔄 Recharge la page pour voir les graphiques !');
  
  return {
    completedSessions,
    workoutHistory
  };
}

// EXÉCUTE LE GÉNÉRATEUR
generateDemoData();
