// ============================================
// STATS INIT - Initialisation complète
// ============================================

let statsEngine, statsUI, bodyTracker, prDetector, calculators;

function initStats() {
    console.log('🚀 Initialisation Stats Ultra...');
    
    statsEngine = new StatsEngine();
    statsUI = new StatsUI(statsEngine);
    bodyTracker = new BodyTracker();
    prDetector = new PRDetector();
    calculators = new Calculators();
    
    loadStatsData();
    setTimeout(function() { renderAllCharts(); }, 300);
    displayRecords();
    displayBodyMeasurements();
    displayProgressPhotos();
    addAnimations();
    renderCalendar();
    displayMusclesThisWeek();
    updateAdvancedStats();
    
    console.log('✅ Stats Ultra initialisées');
}

function loadStatsData() {
    var sessions = getSessions();
    
    if (!sessions || sessions.length === 0) {
        loadDemoData();
        return;
    }
    
    var currentWeek = parseInt(localStorage.getItem('currentWeek')) || 1;
    var totalSessions = sessions.length;
    var totalVolume = statsEngine.getTotalVolume(sessions);
    var streak = statsEngine.calculateProgressionStreak(sessions);
    var volumeByMuscle = statsEngine.calculateVolumeByMuscle(sessions);
    var intensityZones = statsEngine.calculateIntensityDistribution(sessions);
    var rirAnalysis = statsEngine.analyzeRIR(sessions);
    var restAnalysis = statsEngine.analyzeRestPeriods(sessions);
    var avgTUT = statsEngine.getAverageTUT(sessions);
    var monthProgress = calculateMonthProgress(sessions);
    
    updateStatsDisplay({
        totalSessions: totalSessions,
        totalVolume: totalVolume,
        streak: streak,
        volumeByMuscle: volumeByMuscle,
        intensityZones: intensityZones,
        avgRIR: rirAnalysis.average,
        avgRest: restAnalysis.average,
        avgTUT: avgTUT,
        monthProgress: monthProgress,
        sessions: sessions
    });
}

function getSessions() {
    try {
        var sessions = localStorage.getItem('completedSessions');
        if (sessions) return JSON.parse(sessions);
    } catch (e) {
        console.error('Erreur chargement sessions:', e);
    }
    return null;
}

function loadDemoData() {
    var demoSessions = generateDemoSessions();
    var volumeByMuscle = statsEngine.calculateVolumeByMuscle(demoSessions);
    var intensityZones = statsEngine.calculateIntensityDistribution(demoSessions);
    
    updateStatsDisplay({
        totalSessions: 24,
        totalVolume: 12500,
        streak: 5,
        volumeByMuscle: volumeByMuscle,
        intensityZones: intensityZones,
        avgRIR: 2.5,
        avgRest: 120,
        avgTUT: 45,
        monthProgress: 12,
        sessions: demoSessions
    });
}

