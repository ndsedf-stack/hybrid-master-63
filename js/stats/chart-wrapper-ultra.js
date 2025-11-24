import * as effects from './chart-effects-advanced.js';

// chart-wrapper-ultra.js - SYSTÈME UNIVERSEL DE CRÉATION DE GRAPHIQUES

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

    // Structure HTML de base avec canvas PLEINE HAUTEUR
    container.innerHTML = `
        <div class="stats-card premium-card">
            <div class="card-header">
                <h3 class="card-title">${config.icon || '📊'} ${config.title || 'Stats'}</h3>
                <div class="period-indicator">
                    <span class="period-dot active" data-period="week">S</span>
                    <span class="period-dot" data-period="month">M</span>
                    <span class="period-dot" data-period="quarter">T</span>
                </div>
            </div>
            <div class="card-body">
                <canvas id="${containerId}-canvas"></canvas>
            </div>
            <div class="card-footer">
                <div class="footer-stats">
                    <div class="stat-item">
                        <span class="stat-label">SETS</span>
                        <span class="stat-value" id="${containerId}-sets">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">TUT</span>
                        <span class="stat-value" id="${containerId}-tut">0:00</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">VOLUME</span>
                        <span class="stat-value" id="${containerId}-volume">0 kg</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">STATUS</span>
                        <span class="stat-value" id="${containerId}-status">-</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialiser le canvas avec taille responsive
    const canvas = document.getElementById(`${containerId}-canvas`);
    if (!canvas) {
        console.error("Canvas not found:", `${containerId}-canvas`);
        return;
    }
    
    // Taille du canvas = largeur du container
    const cardBody = canvas.parentElement;
    const size = Math.min(cardBody.offsetWidth, 400); // Max 400px
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    
    const ctx = canvas.getContext('2d');
    
    // Obtenir les données
    const data = config.dataSource ? config.dataSource() : config.data || {};
    
    // Appeler le rendu personnalisé
    if (config.onRender && typeof config.onRender === 'function') {
        config.onRender(canvas, ctx, size, data);
    }
    
    // Mettre à jour les stats du footer
    updateFooterStats(containerId, data);
    
    // Appliquer les effets premium
    if (config.effects) {
        applyPremiumEffects(container, config.effects);
    }
    
    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newSize = Math.min(cardBody.offsetWidth, 400);
            canvas.width = newSize;
            canvas.height = newSize;
            canvas.style.width = newSize + 'px';
            canvas.style.height = newSize + 'px';
            
            if (config.onRender) {
                config.onRender(canvas, ctx, newSize, data);
            }
        }, 300);
    });
}

function updateFooterStats(containerId, data) {
    // Mettre à jour les stats du footer avec les vraies données
    const setsEl = document.getElementById(`${containerId}-sets`);
    const tutEl = document.getElementById(`${containerId}-tut`);
    const volumeEl = document.getElementById(`${containerId}-volume`);
    const statusEl = document.getElementById(`${containerId}-status`);
    
    if (setsEl && data.totalSets) {
        setsEl.textContent = data.totalSets;
    }
    
    if (tutEl && data.totalTime) {
        const minutes = Math.floor(data.totalTime / 60);
        const seconds = data.totalTime % 60;
        tutEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (volumeEl && data.totalVolume) {
        volumeEl.textContent = Math.round(data.totalVolume / 1000) + 'K kg';
    }
    
    if (statusEl && data.status) {
        statusEl.textContent = data.status;
    }
}

function applyPremiumEffects(container, effects) {
    const card = container.querySelector('.stats-card');
    if (!card) return;

    // Ajouter les classes d'effets
    if (effects.halo) {
        card.classList.add('has-halo');
    }
    
    if (effects.scanlines) {
        card.classList.add('has-scanlines');
        
        // Créer l'overlay scanlines
        const scanlines = document.createElement('div');
        scanlines.className = 'scanlines-overlay';
        card.appendChild(scanlines);
    }
    
    if (effects.glow) {
        card.classList.add('has-glow');
    }
    
    // Créer les particules
    if (effects.particles && effects.particles > 0) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';

        for (let i = 0; i < effects.particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = 2 + Math.random() * 3 + 's';
            particlesContainer.appendChild(particle);
        }

        card.appendChild(particlesContainer);
    }
}
