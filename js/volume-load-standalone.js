export default class VolumeLoadGauge {
    constructor(containerId, volumeData) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`❌ Container #${containerId} not found`);
            return;
        }
        
        this.data = {
            totalVolume: volumeData.totalVolume || 18500,
            totalSets: volumeData.totalSets || 42,
            totalTUT: volumeData.totalTUT || 2400,
            maxVolume: volumeData.maxVolume || 25000,
            optimalMin: volumeData.optimalMin || 15000,
            optimalMax: volumeData.optimalMax || 22000
        };
        
        this.currentValue = 0;
        this.targetValue = this.data.totalVolume;
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
        const isOptimal = this.data.totalVolume >= this.data.optimalMin && 
                         this.data.totalVolume <= this.data.optimalMax;
        const badgeText = isOptimal ? 'OPTIMAL' : 'LIVE';
        const badgeClass = isOptimal ? 'badge-green' : 'badge-cyan';
        
        this.container.innerHTML = `
            <div class="chart-card-common">
                <div class="chart-bg-effects">
                    <div class="chart-scanline-anim"></div>
                    <div class="chart-radial-glow"></div>
                    <div class="chart-grid-pattern"></div>
                </div>
                <div class="chart-badge-common ${badgeClass}">${badgeText}</div>
                <div class="chart-header-common">
                    <h2 class="chart-title-common">VOLUME LOAD</h2>
                    <p class="chart-subtitle-common">Weekly Training Volume</p>
                </div>
                <div class="chart-zone-common">
                    <div class="volume-gauge-wrapper">
                        <div class="volume-halo volume-halo-1"></div>
                        <div class="volume-halo volume-halo-2"></div>
                        <canvas id="volumeGaugeCanvas"></canvas>
                    </div>
                </div>
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
            console.error('❌ Canvas volumeGaugeCanvas not found');
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
        document.getElementById('volumeTUT').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const volumeK = (this.data.totalVolume / 1000).toFixed(1);
        document.getElementById('volumeTotal').textContent = `${volumeK}k kg`;
        
        const isOptimal = this.data.totalVolume >= this.data.optimalMin && 
                         this.data.totalVolume <= this.data.optimalMax;
        const statusEl = document.getElementById('volumeStatus');
        
        if (isOptimal) {
            statusEl.textContent = '✅ OPTIMAL';
            statusEl.style.color = '#10b981';
        } else if (this.data.totalVolume > this.data.optimalMax) {
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
        const r = size * 0.42;
        
        const percent = Math.min(1, Math.max(0, this.currentValue / this.data.maxVolume));
        
        const isOptimal = this.currentValue >= this.data.optimalMin && 
                         this.currentValue <= this.data.optimalMax;
        const isOver = this.currentValue > this.data.optimalMax;
        
        let themeColor = '#22d3ee';
        if (isOptimal) themeColor = '#fbbf24';
        else if (isOver) themeColor = '#ef4444';
        
        this.ctx.clearRect(0, 0, size, size);
        
        this.drawChassis(cx, cy, r);
        this.drawCarbonFace(cx, cy, r);
        this.drawOptimalZone(cx, cy, r);
        this.drawGraduations(cx, cy, r, percent, themeColor);
        this.drawLCD(cx, cy, r, themeColor);
        this.drawNeedle(cx, cy, r, percent, themeColor);
        this.drawCenterPin(cx, cy, r);
        this.drawGlass(cx, cy, r);
    }

    drawChassis(cx, cy, r) {
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
        this.ctx.shadowBlur = 40;
        this.ctx.shadowOffsetY = 15;
        
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
        
        const bezelGrad = this.ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
        bezelGrad.addColorStop(0, '#334155');
        bezelGrad.addColorStop(0.3, '#94a3b8');
        bezelGrad.addColorStop(0.5, '#0f172a');
        bezelGrad.addColorStop(0.7, '#475569');
        bezelGrad.addColorStop(1, '#1e293b');
        
        this.ctx.fillStyle = bezelGrad;
        this.ctx.fill();
        this.ctx.restore();
    }

    drawCarbonFace(cx, cy, r) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        
        const pattern = this.createCarbonPattern();
        if (pattern) {
            this.ctx.fillStyle = pattern;
            this.ctx.fill();
        }
        
        const vignette = this.ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r);
        vignette.addColorStop(0, 'rgba(0,0,0,0.3)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.95)');
        this.ctx.fillStyle = vignette;
        this.ctx.fill();
        
        this.ctx.restore();
    }

    createCarbonPattern() {
        const pc = document.createElement('canvas');
        pc.width = 8;
        pc.height = 8;
        const pctx = pc.getContext('2d');
        
        if (pctx) {
            pctx.fillStyle = '#050505';
            pctx.fillRect(0, 0, 8, 8);
            pctx.fillStyle = '#1a1a1a';
            pctx.beginPath();
            pctx.moveTo(0, 8);
            pctx.lineTo(8, 0);
            pctx.lineTo(8, 8);
            pctx.fill();
        }
        
        return this.ctx.createPattern(pc, 'repeat');
    }

    drawOptimalZone(cx, cy, r) {
        this.ctx.save();
        const startAng = this.toRad(135);
        const totalAng = this.toRad(270);
        
        const optStartPct = this.data.optimalMin / this.data.maxVolume;
        const optEndPct = this.data.optimalMax / this.data.maxVolume;
        
        const optStartAng = startAng + (totalAng * optStartPct);
        const optEndAng = startAng + (totalAng * optEndPct);
        
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r * 0.92, optStartAng, optEndAng);
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.globalAlpha = 0.7;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1.0;
        
        this.ctx.restore();
    }

    drawGraduations(cx, cy, r, percent, themeColor) {
        this.ctx.save();
        
        const size = this.canvas.width / (window.devicePixelRatio || 1);
        const startAng = this.toRad(135);
        const totalAng = this.toRad(270);
        
        for (let i = 0; i <= 50; i++) {
            const t = i / 50;
            const angle = startAng + (totalAng * t);
            const isMajor = i % 10 === 0;
            const isLit = t <= percent;
            
            const outerRad = r * 0.88;
            const innerRad = outerRad - (isMajor ? r * 0.12 : r * 0.06);
            
            const x1 = cx + Math.cos(angle) * innerRad;
            const y1 = cy + Math.sin(angle) * innerRad;
            const x2 = cx + Math.cos(angle) * outerRad;
            const y2 = cy + Math.sin(angle) * outerRad;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            
            if (isLit) {
                this.ctx.strokeStyle = isMajor ? themeColor : 'rgba(255,255,255,0.5)';
                this.ctx.lineWidth = isMajor ? 3 : 1.5;
                this.ctx.shadowColor = themeColor;
                this.ctx.shadowBlur = isMajor ? 15 : 8;
            } else {
                this.ctx.strokeStyle = isMajor ? '#334155' : '#1e293b';
                this.ctx.lineWidth = isMajor ? 2 : 1;
                this.ctx.shadowBlur = 0;
            }
            
            this.ctx.stroke();
            
            if (isMajor) {
                const textRad = r * 0.65;
                const tx = cx + Math.cos(angle) * textRad;
                const ty = cy + Math.sin(angle) * textRad;
                
                this.ctx.font = `700 ${Math.max(9, size * 0.045)}px "Orbitron", sans-serif`;
                this.ctx.fillStyle = isLit ? '#fff' : '#475569';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.shadowBlur = 0;
                
                const valK = Math.round((t * this.data.maxVolume) / 1000);
                this.ctx.fillText(`${valK}k`, tx, ty);
            }
        }
        
        this.ctx.restore();
    }

    drawLCD(cx, cy, r, themeColor) {
        this.ctx.save();
        
        const lcdR = r * 0.5;
        
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, lcdR, 0, Math.PI * 2);
        this.ctx.fillStyle = '#000';
        this.ctx.fill();
        
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#334155';
        this.ctx.stroke();
        
        const lensGrad = this.ctx.createLinearGradient(cx - lcdR, cy - lcdR, cx + lcdR, cy + lcdR);
        lensGrad.addColorStop(0, 'rgba(255,255,255,0.05)');
        lensGrad.addColorStop(0.5, 'transparent');
        lensGrad.addColorStop(1, 'rgba(255,255,255,0.02)');
        this.ctx.fillStyle = lensGrad;
        this.ctx.fill();
        
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        this.ctx.font = `500 ${r * 0.065}px "Orbitron", sans-serif`;
        this.ctx.fillStyle = '#64748b';
        this.ctx.fillText("WEEKLY VOLUME", cx, cy - lcdR * 0.5);
        
        this.ctx.font = `700 ${r * 0.28}px "Orbitron", sans-serif`;
        this.ctx.fillStyle = '#fff';
        this.ctx.shadowColor = themeColor;
        this.ctx.shadowBlur = 25;
        
        const displayLoad = (this.currentValue / 1000).toFixed(1);
        this.ctx.fillText(`${displayLoad}k`, cx, cy + lcdR * 0.05);
        
        this.ctx.shadowBlur = 0;
        
        this.ctx.font = `400 ${r * 0.065}px "Orbitron", sans-serif`;
        this.ctx.fillStyle = themeColor;
        this.ctx.fillText("KG TOTAL", cx, cy + lcdR * 0.55);
        
        this.ctx.restore();
    }

    drawNeedle(cx, cy, r, percent, themeColor) {
        this.ctx.save();
        
        const needleAngle = this.toRad(135) + (this.toRad(270) * percent);
        const needleLen = r * 0.85;
        const needleW = r * 0.035;
        
        this.ctx.translate(cx, cy);
        this.ctx.rotate(needleAngle);
        
        this.ctx.shadowColor = themeColor;
        this.ctx.shadowBlur = 30;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, -needleW);
        this.ctx.lineTo(needleLen, 0);
        this.ctx.lineTo(0, needleW);
        this.ctx.lineTo(-needleW * 2, 0);
        this.ctx.closePath();
        
        const needleGrad = this.ctx.createLinearGradient(-needleW * 2, 0, needleLen, 0);
        needleGrad.addColorStop(0, '#fff');
        needleGrad.addColorStop(0.2, themeColor);
        needleGrad.addColorStop(1, themeColor);
        
        this.ctx.fillStyle = needleGrad;
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawCenterPin(cx, cy, r) {
        this.ctx.save();
        
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r * 0.05, 0, Math.PI * 2);
        this.ctx.fillStyle = '#e2e8f0';
        this.ctx.shadowColor = '#000';
        this.ctx.shadowBlur = 5;
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawGlass(cx, cy, r) {
        this.ctx.save();
        
        const glassReflect = this.ctx.createLinearGradient(cx - r, cy - r * 1.5, cx + r, cy + r);
        glassReflect.addColorStop(0, 'rgba(255,255,255,0.15)');
        glassReflect.addColorStop(0.3, 'rgba(255,255,255,0.05)');
        glassReflect.addColorStop(0.31, 'rgba(255,255,255,0)');
        glassReflect.addColorStop(1, 'rgba(255,255,255,0)');
        
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2);
        this.ctx.fillStyle = glassReflect;
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
    }
}
