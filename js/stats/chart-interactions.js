// chart-interactions.js - INTERACTIONS PREMIUM

window.ChartInteractions = {
    AutoNightMode: class {
        constructor() {
            this.checkTime();
            setInterval(() => this.checkTime(), 60000);
        }
        
        checkTime() {
            const hour = new Date().getHours();
            if (hour >= 20 || hour < 6) {
                document.body.classList.add('night-mode');
            } else {
                document.body.classList.remove('night-mode');
            }
        }
    }
};

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Period selector
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('period-dot')) {
            const container = e.target.closest('.stats-chart-card');
            container.querySelectorAll('.period-dot').forEach(d => d.classList.remove('active'));
            e.target.classList.add('active');
            
            const period = e.target.dataset.period;
            console.log('Period changed to:', period);
            
            // Trigger refresh event
            const event = new CustomEvent('periodChange', { detail: { period } });
            container.dispatchEvent(event);
        }
    });
    
    // Hover effects
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.stats-chart-card')) {
            const card = e.target.closest('.stats-chart-card');
            card.style.transform = 'translateY(-4px)';
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.stats-chart-card')) {
            const card = e.target.closest('.stats-chart-card');
            card.style.transform = 'translateY(0)';
        }
    });
});
