// ============================================================
// DETECTIVE DE DATOS - MISSION SYSTEM
// Sistema de gestión de misiones con progresión
// ============================================================

class MissionSystem {
    constructor() {
        this.storageKey = 'detective_missions';
        this.currentMission = null;
        this.currentQuestionIndex = 0;
        this.missionAnswers = {};

        // Estado del jugador
        this.playerState = this.loadPlayerState();

        // Inicializar
        this.init();
    }

    // ========================================================
    // INICIALIZACIÓN
    // ========================================================

    init() {
        this.setupNavigationListeners();
        this.renderMissionSelect();
        this.updatePlayerStats();
    }

    loadPlayerState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load mission state:', e);
        }

        return {
            totalXP: 0,
            completedMissions: [],
            unlockedMissions: [1], // Misión 1 siempre desbloqueada
            achievements: [],
            currentRank: 0,
            missionScores: {}
        };
    }

    savePlayerState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.playerState));
        } catch (e) {
            console.warn('Could not save mission state:', e);
        }
    }

    // ========================================================
    // NAVEGACIÓN
    // ========================================================

    setupNavigationListeners() {
        // Botón volver a misiones
        document.getElementById('btnBackToMissions')?.addEventListener('click', () => {
            this.showMissionSelect();
        });

        // Modal de Completado
        document.getElementById('btnMissionCompleteClose')?.addEventListener('click', () => {
            document.getElementById('missionCompleteModal')?.classList.remove('active');
            this.showMissionSelect();
        });

        // ========================================================
        // LISTENERS DE MODALES NUEVOS
        // ========================================================

        // Tutorial
        document.getElementById('btnTutorial')?.addEventListener('click', () => {
            document.getElementById('tutorialModal')?.classList.add('active');
        });

        document.getElementById('btnCloseTutorial')?.addEventListener('click', () => {
            document.getElementById('tutorialModal')?.classList.remove('active');
        });

        document.getElementById('tutorialBackdrop')?.addEventListener('click', () => {
            document.getElementById('tutorialModal')?.classList.remove('active');
        });

        // Settings
        document.getElementById('btnSettings')?.addEventListener('click', () => {
            this.openSettings();
        });

        document.getElementById('btnCloseSettings')?.addEventListener('click', () => {
            document.getElementById('settingsModal')?.classList.remove('active');
        });

        document.getElementById('settingsBackdrop')?.addEventListener('click', () => {
            document.getElementById('settingsModal')?.classList.remove('active');
        });

        // Botón Reset en Settings
        document.getElementById('btnResetProgress')?.addEventListener('click', () => {
            if (confirm('⚠️ ¿Estás seguro de reiniciar todo tu progreso? Perderás tu rango y medallas.')) {
                this.resetProgress();
                document.getElementById('settingsModal')?.classList.remove('active');
            }
        });

        // Toggle Sonido en Settings
        document.getElementById('settingSoundToggle')?.addEventListener('change', (e) => {
            if (typeof soundManager !== 'undefined') {
                soundManager.enabled = e.target.checked;
            }
        });

        // Toggle Dark Mode en Settings
        document.getElementById('settingDarkModeToggle')?.addEventListener('change', (e) => {
            if (typeof uiController !== 'undefined') {
                const isDark = e.target.checked;
                const html = document.documentElement;
                if (isDark) {
                    html.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    html.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                }

                // Actualizar gráfico misiones
                if (this.missionChart) {
                    this.initMissionChart();
                }
            }
        });

        // Siguiente misión
        document.getElementById('btnNextMission')?.addEventListener('click', () => {
            document.getElementById('missionCompleteModal')?.classList.remove('active');
            const nextId = this.currentMission.id + 1;

            if (nextId > 7) {
                // Campaña completada - Mostrar modal de nombre
                this.showNameModal();
            } else if (this.playerState.unlockedMissions.includes(nextId)) {
                this.startMission(nextId);
            } else {
                this.showMissionSelect();
            }
        });

        // Listeners para el modal de nombre (Final del juego)
        document.getElementById('btnSaveName')?.addEventListener('click', () => {
            this.saveScoreAndFinish();
        });

        document.getElementById('btnSkipName')?.addEventListener('click', () => {
            this.finishCampaign();
        });
    }

    openSettings() {
        const modal = document.getElementById('settingsModal');
        if (!modal) return;

        // Sincronizar estado actual de los switches
        const soundToggle = document.getElementById('settingSoundToggle');
        if (soundToggle && typeof soundManager !== 'undefined') {
            soundToggle.checked = soundManager.enabled;
        }

        const darkToggle = document.getElementById('settingDarkModeToggle');
        if (darkToggle) {
            darkToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
        }

        modal.classList.add('active');
    }

    showMissionSelect() {
        document.getElementById('missionSelectScreen')?.classList.add('active');
        document.getElementById('missionPlayScreen')?.classList.remove('active');
        this.renderMissionSelect();
        this.updatePlayerStats();
    }

    showMissionPlay() {
        document.getElementById('missionSelectScreen')?.classList.remove('active');
        document.getElementById('missionPlayScreen')?.classList.add('active');
    }

    // ========================================================
    // RENDER SELECTOR DE MISIONES
    // ========================================================

    renderMissionSelect() {
        const grid = document.getElementById('missionsGrid');
        if (!grid) return;

        grid.innerHTML = missionsData.map(mission => {
            const isCompleted = this.playerState.completedMissions.includes(mission.id);
            const isUnlocked = this.playerState.unlockedMissions.includes(mission.id);
            const score = this.playerState.missionScores[mission.id] || 0;

            let stateClass = 'locked';
            if (isCompleted) stateClass = 'completed';
            else if (isUnlocked) stateClass = 'unlocked';

            return `
                <div class="mission-card ${stateClass}" data-mission="${mission.id}">
                    <div class="mission-card-header">
                        <span class="mission-icon">${mission.icon}</span>
                        <span class="mission-number">Misión ${mission.id}</span>
                    </div>
                    <h3 class="mission-title">${mission.title}</h3>
                    <p class="mission-subtitle">${mission.subtitle}</p>
                    <div class="mission-meta">
                        <span class="mission-difficulty">${mission.stars}</span>
                        <span class="mission-duration"><i class="ri-time-line"></i> ${mission.duration}</span>
                    </div>
                    <div class="mission-progress">
                        ${isCompleted ? `
                            <div class="mission-xp-earned"><i class="ri-check-line"></i> ${score}/${mission.xpReward} XP</div>
                        ` : `
                            <div class="mission-xp-reward"><i class="ri-target-line"></i> ${mission.xpReward} XP</div>
                        `}
                    </div>
                    ${stateClass === 'locked' ? `
                        <div class="mission-lock">
                            <span class="lock-icon"><i class="ri-lock-2-line"></i></span>
                            <p>Completa Misión ${mission.id - 1}</p>
                        </div>
                    ` : `
                        <button class="btn btn-mission ${isCompleted ? 'btn-replay' : 'btn-start'}" 
                                onclick="missionSystem.startMission(${mission.id})">
                            ${isCompleted ? '🔄 Repetir' : '▶️ Iniciar'}
                        </button>
                    `}
                </div>
            `;
        }).join('');
    }

    // ========================================================
    // ACTUALIZAR STATS DEL JUGADOR
    // ========================================================

    updatePlayerStats() {
        // XP Total
        const xpDisplay = document.getElementById('totalXP');
        const xpProgress = document.getElementById('xpProgressFill');
        if (xpDisplay) xpDisplay.textContent = this.playerState.totalXP;
        if (xpProgress) xpProgress.style.width = `${(this.playerState.totalXP / TOTAL_XP) * 100}%`;

        // Misiones completadas
        const missionsDisplay = document.getElementById('missionsCompleted');
        if (missionsDisplay) {
            missionsDisplay.textContent = `${this.playerState.completedMissions.length}/7`;
        }

        // Rango actual
        const currentRank = this.getCurrentRank();
        const rankDisplay = document.getElementById('currentRank');
        const rankIcon = document.getElementById('rankIcon');
        if (rankDisplay) rankDisplay.textContent = currentRank.name;
        if (rankIcon) rankIcon.innerHTML = currentRank.icon;

        // Achievements
        this.renderAchievements();
    }

    getCurrentRank() {
        const xp = this.playerState.totalXP;
        let currentRank = ranks[0];
        for (const rank of ranks) {
            if (xp >= rank.minXP) {
                currentRank = rank;
            }
        }
        return currentRank;
    }

    renderAchievements() {
        const container = document.getElementById('achievementsContainer');
        if (!container) return;

        container.innerHTML = achievements.map(ach => {
            const earned = this.playerState.achievements.includes(ach.id);
            return `
                <div class="achievement-badge ${earned ? 'earned' : 'locked'}" title="${ach.desc}">
                    <span class="achievement-icon">${earned ? ach.icon : '<i class="ri-lock-line"></i>'}</span>
                    <span class="achievement-name">${ach.name}</span>
                </div>
            `;
        }).join('');
    }

    // ========================================================
    // INICIAR MISIÓN
    // ========================================================

    startMission(missionId) {
        const mission = missionsData.find(m => m.id === missionId);
        if (!mission) return;

        if (!this.playerState.unlockedMissions.includes(missionId)) {
            alert('Esta misión aún está bloqueada.');
            return;
        }

        this.currentMission = mission;
        this.currentQuestionIndex = 0;
        this.missionAnswers = {};

        this.showMissionPlay();
        this.renderMissionContent();
        this.initMissionChart();

        // Play sound if available
        if (typeof soundManager !== 'undefined') {
            soundManager.play('click');
        }
    }

    // ========================================================
    // RENDER CONTENIDO DE MISIÓN
    // ========================================================

    renderMissionContent() {
        const mission = this.currentMission;
        if (!mission) return;

        // Header
        document.getElementById('missionPlayTitle').textContent = mission.title;
        document.getElementById('missionPlaySubtitle').textContent = mission.subtitle;
        document.getElementById('missionPlayIcon').innerHTML = mission.icon;
        document.getElementById('missionPlayDifficulty').innerHTML = mission.stars;

        // Narrative
        document.getElementById('missionNarrative').textContent = mission.narrative;

        // Objectives
        const objectivesList = document.getElementById('missionObjectives');
        if (objectivesList) {
            objectivesList.innerHTML = mission.objectives.map(obj =>
                `<li><i class="ri-checkbox-blank-circle-line"></i> ${obj}</li>`
            ).join('');
        }

        // Questions progress
        this.updateQuestionProgress();

        // Render current question
        this.renderCurrentQuestion();
    }

    updateQuestionProgress() {
        const progress = document.getElementById('questionProgress');
        if (progress) {
            progress.textContent = `Pregunta ${this.currentQuestionIndex + 1} de ${this.currentMission.questions.length}`;
        }
    }

    renderCurrentQuestion() {
        const mission = this.currentMission;
        const question = mission.questions[this.currentQuestionIndex];
        if (!question) return;

        const container = document.getElementById('questionContainer');
        if (!container) return;

        let inputHTML = '';

        switch (question.type) {
            case 'select':
                inputHTML = `
                    <div class="radio-group">
                        ${question.options.map(opt => `
                            <div class="radio-option">
                                <input type="radio" name="answer" id="opt-${opt.value}" value="${opt.value}">
                                <label for="opt-${opt.value}">${opt.text}</label>
                            </div>
                        `).join('')}
                    </div>
                `;
                break;

            case 'number':
                inputHTML = `
                    <div class="form-group">
                        <input type="number" id="numberAnswer" class="form-input" 
                               placeholder="Ingresa tu respuesta numérica">
                    </div>
                `;
                break;

            case 'text':
                inputHTML = `
                    <div class="form-group">
                        <input type="text" id="textAnswer" class="form-input" 
                               placeholder="Escribe tu respuesta">
                    </div>
                `;
                break;
        }

        container.innerHTML = `
            <div class="question-card">
                <h3 class="question-title">${question.title}</h3>
                <p class="question-description">${question.description || ''}</p>
                
                ${inputHTML}
                
                <div class="question-hints hidden" id="hintsPanel">
                    <div class="hints-header">
                        <h4><i class="ri-lightbulb-line"></i> Pistas</h4>
                        <span class="hints-counter">Usadas: <span id="hintsUsed">0</span>/${question.hints?.length || 0}</span>
                    </div>
                    <div id="hintsContent"></div>
                </div>
                
                <div class="question-explanation hidden" id="explanationPanel">
                    <h4>✅ Explicación</h4>
                    <p>${question.explanation}</p>
                </div>
                
                <div class="question-actions">
                    <button class="btn btn-secondary" id="btnShowHint" onclick="missionSystem.showHint()">
                        <i class="ri-lightbulb-line"></i> Pista
                    </button>
                    <button class="btn btn-primary" id="btnSubmitAnswer" onclick="missionSystem.submitAnswer()">
                        Enviar Respuesta
                    </button>
                    <button class="btn btn-success hidden" id="btnNextQuestion" onclick="missionSystem.nextQuestion()">
                        Siguiente →
                    </button>
                </div>
            </div>
        `;

        // Reset hints counter
        this.hintsUsedForQuestion = 0;
    }

    // ========================================================
    // GRÁFICOS
    // ========================================================

    initMissionChart() {
        const mission = this.currentMission;
        const config = mission.chartConfig;

        // Contenedor principal del gráfico/visualización
        const chartWrapper = document.querySelector('.mission-chart-wrapper');
        if (!chartWrapper) return;

        // Limpiar visualización previa (HTML o Canvas)
        this.clearMissionVisual(chartWrapper);

        // Si es tipo visualización HTML (Misión 7 y dashboards)
        if (['business_kpis', 'strategic_roadmap', 'comparison_dashboard'].includes(config.type)) {
            this.renderHtmlVisual(chartWrapper, config);
            return;
        }

        // Si es gráfico Chart.js
        const ctx = this.createCanvas(chartWrapper);
        if (!ctx) return;

        const dataset = allDatasets[mission.dataset]; // dataset principal
        if (!dataset && !config.data) return; // Validación básica

        let chartData = { labels: [], datasets: [] };
        let chartOptions = this.getBaseChartOptions(config);

        // ============================================================
        // LÓGICA POR TIPO DE GRÁFICO
        // ============================================================

        switch (config.type) {
            case 'line':
                // Misión 1: Línea simple
                chartData.labels = dataset.dates;
                chartData.datasets.push({
                    label: dataset.variable,
                    data: dataset.values,
                    borderColor: config.color,
                    backgroundColor: config.color.replace(')', ', 0.1)').replace('rgb', 'rgba').replace('#', 'rgba(102, 126, 234, 0.1)'), // Hack color
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: false
                });
                break;

            case 'bar':
                // Misión 2: Patrón Semanal
                chartData.labels = config.labels;
                const weeklyValues = Object.values(dataset.weeklyPattern);
                chartData.datasets.push({
                    label: 'Ventas Promedio',
                    data: weeklyValues,
                    backgroundColor: config.labels.map((_, i) => i === 5 ? '#4ade80' : 'rgba(102, 126, 234, 0.6)'), // Sábado verde
                    borderColor: config.labels.map((_, i) => i === 5 ? '#22c55e' : '#667eea'),
                    borderWidth: 1
                });
                // Plugin datalabels para ver valores
                chartOptions.plugins.datalabels = {
                    anchor: 'end',
                    align: 'top',
                    color: '#fff',
                    font: { weight: 'bold' },
                    formatter: (value) => numeral(value).format('0.0a')
                };
                chartOptions.scales.y.suggestedMax = Math.max(...weeklyValues) * 1.2;
                break;

            case 'scatter_anomaly':
                // Misión 3: Anomalías
                chartData.labels = dataset.dates;
                const pointColors = dataset.values.map((v, i) => {
                    const date = dataset.dates[i];
                    const anomaly = config.anomalies.find(a => a.date === date);
                    return anomaly ? anomaly.color : config.color || '#667eea';
                });

                const pointRadii = dataset.values.map((v, i) => {
                    const date = dataset.dates[i];
                    return config.anomalies.find(a => a.date === date) ? 6 : 2;
                });

                chartData.datasets.push({
                    label: dataset.variable,
                    data: dataset.values,
                    borderColor: 'rgba(102, 126, 234, 0.3)', // Línea tenue
                    backgroundColor: pointColors,
                    pointBackgroundColor: pointColors,
                    pointRadius: pointRadii,
                    borderWidth: 1,
                    showLine: true // Scatter conectado
                });

                // Anotaciones para anomalías
                chartOptions.plugins.annotation = {
                    annotations: config.anomalies.map(ano => ({
                        type: 'label',
                        xValue: ano.date,
                        yValue: ano.value, // Posición un poco arriba
                        content: [ano.label],
                        font: { size: 10 },
                        color: ano.color,
                        position: 'start',
                        yAdjust: -10
                    }))
                };
                break;

            case 'line_area':
                // Misión 4: SaaS
                chartData.labels = dataset.dates;
                chartData.datasets.push({
                    label: dataset.variable,
                    data: dataset.values,
                    borderColor: config.color,
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                });
                break;

            case 'line_with_highlights':
                // Misión 5: E-commerce Picos
                chartData.labels = dataset.dates;
                // Mapear colores de puntos según eventos
                const highlightColors = dataset.values.map((v, i) => {
                    const date = dataset.dates[i];
                    const highlight = config.highlights.find(h => h.date === date);
                    return highlight ? highlight.color : 'rgba(102, 126, 234, 0.5)';
                });

                const highlightRadius = dataset.values.map((v, i) => {
                    const date = dataset.dates[i];
                    return config.highlights.find(h => h.date === date) ? 6 : 0;
                });

                chartData.datasets.push({
                    label: dataset.variable,
                    data: dataset.values,
                    borderColor: '#667eea',
                    pointBackgroundColor: highlightColors,
                    pointRadius: highlightRadius,
                    tension: 0.2
                });

                // Anotaciones
                chartOptions.plugins.annotation = {
                    annotations: config.highlights.map(h => ({
                        type: 'label',
                        xValue: h.date,
                        yValue: 'center', // Centrado o en el valor
                        content: h.label,
                        font: { size: 10 },
                        color: h.color,
                        position: 'start',
                        yAdjust: -20
                    }))
                };
                break;

            case 'line_with_forecast':
                // Misión 6: Forecasting
                // Dataset Real (hasta Octubre/Nov)
                // Cortamos datos para simular 'hoy'
                const cutOffIndex = dataset.dates.indexOf('2022-10-31');
                const realDates = dataset.dates.slice(0, cutOffIndex + 1);
                const realValues = dataset.values.slice(0, cutOffIndex + 1);

                // Forecast (Nov-Dic)
                // Generamos proyección lineal simple
                const forecastDates = ['2022-10-31', ...dataset.dates.slice(cutOffIndex + 1)]; // Conectar con último punto
                const lastRealVal = realValues[realValues.length - 1];

                // Generar datos ficticios de proyección lineal perfecta
                const forecastValues = [lastRealVal];
                for (let i = 1; i < forecastDates.length; i++) {
                    forecastValues.push(lastRealVal + (i * 54)); // +54 diario (tendencia)
                }

                chartData.labels = dataset.dates; // Eje X completo

                chartData.datasets.push({
                    label: 'Ventas Reales',
                    data: realValues, // Chart.js rellenará el resto con null si labels es más largo
                    borderColor: '#667eea',
                    tension: 0.3
                });

                chartData.datasets.push({
                    label: 'Proyección (Tendencia)',
                    data: new Array(realValues.length - 1).fill(null).concat(forecastValues), // Padding nulls
                    borderColor: '#fbbf24', // Amarillo
                    borderDash: [5, 5],
                    pointRadius: 0
                });
                break;
        }

        // Renderizar Chart
        this.missionChart = new Chart(ctx, {
            type: config.type.includes('scatter') || config.type.includes('line') ? 'line' : config.type,
            data: chartData,
            options: chartOptions
        });
    }

    // Helpers para visualización
    clearMissionVisual(wrapper) {
        if (this.missionChart) {
            this.missionChart.destroy();
            this.missionChart = null;
        }
        wrapper.innerHTML = ''; // Limpiar todo (canvas o html previo)
    }

    createCanvas(wrapper) {
        const canvas = document.createElement('canvas');
        canvas.id = 'missionChart';
        wrapper.appendChild(canvas);
        return canvas;
    }

    getBaseChartOptions(config) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, labels: { color: '#ccc' } },
                tooltip: { mode: 'index', intersect: false },
                annotation: { annotations: [] } // Inicializar vacío
            },
            scales: {
                x: { ticks: { color: '#888' }, grid: { color: '#333' } },
                y: { ticks: { color: '#888' }, grid: { color: '#333' } }
            }
        };
    }

    renderHtmlVisual(wrapper, config) {
        let html = '';

        if (config.type === 'comparison_dashboard') {
            html = `
                <div class="dashboard-grid">
                    <div class="mini-chart-card">
                        <h4>Retail</h4>
                        <div class="mini-viz retail-pattern"></div>
                        <p>Estacional + Anomalías</p>
                    </div>
                    <div class="mini-chart-card">
                        <h4>SaaS</h4>
                        <div class="mini-viz saas-pattern"></div>
                        <p>Lineal / Suave</p>
                    </div>
                    <div class="mini-chart-card">
                        <h4>E-commerce</h4>
                        <div class="mini-viz ecom-pattern"></div>
                        <p>Picos Extremos</p>
                    </div>
                </div>
                <style>
                    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; height: 100%; }
                    .mini-chart-card { background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; text-align: center; display: flex; flex-direction: column; }
                    .mini-viz { flex: 1; margin: 10px 0; background-size: cover; opacity: 0.8; border-radius: 4px; }
                    .retail-pattern { background: linear-gradient(to right, transparent 0%, #667eea 20%, transparent 40%, #667eea 60%, transparent 80%); }
                    .saas-pattern { background: linear-gradient(45deg, transparent, #667eea); }
                    .ecom-pattern { background: linear-gradient(to right, transparent 0%, transparent 80%, #ff0000 90%, transparent 100%); }
                </style>
            `;
        } else if (config.type === 'business_kpis') {
            html = `
                <div class="kpi-container">
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="ri-store-2-line"></i></div>
                        <h3>Retail KPI</h3>
                        <div class="kpi-value text-red">Rotación Stock</div>
                        <p>Crítico por estacionalidad semanal</p>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="ri-cloud-line"></i></div>
                        <h3>SaaS KPI</h3>
                        <div class="kpi-value text-blue">Churn Rate</div>
                        <p>Crítico para modelo recurrente</p>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="ri-shopping-cart-line"></i></div>
                        <h3>E-com KPI</h3>
                        <div class="kpi-value text-green">Conversión</div>
                        <p>Crítico durante picos de tráfico</p>
                    </div>
                </div>
                <style>
                    .kpi-container { display: flex; justify-content: space-around; align-items: center; height: 100%; gap: 1rem; }
                    .kpi-card { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; text-align: center; width: 30%; border: 1px solid rgba(255,255,255,0.1); }
                    .kpi-icon { font-size: 2rem; margin-bottom: 0.5rem; color: #667eea; }
                    .kpi-value { font-size: 1.2rem; font-weight: bold; margin: 0.5rem 0; }
                    .text-red { color: #f87171; } .text-blue { color: #60a5fa; } .text-green { color: #4ade80; }
                </style>
            `;
        } else if (config.type === 'strategic_roadmap') {
            html = `
                <div class="roadmap-table-container">
                    <table class="roadmap-table">
                        <thead>
                            <tr>
                                <th>Q</th>
                                <th>Retail 🏪</th>
                                <th>SaaS ☁️</th>
                                <th>E-commerce 🛒</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Q1</td>
                                <td>Limpieza Stock</td>
                                <td><strong>Onboarding 🚀</strong></td>
                                <td>SEO / Contenido</td>
                            </tr>
                            <tr>
                                <td>Q2</td>
                                <td>Planificación</td>
                                <td>Features Nuevas</td>
                                <td>Prep. Prime Day</td>
                            </tr>
                            <tr>
                                <td>Q3</td>
                                <td>Compras Navidad</td>
                                <td>Enterprise Sales</td>
                                <td>Campañas Ads</td>
                            </tr>
                            <tr>
                                <td>Q4</td>
                                <td><strong>VENTA TOTAL 💰</strong></td>
                                <td>Retención</td>
                                <td><strong>BLACK FRIDAY 🔥</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <style>
                    .roadmap-table-container { height: 100%; overflow: auto; padding: 10px; }
                    .roadmap-table { width: 100%; border-collapse: collapse; color: #eee; font-size: 0.9rem; }
                    .roadmap-table th, .roadmap-table td { border: 1px solid #444; padding: 10px; text-align: center; }
                    .roadmap-table th { background: rgba(102, 126, 234, 0.2); }
                    strong { color: #fbbf24; }
                </style>
            `;
        }

        wrapper.innerHTML = html;
    }

    // ========================================================
    // PISTAS
    // ========================================================

    showHint() {
        const question = this.currentMission.questions[this.currentQuestionIndex];
        if (!question.hints || this.hintsUsedForQuestion >= question.hints.length) {
            return;
        }

        const hintsPanel = document.getElementById('hintsPanel');
        const hintsContent = document.getElementById('hintsContent');
        const hintsUsed = document.getElementById('hintsUsed');

        hintsPanel?.classList.remove('hidden');

        const hintIndex = this.hintsUsedForQuestion;
        const hint = question.hints[hintIndex];

        hintsContent.innerHTML += `
            <div class="hint-item" style="animation: slideIn 0.3s ease;">
                <span class="hint-level">Pista ${hintIndex + 1}</span>
                <p>${hint}</p>
            </div>
        `;

        this.hintsUsedForQuestion++;
        if (hintsUsed) hintsUsed.textContent = this.hintsUsedForQuestion;

        // Desactivar botón si no hay más pistas
        if (this.hintsUsedForQuestion >= question.hints.length) {
            document.getElementById('btnShowHint')?.setAttribute('disabled', 'true');
        }

        // Registrar uso de pista (penalización XP)
        if (!this.missionAnswers[question.id]) {
            this.missionAnswers[question.id] = { hintsUsed: 0 };
        }
        this.missionAnswers[question.id].hintsUsed++;
    }

    // ========================================================
    // ENVIAR RESPUESTA
    // ========================================================

    submitAnswer() {
        const question = this.currentMission.questions[this.currentQuestionIndex];
        let userAnswer;

        switch (question.type) {
            case 'select':
                const selected = document.querySelector('input[name="answer"]:checked');
                userAnswer = selected?.value;
                break;
            case 'number':
                userAnswer = parseFloat(document.getElementById('numberAnswer')?.value);
                break;
            case 'text':
                userAnswer = document.getElementById('textAnswer')?.value?.toLowerCase().trim();
                break;
        }

        if (userAnswer === undefined || userAnswer === '' || (typeof userAnswer === 'number' && isNaN(userAnswer))) {
            alert('Por favor, selecciona o ingresa una respuesta.');
            return;
        }

        const isCorrect = this.checkAnswer(question, userAnswer);

        // Guardar respuesta
        if (!this.missionAnswers[question.id]) {
            this.missionAnswers[question.id] = { hintsUsed: 0 };
        }
        this.missionAnswers[question.id].answer = userAnswer;
        this.missionAnswers[question.id].correct = isCorrect;

        // Mostrar feedback
        this.showAnswerFeedback(isCorrect, question);
    }

    checkAnswer(question, userAnswer) {
        switch (question.type) {
            case 'select':
                return userAnswer === question.correctAnswer;
            case 'number':
                if (question.acceptedRange) {
                    return userAnswer >= question.acceptedRange[0] && userAnswer <= question.acceptedRange[1];
                }
                return userAnswer === question.correctAnswer;
            case 'text':
                if (question.correctAnswers) {
                    return question.correctAnswers.some(ans =>
                        userAnswer.includes(ans.toLowerCase())
                    );
                }
                return userAnswer === question.correctAnswer?.toLowerCase();
            default:
                return false;
        }
    }

    showAnswerFeedback(isCorrect, question) {
        const explanationPanel = document.getElementById('explanationPanel');
        const btnSubmit = document.getElementById('btnSubmitAnswer');
        const btnNext = document.getElementById('btnNextQuestion');
        const btnHint = document.getElementById('btnShowHint');

        // Limpiar clases previas
        explanationPanel?.classList.remove('hidden', 'feedback-correct', 'feedback-incorrect');
        explanationPanel?.style.removeProperty('background');
        explanationPanel?.style.removeProperty('border-color');

        // Mostrar panel
        explanationPanel?.classList.remove('hidden');

        if (isCorrect) {
            // Correcto
            explanationPanel?.classList.add('feedback-correct');
            explanationPanel.querySelector('h4').innerHTML = '<i class="ri-checkbox-circle-line"></i> Correcto';

            // Confetti
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { y: 0.7 }
                });
            }

            // Sound
            if (typeof soundManager !== 'undefined') {
                soundManager.play('success');
            }
        } else {
            // Incorrecto
            explanationPanel?.classList.add('feedback-incorrect');
            explanationPanel.querySelector('h4').innerHTML = '<i class="ri-close-circle-line"></i> Incorrecto';

            // Animation shake
            if (typeof anime !== 'undefined') {
                anime({
                    targets: '.question-card',
                    translateX: [-5, 5, -5, 5, 0],
                    duration: 400
                });
            }

            // Sound
            if (typeof soundManager !== 'undefined') {
                soundManager.play('error');
            }
        }

        // Ocultar botones de envío, mostrar siguiente
        btnSubmit?.classList.add('hidden');
        btnHint?.classList.add('hidden');
        btnNext?.classList.remove('hidden');

        // Si es la última pregunta, cambiar texto
        if (this.currentQuestionIndex >= this.currentMission.questions.length - 1) {
            if (btnNext) btnNext.textContent = 'Finalizar Misión 🎉';
        }
    }

    // ========================================================
    // SIGUIENTE PREGUNTA
    // ========================================================

    nextQuestion() {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex >= this.currentMission.questions.length) {
            // Misión completada
            this.completeMission();
        } else {
            // Siguiente pregunta
            this.updateQuestionProgress();
            this.renderCurrentQuestion();
        }
    }

    // ========================================================
    // COMPLETAR MISIÓN
    // ========================================================

    completeMission() {
        const mission = this.currentMission;

        // Calcular XP ganado
        let xpEarned = mission.xpReward;
        let correctAnswers = 0;
        let totalHints = 0;

        for (const questionId in this.missionAnswers) {
            const answer = this.missionAnswers[questionId];
            if (answer.correct) correctAnswers++;
            totalHints += answer.hintsUsed || 0;
        }

        // Penalización por pistas (10% por pista)
        const hintPenalty = Math.min(totalHints * 0.1, 0.5);
        xpEarned = Math.round(xpEarned * (1 - hintPenalty));

        // Penalización por respuestas incorrectas
        const correctRatio = correctAnswers / mission.questions.length;
        xpEarned = Math.round(xpEarned * correctRatio);

        // Determinamos si aprobó (Mínimo 60% de aciertos)
        const isSuccess = correctRatio >= 0.6;

        if (isSuccess) {
            // Actualizar estado solo si aprobó
            if (!this.playerState.completedMissions.includes(mission.id)) {
                this.playerState.completedMissions.push(mission.id);
            }

            // Solo sumar XP si es mejor que el anterior
            const previousScore = this.playerState.missionScores[mission.id] || 0;
            if (xpEarned > previousScore) {
                this.playerState.totalXP += (xpEarned - previousScore);
                this.playerState.missionScores[mission.id] = xpEarned;
            }

            // Desbloquear siguiente misión
            if (mission.reward.unlock && !this.playerState.unlockedMissions.includes(mission.reward.unlock)) {
                this.playerState.unlockedMissions.push(mission.reward.unlock);
            }

            // Achievement
            const achievementId = mission.id;
            if (!this.playerState.achievements.includes(achievementId)) {
                this.playerState.achievements.push(achievementId);
            }

            // Guardar
            this.savePlayerState();
        }

        // Mostrar modal de completado o fallido
        this.showMissionCompleteModal(mission, xpEarned, correctAnswers, isSuccess);
    }

    showMissionCompleteModal(mission, xpEarned, correctAnswers, isSuccess) {
        const modal = document.getElementById('missionCompleteModal');
        if (!modal) return;

        const titleEl = document.getElementById('completeMissionTitle');
        const nextBtn = document.getElementById('btnNextMission');
        const iconEl = document.getElementById('completeAchievementIcon');
        const descEl = document.getElementById('completeAchievementDesc');
        const nameEl = document.getElementById('completeAchievementName');

        document.getElementById('completeTotalXP').textContent = this.playerState.totalXP;
        document.getElementById('completeCorrectAnswers').textContent =
            `${correctAnswers}/${mission.questions.length}`;

        if (isSuccess) {
            // ÉXITO
            titleEl.textContent = `¡${mission.title} Completada!`;
            titleEl.style.color = 'var(--success)';
            document.getElementById('completeXPEarned').textContent = `+${xpEarned} XP`;

            // Achievement
            const achievement = achievements.find(a => a.mission === mission.id);
            if (achievement) {
                iconEl.innerHTML = achievement.icon;
                nameEl.textContent = achievement.name;
                descEl.textContent = achievement.desc;
                // Estilo normal de éxito
                document.querySelector('.complete-achievement').style.opacity = '1';
                document.querySelector('.complete-achievement').style.filter = 'none';
            }

            // Next mission button configuration
            if (nextBtn) {
                nextBtn.classList.remove('hidden');
                // Remover listeners anteriores para evitar duplicados si se re-renderiza
                const newBtn = nextBtn.cloneNode(true);
                nextBtn.parentNode.replaceChild(newBtn, nextBtn);

                if (mission.id < 7) {
                    newBtn.textContent = `Misión ${mission.id + 1} →`;
                    newBtn.onclick = () => {
                        modal.classList.remove('active');
                        if (this.currentMission.id + 1 <= 7) {
                            this.startMission(this.currentMission.id + 1);
                        } else {
                            this.showNameModal();
                        }
                    };
                } else {
                    newBtn.textContent = '🎓 ¡Campaña Completada!';
                    newBtn.onclick = () => {
                        this.finishCampaign();
                    };
                }
            }

            // Celebration
            if (typeof confetti !== 'undefined') {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }

            if (typeof soundManager !== 'undefined') soundManager.play('complete');

        } else {
            // FALLO
            titleEl.textContent = 'Misión Fallida';
            titleEl.style.color = '#ef4444';
            document.getElementById('completeXPEarned').textContent = '+0 XP';

            // Achievement visual feedback (Locked/Grayed out)
            if (iconEl) iconEl.innerHTML = '<i class="ri-lock-line"></i>';
            if (nameEl) nameEl.textContent = 'Logro Bloqueado';
            if (descEl) descEl.textContent = 'Necesitas al menos 60% de aciertos.';

            document.querySelector('.complete-achievement').style.opacity = '0.7';
            document.querySelector('.complete-achievement').style.filter = 'grayscale(100%)';

            // Configure button for Retry
            if (nextBtn) {
                const newBtn = nextBtn.cloneNode(true);
                nextBtn.parentNode.replaceChild(newBtn, nextBtn);

                newBtn.textContent = '🔄 Intentar de nuevo';
                newBtn.classList.remove('hidden');
                newBtn.onclick = () => {
                    modal.classList.remove('active');
                    this.startMission(mission.id); // Restart current
                };
            }

            if (typeof soundManager !== 'undefined') soundManager.play('error');
        }

        modal.classList.add('active');
    }

    // ========================================================
    // FINALIZACIÓN DE CAMPAÑA
    // ========================================================


    showNameModal() {
        const modal = document.getElementById('nameModal');
        if (modal) modal.classList.add('active');
    }

    saveScoreAndFinish() {
        const nameInput = document.getElementById('playerNameInput');
        const name = nameInput?.value?.trim() || 'Detective Anónimo';

        this.playerState.playerName = name;
        this.savePlayerState();

        document.getElementById('nameModal')?.classList.remove('active');
        this.finishCampaign();
    }

    finishCampaign() {
        const playerName = this.playerState.playerName || 'Detective';
        const rank = this.getCurrentRank().name;
        const date = new Date().toLocaleDateString();

        if (typeof certificateSystem !== 'undefined') {
            certificateSystem.generate(playerName, rank, date);
        } else {
            alert('¡Campaña Completada! Felicitaciones.');
        }

        // Confetti extra
        if (typeof confetti !== 'undefined') {
            var duration = 3 * 1000;
            var animationEnd = Date.now() + duration;
            var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            var random = function (min, max) {
                return Math.random() * (max - min) + min;
            }

            var interval = setInterval(function () {
                var timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                var particleCount = 50 * (timeLeft / duration);
                // since particles fall down, start a bit higher than random
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }

        this.showMissionSelect();
    }

    // ========================================================
    // RESET (para testing)
    // ========================================================

    resetProgress() {
        if (confirm('¿Seguro que quieres reiniciar todo el progreso?')) {
            localStorage.removeItem(this.storageKey);
            this.playerState = this.loadPlayerState();
            this.showMissionSelect();
        }
    }
}

// Instancia global
let missionSystem;
