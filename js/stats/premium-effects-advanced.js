// premium-effects-advanced.js - EFFETS COCKPIT ULTRA IMMERSIFS

// 1. HALOS DYNAMIQUES modulés par score
export function applyDynamicHalos(card, scoreValue = 0.5) {
    const intensity = Math.min(scoreValue / 10, 1); // 0-1
    
    const haloLayers = [
        { color: `rgba(0, 240, 255, ${0.15 * intensity})`, blur: 80, distance: 250 },
        { color: `rgba(168, 85, 247, ${0.12 * intensity})`, blur: 100, distance: 200 },
        { color: `rgba(217, 70, 239, ${0.1 * intensity})`, blur: 120, distance: 150 }
    ];
    
    haloLayers.forEach((halo, i) => {
        const layer = document.createElement('div');
        layer.className = `dynamic-halo-${i}`;
        layer.style.cssText = `
            position: absolute;
            top: -${halo.distance}px;
            left: -${halo.distance}px;
            right: -${halo.distance}px;
            bottom: -${halo.distance}px;
            background: radial-gradient(circle, ${halo.color} 0%, transparent 70%);
            filter: blur(${halo.blur}px);
            pointer-events: none;
            z-index: -${i + 1};
            animation: halo-pulse-${i} ${3 + i}s ease-in-out infinite;
        `;
        card.appendChild(layer);
    });
}

// 2. REFLETS HOLOGRAPHIQUES diagonaux
export function applyHolographicReflections(card) {
    const reflection = document.createElement('div');
    reflection.className = 'holographic-reflection';
    reflection.style.cssText = `
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(0, 240, 255, 0.12) 30%,
            rgba(168, 85, 247, 0.1) 50%,
            rgba(217, 70, 239, 0.08) 70%,
            transparent 100%
        );
        pointer-events: none;
        animation: reflection-sweep 15s linear infinite;
        z-index: 5;
        mix-blend-mode: screen;
    `;
    card.appendChild(reflection);
    
    // CSS animation
    if (!document.getElementById('reflection-anim')) {
        const style = document.createElement('style');
        style.id = 'reflection-anim';
        style.textContent = `
            @keyframes reflection-sweep {
                0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// 3. SCANLINES VERTICALES animées
export function applyScanlines(card) {
    const scanlines = document.createElement('div');
    scanlines.className = 'vertical-scanlines';
    scanlines.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
            90deg,
            rgba(0, 240, 255, 0.03) 0px,
            transparent 1px,
            transparent 3px
        );
        pointer-events: none;
        animation: scanlines-drift 8s linear infinite;
        z-index: 6;
    `;
    card.appendChild(scanlines);
    
    if (!document.getElementById('scanlines-anim')) {
        const style = document.createElement('style');
        style.id = 'scanlines-anim';
        style.textContent = `
            @keyframes scanlines-drift {
                0% { transform: translateX(0); }
                100% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// 4. PARTICULES INTELLIGENTES réactives
export function applyIntelligentParticles(card, scoreValue = 0.5) {
    const container = document.createElement('div');
    container.className = 'intelligent-particles';
    container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        overflow: hidden;
        border-radius: 20px;
        z-index: 3;
    `;
    
    const particleCount = 15;
    const speed = 0.5 + (scoreValue / 10); // Plus rapide si score élevé
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'smart-particle';
        
        const size = 2 + Math.random() * 2;
        const angle = (360 / particleCount) * i;
        const distance = 120 + Math.random() * 80;
        const duration = (8 / speed) + Math.random() * 4;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(0, 240, 255, 0.9);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            box-shadow: 0 0 ${size * 5}px rgba(0, 240, 255, 0.8);
            animation: orbit-${i} ${duration}s linear infinite;
            animation-delay: ${delay}s;
        `;
        
        // Keyframes unique
        const keyframes = `
            @keyframes orbit-${i} {
                0% {
                    transform: rotate(${angle}deg) translateX(${distance}px) rotate(-${angle}deg);
                    opacity: 0;
                }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% {
                    transform: rotate(${angle + 360}deg) translateX(${distance}px) rotate(-${angle + 360}deg);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.getElementById(`orbit-anim-${i}`)) {
            const style = document.createElement('style');
            style.id = `orbit-anim-${i}`;
            style.textContent = keyframes;
            document.head.appendChild(style);
        }
        
        container.appendChild(particle);
    }
    
    card.appendChild(container);
}

// 5. BADGE "RECORD" automatique
export function applyRecordBadge(card, scoreValue, threshold = 8) {
    if (scoreValue >= threshold) {
        const badge = document.createElement('div');
        badge.className = 'record-badge';
        badge.textContent = 'RECORD';
        badge.style.cssText = `
            position: absolute;
            top: -15px;
            right: -15px;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, #a855f7, #d946ef, #e879f9);
            border: 3px solid rgba(255, 255, 255, 0.4);
            box-shadow: 
                0 0 30px rgba(217, 70, 239, 0.8),
                0 0 60px rgba(217, 70, 239, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Orbitron', sans-serif;
            font-size: 10px;
            font-weight: 900;
            color: #fff;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            z-index: 20;
            animation: badge-float 2s ease-in-out infinite;
        `;
        
        if (!document.getElementById('badge-float-anim')) {
            const style = document.createElement('style');
            style.id = 'badge-float-anim';
            style.textContent = `
                @keyframes badge-float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-8px) scale(1.05); }
                }
            `;
            document.head.appendChild(style);
        }
        
        card.appendChild(badge);
    }
}

// 6. HUD OVERLAY au tap
export function applyHudOverlay(card) {
    card.addEventListener('click', (e) => {
        const hud = document.createElement('div');
        hud.className = 'hud-flash';
        hud.textContent = '+1';
        hud.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Orbitron', sans-serif;
            font-size: 48px;
            font-weight: 900;
            color: #00f0ff;
            text-shadow: 
                0 0 30px rgba(0, 240, 255, 1),
                0 0 60px rgba(0, 240, 255, 0.8);
            pointer-events: none;
            z-index: 100;
            animation: hud-flash 0.8s ease-out forwards;
        `;
        
        if (!document.getElementById('hud-flash-anim')) {
            const style = document.createElement('style');
            style.id = 'hud-flash-anim';
            style.textContent = `
                @keyframes hud-flash {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.5);
                    }
                    30% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -70%) scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        card.appendChild(hud);
        setTimeout(() => hud.remove(), 800);
    });
}

// FONCTION PRINCIPALE
export function applyAllAdvancedEffects(card, config = {}) {
    const {
        scoreValue = 5,
        enableHalos = true,
        enableReflections = true,
        enableScanlines = true,
        enableParticles = true,
        enableBadge = true,
        enableHud = true
    } = config;
    
    console.log('🚀 Applying advanced premium effects...');
    
    if (enableHalos) applyDynamicHalos(card, scoreValue);
    if (enableReflections) applyHolographicReflections(card);
    if (enableScanlines) applyScanlines(card);
    if (enableParticles) applyIntelligentParticles(card, scoreValue);
    if (enableBadge) applyRecordBadge(card, scoreValue);
    if (enableHud) applyHudOverlay(card);
    
    console.log('✅ Advanced effects applied');
}

export default {
    applyAllAdvancedEffects,
    applyDynamicHalos,
    applyHolographicReflections,
    applyScanlines,
    applyIntelligentParticles,
    applyRecordBadge,
    applyHudOverlay
};
