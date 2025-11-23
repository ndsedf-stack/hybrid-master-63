// scripts/modules/orbit-rings-gauge.js - PHASE 3 FINAL

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
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';
        ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function getWeekData() {
        const sessions = JSON.parse(localStorage.getItem('completedSessions') || '[]');
        
        if (sessions.length === 0) {
            return [
                { week: 1, volume: 28000, intensity: 75, sets: 156 },
                { week: 2, volume: 29500, intensity: 78, sets: 164 },
                { week: 3, volume: 27800, intensity: 72, sets: 152 },
                { week: 4, volume: 31200, intensity: 80, sets: 172 }
            ];
        }

        const now = new Date();
        const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
        
        const recentSessions = sessions.filter(s => {
            const sessionDate = new Date(s.date);
            return sessionDate >= fourWeeksAgo;
        });

        const weeklyData = {};
        recentSessions.forEach(session => {
            const sessionDate = new Date(session.date);
            const weekNumber = Math.floor((now - sessionDate) / (7 * 24 * 60 * 60 * 1000));
            const weekKey = 4 - Math.min(weekNumber, 3);
            
            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = { volume: 0, totalIntensity: 0, sets: 0, count: 0 };
            }
            
            if (session.exercises && Array.isArray(session.exercises)) {
                session.exercises.forEach(ex => {
                    if (ex.sets && Array.isArray(ex.sets)) {
                        ex.sets.forEach(set => {
                            const weight = parseFloat(set.weight) || 0;
                            const reps = parseInt(set.reps) || 0;
                            const rm = parseFloat(set.rm) || 0;
                            
                            weeklyData[weekKey].volume += weight * reps;
                            weeklyData[weekKey].sets++;
                            
                            if (rm > 0) {
                                const intensity = (weight / rm) * 100;
                                weeklyData[weekKey].totalIntensity += intensity;
                                weeklyData[weekKey].count++;
                            }
                        });
                    }
                });
            }
        });

        const result = [];
        for (let i = 1; i <= 4; i++) {
            if (weeklyData[i]) {
                const avgIntensity = weeklyData[i].count > 0 
                    ? Math.round(weeklyData[i].totalIntensity / weeklyData[i].count)
                    : 0;
                    
                result.push({
                    week: i,
                    volume: Math.round(weeklyData[i].volume),
                    intensity: avgIntensity,
                    sets: weeklyData[i].sets
                });
            } else {
                result.push({
                    week: i,
                    volume: 0,
                    intensity: 0,
                    sets: 0
                });
            }
        }

        return result;
    }

    const weekData = getWeekData();
    const hasRealData = JSON.parse(localStorage.getItem('completedSessions') || '[]').length > 0;
    
    if (!hasRealData) {
        console.warn('⚠️ Aucune session - données démo Orbit Rings');
    } else {
        console.log('📊 Données Orbit Rings calculées:', weekData);
    }

    const maxVolumeWeek = weekData.reduce((max, week) => 
        week.volume > max.volume ? week : max, weekData[0]);

    const deltas = weekData.map((week, i) => {
        if (i === 0) return null;
        const prev = weekData[i - 1];
        return {
            volume: week.volume - prev.volume,
            intensity: week.intensity - prev.intensity,
            sets: week.sets - prev.sets
        };
    });

    // ✅ CALCUL DES BADGES
    function calculateBadges() {
        const badges = [];
        
        weekData.forEach((week, i) => {
            // RECORD : Volume max
            if (week.week === maxVolumeWeek.week && week.volume > 0) {
                badges.push({ index: i, type: 'RECORD', color: '#ffaa00' });
            }
            
            // CONSISTENT : Peu de variation
            if (i > 0 && deltas[i]) {
                const variation = Math.abs(deltas[i].volume / weekData[i-1].volume);
                if (variation < 0.1 && week.volume > 0) {
                    badges.push({ index: i, type: 'CONSISTENT', color: '#00ff88' });
                }
            }
            
            // OVERLOAD : Forte progression
            if (i > 0 && deltas[i] && deltas[i].volume > 0) {
                const progression = deltas[i].volume / weekData[i-1].volume;
                if (progression > 0.15) {
                    badges.push({ index: i, type: 'OVERLOAD', color: '#ff5566' });
                }
            }
        });
        
        return badges;
    }

    const performanceBadges = calculateBadges();

    // ✅ CALCUL SCORE PROGRESSION
    function calculateProgressionScore() {
        const totalVolume = weekData.reduce((sum, w) => sum + w.volume, 0);
        const avgIntensity = weekData.reduce((sum, w) => sum + w.intensity, 0) / weekData.length;
        
        // Progression S1 → S4
        const progression = weekData[3].volume > 0 && weekData[0].volume > 0
            ? (weekData[3].volume - weekData[0].volume) / weekData[0].volume
            : 0;
        
        // Consistance (peu de variations)
        const variations = deltas.filter(d => d).map((d, i) => 
            weekData[i].volume > 0 ? Math.abs(d.volume / weekData[i].volume) : 0
        );
        const consistency = variations.length > 0
            ? 1 - (variations.reduce((sum, v) => sum + v, 0) / variations.length)
            : 0;
        
        // Score final (0-100)
        const volumeScore = Math.min((totalVolume / 120000) * 40, 40); // Max 40 pts
        const intensityScore = (avgIntensity / 100) * 30; // Max 30 pts
        const progressionScore = Math.max(progression * 15, 0); // Max 15 pts
        const consistencyScore = consistency * 15; // Max 15 pts
        
        return Math.min(Math.round(volumeScore + intensityScore + progressionScore + consistencyScore), 100);
    }

    const progressionScore = calculateProgressionScore();

    let hoveredBadge = null;
    let hoveredCenter = false;
    let mousePos = { x: 0, y: 0 };

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mousePos = { x, y };

        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);
        const cx = w / 2;
        const cy = h / 2;
        const centerRadius = w * 0.11;

        const distCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        hoveredCenter = distCenter <= centerRadius;

        hoveredBadge = null;
        const time = Date.now() * 0.0002;
        
        weekData.forEach((week, i) => {
            const maxRadius = w * 0.42;
            const centerRadiusCalc = w * 0.12;
            const availableSpace = maxRadius - centerRadiusCalc;
            const spacing = availableSpace / 4;
            const radius = centerRadiusCalc + (i + 1) * spacing;
            const rotation = time + i * 0.5;
            const labelAngle = rotation + Math.PI * 0.5;
            const lx = cx + Math.cos(labelAngle) * radius;
            const ly = cy + Math.sin(labelAngle) * radius;
            const badgeSize = w * 0.055;

            const distBadge = Math.sqrt((x - lx) ** 2 + (y - ly) ** 2);
            if (distBadge <= badgeSize) {
                hoveredBadge = { week, index: i, x: lx, y: ly };
            }
        });

        canvas.style.cursor = (hoveredBadge || hoveredCenter) ? 'pointer' : 'default';
    });

    canvas.addEventListener('mouseleave', () => {
        hoveredBadge = null;
        hoveredCenter = false;
        canvas.style.cursor = 'default';
    });

    // ✅ ANIMATION INTRO
    const startTime = Date.now();
    const introDuration = 2000; // 2 secondes

    function getIntroProgress() {
        const elapsed = Date.now() - startTime;
        return Math.min(elapsed / introDuration, 1);
    }

    function animate() {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);
        
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const time = Date.now() * 0.0002;
        const pulse = Math.sin(Date.now() * 0.002) * 0.5 + 0.5;
        const haloPulse = Math.sin(Date.now() * 0.003) * 0.3 + 0.7;
        
        // ✅ PROGRESSION INTRO
        const introProgress = getIntroProgress();
        const easeOut = 1 - Math.pow(1 - introProgress, 3);

        // ✅ SCANLINES COCKPIT
        ctx.save();
        ctx.globalAlpha = 0.08;
        for (let y = 0; y < h; y += 4) {
            ctx.fillStyle = y % 8 === 0 ? 'rgba(0, 229, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, y, w, 2);
        }
        ctx.restore();

        // Grille radiale
        ctx.strokeStyle = 'rgba(0,229,255,0.08)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 6; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy, i * (w * 0.07), 0, Math.PI * 2);
            ctx.stroke();
        }

        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * (w * 0.42), cy + Math.sin(angle) * (w * 0.42));
            ctx.stroke();
        }

        // ANNEAUX
        const badgePositions = [];
        weekData.forEach((week, i) => {
            // ✅ INTRO : Apparition progressive
            const ringProgress = Math.max(0, Math.min(1, (introProgress - i * 0.15) / 0.3));
            if (ringProgress === 0) return;
            
            ctx.save();
            ctx.globalAlpha = ringProgress;
            
            const maxRadius = w * 0.42;
            const centerRadius = w * 0.12;
            const availableSpace = maxRadius - centerRadius;
            const spacing = availableSpace / 4;
            
            const radius = centerRadius + (i + 1) * spacing * easeOut;
            const thickness = w * 0.05;
            const rotation = time + i * 0.5 + (1 - easeOut) * Math.PI * 2;

            let ringColor;
            const isMaxVolume = week.week === maxVolumeWeek.week;
            
            if (isMaxVolume) {
                ringColor = '#ff5566';
            } else if (week.intensity >= 80) {
                ringColor = '#ff5566';
            } else if (week.intensity >= 75) {
                ringColor = '#ffbb33';
            } else {
                ringColor = '#00eeff';
            }

            // OMBRE
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = thickness + 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0,0,0,0.7)';
            ctx.shadowOffsetY = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;

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

            // SEGMENTS
            const forceGrad = ctx.createLinearGradient(
                cx + Math.cos(rotation) * radius,
                cy + Math.sin(rotation) * radius,
                cx + Math.cos(rotation + 0.15 * Math.PI * 2) * radius,
                cy + Math.sin(rotation + 0.15 * Math.PI * 2) * radius
            );
            forceGrad.addColorStop(0, '#ff5566');
            forceGrad.addColorStop(0.5, '#ff2288');
            forceGrad.addColorStop(1, '#ff5566');
            ctx.strokeStyle = forceGrad;
            ctx.lineWidth = thickness - 5;
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#ff5566';
            ctx.beginPath();
            ctx.arc(cx, cy, radius, rotation, rotation + 0.15 * Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            const hyperColor = week.intensity > 77 ? '#00ffaa' : '#ffbb33';
            const hyperGrad = ctx.createLinearGradient(
                cx + Math.cos(rotation + 0.15 * Math.PI * 2) * radius,
                cy + Math.sin(rotation + 0.15 * Math.PI * 2) * radius,
                cx + Math.cos(rotation + 0.85 * Math.PI * 2) * radius,
                cy + Math.sin(rotation + 0.85 * Math.PI * 2) * radius
            );
            hyperGrad.addColorStop(0, '#00eeff');
            hyperGrad.addColorStop(0.3, '#8844ff');
            hyperGrad.addColorStop(0.7, '#ff22aa');
            hyperGrad.addColorStop(1, hyperColor);
            ctx.strokeStyle = hyperGrad;
            ctx.lineWidth = thickness - 5;
            ctx.shadowBlur = 30;
            ctx.shadowColor = hyperColor;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, rotation + 0.15 * Math.PI * 2, rotation + 0.85 * Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            const enduGrad = ctx.createLinearGradient(
                cx + Math.cos(rotation + 0.85 * Math.PI * 2) * radius,
                cy + Math.sin(rotation + 0.85 * Math.PI * 2) * radius,
                cx + Math.cos(rotation + Math.PI * 2) * radius,
                cy + Math.sin(rotation + Math.PI * 2) * radius
            );
            enduGrad.addColorStop(0, '#00eeff');
            enduGrad.addColorStop(0.5, '#0088ff');
            enduGrad.addColorStop(1, '#00eeff');
            ctx.strokeStyle = enduGrad;
            ctx.lineWidth = thickness - 5;
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#00eeff';
            ctx.beginPath();
            ctx.arc(cx, cy, radius, rotation + 0.85 * Math.PI * 2, rotation + Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // BORDURES
            ctx.strokeStyle = 'rgba(255,255,255,0.25)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cx, cy, radius + thickness/2 - 1, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx, cy, radius - thickness/2 + 1, 0, Math.PI * 2);
            ctx.stroke();

            // BADGE
            const labelAngle = rotation + Math.PI * 0.5;
            const lx = cx + Math.cos(labelAngle) * radius;
            const ly = cy + Math.sin(labelAngle) * radius;
            badgePositions.push({ x: lx, y: ly, week, index: i });
            
            const badgeSize = w * 0.055;
            
            if (isMaxVolume) {
                ctx.shadowBlur = 40 * haloPulse;
                ctx.shadowColor = '#ff5566';
                ctx.fillStyle = 'rgba(255, 85, 102, 0.3)';
                ctx.beginPath();
                ctx.arc(lx, ly, badgeSize * 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            
            const isHovered = hoveredBadge && hoveredBadge.index === i;
            if (isHovered) {
                ctx.shadowBlur = 50;
                ctx.shadowColor = ringColor;
                ctx.fillStyle = `rgba(0, 229, 255, 0.2)`;
                ctx.beginPath();
                ctx.arc(lx, ly, badgeSize * 1.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            
            const badgeGrad = ctx.createRadialGradient(lx, ly - 2, 0, lx, ly, badgeSize);
            badgeGrad.addColorStop(0, ringColor);
            badgeGrad.addColorStop(0.5, ringColor);
            badgeGrad.addColorStop(1, 'rgba(0,0,0,0.8)');
            
            ctx.shadowBlur = isHovered ? 35 : 25;
            ctx.shadowColor = ringColor;
            ctx.fillStyle = badgeGrad;
            ctx.beginPath();
            ctx.arc(lx, ly, badgeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            const reflectGrad = ctx.createLinearGradient(
                lx - badgeSize * 0.5, 
                ly - badgeSize * 0.8, 
                lx + badgeSize * 0.5, 
                ly + badgeSize * 0.8
            );
            reflectGrad.addColorStop(0, 'rgba(255,255,255,0)');
            reflectGrad.addColorStop(0.3, 'rgba(255,255,255,0.6)');
            reflectGrad.addColorStop(0.7, 'rgba(255,255,255,0)');
            ctx.fillStyle = reflectGrad;
            ctx.beginPath();
            ctx.arc(lx, ly - badgeSize * 0.3, badgeSize * 0.6, 0, Math.PI);
            ctx.fill();
            
            ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(255,255,255,0.6)';
            ctx.lineWidth = isHovered ? 3 : 2.5;
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

            // ✅ BADGES PERFORMANCE
            const badge = performanceBadges.find(b => b.index === i);
            if (badge && introProgress > 0.8) {
                const badgeY = ly - badgeSize - w * 0.025;
                
                ctx.fillStyle = badge.color;
                ctx.font = `bold ${w * 0.018}px monospace`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = badge.color;
                ctx.fillText(badge.type, lx, badgeY);
                ctx.shadowBlur = 0;
            }

            // DELTA
            if (deltas[i]) {
                const delta = deltas[i];
                const volumeDelta = delta.volume;
                const sign = volumeDelta >= 0 ? '+' : '';
                const color = volumeDelta >= 0 ? '#00ff88' : '#ff5566';
                
                ctx.fillStyle = color;
                ctx.font = `bold ${w * 0.022}px monospace`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = color;
                ctx.fillText(`${sign}${(volumeDelta / 1000).toFixed(1)}k`, lx, ly + badgeSize + w * 0.03);
                ctx.shadowBlur = 0;
            }
            
            ctx.restore();
        });

        // FLÈCHE S3 → S4
        if (weekData.length >= 4 && introProgress > 0.7) {
            const s3 = badgePositions[2];
            const s4 = badgePositions[3];
            if (s3 && s4) {
                const progression = weekData[3].volume - weekData[2].volume;
                const progressionPercent = weekData[2].volume > 0 
                    ? ((progression / weekData[2].volume) * 100).toFixed(0)
                    : 0;
                
                const arrowColor = progression >= 0 ? '#00ff88' : '#ff5566';
                
                ctx.save();
                ctx.globalAlpha = (introProgress - 0.7) / 0.3;
                ctx.strokeStyle = arrowColor;
                ctx.lineWidth = 3;
                ctx.shadowBlur = 15;
                ctx.shadowColor = arrowColor;
                ctx.setLineDash([5, 5]);
                
                ctx.beginPath();
                ctx.moveTo(s3.x + w * 0.04, s3.y - w * 0.06);
                ctx.lineTo(s4.x - w * 0.04, s4.y - w * 0.06);
                ctx.stroke();
                ctx.setLineDash([]);
                
                const angle = Math.atan2(s4.y - s3.y, s4.x - s3.x);
                const arrowSize = w * 0.015;
                ctx.beginPath();
                ctx.moveTo(s4.x - w * 0.04, s4.y - w * 0.06);
                ctx.lineTo(
                    s4.x - w * 0.04 - arrowSize * Math.cos(angle - Math.PI / 6),
                    s4.y - w * 0.06 - arrowSize * Math.sin(angle - Math.PI / 6)
                );
                ctx.lineTo(
                    s4.x - w * 0.04 - arrowSize * Math.cos(angle + Math.PI / 6),
                    s4.y - w * 0.06 - arrowSize * Math.sin(angle + Math.PI / 6)
                );
                ctx.closePath();
                ctx.fillStyle = arrowColor;
                ctx.fill();
                
                const midX = (s3.x + s4.x) / 2;
                const midY = (s3.y + s4.y) / 2 - w * 0.07;
                
                ctx.fillStyle = arrowColor;
                ctx.font = `bold ${w * 0.026}px monospace`;
                ctx.textAlign = 'center';
                ctx.shadowBlur = 10;
                ctx.shadowColor = arrowColor;
                ctx.fillText(`${progressionPercent >= 0 ? '+' : ''}${progressionPercent}%`, midX, midY);
                ctx.shadowBlur = 0;
                ctx.restore();
            }
        }

        // STATS VOLANTES
        weekData.forEach((week, i) => {
            const ringProgress = Math.max(0, Math.min(1, (introProgress - i * 0.15) / 0.3));
            if (ringProgress === 0) return;
            
            ctx.save();
            ctx.globalAlpha = ringProgress;
            
            const maxRadius = w * 0.42;
            const centerRadius = w * 0.12;
            const availableSpace = maxRadius - centerRadius;
            const spacing = availableSpace / 4;
            const radius = centerRadius + (i + 1) * spacing * easeOut;
            const rotation = time + i * 0.5 + (1 - easeOut) * Math.PI * 2;

            let ringColor;
            const isMaxVolume = week.week === maxVolumeWeek.week;
            if (isMaxVolume) {
                ringColor = '#ff5566';
            } else if (week.intensity >= 80) {
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
            
            ctx.fillStyle = 'rgba(15, 20, 30, 0.95)';
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.beginPath();
            ctx.roundRect(sx - statsW/2, sy - statsH/2, statsW, statsH, w * 0.015);
            ctx.fill();
            ctx.shadowBlur = 0;
            
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
            
            ctx.restore();
        });

        // CENTRE
        const centerRadius = w * 0.11;
        
        if (hoveredCenter) {
            ctx.save();
            const hoverGrad = ctx.createRadialGradient(cx, cy, centerRadius * 0.8, cx, cy, centerRadius * 1.6);
            hoverGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
            hoverGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.4)');
            hoverGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
            ctx.fillStyle = hoverGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, centerRadius * 1.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        ctx.save();
        const haloGrad = ctx.createRadialGradient(cx, cy, centerRadius * 0.9, cx, cy, centerRadius * 1.4);
        haloGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
        haloGrad.addColorStop(0.5, `rgba(0, 229, 255, ${0.3 * haloPulse})`);
        haloGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, centerRadius * 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
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

        ctx.strokeStyle = hoveredCenter ? '#ffffff' : '#00eeff';
        ctx.lineWidth = hoveredCenter ? 5 : 4;
        ctx.shadowBlur = hoveredCenter ? 40 : 30 * haloPulse;
        ctx.shadowColor = '#00eeff';
        ctx.beginPath();
        ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        const totalVol = weekData.reduce((sum, w) => sum + w.volume, 0);
        
        // ✅ SCORE AU CENTRE
        if (introProgress > 0.5) {
            ctx.save();
            ctx.globalAlpha = (introProgress - 0.5) / 0.5;
            
            ctx.fillStyle = '#00eeff';
            ctx.font = `bold ${w * 0.032}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00eeff';
            ctx.fillText('SCORE', cx, cy - w * 0.045);
            ctx.shadowBlur = 0;
            
            // Score avec couleur selon performance
            let scoreColor = '#00eeff';
            if (progressionScore >= 80) scoreColor = '#00ff88';
            else if (progressionScore >= 60) scoreColor = '#ffbb33';
            else if (progressionScore < 40) scoreColor = '#ff5566';
            
            ctx.fillStyle = scoreColor;
            ctx.font = `bold ${w * 0.055}px monospace`;
            ctx.shadowBlur = 25;
            ctx.shadowColor = scoreColor;
            ctx.fillText(progressionScore, cx, cy - w * 0.005);
            ctx.shadowBlur = 0;
            
            ctx.font = `bold ${w * 0.022}px monospace`;
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#000';
            ctx.fillText('/100', cx, cy + w * 0.028);
            ctx.shadowBlur = 0;
            
            ctx.restore();
        }
        
        // Volume total en bas
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${w * 0.024}px monospace`;
        ctx.textAlign = 'center';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#000';
        ctx.fillText((totalVol / 1000).toFixed(1) + 'k VOL', cx, cy + w * 0.065);
        ctx.shadowBlur = 0;

        // ✅ POPUP HOVER BADGE
        if (hoveredBadge) {
            const week = hoveredBadge.week;
            const px = mousePos.x;
            const py = mousePos.y;
            
            const popupW = w * 0.25;
            const popupH = w * 0.15;
            let popupX = px + w * 0.05;
            let popupY = py - popupH / 2;
            
            if (popupX + popupW > w) popupX = px - popupW - w * 0.05;
            if (popupY < w * 0.02) popupY = w * 0.02;
            if (popupY + popupH > h - w * 0.02) popupY = h - popupH - w * 0.02;
            
            ctx.save();
            ctx.fillStyle = 'rgba(10, 15, 25, 0.98)';
            ctx.shadowBlur = 30;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.beginPath();
            ctx.roundRect(popupX, popupY, popupW, popupH, w * 0.02);
            ctx.fill();
            ctx.restore();
            
            ctx.strokeStyle = '#00eeff';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00eeff';
            ctx.beginPath();
            ctx.roundRect(popupX, popupY, popupW, popupH, w * 0.02);
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            ctx.fillStyle = '#00eeff';
            ctx.font = `bold ${w * 0.028}px monospace`;
            ctx.textAlign = 'left';
            ctx.fillText(`SEMAINE ${week.week}`, popupX + w * 0.02, popupY + w * 0.025);
            
            const lineHeight = w * 0.03;
            let lineY = popupY + w * 0.055;
            
            ctx.font = `${w * 0.022}px monospace`;
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`Volume: ${(week.volume / 1000).toFixed(1)}k`, popupX + w * 0.02, lineY);
            lineY += lineHeight;
            
            ctx.fillText(`Intensité: ${week.intensity}%`, popupX + w * 0.02, lineY);
            lineY += lineHeight;
            
            ctx.fillText(`Sets: ${week.sets}`, popupX + w * 0.02, lineY);
            
            if (deltas[hoveredBadge.index]) {
                const delta = deltas[hoveredBadge.index];
                lineY += lineHeight;
                const sign = delta.volume >= 0 ? '+' : '';
                const color = delta.volume >= 0 ? '#00ff88' : '#ff5566';
                ctx.fillStyle = color;
                ctx.fillText(`Δ: ${sign}${(delta.volume / 1000).toFixed(1)}k`, popupX + w * 0.02, lineY);
            }
        }

        // ✅ POPUP HOVER CENTRE
        if (hoveredCenter) {
            const px = mousePos.x;
            const py = mousePos.y;
            
            const popupW = w * 0.28;
            const popupH = w * 0.18;
            let popupX = px + w * 0.05;
            let popupY = py - popupH / 2;
            
            if (popupX + popupW > w) popupX = px - popupW - w * 0.05;
            if (popupY < w * 0.02) popupY = w * 0.02;
            if (popupY + popupH > h - w * 0.02) popupY = h - popupH - w * 0.02;
            
            ctx.save();
            ctx.fillStyle = 'rgba(10, 15, 25, 0.98)';
            ctx.shadowBlur = 30;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.beginPath();
            ctx.roundRect(popupX, popupY, popupW, popupH, w * 0.02);
            ctx.fill();
            ctx.restore();
            
            ctx.strokeStyle = '#00eeff';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00eeff';
            ctx.beginPath();
            ctx.roundRect(popupX, popupY, popupW, popupH, w * 0.02);
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            ctx.fillStyle = '#00eeff';
            ctx.font = `bold ${w * 0.028}px monospace`;
            ctx.textAlign = 'left';
            ctx.fillText('RÉSUMÉ MENSUEL', popupX + w * 0.02, popupY + w * 0.025);
            
            const avgIntensity = weekData.reduce((sum, w) => sum + w.intensity, 0) / weekData.length;
            const totalSets = weekData.reduce((sum, w) => sum + w.sets, 0);
            const totalVolume = weekData.reduce((sum, w) => sum + w.volume, 0);
            
            let dominantZone = 'HYPERTROPHIE';
            if (avgIntensity >= 80) dominantZone = 'FORCE';
            else if (avgIntensity < 70) dominantZone = 'ENDURANCE';
            
            const lineHeight = w * 0.03;
            let lineY = popupY + w * 0.055;
            
            ctx.font = `${w * 0.022}px monospace`;
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`Volume total: ${(totalVolume / 1000).toFixed(1)}k`, popupX + w * 0.02, lineY);
            lineY += lineHeight;
            
            ctx.fillText(`Intensité moy: ${avgIntensity.toFixed(0)}%`, popupX + w * 0.02, lineY);
            lineY += lineHeight;
            
            ctx.fillText(`Total sets: ${totalSets}`, popupX + w * 0.02, lineY);
            lineY += lineHeight;
            
            ctx.fillStyle = '#00eeff';
            ctx.fillText(`Zone: ${dominantZone}`, popupX + w * 0.02, lineY);
            lineY += lineHeight;
            
            const progression = weekData[3].volume - weekData[0].volume;
            const progressionPercent = weekData[0].volume > 0 
                ? ((progression / weekData[0].volume) * 100).toFixed(0)
                : 0;
            const color = progression >= 0 ? '#00ff88' : '#ff5566';
            ctx.fillStyle = color;
            ctx.fillText(`Progression: ${progressionPercent >= 0 ? "+" : ""}${progressionPercent}%`, popupX + w * 0.02, lineY);
        }

        requestAnimationFrame(animate);
    }

    animate();
}
