import json

with open('charts_extracted.json', 'r') as f:
    charts = json.load(f)

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

pages = {
    'stats-performance.html': ('📈', 'PERFORMANCE', ['volume-chart', 'progression-chart', 'intensity-chart', 'force-gauge-chart', 'spiral-progress-chart']),
    'stats-recovery.html': ('🔋', 'RÉCUPÉRATION', ['recovery-battery-chart', 'tempo-distribution-chart']),
    'stats-analyse.html': ('🎯', 'ANALYSE', ['stacked-area-chart', 'sunburst-chart', 'polar-area-chart', 'supersets-chart']),
    'stats-records.html': ('🏆', 'PR', ['burst-animation-chart', 'tut-by-exercise-chart'])
}

for filename, (emoji, title, chart_ids) in pages.items():
    page_content = '\n\n'.join([charts[cid] for cid in chart_ids if cid in charts])
    page = template.format(title=title, emoji=emoji, content=page_content)
    with open(filename, 'w') as f:
        f.write(page)
    print(f"✅ {filename}: {len([c for c in chart_ids if c in charts])} graphiques")
