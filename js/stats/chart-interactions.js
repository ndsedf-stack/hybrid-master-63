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

// Initialisation auto
document.addEventListener('DOMContentLoaded', () => {
    // Swipe navigation
    document.querySelectorAll('.period-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            document.querySelectorAll('.period-dot').forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.dataset.period;
            console.log('Period changed to:', period);
        });
    });
});
