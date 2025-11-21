// ============================================
// STATS INIT - Initialisation complète
// ============================================

let statsEngine, statsUI, bodyTracker, prDetector, calculators;

function initStats() {
    console.log('🚀 Initialisation Stats Ultra...');
    
    // Initialiser les modules
    statsEngine = new StatsEngine();
    statsUI = new StatsUI(statsEngine);
    bodyTracker = new BodyTracker();
    prDetector = new PRDetector();
    calculators = new Calculators();
    
    // Charger les données
    loadStatsData();
    
    // Afficher les graphiques
    setTimeout(() => renderAllCharts(), 300);
    
    // Afficher les records
    displayRecords();
    
    // Afficher les mesures corporelles
    displayBodyMeasurements();
    
    // Afficher les photos
    displayProgressPhotos();
    
    // Ajouter les animations
    addAnimations();
renderCalendar();
    displayMusclesThisWeek();
    updateAdvancedStats();
    
    console.log('✅ Stats Ultra initialisées');
}

function loadStatsData() {
    const sessions = getSessions();
    
    if (!sessions || sessions.length === 0) {
        console.log('⚠️ Aucune session trouvée, utilisation de données de démo');
        loadDemoData();
        return;
    }
    
    // Calculer les stats
    const currentWeek = parseInt(localStorage.getItem('currentWeek')) || 1;
    
    // Stats principales
    const totalSessions = sessions.length;
    const totalVolume = statsEngine.getTotalVolume(sessions);
    const streak = statsEngine.calculateProgressionStreak(sessions);
    
    // Volume par muscle
    const volumeByMuscle = statsEngine.calculateVolumeByMuscle(sessions);
    
    // Zones d'intensité
    const intensityZones = statsEngine.calculateIntensityDistribution(sessions);
    
    // Stats avancées
    const rirAnalysis = statsEngine.analyzeRIR(sessions);
    const restAnalysis = statsEngine.analyzeRestPeriods(sessions);
    const avgTUT = statsEngine.getAverageTUT(sessions);
    
    // Progression ce mois
    const monthProgress = calculateMonthProgress(sessions);
    
    // Mettre à jour l'affichage
    updateStatsDisplay({
        totalSessions,
        totalVolume,
        streak,
        volumeByMuscle,
        intensityZones,
        avgRIR: rirAnalysis.average,
        avgRest: restAnalysis.average,
        avgTUT: avgTUT,
        monthProgress: monthProgress,
        sessions: sessions
    });
}

function getSessions() {
    try {
        const sessions = localStorage.getItem('completedSessions');
        if (sessions) return JSON.parse(sessions);
    } catch (e) {
        console.error('Erreur chargement sessions:', e);
    }
    return null;
}

function loadDemoData() {
    const demoSessions = generateDemoSessions();
    const volumeByMuscle = statsEngine.calculateVolumeByMuscle(demoSessions);
    const intensityZones = statsEngine.calculateIntensityDistribution(demoSessions);
    
    updateStatsDisplay({
        totalSessions: 24,
        totalVolume: 12500,
        streak: 5,
        volumeByMuscle,
        intensityZones,
        avgRIR: 2.5,
        avgRest: 120,
        avgTUT: 45,
        monthProgress: 12,
        sessions: demoSessions
    });
}

