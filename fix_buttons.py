with open('index.html', 'r') as f:
    lines = f.readlines()

# Trouve et remplace les lignes des boutons
for i, line in enumerate(lines):
    if '🔋 EN COURS' in line and 'stats-recovery.html' in line:
        # Premier = Recovery (garde tel quel mais change le texte)
        if '🔋 EN COURS' in line and i == 328:
            lines[i] = line.replace('🔋 EN COURS', '🔋 RÉCUPÉRATION')
        # Deuxième = Analyse
        elif i == 329:
            lines[i] = line.replace('stats-recovery.html', 'stats-analyse.html').replace('🔋 EN COURS', '🎯 ANALYSE')
        # Troisième = Records
        elif i == 330:
            lines[i] = line.replace('stats-recovery.html', 'stats-records.html').replace('🔋 EN COURS', '🏆 RECORDS')

with open('index.html', 'w') as f:
    f.writelines(lines)

print("✅ Boutons corrigés")
