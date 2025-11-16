export class TrapBarRenderer {
  constructor(containerId) {
    this.containerId = containerId || 'app';
    this.container = null;
    this.timerInterval = null;
    this.currentTime = 0;
    this.data = {
      exercise: 'Trap Bar Deadlift',
      category: 'COMPOUND · DOS / JAMBES',
      weight: 100,
      series: '5x5',
      tempo: '3-1-2',
      rest: 120,
      sets: [
        { weight: 100, reps: 5, completed: true },
        { weight: 100, reps: 5, completed: true },
        { weight: 100, reps: 5, completed: true },
        { weight: 100, reps: 5, completed: false },
        { weight: 100, reps: 5, completed: false }
      ],
      totalVolume: 1500,
      targetVolume: 2500
    };
  }
  
  init(customData) { 
    if (customData) {
      this.data = Object.assign({}, this.data, customData);
    }
    return this; 
  }
  
  render() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) return;
    
    this.container.innerHTML = this._buildHTML();
    this._createConcentratedParticles();
    this._attachEvents();
  }
  
  _buildHTML() {
    return '<div class="trapbar-screen">' + 
           this._renderParticles() +
           this._renderBackButton() + 
           this._renderHeader() + 
           this._renderMetrics() + 
           this._renderCircles() + 
           this._renderSeriesCircles() +
           this._renderFooter() + 
           '</div>';
  }
  
  _renderParticles() {
    return '<div class="trapbar-particles" id="trapbar-particles"></div>';
  }
  
  _renderBackButton() { 
    return '<div class="trapbar-back-btn" data-action="back"></div>'; 
  }
  
  _renderHeader() {
    var parts = this.data.exercise.split(' ');
    var firstWords = parts.slice(0, 2).join(' ') || 'Trap Bar';
    var lastWord = parts[2] || 'Deadlift';
    
    return '<div class="trapbar-header">' +
           '<div class="trapbar-trophy"></div>' +
           '<div class="trapbar-title-wrapper">' +
           '<h1>' +
           '<span class="trapbar-title-white">' + firstWords + '</span> ' +
           '<span class="trapbar-title-cyan">' + lastWord + '</span>' +
           '</h1>' +
           '<div class="trapbar-subtitle">' + this.data.category + '</div>' +
           '</div>' +
           '</div>';
  }
  
  _renderMetrics() {
    return '<div class="trapbar-metrics">' +
           '<div class="trapbar-metric-card">' +
           '<div class="trapbar-metric-icon">' + this._getWeightIcon() + '</div>' +
           '<div class="trapbar-metric-value orange">' + this.data.weight + 'kg</div>' +
           '<div class="trapbar-metric-label">POIDS</div>' +
           '</div>' +
           '<div class="trapbar-metric-card">' +
           '<div class="trapbar-metric-icon">' + this._getSeriesIcon() + '</div>' +
           '<div class="trapbar-metric-value cyan">' + this.data.series + '</div>' +
           '<div class="trapbar-metric-label">SERIES</div>' +
           '</div>' +
           '<div class="trapbar-metric-card">' +
           '<div class="trapbar-metric-icon">' + this._getTempoIcon() + '</div>' +
           '<div class="trapbar-metric-value green">' + this.data.tempo + '</div>' +
           '<div class="trapbar-metric-label">TEMPO</div>' +
           '</div>' +
           '<div class="trapbar-metric-card">' +
           '<div class="trapbar-metric-icon">' + this._getRestIcon() + '</div>' +
           '<div class="trapbar-metric-value violet">' + this.data.rest + 's</div>' +
           '<div class="trapbar-metric-label">REPOS</div>' +
           '</div>' +
           '</div>';
  }
  
  _getWeightIcon() {
    return '<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">' +
           '<rect x="6" y="30" width="9" height="12" rx="1.5" fill="url(#weightGrad)" />' +
           '<rect x="57" y="30" width="9" height="12" rx="1.5" fill="url(#weightGrad)" />' +
           '<rect x="15" y="33" width="42" height="6" rx="3" fill="url(#weightGrad)" />' +
           '<defs>' +
           '<linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">' +
           '<stop offset="0%" stop-color="#c0c0c0"/>' +
           '<stop offset="100%" stop-color="#707070"/>' +
           '</linearGradient>' +
           '</defs>' +
           '</svg>';
  }
  
  _getSeriesIcon() {
    return '<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">' +
           '<rect x="18" y="21" width="36" height="9" rx="4.5" fill="#00D9FF" opacity="0.4"/>' +
           '<rect x="21" y="30" width="30" height="9" rx="4.5" fill="#00D9FF" opacity="0.7"/>' +
           '<rect x="24" y="39" width="24" height="9" rx="4.5" fill="#00D9FF"/>' +
           '</svg>';
  }
  
  _getTempoIcon() {
    return '<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">' +
           '<path d="M36 12L42 30L36 48L30 30L36 12Z" fill="url(#lightningGrad)"/>' +
           '<defs>' +
           '<linearGradient id="lightningGrad" x1="36" y1="12" x2="36" y2="48">' +
           '<stop offset="0%" stop-color="#FFD700"/>' +
           '<stop offset="100%" stop-color="#35FF8B"/>' +
           '</linearGradient>' +
           '</defs>' +
           '</svg>';
  }
  
  _getRestIcon() {
    return '<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">' +
           '<circle cx="36" cy="36" r="18" fill="url(#restGrad)"/>' +
           '<defs>' +
           '<radialGradient id="restGrad">' +
           '<stop offset="0%" stop-color="#ffffff"/>' +
           '<stop offset="100%" stop-color="#b0b0b0"/>' +
           '</radialGradient>' +
           '</defs>' +
           '</svg>';
  }
  
  _renderCircles() {
    var currentSet = this.data.sets.find(function(s) { return !s.completed; }) || this.data.sets[0];
    
    return '<div class="trapbar-circles-container">' +
           this._renderCircleWrapper('green', '<div class="trapbar-circle-check">&#10003;</div>') +
           this._renderCircleWrapper('orange', 
             '<div class="trapbar-circle-weight">' + currentSet.weight + '</div>' +
             '<div class="trapbar-circle-unit">kg</div>'
           ) +
           this._renderCircleWrapper('blue', 
             '<div class="trapbar-circle-reps">' + currentSet.reps + '</div>' +
             '<div class="trapbar-circle-reps-label">reps</div>'
           ) +
           '</div>';
  }
  
  _renderCircleWrapper(colorClass, innerContent) {
    var gradientId = 'grad-' + colorClass + '-' + Math.random().toString(36).substr(2, 9);
    var colors = {
      green: ['#00d4ff', '#35FF8B', '#9D4EDD', '#00d4ff'],
      orange: ['#FF6D00', '#FFB347', '#35FF8B', '#FF6D00'],
      blue: ['#00D9FF', '#7c3aed', '#00D9FF']
    };
    
    var stops = colors[colorClass];
    var gradientStops = '';
    
    if (stops.length === 3) {
      gradientStops = '<stop offset="0%" stop-color="' + stops[0] + '"/>' +
                     '<stop offset="50%" stop-color="' + stops[1] + '"/>' +
                     '<stop offset="100%" stop-color="' + stops[2] + '"/>';
    } else {
      gradientStops = '<stop offset="0%" stop-color="' + stops[0] + '"/>' +
                     '<stop offset="33%" stop-color="' + stops[1] + '"/>' +
                     '<stop offset="66%" stop-color="' + stops[2] + '"/>' +
                     '<stop offset="100%" stop-color="' + stops[3] + '"/>';
    }
    
    return '<div class="trapbar-circle-wrapper ' + colorClass + '">' +
           '<svg class="trapbar-circle-svg" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">' +
           '<defs>' +
           '<linearGradient id="' + gradientId + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
           gradientStops +
           '</linearGradient>' +
           '</defs>' +
           '<circle cx="110" cy="110" r="104" stroke="url(#' + gradientId + ')" stroke-width="6" fill="none"/>' +
           '</svg>' +
           '<div class="trapbar-circle-inner">' +
           innerContent +
           '</div>' +
           '</div>';
  }
  
  _renderSeriesCircles() {
    var html = '<div class="trapbar-series-circles">';
    var firstUncompleted = this.data.sets.findIndex(function(s) { return !s.completed; });
    
    for (var i = 0; i < this.data.sets.length; i++) {
      var set = this.data.sets[i];
      var circleClass = '';
      
      if (set.completed) {
        circleClass = 'completed';
      } else if (i === firstUncompleted) {
        circleClass = 'active';
      } else if (i === firstUncompleted + 1) {
        circleClass = 'rest';
      } else {
        circleClass = 'upcoming';
      }
      
      html += '<div class="trapbar-serie-circle ' + circleClass + '" data-action="toggle" data-index="' + i + '" style="position: relative;">' +
              '<div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); font-size: 11px; color: yellow; background: black; padding: 3px 8px; border-radius: 4px; font-weight: bold; white-space: nowrap;">' + circleClass + '</div>' +
              '<div class="trapbar-serie-circle-num">' + set.reps + '</div>' +
              '</div>';
    }
    
    html += '</div>';
    return html;
  }
  
  _renderFooter() {
    var minutes = Math.floor(this.currentTime / 60);
    var seconds = this.currentTime % 60;
    var timeStr = minutes + ':' + String(seconds).padStart(2, '0');
    
    return '<div class="trapbar-footer">' +
           '<div>' +
           '<div class="trapbar-footer-label">CHRONO</div>' +
           '<div class="trapbar-timer" id="trapbar-timer">' + timeStr + '</div>' +
           '</div>' +
           '<div class="trapbar-volume">' + this.data.totalVolume.toLocaleString() + '/' + this.data.targetVolume.toLocaleString() + ' KG</div>' +
           '</div>';
  }
  
  _createConcentratedParticles() {
    var container = document.getElementById('trapbar-particles');
    if (!container) return;
    
    var circlePositions = [
      { x: 25, y: 42 },
      { x: 50, y: 42 },
      { x: 75, y: 42 }
    ];
    
    var particleCount = 120;
    
    for (var i = 0; i < particleCount; i++) {
      var particle = document.createElement('div');
      particle.className = 'particle';
      
      var distribution = Math.random();
      var targetCircle = circlePositions[Math.floor(Math.random() * 3)];
      var distance;
      
      if (distribution < 0.65) {
        distance = Math.random() * 280;
      } else if (distribution < 0.88) {
        distance = 280 + Math.random() * 220;
      } else {
        distance = 500 + Math.random() * 350;
      }
      
      var angle = Math.random() * Math.PI * 2;
      var offsetX = Math.cos(angle) * distance;
      var offsetY = Math.sin(angle) * distance;
      
      var finalX = targetCircle.x + (offsetX / window.innerWidth * 100);
      var finalY = targetCircle.y + (offsetY / window.innerHeight * 100);
      
      finalX = Math.max(0, Math.min(100, finalX));
      finalY = Math.max(0, Math.min(100, finalY));
      
      particle.style.left = finalX + '%';
      particle.style.top = finalY + '%';
      particle.style.animationDelay = (Math.random() * 5) + 's';
      particle.style.animationDuration = (4 + Math.random() * 3) + 's';
      
      var size = Math.random();
      if (size > 0.75) {
        particle.style.width = '4px';
        particle.style.height = '4px';
      } else if (size > 0.45) {
        particle.style.width = '3px';
        particle.style.height = '3px';
      } else {
        particle.style.width = '2px';
        particle.style.height = '2px';
      }
      
      container.appendChild(particle);
    }
  }
  
  _attachEvents() {
    var self = this;
    
    var toggleBtns = this.container.querySelectorAll('[data-action="toggle"]');
    for (var i = 0; i < toggleBtns.length; i++) {
      toggleBtns[i].addEventListener('click', function(e) {
        var index = parseInt(e.currentTarget.getAttribute('data-index'));
        self.toggleSet(index);
      });
    }
    
    var backBtn = this.container.querySelector('[data-action="back"]');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        self.destroy();
      });
    }
  }
  
  toggleSet(index) {
    this.data.sets[index].completed = !this.data.sets[index].completed;
    this._updateVolume();
    this.save();
    this.render();
  }
  
  _updateVolume() {
    this.data.totalVolume = 0;
    for (var i = 0; i < this.data.sets.length; i++) {
      if (this.data.sets[i].completed) {
        this.data.totalVolume += this.data.sets[i].weight * this.data.sets[i].reps;
      }
    }
  }
  
  startTimer() {
    var self = this;
    if (this.timerInterval) return;
    
    this.timerInterval = setInterval(function() {
      self.currentTime++;
      var timerEl = document.getElementById('trapbar-timer');
      if (timerEl) {
        var minutes = Math.floor(self.currentTime / 60);
        var seconds = self.currentTime % 60;
        timerEl.textContent = minutes + ':' + String(seconds).padStart(2, '0');
      }
    }, 1000);
  }
  
  stopTimer() {
    if (this.timerInterval) { 
      clearInterval(this.timerInterval); 
      this.timerInterval = null; 
    }
  }
  
  destroy() {
    this.stopTimer();
    if (this.container) this.container.innerHTML = '';
    window.dispatchEvent(new CustomEvent('trapbar:closed'));
  }
  
  save() { 
    localStorage.setItem('trapbar_workout', JSON.stringify(this.data)); 
  }
  
  load() {
    var saved = localStorage.getItem('trapbar_workout');
    if (saved) {
      this.data = Object.assign({}, this.data, JSON.parse(saved));
    }
    return this;
  }
}

export default TrapBarRenderer;
