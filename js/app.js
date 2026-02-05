const settings = {
    soundEnabled: true,
    darkMode: true
};

const savedSettings = localStorage.getItem('detective_settings');
if (savedSettings) {
    Object.assign(settings, JSON.parse(savedSettings));
}

if (!settings.darkMode) {
    document.body.classList.add('light-mode');
}

function saveSettings() {
    localStorage.setItem('detective_settings', JSON.stringify(settings));
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (!settings.soundEnabled) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    switch (type) {
        case 'click':
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'correct':
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
            break;
        case 'incorrect':
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'complete':
            oscillator.type = 'triangle';
            const notes = [523, 659, 784, 1047];
            notes.forEach((note, i) => {
                oscillator.frequency.setValueAtTime(note, audioContext.currentTime + i * 0.15);
            });
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.7);
            break;
    }
}

document.getElementById('btnHelp').addEventListener('click', () => {
    playSound('click');
    document.getElementById('helpModal').classList.add('active');
});

document.getElementById('btnSound').addEventListener('click', function () {
    settings.soundEnabled = !settings.soundEnabled;
    this.classList.toggle('muted', !settings.soundEnabled);
    this.querySelector('i').className = settings.soundEnabled ? 'ri-volume-up-line' : 'ri-volume-mute-line';
    saveSettings();
    if (settings.soundEnabled) playSound('click');
});

document.getElementById('btnTheme').addEventListener('click', function () {
    playSound('click');
    settings.darkMode = !settings.darkMode;
    document.body.classList.toggle('light-mode', !settings.darkMode);
    this.querySelector('i').className = settings.darkMode ? 'ri-sun-line' : 'ri-moon-line';
    saveSettings();
});

if (!settings.soundEnabled) {
    document.getElementById('btnSound').classList.add('muted');
    document.getElementById('btnSound').querySelector('i').className = 'ri-volume-mute-line';
}
if (!settings.darkMode) {
    document.getElementById('btnTheme').querySelector('i').className = 'ri-moon-line';
}

function closeHelpModal() {
    document.getElementById('helpModal').classList.remove('active');
}

function showCertificateModal() {
    document.getElementById('certNameInput').style.display = 'flex';
    document.getElementById('certCanvas').style.display = 'none';
    document.getElementById('certificateModal').classList.add('active');
}

function closeCertificateModal() {
    document.getElementById('certificateModal').classList.remove('active');
    showScreen('screenSelect');
    renderMissions();
}

function generateCertificate() {
    const name = document.getElementById('playerName').value.trim() || 'Detective Anónimo';

    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 760, 560);

        ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, 730, 530);

        ctx.fillStyle = '#667eea';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🔍 DETECTIVE DE DATOS', 400, 100);

        ctx.fillStyle = '#4ade80';
    ctx.font = '24px Arial';
    ctx.fillText('CERTIFICADO DE COMPLETACIÓN', 400, 145);

        ctx.font = '80px Arial';
    ctx.fillText('🏆', 400, 240);

        ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(name, 400, 320);

        ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Arial';
    ctx.fillText('Ha completado exitosamente las 7 misiones', 400, 370);
    ctx.fillText('de Análisis de Series Temporales', 400, 400);

        const totalXP = gameState.totalXP;
    const ranks = ['Novato', 'Junior', 'Analyst', 'Senior', 'Expert', 'Master'];
    const rankThresholds = [0, 100, 300, 600, 1000, 1500];
    let rank = 'Novato';
    for (let i = rankThresholds.length - 1; i >= 0; i--) {
        if (totalXP >= rankThresholds[i]) {
            rank = ranks[i];
            break;
        }
    }

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`⭐ ${totalXP} XP | Rango: ${rank} ⭐`, 400, 460);

        const today = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    ctx.fillStyle = '#64748b';
    ctx.font = '16px Arial';
    ctx.fillText(`Expedido el ${today}`, 400, 520);

        ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(280, 555);
    ctx.lineTo(520, 555);
    ctx.stroke();
    ctx.fillText('Data Analytics Academy', 400, 575);

    // Show canvas, hide input
    document.getElementById('certNameInput').style.display = 'none';
    document.getElementById('certCanvas').style.display = 'block';

    playSound('complete');
}