function generateDemoSessions() {
    var muscles = ['Pectoraux', 'Dos', 'Jambes', 'Epaules', 'Bras'];
    var secondaryMap = {
        'Pectoraux': ['Triceps', 'Epaules'],
        'Dos': ['Biceps', 'Lombaires'],
        'Jambes': ['Fessiers', 'Mollets'],
        'Epaules': ['Triceps', 'Trapezes'],
        'Bras': ['Avant-bras']
    };
    var sessions = [];
    
    for (var i = 1; i <= 8; i++) {
        sessions.push({
            week: i,
            date: new Date(Date.now() - (8 - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
            exercises: muscles.map(function(muscle) {
                return {
                    name: 'Exercice ' + muscle,
                    primaryMuscle: muscle,
                    secondaryMuscles: secondaryMap[muscle] || [],
                    sets: 4,
                    reps: 10,
                    weight: 50 + Math.random() * 30,
                    rpe: 7 + Math.random() * 2,
                    rest: 90 + Math.random() * 60,
                    tempo: '3-1-2'
                };
            })
        });
    }
    
    return sessions;
}

function calculateMonthProgress(sessions) {
    var now = new Date();
    var monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    var recentSessions = sessions.filter(function(s) { return new Date(s.date) > monthAgo; });
    var oldSessions = sessions.filter(function(s) { return new Date(s.date) <= monthAgo; });
    
    if (oldSessions.length === 0) return 0;
    
    var recentVolume = statsEngine.getTotalVolume(recentSessions);
    var oldVolume = statsEngine.getTotalVolume(oldSessions);
    
    return oldVolume > 0 ? Math.round(((recentVolume - oldVolume) / oldVolume) * 100) : 0;
}

function updateStatsDisplay(stats) {
    var el;
    
    el = document.getElementById('total-sessions');
    if (el) el.textContent = stats.totalSessions;
    
    el = document.getElementById('total-volume');
    if (el) el.textContent = Math.round(stats.totalVolume) + 'kg';
    
    el = document.getElementById('streak-days');
    if (el) el.textContent = stats.streak;
    
    el = document.getElementById('month-progress');
    if (el) el.textContent = (stats.monthProgress > 0 ? '+' : '') + stats.monthProgress + '%';
    
    el = document.getElementById('avg-rir');
    if (el && stats.avgRIR) el.textContent = stats.avgRIR.toFixed(1);
    
    el = document.getElementById('avg-rest');
    if (el && stats.avgRest) el.textContent = Math.round(stats.avgRest) + 's';
    
    el = document.getElementById('avg-tut');
    if (el && stats.avgTUT) el.textContent = Math.round(stats.avgTUT) + 's';
    
    el = document.getElementById('streak-progress');
    if (el) el.textContent = stats.streak;
    
    if (stats.intensityZones) {
        var total = stats.intensityZones.force + stats.intensityZones.hypertrophie + stats.intensityZones.endurance;
        if (total > 0) {
            var hypertrophyPercent = Math.round((stats.intensityZones.hypertrophie / total) * 100);
            el = document.getElementById('hypertrophy-percent');
            if (el) el.textContent = hypertrophyPercent + '%';
        }
    }
    
    var currentWeek = parseInt(localStorage.getItem('currentWeek')) || 1;
    var weekSessions = stats.sessions.filter(function(s) { return s.week === currentWeek; });
    var weekVolume = statsEngine.getTotalVolume(weekSessions);
    
    el = document.getElementById('week-progress-percent');
    if (el) {
        var progress = Math.min(Math.round((weekSessions.length / 5) * 100), 100);
        el.textContent = progress + '%';
        
        var progressBar = document.getElementById('week-progress-bar');
        if (progressBar) progressBar.style.width = progress + '%';
    }
    
    el = document.getElementById('week-sessions');
    if (el) el.textContent = weekSessions.length + '/5 SEANCES';
    
    el = document.getElementById('week-volume');
    if (el) el.textContent = Math.round(weekVolume) + 'kg VOLUME';
}

function renderAllCharts() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js non charge');
        return;
    }
    
    var sessions = getSessions() || generateDemoSessions();
    var volumeByMuscle = statsEngine.calculateVolumeByMuscle(sessions);
    var intensityZones = statsEngine.calculateIntensityDistribution(sessions);
    
    renderVolumeRadarChart('volume-chart', volumeByMuscle);
    renderProgressionChart('progression-chart', sessions);
    renderIntensityChart('intensity-chart', intensityZones);
}

function renderVolumeRadarChart(canvasId, data) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    var muscles = Object.keys(data);
    var volumes = muscles.map(function(m) { return data[m].volume; });
    var maxVolume = Math.max.apply(null, volumes);
    var normalizedVolumes = volumes.map(function(v) { return (v / maxVolume) * 100; });
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: muscles,
            datasets: [{
                label: 'Volume',
                data: normalizedVolumes,
                backgroundColor: 'rgba(0, 229, 255, 0.3)',
                borderColor: 'rgba(0, 229, 255, 1)',
                borderWidth: 3,
                pointBackgroundColor: 'rgba(155, 89, 255, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        display: false
                    },
                    grid: {
                        color: 'rgba(0, 229, 255, 0.2)'
                    },
                    angleLines: {
                        color: 'rgba(0, 229, 255, 0.2)'
                    },
                    pointLabels: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        }
    });
}

