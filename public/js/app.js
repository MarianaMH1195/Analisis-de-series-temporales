/**
 * Detective de Datos
 * Main Application Logic
 */

// ==========================================
// 1. STATE & CONFIGURATION
// ==========================================

const SETTINGS_KEY = 'detective_settings';
const GAME_KEY = 'detective_v3';

const settings = {
    soundEnabled: true,
    darkMode: true,
    ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
};

// Data Containers
const retailData = { dates: [], values: [] };
const saasData = { months: [], values: [] };
const ecommerceData = { dates: [], values: [] };
const weeklyAverages = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    values: [14800, 15100, 14950, 15300, 15500, 16100, 14200]
};

let gameState = {
    totalXP: 0,
    completedMissions: [],
    unlockedMissions: [1],
    currentMission: null,
    currentQuestionIndex: 0,
    answers: {},
    hintsUsed: 0,
    chart: null,
    ...JSON.parse(localStorage.getItem(GAME_KEY) || '{}')
};

// Audio Context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Accessibility
const announcer = document.createElement('div');
Object.assign(announcer.style, {
    position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap'
});
announcer.setAttribute('aria-live', 'polite');
document.body.appendChild(announcer);

// ==========================================
// 2. MISSIONS CONFIGURATION
// ==========================================

const missions = [
    {
        id: 1,
        title: "Tendencia Retail",
        subtitle: "Toma de decisiones basada en tendencias",
        difficulty: 1,
        xp: 100,
        questions: [
            {
                id: "m1_q1",
                type: "select",
                title: "Si esta tendencia continúa, ¿qué decisión estratégica deberías tomar para el siguiente trimestre?",
                chartType: "line",
                chartConfig: {
                    title: "Ventas Diarias 2022 - ChainMart Retail",
                    labels: retailData.dates,
                    data: retailData.values,
                    color: "#667eea"
                },
                options: [
                    { value: "up", text: "📈 Aumentar inventario y personal" },
                    { value: "down", text: "📉 Reducir costos y stock" },
                    { value: "stable", text: "➡️ Mantener operación actual" }
                ],
                correct: "up",
                explanation: "La tendencia es claramente creciente (+265%). Se justifica aumentar inventario y personal.",
                hints: ["Mira el inicio vs el final del gráfico", "¿La línea sube o baja en general?"]
            }
        ]
    },
    {
        id: 2,
        title: "Estacionalidad Semanal",
        subtitle: "Identifica patrones recurrentes",
        difficulty: 2,
        xp: 150,
        questions: [
            {
                id: "m2_q1",
                type: "number",
                title: "¿Cada cuántos días ocurre el pico máximo de ventas?",
                chartType: "bar",
                chartConfig: {
                    title: "Patrón de Ventas (3 Semanas)",
                    labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D', 'L', 'M', 'X', 'J', 'V', 'S', 'D', 'L', 'M', 'X', 'J', 'V', 'S', 'D'],
                    data: [], // Populated at runtime
                    colors: [] // Populated at runtime
                },
                correct: 7,
                validationType: "exact",
                explanation: "El pico se repite cada 7 días, indicando un patrón semanal típico del retail.",
                hints: ["Cuenta la distancia entre las barras verdes (picos)"]
            },
            {
                id: "m2_q2",
                type: "select",
                title: "¿Qué día deberías concentrar promociones especiales?",
                chartType: "bar",
                chartConfig: {
                    title: "Promedio de Ventas por Día",
                    labels: weeklyAverages.labels,
                    data: weeklyAverages.values,
                    colors: ['#667eea', '#667eea', '#667eea', '#667eea', '#667eea', '#4ade80', '#667eea']
                },
                options: [
                    { value: "lun", text: "Lunes" },
                    { value: "vie", text: "Viernes" },
                    { value: "sab", text: "Sábado" },
                    { value: "dom", text: "Domingo" }
                ],
                correct: "sab",
                explanation: "El sábado tiene el promedio más alto (16.1K), ideal para maximizar el impacto de promociones.",
                hints: ["Busca la barra más alta"]
            }
        ]
    },
    {
        id: 3,
        title: "Cazador de Anomalías",
        subtitle: "Detecta eventos fuerza mayor",
        difficulty: 2,
        xp: 150,
        questions: [
            {
                id: "m3_q1",
                type: "number",
                title: "¿Cuántas anomalías detectas en la serie?",
                chartType: "scatter_anomaly",
                chartConfig: {
                    title: "Anomalías en la Serie Temporal",
                    labels: retailData.dates,
                    data: retailData.values,
                    anomalies: [
                        { index: 0, label: "Año Nuevo", color: "#ff0000", type: "caída" },
                        { index: 120, label: "Día Trabajo", color: "#ff0000", type: "caída" },
                        { index: 121, label: "Puente", color: "#ff0000", type: "caída" },
                        { index: 303, label: "Halloween", color: "#00ff00", type: "pico" }
                    ]
                },
                correct: 4,
                validationType: "exact",
                explanation: "Hay 4 anomalías: 3 caídas por festivos y 1 pico comercial.",
                hints: ["Busca puntos que se alejan significativamente de la tendencia"]
            },
            {
                id: "m3_q2",
                type: "select",
                title: "¿Cuál evento causó la MAYOR CAÍDA?",
                chartType: "bar_events",
                chartConfig: {
                    title: "Impacto de Eventos (% de Cambio)",
                    labels: ["Año Nuevo", "Día Trabajo", "Puente", "Halloween"],
                    data: [-58, -11, -12, +50],
                    colors: ["#8B0000", "#FFA500", "#FFA500", "#00AA00"]
                },
                options: [
                    { value: "newyear", text: "Año Nuevo (-58%)" },
                    { value: "labor", text: "Día del Trabajo (-11%)" },
                    { value: "halloween", text: "Halloween (+50%)" }
                ],
                correct: "newyear",
                explanation: "Año Nuevo causó una caída del 58% debido al cierre de tiendas.",
                hints: ["Busca la barra más negativa"]
            }
        ]
    },
    {
        id: 4,
        title: "Analista SaaS",
        subtitle: "Métricas de crecimiento B2B",
        difficulty: 3,
        xp: 200,
        questions: [
            {
                id: "m4_q1",
                type: "select",
                title: "¿Cuál es el patrón de crecimiento de usuarios?",
                chartType: "line",
                chartConfig: {
                    title: "MAU (Monthly Active Users) 2023",
                    labels: saasData.months,
                    data: saasData.values,
                    color: "#4ade80",
                    smooth: true
                },
                options: [
                    { value: "linear", text: "📈 Crecimiento Lineal" },
                    { value: "exponential", text: "🚀 Crecimiento Exponencial" },
                    { value: "decline", text: "📉 Declive" }
                ],
                correct: "linear",
                explanation: "El crecimiento es lineal y estable, típico de SaaS B2B maduro.",
                hints: ["¿La velocidad de crecimiento cambia o es constante?"]
            },
            {
                id: "m4_q2",
                type: "number",
                title: "¿Cuál fue el % de crecimiento Ene→Dic?",
                chartType: "bar",
                chartConfig: {
                    title: "Crecimiento de Usuarios",
                    labels: saasData.months,
                    data: saasData.values,
                    colors: saasData.values.map(() => "#4ade80"),
                    showValues: true
                },
                correct: 130,
                range: [125, 135],
                explanation: "El crecimiento fue del 130% (de 8.2K a 18.9K). Meta superada.",
                hints: ["(Valor Final - Valor Inicial) / Valor Inicial × 100"]
            }
        ]
    },
    {
        id: 5,
        title: "E-commerce Volátil",
        subtitle: "Gestión de inventario y picos",
        difficulty: 3,
        xp: 250,
        questions: [
            {
                id: "m5_q1",
                type: "select",
                title: "¿Cuál es la característica principal del tráfico para gestión de stock?",
                chartType: "line",
                chartConfig: {
                    title: "Tráfico Web Diario 2023",
                    labels: ecommerceData.dates,
                    data: ecommerceData.values,
                    color: "#0066ff"
                },
                options: [
                    { value: "stable", text: "Estable" },
                    { value: "volatile", text: "📈 Alta volatilidad" },
                    { value: "decline", text: "Declive gradual" }
                ],
                correct: "volatile",
                explanation: "La alta volatilidad complica el inventario, requiriendo stock de seguridad para los picos.",
                hints: ["¿La línea es suave o parece una montaña rusa?"]
            },
            {
                id: "m5_q2",
                type: "select",
                title: "¿En qué trimestre se concentra el mayor riesgo operativo?",
                chartType: "line_zones",
                chartConfig: {
                    title: "Tráfico por Trimestre",
                    labels: ecommerceData.dates,
                    data: ecommerceData.values,
                    zones: [
                        { start: 0, end: 90, color: "rgba(100,100,255,0.1)", label: "Q1" },
                        { start: 91, end: 181, color: "rgba(100,100,255,0.15)", label: "Q2" },
                        { start: 182, end: 273, color: "rgba(100,100,255,0.2)", label: "Q3" },
                        { start: 274, end: 364, color: "rgba(255,100,100,0.3)", label: "Q4" }
                    ]
                },
                options: [
                    { value: "q1", text: "Q1 (Ene-Mar)" },
                    { value: "q2", text: "Q2 (Abr-Jun)" },
                    { value: "q4", text: "Q4 (Oct-Dic)" }
                ],
                correct: "q4",
                explanation: "Q4 es crítico por Black Friday y Navidad. Un fallo aquí es costoso.",
                hints: ["¿Qué zona tiene los picos más altos?"]
            },
            {
                id: "m5_q3",
                type: "number",
                title: "¿Cuántos eventos superan el umbral crítico (>160% promedio)?",
                chartType: "bar_events",
                chartConfig: {
                    title: "Picos vs Umbral Crítico",
                    labels: ["Valentine's", "Prime Day", "Black Friday", "Cyber Monday", "Navidad"],
                    data: [150, 140, 185, 170, 145],
                    colors: ["#ffaa00", "#ffaa00", "#ff0000", "#ff0000", "#ffaa00"],
                    threshold: 160,
                    showThresholdLine: true
                },
                correct: 2,
                validationType: "exact",
                explanation: "Black Friday y Cyber Monday superan el umbral.",
                hints: ["Cuenta las barras rojas que cruzan la línea"]
            }
        ]
    },
    {
        id: 6,
        title: "Profeta de Datos",
        subtitle: "Proyección financiera",
        difficulty: 4,
        xp: 300,
        questions: [
            {
                id: "m6_q1",
                type: "number",
                title: "¿Promedio esperado para Noviembre 2022? (en miles)",
                chartType: "line_forecast",
                chartConfig: {
                    title: "Proyección Noviembre",
                    labels: retailData.dates,
                    data: retailData.values,
                    forecastStart: 304,
                    forecastDays: 30
                },
                correct: 24,
                range: [23, 26],
                explanation: "Siguiendo la tendencia lineal, se espera un promedio de ~24K.",
                hints: ["Sigue la línea punteada amarilla"]
            },
            {
                id: "m6_q2",
                type: "select",
                title: "Si Navidad añade +20% a la base de ~25K, ¿qué proyección presentar?",
                chartType: "line_forecast",
                chartConfig: {
                    title: "Proyección con Efecto Navidad",
                    labels: retailData.dates,
                    data: retailData.values,
                    forecastStart: 304,
                    forecastDays: 60,
                    navidad: true
                },
                options: [
                    { value: "26", text: "~26K" },
                    { value: "30", text: "~30K" },
                    { value: "35", text: "~35K" }
                ],
                correct: "30",
                explanation: "25K base + 20% = 30K.",
                hints: ["25,000 + 20%"]
            }
        ]
    },
    {
        id: 7,
        title: "Senior Analyst",
        subtitle: "Estrategia de portafolio",
        difficulty: 5,
        xp: 500,
        questions: [
            {
                id: "m7_q1",
                type: "select",
                title: "¿Qué industria es más predecible?",
                chartType: "dashboard",
                chartConfig: { title: "Comparativo de Industrias" },
                options: [
                    { value: "retail", text: "Retail" },
                    { value: "saas", text: "SaaS" },
                    { value: "ecom", text: "E-commerce" }
                ],
                correct: "saas",
                explanation: "SaaS muestra el crecimiento más estable y predecible.",
                hints: ["Busca la línea más suave"]
            },
            {
                id: "m7_q2",
                type: "select",
                title: "¿Qué industria necesita mayor buffer de inventario?",
                chartType: "bar",
                chartConfig: {
                    title: "Volatilidad por Industria",
                    labels: ['Retail', 'SaaS', 'E-commerce'],
                    data: [13, 5, 45],
                    colors: ['#667eea', '#4ade80', '#ff6b6b']
                },
                options: [
                    { value: "retail", text: "Retail" },
                    { value: "saas", text: "SaaS" },
                    { value: "ecom", text: "E-commerce" }
                ],
                correct: "ecom",
                explanation: "E-commerce, por su alta volatilidad (45%).",
                hints: ["Barra más alta en volatilidad"]
            },
            {
                id: "m7_q3",
                type: "select",
                title: "¿Qué industria tuvo el mayor crecimiento total?",
                chartType: "bar",
                chartConfig: {
                    title: "Crecimiento Anual Total (%)",
                    labels: ['Retail', 'SaaS', 'E-commerce'],
                    data: [265, 130, 320],
                    colors: ['#667eea', '#4ade80', '#ff6b6b']
                },
                options: [
                    { value: "retail", text: "Retail" },
                    { value: "saas", text: "SaaS" },
                    { value: "ecom", text: "E-commerce" }
                ],
                correct: "ecom",
                explanation: "E-commerce creció un 320%, superando a las demás.",
                hints: ["Barra más alta en crecimiento"]
            }
        ]
    }
];

