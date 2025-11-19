/**
 * HYBRID MASTER 63 - MOBILE TABS NAVIGATION
 * Gestion des onglets et interactions
 */

// ============================================
// VARIABLES GLOBALES
// ============================================
let currentWeek = 1;
let currentTab = 'home';

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 HYBRID MASTER 63 - App initialized');
    loadUserPreferences();
    animateOnLoad();
});

// ============================================
// NAVIGATION TABS
// ============================================
function switchTab(tabName) {
    // Cacher tous les contenus
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Désactiver tous les boutons nav
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activer le contenu sélectionné
    const targetTab = document.getElementById(`tab-${tabName}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Activer le bouton nav
    const targetBtn = document.querySelector(`.nav-tab[data-tab="${tabName}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    // Sauvegarder
    currentTab = tabName;
    localStorage.setItem('currentTab', tabName);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log(`📍 Tab switched to: ${tabName}`);
}

// ============================================
// WEEK NAVIGATION
// ============================================
function changeWeek(direction) {
    const newWeek = currentWeek + direction;
    
    if (newWeek < 1 || newWeek > 8) {
        showToast('⚠️ Semaine non disponible', 'warning');
        return;
    }
    
    currentWeek = newWeek;
    
    // Animation
    const weekNumber = document.querySelector('.week-number');
    if (weekNumber) {
        weekNumber.style.opacity = '0';
        weekNumber.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            weekNumber.textContent = `SEMAINE ${currentWeek}`;
            weekNumber.style.opacity = '1';
            weekNumber.style.transform = 'scale(1)';
        }, 200);
    }
    
    localStorage.setItem('currentWeek', currentWeek);
    console.log(`📅 Week changed to: ${currentWeek}`);
}

// ============================================
// WORKOUT ACTIONS
// ============================================
function startWorkout(day) {
    console.log(`🏋️ Starting workout: ${day}`);
    showToast('⚡ Chargement de la séance...', 'loading');
    
    setTimeout(() => {
        window.location.href = `workout-3d-full.html?week=${currentWeek}&day=${day}`;
    }, 500);
}

function startQuickWorkout() {
    console.log('⚡ Quick start');
    startWorkout('dimanche');
}

function toggleDetails(button) {
    const workoutCard = button.closest('.workout-full');
    const details = workoutCard.querySelector('.workout-details');
    
    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        button.innerHTML = '<span>📝 DÉTAILS</span>';
    } else {
        // Fermer tous les autres
        document.querySelectorAll('.workout-details').forEach(d => {
            d.classList.remove('expanded');
        });
        document.querySelectorAll('.workout-btn-secondary').forEach(b => {
            b.innerHTML = '<span>📝 DÉTAILS</span>';
        });
        
        // Ouvrir celui-ci
        details.classList.add('expanded');
        button.innerHTML = '<span>✕ FERMER</span>';
    }
}

function filterWorkouts(category) {
    console.log(`🔍 Filter: ${category}`);
    
    const workouts = document.querySelectorAll('.workout-full');
    
    workouts.forEach(workout => {
        const categories = workout.dataset.category;
        
        if (category === 'all' || categories.includes(category)) {
            workout.style.display = 'block';
        } else {
            workout.style.display = 'none';
        }
    });
    
    showToast(`🏷️ Filtre: ${category.toUpperCase()}`, 'info');
}

// ============================================
// PLUS TAB ACTIONS
// ============================================
function openCoach() {
    showToast('🤖 Coach IA - Bientôt disponible', 'info');
}

function openTests() {
    showToast('✏️ Tests 1RM - Bientôt disponible', 'info');
}

function exportData() {
    showToast('💾 Export - Bientôt disponible', 'info');
}

function confirmReset() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser votre progression ?')) {
        localStorage.clear();
        showToast('✅ Progression réinitialisée', 'success');
        setTimeout(() => location.reload(), 1500);
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 20px;
        border-radius: 12px;
        background: rgba(20, 25, 35, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 229, 255, 0.5);
        color: #00e5ff;
        font-family: 'Orbitron', sans-serif;
        font-size: 12px;
        font-weight: 700;
        z-index: 10000;
        box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
        animation: toastSlide 0.4s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastFade 0.4s ease-out forwards';
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// ============================================
// USER PREFERENCES
// ============================================
function loadUserPreferences() {
    // Charger tab
    const savedTab = localStorage.getItem('currentTab');
    if (savedTab) {
        switchTab(savedTab);
    }
    
    // Charger semaine
    const savedWeek = localStorage.getItem('currentWeek');
    if (savedWeek) {
        currentWeek = parseInt(savedWeek);
        const weekNumber = document.querySelector('.week-number');
        if (weekNumber) {
            weekNumber.textContent = `SEMAINE ${currentWeek}`;
        }
    }
    
    console.log('💾 Preferences loaded');
}

// ============================================
// ANIMATIONS
// ============================================
function animateOnLoad() {
    // Animer les barres de progression
    setTimeout(() => {
        document.querySelectorAll('.progress-bar-fill, .muscle-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
}

// ============================================
// ANIMATIONS CSS DYNAMIQUES
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes toastSlide {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes toastFade {
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Scripts loaded - HYBRID MASTER 63');
