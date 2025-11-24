// chart-wrapper-ultra.js - SYSTÈME UNIVERSEL ULTRA PREMIUM

export function createStatsCard(config) {
    const {
        containerId,
        title,
        icon = '📊',
        chartType = 'canvas',
        dataSource,
        effects = {},
        onRender
    } = config;
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return null;
    }
    
    // Structure HTML
    container.innerHTML = `
        <div class="stats-chart-card ${effects.glow ? 'has-glow' : ''}">
            ${effects.halo ? '<div class="halo-effect"></div>' : ''}
            ${effects.scanlines ? '<div class="scanlines"></div>' : ''}
            
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">${icon}</span>
                    <h3>${title}</h3>
                </div>
                <div class="period-selector">
                    <span class="period-dot active" data-period="week">S</span>
                    <span class="period-dot" data-period="month">M</span>
                    <span class="period-dot" data-period="quarter">T</span>
                </div>
            </div>
            
            <div class="card-body">
                ${chartType === 'canvas' ? '<canvas class="chart-canvas"></canvas>' : '<div class="chart-html"></div>'}
            </div>
            
            ${effects.particles ? `<div class="particles-container"></div>` : ''}
        </div>
    `;
    
    // Récupérer les éléments
    const card = container.querySelector('.stats-chart-card');
    const canvas = card.querySelector('.chart-canvas');
    
    // Initialiser les effets
    if (effects.particles) {
        initParticles(card, effects.particles);
    }
    
    if (effects.laser && window.ChartEffectsAdvanced) {
        const laser = new window.ChartEffectsAdvanced.LaserSpotlight(canvas);
        setInterval(() => {
            laser.update();
            laser.render();
        }, 1000 / 60);
    }
    
    if (effects.vortex && window.ChartEffectsAdvanced) {
        const vortex = new window.ChartEffectsAdvanced.AdaptiveVortex(canvas, canvas.width / 2, canvas.height / 2);
        setInterval(() => {
            vortex.update();
            vortex.render();
        }, 1000 / 60);
    }
    
    // Render le graphique
    if (chartType === 'canvas' && onRender) {
        const ctx = canvas.getContext('2d');
        const size = Math.min(container.clientWidth, 400);
        canvas.width = size;
        canvas.height = size;
        
        const data = typeof dataSource === 'function' ? dataSource() : dataSource;
        onRender(canvas, ctx, size, data);
    }
    
    return card;
}

function initParticles(container, count) {
    const particlesContainer = container.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (2 + Math.random() * 2) + 's';
        particlesContainer.appendChild(particle);
    }
}