// ==========================================
// 3. INITIALIZATION & EVENTS
// ==========================================

(async function initGame() {
    setupEventListeners();
    await loadData();
    updateUI();
    console.log('Detective de Datos: Iniciado');
})();

function setupEventListeners() {
    // UI Theme & Sound
    document.getElementById('btnTheme').onclick = toggleTheme;
    document.getElementById('btnSound').onclick = toggleSound;
    document.getElementById('btnHelp').onclick = () => showModal('helpModal');

    // Config
    if (!settings.darkMode) document.body.classList.add('light-mode');
    updateConfigIcons();

    // Navigation
    document.getElementById('btnBack').onclick = confirmExitMission;

    // Certificate
    document.querySelector('#certNameInput button').onclick = generateCertificate;
    document.querySelector('#certificateModal .btn-secondary').onclick = closeCertificateModal;
    document.querySelector('#certificateModal .btn-warning').onclick = restartGame;
}

// ==========================================
// 4. CORE LOGIC
// ==========================================

async function loadData() {
    try {
        const config = await (await fetch('data/game_data_config.json')).json();

        // Parallel data fetching
        const [retail, saas, ecom] = await Promise.all([
            fetch(config.datasets.retail).then(r => r.text()).then(parseCSV),
            fetch(config.datasets.saas).then(r => r.text()).then(parseCSV),
            fetch(config.datasets.ecommerce).then(r => r.text()).then(parseCSV)
        ]);

        // Process Retail
        retail.forEach(r => {
            retailData.dates.push(r.date);
            retailData.values.push(parseInt(r.sales));
        });

        // Process SaaS
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        saas.forEach(r => {
            const d = new Date(r.date);
            saasData.months.push(months[d.getMonth()]);
            saasData.values.push(parseInt(r.users));
        });

        // Process E-commerce
        ecom.forEach(r => {
            ecommerceData.dates.push(r.date);
            ecommerceData.values.push(parseInt(r.traffic));
        });

        // Configurar datos dinámicos en Misión 2
        missions[1].questions[0].chartConfig.data = retailData.values.slice(1, 22);
        missions[1].questions[0].chartConfig.colors = retailData.values.slice(1, 22)
            .map((v, i) => (i % 7 === 5) ? '#4ade80' : '#667eea');

    } catch (e) {
        console.error("Error cargando datos:", e);
    }
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, i) => {
            obj[header] = values[i]?.trim();
            return obj;
        }, {});
    });
}