function downloadCertificate() {
    const canvas = document.getElementById('certificateCanvas');
    const link = document.createElement('a');
    link.download = 'detective_datos_certificado.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function restartGame() {
    if (confirm('¿Estás seguro? Se borrará todo tu progreso y empezarás desde cero.')) {
                localStorage.removeItem('detective_game');

                gameState.completedMissions = [];
        gameState.unlockedMissions = [1];
        gameState.totalXP = 0;
        gameState.currentMission = null;
        gameState.currentQuestionIndex = 0;
        gameState.answers = {};
        gameState.hintsUsed = 0;

                document.getElementById('certificateModal').classList.remove('active');
        updateStats();
        showScreen('screenSelect');
        renderMissions();

        playSound('click');
    }
}

// RETAIL 2022: 304 días (simplificado para demostración)
const retailData = {
    dates: [],
    values: []
};

// Generar 304 días de datos Retail con tendencia creciente + estacionalidad semanal
(function generateRetailData() {
    const start = new Date('2022-01-01');
    for (let i = 0; i < 304; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        retailData.dates.push(d.toISOString().split('T')[0]);

        // Base creciente + estacionalidad semanal + ruido
        const trend = 6420 + (i * 54);         const dayOfWeek = d.getDay();
        const weeklyFactor = [0.92, 0.95, 0.94, 0.97, 0.99, 1.05, 0.91][dayOfWeek]; // Dom-Sáb
        const noise = (Math.random() - 0.5) * 500;
        let value = Math.round(trend * weeklyFactor + noise);

        // Anomalías específicas
        if (i === 0) value = 2950; // Año Nuevo
        if (i === 120) value = Math.round(trend * 0.89); // Día del Trabajo
        if (i === 121) value = Math.round(trend * 0.88);         if (i === 303) value = Math.round(trend * 1.5); 
        retailData.values.push(value);
    }
})();

// Promedios semanales para Misión 2
const weeklyAverages = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    values: [14800, 15100, 14950, 15300, 15500, 16100, 14200]
};

// SAAS 2023: 12 meses
const saasData = {
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    values: [8200, 8900, 9650, 10500, 11400, 12200, 13100, 14000, 15100, 16200, 17500, 18900]
};

// E-COMMERCE 2023: 365 días (simplificado)
const ecommerceData = {
    dates: [],
    values: []
};

(function generateEcommerceData() {
    const start = new Date('2023-01-01');
    for (let i = 0; i < 365; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        ecommerceData.dates.push(d.toISOString().split('T')[0]);

        const trend = 8200 + (i * 55);
        const volatility = (Math.random() - 0.5) * trend * 0.3;
        let value = Math.round(trend + volatility);

                const month = d.getMonth();
        const day = d.getDate();
        if (month === 1 && day === 14) value *= 1.5; // Valentine's
        if (month === 6 && day >= 11 && day <= 12) value *= 1.4;         if (month === 10 && day === 24) value *= 1.85;         if (month === 10 && day === 27) value *= 1.7;         if (month === 11 && day >= 20 && day <= 25) value *= 1.45; 
        ecommerceData.values.push(Math.round(value));
    }
})();

// ============================================================
// DEFINICIÓN DE MISIONES
// ============================================================

