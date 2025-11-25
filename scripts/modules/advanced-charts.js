/**
 * ADVANCED CHARTS MODULE
 * TUT par exercice + Tempo Distribution
 */

// TUT PAR EXERCICE - Bar Chart Horizontal
function renderTUTByExerciseChart(workoutData) {
    const ctx = document.getElementById('tut-by-exercise-chart');
    if (!ctx) return;
    
    // Extraire TUT par exercice
    const exercises = workoutData || [];
    const labels = exercises.map(e => e.name?.substring(0, 15) || 'Exercice');
    const tutValues = exercises.map(e => e.tut || 0);
    
    // Couleurs dégradées vert → cyan → violet
    const colors = tutValues.map(tut => {
        if (tut < 30) return '#00ff9f';
        if (tut < 45) return '#00e5ff';
        return '#9b59ff';
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: tutValues,
                backgroundColor: colors,
                borderRadius: 8,
                barThickness: 20
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { 
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#fff' }
                },
                y: { 
                    grid: { display: false },
                    ticks: { color: '#fff', font: { size: 10 } }
                }
            }
        }
    });
}

// TEMPO DISTRIBUTION - Doughnut Chart
function renderTempoDistributionChart(workoutData) {
    const ctx = document.getElementById('tempo-distribution-chart');
    if (!ctx) return;
    
    // Compter les tempos
    const tempos = { controlled: 0, explosive: 0, slow: 0 };
    
    (workoutData || []).forEach(ex => {
        const tempo = ex.tempo || '3-1-2';
        const [ecc, pause, conc] = tempo.split('-').map(Number);
        const total = ecc + pause + conc;
        
        if (total >= 6) tempos.slow++;
        else if (pause === 0 && total <= 4) tempos.explosive++;
        else tempos.controlled++;
    });
    
    const total = tempos.controlled + tempos.explosive + tempos.slow || 1;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Contrôlé', 'Explosif', 'Lent'],
            datasets: [{
                data: [tempos.controlled, tempos.explosive, tempos.slow],
                backgroundColor: ['#00e5ff', '#ff6b35', '#9b59ff'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            cutout: '60%',
            plugins: { legend: { display: false } }
        }
    });
    
    // Légende custom
    const legend = document.getElementById('tempo-legend');
    if (legend) {
        legend.innerHTML = `
            <div style="display:flex;align-items:center;gap:6px;">
                <div style="width:12px;height:12px;background:#00e5ff;border-radius:50%;"></div>
                <span style="color:#fff;font-size:11px;">Contrôlé ${Math.round(tempos.controlled/total*100)}%</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
                <div style="width:12px;height:12px;background:#ff6b35;border-radius:50%;"></div>
                <span style="color:#fff;font-size:11px;">Explosif ${Math.round(tempos.explosive/total*100)}%</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
                <div style="width:12px;height:12px;background:#9b59ff;border-radius:50%;"></div>
                <span style="color:#fff;font-size:11px;">Lent ${Math.round(tempos.slow/total*100)}%</span>
            </div>
        `;
    }
}

window.renderTUTByExerciseChart = renderTUTByExerciseChart;
window.renderTempoDistributionChart = renderTempoDistributionChart;

console.log('✅ Advanced Charts module loaded');
