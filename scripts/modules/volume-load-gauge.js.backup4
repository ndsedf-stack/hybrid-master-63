// ==================================================================
// VOLUME LOAD GAUGE MODULE - HYBRID MASTER 63
// Jauge professionnelle style montre luxe avec Canvas
// Avec calcul intégré des données réelles depuis localStorage
// ==================================================================

// Classe interne pour calculer le Volume Load
class VolumeLoadCalculator {
  constructor() {
    this.history = this.loadHistory();
  }

  loadHistory() {
    try {
      const data = localStorage.getItem('workout_history');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Erreur lecture historique:', error);
      return [];
    }
  }

  getCurrentWeekNumber() {
    if (this.history.length === 0) return 1;
    const sortedHistory = [...this.history].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    return sortedHistory[0].week || 1;
  }

  getCurrentWeekVolumeLoad() {
    const currentWeek = this.getCurrentWeekNumber();
    return this.getWeekVolumeLoad(currentWeek);
  }

  getWeekVolumeLoad(weekNumber) {
    const weekSessions = this.history.filter(session => {
      return session.week === weekNumber && session.completed;
    });

    let totalVolume = 0;
    let totalSets = 0;
    let totalTUT = 0;

    weekSessions.forEach(session => {
      if (session.stats && session.stats.total_volume) {
        totalVolume += session.stats.total_volume;
      }

      if (session.exercises) {
        session.exercises.forEach(exercise => {
          if (exercise.sets_data && exercise.sets_data.length > 0) {
            totalSets += exercise.sets_data.length;
          }
        });
      }

      if (session.stats && session.stats.total_time_under_tension) {
        totalTUT += session.stats.total_time_under_tension;
      }
    });

    return {
      weekNumber: weekNumber,
      totalVolume: totalVolume,
      totalSets: totalSets,
      totalTUT: totalTUT,
      sessionsCount: weekSessions.length,
      inOptimalZone: totalVolume >= 15000 && totalVolume <= 22000
    };
  }
}

export class VolumeLoadGauge {
  constructor(canvasId, statsContainerId) {
    this.canvas = document.getElementById(canvasId);
    this.statsContainer = document.getElementById(statsContainerId);
    
    if (!this.canvas) {
      console.error('❌ Canvas non trouvé:', canvasId);
      return;
    }

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.animationFrameId = null;
    this.currentVal = 0;
    this.targetVal = 0;
    this.lastTime = performance.now();
    this.phase = 0;

    // Constantes
    this.MAX_WEEKLY_VOLUME = 25000;
    this.ZONE_OPTIMAL_START = 15000;
    this.ZONE_OPTIMAL_END = 22000;

    this.stats = {
      currentLoad: 0,
      weeklyVolume: 0,
      tutTotal: 0,
      setsCompleted: 0,
      optimalZone: false
    };

    this.init();
  }

  init() {
    this.setupCanvas();
    this.render();
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.rect = rect;
  }

  createCarbonPattern() {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 8;
    patternCanvas.height = 8;
    const pCtx = patternCanvas.getContext('2d');
    
    if (pCtx) {
      pCtx.fillStyle = '#050505';
      pCtx.fillRect(0, 0, 8, 8);
      pCtx.fillStyle = '#1a1a1a';
      pCtx.beginPath();
      pCtx.moveTo(0, 8);
      pCtx.lineTo(8, 0);
      pCtx.lineTo(8, 8);
      pCtx.fill();
    }
    
    return this.ctx.createPattern(patternCanvas, 'repeat');
  }

  toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  render() {
    const carbonPattern = this.createCarbonPattern();

    // Calcule le Volume Load RÉEL depuis localStorage
    const calculator = new VolumeLoadCalculator();
    const weekStats = calculator.getCurrentWeekVolumeLoad();
    
    // Valeur FIXE basée sur les vraies données
    this.targetVal = weekStats.totalVolume;
    this.currentVal = weekStats.totalVolume;
    
    console.log('📊 Volume Load calculé:', {
      week: weekStats.weekNumber,
      volume: weekStats.totalVolume,
      sets: weekStats.totalSets,
      tut: weekStats.totalTUT,
      sessions: weekStats.sessionsCount
    });

    const animate = (timestamp) => {
      // Pas d'animation, valeur fixe
      const val = Math.max(0, Math.min(this.MAX_WEEKLY_VOLUME, this.currentVal));
      const percent = val / this.MAX_WEEKLY_VOLUME;

      // Mise à jour des stats RÉELLES
      this.stats = {
        currentLoad: weekStats.totalVolume,
        weeklyVolume: weekStats.totalVolume,
        tutTotal: weekStats.totalTUT,
        setsCompleted: weekStats.totalSets,
        optimalZone: weekStats.inOptimalZone
      };

      // Mettre à jour le DOM
      if (this.statsContainer) {
        this.statsContainer.innerHTML = `
          <div class="stat-card">
            <div class="stat-label">Sets</div>
            <div class="stat-value">${this.stats.setsCompleted}</div>
            <div class="stat-sub">Cette semaine</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">TUT Total</div>
            <div class="stat-value stat-cyan">${this.stats.tutTotal}s</div>
            <div class="stat-sub">~${Math.floor(this.stats.tutTotal / 60)} min</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Volume Load</div>
            <div class="stat-value">${(this.stats.weeklyVolume / 1000).toFixed(1)}k</div>
            <div class="stat-sub">kg levés</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Status</div>
            <div class="stat-value ${this.stats.optimalZone ? 'stat-success' : 'stat-warning'}">
              ${this.stats.optimalZone ? '✓ OPTIMAL' : '⚠ AJUSTER'}
            </div>
            <div class="stat-sub">
              ${this.stats.optimalZone ? 'Zone hypertrophie' : 'Hors zone cible'}
            </div>
          </div>
        `;
      }

      // Couleurs dynamiques selon la zone
      let hue = 30, sat = 100, light = 60; // Orange par défaut

      const inOptimalZone = val > this.ZONE_OPTIMAL_START && val < this.ZONE_OPTIMAL_END;
      
      if (inOptimalZone) {
        hue = 150; // Vert
      } else if (val >= this.ZONE_OPTIMAL_END) {
        hue = 340; // Rouge
      }

      const themeColor = `hsl(${hue}, ${sat}%, ${light}%)`;
      const glowColor = `hsl(${hue}, ${sat}%, 80%)`;

      const w = this.rect.width;
      const h = this.rect.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.42;

      this.ctx.clearRect(0, 0, w, h);

      // ===== 1. CHASSIS MÉTAL =====
      this.drawChassis(cx, cy, r);

      // ===== 2. FOND CARBONE =====
      this.drawCarbonBackground(cx, cy, r, carbonPattern);

      // ===== 3. GRADUATIONS =====
      this.drawGraduations(cx, cy, r, percent, themeColor, glowColor);

      // ===== 4. ZONE OPTIMALE =====
      this.drawOptimalZone(cx, cy, r);

      // ===== 5. ÉCRAN CENTRAL =====
      this.drawLCD(cx, cy, r, themeColor, this.stats.weeklyVolume);

      // ===== 6. AIGUILLE =====
      this.drawNeedle(cx, cy, r, percent, themeColor);

      // ===== 7. VERRE SAPHIR =====
      this.drawGlass(cx, cy, r);

      // Pas de boucle - rendu unique avec les données réelles
    };

    // Rendu initial unique
    requestAnimationFrame(animate);
  }

