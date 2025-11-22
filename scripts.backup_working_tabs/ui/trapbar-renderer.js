🔥 PUTAIN ! LE JS A UN PROBLÈME ! JE CORRIGE !
bashcd ~/Desktop/hybrid-master-63

# Vérifie si le fichier est complet
tail -20 scripts/ui/trapbar-renderer.js

# Si le fichier est incomplet, refais-le COMPLET
cat > scripts/ui/trapbar-renderer.js << 'EOFJS'
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
        { weight: 100, reps: 5, type: 'normal', completed: true },
        { weight: 100, reps: 5, type: 'dropset', completed: true },
        { weight: 100, reps: 5, type: 'restpause', completed: false },
        { weight: 100, reps: 5, type: 'normal', completed: false },
        { weight: 100, reps: 5, type: 'normal', completed: false }
      ],
      totalVolume: 1000,
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
    if (!this.container) {
      console.error('Container not found:', this.containerId);
      return;
    }
    
    this.container.innerHTML = this._buildHTML();
    this._createConcentratedParticles();
    this._attachEvents();
  }
  
  _buildHTML() {
    var html = '<div class="trapbar-screen">';
    html += this._renderParticles();
    html += this._renderBackButton();
    html += this._renderHeader();
    html += this._renderMetrics();
    html += this._renderCircles();
    html += this._renderSeriesList();
    html += this._renderFooter();
    html += '</div>';
    return html;
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
    return '<svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="5" y="26" width="8" height="12" rx="2" fill="url(#wg)"/><rect x="51" y="26" width="8" height="12" rx="2" fill="url(#wg)"/><rect x="13" y="29" width="38" height="6" rx="3" fill="url(#wg)"/><defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b0b0b0"/><stop offset="100%" stop-color="#707070"/></linearGradient></defs></svg>';
  }
  
  _getSeriesIcon() {
    return '<svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="16" y="18" width="32" height="8" rx="4" fill="#00D9FF" opacity="0.4"/><rect x="18" y="27" width="28" height="8" rx="4" fill="#00D9FF" opacity="0.7"/><rect x="20" y="36" width="24" height="8" rx="4" fill="#00D9FF"/></svg>';
  }
  
  _getTempoIcon() {
    return '<svg width="64" height="64" viewBox="0 0 64 64" fill="none"><path d="M32 10L38 28L32 46L26 28L32 10Z" fill="url(#lg)"/><defs><linearGradient id="lg" x1="32" y1="10" x2="32" y2="46"><stop offset="0%" stop-color="#FFD700"/><stop offset="100%" stop-color="#35FF8B"/></linearGradient></defs></svg>';
  }
  
  _getRestIcon() {
    return '<svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="16" fill="url(#rg)"/><defs><radialGradient id="rg"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#b0b0b0"/></radialGradient></defs></svg>';
  }
  
  _renderCircles() {
    var currentSet = this.data.sets.find(function(s) { return !s.completed; }) || this.data.sets[0];
    
    return '<div class="trapbar-circles-container">' +
           this._renderCircle('green', '<div class="trapbar-circle-check">&#10003;</div>') +
           this._renderCircle('orange', '<div class="trapbar-circle-weight">' + currentSet.weight + '</div><div class="trapbar-circle-unit">kg</div>') +
           this._renderCircle('blue', '<div class="trapbar-circle-reps">' + currentSet.reps + '</div><div class="trapbar-circle-reps-label">reps</div>') +
           '</div>';
  }
  
  _renderCircle(color, content) {
    var id = 'g' + Math.random().toString(36).substr(2, 9);
    var colors = {
      green: ['#00d4ff', '#35FF8B', '#9D4EDD', '#00d4ff'],
      orange: ['#FF6D00', '#FFB347', '#35FF8B', '#FF6D00'],
      blue: ['#00D9FF', '#7c3aed', '#00D9FF']
    };
    var c = colors[color];
    var stops = c.length === 3 ? 
      '<stop offset="0%" stop-color="' + c[0] + '"/><stop offset="50%" stop-color="' + c[1] + '"/><stop offset="100%" stop-color="' + c[2] + '"/>' :
      '<stop offset="0%" stop-color="' + c[0] + '"/><stop offset="33%" stop-color="' + c[1] + '"/><stop offset="66%" stop-color="' + c[2] + '"/><stop offset="100%" stop-color="' + c[3] + '"/>';
    
    return '<div class="trapbar-circle-wrapper ' + color + '">' +
           '<svg class="trapbar-circle-svg" viewBox="0 0 220 220"><defs><linearGradient id="' + id + '" x1="0%" y1="0%" x2="100%" y2="100%">' + stops + '</linearGradient></defs>' +
           '<circle cx="110" cy="110" r="104" stroke="url(#' + id + ')" stroke-width="6" fill="none"/></svg>' +
           '<div class="trapbar-circle-inner">' + content + '</div></div>';
  }
  
  _renderSeriesList() {
    var html = '<div class="trapbar-series-list">';
    var first = this.data.sets.findIndex(function(s) { return !s.completed; });
    
    for (var i = 0; i < this.data.sets.length; i++) {
      var s = this.data.sets[i];
      var chk = s.completed ? 'completed' : (i === first ? 'uncompleted-first' : (i === first + 1 ? 'uncompleted-gray' : 'uncompleted-beige'));
      var row = s.completed ? ' completed' : '';
      var center = s.type === 'dropset' ? '<div class="trapbar-serie-badge dropset">DROP SET</div>' : 
                   (s.type === 'restpause' ? '<div class="trapbar-serie-badge restpause">REST PAUSE</div>' : 
                   '<div class="trapbar-serie-text">' + s.weight + ' kg</div>');
      
      html += '<div class="trapbar-serie-row' + row + '">' +
              '<div class="trapbar-serie-small-circle"><div class="trapbar-serie-small-num">' + s.weight + '</div><div class="trapbar-serie-small-unit">kg</div></div>' +
              center +
              '<div class="trapbar-serie-reps-badge">' + s.reps + ' reps</div>' +
              '<div class="trapbar-serie-checkbox ' + chk + '" data-action="toggle" data-index="' + i + '"></div>' +
              '</div>';
    }
    
    html += '</div>';
    return html;
  }
  
  _renderFooter() {
    var m = Math.floor(this.currentTime / 60);
    var s = this.currentTime % 60;
    return '<div class="trapbar-footer"><div><div class="trapbar-footer-label">CHRONO</div><div class="trapbar-timer" id="trapbar-timer">' + m + ':' + String(s).padStart(2, '0') + '</div></div>' +
           '<div class="trapbar-volume">' + this.data.totalVolume.toLocaleString() + '/' + this.data.targetVolume.toLocaleString() + ' KG</div></div>';
  }
  
  _createConcentratedParticles() {
    var c = document.getElementById('trapbar-particles');
    if (!c) return;
    var pos = [{x:25,y:42},{x:50,y:42},{x:75,y:42}];
    for (var i = 0; i < 100; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var t = pos[Math.floor(Math.random() * 3)];
      var d = Math.random() < 0.7 ? Math.random() * 300 : (Math.random() < 0.9 ? 300 + Math.random() * 200 : 500 + Math.random() * 300);
      var a = Math.random() * Math.PI * 2;
      var x = t.x + (Math.cos(a) * d / window.innerWidth * 100);
      var y = t.y + (Math.sin(a) * d / window.innerHeight * 100);
      p.style.left = Math.max(0, Math.min(100, x)) + '%';
      p.style.top = Math.max(0, Math.min(100, y)) + '%';
      p.style.animationDelay = (Math.random() * 5) + 's';
      p.style.animationDuration = (4 + Math.random() * 3) + 's';
      var sz = Math.random() > 0.7 ? '4px' : (Math.random() > 0.4 ? '3px' : '2px');
      p.style.width = sz;
      p.style.height = sz;
      c.appendChild(p);
    }
  }
  
  _attachEvents() {
    var self = this;
    var btns = this.container.querySelectorAll('[data-action="toggle"]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function(e) {
        self.toggleSet(parseInt(e.currentTarget.getAttribute('data-index')));
      });
    }
    var back = this.container.querySelector('[data-action="back"]');
    if (back) back.addEventListener('click', function() { self.destroy(); });
  }
  
  toggleSet(i) {
    this.data.sets[i].completed = !this.data.sets[i].completed;
    this._updateVolume();
    this.save();
    this.render();
  }
  
  _updateVolume() {
    this.data.totalVolume = 0;
    for (var i = 0; i < this.data.sets.length; i++) {
      if (this.data.sets[i].completed) this.data.totalVolume += this.data.sets[i].weight * this.data.sets[i].reps;
    }
  }
  
  startTimer() {
    var self = this;
    if (this.timerInterval) return;
    this.timerInterval = setInterval(function() {
      self.currentTime++;
      var t = document.getElementById('trapbar-timer');
      if (t) {
        var m = Math.floor(self.currentTime / 60);
        var s = self.currentTime % 60;
        t.textContent = m + ':' + String(s).padStart(2, '0');
      }
    }, 1000);
  }
  
  stopTimer() {
    if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
  }
  
  destroy() {
    this.stopTimer();
    if (this.container) this.container.innerHTML = '';
    window.dispatchEvent(new CustomEvent('trapbar:closed'));
  }
  
  save() { localStorage.setItem('trapbar_workout', JSON.stringify(this.data)); }
  
  load() {
    var s = localStorage.getItem('trapbar_workout');
    if (s) this.data = Object.assign({}, this.data, JSON.parse(s));
    return this;
  }
}

export default TrapBarRenderer;
