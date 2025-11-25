// ready-charts-collection.js - 13 GRAPHIQUES PRÊTS À L'EMPLOI

import { createStatsCard } from './chart-wrapper-ultra.js';
import dataManager from './data-manager-ultra.js';

// ============================================
//  1. RADAR MUSCLE GROUPS
// ============================================

export function createMuscleRadar(containerId, period = 'month') {
    return createStatsCard({
        containerId,
        title: 'Répartition Musculaire',
        icon: '🎯',
        chartType: 'canvas',
        dataSource: () => dataManager.getMuscleGroupStats(period),
        effects: {
            halo: true,
            scanlines: true,
            particles: 20,
            vortex: true,
            laser: true
        },
        onRender: (canvas, ctx, size, data) => {
            const centerX = size / 2;
            const centerY = size / 2;
            const radius = size * 0.35;
            const angleStep = (Math.PI * 2) / data.length;
            
            // Grille radar
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 1; i <= 5; i++) {
                const r = (radius / 5) * i;
                ctx.beginPath();
                ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Axes
            data.forEach((item, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.stroke();
                
                // Labels
                const labelX = centerX + Math.cos(angle) * (radius + 30);
                const labelY = centerY + Math.sin(angle) * (radius + 30);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 11px "Orbitron", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(item.name.substring(0, 8), labelX, labelY);
            });
            
            // Data polygon
            ctx.beginPath();
            data.forEach((item, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const percent = item.percentage / 100;
                const x = centerX + Math.cos(angle) * radius * percent;
                const y = centerY + Math.sin(angle) * radius * percent;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.closePath();
            
            // Fill
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(138, 43, 226, 0.2)');
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Stroke
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Points
            data.forEach((item, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const percent = item.percentage / 100;
                const x = centerX + Math.cos(angle) * radius * percent;
                const y = centerY + Math.sin(angle) * radius * percent;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#00ff88';
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
        }
    });
}

// ============================================
//  2. PROGRESS RINGS
// ============================================

export function createProgressRings(containerId, period = 'month') {
    return createStatsCard({
        containerId,
        title: 'Progression',
        icon: '🔄',
        chartType: 'canvas',
        dataSource: () => dataManager.getGlobalScore(period),
        effects: {
            halo: true,
            scanlines: true,
            particles: 15,
            glow: true
        },
        onRender: (canvas, ctx, size, data) => {
            const centerX = size / 2;
            const centerY = size / 2;
            
            const rings = [
                { value: data.score, label: 'Score', color: '#00d4ff', radius: size * 0.35 },
                { value: data.consistency, label: 'Régularité', color: '#8a2be2', radius: size * 0.28 },
                { value: Math.min(100, (data.sessions / 12) * 100), label: 'Fréquence', color: '#00ff88', radius: size * 0.21 }
            ];
            
            rings.forEach((ring, i) => {
                const progress = ring.value / 100;
                const startAngle = -Math.PI / 2;
                const endAngle = startAngle + (Math.PI * 2 * progress);
                
                // Background ring
                ctx.beginPath();
                ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 12;
                ctx.stroke();
                
                // Progress ring
                ctx.beginPath();
                ctx.arc(centerX, centerY, ring.radius, startAngle, endAngle);
                ctx.strokeStyle = ring.color;
                ctx.lineWidth = 12;
                ctx.lineCap = 'round';
                ctx.shadowColor = ring.color;
                ctx.shadowBlur = 15;
                ctx.stroke();
                ctx.shadowBlur = 0;
                
                // Label
                const labelAngle = endAngle;
                const labelX = centerX + Math.cos(labelAngle) * ring.radius;
                const labelY = centerY + Math.sin(labelAngle) * ring.radius;
                
                ctx.fillStyle = ring.color;
                ctx.font = 'bold 10px "Orbitron", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`${Math.round(ring.value)}%`, labelX, labelY - 20);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.font = '9px "Orbitron", sans-serif';
                ctx.fillText(ring.label, labelX, labelY - 8);
            });
            
            // Center score
            ctx.fillStyle = '#00d4ff';
            ctx.font = 'bold 32px "Orbitron", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.score, centerX, centerY + 10);
        }
    });
}

// ============================================
//  3. INTENSITY ZONES
// ============================================

export function createIntensityZones(containerId, period = 'month') {
    return createStatsCard({
        containerId,
        title: 'Zones d\'Intensité',
        icon: '⚡',
        chartType: 'canvas',
        dataSource: () => dataManager.getIntensityZones(period),
        effects: {
            halo: true,
            scanlines: true,
            particles: 10
        },
        onRender: (canvas, ctx, size, data) => {
            const centerX = size / 2;
            const centerY = size / 2;
            const radius = size * 0.4;
            
            const colors = {
                Z1: '#00d4ff',
                Z2: '#00ff88',
                Z3: '#ffaa00',
                Z4: '#ff3366',
                Z5: '#cc00ff'
            };
            
            let currentAngle = -Math.PI / 2;
            
            data.forEach(zone => {
                const sliceAngle = (zone.percentage / 100) * Math.PI * 2;
                const endAngle = currentAngle + sliceAngle;
                
                // Slice
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, endAngle);
                ctx.closePath();
                
                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
                gradient.addColorStop(0, colors[zone.zone] + '80');
                gradient.addColorStop(1, colors[zone.zone] + '40');
                ctx.fillStyle = gradient;
                ctx.fill();
                
                ctx.strokeStyle = colors[zone.zone];
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Label
                const midAngle = currentAngle + sliceAngle / 2;
                const labelRadius = radius * 0.7;
                const labelX = centerX + Math.cos(midAngle) * labelRadius;
                const labelY = centerY + Math.sin(midAngle) * labelRadius;
                
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px "Orbitron", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(zone.zone, labelX, labelY - 5);
                ctx.font = '11px "Orbitron", sans-serif';
                ctx.fillText(`${Math.round(zone.percentage)}%`, labelX, labelY + 10);
                
                currentAngle = endAngle;
            });
        }
    });
}

// ============================================
//  4. VOLUME LOAD LINE CHART
// ============================================

export function createVolumeLoadChart(containerId, period = 'month') {
    return createStatsCard({
        containerId,
        title: 'Volume de Charge',
        icon: '📈',
        chartType: 'canvas',
        dataSource: () => dataManager.getVolumeLoad(period),
        effects: {
            halo: true,
            scanlines: true,
            laser: true
        },
        onRender: (canvas, ctx, size, data) => {
            const padding = 40;
            const chartWidth = size - padding * 2;
            const chartHeight = size - padding * 2;
            
            const maxVolume = Math.max(...data.map(d => d.volume));
            const stepX = chartWidth / (data.length - 1 || 1);
            
            // Axes
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padding, padding);
            ctx.lineTo(padding, size - padding);
            ctx.lineTo(size - padding, size - padding);
            ctx.stroke();
            
            // Grid
            for (let i = 0; i <= 5; i++) {
                const y = padding + (chartHeight / 5) * i;
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(size - padding, y);
                ctx.stroke();
            }
            
            // Line
            ctx.beginPath();
            data.forEach((point, i) => {
                const x = padding + i * stepX;
                const y = size - padding - (point.volume / maxVolume) * chartHeight;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00d4ff';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Area fill
            ctx.lineTo(size - padding, size - padding);
            ctx.lineTo(padding, size - padding);
            ctx.closePath();
            
            const gradient = ctx.createLinearGradient(0, padding, 0, size - padding);
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Points
            data.forEach((point, i) => {
                const x = padding + i * stepX;
                const y = size - padding - (point.volume / maxVolume) * chartHeight;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#00ff88';
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
        }
    });
}

// ============================================
//  5. GLOBAL SCORE GAUGE
// ============================================

export function createGlobalScoreGauge(containerId, period = 'month') {
    return createStatsCard({
        containerId,
        title: 'Score Global',
        icon: '🏆',
        chartType: 'canvas',
        dataSource: () => dataManager.getGlobalScore(period),
        effects: {
            halo: true,
            scanlines: true,
            particles: 30,
            vortex: true,
            glow: true
        },
        onRender: (canvas, ctx, size, data) => {
            const centerX = size / 2;
            const centerY = size / 2;
            const radius = size * 0.38;
            const progress = data.score / 100;
            
            const startAngle = Math.PI * 0.75;
            const endAngle = Math.PI * 2.25;
            const totalAngle = endAngle - startAngle;
            const currentAngle = startAngle + totalAngle * progress;
            
            // Background arc
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 20;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            // Progress arc avec gradient
            const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
            gradient.addColorStop(0, '#00d4ff');
            gradient.addColorStop(0.5, '#8a2be2');
            gradient.addColorStop(1, '#cc00ff');
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 20;
            ctx.shadowColor = '#00d4ff';
            ctx.shadowBlur = 20;
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Score central
            ctx.fillStyle = '#00d4ff';
            ctx.font = 'bold 48px "Orbitron", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(data.score, centerX, centerY - 10);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '12px "Orbitron", sans-serif';
            ctx.fillText('SCORE', centerX, centerY + 25);
            
            // Stats secondaires
            const stats = [
                { label: 'VOLUME', value: `${Math.round(data.volume / 1000)}K` },
                { label: 'SÉANCES', value: data.sessions },
                { label: 'RÉGULARITÉ', value: `${data.consistency}%` }
            ];
            
            stats.forEach((stat, i) => {
                const angle = startAngle + (totalAngle / (stats.length + 1)) * (i + 1);
                const textX = centerX + Math.cos(angle) * (radius + 40);
                const textY = centerY + Math.sin(angle) * (radius + 40);
                
                ctx.fillStyle = '#00ff88';
                ctx.font = 'bold 14px "Orbitron", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(stat.value, textX, textY);
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.font = '9px "Orbitron", sans-serif';
                ctx.fillText(stat.label, textX, textY + 15);
            });
        }
    });
}

// ============================================
//  FONCTIONS D'INITIALISATION RAPIDE
// ============================================

export function initAllCharts(containerPrefix = 'chart-', period = 'month') {
    const charts = [
        { id: `${containerPrefix}radar`, fn: createMuscleRadar },
        { id: `${containerPrefix}rings`, fn: createProgressRings },
        { id: `${containerPrefix}zones`, fn: createIntensityZones },
        { id: `${containerPrefix}volume`, fn: createVolumeLoadChart },
        { id: `${containerPrefix}score`, fn: createGlobalScoreGauge }
    ];
    
    const instances = [];
    
    charts.forEach(chart => {
        const container = document.getElementById(chart.id);
        if (container) {
            instances.push(chart.fn(chart.id, period));
        }
    });
    
    return instances;
}

// ============================================
//  8 GRAPHIQUES SUPPLÉMENTAIRES À VENIR
// ============================================

// 6. Heatmap calendrier
// 7. Breakdown par exercice
// 8. Time spent par groupe musculaire
// 9. PR history
// 10. Fatigue index
// 11. Training frequency timeline
// 12. Exercise variety chart
// 13. Recovery metrics

export default {
    createMuscleRadar,
    createProgressRings,
    createIntensityZones,
    createVolumeLoadChart,
    createGlobalScoreGauge,
    initAllCharts
};


// ============================================
//  6. MUSCLE HUD RADAR (Style Cockpit React)
// ============================================

export function createMuscleHudRadar(containerId, period = 'month') {
    return createStatsCard({
        containerId,
        title: 'BIO-METRICS',
        subtitle: 'VOLUME DISTRIBUTION ANALYSIS',
        icon: '🎯',
        chartType: 'canvas',
        dataSource: () => {
            const muscleStats = dataManager.getMuscleGroupStats(period);
            return muscleStats.map(m => ({
                name: m.name.toUpperCase(),
                normalized: m.percentage / 100,
                volume: m.totalVolume,
                sets: m.totalSets,
                intensity: Math.min(10, (m.totalVolume / 500)).toFixed(1),
                recovery: Math.random() * 100 // TODO: vraie donnée recovery
            }));
        },
        effects: {
            halo: true,
            scanlines: true,
            particles: 30,
            vortex: true,
            laser: true,
            badge: false
        },
        onRender: (canvas, ctx, size, muscles) => {
            if (!muscles || muscles.length === 0) return;
            
            const center = size / 2;
            const radius = size * 0.35;
            const angleStep = (Math.PI * 2) / muscles.length;
            
            // Fonction helper coordinates
            const getCoords = (index, value) => {
                const angle = index * angleStep - Math.PI / 2;
                const r = radius * value;
                return {
                    x: center + Math.cos(angle) * r,
                    y: center + Math.sin(angle) * r,
                    angle
                };
            };
            
            // GRID: Cercles concentriques
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 1;
            [0.25, 0.5, 0.75, 1].forEach((factor, i) => {
                ctx.beginPath();
                muscles.forEach((_, idx) => {
                    const {x, y} = getCoords(idx, factor);
                    if (idx === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.closePath();
                if (i === 3) {
                    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                    ctx.lineWidth = 1.5;
                }
                ctx.stroke();
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                ctx.lineWidth = 1;
            });
            
            // AXES
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            muscles.forEach((_, i) => {
                const {x, y} = getCoords(i, 1);
                ctx.beginPath();
                ctx.moveTo(center, center);
                ctx.lineTo(x, y);
                ctx.stroke();
            });
            
            // DATA POLYGON
            const gradient = ctx.createLinearGradient(0, 0, 0, size);
            gradient.addColorStop(0, 'rgba(34, 211, 238, 0.6)');
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');
            
            ctx.fillStyle = gradient;
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(34, 211, 238, 0.5)';
            
            ctx.beginPath();
            muscles.forEach((m, i) => {
                const {x, y} = getCoords(i, m.normalized);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            
            // POINTS + LABELS
            ctx.font = 'bold 11px Orbitron, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            muscles.forEach((m, i) => {
                const {x, y} = getCoords(i, m.normalized);
                
                // Point
                ctx.fillStyle = 'white';
                ctx.strokeStyle = '#22d3ee';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                // Label (outside)
                const {x: lx, y: ly, angle} = getCoords(i, 1.25);
                
                // Background label
                const textWidth = ctx.measureText(m.name).width;
                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                ctx.fillRect(lx - textWidth/2 - 4, ly - 8, textWidth + 8, 16);
                
                // Text
                ctx.fillStyle = '#22d3ee';
                ctx.fillText(m.name, lx, ly);
                
                // Stats (small)
                ctx.font = 'bold 8px monospace';
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.fillText(``${m.volume}kg • ${m.sets}s`), lx, ly + 14);
            });