const missions = [
    {
        id: 1,
        title: "Tendencia Retail",
        subtitle: "Identifica la dirección general",
        difficulty: 1,
        xp: 100,
        questions: [
            {
                id: "m1_q1",
                type: "select",
                title: "¿Cuál es la dirección general de las ventas?",
                chartType: "line",
                chartConfig: {
                    title: "Ventas Diarias 2022 - ChainMart Retail",
                    labels: retailData.dates,
                    data: retailData.values,
                    color: "#667eea"
                },
                options: [
                    { value: "up", text: "📈 Creciente (subiendo)" },
                    { value: "down", text: "📉 Decreciente (bajando)" },
                    { value: "stable", text: "➡️ Estable (plano)" }
                ],
                correct: "up",
                explanation: "La tendencia es claramente CRECIENTE. Las ventas van de ~6.4K a ~22.8K (+265%).",
                hints: ["Mira el inicio vs el final del gráfico", "¿La línea sube o baja en general?"]
            }
        ]
    },
    {
        id: 2,
        title: "Estacionalidad Semanal",
        subtitle: "Detecta patrones que se repiten",
        difficulty: 2,
        xp: 150,
        questions: [
            {
                id: "m2_q1",
                type: "number",
                title: "¿Cada cuántos días se repite el pico de ventas?",
                chartType: "bar",
                chartConfig: {
                    title: "Ventas de 3 Semanas - Busca el Patrón",
                    labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D', 'L', 'M', 'X', 'J', 'V', 'S', 'D', 'L', 'M', 'X', 'J', 'V', 'S', 'D'],
                    data: retailData.values.slice(1, 22),
                    colors: retailData.values.slice(1, 22).map((v, i) => (i % 7 === 5) ? '#ff0000' : '#667eea')
                },
                correct: 7,
                explanation: "El pico (barra roja = Sábado) se repite cada 7 días. Es un patrón SEMANAL.",
                hints: ["¿Cada cuántas barras hay una roja?", "Cuenta de pico a pico"]
            },
            {
                id: "m2_q2",
                type: "select",
                title: "¿Qué día tiene las ventas MÁXIMAS?",
                chartType: "bar",
                chartConfig: {
                    title: "Promedio de Ventas por Día de Semana",
                    labels: weeklyAverages.labels,
                    data: weeklyAverages.values,
                    colors: ['#667eea', '#667eea', '#667eea', '#667eea', '#667eea', '#ff0000', '#667eea']
                },
                options: [
                    { value: "lun", text: "Lunes" },
                    { value: "vie", text: "Viernes" },
                    { value: "sab", text: "Sábado" },
                    { value: "dom", text: "Domingo" }
                ],
                correct: "sab",
                explanation: "El SÁBADO (barra roja) tiene el promedio más alto: 16.1K unidades.",
                hints: ["Busca la barra más alta", "¿Cuándo tienen las personas más tiempo para comprar?"]
            }
        ]
    },
    {
        id: 3,
        title: "Cazador de Anomalías",
        subtitle: "Detecta eventos especiales",
        difficulty: 2,
        xp: 150,
        questions: [
            {
                id: "m3_q1",
                type: "number",
                title: "¿Cuántos eventos especiales (puntos rojos) detectas?",
                chartType: "scatter_anomaly",
                chartConfig: {
                    title: "Anomalías Marcadas en la Serie",
                    labels: retailData.dates,
                    data: retailData.values,
                    anomalies: [
                        { index: 0, label: "Año Nuevo", color: "#ff0000" },
                        { index: 120, label: "Día Trabajo", color: "#ff0000" },
                        { index: 121, label: "Puente", color: "#ff0000" },
                        { index: 303, label: "Halloween", color: "#00ff00" }
                    ]
                },
                correct: 4,
                range: [3, 5],
                explanation: "Hay 4 anomalías marcadas: Año Nuevo, Día del Trabajo, Puente y Halloween.",
                hints: ["Cuenta los puntos de color diferente", "Busca picos o caídas inusuales"]
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
                explanation: "Año Nuevo causó la mayor caída: -58%. Las tiendas estaban cerradas.",
                hints: ["Busca la barra más negativa (rojo oscuro)", "¿Qué evento tiene el % más bajo?"]
            }
        ]
    },
    {
        id: 4,
        title: "Analista SaaS",
        subtitle: "Métricas de usuarios activos",
        difficulty: 3,
        xp: 200,
        questions: [
            {
                id: "m4_q1",
                type: "select",
                title: "¿Cuál es el patrón de crecimiento de usuarios?",
                chartType: "line",
                chartConfig: {
                    title: "MAU (Monthly Active Users) 2023 - ProductAPI",
                    labels: saasData.months,
                    data: saasData.values,
                    color: "#4ade80",
                    smooth: true
                },
                options: [
                    { value: "linear", text: "📈 Crecimiento Lineal (constante)" },
                    { value: "exponential", text: "🚀 Crecimiento Exponencial (acelerado)" },
                    { value: "decline", text: "📉 Declive" }
                ],
                correct: "linear",
                explanation: "El crecimiento es LINEAL (~8-9% mensual constante). Típico de SaaS B2B estable.",
                hints: ["¿La velocidad de crecimiento cambia o es constante?", "Compara el ángulo al inicio y al final"]
            },
            {
                id: "m4_q2",
                type: "number",
                title: "¿Cuál es el crecimiento TOTAL en porcentaje? (Ene→Dic)",
                chartType: "bar",
                chartConfig: {
                    title: "MAU por Mes con Crecimiento Individual",
                    labels: saasData.months,
                    data: saasData.values,
                    colors: saasData.values.map(() => "#4ade80"),
                    showValues: true
                },
                correct: 130,
                range: [125, 135],
                explanation: "De 8.2K a 18.9K = 130% de crecimiento. ((18900-8200)/8200 * 100)",
                hints: ["Fórmula: (Final - Inicial) / Inicial * 100", "Es más del doble (>100%)"]
            }
        ]
    },
    {
        id: 5,
        title: "E-commerce Volátil",
        subtitle: "Tráfico web con picos extremos",
        difficulty: 3,
        xp: 250,
        questions: [
            {
                id: "m5_q1",
                type: "select",
                title: "¿Cuál es la característica principal del tráfico?",
                chartType: "line",
                chartConfig: {
                    title: "Tráfico Web Diario 2023 - NeoStore",
                    labels: ecommerceData.dates,
                    data: ecommerceData.values,
                    color: "#0066ff"
                },
                options: [
                    { value: "stable", text: "Estable y predecible" },
                    { value: "volatile", text: "📈 Crecimiento con ALTA volatilidad" },
                    { value: "decline", text: "Declive gradual" }
                ],
                correct: "volatile",
                explanation: "E-commerce tiene crecimiento + volatilidad ALTA. Picos dramáticos en eventos.",
                hints: ["¿La línea es suave o una montaña rusa?", "Compara con el gráfico SaaS"]
            },
            {
                id: "m5_q2",
                type: "select",
                title: "¿En qué período están los picos MÁXIMOS?",
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
                explanation: "Q4 (zona roja) tiene Black Friday, Cyber Monday y Navidad. Picos máximos del año.",
                hints: ["¿Qué zona tiene color diferente?", "¿Cuándo son los eventos de compras?"]
            },
            {
                id: "m5_q3",
                type: "number",
                title: "¿Cuántos eventos con picos mayores detectas?",
                chartType: "bar_events",
                chartConfig: {
                    title: "Picos de Eventos Principales",
                    labels: ["Valentine's", "Prime Day", "Black Friday", "Cyber Monday", "Navidad"],
                    data: [150, 140, 185, 170, 145],
                    colors: ["#ff69b4", "#ff9900", "#ff0000", "#0066ff", "#00dd00"]
                },
                correct: 5,
                range: [4, 6],
                explanation: "5 eventos principales: Valentine's, Prime Day, Black Friday, Cyber Monday, Navidad.",
                hints: ["Cuenta las barras de eventos", "Son los momentos clave del año"]
            }
        ]
    },
    {
        id: 6,
        title: "Profeta de Datos",
        subtitle: "Predicción con lógica",
        difficulty: 4,
        xp: 300,
        questions: [
            {
                id: "m6_q1",
                type: "number",
                title: "¿Promedio esperado para NOVIEMBRE 2022? (en miles)",
                chartType: "line_forecast",
                chartConfig: {
                    title: "Ventas Retail + Proyección Noviembre",
                    labels: retailData.dates,
                    data: retailData.values,
                    forecastStart: 304,
                    forecastDays: 30
                },
                correct: 24,
                range: [23, 26],
                explanation: "Siguiendo la tendencia lineal (+54/día), Noviembre promedia ~24K unidades.",
                hints: ["Sigue la línea punteada amarilla", "El valor está un poco arriba del final de Octubre"]
            },
            {
                id: "m6_q2",
                type: "select",
                title: "Si Navidad suma +20%, ¿Diciembre sería aproximadamente?",
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
                    { value: "26", text: "~26K (sin cambio)" },
                    { value: "30", text: "~30K (+20%)" },
                    { value: "35", text: "~35K (+40%)" }
                ],
                correct: "30",
                explanation: "Tendencia base ~25K + 20% Navidad = ~30K. La estacionalidad rompe la tendencia.",
                hints: ["Calcula el 20% de 25,000", "Súmalo al valor base"]
            }
        ]
    },
    {
        id: 7,
        title: "Senior Analyst",
        subtitle: "Análisis estratégico final",
        difficulty: 5,
        xp: 500,
        questions: [
            {
                id: "m7_q1",
                type: "select",
                title: "Observa las 3 líneas. ¿Cuál industria tiene crecimiento más ESTABLE (sin picos)?",
                chartType: "dashboard",
                chartConfig: {
                    title: "Dashboard Comparativo: Retail vs SaaS vs E-commerce"
                },
                options: [
                    { value: "retail", text: "Retail (línea morada)" },
                    { value: "saas", text: "SaaS (línea verde)" },
                    { value: "ecom", text: "E-commerce (línea roja)" }
                ],
                correct: "saas",
                explanation: "SaaS (verde) tiene la línea más SUAVE y predecible. Retail y E-commerce tienen picos y valles.",
                hints: ["¿Cuál línea parece más suave?", "Busca la que no tiene 'montaña rusa'"]
            },
            {
                id: "m7_q2",
                type: "select",
                title: "¿Qué industria tiene la volatilidad MÁS ALTA (más impredecible)?",
                chartType: "bar",
                chartConfig: {
                    title: "Volatilidad por Industria (% de Variación)",
                    labels: ['Retail', 'SaaS', 'E-commerce'],
                    data: [13, 5, 45],
                    colors: ['#667eea', '#4ade80', '#ff6b6b']
                },
                options: [
                    { value: "retail", text: "Retail (13%)" },
                    { value: "saas", text: "SaaS (5%)" },
                    { value: "ecom", text: "E-commerce (45%)" }
                ],
                correct: "ecom",
                explanation: "E-commerce tiene 45% de volatilidad (la barra más alta). Sus ventas son muy impredecibles.",
                hints: ["La barra más alta = más volatilidad", "¿Qué color es el más alto?"]
            },
            {
                id: "m7_q3",
                type: "select",
                title: "¿Qué industria creció MÁS en porcentaje durante el año?",
                chartType: "bar",
                chartConfig: {
                    title: "Crecimiento Anual por Industria (%)",
                    labels: ['Retail', 'SaaS', 'E-commerce'],
                    data: [265, 130, 320],
                    colors: ['#667eea', '#4ade80', '#ff6b6b']
                },
                options: [
                    { value: "retail", text: "Retail (+265%)" },
                    { value: "saas", text: "SaaS (+130%)" },
                    { value: "ecom", text: "E-commerce (+320%)" }
                ],
                correct: "ecom",
                explanation: "E-commerce creció +320% (barra más alta). Aunque volátil, su crecimiento total fue el mayor.",
                hints: ["Busca la barra más alta", "¿Qué número es mayor: 265, 130 o 320?"]
            }
        ]
    }
];

