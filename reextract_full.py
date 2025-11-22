import re

with open('index.html', 'r') as f:
    content = f.read()

canvas_ids = ['volume-chart', 'progression-chart', 'intensity-chart', 'force-gauge-chart', 'spiral-progress-chart',
              'recovery-battery-chart', 'tempo-distribution-chart', 'stacked-area-chart', 'sunburst-chart',
              'polar-area-chart', 'supersets-chart', 'burst-animation-chart', 'tut-by-exercise-chart']

charts = {}
for canvas_id in canvas_ids:
    canvas_match = re.search(rf'<canvas id="{canvas_id}"', content)
    if not canvas_match:
        print(f"❌ {canvas_id} non trouvé")
        continue
    
    pos = canvas_match.start()
    before = content[:pos]
    
    container_match = None
    for match in re.finditer(r'<div class="(chart-container|progress-card)[^>]*>', before):
        container_match = match
    
    if not container_match:
        print(f"⚠️  {canvas_id}: pas de container")
        continue
    
    start = container_match.start()
    after_start = content[start:]
    depth = 0
    i = 0
    while i < len(after_start):
        if after_start[i:i+4] == '<div':
            depth += 1
            i += 4
        elif after_start[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                end = start + i + 6
                charts[canvas_id] = content[start:end]
                print(f"✅ {canvas_id}: {len(charts[canvas_id])} chars")
                break
            i += 6
        else:
            i += 1

import json
with open('charts_full.json', 'w') as f:
    json.dump(charts, f)
    
print(f"\n✅ Total: {len(charts)} graphiques")
