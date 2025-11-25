// chart-wrapper.js - SYSTÈME UNIVERSEL POUR TOUS LES GRAPHIQUES

/**
 * UTILISATION :
 * 
 * const chart = new ChartWrapper('containerId', {
 *   type: 'canvas' | 'svg' | 'html',
 *   aspectRatio: 1, // Par défaut 1:1
 *   onRender: (container) => { // Ton code de rendu ici }
 * });
 */

export class ChartWrapper {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`❌ Container ${containerId} introuvable !`);
            return;
        }

        this.options = {
            type: options.type || 'canvas', // 'canvas', 'svg', 'html'
            aspectRatio: options.aspectRatio || 1, // 1:1 par défaut
            onRender: options.onRender || null,
            onResize: options.onResize || null,
            maintainAspectRatio: options.maintainAspectRatio !== false // true par défaut
        };

        this.element = null;
        this.ctx = null;
        this.resizeObserver = null;

        this.init();
    }

    init() {
        // Vider le container
        this.container.innerHTML = '';

        // Créer le wrapper interne
        const wrapper = document.createElement('div');
        wrapper.className = 'chart-wrapper-inner';
        wrapper.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        `;

        // Créer l'élément selon le type
        switch (this.options.type) {
            case 'canvas':
                this.element = document.createElement('canvas');
                break;
            case 'svg':
                this.element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                break;
            case 'html':
                this.element = document.createElement('div');
                break;
            default:
                console.error(`❌ Type invalide: ${this.options.type}`);
                return;
        }

        // Style pour maintenir l'aspect ratio
        if (this.options.maintainAspectRatio) {
            this.element.style.cssText = `
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                display: block;
                margin: 0 auto;
            `;
        }

        wrapper.appendChild(this.element);
        this.container.appendChild(wrapper);

        // Si canvas, obtenir le context
        if (this.options.type === 'canvas') {
            this.ctx = this.element.getContext('2d');
        }

        // Setup resize handling
        this.setupResize();

        // Render initial
        this.render();
    }

    setupResize() {
        // Utiliser ResizeObserver pour détecter les changements de taille
        this.resizeObserver = new ResizeObserver(() => {
            this.handleResize();
        });
        this.resizeObserver.observe(this.container);

        // Aussi écouter window resize pour être sûr
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        if (this.options.type === 'canvas') {
            this.resizeCanvas();
        } else if (this.options.type === 'svg') {
            this.resizeSVG();
        }

        // Callback custom
        if (this.options.onResize) {
            this.options.onResize(this.element, this.getSize());
        }

        // Re-render
        this.render();
    }

    resizeCanvas() {
        const size = this.getSize();
        const dpr = window.devicePixelRatio || 1;

        // Résolution réelle (haute densité)
        this.element.width = size.width * dpr;
        this.element.height = size.height * dpr;

        // Taille affichée
        this.element.style.width = size.width + 'px';
        this.element.style.height = size.height + 'px';

        // Scale le context pour haute densité
        this.ctx.scale(dpr, dpr);
    }

    resizeSVG() {
        const size = this.getSize();
        this.element.setAttribute('width', size.width);
        this.element.setAttribute('height', size.height);
        this.element.setAttribute('viewBox', `0 0 ${size.width} ${size.height}`);
        this.element.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }

    getSize() {
        const rect = this.container.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;

        if (this.options.maintainAspectRatio) {
            // Calculer la taille en maintenant l'aspect ratio
            const targetRatio = this.options.aspectRatio;
            const containerRatio = containerWidth / containerHeight;

            let width, height;

            if (containerRatio > targetRatio) {
                // Container trop large
                height = containerHeight;
                width = height * targetRatio;
            } else {
                // Container trop haut
                width = containerWidth;
                height = width / targetRatio;
            }

            return {
                width: Math.floor(width),
                height: Math.floor(height)
            };
        } else {
            return {
                width: Math.floor(containerWidth),
                height: Math.floor(containerHeight)
            };
        }
    }

    render() {
        if (this.options.onRender) {
            const size = this.getSize();
            this.options.onRender(this.element, this.ctx, size);
        }
    }

    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        window.removeEventListener('resize', this.handleResize);
    }
}

// HELPER: Créer une carte de stats complète
export function createStatsCard(config) {
    const {
        containerId,
        title,
        icon = '📊',
        chartType = 'canvas',
        chartId,
        footerHTML = '',
        onRender
    } = config;

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ Container ${containerId} introuvable !`);
        return null;
    }

    // HTML de la carte
    container.innerHTML = `
        <div class="stats-chart-card">
            <div class="chart-header">
                <span class="chart-icon">${icon}</span>
                <h3 class="chart-title">${title}</h3>
            </div>
            <div class="chart-body" id="${chartId}"></div>
            ${footerHTML ? `<div class="chart-footer">${footerHTML}</div>` : ''}
        </div>
    `;

    // Créer le wrapper pour le graphique
    const chart = new ChartWrapper(chartId, {
        type: chartType,
        aspectRatio: 1,
        onRender: onRender
    });

    return chart;
}
