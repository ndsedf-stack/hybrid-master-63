#!/bin/bash

echo "🔍 VÉRIFICATION DE SÉCURITÉ AVANT SUPPRESSION"
echo "=============================================="
echo ""

# Fonction pour vérifier si un fichier est vraiment utilisé
verify_file() {
    local file=$1
    local basename=$(basename "$file")
    
    echo "Vérification : $file"
    
    # Cherche dans TOUS les fichiers (HTML, JS, CSS)
    local refs=$(grep -r "$basename" \
        --include="*.html" \
        --include="*.js" \
        --include="*.css" \
        --exclude-dir=".git" \
        --exclude-dir="backups" \
        --exclude-dir="*.backup*" \
        . 2>/dev/null | grep -v "^$file:" | wc -l | tr -d ' ')
    
    if [ "$refs" -eq 0 ]; then
        echo "  ❌ 0 références trouvées - SAFE à supprimer"
    else
        echo "  ⚠️ $refs références trouvées - NE PAS SUPPRIMER !"
        grep -r "$basename" \
            --include="*.html" \
            --include="*.js" \
            --include="*.css" \
            --exclude-dir=".git" \
            --exclude-dir="backups" \
            . 2>/dev/null | grep -v "^$file:" | head -3
    fi
    echo ""
}

echo "📋 VÉRIFICATION DES CSS"
echo "----------------------"
verify_file "./styles/11-responsive-modern.css"
verify_file "./styles/nav-fix.css"
verify_file "./styles/mobile-final.css"
verify_file "./styles/16-timer-widget-premium.css"
verify_file "./styles/15-hybrid-master-premium.css"

echo ""
echo "📋 VÉRIFICATION DES JS CRITIQUES"
echo "---------------------------------"
verify_file "./scripts/modules/volume-load-calculator.js"
verify_file "./scripts/modules/session-storage.js"
verify_file "./scripts/ui/statistics-ui.js"
verify_file "./scripts/ui/theme-switcher.js"
verify_file "./scripts/storage/export-import.js"

echo ""
echo "📋 VÉRIFICATION DES PAGES HTML"
echo "-------------------------------"
verify_file "./debug.html"
verify_file "./home-final.html"
verify_file "./index-old.html"

echo ""
echo "🔍 VÉRIFICATION DES IMPORTS DYNAMIQUES"
echo "---------------------------------------"
echo "Recherche d'imports dynamiques qui pourraient charger des fichiers..."
grep -r "import(" --include="*.js" --include="*.html" . 2>/dev/null | grep -v node_modules | grep -v ".git"

echo ""
echo "🔍 VÉRIFICATION DES FETCH/LOAD DYNAMIQUES"
echo "------------------------------------------"
echo "Recherche de chargements dynamiques..."
grep -rE "(fetch|XMLHttpRequest|load.*\.js|load.*\.css)" --include="*.js" --include="*.html" . 2>/dev/null | grep -v node_modules | grep -v ".git" | head -10