let gameState = {
    totalXP: 0,
    completedMissions: [],
    unlockedMissions: [1],
    currentMission: null,
    currentQuestionIndex: 0,
    answers: {},
    hintsUsed: 0,
    chart: null
};

const saved = localStorage.getItem('detective_v3');
if (saved) {
    const parsed = JSON.parse(saved);
    gameState = { ...gameState, ...parsed };
}

function saveGame() {
    localStorage.setItem('detective_v3', JSON.stringify({
        totalXP: gameState.totalXP,
        completedMissions: gameState.completedMissions,
        unlockedMissions: gameState.unlockedMissions
    }));
}

function updateStats() {
    document.getElementById('totalXP').textContent = gameState.totalXP;
    document.getElementById('missionsCompleted').textContent = `${gameState.completedMissions.length}/7`;

        const ranks = ['Novato', 'Junior', 'Analyst', 'Senior', 'Expert', 'Master'];
    const rankThresholds = [0, 100, 300, 600, 1000, 1500];
    let rank = 'Novato';
    for (let i = rankThresholds.length - 1; i >= 0; i--) {
        if (gameState.totalXP >= rankThresholds[i]) {
            rank = ranks[i];
            break;
        }
    }
    document.getElementById('currentRank').textContent = rank;
}

function renderMissions() {
    const grid = document.getElementById('missionsGrid');
    grid.innerHTML = missions.map(m => {
        const isCompleted = gameState.completedMissions.includes(m.id);
        const isUnlocked = gameState.unlockedMissions.includes(m.id);
        const stars = '⭐'.repeat(m.difficulty);

        let stateClass = isCompleted ? 'completed' : (isUnlocked ? '' : 'locked');

        return `
        <div class="mission-card ${stateClass}" onclick="${isUnlocked ? `startMission(${m.id})` : ''}">
            <span class="mission-number">Misión ${m.id}</span>
            <h3 class="mission-title">${m.title}</h3>
            <p class="mission-subtitle">${m.subtitle}</p>
            <div class="mission-meta">
                <span class="mission-stars">${stars}</span>
                <span>${m.xp} XP</span>
            </div>
        </div>
    `;
    }).join('');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startMission(missionId) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    gameState.currentMission = mission;
    gameState.currentQuestionIndex = 0;
    gameState.answers = {};
    gameState.hintsUsed = 0;

    document.getElementById('playTitle').textContent = mission.title;
    document.getElementById('playSubtitle').textContent = mission.subtitle;
    document.getElementById('playDifficulty').textContent = '⭐'.repeat(mission.difficulty);

    showScreen('screenPlay');
    renderQuestion();
}

