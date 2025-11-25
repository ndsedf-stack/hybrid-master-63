/**
 * BIO-METRICS STANDALONE - Reproduction exacte du composant React
 * Avec labels autour, footer 3 colonnes, interactivité complète
 */

export class BioMetricsRadar {
    constructor(containerId, data) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.selectedMuscle = data[1]; // Default DOS
        this.hoveredMuscleId = null;
        this.buildFactor = 0;
        
        this.size = 300;
        this.center = this.size / 2;
        this.radius = (this.size / 2) - 50;
        this.angleStep = (Math.PI * 2) / data.length;
        
        this.render();
        this.animate();
        this.setupInteractions();
    }
    
    animate() {
        const step = () => {
            this.buildFactor += 0.02;
            if (this.buildFactor >= 1) {
                this.buildFactor = 1;
            } else {
                this.updatePolygon();
                requestAnimationFrame(step);
            }
        };
        step();
    }
    
    getCoordinates(index, value) {
        const angle = index * this.angleStep - Math.PI / 2;
        const r = this.radius * value * this.buildFactor;
        const x = this.center + Math.cos(angle) * r;
        const y = this.center + Math.sin(angle) * r;
        return { x, y, angle };
    }
    
    getWebPoints(factor) {
        return this.data.map((_, i) => {
            const angle = i * this.angleStep - Math.PI / 2;
            const r = this.radius * factor;
            const x = this.center + Math.cos(angle) * r;
            const y = this.center + Math.sin(angle) * r;
            return `${x},${y}`;
        }).join(' ');
    }
    
