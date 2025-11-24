// chart-effects-advanced.js - EFFETS VISUELS COCKPIT HOLOGRAPHIQUE

// ============================================
//  HALOS MULTI-COUCHES DYNAMIQUES
// ============================================

export function createMultiLayerHalo(card, intensity = 1) {
    // Supprimer anciens halos
    const oldHalos = card.querySelectorAll('.halo-layer');
    oldHalos.forEach(h => h.remove());
    
    // Créer 3 couches de halos
    const haloLayers = [
        { color: 'rgba(0, 212, 255', size: 40, blur: 60, speed: 3 },   // Cyan doux
        { color: 'rgba(138, 43, 226', size: 60, blur: 80, speed: 4 },  // Violet pulsant
        { color: 'rgba(236, 72, 153', size: 80, blur: 100, speed: 5 }  // Magenta discret
    ];
    
    haloLayers.forEach((layer, i) => {
        const halo = document.createElement('div');
        halo.className = `halo-layer halo-${i}`;
        halo.style.cssText = `
            position: absolute;
            top: -${layer.size}px;
            left: -${layer.size}px;
            right: -${layer.size}px;
            bottom: -${layer.size}px;
            border-radius: 20px;
            pointer-events: none;
            opacity: ${0.3 * intensity};
            box-shadow: 
                0 0 ${layer.blur}px ${layer.color}, ${0.3 * intensity}),
                inset 0 0 ${layer.blur / 2}px ${layer.color}, ${0.15 * intensity});
            animation: halo-pulse-${i} ${layer.speed}s ease-in-out infinite;
        `;
        card.appendChild(halo);
    });
}

// ============================================
//  REFLETS HOLOGRAPHIQUES ANIMÉS
// ============================================

export function createHolographicReflections(card) {
    const reflection = document.createElement('div');
    reflection.className = 'holographic-reflection';
    reflection.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 20px;
        pointer-events: none;
        background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(0, 212, 255, 0.1) 20%,
            rgba(138, 43, 226, 0.1) 40%,
            transparent 60%,
            rgba(236, 72, 153, 0.1) 80%,
            transparent 100%
        );
        background-size: 300% 300%;
        animation: holographic-drift 10s ease-in-out infinite;
        mix-blend-mode: screen;
    `;
    card.appendChild(reflection);
}

// ============================================
//  SPOTLIGHTS DIRECTIONNELS
// ============================================

export function createSpotlights(card) {
    const spotlight1 = document.createElement('div');
    const spotlight2 = document.createElement('div');
    
    spotlight1.className = 'spotlight spotlight-1';
    spotlight2.className = 'spotlight spotlight-2';
    
    const spotlightStyle = `
        position: absolute;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba(0, 212, 255, 0.3) 0%,
            transparent 70%
        );
        pointer-events: none;
        filter: blur(40px);
        mix-blend-mode: screen;
        transition: all 0.3s ease;
    `;
    
    spotlight1.style.cssText = spotlightStyle;
    spotlight2.style.cssText = spotlightStyle + 'background: radial-gradient(circle, rgba(138, 43, 226, 0.3) 0%, transparent 70%);';
    
    card.appendChild(spotlight1);
    card.appendChild(spotlight2);
    
    // Suivre la souris/doigt
    let mouseX = 0, mouseY = 0;
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        updateSpotlights();
    });
    
    card.addEventListener('touchmove', (e) => {
        const rect = card.getBoundingClientRect();
        const touch = e.touches[0];
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
        updateSpotlights();
    });
    
    function updateSpotlights() {
        spotlight1.style.left = (mouseX - 100) + 'px';
        spotlight1.style.top = (mouseY - 100) + 'px';
        spotlight2.style.left = (mouseX - 80) + 'px';
        spotlight2.style.top = (mouseY - 120) + 'px';
    }
}

// ============================================
//  SCANLINES HUD PREMIUM
// ============================================

export function createScanlines(card) {
    const scanlines = document.createElement('div');
    scanlines.className = 'scanlines-hud';
    scanlines.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 20px;
        pointer-events: none;
        background: repeating-linear-gradient(
            0deg,
            rgba(0, 212, 255, 0.03) 0px,
            transparent 1px,
            transparent 2px,
            rgba(0, 212, 255, 0.03) 3px
        );
        animation: scanlines-scroll 10s linear infinite;
        opacity: 0.5;
    `;
    card.appendChild(scanlines);
}

// ============================================
//  PARTICULES ORBITANTES SYNCHRONISÉES
// ============================================

