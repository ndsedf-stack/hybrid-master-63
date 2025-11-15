export class TrapBarRenderer {
  constructor(containerId) {
    this.containerId = containerId || 'app';
    this.container = null;
    this.timerInterval = null;
    this.currentTime = 0;
    this.data = {
      exercise: 'Trap Bar Deadlift',
      category: 'COMPOUND DOS JAMBES',
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
  
  render() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) return;
    this.container.innerHTML = this._buildHTML();
    this._createParticles();
    this._attachEvents();
  }
  
  _buildHTML() {
    return '<div class="trapbar-screen">' + 
           this._renderHeader() + 
           this._renderMetrics() + 
           this._renderCircles() + 
           this._renderSeriesList() + 
           this._renderFooter() + 
           '</div>';
  }
  
  _renderHeader() {
    return '<div class="trapbar-header">' +
           '<div class="trapbar-trophy"></div>' +
           '<div class="trapbar-title-wrapper">' +
           '<h1><span class="trapbar-title-white">Trap Bar</span> <span class="trapbar-title-cyan">Deadlift</span></h1>' +
           '<div class="trapbar-subtitle">COMPOUND DOS JAMBES</div></div></div>';
  }
  
  _renderMetrics() {
    return '<div class="trapbar-metrics">' +
           '<div class="trapbar-metric-card"><div class="trapbar-metric-icon">W</div><div class="trapbar-metric-value orange">100kg</div><div class="trapbar-metric-label">POIDS</div></div>' +
           '<div class="trapbar-metric-card"><div class="trapbar-metric-icon">S</div><div class="trapbar-metric-value cyan">5x5</div><div class="trapbar-metric-label">SERIES</div></div>' +
           '<div class="trapbar-metric-card"><div class="trapbar-metric-icon">T</div><div class="trapbar-metric-value green">3-1-2</div><div class="trapbar-metric-label">TEMPO</div></div>' +
           '<div class="trapbar-metric-card"><div class="trapbar-metric-icon">R</div><div class="trapbar-metric-value violet">120s</div><div class="trapbar-metric-label">REPOS</div></div></div>';
  }
  
  _renderCircles() {
    return '<div class="trapbar-circles-container">' +
           '<div class="trapbar-big-circle trapbar-circle-left"></div>' +
           '<div class="trapbar-big-circle trapbar-circle-center"><div class="trapbar-circle-weight">100</div><div class="trapbar-circle-unit">kg</div></div>' +
           '<div class="trapbar-big-circle trapbar-circle-right"><div class="trapbar-circle-reps">5</div><div class="trapbar-circle-reps-label">reps</div></div></div>';
  }
  
  _renderSeriesList() {
    var html = '<div class="trapbar-series-list">';
    for (var i = 0; i < 5; i++) {
      var completed = i < 2;
      var checkClass = completed ? 'completed' : (i === 2 ? 'uncompleted-first' : 'uncompleted-gray');
      html += '<div class="trapbar-serie-row">' +
              '<div class="trapbar-serie-small-circle"><div class="trapbar-serie-small-num">100</div><div class="trapbar-serie-small-unit">kg</div></div>' +
              '<div class="trapbar-serie-text">100 kg</div>' +
              '<div class="trapbar-serie-reps-badge">5 reps</div>' +
              '<div class="trapbar-serie-checkbox ' + checkClass + '"></div></div>';
    }
    return html + '</div>';
  }
  
  _renderFooter() {
    return '<div class="trapbar-footer"><div><div class="trapbar-footer-label">CHRONO</div><div class="trapbar-timer">0:00</div></div><div class="trapbar-volume">1,000/2,500 KG</div></div>';
  }
  
  _createParticles() {
    var container = this.container.querySelector('.trapbar-screen');
    for (var i = 0; i < 30; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 3 + 's';
      container.appendChild(p);
    }
  }
  
  _attachEvents() {}
  load() { return this; }
  startTimer() {}
}

export default TrapBarRenderer;
