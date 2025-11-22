import json

with open('charts_cleaned.json', 'r') as f:
    charts = json.load(f)

template = '''<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>%(title)s</title>
<link rel="stylesheet" href="styles/10-home.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
<style>
.chart-container, .progress-card { max-width: 100%%; padding: 15px; margin-bottom: 15px; }
canvas { max-width: 100%% !important; height: auto !important; max-height: 300px !important; }
h1 { font-size: 22px !important; }
body { padding: 15px !important; max-width: 428px; margin: 0 auto; }
</style>
</head><body style="padding:20px;background:#0a0e1a">
<h1 style="color:#00e5ff;margin-bottom:30px">%(emoji)s %(title)s</h1>
%(content)s
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
    page = template % {'title': title, 'emoji': emoji, 'content': page_content}
    with open(filename, 'w') as f:
        f.write(page)
    print(f"✅ {filename}")
