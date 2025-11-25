/**
 * VOLUME LOAD GAUGE - Module Standalone
 * Architecture identique à bio-metrics-standalone.js
 * Utilise chart-base-common.css pour les effets cockpit
 */

class VolumeLoadGauge {
    constructor(containerId, volumeData) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        this.data = volumeData;
        this.currentValue = 0;
        this.targetValue = volumeData.totalVolume;
        this.maxVolume = volumeData.maxVolume || 25000;
        this.optimalMin = volumeData.optimalMin || 15000;
        this.optimalMax = volumeData.optimalMax || 22000;
        
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;

        this.init();
    }

    init() {
        this.createHTML();
        this.setupCanvas();
        this.updateFooter();
        this.startAnimation();
    }

    createHTML() {
        const isOptimal = this.data.totalVolume >= this.optimalMin && this.data.totalVolume <= this.optimalMax;
        const badgeText = isOptimal ? 'OPTIMAL' : 'LIVE';
        const badgeClass = isOptimal ? 'badge-green' : 'badge-cyan';

        this.container.innerHTML = `
            <div class="chart-card-common">
                <!-- Background Effects -->
                <div class="chart-bg-effects">
                    <div class="chart-scanline-anim"></div>
                    <div class="chart-radial-glow"></div>
                    <div class="chart-grid-pattern"></div>
                </div>

                <!-- Badge -->
                <div class="chart-badge-common ${badgeClass}">${badgeText}</div>

                <!-- Header -->
                <div class="chart-header-common">
                    <h2 class="chart-title-common">VOLUME LOAD</h2>
                    <p class="chart-subtitle-common">Weekly Training Volume</p>
                </div>

                <!-- Gauge Zone -->
                <div class="chart-zone-common">
                    <div class="volume-gauge-wrapper">
                        <div class="volume-halo volume-halo-1"></div>
                        <div class="volume-halo volume-halo-2"></div>
                        <canvas id="volumeGaugeCanvas"></canvas>
                    </div>
                </div>

                <!-- Footer Stats -->
                <div class="chart-footer-common">
                    <div class="volume-stats-footer">
                        <div class="volume-stat-card">
                            <div class="volume-stat-label">Séries</div>
                            <div class="volume-stat-value" id="volumeSets">0</div>
                        </div>
                        <div class="volume-stat-card">
                            <div class="volume-stat-label">TUT</div>
                            <div class="volume-stat-value" id="volumeTUT">0:00</div>
                        </div>
                        <div class="volume-stat-card">
                            <div class="volume-stat-label">Volume</div>
                            <div class="volume-stat-value" id="volumeTotal">0k kg</div>
                        </div>
                        <div class="volume-stat-card">
                            <div class="volume-stat-label">Statut</div>
                            <div class="volume-stat-value" id="volumeStatus">⚠️ AJUSTER</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupCanvas() {
        this.canvas = document.getElementById('volumeGaugeCanvas');
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.resizeCanvas();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const wrapper = this.canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        const size = wrapper.offsetWidth;

        this.canvas.width = size * dpr;
        this.canvas.height = size * dpr;
        this.canvas.style.width = `${size}px`;
        this.canvas.style.height = `${size}px`;
        
        this.ctx.scale(dpr, dpr);
    }

    updateFooter() {
        document.getElementById('volumeSets').textContent = this.data.totalSets;
        
        const minutes = Math.floor(this.data.totalTUT / 60);
        const seconds = this.data.totalTUT % 60;
        document.getElementById('volumeTUT').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const volumeK = (this.data.totalVolume / 1000).toFixed(1);
        document.getElementById('volumeTotal').textContent = `${volumeK}k kg`;
        
        const isOptimal = this.data.totalVolume >= this.optimalMin && this.data.totalVolume <= this.optimalMax;
        const statusEl = document.getElementById('volumeStatus');
        if (isOptimal) {
            statusEl.textContent = '✅ OPTIMAL';
            statusEl.style.color = '#10b981';
        } else if (this.data.totalVolume > this.optimalMax) {
            statusEl.textContent = '🔴 ÉLEVÉ';
            statusEl.style.color = '#ef4444';
        } else {
            statusEl.textContent = '⚠️ AJUSTER';
            statusEl.style.color = '#f59e0b';
        }
    }

    startAnimation() {
        const animate = () => {
            const diff = this.targetValue - this.currentValue;
            if (Math.abs(diff) < 0.1) {
                this.currentValue = this.targetValue;
            } else {
                this.currentValue += diff * 0.08;
            }

            this.drawGauge();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    drawGauge() {
        if (!this.ctx || !this.canvas) return;

        const size = this.canvas.width / (window.devicePixelRatio || 1);
        const cx = size / 2;
        const cy = size / 2;
        const r = size * 0.45;

        const percent = Math.min(1, Math.max(0, this.currentValue / this.maxVolume));

        // Déterminer couleur theme
        let themeColor = '#22d3ee'; // Cyan
        const isOptimal = this.currentValue >= this.optimalMin && this.currentValue <= this.optimalMax;
        const isOver = this.currentValue > this.optimalMax;

        if (isOptimal) {
            themeColor = '#fbbf24'; // Amber
        } else if (isOver) {
            themeColor = '#ef4444'; // Red
        }

        this.ctx.clearRect(0, 0, size, size);

        // 1. CHASSIS (bezel métallique)
        this.drawChassis(cx, cy, r, size);

        // 2. FOND CARBONE
        this.drawCarbonFace(cx, cy, r);

        // 3. ZONE OPTIMALE
        this.drawOptimalZone(cx, cy, r);

        // 4. GRADUATIONS
        this.drawGraduations(cx, cy, r, percent, themeColor);

        // 5. LCD CENTRAL
        this.drawLCD(cx, cy, r, size, themeColor);

        // 6. AIGUILLE
        this.drawNeedle(cx, cy, r, percent, themeColor);

        // 7. PIN CENTRAL
        this.drawCenterPin(cx, cy);

        // 8. VERRE SAPHIR
        this.drawGlass(cx, cy, r);
    }

    drawChassis(cx, cy, r, size) {
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
        this.ctx.shadowBlur = 30;
        this.ctx.shadowOffsetY = 10;

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2);

        const bezelGrad = this.ctx.createLinearGradient(0, 0, size, size);
        bezelGrad.addColorStop(0, '#334155');
        bezelGrad.addColorStop(0.5, '#0f172a');
        bezelGrad.addColorStop(1, '#1e293b');
        this.ctx.fillStyle = bezelGrad;
        this.ctx.fill();
        this.ctx.restore();
    }

    drawCarbonFace(cx, cy, r) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);

        // Pattern carbone
        const pattern = this.createCarbonPattern();
        if (pattern) {
            this.ctx.fillStyle = pattern;
            this.ctx.fill();
        }

        // Vignette
        const vignette = this.ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.9)');
        this.ctx.fillStyle = vignette;
        this.ctx.fill();

        // Rim
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        this.ctx.stroke();
        this.ctx.restore();
    }

    createCarbonPattern() {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 8;
        pCanvas.height = 8;
        const pCtx = pCanvas.getContext('2d');
        if (pCtx) {
            pCtx.fillStyle = '#050505';
            pCtx.fillRect(0, 0, 8, 8);
            pCtx.fillStyle = '#161616';
            pCtx.beginPath();
            pCtx.moveTo(0, 8);
            pCtx.lineTo(8, 0);
            pCtx.lineTo(8, 8);
            pCtx.fill();
        }
        return this.ctx.createPattern(pCanvas, 'repeat');
    }

    drawOptimalZone(cx, cy, r) {
        this.ctx.save();
        const startAng = this.toRad(135);
        const totalAng = this.toRad(270);

        const optStartPct = this.optimalMin / this.maxVolume;
        const optEndPct = this.optimalMax / this.maxVolume;

        const optStartAng = startAng + (totalAng * optStartPct);
        const optEndAng = startAng + (totalAng * optEndPct);

        // Arc de fond
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r * 0.85, optStartAng, optEndAng);
        this.ctx.lineWidth = r * 0.08;
        this.ctx.strokeStyle = 'rgba(251,191,36,0.15)';
        this.ctx.lineCap = 'butt';
        this.ctx.stroke();

        // Ligne marker
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r * 0.92, optStartAng, optEndAng);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawGraduations(cx, cy, r, percent, themeColor) {
        this.ctx.save();
        const startAng = this.toRad(135);
        const totalAng = this.toRad(270);
        const tickCount = 50;

        for (let i = 0; i <= tickCount; i++) {
            const t = i / tickCount;
            const angle = startAng + (totalAng * t);
            const isMajor = i % 10 === 0;
            const isLit = t <= percent;

            const outerRad = r * 0.82;
            const innerRad = outerRad - (isMajor ? r * 0.08 : r * 0.04);

            const x1 = cx + Math.cos(angle) * innerRad;
            const y1 = cy + Math.sin(angle) * innerRad;
            const x2 = cx + Math.cos(angle) * outerRad;
            const y2 = cy + Math.sin(angle) * outerRad;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);

            if (isLit) {
                this.ctx.strokeStyle = isMajor ? themeColor : 'rgba(255,255,255,0.5)';
                this.ctx.lineWidth = isMajor ? 3 : 1;
                this.ctx.shadowColor = themeColor;
                this.ctx.shadowBlur = 10;
            } else {
                this.ctx.strokeStyle = '#334155';
                this.ctx.lineWidth = 1;
                this.ctx.shadowBlur = 0;
            }
            this.ctx.stroke();

            // Chiffres
            if (isMajor) {
                const textRad = r * 0.65;
                const tx = cx + Math.cos(angle) * textRad;
                const ty = cy + Math.sin(angle) * textRad;

                this.ctx.font = `bold ${Math.max(10, size * 0.04)}px "Orbitron", sans-serif`;
                this.ctx.fillStyle = isLit ? '#fff' : '#475569';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.shadowBlur = 0;

                const valK = Math.round((t * this.maxVolume) / 1000);
                this.ctx.fillText(`${valK}k`, tx, ty);
            }
        }
        this.ctx.restore();
    }

    drawLCD(cx, cy, r, size, themeColor) {
        this.ctx.save();
        const lcdY = cy + r * 0.4;
        const lcdW = r * 0.6;
        const lcdH = r * 0.25;

        // Fond LCD
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.roundRect(cx - lcdW/2, lcdY - lcdH/2, lcdW, lcdH, 4);
        this.ctx.fill();
        this.ctx.strokeStyle = '#334155';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Valeur
        this.ctx.font = `bold ${size * 0.08}px "Orbitron", monospace`;
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.shadowColor = themeColor;
        this.ctx.shadowBlur = 15;
        this.ctx.fillText(Math.round(this.currentValue).toLocaleString(), cx, lcdY);

        // Label
        this.ctx.font = `bold ${size * 0.03}px "Inter", sans-serif`;
        this.ctx.fillStyle = themeColor;
        this.ctx.shadowBlur = 0;
        this.ctx.fillText("TOTAL LOAD (KG)", cx, lcdY + size * 0.06);
        this.ctx.restore();
    }

    drawNeedle(cx, cy, r, percent, themeColor) {
        this.ctx.save();
        const startAng = this.toRad(135);
        const totalAng = this.toRad(270);
        const needleAngle = startAng + (totalAng * percent);
        const needleLen = r * 0.85;

        this.ctx.translate(cx, cy);
        this.ctx.rotate(needleAngle);

        this.ctx.shadowColor = themeColor;
        this.ctx.shadowBlur = 20;

        // Corps
        this.ctx.beginPath();
        this.ctx.moveTo(0, -4);
        this.ctx.lineTo(needleLen, 0);
        this.ctx.lineTo(0, 4);
        this.ctx.lineTo(-15, 0);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();

        // Pointe colorée
        this.ctx.beginPath();
        this.ctx.moveTo(needleLen * 0.7, -2);
        this.ctx.lineTo(needleLen, 0);
        this.ctx.lineTo(needleLen * 0.7, 2);
        this.ctx.fillStyle = themeColor;
        this.ctx.fill();

        this.ctx.restore();
    }

    drawCenterPin(cx, cy) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fill();
        this.ctx.restore();
    }

    drawGlass(cx, cy, r) {
        this.ctx.save();
        const grad = this.ctx.createLinearGradient(cx - r, cy - r, cx + r/2, cy + r/2);
        grad.addColorStop(0, 'rgba(255,255,255,0.1)');
        grad.addColorStop(0.4, 'rgba(255,255,255,0.02)');
        grad.addColorStop(0.45, 'transparent');
        grad.addColorStop(1, 'transparent');

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r * 0.95, 0, Math.PI * 2);
        this.ctx.fillStyle = grad;
        this.ctx.fill();
        this.ctx.restore();
    }

    toRad(deg) {
        return (deg * Math.PI) / 180;
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', () => this.resizeCanvas());
    }
}

export default VolumeLoadGauge;
