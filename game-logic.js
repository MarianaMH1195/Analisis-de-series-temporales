/**
 * ============================================================
 * DETECTIVE DE DATOS - Lógica del Juego v3.0 (Mission System)
 * ============================================================
 */

'use strict';

// ============================================================
// 1. SOUND MANAGER
// ============================================================

class SoundManager {
    constructor() {
        this.enabled = true;
        this.context = null;
        this.init();
    }

    init() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.context) return;

        try {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.context.currentTime);

            gain.gain.setValueAtTime(0.1, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.context.destination);

            osc.start();
            osc.stop(this.context.currentTime + duration);
        } catch (e) {
            console.error('Audio play error', e);
        }
    }

    play(soundName) {
        if (!this.enabled) return;

        switch (soundName) {
            case 'click':
                this.playTone(600, 0.1, 'sine');
                break;
            case 'success':
                setTimeout(() => this.playTone(600, 0.1, 'sine'), 0);
                setTimeout(() => this.playTone(800, 0.1, 'sine'), 100);
                setTimeout(() => this.playTone(1200, 0.2, 'sine'), 200);
                break;
            case 'error':
                setTimeout(() => this.playTone(300, 0.1, 'sawtooth'), 0);
                setTimeout(() => this.playTone(200, 0.2, 'sawtooth'), 100);
                break;
            case 'complete':
                // Fanfare
                [440, 554, 659, 880].forEach((freq, i) => {
                    setTimeout(() => this.playTone(freq, 0.3, 'square'), i * 150);
                });
                break;
            case 'unlock':
                this.playTone(1000, 0.5, 'triangle');
                break;
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// ============================================================
// 2. DATA ANALYZER (Utility for Sandbox)
// ============================================================

class DataAnalyzer {
    constructor(dataset) {
        this.dataset = dataset;
    }

    calculateStats() {
        const data = this.dataset.values;
        const n = data.length;
        const sorted = [...data].sort((a, b) => a - b);

        const sum = data.reduce((a, b) => a + b, 0);
        const mean = sum / n;

        const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
        const stdDev = Math.sqrt(variance);

        return {
            min: sorted[0],
            max: sorted[n - 1],
            mean: Math.round(mean),
            stdDev: Math.round(stdDev),
            count: n
        };
    }

    formatNumber(num) {
        if (typeof numeral !== 'undefined') {
            return numeral(num).format('0,0');
        }
        return num.toLocaleString('es-ES');
    }
}

// ============================================================
// 3. SANDBOX MANAGER
// ============================================================

class SandboxManager {
    constructor() {
        this.isActive = false;
        this.dataset = allDatasets['retail']; // Default to retail
        this.chart = null;
    }

    open(datasetId = 'retail') {
        this.dataset = allDatasets[datasetId] || allDatasets['retail'];
        this.isActive = true;

        document.getElementById('sandboxModal').classList.add('active');
        this.initControls();
        this.renderChart();
        this.updateStats();
    }

    close() {
        this.isActive = false;
        document.getElementById('sandboxModal').classList.remove('active');
    }

    initControls() {
        // Init listeners if not already done (singleton check)
        if (this.initialized) return;

        document.getElementById('btnCloseSandbox')?.addEventListener('click', () => this.close());

        ['sandboxChartType', 'sandboxShowTrend', 'sandboxShowMovingAvg', 'sandboxShowAnomalies'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => this.renderChart());
        });

        document.getElementById('sandboxStartDate')?.addEventListener('change', () => {
            this.renderChart();
            this.updateStats();
        });
        document.getElementById('sandboxEndDate')?.addEventListener('change', () => {
            this.renderChart();
            this.updateStats();
        });

        this.initialized = true;
    }

    getFilteredData() {
        const startStr = document.getElementById('sandboxStartDate').value;
        const endStr = document.getElementById('sandboxEndDate').value;
        const start = new Date(startStr);
        const end = new Date(endStr);

        const indices = [];
        this.dataset.dates.forEach((d, i) => {
            const date = new Date(d);
            if (date >= start && date <= end) indices.push(i);
        });

        return {
            dates: indices.map(i => this.dataset.dates[i]),
            values: indices.map(i => this.dataset.values[i])
        };
    }

    updateStats() {
        const data = this.getFilteredData();
        const analyzer = new DataAnalyzer({ values: data.values });
        const stats = analyzer.calculateStats();

        document.getElementById('sandboxMean').textContent = analyzer.formatNumber(stats.mean);
        document.getElementById('sandboxMax').textContent = analyzer.formatNumber(stats.max);
        document.getElementById('sandboxMin').textContent = analyzer.formatNumber(stats.min);
        document.getElementById('sandboxStd').textContent = analyzer.formatNumber(stats.stdDev);
    }

    renderChart() {
        const ctx = document.getElementById('sandboxChart')?.getContext('2d');
        if (!ctx) return;

        if (this.chart) this.chart.destroy();

        if (this.rankEl) this.rankEl.innerHTML = '<i class="ri-seedling-line"></i>';
        if (this.rankNameEl) this.rankNameEl.textContent = 'Novato';
        const type = document.getElementById('sandboxChartType').value;
        const showTrend = document.getElementById('sandboxShowTrend').checked;
        const showMA = document.getElementById('sandboxShowMovingAvg').checked;
        const showAnomalies = document.getElementById('sandboxShowAnomalies').checked;

        const chartData = {
            labels: data.dates,
            datasets: [{
                label: this.dataset.variable,
                data: data.values,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: type === 'line',
                type: type === 'scatter' ? 'scatter' : (type === 'bar' ? 'bar' : 'line'),
                tension: 0.3
            }]
        };

        // Add overlays
        if (showTrend && type !== 'bar') {
            // Simple linear regression calculation for filtered data
            const n = data.values.length;
            let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
            data.values.forEach((y, x) => {
                sumX += x;
                sumY += y;
                sumXY += x * y;
                sumXX += x * x;
            });
            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;

            const trendData = data.values.map((_, i) => slope * i + intercept);

            chartData.datasets.push({
                label: 'Tendencia',
                data: trendData,
                borderColor: '#ffc107',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
                type: 'line'
            });
        }

        this.chart = new Chart(ctx, {
            type: 'line', // Base type, mixed allowed
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                }
            }
        });
    }
}

