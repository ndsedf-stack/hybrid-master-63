/**
 * ADVANCED CHARTS PREMIUM MODULE - Compatible ES5
 */

// 🌐 SUNBURST CHART
function renderSunburstChart(muscleData) {
    var canvas = document.getElementById('sunburst-chart');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    
    var muscles = muscleData || [
        { name: 'PECS', volume: 8500, primary: true },
        { name: 'DOS', volume: 9200, primary: true },
        { name: 'ÉPAULES', volume: 6800, primary: false },
        { name: 'BICEPS', volume: 4200, primary: false },
        { name: 'TRICEPS', volume: 4800, primary: false },
        { name: 'JAMBES', volume: 11500, primary: true }
    ];
    
    var totalVolume = 0;
    for (var i = 0; i < muscles.length; i++) {
        totalVolume += muscles[i].volume;
    }
    
    var colors = ['#00e5ff', '#00ff9f', '#9b59ff', '#ff6b35', '#ffd93d', '#ff006e'];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Glow central
    var glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 150);
    glow.addColorStop(0, 'rgba(0, 229, 255, 0.2)');
    glow.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Anneau externe
    var startAngle = -Math.PI / 2;
    for (var i = 0; i < muscles.length; i++) {
        if (!muscles[i].primary) continue;
        
        var angle = (muscles[i].volume / totalVolume) * Math.PI * 2;
        var gradient = ctx.createRadialGradient(centerX, centerY, 70, centerX, centerY, 120);
        gradient.addColorStop(0, colors[i] + '00');
        gradient.addColorStop(0.5, colors[i] + 'aa');
        gradient.addColorStop(1, colors[i]);
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = colors[i];
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 120, startAngle, startAngle + angle);
        ctx.arc(centerX, centerY, 70, startAngle + angle, startAngle, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        startAngle += angle;
    }
    
    ctx.shadowBlur = 0;
    
    // Centre
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px -apple-system';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((totalVolume / 1000).toFixed(1) + 'k', centerX, centerY - 5);
    
    ctx.font = '11px -apple-system';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText('VOLUME TOTAL', centerX, centerY + 15);
}

// 🏋️ GAUGE
function renderForceGauge(score) {
    var canvas = document.getElementById('force-gauge-chart');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2 + 20;
    var radius = 100;
    
    score = score || 185;
    var maxScore = 300;
    var percentage = score / maxScore;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fond
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25);
    ctx.stroke();
    
    // Jauge
    var gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
    gradient.addColorStop(0, '#ff006e');
    gradient.addColorStop(0.33, '#ff6b35');
    gradient.addColorStop(0.66, '#00ff9f');
    gradient.addColorStop(1, '#00e5ff');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 22;
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#00e5ff';
    
    var endAngle = Math.PI * 0.75 + (Math.PI * 1.5 * percentage);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, endAngle);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    // Aiguille
    var needleAngle = Math.PI * 0.75 + (Math.PI * 1.5 * percentage);
    var needleLength = radius - 15;
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#fff';
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(needleAngle) * needleLength,
        centerY + Math.sin(needleAngle) * needleLength
    );
    ctx.stroke();
    
    // Centre
    var centerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 12);
    centerGlow.addColorStop(0, '#fff');
    centerGlow.addColorStop(0.5, '#00e5ff');
    centerGlow.addColorStop(1, '#00e5ff00');
    
    ctx.fillStyle = centerGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    // Texte
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px -apple-system';
    ctx.textAlign = 'center';
    ctx.fillText(score, centerX, centerY + 5);
    
    ctx.font = '12px -apple-system';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText('POINTS', centerX, centerY + 25);
}

