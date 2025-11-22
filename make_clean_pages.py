template = '''<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<link rel="stylesheet" href="styles/10-home.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
</head><body style="padding:20px;background:#0a0e1a">
<h1 style="color:#00e5ff;margin-bottom:30px">{emoji} {title}</h1>
<div id="charts-container">{charts}</div>
<a href="index.html" style="display:block;padding:15px;background:rgba(0,229,255,0.2);border:1px solid #00e5ff;border-radius:12px;color:#00e5ff;text-align:center;text-decoration:none;margin-top:20px">← RETOUR</a>
<script src="scripts/modules/stats-engine.js"></script>
<script src="scripts/modules/stats-ui.js"></script>
<script src="scripts/modules/body-tracker.js"></script>
<script src="scripts/modules/pr-detector.js"></script>
<script src="scripts/modules/calculators.js"></script>
<script src="scripts/modules/superset-tracker.js"></script>
<script src="scripts/modules/advanced-charts.js"></script>
<script src="scripts/modules/stats-init.js"></script>
</body></html>'''

import re
with open('index.html', 'r') as f:
    content = f.read()

containers = re.findall(r'<div class="chart-container.*?</canvas>\s*</div>', content, re.DOTALL)

chart_map = {}
for c in containers:
    for name in ['volume-chart', 'progression-chart', 'intensity-chart', 'force-gauge', 'spiral', 'battery', 'tempo', 'stacked', 'sunburst', 'polar', 'supersets', 'burst', 'tut-by']:
        if name in c:
            chart_map[name.split('-')[0]] = c
            break

pages = {
    'stats-performance.html': ('📈', 'PERFORMANCE', ['volume', 'progression', 'intensity', 'force', 'spiral']),
    'stats-recovery.html': ('🔋', 'RÉCUPÉRATION', ['battery', 'tempo']),
    'stats-analyse.html': ('🎯', 'ANALYSE', ['stacked', 'sunburst', 'polar', 'supersets']),
    'stats-records.html': ('🏆', 'PR', ['burst', 'tut'])
}

for filename, (emoji, title, charts) in pages.items():
    charts_html = '\n'.join([chart_map.get(c, '') for c in charts])
    page = template.format(title=title, emoji=emoji, charts=charts_html)
    with open(filename, 'w') as f:
        f.write(page)
    print(f"✅ {filename}")
