🔥 PUTAIN ! ENCORE UN PROBLÈME D'ENCODAGE EMOJI !
ON VA RECRÉER LE FICHIER SANS EMOJIS :
bash
cd ~/Desktop/hybrid-master-63

# Supprime et recrée le fichier SANS emojis
rm scripts/ui/trapbar-renderer.js

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
    if (!this.container) return;
    
    this.container.innerHTML = this._buildHTML();
    this._createParticles();
    this._attachEvents();
  }
  
  _buildHTML() {
    return '<div class="trapbar-screen">' + 
           this._renderParticles() + 
           this._renderBackButton() + 
           this._renderHeader() + 
           this._renderMetrics() + 
           this._renderCircles() + 
           this._renderSeriesList() + 
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
    var firstWord = parts[0] || 'Exercise';
    var restWords = parts.slice(1).join(' ') || '';
    
    return '<div class="trapbar-header">' +
           '<div class="trapbar-trophy"></div>' +
           '<div class="trapbar-title-wrapper">' +
           '<h1>' +
           '<span class="trapbar-title-white">' + firstWord + '</span> ' +
           '<span class="trapbar-title-cyan">' + restWords + '</span>' +
           '</h1>' +
           '<div class="trapbar-subtitle">' + this.data.category + '</div>' +
           '</div>' +
           '</div>';
  }
  
  _renderMetrics() {
    return '<div class="trapbar-metrics">' +
           '<div class="trapbar-metric-card">' +
           '<div class="trapbar-metric-icon">W</div>' +
           '<div class="trapbar-metric-value orange">' + this.data.weight + 'kg</div>' +
           '<div class="trapbar-metric-label">POIDS</div>' +
           '</div>' +
           '<div class="trapbar-metric-card">' +
           '<div class="trapbar-metric-icon">S</div>' +
           '<div class="trapbar-metric-value cyan">' + this.data.series + '</div>' +
           '<div class="trapbar-metric-label">SERIES</div>' +
           '</div>' +
           '<div class="trapbar-metric-card">' +
           '<div class="trapbar-metric-icon">T</div>' +
           '<div class="trapbar-metric-value green">' + this.data.tempo + '</div>' +
           '<div class="trapbar-metric-label">TEMPO</div>' +
           '</div>' +
           '<div class="trapbar-metric-card">' +
           '<div class="trapbar-metric-icon">R</div>' +
           '<div class="trapbar-metric-value violet">' + this.data.rest + 's</div>' +
           '<div class="trapbar-metric-label">REPOS</div>' +
           '</div>' +
           '</div>';
  }
  
  _renderCircles() {
    var currentSet = this.data.sets.find(function(s) { return !s.completed; }) || this.data.sets[0];
    
    return '<div class="trapbar-circles-container">' +
           '<div class="trapbar-big-circle trapbar-circle-left"></div>' +
           '<div class="trapbar-big-circle trapbar-circle-center">' +
           '<div class="trapbar-circle-weight">' + currentSet.weight + '</div>' +
           '<div class="trapbar-circle-unit">kg</div>' +
           '</div>' +
           '<div class="trapbar-big-circle trapbar-circle-right">' +
           '<div class="trapbar-circle-reps">' + currentSet.reps + '</div>' +
           '<div class="trapbar-circle-reps-label">reps</div>' +
           '</div>' +
           '</div>';
  }
  
  _renderSeriesList() {
    var self = this;
    var html = '<div class="trapbar-series-list">';
    
    this.data.sets.forEach(function(set, index) {
      html += self._renderSerieRow(set, index);
    });
    
    html += '</div>';
    return html;
  }
  
  _renderSerieRow(set, index) {
    var centerElement = '';
    var checkboxClass = '';
    var firstUncompleted = this.data.sets.findIndex(function(s) { return !s.completed; });
    
    if (set.completed) {
      checkboxClass = 'completed';
    } else if (index === firstUncompleted) {
      checkboxClass = 'uncompleted-first';
    } else if (index === firstUncompleted + 1) {
      checkboxClass = 'uncompleted-gray';
    } else {
      checkboxClass = 'uncompleted-beige';
    }
    
    if (set.type === 'dropset') {
      centerElement = '<div class="trapbar-serie-badge dropset">DROP SET</div>';
    } else if (set.type === 'restpause') {
      centerElement = '<div class="trapbar-serie-badge restpause">REST PAUSE</div>';
    } else {
      var textClass = set.completed ? 'completed' : 'uncompleted';
      centerElement = '<div class="trapbar-serie-text ' + textClass + '">' + set.weight + ' kg</div>';
    }
    
    return '<div class="trapbar-serie-row" data-index="' + index + '">' +
           '<div class="trapbar-serie-small-circle">' +
           '<div class="trapbar-serie-small-num">' + set.weight + '</div>' +
           '<div class="trapbar-serie-small-unit">kg</div>' +
           '</div>' +
           centerElement +
           '<div class="trapbar-serie-reps-badge">' + set.reps + ' reps</div>' +
           '<div class="trapbar-serie-checkbox ' + checkboxClass + '" data-action="toggle" data-index="' + index + '"></div>' +
           '</div>';
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
  
  _createParticles() {
    var container = document.getElementById('trapbar-particles');
    if (!container) return;
    
    for (var i = 0; i < 40; i++) {
      var particle = document.createElement('div');
      particle.className = 'particle';
      
      var x = Math.random() * 100;
      var y = Math.random() * 100;
      
      particle.style.left = x + '%';
      particle.style.top = y + '%';
      particle.style.animationDelay = (Math.random() * 3) + 's';
      particle.style.animationDuration = (2 + Math.random() * 2) + 's';
      
      container.appendChild(particle);
    }
  }
  
  _attachEvents() {
    var self = this;
    
    this.container.querySelectorAll('[data-action="toggle"]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        self.toggleSet(parseInt(e.currentTarget.dataset.index));
      });
    });
    
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
    var self = this;
    this.data.totalVolume = this.data.sets.filter(function(s) { 
      return s.completed; 
    }).reduce(function(sum, s) { 
      return sum + (s.weight * s.reps); 
    }, 0);
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
