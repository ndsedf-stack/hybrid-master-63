// chart-effects.js - EFFETS PREMIUM COCKPIT

/**
 * Ajoute des effets premium à un élément
 */
export class ChartEffects {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            halo: options.halo !== false,
            scanlines: options.scanlines !== false,
            particles: options.particles !== false,
            glow: options.glow !== false,
            pulse: options.pulse !== false,
            ...options
        };
        
        this.init();
    }

    init() {
        if (this.options.halo) this.addHalo();
        if (this.options.scanlines) this.addScanlines();
        if (this.options.particles) this.addParticles();
        if (this.options.glow) this.addGlow();
        if (this.options.pulse) this.addPulse();
    }

    /**
     * Ajoute un halo pulsant
     */
    addHalo() {
        const halo = document.createElement('div');
        halo.className = 'chart-halo';
        halo.style.cssText = `
            position: absolute;
            inset: -20px;
            background: radial-gradient(circle at center, 
                rgba(6, 182, 212, 0.2) 0%, 
                transparent 70%);
            border-radius: inherit;
            pointer-events: none;
            animation: pulseHalo 3s ease-in-out infinite;
            z-index: -1;
        `;
        
        this.element.style.position = 'relative';
        this.element.appendChild(halo);
    }

    /**
     * Ajoute des scanlines HUD
     */
    addScanlines() {
        const scanlines = document.createElement('div');
        scanlines.className = 'chart-scanlines';
        scanlines.style.cssText = `
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(6, 182, 212, 0.03) 2px,
                rgba(6, 182, 212, 0.03) 4px
            );
            pointer-events: none;
            z-index: 5;
            opacity: 0.5;
            animation: scanlineMove 10s linear infinite;
        `;
        
        this.element.style.position = 'relative';
        this.element.appendChild(scanlines);
    }

    /**
     * Ajoute des particules flottantes
     */
    addParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'chart-particles';
        particlesContainer.style.cssText = `
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: 1;
        `;

        // Créer 20 particules
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(6, 182, 212, 0.6);
                border-radius: 50%;
                left: ${x}%;
                bottom: -10px;
                animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
                box-shadow: 0 0 ${size * 2}px rgba(6, 182, 212, 0.8);
            `;
            
            particlesContainer.appendChild(particle);
        }

        this.element.style.position = 'relative';
        this.element.appendChild(particlesContainer);
    }

    /**
     * Ajoute un glow animé
     */
    addGlow() {
        this.element.style.boxShadow = `
            0 0 40px rgba(6, 182, 212, 0.15),
            inset 0 0 60px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(6, 182, 212, 0.2)
        `;
        this.element.style.animation = 'glowPulse 3s ease-in-out infinite';
    }

    /**
     * Ajoute un effet de pulse
     */
    addPulse() {
        this.element.style.animation = 'cardPulse 3s ease-in-out infinite';
    }
}

/**
 * Ajoute un badge gamifié
 */
export function addBadge(container, type, text) {
    const badge = document.createElement('div');
    badge.className = `chart-badge chart-badge-${type}`;
    
    const colors = {
        record: { bg: 'rgba(251, 191, 36, 0.2)', border: '#fbbf24', text: '#fbbf24' },
        consistent: { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', text: '#22c55e' },
        intense: { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#ef4444' },
        optimal: { bg: 'rgba(6, 182, 212, 0.2)', border: '#06b6d4', text: '#06b6d4' }
    };
    
    const color = colors[type] || colors.optimal;
    
    badge.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: ${color.bg};
        border: 1px solid ${color.border};
        border-radius: 8px;
        color: ${color.text};
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        animation: badgeAppear 0.5s ease-out, badgePulse 2s ease-in-out infinite;
        box-shadow: 0 0 20px ${color.border}40;
    `;
    
    // Icône selon le type
    const icons = {
        record: '🏆',
        consistent: '🔥',
        intense: '⚡',
        optimal: '✓'
    };
    
    badge.innerHTML = `<span>${icons[type] || '✓'}</span><span>${text}</span>`;
    container.appendChild(badge);
    
    return badge;
}

/**
 * Ajoute un effet vortex de particules
 */