  drawChassis(cx, cy, r) {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 30;

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Bezel métal
    const bezelGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    bezelGrad.addColorStop(0, '#334155');
    bezelGrad.addColorStop(0.2, '#94a3b8');
    bezelGrad.addColorStop(0.5, '#0f172a');
    bezelGrad.addColorStop(0.8, '#475569');
    bezelGrad.addColorStop(1, '#1e293b');
    
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
    ctx.fillStyle = bezelGrad;
    ctx.fill();

    // Dish
    const dishGrad = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.05);
    dishGrad.addColorStop(0, '#000');
    dishGrad.addColorStop(0.8, '#0a0a0a');
    dishGrad.addColorStop(1, '#000');
    
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2);
    ctx.fillStyle = dishGrad;
    ctx.fill();

    ctx.restore();
  }

  drawCarbonBackground(cx, cy, r, pattern) {
    const ctx = this.ctx;
    
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.0, 0, Math.PI * 2);
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fill();
    }
    
    const innerShadow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.0);
    innerShadow.addColorStop(0, 'rgba(0,0,0,0)');
    innerShadow.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = innerShadow;
    ctx.fill();
  }

  drawGraduations(cx, cy, r, percent, themeColor, glowColor) {
    const ctx = this.ctx;
    const startAng = this.toRad(135);
    const endAng = this.toRad(405);
    const rangeAng = endAng - startAng;
    const ticksCount = 50;

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.85, startAng, endAng);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    // Graduations
    for (let i = 0; i <= ticksCount; i++) {
      const t = i / ticksCount;
      const angle = startAng + rangeAng * t;
      const isMajor = i % 10 === 0;
      const isLit = t <= percent;
      
      const tickLen = isMajor ? r * 0.12 : r * 0.06;
      const outerR = r * 0.92;
      const innerR = outerR - tickLen;

      const x1 = cx + Math.cos(angle) * innerR;
      const y1 = cy + Math.sin(angle) * innerR;
      const x2 = cx + Math.cos(angle) * outerR;
      const y2 = cy + Math.sin(angle) * outerR;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      
      if (isLit) {
        ctx.strokeStyle = isMajor ? glowColor : themeColor;
        ctx.lineWidth = isMajor ? 3 : 1.5;
        ctx.shadowColor = themeColor;
        ctx.shadowBlur = isMajor ? 15 : 8;
      } else {
        ctx.strokeStyle = isMajor ? '#334155' : '#1e293b';
        ctx.lineWidth = isMajor ? 2 : 1;
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Chiffres
      if (isMajor) {
        const textR = r * 0.68;
        const tx = cx + Math.cos(angle) * textR;
        const ty = cy + Math.sin(angle) * textR;

        ctx.font = `700 ${Math.max(8, r * 0.08)}px "Rajdhani", system-ui`;
        ctx.fillStyle = isLit ? '#fff' : '#475569';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (isLit) {
          ctx.shadowColor = themeColor;
          ctx.shadowBlur = 10;
        }
        const displayVal = Math.round(t * this.MAX_WEEKLY_VOLUME / 1000);
        ctx.fillText(displayVal + 'k', tx, ty);
        ctx.shadowBlur = 0;
      }
    }
  }

  drawOptimalZone(cx, cy, r) {
    const ctx = this.ctx;
    const startAng = this.toRad(135);
    const endAng = this.toRad(405);
    const rangeAng = endAng - startAng;
    
    const optStart = startAng + rangeAng * (this.ZONE_OPTIMAL_START / this.MAX_WEEKLY_VOLUME);
    const optEnd = startAng + rangeAng * (this.ZONE_OPTIMAL_END / this.MAX_WEEKLY_VOLUME);
    
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.95, optStart, optEnd);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#00ff9d';
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  drawLCD(cx, cy, r, themeColor, weeklyVolume) {
    const ctx = this.ctx;
    const lcdR = r * 0.5;
    
    ctx.beginPath();
    ctx.arc(cx, cy, lcdR, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    // Reflet
    const lensGrad = ctx.createLinearGradient(cx - lcdR, cy - lcdR, cx + lcdR, cy + lcdR);
    lensGrad.addColorStop(0, 'rgba(255,255,255,0.05)');
    lensGrad.addColorStop(0.5, 'transparent');
    lensGrad.addColorStop(1, 'rgba(255,255,255,0.02)');
    ctx.fillStyle = lensGrad;
    ctx.fill();

    // Texte
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = `500 ${r * 0.065}px "Rajdhani", system-ui`;
    ctx.fillStyle = '#64748b';
    ctx.fillText("WEEKLY VOLUME", cx, cy - lcdR * 0.5);

    ctx.font = `700 ${r * 0.28}px "Rajdhani", system-ui`;
    ctx.fillStyle = '#fff';
    ctx.shadowColor = themeColor;
    ctx.shadowBlur = 25;
    
    const displayLoad = (weeklyVolume / 1000).toFixed(1);
    ctx.fillText(displayLoad + 'k', cx, cy + lcdR * 0.05);
    ctx.shadowBlur = 0;

    ctx.font = `400 ${r * 0.065}px system-ui`;
    ctx.fillStyle = themeColor;
    ctx.fillText("KG TOTAL", cx, cy + lcdR * 0.55);
  }

  drawNeedle(cx, cy, r, percent, themeColor) {
    const ctx = this.ctx;
    const startAng = this.toRad(135);
    const endAng = this.toRad(405);
    const rangeAng = endAng - startAng;
    
    const needleAngle = startAng + rangeAng * percent;
    const needleLen = r * 0.9;
    const needleW = r * 0.035;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(needleAngle);

    ctx.shadowColor = themeColor;
    ctx.shadowBlur = 30;

    ctx.beginPath();
    ctx.moveTo(0, -needleW);
    ctx.lineTo(needleLen, 0);
    ctx.lineTo(0, needleW);
    ctx.lineTo(-needleW * 2, 0);
    ctx.closePath();

    const needleGrad = ctx.createLinearGradient(-needleW * 2, 0, needleLen, 0);
    needleGrad.addColorStop(0, '#fff');
    needleGrad.addColorStop(0.2, themeColor);
    needleGrad.addColorStop(0.6, 'transparent');
    
    ctx.fillStyle = needleGrad;
    ctx.fill();

    ctx.restore();

    // Centre
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 5;
    ctx.fill();
  }

  drawGlass(cx, cy, r) {
    const ctx = this.ctx;
    
    const glassReflect = ctx.createLinearGradient(cx - r, cy - r * 1.5, cx + r, cy + r);
    glassReflect.addColorStop(0, 'rgba(255,255,255,0.15)');
    glassReflect.addColorStop(0.3, 'rgba(255,255,255,0.05)');
    glassReflect.addColorStop(0.31, 'rgba(255,255,255,0)');
    glassReflect.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
    ctx.fillStyle = glassReflect;
    ctx.fill();
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