function renderProgressionChart(canvasId, sessions) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    var weeks = [];
    sessions.forEach(function(s) {
        if (weeks.indexOf(s.week) === -1) weeks.push(s.week);
    });
    weeks.sort(function(a, b) { return a - b; });
    
    var volumeByWeek = weeks.map(function(week) {
        var weekSessions = sessions.filter(function(s) { return s.week === week; });
        return statsEngine.getTotalVolume(weekSessions);
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks.map(function(w) { return 'S' + w; }),
            datasets: [{
                label: 'Volume (kg)',
                data: volumeByWeek,
                borderColor: 'rgba(0, 229, 255, 1)',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 8,
                pointBackgroundColor: 'rgba(155, 89, 255, 1)',
                pointBorderColor: 'rgba(0, 229, 255, 1)',
                pointBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 229, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                }
            }
        }
    });
}

function renderIntensityChart(canvasId, zones) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Force >85%', 'Hypertrophie 65-85%', 'Endurance <65%'],
            datasets: [{
                data: [zones.force, zones.hypertrophie, zones.endurance],
                backgroundColor: [
                    'rgba(255, 53, 94, 0.8)',
                    'rgba(0, 255, 159, 0.8)',
                    'rgba(0, 229, 255, 0.8)'
                ],
                borderColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: 'rgba(255, 255, 255, 0.9)', font: { size: 11 } }
                }
            }
        }
    });
}

function displayRecords() {
    var records = prDetector.getAllRecords();
    var container = document.getElementById('records-list');
    if (!container) return;
    
    if (records.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">Aucun record. Commence a t\'entrainer ! 💪</div>';
        return;
    }
    
    container.innerHTML = '';
    records.slice(0, 5).forEach(function(record) {
        var div = document.createElement('div');
        div.className = 'record-item';
        div.innerHTML = '<div class="record-info"><div class="record-exercise">' + record.exercise + '</div><div class="record-details">' + record.weight + 'kg x ' + record.reps + ' reps</div></div><div class="record-badge">🏆</div>';
        container.appendChild(div);
    });
}

function displayBodyMeasurements() {
    var latest = bodyTracker.getLatestMeasurement();
    if (!latest) return;
    
    var el;
    el = document.getElementById('body-weight');
    if (el) el.textContent = latest.weight + ' kg';
    
    el = document.getElementById('body-fat');
    if (el) el.textContent = latest.bodyFat + ' %';
    
    el = document.getElementById('body-waist');
    if (el) el.textContent = latest.waist + ' cm';
    
    el = document.getElementById('body-chest');
    if (el) el.textContent = latest.chest + ' cm';
}

function displayProgressPhotos() {
    var photos = bodyTracker.photos;
    var gallery = document.getElementById('photo-gallery');
    if (!gallery) return;
    
    if (photos.length === 0) {
        gallery.innerHTML = '<div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5); grid-column: 1/-1;">Aucune photo. Capture tes progres ! 📸</div>';
        return;
    }
    
    gallery.innerHTML = '';
    photos.forEach(function(photo) {
        var div = document.createElement('div');
        div.className = 'photo-item';
        div.innerHTML = '<img src="' + photo.dataUrl + '" alt="Progress"><div class="photo-date">' + new Date(photo.date).toLocaleDateString() + '</div>';
        gallery.appendChild(div);
    });
}

function addAnimations() {
    statsUI.addNeuralPulse(['total-sessions', 'total-volume', 'streak-days', 'week-progress-percent']);
    statsUI.addHolographicScan(['.chart-container', '.progress-card', '.calculator-container']);
}

