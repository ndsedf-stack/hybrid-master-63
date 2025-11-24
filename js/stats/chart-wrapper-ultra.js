// chart-wrapper-ultra.js - SYSTÈME UNIVERSEL DE CRÉATION DE GRAPHIQUES

export function createStatsCard(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found');
        return;
    }
    
    // Structure HTML de base
    container.innerHTML = `
        <div class="stats-card premium-card">
            <div class="card-header">
                <h3 class="card-title">${options.title || 'Stats'}</h3>
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
                <span class="card-stat">📊 ${options.period || 'Month'}</span>
            </div>
        </div>
    `;
    
    // Initialiser le canvas
    const canvas = document.getElementById(`${containerId}-canvas`);
    const ctx = canvas.getContext('2d');
    
    // Adapter selon le type
    switch(options.type) {
        case 'radar':
            drawRadarChart(ctx, options.data);
            break;
        case 'rings':
            drawRingsChart(ctx, options.data);
            break;
        case 'zones':
            drawZonesChart(ctx, options.data);
            break;
        case 'volume':
            drawVolumeChart(ctx, options.data);
            break;
        case 'score':
            drawScoreChart(ctx, options.data);
            break;
    }
    
    // Appliquer les effets premium
    applyPremiumEffects(container);
}

function drawRadarChart(ctx, data) {
    const canvas = ctx.canvas;
    canvas.width = 300;
    canvas.height = 300;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    const numPoints = data.labels.length;
    
    // Dessiner la grille
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const r = radius * (i + 1) / 5;
        for (let j = 0; j <= numPoints; j++) {
            const angle = (Math.PI * 2 * j / numPoints) - Math.PI / 2;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // Dessiner les données
    ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i <= numPoints; i++) {
        const angle = (Math.PI * 2 * i / numPoints) - Math.PI / 2;
        const value = data.values[i % numPoints] / 100;
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = '12px Rajdhani';
    ctx.textAlign = 'center';
    
    data.labels.forEach((label, i) => {
        const angle = (Math.PI * 2 * i / numPoints) - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius + 30);
        const y = centerY + Math.sin(angle) * (radius + 30);
        ctx.fillText(label, x, y);
    });
}

function drawRingsChart(ctx, data) {
    const canvas = ctx.canvas;
    canvas.width = 300;
    canvas.height = 300;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    
    // Ring principal
    const progress = data.current / data.target;
    
    // Background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Progress
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progress));
    ctx.stroke();
    
    // Texte central
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px Orbitron';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.current, centerX, centerY - 10);
    
    ctx.font = '14px Rajdhani';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(`/ ${data.target}`, centerX, centerY + 15);
}

function drawZonesChart(ctx, data) {
    const canvas = ctx.canvas;
    canvas.width = 300;
    canvas.height = 200;
    
    const barHeight = 40;
    const startY = 80;
    
    data.forEach((zone, i) => {
        const barWidth = (canvas.width - 60) * (zone.percentage / 100);
        const y = startY + i * (barHeight + 10);
        
        // Barre
        ctx.fillStyle = zone.color;
        ctx.fillRect(30, y, barWidth, barHeight);
        
        // Label
        ctx.fillStyle = '#fff';
        ctx.font = '14px Rajdhani';
        ctx.textAlign = 'left';
        ctx.fillText(`${zone.zone} - ${zone.percentage}%`, 35, y + 25);
    });
}

function drawVolumeChart(ctx, data) {
    const canvas = ctx.canvas;
    canvas.width = 300;
    canvas.height = 200;
    
    const barWidth = 50;
    const gap = 20;
    const maxValue = Math.max(...data.datasets.map(d => d.value));
    const startX = 40;
    const bottomY = 160;
    
    data.datasets.forEach((dataset, i) => {
        const height = (dataset.value / maxValue) * 120;
        const x = startX + i * (barWidth + gap);
        const y = bottomY - height;
        
        // Barre
        ctx.fillStyle = dataset.color;
        ctx.fillRect(x, y, barWidth, height);
        
        // Valeur
        ctx.fillStyle = '#fff';
        ctx.font = '12px Rajdhani';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(dataset.value / 1000) + 'K', x + barWidth / 2, y - 10);
    });
}

function drawScoreChart(ctx, data) {
    const canvas = ctx.canvas;
    canvas.width = 300;
    canvas.height = 200;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Score
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 48px Orbitron';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.score.toFixed(1), centerX, centerY - 20);
    
    // Max
    ctx.font = '18px Rajdhani';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(`/ ${data.maxScore}`, centerX, centerY + 20);
    
    // Étoiles
    const stars = '⭐'.repeat(Math.floor(data.stars));
    ctx.font = '24px Arial';
    ctx.fillText(stars, centerX, centerY + 50);
}

function applyPremiumEffects(container) {
    // Ajouter les classes premium
    container.querySelector('.stats-card').classList.add('glow-effect', 'has-particles');
    
    // Ajouter les particules
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particlesContainer.appendChild(particle);
    }
    container.querySelector('.stats-card').appendChild(particlesContainer);
}