function renderQuestion() {
    const mission = gameState.currentMission;
    const question = mission.questions[gameState.currentQuestionIndex];

        document.getElementById('questionProgress').textContent =
        `Pregunta ${gameState.currentQuestionIndex + 1} de ${mission.questions.length}`;

    document.getElementById('questionTitle').textContent = question.title;

        renderChart(question.chartType, question.chartConfig);

        const contentDiv = document.getElementById('questionContent');

    if (question.type === 'select') {
        contentDiv.innerHTML = `
        <div class="options-grid">
            ${question.options.map(opt => `
                <button class="option-btn" data-value="${opt.value}" onclick="selectOption(this)">
                    ${opt.text}
                </button>
            `).join('')}
        </div>
    `;
    } else if (question.type === 'number') {
        contentDiv.innerHTML = `
        <input type="number" class="number-input" id="numberAnswer" placeholder="Ingresa tu respuesta">
    `;
    }

        document.getElementById('hintPanel').style.display = 'none';
    document.getElementById('explanationPanel').style.display = 'none';
    document.getElementById('btnSubmit').style.display = 'inline-flex';
    document.getElementById('btnNext').style.display = 'none';
    document.getElementById('btnHint').style.display = 'inline-flex';
}

function renderChart(type, config) {
    const ctx = document.getElementById('mainChart');
    document.getElementById('chartTitle').textContent = config.title;

    if (gameState.chart) {
        gameState.chart.destroy();
    }

    let chartConfig = {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                annotation: { annotations: {} }
            },
            scales: {
                x: { ticks: { color: '#888', maxTicksLimit: 10 }, grid: { color: '#333' } },
                y: { ticks: { color: '#888' }, grid: { color: '#333' } }
            }
        }
    };

    switch (type) {
        case 'line':
            chartConfig.data = {
                labels: config.labels,
                datasets: [{
                    data: config.data,
                    borderColor: config.color,
                    backgroundColor: config.color + '20',
                    fill: config.fill || false,
                    tension: config.smooth ? 0.4 : 0.1,
                    pointRadius: 0
                }]
            };
            break;

        case 'bar':
            chartConfig.type = 'bar';
            chartConfig.data = {
                labels: config.labels,
                datasets: [{
                    data: config.data,
                    backgroundColor: config.colors || config.data.map(() => '#667eea'),
                    borderWidth: 0
                }]
            };
            break;

        case 'bar_events':
            chartConfig.type = 'bar';
            chartConfig.data = {
                labels: config.labels,
                datasets: [{
                    data: config.data,
                    backgroundColor: config.colors,
                    borderWidth: 0
                }]
            };
            break;

        case 'scatter_anomaly':
            const colors = config.data.map((_, i) => {
                const anomaly = config.anomalies.find(a => a.index === i);
                return anomaly ? anomaly.color : config.color || '#667eea';
            });
            const radii = config.data.map((_, i) => {
                return config.anomalies.find(a => a.index === i) ? 8 : 2;
            });

            chartConfig.data = {
                labels: config.labels,
                datasets: [{
                    data: config.data,
                    borderColor: '#667eea40',
                    pointBackgroundColor: colors,
                    pointRadius: radii,
                    showLine: true,
                    tension: 0.1
                }]
            };

                        config.anomalies.forEach((a, idx) => {
                chartConfig.options.plugins.annotation.annotations[`label${idx}`] = {
                    type: 'label',
                    xValue: config.labels[a.index],
                    yValue: config.data[a.index],
                    content: a.label,
                    font: { size: 10 },
                    color: a.color,
                    yAdjust: -15
                };
            });
            break;

        case 'line_zones':
            chartConfig.data = {
                labels: config.labels,
                datasets: [{
                    data: config.data,
                    borderColor: '#0066ff',
                    pointRadius: 0,
                    tension: 0.1
                }]
            };

                        config.zones.forEach((z, idx) => {
                chartConfig.options.plugins.annotation.annotations[`zone${idx}`] = {
                    type: 'box',
                    xMin: config.labels[z.start],
                    xMax: config.labels[z.end],
                    backgroundColor: z.color,
                    borderWidth: 0
                };
            });
            break;

        case 'line_forecast':
            const forecastData = [...config.data];
            const lastVal = forecastData[forecastData.length - 1];
            const forecastLabels = [...config.labels];

            for (let i = 1; i <= config.forecastDays; i++) {
                forecastLabels.push(`+${i}`);
                let projected = lastVal + (i * 54);
                if (config.navidad && i > 30) projected *= 1.2;
                forecastData.push(projected);
            }

            chartConfig.data = {
                labels: forecastLabels,
                datasets: [
                    {
                        label: 'Histórico',
                        data: config.data,
                        borderColor: '#667eea',
                        pointRadius: 0
                    },
                    {
                        label: 'Proyección',
                        data: new Array(config.data.length - 1).fill(null).concat([lastVal]).concat(
                            Array.from({ length: config.forecastDays }, (_, i) => {
                                let val = lastVal + ((i + 1) * 54);
                                if (config.navidad && i > 30) val *= 1.2;
                                return val;
                            })
                        ),
                        borderColor: '#fbbf24',
                        borderDash: [5, 5],
                        pointRadius: 0
                    }
                ]
            };
            chartConfig.options.plugins.legend.display = true;
            break;

        case 'dashboard':
            // Multi-chart dashboard - simplified representation
            chartConfig.data = {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [
                    {
                        label: 'Retail (estacional)',
                        data: [6.4, 9.4, 11.5, 14.3, 14.9, 19.5, 22.1, 25, 27.8, 22.8, null, null],
                        borderColor: '#667eea',
                        tension: 0.3,
                        pointRadius: 0
                    },
                    {
                        label: 'SaaS (lineal)',
                        data: saasData.values.map(v => v / 1000),
                        borderColor: '#4ade80',
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'E-commerce (volátil)',
                        data: [8.2, 12.5, 10.8, 14.2, 11.5, 15.8, 18.2, 16.5, 19.8, 22.5, 32, 35],
                        borderColor: '#ff6b6b',
                        tension: 0.1,
                        pointRadius: 0
                    }
                ]
            };
            chartConfig.options.plugins.legend.display = true;
            chartConfig.options.plugins.legend.labels = { color: '#ccc' };
            break;

        case 'kpi_cards':
        case 'roadmap':
            // These would be HTML visualizations - for now show a simple chart
            chartConfig.type = 'bar';
            chartConfig.data = {
                labels: ['Retail', 'SaaS', 'E-commerce'],
                datasets: [{
                    label: 'Volatilidad',
                    data: [13, 5, 45],
                    backgroundColor: ['#667eea', '#4ade80', '#ff6b6b']
                }]
            };
            chartConfig.options.plugins.legend.display = true;
            break;
    }

    gameState.chart = new Chart(ctx, chartConfig);
}

