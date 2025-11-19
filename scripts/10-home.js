/**
 * HYBRID MASTER 63 - HOME INTERACTIONS
 * Gestion des interactions UI et navigation
 */

// ============================================
// VARIABLES GLOBALES
// ============================================
let currentWeek = 1;
let currentCategory = 'all';

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    loadUserData();
    startAnimations();
});

// ============================================
// INITIALISATION UI
// ============================================
function initializeUI() {
    console.log('🚀 HYBRID MASTER 63 - Initialisation');
    
    // Animer les éléments au scroll
    observeElements();
    
    // Charger les préférences utilisateur
    loadPreferences();
}

// ============================================
// NAVIGATION
// ============================================

/**
 * Démarrer un workout
 */
function startWorkout(day) {
    console.log(`🏋️ Démarrage workout: ${day}`);
    
    // Animation de feedback
    showFeedback('Chargement de la séance...', 'loading');
    
    // Redirection avec délai pour l'animation
    setTimeout(() => {
        window.location.href = `workout-3d-full.html?week=${currentWeek}&day=${day}`;
    }, 500);
}

/**
 * Quick workout (premier disponible)
 */
function startQuickWorkout() {
    console.log('⚡ Quick start');
    startWorkout('dimanche');
}

/**
 * Changer de semaine
 */
function changeWeek(direction) {
    const newWeek = currentWeek + direction;
    
    if (newWeek < 1 || newWeek > 8) {
        showFeedback('Semaine non disponible', 'warning');
        return;
    }
    
    currentWeek = newWeek;
    
    // Animation de transition
    const weekTitle = document.querySelector('.week-title');
    weekTitle.style.opacity = '0';
    
    setTimeout(() => {
        weekTitle.textContent = `SEMAINE ${currentWeek}`;
        weekTitle.style.opacity = '1';
    }, 200);
    
    // Sauvegarder
    savePreferences();
    
    console.log(`📅 Semaine changée: ${currentWeek}`);
}

/**
 * Filtrer par catégorie
 */
function filterCategory(category) {
    currentCategory = category;
    
    const cards = document.querySelectorAll('.workout-card');
    
    cards.forEach(card => {
        const day = card.dataset.day;
        
        // Logique de filtrage (à adapter selon vos données)
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            // Exemple simple
            card.style.display = 'block';
        }
    });
    
    // Feedback visuel
    document.querySelectorAll('.category-card').forEach(cat => {
        cat.style.opacity = '0.5';
    });
    
    event.currentTarget.style.opacity = '1';
    
    console.log(`🔍 Filtre: ${category}`);
}

// ============================================
// TOGGLE WORKOUT DETAILS
// ============================================
function toggleWorkout(header) {
    const card = header.closest('.workout-card');
    const isExpanded = card.classList.contains('expanded');
    
    // Fermer tous les autres
    document.querySelectorAll('.workout-card').forEach(c => {
        if (c !== card) {
            c.classList.remove('expanded');
        }
    });
    
    // Toggle actuel
    card.classList.toggle('expanded');
    
    // Animation smooth
    if (!isExpanded) {
        const details = card.querySelector('.workout-details');
        const height = details.scrollHeight;
        details.style.maxHeight = `${height}px`;
    }
    
    console.log(`📋 Toggle workout: ${card.dataset.day}`);
}

// ============================================
// DONNÉES UTILISATEUR
// ============================================
function loadUserData() {
    // Charger depuis localStorage
    const data = {
        sessionsCompleted: localStorage.getItem('sessionsCompleted') || 0,
        totalVolume: localStorage.getItem('totalVolume') || 0,
        consecutiveDays: localStorage.getItem('consecutiveDays') || 2,
        monthProgress: localStorage.getItem('monthProgress') || 7
    };
    
    // Mettre à jour l'UI
    updateStats(data);
}

function updateStats(data) {
    // Stats header
    const headerStats = document.querySelectorAll('.header-stats .stat-text');
    if (headerStats[0]) headerStats[0].textContent = `${data.consecutiveDays} JOURS`;
    if (headerStats[1]) headerStats[1].textContent = `+${data.monthProgress}%`;
    
    // Stats panneau droit
    const statCards = document.querySelectorAll('.stat-card .stat-value');
    if (statCards[0]) statCards[0].textContent = data.sessionsCompleted;
    if (statCards[1]) statCards[1].textContent = `${data.totalVolume}kg`;
    
    console.log('📊 Stats mises à jour');
}

// ============================================
// PRÉFÉRENCES
// ============================================
function loadPreferences() {
    const savedWeek = localStorage.getItem('currentWeek');
    if (savedWeek) {
        currentWeek = parseInt(savedWeek);
        document.querySelector('.week-title').textContent = `SEMAINE ${currentWeek}`;
    }
}

function savePreferences() {
    localStorage.setItem('currentWeek', currentWeek);
}

// ============================================
// FEEDBACK VISUEL
// ============================================
function showFeedback(message, type = 'info') {
    // Créer toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} glass`;
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 16px;
        font-family: 'Orbitron', sans-serif;
        font-size: 14px;
        font-weight: 700;
        color: var(--text);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // Supprimer après 3s
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// ANIMATIONS
// ============================================
function startAnimations() {
    // Animer les barres de progression au chargement
    setTimeout(() => {
        document.querySelectorAll('.progress-fill, .muscle-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
}

function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observer les cartes
    document.querySelectorAll('.workout-card, .stat-card, .category-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// ============================================
// ANIMATIONS CSS DYNAMIQUES
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// UTILITAIRES
// ============================================

/**
 * Formater la durée
 */
function formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h${m}min` : `${m}min`;
}

/**
 * Calculer la progression
 */
function calculateProgress(completed, total) {
    return Math.round((completed / total) * 100);
}

console.log('✅ Scripts chargés - HYBRID MASTER 63');
// ============================================
// MOBILE: TOGGLE STATS PANEL
// ============================================
function toggleStatsPanel() {
    const panel = document.querySelector('.panel-right');
    const overlay = document.querySelector('.modal-overlay');
    
    panel.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Bloquer le scroll du body quand le panel est ouvert
    if (panel.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Auto-collapse panneau gauche sur mobile
if (window.innerWidth <= 430) {
    const panelLeft = document.querySelector('.panel-left');
    if (panelLeft) {
        panelLeft.classList.add('collapsed');
        
        panelLeft.querySelector('.panel-header').addEventListener('click', () => {
            panelLeft.classList.toggle('collapsed');
        });
    }
}
