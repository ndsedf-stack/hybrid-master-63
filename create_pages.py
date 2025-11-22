import re

with open('index.html', 'r') as f:
    content = f.read()

base = '''<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<link rel="stylesheet" href="styles/10-home.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
</head><body style="padding:20px;background:#0a0e1a">
<h1 style="color:#00e5ff;margin-bottom:30px">{emoji} {title}</h1>
{charts}
<a href="index.html" style="display:block;padding:15px;background:rgba(0,229,255,0.2);border:1px solid #00e5ff;border-radius:12px;color:#00e5ff;text-align:center;text-decoration:none;margin-top:20px">← RETOUR</a>
<script src="scripts/modules/stats-engine.js"></script>
<script src="scripts/modules/stats-init.js"></script>
</body></html>'''

containers = re.findall(r'<div class="chart-container[^>]*>.*?</div>\s*</div>', content, re.DOTALL)

chart_map = {}
for c in containers:
    if 'volume-chart' in c: chart_map['volume'] = c
    elif 'progression-chart' in c: chart_map['progression'] = c
    elif 'intensity-chart' in c: chart_map['intensity'] = c
    elif 'force-gauge' in c: chart_map['gauge'] = c
    elif 'spiral' in c: chart_map['spiral'] = c
    elif 'battery' in c: chart_map['battery'] = c
    elif 'tempo' in c: chart_map['tempo'] = c
    elif 'stacked' in c: chart_map['stacked'] = c
    elif 'sunburst' in c: chart_map['sunburst'] = c
    elif 'polar' in c: chart_map['polar'] = c
    elif 'supersets' in c: chart_map['supersets'] = c
    elif 'burst' in c: chart_map['burst'] = c
    elif 'tut-by' in c: chart_map['tut'] = c

pages = {
    'stats-performance.html': ('📈', 'PERFORMANCE', ['volume', 'progression', 'intensity', 'gauge', 'spiral']),
    'stats-recovery.html': ('🔋', 'RÉCUPÉRATION', ['battery', 'tempo']),
    'stats-analyse.html': ('🎯', 'ANALYSE', ['stacked', 'sunburst', 'polar', 'supersets']),
    'stats-records.html': ('🏆', 'RECORDS', ['burst', 'tut'])
}

for filename, (emoji, title, charts) in pages.items():
    charts_html = '\n'.join([chart_map.get(c, '') for c in charts if c in chart_map])
    page = base.format(title=title, emoji=emoji, charts=charts_html)
    with open(filename, 'w') as f:
        f.write(page)
    print(f"✅ {filename}")

print("✅ Terminé")