function startMission(id) {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;

    gameState.currentMission = mission;
    gameState.currentQuestionIndex = 0;
    gameState.hintsUsed = 0;

    showScreen('screenPlay');
    renderStage();
}

function checkAnswer() {
    const question = gameState.currentMission.questions[gameState.currentQuestionIndex];
    let answer, valid = false;

    // Get input based on type
    if (question.type === 'select') {
        const selected = document.querySelector('.option-btn.selected');
        if (selected) {
            answer = selected.dataset.value;
            valid = true;
        }
    } else {
        const input = document.getElementById('numberAnswer');
        if (input && input.value !== '') {
            answer = parseFloat(input.value);
            valid = true;
        }
    }

    if (!valid) return alert("Por favor, ingresa una respuesta.");

    // Validate
    let isCorrect = false;
    if (question.type === 'number') {
        if (question.validationType === 'exact') isCorrect = answer === question.correct;
        else if (question.range) isCorrect = answer >= question.range[0] && answer <= question.range[1];
        else isCorrect = answer === question.correct;
    } else {
        isCorrect = answer === question.correct;
    }

    // Update UI & Feedback
    handleFeedback(isCorrect, question);
}

function completeMission() {
    const { currentMission, completedMissions, unlockedMissions } = gameState;

    // XP Calculation
    const correctCount = Object.values(gameState.answers).filter(a => a.correct).length;
    const earnedXP = Math.round(currentMission.xp * (correctCount / currentMission.questions.length));

    // Only add XP if first time completion
    if (!completedMissions.includes(currentMission.id)) {
        gameState.totalXP += earnedXP;
        completedMissions.push(currentMission.id);
    }

    if (currentMission.id < 7 && !unlockedMissions.includes(currentMission.id + 1)) {
        unlockedMissions.push(currentMission.id + 1);
    }

    saveGame();
    updateUI();
    showCompletionModal(currentMission, earnedXP, correctCount);
}

