import re

with open('index.html', 'r') as f:
    content = f.read()

# Trouve CHAQUE canvas et son conteneur parent (jusqu'à 500 chars avant)
canvas_matches = re.finditer(r'<canvas id="([^"]+)"', content)

charts = {}
for match in canvas_matches:
    canvas_id = match.group(1)
    pos = match.start()
    
    # Remonte pour trouver le début du conteneur (cherche <div class="...)
    start = max(0, pos - 1000)
    before = content[start:pos]
    
    # Trouve le dernier <div avant le canvas
    container_start = before.rfind('<div')
    if container_start >= 0:
        container_start += start
        
        # Trouve la fin du conteneur après le canvas
        after_canvas = content[pos:]
        # Compte les </div> pour fermer
        depth = 1
        i = after_canvas.find('</div>')
        while depth > 0 and i >= 0:
            if '<div' in after_canvas[:i]:
                depth += after_canvas[:i].count('<div')
            depth -= 1
            if depth > 0:
                i = after_canvas.find('</div>', i+6)
        
        end = pos + i + 6 if i >= 0 else pos + 500
        
        charts[canvas_id] = content[container_start:end]
        print(f"✅ {canvas_id}")

print(f"\n✅ Total: {len(charts)} graphiques extraits")

# Sauvegarde
import json
with open('charts_extracted.json', 'w') as f:
    json.dump(charts, f)