// 🔋 BATTERY
function renderBatteryChart(recoveryData) {
    var canvas = document.getElementById('recovery-battery-chart');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    
    var muscles = recoveryData || [
        { name: 'PECS', recovery: 85 },
        { name: 'DOS', recovery: 60 }
    ];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var barHeight = 35;
    var barSpacing = 45;
    var startY = 20;
    var barWidth = 200;
    var startX = 120;
    
    for (var i = 0; i < muscles.length; i++) {
        var muscle = muscles[i];
        var y = startY + i * barSpacing;
        var recovery = muscle.recovery;
        
        // Label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px -apple-system';
        ctx.textAlign = 'right';
        ctx.fillText(muscle.name, startX - 15, y + barHeight / 2 + 4);
        
        // Fond
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(startX, y, barWidth, barHeight);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, y, barWidth, barHeight);
        
        // Couleur
        var color = recovery >= 80 ? '#00ff9f' : (recovery >= 50 ? '#ffd93d' : '#ff006e');
        
        var fillWidth = (barWidth * recovery) / 100;
        
        ctx.fillStyle = color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.fillRect(startX + 2, y + 2, fillWidth - 4, barHeight - 4);
        
        ctx.shadowBlur = 0;
        
        // %
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px -apple-system';
        ctx.textAlign = 'left';
        ctx.fillText(recovery + '%', startX + barWidth + 15, y + barHeight / 2 + 4);
    }
}

// 📈 STACKED AREA
function renderStackedAreaChart(weekData) {
    var canvas = document.getElementById('stacked-area-chart');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px -apple-system';
    ctx.textAlign = 'center';
    ctx.fillText('Graphique en cours...', canvas.width / 2, canvas.height / 2);
}

window.renderSunburstChart = renderSunburstChart;
window.renderForceGauge = renderForceGauge;
window.renderBatteryChart = renderBatteryChart;
window.renderStackedAreaChart = renderStackedAreaChart;

console.log('✅ Advanced Charts Premium module loaded');

// 🌀 SPIRAL PROGRESS - Progression Globale
function renderSpiralProgress(progressData) {
    var canvas = document.getElementById('spiral-progress-chart');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var progress = progressData || 0.6;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px -apple-system';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('3/5', centerX, centerY - 15);
    
    ctx.font = '14px -apple-system';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText('SÉANCES', centerX, centerY + 20);
}

window.renderSpiralProgress = renderSpiralProgress;
console.log('✅ Spiral Progress added');