// ==========================================
// 5. RENDERING & UI
// ==========================================

function updateUI() {
    renderMissionGrid();
    updateStats();
}

function renderMissionGrid() {
    const grid = document.getElementById('missionsGrid');
    grid.innerHTML = missions.map(m => {
        const completed = gameState.completedMissions.includes(m.id);
        const unlocked = gameState.unlockedMissions.includes(m.id);
        const status = completed ? 'completed' : (unlocked ? '' : 'locked');

        return `
        <div class="mission-card ${status}" onclick="${unlocked ? `startMission(${m.id})` : ''}">
            <span class="mission-number">Misión ${m.id}</span>
            <h3 class="mission-title">${m.title}</h3>
            <p class="mission-subtitle">${m.subtitle}</p>
            <div class="mission-meta">
                <span class="mission-stars">${'⭐'.repeat(m.difficulty)}</span>
                <span>${m.xp} XP</span>
            </div>
        </div>`;
    }).join('');
}

function renderStage() {
    const mission = gameState.currentMission;
    const question = mission.questions[gameState.currentQuestionIndex];

    // Info Header
    document.getElementById('playTitle').textContent = mission.title;
    document.getElementById('playSubtitle').textContent = mission.subtitle;
    document.getElementById('questionProgress').textContent = `Pregunta ${gameState.currentQuestionIndex + 1} de ${mission.questions.length}`;
    document.getElementById('questionTitle').textContent = question.title;

    // Reset Controls
    document.getElementById('btnSubmit').style.display = 'inline-flex';
    document.getElementById('btnNext').style.display = 'none';
    document.getElementById('explanationPanel').style.display = 'none';

    // Inputs
    const content = document.getElementById('questionContent');
    if (question.type === 'select') {
        content.innerHTML = `<div class="options-grid">${question.options.map(opt =>
            `<button class="option-btn" data-value="${opt.value}" onclick="selectOption(this)">${opt.text}</button>`
        ).join('')}</div>`;
    } else {
        content.innerHTML = `<input type="number" class="number-input" id="numberAnswer" placeholder="Respuesta...">`;
    }

    renderChart(question.chartType, question.chartConfig);
}

