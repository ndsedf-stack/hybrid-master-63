#!/usr/bin/env python3
import re

# Lit le fichier
with open('stats-performance.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Ajoute le CSS volume-load dans le <head>
css_link = '<link rel="stylesheet" href="styles/volume-load.css">'
if css_link not in content:
    content = content.replace(
        '<link rel="stylesheet" href="styles/premium-effects.css">',
        '<link rel="stylesheet" href="styles/premium-effects.css">\n    ' + css_link
    )

# 2. Ajoute la section Volume Load après le <h1>
volume_section = '''
<!-- SECTION VOLUME LOAD -->
<div class="volume-load-section" style="margin-bottom: 40px;">
    <div class="volume-load-header">
        <h2 class="volume-load-title">💪 VOLUME LOAD</h2>
    </div>
    
    <div class="gauge-container">
        <canvas id="volumeGaugeCanvas"></canvas>
        
        <div class="halo halo-1"></div>
        <div class="halo halo-2"></div>
        <div class="halo halo-3"></div>
        <div class="halo halo-4"></div>
    </div>
    
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-label">SETS</div>
            <div class="stat-value" id="setsValue">0</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">TUT</div>
            <div class="stat-value" id="tutValue">0:00</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">VOLUME</div>
            <div class="stat-value" id="volumeValue">0 kg</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">STATUS</div>
            <div class="stat-value" id="statusValue">-</div>
        </div>
    </div>
</div>
<!-- FIN SECTION VOLUME LOAD -->
'''

# Insère après le <h1>
content = content.replace(
    '<h1 style="color:#00e5ff;margin-bottom:30px">📈 PERFORMANCE</h1>',
    '<h1 style="color:#00e5ff;margin-bottom:30px">📈 PERFORMANCE</h1>\n' + volume_section
)

# 3. Ajoute le script avant </body>
script_section = '''
<!-- VOLUME LOAD GAUGE SCRIPT -->
<script type="module">
    import { VolumeLoadGauge } from './scripts/modules/volume-load-gauge.js';
    
    document.addEventListener('DOMContentLoaded', () => {
        try {
            console.log('🎯 Initialisation Volume Load Gauge...');
            const gauge = new VolumeLoadGauge('volumeGaugeCanvas');
            console.log('✅ Volume Load Gauge initialisée !');
        } catch (error) {
            console.error('❌ Erreur initialisation jauge:', error);
        }
    });
</script>
'''

if '</body>' in content:
    content = content.replace('</body>', script_section + '\n</body>')

# Écrit le fichier modifié
with open('stats-performance.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Intégration terminée !")
print("🧪 Teste : python3 -m http.server 8003")
print("🔗 Ouvre : http://localhost:8003/stats-performance.html")