function selectOption(btn) {
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

function showHint() {
    const question = gameState.currentMission.questions[gameState.currentQuestionIndex];
    if (!question.hints || gameState.hintsUsed >= question.hints.length) return;

    const panel = document.getElementById('hintPanel');
    const text = document.getElementById('hintText');

    text.textContent = question.hints[gameState.hintsUsed];
    panel.style.display = 'block';
    gameState.hintsUsed++;

    if (gameState.hintsUsed >= question.hints.length) {
        document.getElementById('btnHint').style.display = 'none';
    }
}

function submitAnswer() {
    const question = gameState.currentMission.questions[gameState.currentQuestionIndex];
    let userAnswer;

    if (question.type === 'select') {
        const selected = document.querySelector('.option-btn.selected');
        if (!selected) {
            alert('Por favor selecciona una opción');
            return;
        }
        userAnswer = selected.dataset.value;
    } else if (question.type === 'number') {
        userAnswer = parseFloat(document.getElementById('numberAnswer').value);
        if (isNaN(userAnswer)) {
            alert('Por favor ingresa un número');
            return;
        }
    }

        let isCorrect = false;
    if (question.type === 'select') {
        isCorrect = userAnswer === question.correct;
    } else if (question.type === 'number') {
        if (question.range) {
            isCorrect = userAnswer >= question.range[0] && userAnswer <= question.range[1];
        } else {
            isCorrect = userAnswer === question.correct;
        }
    }

        gameState.answers[question.id] = { answer: userAnswer, correct: isCorrect };

        const panel = document.getElementById('explanationPanel');
    const title = document.getElementById('explanationTitle');
    const text = document.getElementById('explanationText');

    panel.style.display = 'block';
    panel.className = 'explanation-panel ' + (isCorrect ? 'correct' : 'incorrect');
    title.innerHTML = isCorrect ?
        '<i class="ri-checkbox-circle-line"></i> ¡Correcto!' :
        '<i class="ri-close-circle-line"></i> Incorrecto';
    text.textContent = question.explanation;

        if (question.type === 'select') {
        document.querySelectorAll('.option-btn').forEach(btn => {
            if (btn.dataset.value === question.correct) {
                btn.classList.add('correct');
            } else if (btn.classList.contains('selected') && !isCorrect) {
                btn.classList.add('incorrect');
            }
            btn.onclick = null;         });
    }

        if (isCorrect) {
        playSound('correct');
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        }
    } else {
        playSound('incorrect');
        document.querySelector('.question-panel').classList.add('shake');
        setTimeout(() => document.querySelector('.question-panel').classList.remove('shake'), 500);
    }

        document.getElementById('btnSubmit').style.display = 'none';
    document.getElementById('btnHint').style.display = 'none';
    document.getElementById('btnNext').style.display = 'inline-flex';

        if (gameState.currentQuestionIndex >= gameState.currentMission.questions.length - 1) {
        document.getElementById('btnNext').innerHTML = 'Finalizar <i class="ri-trophy-line"></i>';
    }
}

