export class TrapBarRenderer {
  constructor(containerId) {
    this.containerId = containerId || 'app';
    this.container = null;
    this.timerInterval = null;
    this.currentTime = 0;
    this.data = {
      exercise: 'Trap Bar Deadlift',
      category: 'COMPOUND · DOS / JAMBES',
      sets: [
        { weight: 100, reps: 5, completed: true, type: 'normal' },
        { weight: 100, reps: 5, completed: false, type: 'dropset' },
        { weight: 100, reps: 5, completed: false, type: 'rest' },
        { weight: 100, reps: 5, completed: false, type: 'normal' }
      ],
      totalVolume: 500,
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
    this._attachEvents();
  }
  
  _buildHTML() {
    return '<div class="trapbar-screen">' + 
           this._renderBackButton() + 
           this._renderHeader() + 
           this._renderSeriesList() +
           this._renderFooter() + 
           '</div>';
  }
  
  _renderBackButton() { 
    return '<div class="trapbar-back-btn" data-action="back"></div>'; 
  }
  
  _renderHeader() {
    var parts = this.data.exercise.split(' ');
    var firstWords = parts.slice(0, 2).join(' ') || 'Trap Bar';
    var lastWord = parts[2] || 'Deadlift';
    
    return '<div class="trapbar-header">' +
           '<h1>' +
           '<span class="trapbar-title-white">' + firstWords + '</span> ' +
           '<span class="trapbar-title-cyan">' + lastWord + '</span>' +
           '</h1>' +
           '<div class="trapbar-subtitle">' + this.data.category + '</div>' +
           '</div>';
  }
  
  _renderSeriesList() {
    var html = '<div class="trapbar-series-list">';
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
      
      html += '<div class="trapbar-serie-row">';
      
      // Cercle poids (gauche)
      html += '<div class="trapbar-serie-weight-circle">' +
              '<div class="trapbar-serie-weight-value">' + set.weight + '</div>' +
              '<div class="trapbar-serie-weight-unit">kg</div>' +
              '</div>';
      
      // Centre (texte ou bouton)
      html += '<div class="trapbar-serie-center">';
      
      if (set.type === 'dropset' && !set.completed) {
        html += '<div class="trapbar-serie-label">DROP</div>' +
                '<button class="trapbar-serie-button dropset">SET</button>';
      } else if (set.type === 'rest' && !set.completed) {
        html += '<div class="trapbar-serie-label">REST</div>' +
                '<button class="trapbar-serie-button rest">PAUSE</button>';
      } else {
        html += '<div class="trapbar-serie-kg-text">' + set.weight + ' kg</div>';
      }
      
      html += '</div>';
      
      // Reps (droite centre)
      html += '<div class="trapbar-serie-reps">' + set.reps + ' reps</div>';
      
      // Cercle à cocher (droite)
      html += '<div class="trapbar-serie-check-circle ' + circleClass + '" data-action="toggle" data-index="' + i + '"></div>';
      
      html += '</div>';
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
