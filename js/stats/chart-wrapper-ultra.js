// chart-wrapper-ultra.js - SYSTÈME UNIVERSEL DE CRÉATION DE GRAPHIQUES
import * as premiumEffects from './chart-effects-advanced.js';

export function createStatsCard(config) {
    const containerId = config.containerId;
    
    if (!containerId) {
        console.error("containerId is required in config");
        return;
    }
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Container not found:", containerId);
        return;
    }

    // Structure HTML EXACTE comme template
    container.innerHTML = `
        <div class="stats-card">
            <div class="card-header">
                <h3 class="card-title">${config.icon || '📊'} ${config.title || 'Stats'}</h3>
                <div class="period-selector">
                    <button class="period-btn active" data-period="week">S</button>
                    <button class="period-btn" data-period="month">M</button>
                    <button class="period-btn" data-period="quarter">T</button>
                </div>
            </div>
            <div class="card-body">
                <div class="canvas-wrapper">
                    <canvas id="${containerId}-canvas"></canvas>
                </div>
            </div>
            <div class="card-footer">
                <div class="stat-box">
                    <div class="stat-label">SETS</div>
                    <div class="stat-value" id="${containerId}-sets">0</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">TUT</div>
                    <div class="stat-value" id="${containerId}-tut">0:00</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">VOLUME</div>
                    <div class="stat-value" id="${containerId}-volume">0 kg</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">STATUS</div>
                    <div class="stat-value" id="${containerId}-status">-</div>
                </div>
            </div>
        </div>
    `;

    // Setup canvas avec aspect ratio 1:1 FORCÉ
    const canvasWrapper = container.querySelector('.canvas-wrapper');
    const canvas = document.getElementById(`${containerId}-canvas`);
    
    if (!canvas || !canvasWrapper) {
        console.error("Canvas or wrapper not found");
        return;
    }
    
    // FORCER taille carrée
    function resizeCanvas() {
        // ✅ SIMPLE : Prend la largeur du wrapper (déjà carré avec aspect-ratio)
        const size = canvasWrapper.offsetWidth;
        
        canvas.width = size;
        canvas.height = size;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        // Redessiner
        if (config.onRender) {
            const ctx = canvas.getContext('2d');
            const data = config.dataSource ? config.dataSource() : {};
            config.onRender(canvas, ctx, size, data);
            updateFooterStats(containerId, data);
        }
    };
            config.onRender(canvas, ctx, width, data);
            updateFooterStats(containerId, data);
        }
    }
    
    // Première initialisation
    setTimeout(resizeCanvas, 100);
    
    // Resize handler avec debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 300);
    });
    
    // Event listeners pour période
    const periodBtns = container.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            periodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            resizeCanvas();
        });
    });

    const card = container.querySelector('.stats-card');
    if (card) {
        setTimeout(() => {
            premiumEffects.applyAllPremiumEffects(card, {
                intensity: 1,
                particles: 15,
                speed: 1
            });
        }, 100);
    }
}

function updateFooterStats(containerId, data) {
    const setsEl = document.getElementById(`${containerId}-sets`);
    const tutEl = document.getElementById(`${containerId}-tut`);
    const volumeEl = document.getElementById(`${containerId}-volume`);
    const statusEl = document.getElementById(`${containerId}-status`);
    
    if (setsEl && data.totalSets) setsEl.textContent = data.totalSets;
    if (tutEl && data.totalTime) {
        const min = Math.floor(data.totalTime / 60);
        const sec = data.totalTime % 60;
        tutEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
    }
    if (volumeEl && data.totalVolume) {
        volumeEl.textContent = Math.round(data.totalVolume / 1000) + ' kg';
    }
    if (statusEl && data.status) statusEl.textContent = data.status;
}
