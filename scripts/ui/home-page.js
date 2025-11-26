/**
 * HOME-PAGE.JS - Gestion de la page d'accueil
 * Intégration avec programData existant
 */

import { programData } from '../program-data.js';

class HomePage {
    constructor() {
        this.currentWeek = 1;
        this.workoutsContainer = document.getElementById('workoutsContainer');
        this.init();
    }

    init() {
        this.renderWorkouts();
        this.setupEventListeners();
    }

    renderWorkouts() {
        if (!this.workoutsContainer) return;

        const weekData = programData.weeks[this.currentWeek];
        if (!weekData) return;

        let html = '';

        weekData.days.forEach((day, index) => {
            const dayNumber = index + 1;
            const status = this.getWorkoutStatus(this.currentWeek, dayNumber);
            const stats = this.calculateStats(day);

            html += `
                <div class="workout-card ${status}" data-week="${this.currentWeek}" data-day="${dayNumber}">
                    <div class="workout-header">
                        <div class="workout-info">
                            <span class="workout-badge ${status}">${this.getDayName(dayNumber)} • Jour ${dayNumber}</span>
                            <h2 class="workout-title">${day.name || `Jour ${dayNumber}`}</h2>
                        </div>
                        ${status === 'completed' ? '<div class="workout-check completed">✓</div>' : ''}
                        ${status === 'active' ? '<div class="workout-check active">✓</div>' : ''}
                    </div>
                    
                    <div class="workout-stats">
                        <div class="stat-item">
                            <span class="stat-icon">⚡</span>
                            <span>${stats.duration} min</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">💪</span>
                            <span>${stats.sets} séries</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">🏋️</span>
                            <span>${stats.exercises} exercices</span>
                        </div>
                    </div>
                    
                    <div class="workout-actions">
                        ${status === 'completed' 
                            ? '<button class="workout-btn btn-completed">✓ Complété</button>'
                            : `<button class="workout-btn btn-start" onclick="startWorkout(${this.currentWeek}, ${dayNumber})">Commencer</button>`
                        }
                    </div>
                </div>
            `;
        });

        this.workoutsContainer.innerHTML = html;
    }

    calculateStats(day) {
        let duration = 0;
        let sets = 0;
        const exercises = day.exercises ? day.exercises.length : 0;

        if (day.exercises) {
            day.exercises.forEach(exercise => {
                sets += exercise.sets || 0;
                // Estimation : 3min par série + 1min repos
                duration += (exercise.sets || 0) * 4;
            });
        }

        return {
            duration: duration || 60,
            sets: sets || 0,
            exercises: exercises
        };
    }

    getWorkoutStatus(week, day) {
        const completed = localStorage.getItem(`workout-${week}-${day}-completed`);
        const inProgress = localStorage.getItem(`workout-${week}-${day}-inprogress`);
        
        if (completed) return 'completed';
        if (inProgress) return 'active';
        return 'planned';
    }

    getDayName(dayNumber) {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        return days[dayNumber - 1] || `Jour ${dayNumber}`;
    }

    setupEventListeners() {
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // FAB
        const fab = document.getElementById('createWorkoutBtn');
        if (fab) {
            fab.addEventListener('click', () => {
                alert('Créer un workout personnalisé - Fonctionnalité à venir !');
            });
        }

        // Streak button
        const streakBtn = document.getElementById('streakBtn');
        if (streakBtn) {
            streakBtn.addEventListener('click', () => {
                const streak = this.calculateStreak();
                alert(`🔥 Streak actuel : ${streak} jours !`);
            });
        }
    }

    calculateStreak() {
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            if (localStorage.getItem(`workout-completed-${dateStr}`)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        
        return streak;
    }
}

// Fonction globale pour démarrer un workout
window.startWorkout = function(week, day) {
    localStorage.setItem(`workout-${week}-${day}-inprogress`, 'true');
    window.location.href = `workout-3d-ultra.html?week=${week}&day=${day}`;
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});