function nextQuestion() {
    gameState.currentQuestionIndex++;
    gameState.hintsUsed = 0;

    if (gameState.currentQuestionIndex >= gameState.currentMission.questions.length) {
        completeMission();
    } else {
        renderQuestion();
    }
}

function completeMission() {
    const mission = gameState.currentMission;

        let correctCount = Object.values(gameState.answers).filter(a => a.correct).length;
    let xpEarned = Math.round(mission.xp * (correctCount / mission.questions.length));

        if (!gameState.completedMissions.includes(mission.id)) {
        gameState.completedMissions.push(mission.id);
    }

    if (mission.id < 7 && !gameState.unlockedMissions.includes(mission.id + 1)) {
        gameState.unlockedMissions.push(mission.id + 1);
    }

    gameState.totalXP += xpEarned;

    saveGame();
    updateStats();

        document.getElementById('completeTitle').textContent = mission.id === 7 ?
        '🎓 ¡Campaña Completada!' : `¡Misión ${mission.id} Completada!`;
    document.getElementById('completeXP').textContent = `+${xpEarned} XP`;
    document.getElementById('completeStats').textContent =
        `${correctCount}/${mission.questions.length} respuestas correctas`;

    document.getElementById('completeModal').classList.add('active');

    playSound('complete');
    if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 150, spread: 100 });
    }
}

function closeModal() {
    document.getElementById('completeModal').classList.remove('active');

    // Check if all 7 missions are completed
    if (gameState.completedMissions.length === 7) {
        showCertificateModal();
    } else {
        showScreen('screenSelect');
        renderMissions();
    }
}

document.getElementById('btnBack').addEventListener('click', () => {
    if (confirm('¿Seguro que quieres salir? Perderás el progreso de esta misión.')) {
        showScreen('screenSelect');
    }
});

updateStats();
renderMissions();

console.log('🔍 Detective de Datos V3 cargado correctamente');