// ============================================================
// 4. LEADERBOARD MANAGER
// ============================================================



// ============================================================
// 5. GLOBAL UI CONTROLLER
// ============================================================

class UIController {
    constructor() {
        this.initDarkMode();
        this.initGlobalListeners();
    }

    initDarkMode() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.getElementById('btnDarkMode')?.classList.add('active');
        }
    }

    toggleDescription() {
        const html = document.documentElement;
        if (html.getAttribute('data-theme') === 'dark') {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            return false;
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            return true;
        }
    }

    initGlobalListeners() {
        // Sound
        document.getElementById('btnSound')?.addEventListener('click', (e) => {
            const enabled = soundManager.toggle();
            e.currentTarget.classList.toggle('active', enabled);
            e.currentTarget.classList.toggle('active', enabled);
            e.currentTarget.innerHTML = enabled ? '<i class="ri-volume-up-line"></i>' : '<i class="ri-volume-mute-line"></i>';
        });

        // Dark Mode
        document.getElementById('btnDarkMode')?.addEventListener('click', (e) => {
            const isDark = this.toggleDescription();
            e.currentTarget.classList.toggle('active', isDark);

            // Reload chart if exists (to update colors)
            if (missionSystem && missionSystem.missionChart) {
                missionSystem.initMissionChart();
            }
        });



        // Sandbox Globally accessible
        document.getElementById('btnSandboxModeInline')?.addEventListener('click', () => {
            sandboxManager.open(missionSystem.currentMission?.dataset || 'retail');
        });
    }
}

// ============================================================
// INITIALIZATION
// ============================================================

// Global Instances
let soundManager, sandboxManager, uiController;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Managers
    soundManager = new SoundManager();

    sandboxManager = new SandboxManager();
    uiController = new UIController();

    // 2. Initialize Mission System (defined in mission-system.js)
    if (typeof MissionSystem !== 'undefined') {
        missionSystem = new MissionSystem();
    } else {
        console.error('MissionSystem class not found! Check imports.');
    }
});