function renderCalendar() {
    var grid = document.getElementById('calendar-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
    grid.style.gap = '8px';
    
    var today = new Date();
    var days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    
    for (var i = -3; i <= 3; i++) {
        var date = new Date(today);
        date.setDate(date.getDate() + i);
        
        var cell = document.createElement('div');
        cell.className = 'calendar-cell';
        cell.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; background: rgba(0,0,0,0.3); border: 2px solid rgba(0,229,255,0.3); border-radius: 12px; min-height: 80px;';
        
        if (i < 0) {
            cell.style.borderColor = 'rgba(0,255,159,0.5)';
            cell.style.background = 'rgba(0,255,159,0.1)';
        }
        if (i === 0) {
            cell.style.borderColor = 'rgba(0,229,255,0.8)';
            cell.style.background = 'rgba(0,229,255,0.2)';
            cell.style.boxShadow = '0 0 20px rgba(0,229,255,0.4)';
        }
        
        var icon = i < 0 ? '✅' : (i === 0 ? '🔥' : '○');
        cell.innerHTML = '<div style="font-size: 18px; font-weight: 900; color: #fff;">' + date.getDate() + '</div><div style="font-size: 11px; color: rgba(255,255,255,0.6); margin: 4px 0;">' + days[date.getDay()] + '</div><div style="font-size: 16px;">' + icon + '</div>';
        
        grid.appendChild(cell);
    }
}

function displayMusclesThisWeek() {
    var sessions = getSessions() || generateDemoSessions();
    var week = parseInt(localStorage.getItem('currentWeek')) || 1;
    
    var weekDisplay = document.getElementById('current-week-display');
    if (weekDisplay) weekDisplay.textContent = week;
    
    var muscles = statsEngine.getMusclesWorkedThisWeek(sessions, week);
    
    var primaryList = document.getElementById('primary-muscles-list');
    if (primaryList) {
        primaryList.innerHTML = '';
        var primaryEntries = Object.entries(muscles.primary);
        
        if (primaryEntries.length === 0) {
            primaryList.innerHTML = '<div style="color: rgba(255,255,255,0.5); font-size: 12px;">Aucun muscle cette semaine</div>';
        } else {
            primaryEntries.forEach(function(entry) {
                var muscle = entry[0];
                var data = entry[1];
                var div = document.createElement('div');
                div.style.cssText = 'padding: 10px 12px; margin-bottom: 8px; background: rgba(0,229,255,0.15); border-left: 3px solid #00e5ff; border-radius: 8px;';
                div.innerHTML = '<div style="font-weight: 700; color: #fff; font-size: 14px;">' + muscle + '</div><div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 2px;">' + data.sets + ' series • ' + Math.round(data.volume) + 'kg</div>';
                primaryList.appendChild(div);
            });
        }
    }
    
    var secondaryList = document.getElementById('secondary-muscles-list');
    if (secondaryList) {
        secondaryList.innerHTML = '';
        var secondaryEntries = Object.entries(muscles.secondary);
        
        if (secondaryEntries.length === 0) {
            secondaryList.innerHTML = '<div style="color: rgba(255,255,255,0.5); font-size: 12px;">Aucun muscle secondaire</div>';
        } else {
            secondaryEntries.forEach(function(entry) {
                var muscle = entry[0];
                var data = entry[1];
                var div = document.createElement('div');
                div.style.cssText = 'padding: 10px 12px; margin-bottom: 8px; background: rgba(155,89,255,0.15); border-left: 3px solid #9b59ff; border-radius: 8px;';
                div.innerHTML = '<div style="font-weight: 700; color: #fff; font-size: 14px;">' + muscle + '</div><div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 2px;">' + data.sets + ' series</div>';
                secondaryList.appendChild(div);
            });
        }
    }
}

function updateAdvancedStats() {
    var sessions = getSessions() || generateDemoSessions();
    var el;
    
    el = document.getElementById('fatigue-index');
    if (el) {
        var fatigue = statsEngine.calculateCumulativeFatigue(sessions);
        el.textContent = fatigue.level;
        if (fatigue.level === 'elevee') {
            el.style.color = '#ff355e';
        } else if (fatigue.level === 'moderee') {
            el.style.color = '#ff6b35';
        } else {
            el.style.color = '#00ff9f';
        }
    }
    
    el = document.getElementById('exercise-variation');
    if (el) {
        var variation = statsEngine.analyzeExerciseVariation(sessions);
        var total = 0;
        Object.values(variation).forEach(function(v) { total += v; });
        el.textContent = total;
    }
    
    el = document.getElementById('controlled-tempo');
    if (el) {
        var tempos = statsEngine.analyzeTempoDistribution(sessions);
        var totalSets = tempos.controlled + tempos.explosive + tempos.standard;
        var percent = totalSets > 0 ? Math.round((tempos.controlled / totalSets) * 100) : 0;
        el.textContent = percent + '%';
    }
    
    el = document.getElementById('symmetry-score');
    if (el) {
        el.textContent = '98%';
        el.style.color = '#00ff9f';
    }
}

function calculateWarmup() {
    var weight = parseFloat(document.getElementById('warmup-weight').value);
    if (!weight || isNaN(weight)) {
        alert('Entre un poids valide !');
        return;
    }
    
    var warmupSets = calculators.calculateWarmup(weight);
    var resultDiv = document.getElementById('warmup-result');
    
    var html = '<div style="margin-top: 16px;">';
    warmupSets.forEach(function(set, i) {
        html += '<div style="display: flex; justify-content: space-between; padding: 12px; margin-bottom: 8px; background: rgba(255,107,53,0.2); border-left: 3px solid #ff6b35; border-radius: 8px;"><span style="color: rgba(255,255,255,0.7);">Set ' + (i + 1) + '</span><span style="font-weight: 700; color: #ff6b35;">' + set.weight + 'kg x ' + set.reps + '</span></div>';
    });
    html += '</div>';
    resultDiv.innerHTML = html;
}

function calculatePlates() {
    var weight = parseFloat(document.getElementById('plate-weight').value);
    if (!weight || isNaN(weight)) {
        alert('Entre un poids valide !');
        return;
    }
    
    var result = calculators.calculatePlates(weight);
    var resultDiv = document.getElementById('plate-result');
    
    var html = '<div style="text-align: center; padding: 20px; background: rgba(0,229,255,0.1); border-radius: 12px; margin-top: 16px;">';
    html += '<div style="font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 8px;">PAR COTE:</div>';
    html += '<div style="font-size: 24px; font-weight: 900; color: #00e5ff;">' + result.perSide.join(' + ') + '</div>';
    html += '<div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 8px;">Total: ' + result.total + 'kg</div>';
    html += '</div>';
    resultDiv.innerHTML = html;
}

function openMeasurementModal() {
    var weight = prompt('Poids (kg):');
    if (!weight) return;
    var bodyFat = prompt('Body fat (%):');
    if (!bodyFat) return;
    var waist = prompt('Tour de taille (cm):');
    if (!waist) return;
    var chest = prompt('Tour de poitrine (cm):');
    if (!chest) return;
    
    bodyTracker.addMeasurement({
        weight: parseFloat(weight),
        bodyFat: parseFloat(bodyFat),
        waist: parseFloat(waist),
        chest: parseFloat(chest)
    });
    
    displayBodyMeasurements();
    alert('Mesure ajoutee !');
}

function openPhotoModal() {
    alert('Fonctionnalite photos a venir !');
}

function generateMonthlyReport() {
    var sessions = getSessions() || generateDemoSessions();
    var report = '📊 RAPPORT MENSUEL\n\n';
    report += 'Seances: ' + sessions.length + '\n';
    report += 'Volume total: ' + Math.round(statsEngine.getTotalVolume(sessions)) + 'kg\n';
    report += 'Intensite moyenne: ' + statsEngine.getAverageIntensity(sessions).toFixed(1) + ' RPE\n';
    alert(report);
}

function generateYearReview() {
    alert('🎉 ANNEE EN REVUE\n\nFonctionnalite a venir !');
}

function exportToPDF() {
    alert('📄 EXPORT PDF\n\nFonctionnalite en developpement !');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initStats, 800);
    });
} else {
    setTimeout(initStats, 800);
}

console.log('📊 Stats Init loaded');
