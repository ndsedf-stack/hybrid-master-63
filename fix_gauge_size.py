#!/usr/bin/env python3

with open('stats-performance.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Trouve la section <style> existante et ajoute le CSS pour agrandir la jauge
new_style = '''
/* VOLUME LOAD - STYLE AGRANDI */
.volume-load-section {
    margin-bottom: 40px;
    width: 100%;
}

.volume-load-header {
    text-align: center;
    margin-bottom: 20px;
}

.volume-load-title {
    font-size: 24px;
    font-weight: 900;
    color: #00e5ff;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
}

.gauge-container {
    position: relative;
    width: 100%;
    max-width: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 30px;
    padding: 20px;
}

#volumeGaugeCanvas {
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-top: 20px;
}

.stat-card {
    background: rgba(0, 229, 255, 0.1);
    border: 1px solid rgba(0, 229, 255, 0.3);
    border-radius: 12px;
    padding: 15px;
    text-align: center;
}

.stat-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 8px;
}

.stat-value {
    font-size: 24px;
    font-weight: 900;
    color: #00e5ff;
}

.halo {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0.6;
}

.halo-1 {
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%);
    animation: pulse 3s ease-in-out infinite;
}

.halo-2 {
    width: 90%;
    height: 90%;
    background: radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%);
    animation: pulse 3s ease-in-out infinite 0.5s;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.05); opacity: 0.8; }
}
'''

# Insère le nouveau style APRÈS le <style> existant
if '</style>' in content:
    content = content.replace('</style>', new_style + '\n</style>')

with open('stats-performance.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ CSS corrigé ! La jauge sera maintenant en grand !")
