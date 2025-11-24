// chart-effects-advanced.js - EFFETS VISUELS COCKPIT HOLOGRAPHIQUE

export function createMultiLayerHalo(card, intensity = 1) {
    const oldHalos = card.querySelectorAll('.halo-layer');
    oldHalos.forEach(h => h.remove());
    
    const haloLayers = [
        { color: 'rgba(0, 212, 255, 0.3)', blur: 60, speed: 3 },
        { color: 'rgba(138, 43, 226, 0.25)', blur: 80, speed: 4 },
        { color: 'rgba(236, 72, 153, 0.2)', blur: 100, speed: 5 }
    ];
    
    haloLayers.forEach((layer, i) => {
        const halo = document.createElement('div');
        halo.className = `halo-layer halo-${i}`;
        halo.style.cssText = `
            position: absolute;
            top: -40px;
            left: -40px;
            right: -40px;
            bottom: -40px;
            border-radius: 20px;
            pointer-events: none;
            opacity: ${intensity};
            box-shadow: 0 0 ${layer.blur}px ${layer.color};
            animation: halo-pulse-${i} ${layer.speed}s ease-in-out infinite;
        `;
        card.appendChild(halo);
    });
}

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

export function createSpotlights(card) {
    const spotlight1 = document.createElement('div');
    const spotlight2 = document.createElement('div');
    
    spotlight1.className = 'spotlight spotlight-1';
    spotlight2.className = 'spotlight spotlight-2';
    
    const style = `
        position: absolute;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
        pointer-events: none;
        filter: blur(40px);
        mix-blend-mode: screen;
        transition: all 0.3s ease;
    `;
    
    spotlight1.style.cssText = style;
    spotlight2.style.cssText = style;
    
    card.appendChild(spotlight1);
    card.appendChild(spotlight2);
    
    let mouseX = 0, mouseY = 0;
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        spotlight1.style.left = (mouseX - 100) + 'px';
        spotlight1.style.top = (mouseY - 100) + 'px';
        spotlight2.style.left = (mouseX - 80) + 'px';
        spotlight2.style.top = (mouseY - 120) + 'px';
    });
}

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
        `;
        
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

export function addInteractionPulse(card) {
    card.addEventListener('click', () => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'interaction-pulse 0.6s ease-out';
        }, 10);
    });
}

export function applyAllPremiumEffects(card, config = {}) {
    const {
        intensity = 1,
        particles = 20,
        speed = 1
    } = config;
    
    console.log('🔥 Applying premium effects to card:', card);
    
    try {
        createMultiLayerHalo(card, intensity);
        createHolographicReflections(card);
        createSpotlights(card);
        createScanlines(card);
        createOrbitalParticles(card, particles, speed);
        createVortex(card, intensity);
        addInteractionPulse(card);
        
        card.classList.add('premium-cockpit');
        
        console.log('✅ All effects applied successfully');
    } catch (error) {
        console.error('❌ Error applying effects:', error);
    }
}

export default {
    createMultiLayerHalo,
    createHolographicReflections,
    createSpotlights,
    createScanlines,
    createOrbitalParticles,
    createVortex,
    addInteractionPulse,
    applyAllPremiumEffects
};
