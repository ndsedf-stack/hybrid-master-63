/**
 * PREMIUM VOLUME CHART - Style Cyberpunk
 */

export class PremiumVolumeChart {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('❌ Container non trouvé:', containerId);
            return;
        }
        
        this.hoveredIndex = null;
        this.muscleData = [];
        
        this.muscleMapping = {
            'quadriceps': { group: 'LEGS', color: '#00f0ff', label: 'HYDRAULICS' },
            'ischio': { group: 'LEGS', color: '#00f0ff', label: 'HYDRAULICS' },
            'fessiers': { group: 'LEGS', color: '#00f0ff', label: 'HYDRAULICS' },
            'mollets': { group: 'LEGS', color: '#00f0ff', label: 'HYDRAULICS' },
            'jambes': { group: 'LEGS', color: '#00f0ff', label: 'HYDRAULICS' },
            'dos': { group: 'BACK', color: '#6366f1', label: 'STRUCTURE' },
            'trapèzes': { group: 'BACK', color: '#6366f1', label: 'STRUCTURE' },
            'lombaires': { group: 'BACK', color: '#6366f1', label: 'STRUCTURE' },
            'pectoraux': { group: 'CHEST', color: '#8b5cf6', label: 'PLATING' },
            'biceps': { group: 'ARMS', color: '#ec4899', label: 'PISTONS' },
            'triceps': { group: 'ARMS', color: '#ec4899', label: 'PISTONS' },
            'avant-bras': { group: 'ARMS', color: '#ec4899', label: 'PISTONS' },
            'bras': { group: 'ARMS', color: '#ec4899', label: 'PISTONS' },
            'epaules': { group: 'SHLDR', color: '#d946ef', label: 'JOINTS' },
            'deltoïdes': { group: 'SHLDR', color: '#d946ef', label: 'JOINTS' },
            'abdos': { group: 'CORE', color: '#f43f5e', label: 'REACTOR' },
            'abdominaux': { group: 'CORE', color: '#f43f5e', label: 'REACTOR' },
            'core': { group: 'CORE', color: '#f43f5e', label: 'REACTOR' }
        };
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.render();
    }
    
    loadData() {
        try {
            const sessions = JSON.parse(localStorage.getItem('completedSessions') || '[]');
            
            if (sessions.length === 0) {
                console.warn('⚠️ Aucune session - données démo');
                this.generateDemoData();
                return;
            }
            
            const volumeByGroup = {
                'LEGS': 0, 'BACK': 0, 'CHEST': 0,
                'ARMS': 0, 'SHLDR': 0, 'CORE': 0
            };
            
            sessions.forEach(session => {
                session.exercises.forEach(exercise => {
                    const muscleName = (exercise.primaryMuscle || exercise.muscle || '').toLowerCase();
                    const mapping = this.muscleMapping[muscleName];
                    
                    if (mapping) {
                        const volume = exercise.weight * exercise.reps * exercise.sets;
                        volumeByGroup[mapping.group] += volume;
                    }
                });
            });
            
            const maxVolume = Math.max(...Object.values(volumeByGroup));
            
            this.muscleData = [
                { name: 'LEGS', value: maxVolume > 0 ? Math.round((volumeByGroup.LEGS / maxVolume) * 100) : 0, volume: volumeByGroup.LEGS, color: '#00f0ff', label: 'HYDRAULICS' },
                { name: 'BACK', value: maxVolume > 0 ? Math.round((volumeByGroup.BACK / maxVolume) * 100) : 0, volume: volumeByGroup.BACK, color: '#6366f1', label: 'STRUCTURE' },
                { name: 'CHEST', value: maxVolume > 0 ? Math.round((volumeByGroup.CHEST / maxVolume) * 100) : 0, volume: volumeByGroup.CHEST, color: '#8b5cf6', label: 'PLATING' },
                { name: 'ARMS', value: maxVolume > 0 ? Math.round((volumeByGroup.ARMS / maxVolume) * 100) : 0, volume: volumeByGroup.ARMS, color: '#ec4899', label: 'PISTONS' },
                { name: 'SHLDR', value: maxVolume > 0 ? Math.round((volumeByGroup.SHLDR / maxVolume) * 100) : 0, volume: volumeByGroup.SHLDR, color: '#d946ef', label: 'JOINTS' },
                { name: 'CORE', value: maxVolume > 0 ? Math.round((volumeByGroup.CORE / maxVolume) * 100) : 0, volume: volumeByGroup.CORE, color: '#f43f5e', label: 'REACTOR' }
            ];
            
            console.log('✅ Données chargées:', this.muscleData);
            
        } catch (error) {
            console.error('❌ Erreur:', error);
            this.generateDemoData();
        }
    }
    
    generateDemoData() {
        this.muscleData = [
            { name: 'LEGS', value: 85, volume: 8500, color: '#00f0ff', label: 'HYDRAULICS' },
            { name: 'BACK', value: 72, volume: 7200, color: '#6366f1', label: 'STRUCTURE' },
            { name: 'CHEST', value: 64, volume: 6400, color: '#8b5cf6', label: 'PLATING' },
            { name: 'ARMS', value: 50, volume: 5000, color: '#ec4899', label: 'PISTONS' },
            { name: 'SHLDR', value: 45, volume: 4500, color: '#d946ef', label: 'JOINTS' },
            { name: 'CORE', value: 30, volume: 3000, color: '#f43f5e', label: 'REACTOR' }
        ];
    }
    
    render() {
        this.injectStyles();
        this.container.innerHTML = '';
        this.container.className = 'premium-volume-chart';
        
        const gridBg = document.createElement('div');
        gridBg.className = 'grid-background';
        gridBg.innerHTML = '<div class="grid-line"></div>';
        this.container.appendChild(gridBg);
        
        this.muscleData.forEach((item, index) => {
            const bar = this.createBar(item, index);
            this.container.appendChild(bar);
        });
    }
    
    createBar(item, index) {
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        barContainer.style.setProperty('--color-glow', item.color);
        
        const percentageLabel = document.createElement('div');
        percentageLabel.className = 'percentage-label';
        percentageLabel.textContent = item.value + '%';
        percentageLabel.style.color = item.color;
        
        const volumeLabel = document.createElement('div');
        volumeLabel.className = 'volume-label';
        volumeLabel.textContent = (item.volume / 1000).toFixed(1) + 'k kg';
        volumeLabel.style.color = item.color;
        volumeLabel.style.opacity = '0';
        
        const barStructure = document.createElement('div');
        barStructure.className = 'bar-structure';
        
        const energyFlow = document.createElement('div');
        energyFlow.className = 'energy-flow';
        energyFlow.style.setProperty('--color-glow', item.color);
        
        const barFilled = document.createElement('div');
        barFilled.className = 'bar-filled';
        barFilled.style.background = `linear-gradient(to top, ${item.color}10, ${item.color})`;
        barFilled.style.height = '0%';
        
        const holoSheen = document.createElement('div');
        holoSheen.className = 'holo-sheen';
        
        const techPattern = document.createElement('div');
        techPattern.className = 'bg-tech-pattern';
        techPattern.style.cssText = 'position: absolute; inset: 0; opacity: 0.3;';
        
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.animationDelay = `${index * 0.3}s`;
        
        const particles = document.createElement('div');
        particles.className = 'particles';
        for (let p = 1; p <= 3; p++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = p === 1 ? '2px' : '1px';
            particle.style.height = p === 1 ? '2px' : '1px';
            particle.style.left = `${20 + (p * 25)}%`;
            particle.style.animationDuration = `${2 + p}s`;
            particle.style.animationDelay = `${index * 0.2 + p}s`;
            particle.style.boxShadow = `0 0 5px ${item.color}`;
            particles.appendChild(particle);
        }
        
        const topEdge = document.createElement('div');
        topEdge.className = 'top-edge';
        
        const emptyPattern = document.createElement('div');
        emptyPattern.className = 'bg-tech-pattern';
        emptyPattern.style.cssText = 'position: absolute; inset: 0; opacity: 0.05; pointer-events: none;';
        
        barFilled.appendChild(holoSheen);
        barFilled.appendChild(techPattern);
        barFilled.appendChild(spark);
        barFilled.appendChild(particles);
        barFilled.appendChild(topEdge);
        
        barStructure.appendChild(barFilled);
        barStructure.appendChild(emptyPattern);
        barStructure.appendChild(energyFlow);
        
        const socketBase = document.createElement('div');
        socketBase.className = 'socket-base';
        const socketInner = document.createElement('div');
        socketInner.className = 'socket-inner';
        socketBase.appendChild(socketInner);
        
        const textLabels = document.createElement('div');
        textLabels.className = 'text-labels';
        const muscleName = document.createElement('span');
        muscleName.className = 'muscle-name';
        muscleName.textContent = item.name;
        const muscleLabel = document.createElement('span');
        muscleLabel.className = 'muscle-label';
        muscleLabel.textContent = item.label;
        textLabels.appendChild(muscleName);
        textLabels.appendChild(muscleLabel);
        
        barContainer.appendChild(percentageLabel);
        barContainer.appendChild(volumeLabel);
        barContainer.appendChild(barStructure);
        barContainer.appendChild(socketBase);
        barContainer.appendChild(textLabels);
        
        barContainer.addEventListener('mouseenter', () => {
            this.hoveredIndex = index;
            this.updateHoverStates();
            this.playHoverSound(800 + (index * 50));
            
            barStructure.classList.add('halo-active');
            percentageLabel.style.textShadow = `0 0 25px ${item.color}, 0 0 5px white`;
            volumeLabel.style.opacity = '0.8';
            socketInner.style.backgroundColor = item.color;
            socketInner.style.boxShadow = `0 0 15px ${item.color}`;
            barStructure.style.boxShadow = `0 0 20px ${item.color}30, inset 0 0 10px ${item.color}20`;
            
            this.generateDynamicSparks(barFilled, item.color);
        });
        
        barContainer.addEventListener('mouseleave', () => {
            this.hoveredIndex = null;
            this.updateHoverStates();
            
            barStructure.classList.remove('halo-active');
            percentageLabel.style.textShadow = 'none';
            volumeLabel.style.opacity = '0';
            socketInner.style.backgroundColor = '#334155';
            socketInner.style.boxShadow = 'none';
            barStructure.style.boxShadow = 'none';
        });
        
        setTimeout(() => {
            barFilled.style.height = item.value + '%';
        }, 200 + (index * 100));
        
        return barContainer;
    }
    
    updateHoverStates() {
        const bars = this.container.querySelectorAll('.bar-container');
        bars.forEach((bar, i) => {
            if (this.hoveredIndex !== null && i !== this.hoveredIndex) {
                bar.classList.add('dimmed');
            } else {
                bar.classList.remove('dimmed');
            }
        });
    }
    
    generateDynamicSparks(container, color) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const spark = document.createElement('div');
                spark.className = 'dynamic-spark';
                spark.style.left = Math.random() * 100 + '%';
                spark.style.boxShadow = `0 0 8px ${color}, 0 0 15px ${color}`;
                spark.style.background = color;
                spark.style.animationDelay = Math.random() * 0.2 + 's';
                container.appendChild(spark);
                setTimeout(() => spark.remove(), 1000);
            }, i * 100);
        }
    }
    
    playHoverSound(freqStart = 600, freqEnd = 1200) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            const now = ctx.currentTime;
            osc.frequency.setValueAtTime(freqStart, now);
            osc.frequency.exponentialRampToValueAtTime(freqEnd, now + 0.05);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) {}
    }
    
    injectStyles() {
        if (document.getElementById('premium-volume-chart-styles')) return;
        const style = document.createElement('style');
        style.id = 'premium-volume-chart-styles';
        style.textContent = `
.premium-volume-chart{width:100%;height:100%;min-height:400px;display:flex;align-items:flex-end;justify-content:center;gap:6px;padding:2px;position:relative}
@keyframes scanlineMove{0%{top:100%;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:0%;opacity:0}}
@keyframes haloPulse{0%{box-shadow:0 0 10px var(--color-glow)}50%{box-shadow:0 0 25px var(--color-glow)}100%{box-shadow:0 0 10px var(--color-glow)}}
@keyframes holoSheen{0%{transform:translateX(-100%) translateY(-100%) rotate(45deg);opacity:0}50%{opacity:0.5}100%{transform:translateX(100%) translateY(100%) rotate(45deg);opacity:0}}
@keyframes particleRise{0%{bottom:0%;opacity:0;transform:scale(0.5)}20%{opacity:1}80%{opacity:1}100%{bottom:100%;opacity:0;transform:scale(1.5)}}
@keyframes energyFlow{0%{transform:translateY(100%)}100%{transform:translateY(-100%)}}
@keyframes sparkRise{0%{bottom:0;opacity:1;transform:scale(1)}100%{bottom:100%;opacity:0;transform:scale(0.3)}}
.bg-tech-pattern{background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.2) 2px,rgba(0,0,0,0.2) 4px)}
.premium-volume-chart .bar-container{flex:1;max-width:55px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;position:relative;transition:opacity 0.3s}
.premium-volume-chart .bar-container:hover{z-index:10}
.premium-volume-chart .bar-container.dimmed{opacity:0.4;filter:grayscale(1) blur(1px)}
.premium-volume-chart .percentage-label{display:block;margin-bottom:4px;font-weight:700;font-size:12px;letter-spacing:2px;transition:all 0.3s;opacity:0.6}
.premium-volume-chart .bar-container:hover .percentage-label{transform:translateY(-12px);opacity:1}
.premium-volume-chart .volume-label{font-size:11px;font-weight:600;margin-bottom:8px;transition:opacity 0.3s}
.premium-volume-chart .bar-structure{position:relative;width:100%;height:70%;background:rgba(17,24,39,0.6);border-radius:2px;border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(4px);overflow:hidden;transition:all 0.3s}
.premium-volume-chart .bar-structure.halo-active{animation:haloPulse 2s infinite ease-in-out}
.premium-volume-chart .energy-flow{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,var(--color-glow) 50%,transparent 70%);opacity:0;transition:opacity 0.3s;pointer-events:none}
.premium-volume-chart .bar-structure.halo-active .energy-flow{opacity:0.2;animation:energyFlow 2s infinite linear}
.premium-volume-chart .bar-filled{position:absolute;bottom:0;width:100%;transition:height 1s cubic-bezier(0.22,1,0.36,1);overflow:hidden}
.premium-volume-chart .holo-sheen{position:absolute;inset:-100%;background:linear-gradient(90deg,transparent 40%,rgba(255,255,255,0.3) 50%,transparent 60%);animation:holoSheen 3s infinite linear;pointer-events:none;mix-blend-mode:overlay}
.premium-volume-chart .spark{position:absolute;left:0;width:100%;height:2px;background:white;box-shadow:0 0 15px white,0 0 30px var(--color-glow);z-index:20;opacity:0;animation:scanlineMove 4s cubic-bezier(0.4,0,0.2,1) infinite}
.premium-volume-chart .particles{position:absolute;inset:0;overflow:hidden}
.premium-volume-chart .particle{position:absolute;background:white;border-radius:50%;bottom:0;animation:particleRise 3s infinite linear}
.premium-volume-chart .dynamic-spark{position:absolute;width:3px;height:3px;background:white;border-radius:50%;pointer-events:none;animation:sparkRise 1s ease-out forwards}
.premium-volume-chart .top-edge{position:absolute;top:0;width:100%;height:2px;background:white;box-shadow:0 0 15px white}
.premium-volume-chart .socket-base{width:100%;margin-top:8px;height:4px;display:flex;justify-content:center}
.premium-volume-chart .socket-inner{height:100%;width:80%;border-radius:9999px;transition:all 0.3s;background-color:#334155}
.premium-volume-chart .bar-container:hover .socket-inner{transform:scaleX(1.2)}
.premium-volume-chart .text-labels{margin-top:16px;text-align:center;z-index:10}
.premium-volume-chart .muscle-name{display:block;font-weight:700;font-size:9px;letter-spacing:0px;color:#6b7280;transition:color 0.3s}
.premium-volume-chart .bar-container:hover .muscle-name{color:white}
.premium-volume-chart .muscle-label{display:none;font-size:9px;color:rgba(255,255,255,0.3);font-family:'Courier New',monospace;text-transform:uppercase;letter-spacing:2px;margin-top:4px;transition:color 0.3s}
.premium-volume-chart .bar-container:hover .muscle-label{color:rgba(255,255,255,0.6)}
.premium-volume-chart .grid-background{position:absolute;inset:0;border-bottom:1px solid rgba(255,255,255,0.1);z-index:0;pointer-events:none}
.premium-volume-chart .grid-line{position:absolute;bottom:0;width:100%;height:1px;background:linear-gradient(to right,transparent,rgba(255,255,255,0.2),transparent)}
        `;
        document.head.appendChild(style);
    }
}

console.log('✅ Premium Volume Chart module loaded');

// CSS MOBILE OPTIMISÉ
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
@media (max-width: 428px) {
    .premium-volume-chart {
        gap: 6px !important;
        padding: 8px !important;
        min-height: 300px !important;
    }
    .premium-volume-chart .bar-container {
        max-width: 55px !important;
    }
    .premium-volume-chart .percentage-label {
        font-size: 18px !important;
        margin-bottom: 2px !important;
    }
    .premium-volume-chart .volume-label {
        font-size: 9px !important;
        margin-bottom: 4px !important;
    }
    .premium-volume-chart .muscle-name {
        font-size: 12px !important;
        letter-spacing: 1px !important;
    }
    .premium-volume-chart .muscle-label {
        font-size: 7px !important;
    }
    .premium-volume-chart .bar-structure {
        height: 60% !important;
    }
}
`;
document.head.appendChild(mobileStyles);
