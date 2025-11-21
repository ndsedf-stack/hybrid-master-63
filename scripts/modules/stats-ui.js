// ============================================
// STATS UI - Graphiques Chart.js + Animations
// ============================================

class StatsUI {
    constructor(statsEngine) {
        this.engine = statsEngine;
        this.charts = {};
    }

    // ============================================
    // GRAPHIQUES CHART.JS
    // ============================================
    
    renderVolumeByMuscleChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        const muscles = Object.keys(data);
        const volumes = muscles.map(m => data[m].volume);
        const sets = muscles.map(m => data[m].setsPerWeek);
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: muscles,
                datasets: [{
                    label: 'Volume (kg)',
                    data: volumes,
                    backgroundColor: muscles.map(m => {
                        const status = data[m].status;
                        return status === 'optimal' ? 'rgba(0, 255, 159, 0.6)' :
                               status === 'sous-optimal' ? 'rgba(255, 107, 53, 0.6)' :
                               'rgba(255, 53, 94, 0.6)';
                    }),
                    borderColor: 'rgba(0, 229, 255, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            afterLabel: (context) => {
                                const muscle = context.label;
                                return `${data[muscle].setsPerWeek} séries/sem\nStatus: ${data[muscle].status}`;
                            }
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        borderColor: 'rgba(0, 229, 255, 0.8)',
                        borderWidth: 2
                    }
                },
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
    
    renderProgressionChart(canvasId, sessions) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        const weeks = [...new Set(sessions.map(s => s.week))].sort((a, b) => a - b);
        const volumeByWeek = weeks.map(week => {
            return sessions
                .filter(s => s.week === week)
                .reduce((sum, s) => sum + this.engine.getTotalVolume([s]), 0);
        });
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeks.map(w => `S${w}`),
                datasets: [{
                    label: 'Volume total (kg)',
                    data: volumeByWeek,
                    borderColor: 'rgba(0, 229, 255, 1)',
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: 'rgba(155, 89, 255, 1)',
                    pointBorderColor: 'rgba(0, 229, 255, 1)',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
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
    
    renderIntensityZoneChart(canvasId, zones) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Force (>85%)', 'Hypertrophie (65-85%)', 'Endurance (<65%)'],
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
                        labels: { color: 'rgba(255, 255, 255, 0.9)' }
                    }
                }
            }
        });
    }

    // ============================================
    // ANIMATIONS FUTURISTES
    // ============================================
    
    startBreathingAnimation(elementId) {
        const el = document.getElementById(elementId);
        if (!el) return;
        
        el.classList.add('breathing-animation');
    }
    
    addNeuralPulse(elements) {
        elements.forEach(el => {
            if (typeof el === 'string') el = document.getElementById(el);
            if (el) el.classList.add('neural-pulse');
        });
    }
    
    addHolographicScan(cards) {
        cards.forEach(card => {
            if (typeof card === 'string') card = document.querySelector(card);
            if (card) {
                card.classList.add('holographic-scan');
                card.addEventListener('mouseenter', () => {
                    card.classList.add('scanning');
                    setTimeout(() => card.classList.remove('scanning'), 2000);
                });
            }
        });
    }
    
    showPRNotification(exercise, newWeight, oldWeight) {
        const toast = document.createElement('div');
        toast.className = 'pr-toast glass';
        toast.innerHTML = `
            <div class="pr-icon">🏆</div>
            <div class="pr-content">
                <div class="pr-title">NOUVEAU RECORD !</div>
                <div class="pr-exercise">${exercise}</div>
                <div class="pr-weight">${oldWeight}kg → ${newWeight}kg (+${(newWeight - oldWeight).toFixed(1)}kg)</div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // ============================================
    // MISE À JOUR DOM
    // ============================================
    
    updateStatsDisplay(stats) {
        // Volume total
        const volumeEl = document.querySelector('.stat-box .stat-number');
        if (volumeEl) {
            this.animateNumber(volumeEl, 0, stats.totalVolume, 2000, 'kg');
        }
        
        // Séances
        const sessionsEl = document.querySelectorAll('.stat-box .stat-number')[0];
        if (sessionsEl) {
            this.animateNumber(sessionsEl, 0, stats.totalSessions, 1500);
        }
        
        // Streak
        const streakEl = document.querySelectorAll('.stat-box')[2]?.querySelector('.stat-number');
        if (streakEl) {
            this.animateNumber(streakEl, 0, stats.streak, 1000);
        }
    }
    
    animateNumber(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutQuad(progress));
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeOutQuad(t) {
        return t * (2 - t);
    }
}

// Export
window.StatsUI = StatsUI;
