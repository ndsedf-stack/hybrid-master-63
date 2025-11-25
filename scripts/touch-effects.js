// EFFETS TACTILES iOS - Fichier séparé
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Touch effects chargé');
    
    // Cartes stats
    var cards = document.querySelectorAll('.stats-card');
    console.log('Cartes trouvées:', cards.length);
    
    cards.forEach(function(card) {
        card.addEventListener('touchstart', function(e) {
            console.log('Touch start carte');
            this.style.transform = 'scale(0.95)';
            if (this.classList.contains('performance')) {
                this.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.5)';
            } else if (this.classList.contains('recovery')) {
                this.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.5)';
            } else if (this.classList.contains('analysis')) {
                this.style.boxShadow = '0 0 30px rgba(155, 89, 255, 0.5)';
            } else if (this.classList.contains('records')) {
                this.style.boxShadow = '0 0 30px rgba(255, 193, 7, 0.5)';
            }
        }, {passive: true});
        
        card.addEventListener('touchend', function(e) {
            this.style.transform = '';
            this.style.boxShadow = '';
        }, {passive: true});
    });
    
    // Nav items
    var navItems = document.querySelectorAll('.nav-item');
    console.log('Nav items trouvés:', navItems.length);
    
    navItems.forEach(function(btn) {
        btn.addEventListener('touchstart', function(e) {
            console.log('Touch start nav');
            this.style.transform = 'scale(0.95)';
            this.style.background = 'rgba(0, 229, 255, 0.2)';
        }, {passive: true});
        
        btn.addEventListener('touchend', function(e) {
            this.style.transform = '';
            this.style.background = '';
        }, {passive: true});
    });
    
    // Header scroll
    var lastScrollY = 0;
    var header = document.querySelector('.app-header');
    
    if (header) {
        header.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        
        window.addEventListener('scroll', function() {
            var currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 60) {
                header.style.transform = 'translateY(-100%)';
                header.style.opacity = '0';
            } else {
                header.style.transform = 'translateY(0)';
                header.style.opacity = '1';
            }
            
            lastScrollY = currentScrollY;
        }, {passive: true});
    }
});