function renderChart(type, config) {
    const ctx = document.getElementById('mainChart');
    if (gameState.chart) gameState.chart.destroy();

    const chartData = { labels: config.labels, datasets: [{ data: config.data }] };
    let options = { responsive: true, maintainAspectRatio: false, plugins: { legend: false } };

    // Chart Configuration Strategy
    if (type === 'line' || type === 'line_forecast') {
        chartData.datasets[0].borderColor = config.color || '#667eea';
        chartData.datasets[0].tension = config.smooth ? 0.4 : 0.1;
        chartData.datasets[0].fill = !!config.fill;
    }
    else if (type === 'bar' || type === 'bar_events') {
        chartData.datasets[0].type = 'bar';
        chartData.datasets[0].backgroundColor = config.colors || '#667eea';
    }

    // Annotation Handling
    if (config.anomalies || config.zones || config.showThresholdLine) {
        options.plugins.annotation = { annotations: {} };
        if (config.showThresholdLine) addThresholdAnnotation(options, config.threshold);
        if (config.anomalies) addAnomalyAnnotations(options, config);
    }

    gameState.chart = new Chart(ctx, { type: 'line', data: chartData, options });
}

// ==========================================
// 6. UTILS
// ==========================================

function toggleTheme() {
    settings.darkMode = !settings.darkMode;
    document.body.classList.toggle('light-mode', !settings.darkMode);
    playSound('click');
    updateConfigIcons();
    saveSettings();
}

function toggleSound() {
    settings.soundEnabled = !settings.soundEnabled;
    playSound('click');
    updateConfigIcons();
    saveSettings();
}