render() {
    // 🔥 AJOUT DE LA LIGNE MANQUANTE
    const container = this.container;
    
    container.innerHTML = `
        <div class="chart-card-common">
            <!-- Background effects du wrapper -->
            <div class="chart-bg-effects">
                <div class="chart-radial-glow"></div>
                <div class="chart-grid-pattern"></div>
                <div class="chart-scanline-anim"></div>
            </div>
            
            <!-- Badge top right -->
            <div class="chart-badge-common">${this.data.length} ZONES</div>            
            <!-- HEADER -->
            <div class="chart-header-common">
                <div class="chart-title-row">
                    <span class="chart-icon-common">🧬</span>
                    <span class="chart-title-common">BIO-METRICS</span>
                </div>
                <div class="chart-subtitle-common">VOLUME DISTRIBUTION ANALYSIS</div>
            </div>
            
            <!-- CHART ZONE -->
            <div class="chart-zone-common">
                <!-- SVG Radar -->
                <svg viewBox="0 0 ${this.size} ${this.size}" style="width:100%;height:auto;max-width:300px;display:block;margin:0 auto;">
                    <defs>
                        <linearGradient id="bioGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.6"/>
                            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.1"/>
                        </linearGradient>
                        <filter id="bioGlow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <!-- Grid -->
${[0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1].map((factor, i) => `
    <polygon points="${this.getWebPoints(factor)}" 
        fill="none" 
        stroke="${i === 7 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}"
        stroke-width="${i === 7 ? '1.5' : '0.5'}"
        ${i !== 7 ? 'stroke-dasharray="2 2"' : ''}/>
`).join('')}
                    
                    <!-- Axis -->
                    ${this.data.map((_, i) => {
                        const { x, y } = this.getCoordinates(i, 1);
                        return `<line x1="${this.center}" y1="${this.center}" x2="${x}" y2="${y}" 
                            stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
                    }).join('')}
                    
                    <!-- Data Polygon -->
                    <polygon id="dataPolygon" points="" 
                        fill="url(#bioGradient)" 
                        stroke="#22d3ee" 
                        stroke-width="3"
                        filter="url(#bioGlow)"
                        style="drop-shadow: 0 0 15px rgba(34,211,238,0.5)"/>
                    
                    <!-- Points -->
                    <g id="pointsGroup"></g>
                </svg>
                
                <!-- HTML Labels -->
                <div id="labelsContainer" style="position:absolute;inset:0;pointer-events:none;"></div>
            </div>
            
            <!-- FOOTER -->
            <div class="chart-footer-common">
                <div style="text-align:center;">
                    <div class="chart-footer-label">INTENSITÉ</div>
                    <div class="chart-footer-value" id="intensityValue">0/10</div>
                </div>
                <div style="text-align:center;border-left:1px solid rgba(255,255,255,0.1);border-right:1px solid rgba(255,255,255,0.1);padding:0 16px;">
                    <div class="chart-footer-label" id="muscleNameLabel" style="color:#22d3ee;">DOS</div>
                    <div class="chart-footer-value" id="volumeValue">0 KG</div>
                </div>
                <div style="text-align:center;">
                    <div class="chart-footer-label">RECOVERY</div>
                    <div class="chart-footer-value" id="recoveryValue">0%</div>
                </div>
            </div>
        </div>
    `;
    
    this.updateLabels();
    this.updateFooter();
}    
    updatePolygon() {
        const points = this.data.map((m, i) => {
            const { x, y } = this.getCoordinates(i, m.normalized);
            return `${x},${y}`;
        }).join(' ');
        
        const polygon = this.container.querySelector('#dataPolygon');
        if (polygon) polygon.setAttribute('points', points);
        
        this.updatePoints();
    }
    
    updatePoints() {
        const pointsGroup = this.container.querySelector('#pointsGroup');
        if (!pointsGroup) return;
        
        pointsGroup.innerHTML = this.data.map((muscle, i) => {
            const { x, y } = this.getCoordinates(i, muscle.normalized);
            const isSelected = this.selectedMuscle.id === muscle.id;
            const isHovered = this.hoveredMuscleId === muscle.id;
            const r = (isHovered || isSelected) ? 6 : 3;
            const strokeWidth = (isHovered || isSelected) ? 3 : 2;
            const stroke = isSelected ? '#facc15' : '#22d3ee';
            
            return `
                <g class="bio-point" data-id="${muscle.id}">
                    <circle cx="${x}" cy="${y}" r="20" fill="transparent" style="cursor:pointer"/>
                    <circle cx="${x}" cy="${y}" r="${r}" 
                        fill="${muscle.type === 'primary' ? 'white' : '#94a3b8'}"
                        stroke="${stroke}" stroke-width="${strokeWidth}"/>
                    ${isSelected ? `
                        <circle cx="${x}" cy="${y}" r="12" fill="none" stroke="#facc15" stroke-width="1" opacity="0.5">
                            <animate attributeName="r" from="6" to="25" dur="1.5s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite"/>
                        </circle>
                    ` : ''}
                </g>
            `;
        }).join('');
    }
    
    updateLabels() {
        const labelsContainer = this.container.querySelector('#labelsContainer');
        if (!labelsContainer) return;
        
        labelsContainer.innerHTML = this.data.map((muscle, i) => {
            const angle = i * this.angleStep - Math.PI / 2;
            const labelRadius = this.radius + 35;
            const lx = this.center + Math.cos(angle) * labelRadius;
            const ly = this.center + Math.sin(angle) * labelRadius;
            const leftPct = (lx / this.size) * 100;
            const topPct = (ly / this.size) * 100;
            
            const isPrimary = muscle.type === 'primary';
            const isSelected = this.selectedMuscle.id === muscle.id;
            const isHovered = this.hoveredMuscleId === muscle.id;
            
            return `
                <div class="bio-label ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${!isPrimary ? 'secondary' : ''}"
                    style="left: ${leftPct}%; top: ${topPct}%"
                    data-id="${muscle.id}">
                    ${isPrimary ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="${isSelected ? 'currentColor' : 'none'}" stroke="currentColor">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>` : ''}
                    <span>${muscle.name}</span>
                    
                    <div class="bio-tooltip ${isHovered ? 'visible' : ''}">
                        <div class="tooltip-col">
                            <div class="tooltip-label">VOL</div>
                            <div class="tooltip-value">${muscle.volume}</div>
                            <div class="tooltip-unit">KG</div>
                        </div>
                        <div class="tooltip-divider"></div>
                        <div class="tooltip-col">
                            <div class="tooltip-label">SETS</div>
                            <div class="tooltip-value">${muscle.sets}</div>
                            <div class="tooltip-unit">REPS</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    updateFooter() {
        const intensity = this.container.querySelector('#intensityValue');
        const muscleName = this.container.querySelector('#muscleNameLabel');
        const volume = this.container.querySelector('#volumeValue');
        const recovery = this.container.querySelector('#recoveryValue');
        
        if (intensity) {
            intensity.textContent = `${this.selectedMuscle.intensity}/10`;
            intensity.className = `bio-stat-value ${this.selectedMuscle.intensity > 8 ? 'high' : ''}`;
        }
        if (muscleName) muscleName.textContent = this.selectedMuscle.name;
        if (volume) volume.textContent = `${this.selectedMuscle.volume.toLocaleString()} KG`;
        if (recovery) {
            recovery.textContent = `${this.selectedMuscle.recovery}%`;
            recovery.className = `bio-stat-value ${this.selectedMuscle.recovery < 50 ? 'low' : 'good'}`;
        }
    }
    
    setupInteractions() {
        this.container.addEventListener('click', (e) => {
            const point = e.target.closest('.bio-point');
            if (point) {
                const id = point.dataset.id;
                this.selectedMuscle = this.data.find(m => m.id === id);
                this.updatePolygon();
                this.updateLabels();
                this.updateFooter();
            }
        });
        
        this.container.addEventListener('mouseenter', (e) => {
            const label = e.target.closest('.bio-label');
            if (label) {
                this.hoveredMuscleId = label.dataset.id;
                this.updatePolygon();
                this.updateLabels();
            }
        }, true);
        
        this.container.addEventListener('mouseleave', (e) => {
            const label = e.target.closest('.bio-label');
            if (label) {
                this.hoveredMuscleId = null;
                this.updatePolygon();
                this.updateLabels();
            }
        }, true);
        
        this.container.addEventListener('click', (e) => {
            const label = e.target.closest('.bio-label');
            if (label) {
                const id = label.dataset.id;
                this.selectedMuscle = this.data.find(m => m.id === id);
                this.updatePolygon();
                this.updateLabels();
                this.updateFooter();
            }
        });
    }
}

export default BioMetricsRadar;
