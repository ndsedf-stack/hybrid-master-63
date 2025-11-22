import re

with open('index.html', 'r') as f:
    content = f.read()

template = '''<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<link rel="stylesheet" href="styles/10-home.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
</head><body style="padding:20px;background:#0a0e1a">
<h1 style="color:#00e5ff;margin-bottom:30px">{emoji} {title}</h1>
{content}
<a href="index.html" style="display:block;padding:15px;background:rgba(0,229,255,0.2);border:1px solid #00e5ff;border-radius:12px;color:#00e5ff;text-align:center;text-decoration:none;margin-top:20px;font-weight:bold">← RETOUR</a>
<script src="scripts/modules/stats-engine.js"></script>
<script src="scripts/modules/stats-ui.js"></script>
<script src="scripts/modules/body-tracker.js"></script>
<script src="scripts/modules/pr-detector.js"></script>
<script src="scripts/modules/calculators.js"></script>
<script src="scripts/modules/superset-tracker.js"></script>
<script src="scripts/modules/advanced-charts.js"></script>
<script src="scripts/modules/stats-init.js"></script>
</body></html>'''

all_containers = re.findall(r'(<div class="chart-container.*?</div>\s*</div>)', content, re.DOTALL)

charts = {}
for container in all_containers:
    for chart_id in ['volume-chart', 'progression-chart', 'intensity-chart', 'force-gauge-chart', 'spiral-progress-chart', 
                     'recovery-battery-chart', 'tempo-distribution-chart', 'stacked-area-chart', 'sunburst-chart', 
                     'polar-area-chart', 'supersets-chart', 'burst-animation-chart', 'tut-by-exercise-chart']:
        if chart_id in container:
            charts[chart_id] = container
            break

pages = {
    'stats-performance.html': ('📈', 'PERFORMANCE', ['volume-chart', 'progression-chart', 'intensity-chart', 'force-gauge-chart', 'spiral-progress-chart']),
    'stats-recovery.html': ('🔋', 'RÉCUPÉRATION', ['recovery-battery-chart', 'tempo-distribution-chart']),
    'stats-analyse.html': ('🎯', 'ANALYSE', ['stacked-area-chart', 'sunburst-chart', 'polar-area-chart', 'supersets-chart']),
    'stats-records.html': ('🏆', 'PR', ['burst-animation-chart', 'tut-by-exercise-chart'])
}

for filename, (emoji, title, chart_ids) in pages.items():
    page_content = '\n'.join([charts.get(cid, '') for cid in chart_ids if cid in charts])
    page = template.format(title=title, emoji=emoji, content=page_content)
    with open(filename, 'w') as f:
        f.write(page)
    found = len([c for c in chart_ids if c in charts])
    print(f"{filename}: {found} graphiques")

print(f"Total: {len(charts)} graphiques trouvés dans index.html")