function updateConfigIcons() {
    document.querySelector('#btnTheme i').className = settings.darkMode ? 'ri-sun-line' : 'ri-moon-line';
    document.querySelector('#btnSound i').className = settings.soundEnabled ? 'ri-volume-up-line' : 'ri-volume-mute-line';
    document.getElementById('btnSound').classList.toggle('muted', !settings.soundEnabled);
}

function playSound(type) {
    if (!settings.soundEnabled) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;
    gain.gain.setValueAtTime(0.1, now);

    const frequencies = {
        click: [800, 600],
        correct: [523, 659, 784],
        incorrect: [200, 150],
        complete: [523, 659, 784, 1047]
    }[type] || [440, 440];

    // Simple beep logic
    osc.frequency.setValueAtTime(frequencies[0], now);
    if (frequencies.length > 1) osc.frequency.linearRampToValueAtTime(frequencies[1], now + 0.1);

    osc.start(now);
    osc.stop(now + 0.3);
}

function saveGame() { localStorage.setItem(GAME_KEY, JSON.stringify(gameState)); }
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}
function selectOption(btn) {
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}
function announce(msg) { announcer.textContent = msg; }

// --- Helpers for Charts ---
function addThresholdAnnotation(options, value) {
    options.plugins.annotation.annotations.line1 = {
        type: 'line', yMin: value, yMax: value, borderColor: '#fbbf24', borderWidth: 2, borderDash: [5, 5]
    };
}
function addAnomalyAnnotations(options, config) {
    config.anomalies.forEach((a, i) => {
        options.plugins.annotation.annotations[`pt${i}`] = {
            type: 'point', xValue: config.labels[a.index], yValue: config.data[a.index], backgroundColor: a.color, radius: 6
        };
    });
}

// Feedback & Progression
function handleFeedback(isCorrect, question) {
    gameState.answers[question.id] = { correct: isCorrect };

    const panel = document.getElementById('explanationPanel');
    panel.style.display = 'block';
    panel.className = `explanation-panel ${isCorrect ? 'correct' : 'incorrect'}`;
    panel.innerHTML = `<strong>${isCorrect ? '¡Correcto!' : 'Incorrecto'}</strong> ${question.explanation}`;

    playSound(isCorrect ? 'correct' : 'incorrect');
    announce(isCorrect ? "Correcto" : "Incorrecto");

    document.getElementById('btnSubmit').style.display = 'none';
    const btnNext = document.getElementById('btnNext');
    btnNext.style.display = 'inline-flex';
    btnNext.onclick = nextQuestion;
    btnNext.focus();
}

function nextQuestion() {
    if (++gameState.currentQuestionIndex < gameState.currentMission.questions.length) {
        renderStage();
    } else {
        completeMission();
    }
}

function showCompletionModal(mission, xp, correct) {
    document.getElementById('completeTitle').textContent = `Misión ${mission.id} Completada`;
    document.getElementById('completeXP').textContent = `+${xp} XP`;
    document.getElementById('completeModal').classList.add('active');
    document.querySelector('#completeModal .btn-primary').onclick = closeCompletionModal;
}

function closeCompletionModal() {
    document.getElementById('completeModal').classList.remove('active');
    if (gameState.completedMissions.length === 7) showCertificateModal();
    else showScreen('screenSelect');
}

function confirmExitMission() {
    if (confirm('¿Salir de la misión? Perderás el progreso actual.')) showScreen('screenSelect');
}

function restartGame() {
    if (!confirm('¿Borrar todo el progreso?')) return;
    localStorage.removeItem(GAME_KEY);
    location.reload();
}

function updateStats() {
    document.getElementById('totalXP').textContent = gameState.totalXP;
    document.getElementById('missionsCompleted').textContent = `${gameState.completedMissions.length}/7`;
}

function showHint() {
    const question = gameState.currentMission.questions[gameState.currentQuestionIndex];
    if (gameState.hintsUsed < question.hints.length) {
        document.getElementById('hintText').textContent = question.hints[gameState.hintsUsed];
        document.getElementById('hintPanel').style.display = 'block';
        gameState.hintsUsed++;
    } else {
        alert("¡Ya no hay más pistas!");
    }
}

// Globals needed for HTML callbacks
window.selectOption = selectOption;
window.startMission = startMission;
window.generateCertificate = generateCertificate;
window.downloadCertificate = downloadCertificate;
window.closeCertificateModal = closeCertificateModal;
window.restartGame = restartGame;
window.checkAnswer = checkAnswer;
window.showHint = showHint;
window.closeModal = closeCompletionModal;
