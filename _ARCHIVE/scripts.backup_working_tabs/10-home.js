/**
 * HYBRID MASTER 63 - MOBILE TABS NAVIGATION
 * Gestion des onglets et interactions - TOUS BOUTONS CONNECTÉS
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
    attachSearchListener();

// Attacher les event listeners aux boutons de navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            if (tab) {
                switchTab(tab);
            }
        });
    });

    // Attendre que programData soit chargé
    const checkProgramData = setInterval(() => {
        if (window.programData) {
            clearInterval(checkProgramData);
            initWorkoutDetails();
            console.log('✅ programData chargé, listes générées');
        }
    }, 100);
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
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activer le contenu sélectionné
    const targetTab = document.getElementById(`tab-${tabName}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Activer le bouton nav
    const targetBtn = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
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
    
    if (newWeek < 1 || newWeek > 26) {
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
        updateBlockDisplay(currentWeek);
            weekNumber.style.opacity = '1';
            weekNumber.style.transform = 'scale(1)';
        }, 200);
    }
    
    localStorage.setItem('currentWeek', currentWeek);
    updateBlockDisplay(currentWeek);
    showToast(`📅 Semaine ${currentWeek} sélectionnée`, 'info');
    console.log(`📅 Week changed to: ${currentWeek}`);
}

// ============================================
// WORKOUT ACTIONS - CONNEXION VERS workout-3d-ultra.html
// ============================================
function startWorkout(day) {
    console.log(`🏋️ Starting workout: ${day}`);
    showToast('⚡ Chargement de la séance...', 'loading');
    
    // Sauvegarder les params
    localStorage.setItem('selectedWeek', currentWeek);
    updateBlockDisplay(currentWeek);
    localStorage.setItem('selectedDay', day);
    
    setTimeout(() => {
        window.location.href = `workout-3d-ultra.html?week=${currentWeek}&day=${day}`;
    }, 500);
}

function startQuickWorkout() {
    console.log('⚡ Quick start - Premier workout disponible');
    startWorkout('dimanche');
}

function toggleDetails(button) {
    const workoutCard = button.closest('.workout-full');
    const details = workoutCard.querySelector('.workout-details');
    
    if (!details) {
        showToast('ℹ️ Détails non disponibles', 'info');
        return;
    }
    
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
    let visibleCount = 0;
    
    workouts.forEach(workout => {
        const categories = workout.dataset.category || '';
        
        if (category === 'all' || categories.includes(category)) {
            workout.style.display = 'block';
            visibleCount++;
        } else {
            workout.style.display = 'none';
        }
    });
    
    // Feedback visuel sur les boutons catégories
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.style.opacity = '0.5';
    });
    event.target.closest('.category-btn').style.opacity = '1';
    
    showToast(`🏷️ ${visibleCount} séance(s) - ${category.toUpperCase()}`, 'info');
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function attachSearchListener() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const workouts = document.querySelectorAll('.workout-full');
            let foundCount = 0;
            
            workouts.forEach(workout => {
                const title = workout.querySelector('.workout-full-title').textContent.toLowerCase();
                
                if (title.includes(query)) {
                    workout.style.display = 'block';
                    foundCount++;
                } else {
                    workout.style.display = 'none';
                }
            });
            
            if (query.length > 0) {
                console.log(`🔍 Search: ${query} - ${foundCount} résultat(s)`);
            }
        });
    }
}

// ============================================
// PLUS TAB ACTIONS - CONNEXIONS RÉELLES
// ============================================
function openCoach() {
    showToast('🤖 Redirection vers Coach IA...', 'loading');
    setTimeout(() => {
        // Si tu as une page coach, remplace par le bon lien
        showToast('🤖 Coach IA - En développement', 'info');
        // window.location.href = 'coach-ia.html';
    }, 500);
}

function openTests() {
    showToast('✏️ Redirection vers Tests 1RM...', 'loading');
    setTimeout(() => {
        // Connexion vers test.html si c'est ta page de tests
        window.location.href = 'test.html';
    }, 500);
}

function exportData() {
    showToast('💾 Export en cours...', 'loading');
    
    setTimeout(() => {
        // Récupérer toutes les données localStorage
        const data = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            currentWeek: currentWeek,
            currentTab: currentTab,
            userPreferences: {
                theme: localStorage.getItem('theme') || 'dark',
                units: localStorage.getItem('units') || 'kg'
            },
            workoutHistory: {
                sessionsCompleted: localStorage.getItem('sessionsCompleted') || 0,
                totalVolume: localStorage.getItem('totalVolume') || 0,
                consecutiveDays: localStorage.getItem('consecutiveDays') || 0
            }
        };
        
        // Créer le fichier
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hybrid-master-63-export-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('✅ Données exportées !', 'success');
        console.log('💾 Data exported:', data);
    }, 500);
}

function confirmReset() {
    if (confirm('⚠️ ATTENTION\n\nCette action va supprimer :\n- Toute votre progression\n- Vos préférences\n- Votre historique\n\nÊtes-vous ABSOLUMENT sûr ?')) {
        showToast('🔄 Réinitialisation...', 'loading');
        
        setTimeout(() => {
            // Sauvegarder une backup avant reset
            const backup = {
                date: new Date().toISOString(),
                data: {...localStorage}
            };
            console.warn('⚠️ Backup before reset:', backup);
            
            // Clear tout sauf la backup
            const backupKey = `backup-${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(backup));
            
            // Reset
            const keysToKeep = [backupKey];
            Object.keys(localStorage).forEach(key => {
                if (!keysToKeep.includes(key)) {
                    localStorage.removeItem(key);
                }
            });
            
            showToast('✅ Progression réinitialisée !', 'success');
            
            setTimeout(() => {
                location.reload();
            }, 1500);
        }, 800);
    }
}

// ============================================
// NAVIGATION VERS AUTRES PAGES
// ============================================
function openGuide() {
    showToast('📖 Ouverture du guide...', 'loading');
    setTimeout(() => {
        // Si tu as une page guide
        showToast('📖 Guide - En développement', 'info');
        // window.location.href = 'guide.html';
    }, 500);
}

function openVideos() {
    showToast('🎥 Ouverture des vidéos...', 'loading');
    setTimeout(() => {
        // Lien vers tes vidéos
        showToast('🎥 Vidéos - En développement', 'info');
        // window.location.href = 'videos.html';
    }, 500);
}

function openQuote() {
    const quotes = [
        { text: "The last three or four reps is what makes the muscle grow.", author: "Arnold Schwarzenegger" },
        { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
        { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
        { text: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
        { text: "Train insane or remain the same.", author: "Jailhouse Strong" }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    alert(`💬 CITATION DU JOUR\n\n"${randomQuote.text}"\n\n— ${randomQuote.author}`);
}

function openNotifications() {
    showToast('🔔 Paramètres notifications', 'info');
}

function openTheme() {
    showToast('🎨 Changement de thème - Bientôt', 'info');
}

function openUnits() {
    const currentUnit = localStorage.getItem('units') || 'kg';
    const newUnit = currentUnit === 'kg' ? 'lbs' : 'kg';
    localStorage.setItem('units', newUnit);
    showToast(`📏 Unités changées : ${newUnit.toUpperCase()}`, 'success');
}

function openLanguage() {
    showToast('🌐 Changement de langue - Bientôt', 'info');
}

// ============================================
// STATS RAPIDES
// ============================================
function viewStats() {
    switchTab('stats');
    showToast('📊 Vue statistiques', 'info');
}

function viewCalendar() {
    switchTab('stats');
    setTimeout(() => {
        document.querySelector('.calendar-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
    showToast('📅 Calendrier', 'info');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    // Supprimer les anciens toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const colors = {
        info: 'rgba(0, 229, 255, 0.5)',
        success: 'rgba(0, 255, 159, 0.5)',
        warning: 'rgba(255, 193, 7, 0.5)',
        loading: 'rgba(155, 89, 255, 0.5)',
        error: 'rgba(255, 107, 53, 0.5)'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 20px;
        border-radius: 12px;
        background: rgba(20, 25, 35, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid ${colors[type] || colors.info};
        color: #fff;
        font-family: 'Orbitron', sans-serif;
        font-size: 12px;
        font-weight: 700;
        z-index: 10000;
        box-shadow: 0 0 20px ${colors[type] || colors.info};
        animation: toastSlide 0.4s ease-out;
        max-width: 90%;
        text-align: center;
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
        updateBlockDisplay(currentWeek);
        }
    }
    
    console.log('💾 Preferences loaded:', { currentWeek, currentTab: savedTab || 'home' });
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
    
    // Animer les cartes au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.glass').forEach(el => {
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

console.log('✅ Scripts loaded - HYBRID MASTER 63 - ALL BUTTONS CONNECTED');
// ====================================================================
// GÉNÉRATION DYNAMIQUE DES LISTES D'EXERCICES
// ====================================================================
function generateExerciseList(day, weekNumber = 1) {
    const weekData = programData.getWeek(weekNumber);
    const workout = weekData[day];
    
    if (!workout || !workout.exercises) return '<p>Aucun exercice trouvé</p>';
    
    let html = '<div class="exercise-list">';
    let i = 0;
    
    while (i < workout.exercises.length) {
        const ex = workout.exercises[i];
        
        // Vérifie si c'est un superset
        if (ex.isSuperset && i < workout.exercises.length - 1) {
            const nextEx = workout.exercises[i + 1];
            html += `
                <div class="superset-group glass-light">
                    <div class="superset-label">🔄 SUPERSET</div>
                    <div class="exercise-item">
                        <span class="exercise-emoji">💪</span>
                        <div class="exercise-info">
                            <div class="exercise-name">${ex.name.toUpperCase()}</div>
                            <div class="exercise-specs">${ex.sets} × ${ex.reps} • ${ex.weight}kg • ${ex.rest}s</div>
                        </div>
                    </div>
                    <div class="exercise-item">
                        <span class="exercise-emoji">🏋️</span>
                        <div class="exercise-info">
                            <div class="exercise-name">${nextEx.name.toUpperCase()}</div>
                            <div class="exercise-specs">${nextEx.sets} × ${nextEx.reps} • ${nextEx.weight}kg • ${nextEx.rest}s</div>
                        </div>
                    </div>
                </div>
            `;
            i += 2; // Skip next exercise (déjà traité dans le superset)
        } else {
            const emoji = ex.category === 'compound' ? '🏋️' : '💪';
            html += `
                <div class="exercise-item glass-light">
                    <span class="exercise-emoji">${emoji}</span>
                    <div class="exercise-info">
                        <div class="exercise-name">${ex.name.toUpperCase()}</div>
                        <div class="exercise-specs">${ex.sets} × ${ex.reps} • ${ex.weight}kg • ${ex.rest}s</div>
                    </div>
                </div>
            `;
            i++;
        }
    }
    
    html += '</div>';
    return html;
}

// Fonction pour initialiser toutes les listes d'exercices
function initWorkoutDetails() {
    const days = ['dimanche', 'mardi', 'vendredi', 'maison'];
    
    days.forEach(day => {
        const workoutCard = document.querySelector(`[data-day="${day}"]`);
        if (workoutCard) {
            const detailsContainer = workoutCard.querySelector('.workout-details');
            if (detailsContainer) {
                detailsContainer.innerHTML = generateExerciseList(day, currentWeek);
            }
        }
    });
    
    console.log('✅ Listes d\'exercices générées dynamiquement');
}

function updateBlockDisplay(week) {
    const blockLabel = document.getElementById('block-label');
    if (!blockLabel) return;
    
    let blockNum = 1;
    if (week >= 1 && week <= 6) blockNum = 1;
    else if (week >= 7 && week <= 12) blockNum = 2;
    else if (week >= 13 && week <= 18) blockNum = 3;
    else if (week >= 19 && week <= 26) blockNum = 4;
    
    blockLabel.textContent = `BLOC ${blockNum}`;
    updateBlockTechniques(week);
}

function updateBlockTechniques(week) {
    const techniques = {
        1: { tempo: "3-1-2", rpe: "6-7", technique: "DROP SET", objective: "MAÎTRISER LA TECHNIQUE AVEC CHARGES MODÉRÉES" },
        2: { tempo: "4-0-1", rpe: "7-8", technique: "REST-PAUSE", objective: "AUGMENTER LA CHARGE ET L'INTENSITÉ" },
        3: { tempo: "2-0-2", rpe: "8-9", technique: "SUPERSETS", objective: "MAXIMISER L'HYPERTROPHIE ET LA CONGESTION" },
        4: { tempo: "3-0-3", rpe: "9-10", technique: "CLUSTERS", objective: "ATTEINDRE LA FORCE MAXIMALE" }
    };
    
    let blockNum = 1;
    if (week >= 1 && week <= 6) blockNum = 1;
    else if (week >= 7 && week <= 12) blockNum = 2;
    else if (week >= 13 && week <= 18) blockNum = 3;
    else if (week >= 19 && week <= 26) blockNum = 4;
    
    const tech = techniques[blockNum];
    
    const tempoEl = document.getElementById('tech-tempo');
    const rpeEl = document.getElementById('tech-rpe');
    const techniqueEl = document.getElementById('tech-technique');
    const objectiveEl = document.getElementById('tech-objective');
    
    if (tempoEl) tempoEl.textContent = tech.tempo;
    if (rpeEl) rpeEl.textContent = tech.rpe;
    if (techniqueEl) techniqueEl.textContent = tech.technique;
    if (objectiveEl) objectiveEl.textContent = tech.objective;
}
