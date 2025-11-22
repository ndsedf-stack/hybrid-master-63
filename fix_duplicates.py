import json, re

with open('charts_extracted.json', 'r') as f:
    charts = json.load(f)

# Nettoie chaque chart pour ne garder QUE le container principal
cleaned = {}
for chart_id, html in charts.items():
    # Garde seulement jusqu'au premier </div> qui ferme le canvas
    canvas_pos = html.find(f'<canvas id="{chart_id}"')
    if canvas_pos >= 0:
        # Trouve le </div> qui ferme le chart-container
        after = html[canvas_pos:]
        end = after.find('</div>')
        if end >= 0:
            cleaned[chart_id] = html[:canvas_pos + end + 6]
        else:
            cleaned[chart_id] = html
    else:
        cleaned[chart_id] = html
    
    print(f"✅ {chart_id}: {len(cleaned[chart_id])} chars")

with open('charts_cleaned.json', 'w') as f:
    json.dump(cleaned, f)