function generateDemoSessions() {
    const muscles = ['Pectoraux', 'Dos', 'Jambes', 'Épaules', 'Bras'];
    const sessions = [];
    
    for (let i = 1; i <= 8; i++) {
        sessions.push({
            week: i,
            date: new Date(Date.now() - (8 - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
            exercises: muscles.map(muscle => ({
                name: `Exercice ${muscle}`,
                primaryMuscle: muscle,
                secondaryMuscles: [],
                sets: 4,
                reps: 10,
                weight: 50 + Math.random() * 30,
                rpe: 7 + Math.random() * 2,
                rest: 90 + Math.random() * 60,
                tempo: '3-1-2'
            }))
        });
    }
    
    return sessions;
}

function calculateMonthProgress(sessions) {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentSessions = sessions.filter(s => new Date(s.date) > monthAgo);
    const oldSessions = sessions.filter(s => new Date(s.date) <= monthAgo);
    
    if (oldSessions.length === 0) return 0;
    
    const recentVolume = statsEngine.getTotalVolume(recentSessions);
    const oldVolume = statsEngine.getTotalVolume(oldSessions);
    
    return oldVolume > 0 ? Math.round(((recentVolume - oldVolume) / oldVolume) * 100) : 0;
}

function updateStatsDisplay(stats) {
    // Stats principales avec animations
    const totalSessionsEl = document.getElementById('total-sessions');
    if (totalSessionsEl) {
        statsUI.animateNumber(totalSessionsEl, 0, stats.totalSessions, 1500);
    }
    
    const totalVolumeEl = document.getElementById('total-volume');
    if (totalVolumeEl) {
        statsUI.animateNumber(totalVolumeEl, 0, Math.round(stats.totalVolume), 2000, 'kg');
    }
    
    const streakEl = document.getElementById('streak-days');
    if (streakEl) {
        statsUI.animateNumber(streakEl, 0, stats.streak, 1000);
    }
    
    const monthProgressEl = document.getElementById('month-progress');
    if (monthProgressEl) {
        monthProgressEl.textContent = (stats.monthProgress > 0 ? '+' : '') + stats.monthProgress + '%';
    }
    
    // Stats avancées
    const avgRIREl = document.getElementById('avg-rir');
    if (avgRIREl && stats.avgRIR) {
        avgRIREl.textContent = stats.avgRIR.toFixed(1);
    }
    
    const avgRestEl = document.getElementById('avg-rest');
    if (avgRestEl && stats.avgRest) {
        avgRestEl.textContent = Math.round(stats.avgRest) + 's';
    }
    
    const avgTUTEl = document.getElementById('avg-tut');
    if (avgTUTEl && stats.avgTUT) {
        avgTUTEl.textContent = Math.round(stats.avgTUT) + 's';
    }
    
    const streakProgressEl = document.getElementById('streak-progress');
    if (streakProgressEl) {
        streakProgressEl.textContent = stats.streak;
    }
    
    // Zone hypertrophie %
    if (stats.intensityZones) {
        const total = stats.intensityZones.force + stats.intensityZones.hypertrophie + stats.intensityZones.endurance;
        if (total > 0) {
            const hypertrophyPercent = Math.round((stats.intensityZones.hypertrophie / total) * 100);
            const hypertrophyEl = document.getElementById('hypertrophy-percent');
            if (hypertrophyEl) {
                hypertrophyEl.textContent = hypertrophyPercent + '%';
            }
        }
    }
    
    // Progression semaine
    const currentWeek = parseInt(localStorage.getItem('currentWeek')) || 1;
    const weekSessions = stats.sessions.filter(s => s.week === currentWeek);
    const weekVolume = statsEngine.getTotalVolume(weekSessions);
    
    const weekProgressPercentEl = document.getElementById('week-progress-percent');
    if (weekProgressPercentEl) {
        const progress = Math.min(Math.round((weekSessions.length / 5) * 100), 100);
        weekProgressPercentEl.textContent = progress + '%';
        
        const progressBar = document.getElementById('week-progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }
    
    const weekSessionsEl = document.getElementById('week-sessions');
    if (weekSessionsEl) {
        weekSessionsEl.textContent = `${weekSessions.length}/5 SÉANCES`;
    }
    
    const weekVolumeEl = document.getElementById('week-volume');
    if (weekVolumeEl) {
        weekVolumeEl.textContent = Math.round(weekVolume) + 'kg VOLUME';
    }
}

function renderAllCharts() {
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js non chargé');
        return;
    }
    
    const sessions = getSessions() || generateDemoSessions();
    const volumeByMuscle = statsEngine.calculateVolumeByMuscle(sessions);
    const intensityZones = statsEngine.calculateIntensityDistribution(sessions);
    
    // Chart volume par muscle
    try {
        statsUI.renderVolumeByMuscleChart('volume-chart', volumeByMuscle);
        console.log('✅ Chart volume créé');
    } catch (e) {
        console.error('❌ Erreur chart volume:', e);
    }
    
    // Chart progression
    try {
        statsUI.renderProgressionChart('progression-chart', sessions);
        console.log('✅ Chart progression créé');
    } catch (e) {
        console.error('❌ Erreur chart progression:', e);
    }
    
    // Chart intensité
    try {
        statsUI.renderIntensityZoneChart('intensity-chart', intensityZones);
        console.log('✅ Chart intensité créé');
    } catch (e) {
        console.error('❌ Erreur chart intensité:', e);
    }
}

function displayRecords() {
    const records = prDetector.getAllRecords();
    const container = document.getElementById('records-list');
    
    if (!container) return;
    
    if (records.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">
                Aucun record enregistré. Commence à t'entraîner ! 💪
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    records.slice(0, 5).forEach(record => {
        const div = document.createElement('div');
        div.className = 'record-item';
        div.innerHTML = `
            <div class="record-info">
                <div class="record-exercise">${record.exercise}</div>
                <div class="record-details">${record.weight}kg × ${record.reps} reps • ${new Date(record.date).toLocaleDateString()}</div>
            </div>
            <div class="record-badge">🏆</div>
        `;
        container.appendChild(div);
    });
}

function displayBodyMeasurements() {
    const latest = bodyTracker.getLatestMeasurement();
    
    if (!latest) return;
    
    const bodyWeightEl = document.getElementById('body-weight');
    if (bodyWeightEl) bodyWeightEl.textContent = latest.weight + ' kg';
    
    const bodyFatEl = document.getElementById('body-fat');
    if (bodyFatEl) bodyFatEl.textContent = latest.bodyFat + ' %';
    
    const bodyWaistEl = document.getElementById('body-waist');
    if (bodyWaistEl) bodyWaistEl.textContent = latest.waist + ' cm';
    
    const bodyChestEl = document.getElementById('body-chest');
    if (bodyChestEl) bodyChestEl.textContent = latest.chest + ' cm';
    
    // Calculer les tendances
    const measurements = bodyTracker.measurements;
    if (measurements.length >= 2) {
        const previous = measurements[measurements.length - 2];
        
        updateTrend('weight-trend', latest.weight, previous.weight);
        updateTrend('fat-trend', latest.bodyFat, previous.bodyFat, true);
        updateTrend('waist-trend', latest.waist, previous.waist, true);
        updateTrend('chest-trend', latest.chest, previous.chest);
    }
}

function updateTrend(elementId, current, previous, inverse = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    const diff = current - previous;
    if (diff === 0) {
        el.textContent = '→ stable';
        el.className = 'measurement-trend';
        return;
    }
    
    const isPositive = inverse ? diff < 0 : diff > 0;
    el.className = `measurement-trend ${isPositive ? 'up' : 'down'}`;
    el.textContent = `${diff > 0 ? '↑' : '↓'} ${Math.abs(diff).toFixed(1)}`;
}

function displayProgressPhotos() {
    const photos = bodyTracker.photos;
    const gallery = document.getElementById('photo-gallery');
    
    if (!gallery) return;
    
    if (photos.length === 0) {
        gallery.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5); grid-column: 1/-1;">
                Aucune photo. Capture tes progrès ! 📸
            </div>
        `;
        return;
    }
    
    gallery.innerHTML = '';
    photos.forEach(photo => {
        const div = document.createElement('div');
        div.className = 'photo-item';
        div.innerHTML = `
            <img src="${photo.dataUrl}" alt="Progress photo">
            <div class="photo-date">${new Date(photo.date).toLocaleDateString()}</div>
        `;
        gallery.appendChild(div);
    });
}

function addAnimations() {
    // Ajouter neural pulse
    statsUI.addNeuralPulse([
        'total-sessions',
        'total-volume',
        'streak-days',
        'week-progress-percent'
    ]);
    
    // Ajouter scan holographique
    statsUI.addHolographicScan([
        '.chart-container',
        '.progress-card',
        '.calculator-container'
    ]);
}

// ============================================
// FONCTIONS INTERACTIVES
// ============================================

function calculateWarmup() {
    const weight = parseFloat(document.getElementById('warmup-weight').value);
    if (!weight || isNaN(weight)) {
        alert('⚠️ Entre un poids valide !');
        return;
    }
    
    const warmupSets = calculators.calculateWarmup(weight);
    const resultDiv = document.getElementById('warmup-result');
    
    resultDiv.innerHTML = '<div class="warmup-sets">' + 
        warmupSets.map((set, i) => `
            <div class="warmup-set">
                <span class="warmup-set-label">Set ${i + 1}</span>
                <span class="warmup-set-value">${set.weight}kg × ${set.reps} reps (RPE ${set.rpe})</span>
            </div>
        `).join('') +
        '</div>';
}

function calculatePlates() {
    const weight = parseFloat(document.getElementById('plate-weight').value);
    if (!weight || isNaN(weight)) {
        alert('⚠️ Entre un poids valide !');
        return;
    }
    
    const result = calculators.calculatePlates(weight);
    const resultDiv = document.getElementById('plate-result');
    
    resultDiv.innerHTML = `
        <div class="plate-visual">
            <div class="barbell"></div>
            ${result.perSide.map(plate => 
                `<div class="plate plate-${plate.toString().replace('.', '-')}">${plate}</div>`
            ).join('')}
            <div class="barbell"></div>
            ${result.perSide.map(plate => 
                `<div class="plate plate-${plate.toString().replace('.', '-')}">${plate}</div>`
            ).join('')}
        </div>
        <div style="text-align: center; margin-top: 16px; font-size: 14px; color: rgba(255,255,255,0.7);">
            <strong>${result.perSide.length} disques par côté</strong><br>
            Total: ${result.total}kg ${result.difference > 0 ? `(${result.difference}kg de différence)` : ''}
        </div>
    `;
}

function openMeasurementModal() {
    const weight = prompt('💪 Poids (kg):');
    if (!weight) return;
    
    const bodyFat = prompt('📊 Body fat (%):');
    if (!bodyFat) return;
    
    const waist = prompt('📏 Tour de taille (cm):');
    if (!waist) return;
    
    const chest = prompt('💪 Tour de poitrine (cm):');
    if (!chest) return;
    
    bodyTracker.addMeasurement({
        weight: parseFloat(weight),
        bodyFat: parseFloat(bodyFat),
        waist: parseFloat(waist),
        chest: parseFloat(chest)
    });
    
    displayBodyMeasurements();
    alert('✅ Mesure ajoutée !');
}

function openPhotoModal() {
    alert('📸 Fonctionnalité photos à venir !\n\nEn attendant, tu peux prendre des photos avec ton téléphone et les sauvegarder dans un album dédié.');
}

function generateMonthlyReport() {
    const sessions = getSessions() || generateDemoSessions();
    
    let report = '📊 RAPPORT MENSUEL\n\n';
    report += `Séances: ${sessions.length}\n`;
    report += `Volume total: ${Math.round(statsEngine.getTotalVolume(sessions))}kg\n`;
    report += `Intensité moyenne: ${statsEngine.getAverageIntensity(sessions).toFixed(1)} RPE\n\n`;
    
    const volumeByMuscle = statsEngine.calculateVolumeByMuscle(sessions);
    report += 'Volume par muscle:\n';
    Object.entries(volumeByMuscle).forEach(([muscle, data]) => {
        report += `- ${muscle}: ${Math.round(data.volume)}kg (${data.setsPerWeek} séries)\n`;
    });
    
    alert(report);
}

function generateYearReview() {
    alert('🎉 ANNÉE EN REVUE\n\nFonctionnalité complète à venir !\n\nTu pourras voir :\n- Ton meilleur mois\n- Tous tes records battus\n- Le muscle le plus travaillé\n- Ton évolution en graphiques');
}

function exportToPDF() {
    alert('📄 EXPORT PDF\n\nFonctionnalité en développement !\n\nBientôt tu pourras exporter :\n- Tous tes rapports\n- Tes graphiques\n- Tes mesures corporelles\n- Tes photos de progression');
}

// Initialiser au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initStats, 800);
    });
} else {
    setTimeout(initStats, 800);
}

// Réinitialiser quand on change d'onglet vers STATS
if (window.switchTab) {
    const originalSwitchTab = window.switchTab;
    window.switchTab = function(tabName) {
        originalSwitchTab(tabName);
        if (tabName === 'stats') {
            setTimeout(initStats, 200);
        }
    };
}
// ============================================
// CALENDRIER 7 JOURS
// ============================================
function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const today = new Date();
    
    for (let i = -3; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        if (i < 0) cell.classList.add('completed');
        if (i === 0) cell.classList.add('active');
        
        const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
        cell.innerHTML = '<div class="cell-num">' + date.getDate() + '</div><div class="cell-day">' + days[date.getDay()] + '</div><div class="cell-icon">' + (i < 0 ? '✅' : i === 0 ? '→' : '○') + '</div>';
        grid.appendChild(cell);
    }
}

// ============================================
// MUSCLES TRAVAILLES
// ============================================
function displayMusclesThisWeek() {
    const sessions = getSessions() || generateDemoSessions();
    const week = parseInt(localStorage.getItem('currentWeek')) || 1;
    
    document.getElementById('current-week-display').textContent = week;
    
    const muscles = statsEngine.getMusclesWorkedThisWeek(sessions, week);
    
    const primaryList = document.getElementById('primary-muscles-list');
    if (primaryList) {
        primaryList.innerHTML = '';
        Object.entries(muscles.primary).forEach(function(entry) {
            const muscle = entry[0];
            const data = entry[1];
            const div = document.createElement('div');
            div.style.cssText = 'padding: 8px; margin-bottom: 6px; background: rgba(0,229,255,0.1); border-left: 3px solid #00e5ff; border-radius: 6px;';
            div.innerHTML = '<div style="font-weight: 700;">' + muscle + '</div><div style="font-size: 12px; color: rgba(255,255,255,0.6);">' + data.sets + ' series</div>';
            primaryList.appendChild(div);
        });
    }
    
    const secondaryList = document.getElementById('secondary-muscles-list');
    if (secondaryList) {
        secondaryList.innerHTML = '';
        Object.entries(muscles.secondary).forEach(function(entry) {
            const muscle = entry[0];
            const data = entry[1];
            const div = document.createElement('div');
            div.style.cssText = 'padding: 8px; margin-bottom: 6px; background: rgba(155,89,255,0.1); border-left: 3px solid #9b59ff; border-radius: 6px;';
            div.innerHTML = '<div style="font-weight: 700;">' + muscle + '</div><div style="font-size: 12px; color: rgba(255,255,255,0.6);">' + data.sets + ' series</div>';
            secondaryList.appendChild(div);
        });
    }
}

// ============================================
// STATS AVANCEES SUPPLEMENTAIRES
// ============================================
function updateAdvancedStats() {
    const sessions = getSessions() || generateDemoSessions();
    
    var fatigueEl = document.getElementById('fatigue-index');
    if (fatigueEl) {
        var fatigue = statsEngine.calculateCumulativeFatigue(sessions);
        fatigueEl.textContent = fatigue.level;
    }
    
    var variationEl = document.getElementById('exercise-variation');
    if (variationEl) {
        var variation = statsEngine.analyzeExerciseVariation(sessions);
        var total = Object.values(variation).reduce(function(a, b) { return a + b; }, 0);
        variationEl.textContent = total;
    }
    
    var tempoEl = document.getElementById('controlled-tempo');
    if (tempoEl) {
        var tempos = statsEngine.analyzeTempoDistribution(sessions);
        var totalSets = tempos.controlled + tempos.explosive + tempos.standard;
        var percent = totalSets > 0 ? Math.round((tempos.controlled / totalSets) * 100) : 0;
        tempoEl.textContent = percent + '%';
    }
    
    var symmetryEl = document.getElementById('symmetry-score');
    if (symmetryEl) {
        symmetryEl.textContent = '100%';
    }
}

console.log('📊 Stats Init loaded');
