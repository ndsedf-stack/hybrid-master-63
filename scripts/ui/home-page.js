/**
 * HOME-PAGE.JS - Gestion de la page d'accueil
 * Intégration avec programData existant
 */
import programData from '../program-data.js';

class HomePage {
    constructor() {
        this.currentWeek = 1;
        this.workoutsContainer = document.getElementById('workoutsContainer');
        this.init();
    }

    init() {
        this.loadWorkoutsForWeek(this.currentWeek);
        this.attachEventListeners();
    }

    loadWorkoutsForWeek(weekNumber) {
        const weekData = programData.getWeek(weekNumber);
        
        if (!weekData) {
            console.error('Week data not found for week', weekNumber);
            return;
        }

        console.log('Week data loaded:', weekData);

        this.workoutsContainer.innerHTML = '';
        
        // ✅ Utiliser les vraies clés de votre structure
        const dayOrder = ['dimanche', 'mardi', 'vendredi'];
        const dayLabels = {
            'dimanche': { name: 'Dimanche', emoji: '🔥', number: 1 },
            'mardi': { name: 'Mardi', emoji: '💪', number: 2 },
            'vendredi': { name: 'Vendredi', emoji: '⚡', number: 3 }
        };
        
        dayOrder.forEach((dayKey) => {
            const workout = weekData[dayKey]; // ✅ Accès direct, pas weekData.workouts
            if (workout) {
                const card = this.createWorkoutCard({
                    dayKey: dayKey,
                    dayLabel: dayLabels[dayKey],
                    workout: workout,
                    weekNumber: weekNumber
                });
                this.workoutsContainer.appendChild(card);
            }
        });
    }

    createWorkoutCard(data) {
        const card = document.createElement('div');
        card.className = 'workout-card';
        
        // ✅ Les stats sont déjà dans workout !
        const duration = data.workout.duration || 60;
        const sets = data.workout.totalSets || 0;
        const exercises = data.workout.exercises?.length || 0;
        
        card.innerHTML = `
            <div class="card-header">
                <div class="day-info">
                    <span class="day-emoji">${data.dayLabel.emoji}</span>
                    <span class="day-name">${data.dayLabel.name}</span>
                    <span class="day-number">• Jour ${data.dayLabel.number}</span>
                </div>
            </div>
            
            <h2 class="workout-title">${data.workout.name}</h2>
            
            <div class="workout-stats">
                <div class="stat-item">
                    <span class="stat-icon">⚡</span>
                    <div class="stat-content">
                        <span class="stat-value">${duration}</span>
                        <span class="stat-label">min</span>
                    </div>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">💪</span>
                    <div class="stat-content">
                        <span class="stat-value">${sets}</span>
                        <span class="stat-label">séries</span>
                    </div>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">🏋️</span>
                    <div class="stat-content">
                        <span class="stat-value">${exercises}</span>
                        <span class="stat-label">exercices</span>
                    </div>
                </div>
            </div>
            
            <button class="btn-start" data-week="${data.weekNumber}" data-day="${data.dayKey}">
                Commencer →
            </button>
        `;
        
        return card;
    }

    attachEventListeners() {
        this.workoutsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-start');
            if (btn) {
                const week = btn.dataset.week;
                const day = btn.dataset.day;
                console.log(`🚀 Démarrage: Week ${week}, Day ${day}`);
window.location.href = `workout.html?week=${week}&day=${day}`;            }
        });

        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        const fabBtn = document.getElementById('createWorkoutBtn');
        if (fabBtn) {
            fabBtn.addEventListener('click', () => {
                alert('➕ Créer un entraînement personnalisé');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏠 Initialisation de la page d\'accueil...');
    new HomePage();
});