// 🌀 SPIRAL PROGRESS - Progression Globale
function renderSpiralProgress(progressData) {
    var canvas = document.getElementById('spiral-progress-chart');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var progress = progressData || 0.6;
    var spirals = 3;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Glow central
    var centralGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 120);
    centralGlow.addColorStop(0, 'rgba(0, 229, 255, 0.3)');
    centralGlow.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = centralGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Spirales de fond
    for (var i = 0; i < spirals; i++) {
        var startRadius = 40 + i * 25;
        var endRadius = startRadius + 20;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        for (var angle = 0; angle <= Math.PI * 4; angle += 0.1) {
            var radius = startRadius + (endRadius - startRadius) * (angle / (Math.PI * 4));
            var x = centerX + Math.cos(angle) * radius;
            var y = centerY + Math.sin(angle) * radius;
            if (angle === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    
    // Spirale de progression
    var progressAngle = Math.PI * 4 * progress;
    
    for (var i = 0; i < spirals; i++) {
        var startRadius = 40 + i * 25;
        var endRadius = startRadius + 20;
        
        ctx.lineWidth = 14;
        ctx.shadowBlur = 25;
        ctx.shadowColor = i === spirals - 1 ? '#00e5ff' : '#ff006e';
        
        ctx.beginPath();
        for (var angle = 0; angle <= progressAngle; angle += 0.05) {
            var radius = startRadius + (endRadius - startRadius) * (angle / (Math.PI * 4));
            var x = centerX + Math.cos(angle) * radius;
            var y = centerY + Math.sin(angle) * radius;
            
            var t = angle / progressAngle;
            var gradient = ctx.createLinearGradient(
                centerX - radius, centerY - radius,
                centerX + radius, centerY + radius
            );
            gradient.addColorStop(0, 'rgba(0, 229, 255, ' + (0.8 - t * 0.3) + ')');
            gradient.addColorStop(0.5, 'rgba(155, 89, 255, 0.9)');
            gradient.addColorStop(1, 'rgba(255, 0, 110, ' + (0.8 + t * 0.2) + ')');
            
            ctx.strokeStyle = gradient;
            
            if (angle === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
    
    // Points lumineux
    for (var i = 0; i < 8; i++) {
        var angle = (progressAngle * i) / 7;
        var spiralIndex = Math.floor(i / 3);
        var startRadius = 40 + spiralIndex * 25;
        var endRadius = startRadius + 20;
        var radius = startRadius + (endRadius - startRadius) * (angle / (Math.PI * 4));
        
        var x = centerX + Math.cos(angle) * radius;
        var y = centerY + Math.sin(angle) * radius;
        
        var dotGlow = ctx.createRadialGradient(x, y, 0, x, y, 8);
        dotGlow.addColorStop(0, 'rgba(0, 229, 255, 1)');
        dotGlow.addColorStop(0.5, 'rgba(0, 229, 255, 0.5)');
        dotGlow.addColorStop(1, 'rgba(0, 229, 255, 0)');
        
        ctx.fillStyle = dotGlow;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Texte central
    var completed = Math.round(progress * 5);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px -apple-system';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(completed + '/5', centerX, centerY - 15);
    
    ctx.font = '14px -apple-system';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText('SÉANCES', centerX, centerY + 20);
    
    ctx.font = '12px -apple-system';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(Math.round(progress * 100) + '% COMPLÉTÉ', centerX, centerY + 40);
}

// 🎯 POLAR AREA - Volume par Muscle
function renderPolarArea(muscleData) {
    var canvas = document.getElementById('polar-area-chart');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    
    var muscles = muscleData || [
        { name: 'PECS', volume: 8500, color: '#00e5ff' },
        { name: 'DOS', volume: 9200, color: '#00ff9f' },
        { name: 'ÉPAULES', volume: 6800, color: '#9b59ff' },
        { name: 'BICEPS', volume: 4200, color: '#ff6b35' },
        { name: 'TRICEPS', volume: 4800, color: '#ffd93d' },
        { name: 'JAMBES', volume: 11500, color: '#ff006e' }
    ];
    
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var maxRadius = 140;
    var maxVolume = 0;
    
    for (var i = 0; i < muscles.length; i++) {
        if (muscles[i].volume > maxVolume) maxVolume = muscles[i].volume;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grilles circulaires
    for (var i = 1; i <= 4; i++) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, (maxRadius * i) / 4, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Axes radiaux
    var angleStep = (Math.PI * 2) / muscles.length;
    
    for (var i = 0; i < muscles.length; i++) {
        var angle = i * angleStep - Math.PI / 2;
        var x = centerX + Math.cos(angle) * maxRadius;
        var y = centerY + Math.sin(angle) * maxRadius;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    
    // Segments polaires
    for (var i = 0; i < muscles.length; i++) {
        var muscle = muscles[i];
        var angle = i * angleStep - Math.PI / 2;
        var nextAngle = angle + angleStep;
        var radius = (muscle.volume / maxVolume) * maxRadius;
        
        var gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, muscle.color + '00');
        gradient.addColorStop(0.7, muscle.color + 'aa');
        gradient.addColorStop(1, muscle.color + 'ff');
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = muscle.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = muscle.color;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, nextAngle);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Point lumineux
        var pointX = centerX + Math.cos(angle + angleStep / 2) * radius;
        var pointY = centerY + Math.sin(angle + angleStep / 2) * radius;
        
        var dotGlow = ctx.createRadialGradient(pointX, pointY, 0, pointX, pointY, 10);
        dotGlow.addColorStop(0, muscle.color);
        dotGlow.addColorStop(0.5, muscle.color + '88');
        dotGlow.addColorStop(1, muscle.color + '00');
        
        ctx.fillStyle = dotGlow;
        ctx.beginPath();
        ctx.arc(pointX, pointY, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = muscle.color;
        ctx.beginPath();
        ctx.arc(pointX, pointY, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.shadowBlur = 0;
    
    // Labels
    for (var i = 0; i < muscles.length; i++) {
        var muscle = muscles[i];
        var angle = i * angleStep - Math.PI / 2;
        var labelRadius = maxRadius + 35;
        var x = centerX + Math.cos(angle) * labelRadius;
        var y = centerY + Math.sin(angle) * labelRadius;
        
        ctx.fillStyle = muscle.color;
        ctx.font = 'bold 11px -apple-system';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(muscle.name, x, y);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px -apple-system';
        ctx.fillText((muscle.volume / 1000).toFixed(1) + 'k', x, y + 14);
    }
    
    // Centre glow
    var centerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60);
    centerGlow.addColorStop(0, 'rgba(0, 229, 255, 0.2)');
    centerGlow.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = centerGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
    ctx.fill();
}

// 💥 BURST ANIMATION - Records/PR
var burstAnimationFrame = null;

function renderBurstAnimation() {
    var canvas = document.getElementById('burst-animation-chart');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var time = Date.now() / 1000;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Cercles d'onde
    for (var i = 0; i < 3; i++) {
        var radius = 60 + (time * 50 + i * 40) % 150;
        var opacity = 1 - ((time * 50 + i * 40) % 150) / 150;
        
        ctx.strokeStyle = 'rgba(0, 229, 255, ' + (opacity * 0.6) + ')';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Rayons explosifs
    for (var i = 0; i < 16; i++) {
        var angle = (i / 16) * Math.PI * 2 + time;
        var length = 80 + Math.sin(time * 3 + i) * 20;
        var startRadius = 50;
        
        var colors = ['#00e5ff', '#9b59ff', '#ff006e', '#00ff9f'];
        var color = colors[i % colors.length];
        
        var gradient = ctx.createLinearGradient(
            centerX + Math.cos(angle) * startRadius,
            centerY + Math.sin(angle) * startRadius,
            centerX + Math.cos(angle) * (startRadius + length),
            centerY + Math.sin(angle) * (startRadius + length)
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '00');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        
        ctx.beginPath();
        ctx.moveTo(
            centerX + Math.cos(angle) * startRadius,
            centerY + Math.sin(angle) * startRadius
        );
        ctx.lineTo(
            centerX + Math.cos(angle) * (startRadius + length),
            centerY + Math.sin(angle) * (startRadius + length)
        );
        ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
    
    // Cercle central pulsant
    var pulseRadius = 45 + Math.sin(time * 3) * 5;
    
    var centralGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius * 2);
    centralGlow.addColorStop(0, 'rgba(0, 229, 255, 0.4)');
    centralGlow.addColorStop(0.5, 'rgba(155, 89, 255, 0.2)');
    centralGlow.addColorStop(1, 'rgba(155, 89, 255, 0)');
    
    ctx.fillStyle = centralGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    var gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
    gradient.addColorStop(0, '#9b59ff');
    gradient.addColorStop(0.7, '#00e5ff');
    gradient.addColorStop(1, '#ff006e');
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#00e5ff';
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    // Texte PR
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px -apple-system';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#000';
    ctx.fillText('PR!', centerX, centerY - 8);
    
    ctx.font = '12px -apple-system';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText('NOUVEAU RECORD', centerX, centerY + 15);
    
    ctx.shadowBlur = 0;
    
    burstAnimationFrame = requestAnimationFrame(renderBurstAnimation);
}

window.renderSpiralProgress = renderSpiralProgress;
window.renderPolarArea = renderPolarArea;
window.renderBurstAnimation = renderBurstAnimation;

console.log('✅ Advanced Charts Premium - Extended loaded');


// 🌀 SPIRAL GLOBAL - VERSION PREMIUM PRO

// 🌀 SPIRAL GLOBAL - COCKPIT ULTRA-LISIBLE

// 🌀 SPIRAL COCKPIT - VERSION FINALE PRO

// 🌀 SPIRAL FINAL - GRANDE TAILLE PROPRE

// 🌀 SPIRAL GLOBAL - MÊME LOGIQUE QU'ORBIT RINGS
function renderSpiralGlobal(progressData){
var canvas=document.getElementById('spiralGlobalCanvas');if(!canvas)return;
var ctx=canvas.getContext('2d');
var targetProgress=progressData||0.6;
var currentProgress=0;
var score=Math.round(targetProgress*100);
var startTime=Date.now();
function resizeCanvas(){
var container=canvas.parentElement;
var size=Math.min(container.clientWidth,600);
var dpr=window.devicePixelRatio||1;
canvas.width=size*dpr;
canvas.height=size*dpr;
canvas.style.width=size+'px';
canvas.style.height=size+'px';
ctx.scale(dpr,dpr);
}
resizeCanvas();
window.addEventListener('resize',resizeCanvas);
function animate(){
var elapsed=Date.now()-startTime;
var introProgress=Math.min(elapsed/1800,1);
currentProgress=targetProgress*introProgress;
var time=Date.now()*0.001;
var pulse=Math.sin(time*0.8)*0.5+0.5;
var w=canvas.style.width.replace('px','')*1;
var h=w;
var cx=w/2;
var cy=h/2;
ctx.clearRect(0,0,w,h);
var glow=ctx.createRadialGradient(cx,cy,0,cx,cy,w*0.4);
glow.addColorStop(0,'rgba(0,229,255,'+(0.2+pulse*0.1)+')');
glow.addColorStop(1,'rgba(0,229,255,0)');
ctx.fillStyle=glow;
ctx.fillRect(0,0,w,h);
var progressAngle=Math.PI*4*currentProgress;
for(var i=0;i<2;i++){
var r0=w*0.18+i*w*0.11;
var r1=r0+w*0.09;
ctx.strokeStyle='rgba(255,255,255,0.04)';
ctx.lineWidth=w*0.07;
ctx.lineCap='round';
ctx.beginPath();
for(var a=0;a<=Math.PI*4;a+=0.1){
var r=r0+(r1-r0)*(a/(Math.PI*4));
ctx.arc(cx,cy,r,a,a+0.1);
}
ctx.stroke();
ctx.lineWidth=w*0.075;
ctx.shadowBlur=w*0.04;
var color=i===0?'rgba(0,229,255,0.7)':'rgba(155,89,255,0.8)';
ctx.strokeStyle=color;
ctx.shadowColor=color;
ctx.beginPath();
for(var a=0;a<=progressAngle;a+=0.05){
var r=r0+(r1-r0)*(a/(Math.PI*4));
ctx.arc(cx,cy,r,a,a+0.05);
}
ctx.stroke();
}
ctx.shadowBlur=0;
for(var i=0;i<5;i++){
if(currentProgress>(i/5)){
var a=(progressAngle*i)/4;
var r=w*0.21+(a/(Math.PI*4))*w*0.18;
var x=cx+Math.cos(a)*r;
var y=cy+Math.sin(a)*r;
ctx.fillStyle='rgba(0,229,255,0.9)';
ctx.beginPath();
ctx.arc(x,y,w*0.018,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#fff';
ctx.beginPath();
ctx.arc(x,y,w*0.008,0,Math.PI*2);
ctx.fill();
if(introProgress>0.9){
ctx.fillStyle='#00e5ff';
ctx.font='bold '+(w*0.028)+'px "Rajdhani",sans-serif';
ctx.textAlign='center';
ctx.fillText((i+1)*2+' sets',x,y-w*0.035);
}
}
}
if(currentProgress>=0.6&&introProgress>0.95){
ctx.fillStyle='rgba(0,0,0,0.9)';
ctx.fillRect(cx-w*0.13,cy-w*0.23,w*0.26,w*0.065);
ctx.strokeStyle='#00ff88';
ctx.lineWidth=2;
ctx.strokeRect(cx-w*0.13,cy-w*0.23,w*0.26,w*0.065);
ctx.fillStyle='#00ff88';
ctx.font='bold '+(w*0.034)+'px "Rajdhani",sans-serif';
ctx.textAlign='center';
ctx.shadowBlur=w*0.023;
ctx.shadowColor='#00ff88';
ctx.fillText('✅ CONSISTENT',cx,cy-w*0.188);
ctx.shadowBlur=0;
}
var completed=Math.round(currentProgress*5);
ctx.save();
ctx.translate(cx,cy);
ctx.scale(1+pulse*0.03,1+pulse*0.03);
ctx.translate(-cx,-cy);
var scoreColor=score>=80?'#00ff88':score>=60?'#ffbb33':'#ff5566';
ctx.fillStyle='#ffffff';
ctx.font='bold '+(w*0.28)+'px "Rajdhani",sans-serif';
ctx.textAlign='center';
ctx.textBaseline='middle';
ctx.shadowBlur=w*0.031;
ctx.shadowColor=scoreColor;
ctx.fillText(score,cx,cy-w*0.031);
ctx.shadowBlur=0;
ctx.font=(w*0.062)+'px "Rajdhani",sans-serif';
ctx.fillStyle='rgba(255,255,255,0.8)';
ctx.fillText('/100',cx,cy+w*0.077);
ctx.font='bold '+(w*0.043)+'px "Rajdhani",sans-serif';
ctx.fillStyle='#00e5ff';
ctx.fillText(completed+'/5 SÉANCES',cx,cy+w*0.138);
ctx.font=(w*0.031)+'px "Rajdhani",sans-serif';
ctx.fillStyle='rgba(255,255,255,0.5)';
ctx.fillText(Math.round(currentProgress*100)+'% COMPLÉTÉ',cx,cy+w*0.185);
ctx.restore();
requestAnimationFrame(animate);
}
animate();
}
window.renderSpiralGlobal=renderSpiralGlobal;

// 🌀 NEON TRACKER 3D - ANNEAUX CIRCULAIRES
function createCircularRing(container,config){
var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
svg.setAttribute('width',500);
svg.setAttribute('height',500);
svg.style.position='absolute';
svg.style.inset='0';
svg.style.transform='rotate(-90deg)';
svg.style.zIndex=config.zIndex||10;
svg.style.pointerEvents='none';
if(config.rotate){
svg.style.animation=config.counterClockwise?'spin-reverse-slow 30s linear infinite':'spin-slow 40s linear infinite';
}
var defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
var gradient=document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
gradient.id='grad-'+Math.random().toString(36).substr(2,9);
var stop1=document.createElementNS('http://www.w3.org/2000/svg','stop');
stop1.setAttribute('offset','0%');
stop1.setAttribute('stop-color',config.colorStart);
var stop2=document.createElementNS('http://www.w3.org/2000/svg','stop');
stop2.setAttribute('offset','100%');
stop2.setAttribute('stop-color',config.colorEnd);
gradient.appendChild(stop1);
gradient.appendChild(stop2);
if(config.glow){
var filter=document.createElementNS('http://www.w3.org/2000/svg','filter');
filter.id='glow-'+Math.random().toString(36).substr(2,9);
filter.setAttribute('x','-50%');
filter.setAttribute('y','-50%');
filter.setAttribute('width','200%');
filter.setAttribute('height','200%');
var blur=document.createElementNS('http://www.w3.org/2000/svg','feGaussianBlur');
blur.setAttribute('stdDeviation','6');
blur.setAttribute('result','coloredBlur');
var merge=document.createElementNS('http://www.w3.org/2000/svg','feMerge');
var node1=document.createElementNS('http://www.w3.org/2000/svg','feMergeNode');
node1.setAttribute('in','coloredBlur');
var node2=document.createElementNS('http://www.w3.org/2000/svg','feMergeNode');
node2.setAttribute('in','SourceGraphic');
merge.appendChild(node1);
merge.appendChild(node2);
filter.appendChild(blur);
filter.appendChild(merge);
defs.appendChild(filter);
}
defs.appendChild(gradient);
svg.appendChild(defs);
var r=config.radius-config.strokeWidth/2;
var circ=2*Math.PI*r;
var visibleCirc=circ*((360-(config.cut||0))/360);
var cutLength=circ-visibleCirc;
var dashArray=config.variant==='dashed'||config.variant==='dots'?'5 3':(visibleCirc+' '+cutLength);
var track=document.createElementNS('http://www.w3.org/2000/svg','circle');
track.setAttribute('cx',250);
track.setAttribute('cy',250);
track.setAttribute('r',r);
track.setAttribute('stroke',config.trackColor||'rgba(255,255,255,0.05)');
track.setAttribute('stroke-width',config.strokeWidth);
track.setAttribute('fill','none');
track.setAttribute('stroke-linecap','round');
track.setAttribute('stroke-dasharray',dashArray);
svg.appendChild(track);
var progress=document.createElementNS('http://www.w3.org/2000/svg','circle');
progress.setAttribute('cx',250);
progress.setAttribute('cy',250);
progress.setAttribute('r',r);
progress.setAttribute('stroke','url(#'+gradient.id+')');
progress.setAttribute('stroke-width',config.strokeWidth);
progress.setAttribute('fill','none');
progress.setAttribute('stroke-linecap','round');
progress.setAttribute('stroke-dasharray',dashArray);
progress.setAttribute('stroke-dashoffset',visibleCirc);
if(config.glow){
progress.style.filter='url(#'+filter.id+')';
}
progress.style.transition='stroke-dashoffset 1.5s cubic-bezier(0.2,0.8,0.2,1)';
svg.appendChild(progress);
container.appendChild(svg);
return{
update:function(percent){
var strokeLength=(percent/100)*visibleCirc;
var offset=visibleCirc-strokeLength;
progress.setAttribute('stroke-dashoffset',offset);
}
};
}

function initNeonTracker3D(data){
var score=data.score||60;
var sessions=data.sessions||{current:3,max:5};
var sets=data.sets||{current:164,max:60};
var isOptimal=score>=80;

document.getElementById('scoreValue').textContent=Math.round(score);
if(isOptimal){
document.getElementById('scoreValue').style.color='#fbbf24';
document.getElementById('scoreValue').style.filter='drop-shadow(0 0 12px rgba(251,191,36,0.8))';
document.getElementById('statusBadge').style.color='#fbbf24';
document.getElementById('statusBadge').style.borderColor='rgba(251,191,36,0.5)';
document.getElementById('statusBadge').textContent='OPTIMIZED';
document.getElementById('glassLens').style.boxShadow='0 0 25px rgba(251,191,36,0.2),inset 0 0 15px rgba(0,0,0,1)';
document.getElementById('globalGlow').style.background='rgba(251,191,36,0.25)';
}

document.getElementById('sessionsValue').textContent=sessions.current;
document.getElementById('sessionsMax').textContent=sessions.max;
document.getElementById('setsValue').textContent=sets.current;
document.getElementById('setsMax').textContent=sets.max;

var container=document.getElementById('ringsContainer');
if(!container){console.error('❌ Container introuvable');return;}
container.innerHTML='';

var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
svg.setAttribute('width','380');
svg.setAttribute('height','380');
svg.setAttribute('viewBox','0 0 380 380');
svg.style.position='absolute';
svg.style.inset='0';

// CERCLE 1 COMPLET (fond bleu)
var c1bg=document.createElementNS('http://www.w3.org/2000/svg','circle');
c1bg.setAttribute('cx','190');c1bg.setAttribute('cy','190');c1bg.setAttribute('r','150');
c1bg.setAttribute('fill','none');c1bg.setAttribute('stroke','rgba(59,130,246,0.15)');
c1bg.setAttribute('stroke-width','14');
svg.appendChild(c1bg);

// CERCLE 1 PROGRESSION (bleu)
var c1=document.createElementNS('http://www.w3.org/2000/svg','circle');
c1.setAttribute('cx','190');c1.setAttribute('cy','190');c1.setAttribute('r','150');
c1.setAttribute('fill','none');c1.setAttribute('stroke','#3b82f6');
c1.setAttribute('stroke-width','14');c1.setAttribute('stroke-linecap','round');
var circ1=2*Math.PI*150;
c1.setAttribute('stroke-dasharray',circ1);
c1.setAttribute('stroke-dashoffset',circ1);
c1.setAttribute('transform','rotate(-90 190 190)');
c1.style.transition='stroke-dashoffset 1.5s ease';
svg.appendChild(c1);

// CERCLE 2 COMPLET (fond rose)
var c2bg=document.createElementNS('http://www.w3.org/2000/svg','circle');
c2bg.setAttribute('cx','190');c2bg.setAttribute('cy','190');c2bg.setAttribute('r','115');
c2bg.setAttribute('fill','none');c2bg.setAttribute('stroke','rgba(236,72,153,0.15)');
c2bg.setAttribute('stroke-width','12');
svg.appendChild(c2bg);

// CERCLE 2 PROGRESSION (rose)
var c2=document.createElementNS('http://www.w3.org/2000/svg','circle');
c2.setAttribute('cx','190');c2.setAttribute('cy','190');c2.setAttribute('r','115');
c2.setAttribute('fill','none');c2.setAttribute('stroke','#ec4899');
c2.setAttribute('stroke-width','12');c2.setAttribute('stroke-linecap','round');
var circ2=2*Math.PI*115;
c2.setAttribute('stroke-dasharray',circ2);
c2.setAttribute('stroke-dashoffset',circ2);
c2.setAttribute('transform','rotate(-90 190 190)');
c2.style.transition='stroke-dashoffset 1.5s ease';
svg.appendChild(c2);

// CERCLE 3 COMPLET (fond cyan/jaune)
var c3bg=document.createElementNS('http://www.w3.org/2000/svg','circle');
c3bg.setAttribute('cx','190');c3bg.setAttribute('cy','190');c3bg.setAttribute('r','80');
c3bg.setAttribute('fill','none');c3bg.setAttribute('stroke','rgba(255,255,255,0.1)');
c3bg.setAttribute('stroke-width','10');
svg.appendChild(c3bg);

// CERCLE 3 PROGRESSION (cyan ou jaune selon score)
var c3=document.createElementNS('http://www.w3.org/2000/svg','circle');
c3.setAttribute('cx','190');c3.setAttribute('cy','190');c3.setAttribute('r','80');
c3.setAttribute('fill','none');c3.setAttribute('stroke',isOptimal?'#fbbf24':'#22d3ee');
c3.setAttribute('stroke-width','10');c3.setAttribute('stroke-linecap','round');
var circ3=2*Math.PI*80;
c3.setAttribute('stroke-dasharray',circ3);
c3.setAttribute('stroke-dashoffset',circ3);
c3.setAttribute('transform','rotate(-90 190 190)');
c3.style.transition='stroke-dashoffset 1.5s ease';
svg.appendChild(c3);

container.appendChild(svg);

setTimeout(function(){c1.setAttribute('stroke-dashoffset',circ1-(circ1*(sessions.current/sessions.max)));},100);
setTimeout(function(){c2.setAttribute('stroke-dashoffset',circ2-(circ2*(sets.current/sets.max)));},200);
setTimeout(function(){c3.setAttribute('stroke-dashoffset',circ3-(circ3*(score/100)));},300);

console.log('✅ 3 cercles complets créés');
}
window.initNeonTracker3D=initNeonTracker3D;
