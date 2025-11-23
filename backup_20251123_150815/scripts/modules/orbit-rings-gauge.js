// scripts/modules/orbit-rings-gauge.js

export function initOrbitRingsGauge() {
    const canvas = document.getElementById('orbitRingsCanvas');
    if (!canvas) {
        console.error('❌ Canvas orbitRingsCanvas introuvable !');
        return;
    }

    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        const container = canvas.parentElement;
        const size = Math.min(container.clientWidth, 600);
        canvas.width = size;
        canvas.height = size;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function getWeekData() {
        return [
            { week: 1, volume: 28000, intensity: 75, sets: 156 },
            { week: 2, volume: 29500, intensity: 78, sets: 164 },
            { week: 3, volume: 27800, intensity: 72, sets: 152 },
            { week: 4, volume: 31200, intensity: 80, sets: 172 }
        ];
    }

    function animate() {
        const w = canvas.width;
        const h = canvas.height;
        const weekData = getWeekData();
        
        // BACKGROUND TRANSPARENT (PAS DE CARRÉ NOIR)
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const time = Date.now() * 0.0002;

        // Grille radiale subtile
        ctx.strokeStyle = 'rgba(0,229,255,0.08)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 6; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy, i * (w * 0.07), 0, Math.PI * 2);
            ctx.stroke();
        }

        // Lignes radiales
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * (w * 0.42), cy + Math.sin(angle) * (w * 0.42));
            ctx.stroke();
        }

        // ANNEAUX
        weekData.forEach((week, i) => {
            const maxRadius = w * 0.42;
            const centerRadius = w * 0.12;
            const availableSpace = maxRadius - centerRadius;
            const spacing = availableSpace / 4;
            
            const radius = centerRadius + (i + 1) * spacing;
            const thickness = w * 0.05;
            const rotation = time + i * 0.5;

            let ringColor;
            if (week.intensity >= 80) {
                ringColor = '#ff5566';
            } else if (week.intensity >= 75) {
                ringColor = '#ffbb33';
            } else {
                ringColor = '#00eeff';
            }

            // OMBRE
            ctx.save();
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = thickness + 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0,0,0,0.7)';
            ctx.shadowOffsetY = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // BASE
            const darkGrad = ctx.createRadialGradient(cx, cy, radius - thickness/2, cx, cy, radius + thickness/2);
            darkGrad.addColorStop(0, 'rgba(25, 30, 40, 0.95)');
            darkGrad.addColorStop(0.5, 'rgba(30, 35, 45, 0.95)');
            darkGrad.addColorStop(1, 'rgba(25, 30, 40, 0.95)');
            ctx.strokeStyle = darkGrad;
            ctx.lineWidth = thickness;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();

            // SEGMENTS COLORÉS
            ctx.save();
            ctx.strokeStyle = '#ff5566';
            ctx.lineWidth = thickness - 5;
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#ff5566';
            ctx.beginPath();
            ctx.arc(cx, cy, radius, rotation, rotation + 0.15 * Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            const hyperColor = week.intensity > 77 ? '#00ffaa' : '#ffbb33';
            ctx.save();
            ctx.strokeStyle = hyperColor;
            ctx.lineWidth = thickness - 5;
            ctx.shadowBlur = 30;
            ctx.shadowColor = hyperColor;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, rotation + 0.15 * Math.PI * 2, rotation + 0.85 * Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.strokeStyle = '#00eeff';
            ctx.lineWidth = thickness - 5;
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#00eeff';
            ctx.beginPath();
            ctx.arc(cx, cy, radius, rotation + 0.85 * Math.PI * 2, rotation + Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // BORDURES
            ctx.strokeStyle = 'rgba(255,255,255,0.25)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cx, cy, radius + thickness/2 - 1, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx, cy, radius - thickness/2 + 1, 0, Math.PI * 2);
            ctx.stroke();

            // BADGE SEMAINE
            const labelAngle = rotation + Math.PI * 0.5;
            const lx = cx + Math.cos(labelAngle) * radius;
            const ly = cy + Math.sin(labelAngle) * radius;
            
            const badgeSize = w * 0.055;
            
            ctx.save();
            const badgeGrad = ctx.createRadialGradient(lx, ly - 2, 0, lx, ly, badgeSize);
            badgeGrad.addColorStop(0, ringColor);
            badgeGrad.addColorStop(0.5, ringColor);
            badgeGrad.addColorStop(1, 'rgba(0,0,0,0.8)');
            
            ctx.shadowBlur = 25;
            ctx.shadowColor = ringColor;
            ctx.fillStyle = badgeGrad;
            ctx.beginPath();
            ctx.arc(lx, ly, badgeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            ctx.strokeStyle = 'rgba(255,255,255,0.6)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(lx, ly, badgeSize, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${w * 0.038}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#000';
            ctx.fillText('S' + (i + 1), lx, ly);
            ctx.shadowBlur = 0;
        });

        // STATS VOLANTES (DEVANT)
        weekData.forEach((week, i) => {
            const maxRadius = w * 0.42;
            const centerRadius = w * 0.12;
            const availableSpace = maxRadius - centerRadius;
            const spacing = availableSpace / 4;
            const radius = centerRadius + (i + 1) * spacing;
            const rotation = time + i * 0.5;

            let ringColor;
            if (week.intensity >= 80) {
                ringColor = '#ff5566';
            } else if (week.intensity >= 75) {
                ringColor = '#ffbb33';
            } else {
                ringColor = '#00eeff';
            }

            const statsAngle = rotation - Math.PI * 0.5;
            const statsDistance = radius;
            const sx = cx + Math.cos(statsAngle) * statsDistance;
            const sy = cy + Math.sin(statsAngle) * statsDistance;
            
            const statsW = w * 0.16;
            const statsH = w * 0.08;
            
            ctx.save();
            ctx.fillStyle = 'rgba(15, 20, 30, 0.95)';
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.beginPath();
            ctx.roundRect(sx - statsW/2, sy - statsH/2, statsW, statsH, w * 0.015);
            ctx.fill();
            ctx.restore();
            
            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 20;
            ctx.shadowColor = ringColor;
            ctx.beginPath();
            ctx.roundRect(sx - statsW/2, sy - statsH/2, statsW, statsH, w * 0.015);
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            ctx.fillStyle = ringColor;
            ctx.font = `bold ${w * 0.032}px monospace`;
            ctx.textAlign = 'center';
            ctx.shadowBlur = 8;
            ctx.shadowColor = ringColor;
            ctx.fillText((week.volume / 1000).toFixed(1) + 'k', sx, sy - w * 0.012);
            ctx.shadowBlur = 0;
            
            ctx.font = `bold ${w * 0.024}px monospace`;
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 3;
            ctx.shadowColor = '#000';
            ctx.fillText(week.intensity + '% INT', sx, sy + w * 0.016);
            ctx.shadowBlur = 0;
        });

        // CENTRE - TEXTE PLUS VISIBLE
        const centerRadius = w * 0.11;
        
        ctx.save();
        const shadowGrad = ctx.createRadialGradient(cx, cy + 2, 0, cx, cy + 2, centerRadius);
        shadowGrad.addColorStop(0, 'rgba(0,0,0,0.8)');
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy + 2, centerRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const centerGrad = ctx.createRadialGradient(cx - centerRadius * 0.3, cy - centerRadius * 0.3, 0, cx, cy, centerRadius);
        centerGrad.addColorStop(0, '#2a3442');
        centerGrad.addColorStop(0.5, '#1a2332');
        centerGrad.addColorStop(1, '#0f1625');
        ctx.fillStyle = centerGrad;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.beginPath();
        ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        const highlightGrad = ctx.createRadialGradient(cx - centerRadius * 0.4, cy - centerRadius * 0.4, 0, cx - centerRadius * 0.4, cy - centerRadius * 0.4, centerRadius * 0.7);
        highlightGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
        highlightGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = highlightGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#00eeff';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#00eeff';
        ctx.beginPath();
        ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        const totalVol = weekData.reduce((sum, w) => sum + w.volume, 0);
        
        // TEXTE "4 SEMAINES" ULTRA VISIBLE
        ctx.fillStyle = '#00eeff';
        ctx.font = `bold ${w * 0.048}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#00eeff';
        ctx.fillText('4 SEMAINES', cx, cy - w * 0.024);
        ctx.shadowBlur = 0;
        
        ctx.font = `bold ${w * 0.042}px monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#000';
        ctx.fillText((totalVol / 1000).toFixed(1) + 'k', cx, cy + w * 0.022);
        ctx.shadowBlur = 0;
        
        ctx.font = `bold ${w * 0.026}px monospace`;
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#000';
        ctx.fillText('TOTAL', cx, cy + w * 0.052);
        ctx.shadowBlur = 0;

        requestAnimationFrame(animate);
    }

    animate();
}
