// STATS INIT - Version simplifiée pour démo
let statsEngine, statsUI, bodyTracker, prDetector, calculators;

function initStats() {
    console.log('🚀 Init Stats...');
    
    // Initialiser les modules
    statsEngine = new StatsEngine();
    statsUI = new StatsUI(statsEngine);
    bodyTracker = new BodyTracker();
    prDetector = new PRDetector();
    calculators = new Calculators();
    
    // Charger données démo
    loadDemoData();
}

function loadDemoData() {
    const demoSessions = generateDemoSessions();
    const volumeByMuscle = statsEngine.calculateVolumeByMuscle(demoSessions);
    const intensityZones = statsEngine.calculateIntensityDistribution(demoSessions);
    
    // Mettre à jour l'affichage
    document.getElementById('total-sessions').textContent = '24';
    document.getElementById('total-volume').textContent = '12500kg';
    document.getElementById('streak-days').textContent = '5';
    document.getElementById('month-progress').textContent = '+12%';
    
    // Graphiques
    setTimeout(() => {
        if (typeof Chart !== 'undefined') {
            statsUI.renderVolumeByMuscleChart('volume-chart', volumeByMuscle);
            statsUI.renderProgressionChart('progression-chart', demoSessions);
            statsUI.renderIntensityZoneChart('intensity-chart', intensityZones);
        }
    }, 500);
}

function generateDemoSessions() {
    const muscles = ['Pectoraux', 'Dos', 'Jambes', 'Épaules', 'Bras'];
    return Array.from({length: 8}, (_, i) => ({
        week: i + 1,
        exercises: muscles.map(m => ({
            primaryMuscle: m,
            sets: 4,
            reps: 10,
            weight: 50 + Math.random() * 30,
            rpe: 7
        }))
    }));
}

function calculateWarmup() {
    const weight = parseFloat(document.getElementById('warmup-weight').value);
    if (!weight) return alert('Entre un poids !');
    
    const sets = calculators.calculateWarmup(weight);
    document.getElementById('warmup-result').innerHTML = 
        '<div class="warmup-sets">' + 
        sets.map((s, i) => `<div class="warmup-set"><span>${s.weight}kg × ${s.reps}</span></div>`).join('') +
        '</div>';
}

function calculatePlates() {
    const weight = parseFloat(document.getElementById('plate-weight').value);
    if (!weight) return alert('Entre un poids !');
    
    const result = calculators.calculatePlates(weight);
    document.getElementById('plate-result').innerHTML = 
        `<div style="text-align:center; padding:20px; color:#00e5ff;">${result.perSide.join(', ')} par côté</div>`;
}

// Init au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initStats, 500));
} else {
    setTimeout(initStats, 500);
}