export function createOrbitalParticles(card, count = 20, speed = 1) {
    const container = document.createElement('div');
    container.className = 'orbital-particles';
    container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        overflow: hidden;
        border-radius: 20px;
    `;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'orbital-particle';
        
        const size = 2 + Math.random() * 3;
        const angle = (360 / count) * i;
        const distance = 100 + Math.random() * 100;
        const duration = 8 / speed + Math.random() * 4;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(0, 212, 255, 0.8);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
            animation: orbital-rotation-${i} ${duration}s linear infinite;
            animation-delay: ${delay}s;
            transform-origin: center center;
        `;
        
        // Créer l'animation CSS dynamiquement
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes orbital-rotation-${i} {
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
        document.head.appendChild(styleSheet);
        
        container.appendChild(particle);
    }
    
    card.appendChild(container);
}

// ============================================
//  VORTEX LUMINEUX
// ============================================

export function createVortex(card, intensity = 0.5) {
    const vortex = document.createElement('div');
    vortex.className = 'vortex-effect';
    vortex.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 300px;
        height: 300px;
        margin: -150px 0 0 -150px;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba(0, 212, 255, ${0.2 * intensity}) 0%,
            rgba(138, 43, 226, ${0.1 * intensity}) 50%,
            transparent 100%
        );
        pointer-events: none;
        animation: vortex-spin ${5 / intensity}s linear infinite;
        filter: blur(20px);
        mix-blend-mode: screen;
    `;
    card.appendChild(vortex);
}

// ============================================
//  PULSE SUR INTERACTION
// ============================================

export function addInteractionPulse(card) {
    card.addEventListener('click', () => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'interaction-pulse 0.6s ease-out';
        }, 10);
    });
    
    card.addEventListener('mouseenter', () => {
        const halos = card.querySelectorAll('.halo-layer');
        halos.forEach(halo => {
            halo.style.opacity = parseFloat(halo.style.opacity) * 1.5;
        });
    });
    
    card.addEventListener('mouseleave', () => {
        const halos = card.querySelectorAll('.halo-layer');
        halos.forEach(halo => {
            halo.style.opacity = parseFloat(halo.style.opacity) / 1.5;
        });
    });
}

// ============================================
//  BADGES HOLOGRAPHIQUES
// ============================================

export function createHolographicBadge(card, text, position = 'top-right') {
    const badge = document.createElement('div');
    badge.className = `holographic-badge ${position}`;
    badge.textContent = text;
    badge.style.cssText = `
        position: absolute;
        padding: 8px 16px;
        background: linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(138, 43, 226, 0.3));
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 212, 255, 0.5);
        border-radius: 20px;
        font-family: 'Orbitron', sans-serif;
        font-size: 11px;
        font-weight: 700;
        color: #00d4ff;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
        animation: badge-float 2s ease-in-out infinite;
        z-index: 10;
    `;
    
    // Positionnement
    if (position === 'top-right') {
        badge.style.top = '20px';
        badge.style.right = '20px';
    } else if (position === 'top-left') {
        badge.style.top = '20px';
        badge.style.left = '20px';
    }
    
    card.appendChild(badge);
}

// ============================================
//  HUD OVERLAY FLOTTANT
// ============================================

export function createHudOverlay(card, data) {
    const hud = document.createElement('div');
    hud.className = 'hud-overlay';
    hud.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 40px;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(0, 212, 255, 0.6);
        border-radius: 10px;
        font-family: 'Orbitron', sans-serif;
        font-size: 48px;
        font-weight: 700;
        color: #00d4ff;
        text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
        opacity: 0;
        pointer-events: none;
        z-index: 100;
        animation: hud-appear 0.5s ease-out forwards;
    `;
    
    hud.textContent = data.value || '0';
    card.appendChild(hud);
    
    // Disparaître après 1.5s
    setTimeout(() => {
        hud.style.animation = 'hud-disappear 0.5s ease-out forwards';
        setTimeout(() => hud.remove(), 500);
    }, 1500);
}

// ============================================
//  SYSTÈME UNIVERSEL D'APPLICATION
// ============================================

export function applyAllPremiumEffects(card, config = {}) {
    const {
        intensity = 1,
        particles = 20,
        speed = 1,
        showBadge = false,
        badgeText = 'RECORD',
        badgePosition = 'top-right'
    } = config;
    
    // Appliquer tous les effets dans l'ordre
    createMultiLayerHalo(card, intensity);
    createHolographicReflections(card);
    createSpotlights(card);
    createScanlines(card);
    createOrbitalParticles(card, particles, speed);
    createVortex(card, intensity);
    addInteractionPulse(card);
    
    if (showBadge) {
        createHolographicBadge(card, badgeText, badgePosition);
    }
    
    // Ajouter la classe pour les animations CSS
    card.classList.add('premium-cockpit');
}

export default {
    createMultiLayerHalo,
    createHolographicReflections,
    createSpotlights,
    createScanlines,
    createOrbitalParticles,
    createVortex,
    addInteractionPulse,
    createHolographicBadge,
    createHudOverlay,
    applyAllPremiumEffects
};
