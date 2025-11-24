// chart-effects-advanced.js - EFFETS VISUELS ULTRA PREMIUM

// ============================================
//  PROJECTEURS LASER DIRECTIONNELS
// ============================================

export class LaserSpotlight {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.spots = [];
        this.initSpots();
    }
    
    initSpots() {
        // 4 projecteurs aux coins qui balayent la zone
        this.spots = [
            { x: 0.1, y: 0.1, angle: 45, speed: 0.002, radius: 150, intensity: 0.3 },
            { x: 0.9, y: 0.1, angle: 135, speed: -0.0015, radius: 180, intensity: 0.25 },
            { x: 0.1, y: 0.9, angle: -45, speed: 0.0018, radius: 160, intensity: 0.28 },
            { x: 0.9, y: 0.9, angle: -135, speed: -0.002, radius: 170, intensity: 0.22 }
        ];
    }
    
    update() {
        this.spots.forEach(spot => {
            spot.angle += spot.speed * 60;
        });
    }
    
    render() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        this.spots.forEach(spot => {
            const x = w * spot.x;
            const y = h * spot.y;
            
            // Gradient radial avec effet laser
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, spot.radius);
            gradient.addColorStop(0, `rgba(0, 212, 255, ${spot.intensity})`);
            gradient.addColorStop(0.5, `rgba(138, 43, 226, ${spot.intensity * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
            
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, w, h);
            this.ctx.restore();
            
            // Faisceau directionnel
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.translate(x, y);
            this.ctx.rotate(spot.angle);
            
            const beamGradient = this.ctx.createLinearGradient(0, 0, spot.radius * 2, 0);
            beamGradient.addColorStop(0, `rgba(0, 212, 255, ${spot.intensity * 0.5})`);
            beamGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
            
            this.ctx.fillStyle = beamGradient;
            this.ctx.fillRect(0, -20, spot.radius * 2, 40);
            this.ctx.restore();
        });
    }
}

// ============================================
//  VORTEX ADAPTATIF SELON PROGRESSION
// ============================================

export class AdaptiveVortex {
    constructor(canvas, centerX, centerY) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.centerX = centerX;
        this.centerY = centerY;
        this.particles = [];
        this.progressValue = 0;
        this.targetProgress = 0;
        this.initParticles();
    }
    
    initParticles() {
        const count = 60;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                angle: (Math.PI * 2 * i) / count,
                radius: 80 + Math.random() * 40,
                speed: 0.01 + Math.random() * 0.02,
                size: 1 + Math.random() * 2,
                opacity: 0.3 + Math.random() * 0.4,
                spiralSpeed: 0.5 + Math.random() * 0.5
            });
        }
    }
    
    setProgress(value) {
        this.targetProgress = Math.max(0, Math.min(1, value));
    }
    
    update() {
        // Smooth transition vers target
        this.progressValue += (this.targetProgress - this.progressValue) * 0.05;
        
        // Intensité du vortex selon progression
        const vortexIntensity = 0.5 + this.progressValue * 1.5;
        
        this.particles.forEach(p => {
            // Rotation spirale
            p.angle += p.speed * vortexIntensity;
            
            // Attraction vers le centre selon progression
            const targetRadius = 20 + (80 * (1 - this.progressValue));
            p.radius += (targetRadius - p.radius) * 0.02;
            
            // Pulse
            p.size = (1 + Math.random() * 2) * (0.8 + this.progressValue * 0.4);
        });
    }
    
    render() {
        this.particles.forEach(p => {
            const x = this.centerX + Math.cos(p.angle) * p.radius;
            const y = this.centerY + Math.sin(p.angle) * p.radius;
            
            // Particule avec glow
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'screen';
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, p.size * 3);
            gradient.addColorStop(0, `rgba(0, 212, 255, ${p.opacity * this.progressValue})`);
            gradient.addColorStop(0.5, `rgba(138, 43, 226, ${p.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
}

// ============================================
//  HUD OVERLAY CONTEXTUEL
// ============================================

export class HUDOverlay {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.active = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.data = {};
        this.opacity = 0;
        this.targetOpacity = 0;
    }
    
    show(x, y, data) {
        this.active = true;
        this.mouseX = x;
        this.mouseY = y;
        this.data = data;
        this.targetOpacity = 1;
    }
    
    hide() {
        this.active = false;
        this.targetOpacity = 0;
    }
    
    update() {
        this.opacity += (this.targetOpacity - this.opacity) * 0.15;
    }
    
    render() {
        if (this.opacity < 0.01) return;
        
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        
        // Position du HUD (éviter les bords)
        let hudX = this.mouseX + 20;
        let hudY = this.mouseY - 60;
        
        if (hudX + 200 > this.canvas.width) hudX = this.mouseX - 220;
        if (hudY < 20) hudY = this.mouseY + 20;
        
        // Background glassmorphism
        this.ctx.fillStyle = 'rgba(10, 15, 35, 0.85)';
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
        this.ctx.lineWidth = 1;
        
        this.ctx.beginPath();
        this.ctx.roundRect(hudX, hudY, 180, 80, 8);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Scanlines
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 80; i += 4) {
            this.ctx.beginPath();
            this.ctx.moveTo(hudX, hudY + i);
            this.ctx.lineTo(hudX + 180, hudY + i);
            this.ctx.stroke();
        }
        
        // Texte HUD
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.font = 'bold 11px "Orbitron", monospace';
        this.ctx.fillText('[ HUD OVERLAY ]', hudX + 10, hudY + 18);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '13px "Orbitron", monospace';
        
        let lineY = hudY + 35;
        Object.entries(this.data).forEach(([key, value]) => {
            this.ctx.fillStyle = '#8a2be2';
            this.ctx.fillText(`${key}:`, hudX + 10, lineY);
            this.ctx.fillStyle = '#00ff88';
            this.ctx.fillText(String(value), hudX + 90, lineY);
            lineY += 18;
        });
        
        this.ctx.restore();
    }
}

// ============================================
//  ANIMATIONS DE MONTÉE PROGRESSIVE
// ============================================

export class ProgressiveReveal {
    constructor(canvas, duration = 1500) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.duration = duration;
        this.startTime = null;
        this.progress = 0;
        this.type = 'spiral'; // spiral, radar, rings
    }
    
    start(type = 'spiral') {
        this.type = type;
        this.startTime = Date.now();
        this.progress = 0;
    }
    
    update() {
        if (this.startTime === null) return;
        
        const elapsed = Date.now() - this.startTime;
        this.progress = Math.min(1, elapsed / this.duration);
        
        if (this.progress >= 1) {
            this.startTime = null;
        }
    }
    
    getClipFunction() {
        if (this.progress >= 1) return null;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.max(this.canvas.width, this.canvas.height);
        
        return (ctx) => {
            ctx.save();
            ctx.beginPath();
            
            if (this.type === 'spiral') {
                const turns = 3;
                const points = 100;
                const currentPoints = Math.floor(points * this.progress);
                
                for (let i = 0; i <= currentPoints; i++) {
                    const angle = (i / points) * Math.PI * 2 * turns;
                    const radius = (i / points) * maxRadius * this.progress;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.lineTo(centerX, centerY);
                
            } else if (this.type === 'radar') {
                const angle = Math.PI * 2 * this.progress;
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, maxRadius, -Math.PI / 2, -Math.PI / 2 + angle);
                ctx.lineTo(centerX, centerY);
                
            } else if (this.type === 'rings') {
                const radius = maxRadius * this.progress;
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            }
            
            ctx.closePath();
            ctx.clip();
        };
    }
    
    isAnimating() {
        return this.progress < 1;
    }
}

// ============================================
//  REFLETS ANIMÉS GLASSMORPHISM
// ============================================

export class AnimatedGlassReflection {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
    }
    
    update() {
        this.time += 0.01;
    }
    
    render() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Reflet diagonal animé
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        
        const gradient = this.ctx.createLinearGradient(
            0, 0,
            w, h
        );
        
        const pos1 = 0.3 + Math.sin(this.time) * 0.15;
        const pos2 = 0.5 + Math.sin(this.time) * 0.15;
        
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(pos1, 'rgba(255, 255, 255, 0.03)');
        gradient.addColorStop(pos2, 'rgba(0, 212, 255, 0.08)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, w, h);
        
        this.ctx.restore();
    }
}

// ============================================
//  EXPORT GLOBAL
// ============================================

window.ChartEffectsAdvanced = {
    LaserSpotlight,
    AdaptiveVortex,
    HUDOverlay,
    ProgressiveReveal,
    AnimatedGlassReflection
};
