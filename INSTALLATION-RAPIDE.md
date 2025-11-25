# ⚡ INSTALLATION EN 1 COMMANDE

## 🚀 MÉTHODE RAPIDE

```bash
# 1. Télécharge tous les fichiers du dossier /outputs
# 2. Va dans ton dossier hybrid-master-63/
cd ~/hybrid-master-63

# 3. Place le dossier 'outputs' téléchargé ici
# 4. Lance le script d'installation :
bash outputs/install.sh
```

**C'EST TOUT !** ✅

---

## 📋 CE QUE LE SCRIPT FAIT

1. ✅ Crée les dossiers `css/`, `js/`, `test/`
2. ✅ Copie tous les CSS dans `css/`
3. ✅ Copie la page principale à la racine
4. ✅ Copie les fichiers de test dans `test/`
5. ✅ Copie la documentation
6. ✅ Vérifie que tout est installé

---

## 🎯 APRÈS L'INSTALLATION

### Ouvrir la page
```bash
open test-bio-metrics-with-volume-load.html
```

### Ou avec serveur local
```bash
python3 -m http.server 8000
# Puis ouvrir : http://localhost:8000/test-bio-metrics-with-volume-load.html
```

### Tester VOLUME LOAD
```javascript
// Console Chrome (F12)
testDataUtils.inject()
location.reload()
```

---

## 📁 STRUCTURE APRÈS INSTALLATION

```
hybrid-master-63/
├── test-bio-metrics-with-volume-load.html  ← OUVRE CE FICHIER
├── css/
│   ├── chart-base-common.css
│   ├── bio-metrics-specific.css
│   └── volume-load-specific.css
├── js/
│   ├── bio-metrics-standalone.js  (déjà existant)
│   └── volume-load-gauge.js  (optionnel)
├── test/
│   ├── test-data-utils.js
│   └── test-volume-load-with-data.html
└── README*.md
```

---

## 🐛 DÉPANNAGE

### Erreur "outputs non trouvé"
```bash
# Solution 1 : Place 'outputs' dans le bon dossier
mv ~/Downloads/outputs ~/hybrid-master-63/

# Solution 2 : Spécifie le chemin
bash ~/Downloads/outputs/install.sh
```

### Permission denied
```bash
# Rendre le script exécutable
chmod +x outputs/install.sh
bash outputs/install.sh
```

### Fichier manquant
```bash
# Vérifier le contenu de outputs/
ls -la outputs/
ls -la outputs/css/

# Si des fichiers manquent, copier manuellement :
cp outputs/css/*.css css/
cp outputs/test-bio-metrics-with-volume-load.html ./
```

---

## ⚡ VERSION ENCORE PLUS RAPIDE

**Tout en 1 ligne** (depuis ton dossier hybrid-master-63/) :

```bash
cd ~/hybrid-master-63 && bash outputs/install.sh && open test-bio-metrics-with-volume-load.html
```

**Boom ! Installé et ouvert !** 🚀

---

## 🎉 C'EST PRÊT !

Après le script :
- ✅ 2 stats installées (BIO-METRICS + VOLUME LOAD)
- ✅ CSS commun configuré
- ✅ Pages de test disponibles
- ✅ Documentation copiée

**Tu peux maintenant ouvrir la page et voir ton dashboard !** 💪

---

## 🎯 COMMANDE GIT (après installation)

```bash
git add .
git commit -m "feat: dashboard BIO-METRICS + VOLUME LOAD avec CSS commun"
git push origin main
```

**Push vers Vercel → Déploiement auto en 30s** 🚀