export function addVortexEffect(container, centerX, centerY) {
    const vortex = document.createElement('div');
    vortex.className = 'chart-vortex';
    vortex.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 2;
    `;

    // Créer des particules en spirale
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        const angle = (i / 30) * Math.PI * 2;
        const radius = 50 + (i * 3);
        const duration = 3 + Math.random() * 2;
        
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(6, 182, 212, 0.8);
            border-radius: 50%;
            left: 50%;
            top: 50%;
            animation: vortexSpin ${duration}s linear infinite;
            animation-delay: ${i * 0.1}s;
            box-shadow: 0 0 4px rgba(6, 182, 212, 1);
        `;
        
        vortex.appendChild(particle);
    }

    container.style.position = 'relative';
    container.appendChild(vortex);
}

/**
 * Ajoute un HUD overlay avec stats au survol
 */
export function addHUDOverlay(element, data) {
    const overlay = document.createElement('div');
    overlay.className = 'chart-hud-overlay';
    overlay.style.cssText = `
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        z-index: 100;
        border-radius: inherit;
    `;

    // Créer les stats
    Object.keys(data).forEach(key => {
        const stat = document.createElement('div');
        stat.style.cssText = `
            text-align: center;
            animation: slideInUp 0.3s ease-out;
        `;
        stat.innerHTML = `
            <div style="font-size: 10px; color: rgba(6, 182, 212, 0.6); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">${key}</div>
            <div style="font-size: 24px; font-weight: 900; color: #06b6d4; text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);">${data[key]}</div>
        `;
        overlay.appendChild(stat);
    });

    element.style.position = 'relative';
    element.appendChild(overlay);

    // Toggle au hover
    element.addEventListener('mouseenter', () => {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    });

    element.addEventListener('mouseleave', () => {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    });
}

/**
 * Animations CSS à injecter
 */
export function injectAnimations() {
    if (document.getElementById('chart-effects-animations')) return;

    const style = document.createElement('style');
    style.id = 'chart-effects-animations';
    style.textContent = `
        @keyframes pulseHalo {
            0%, 100% {
                opacity: 0.3;
                transform: scale(1);
            }
            50% {
                opacity: 0.6;
                transform: scale(1.05);
            }
        }

        @keyframes scanlineMove {
            0% {
                background-position: 0 0;
            }
            100% {
                background-position: 0 100px;
            }
        }

        @keyframes floatParticle {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-120vh) translateX(${Math.random() * 40 - 20}px);
                opacity: 0;
            }
        }

        @keyframes glowPulse {
            0%, 100% {
                box-shadow: 
                    0 0 40px rgba(6, 182, 212, 0.15),
                    inset 0 0 60px rgba(0, 0, 0, 0.3),
                    0 0 0 1px rgba(6, 182, 212, 0.2);
            }
            50% {
                box-shadow: 
                    0 0 60px rgba(6, 182, 212, 0.25),
                    inset 0 0 60px rgba(0, 0, 0, 0.3),
                    0 0 0 1px rgba(6, 182, 212, 0.4);
            }
        }

        @keyframes cardPulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.02);
            }
        }

        @keyframes badgeAppear {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(-10px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes badgePulse {
            0%, 100% {
                box-shadow: 0 0 20px currentColor;
            }
            50% {
                box-shadow: 0 0 30px currentColor;
            }
        }

        @keyframes vortexSpin {
            from {
                transform: rotate(0deg) translateX(50px) rotate(0deg);
            }
            to {
                transform: rotate(360deg) translateX(50px) rotate(-360deg);
            }
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Reflets radiaux */
        .chart-body::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, 
                rgba(6, 182, 212, 0.1) 0%, 
                transparent 60%);
            pointer-events: none;
            opacity: 0.5;
            animation: radialPulse 4s ease-in-out infinite;
        }

        @keyframes radialPulse {
            0%, 100% {
                opacity: 0.3;
                transform: scale(0.95);
            }
            50% {
                opacity: 0.6;
                transform: scale(1.05);
            }
        }

        /* Liseret animé */
        .stats-chart-card::before {
            content: '';
            position: absolute;
            inset: -2px;
            background: linear-gradient(45deg, 
                transparent 0%, 
                rgba(6, 182, 212, 0.5) 50%, 
                transparent 100%);
            background-size: 200% 200%;
            animation: liseretMove 3s linear infinite;
            border-radius: inherit;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .stats-chart-card:hover::before {
            opacity: 1;
        }

        @keyframes liseretMove {
            0% {
                background-position: 0% 0%;
            }
            100% {
                background-position: 200% 200%;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Auto-init au chargement
 */
injectAnimations();
