/**
 * DETECTIVE DE DATOS - Lógica del Juego
 * 
 * Este archivo contiene:
 * 1. Generación de datos (Simulación determinista basada en specs)
 * 2. Estado del juego (gameState)
 * 3. Algoritmos de análisis (Tendencia, Estacionalidad, Anomalías)
 * 4. Lógica de UI y validación
 */

// --- 1. DATOS (HARDCODEADOS / GENERADOS) ---
// Especificación:
// Periodo: 2022-01-01 a 2022-10-31 (304 días)
// Tendencia: y = 53.8x + 6543
// Estacionalidad: Semanal
// Anomalías: 1 Ene, 1-2 May, 31 Oct

const generateData = () => {
    const data = [];
    const dates = [];
    const startDate = new Date('2022-01-01');
    
    for (let i = 0; i < 304; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        dates.push(currentDate.toISOString().split('T')[0]);
        
        // 1. Tendencia Base
        let value = 53.8 * i + 6543;
        
        // 2. Estacionalidad (Semanal)
        // Patrón arbitrario que suma ~15000 de media total y cumple max Sab/min Dom
        const dayOfWeek = currentDate.getDay(); // 0=Dom, 6=Sab
        let seasonalFactor = 0;
        
        // Ajustes para simular los promedios dados (aprox)
        switch(dayOfWeek) {
            case 1: seasonalFactor = 500; break;  // Lun
            case 2: seasonalFactor = 800; break;  // Mar
            case 3: seasonalFactor = 650; break;  // Mie
            case 4: seasonalFactor = 1000; break; // Jue
            case 5: seasonalFactor = 1200; break; // Vie
            case 6: seasonalFactor = 1800; break; // Sab (Max)
            case 0: seasonalFactor = -100; break; // Dom (Min)
        }
        
        value += seasonalFactor;

        // 3. Ruido Aleatorio (Random suave para realismo)
        // Usamos seno para determinismo visual si se recarga, o random fijo
        value += (Math.sin(i * 0.5) * 200) + (Math.random() * 300);

        // 4. Anomalías (Hardcoded)
        const dateStr = dates[i];
        if (dateStr === '2022-01-01') value *= 0.42; // -58%
        if (dateStr === '2022-05-01') value *= 0.89; // -11%
        if (dateStr === '2022-05-02') value *= 0.88; // -12%
        if (dateStr === '2022-10-31') value *= 1.50; // +50%

        data.push(Math.round(value));
    }

    return { dates, values: data };
};

const realDataset = generateData();
const anomaliesDates = ["2022-01-01", "2022-05-01", "2022-05-02", "2022-10-31"];

// --- 2. GAME STATE ---
const gameState = {
    phase: 0,
    trendSolved: false,
    seasonalitySolved: false,
    anomalySolved: false,
    
    hints: { trend: 0, seasonality: 0, anomaly: 0 },
    answers: { trend: null, seasonality: null, anomaly: null },
    
    chartInstance: null, // Chart.js instance

    moveToPhase(newPhase) {
        // Ocultar fase actual
        document.querySelector(`#phase-${this.phase}`).classList.remove('active');
        document.querySelector(`.progress-step:nth-child(${this.phase + 1})`).classList.remove('active'); // Keep previous active? Or visual style usually keeps past active.
        // Let's keep past steps active effectively in UI logic if we wanted, but CSS class logic here is simple
        // Actualizar UI de pasos
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, idx) => {
            if (idx <= newPhase) step.classList.add('active');
            else step.classList.remove('active');
        });

        this.phase = newPhase;
        
        // Mostrar nueva fase
        const newPhaseEl = document.querySelector(`#phase-${newPhase}`);
        if (newPhaseEl) newPhaseEl.classList.add('active');
        
        this.renderPhase();
    },

    renderPhase() {
        const ctx = document.getElementById('mainChart').getContext('2d');
        if (this.chartInstance) this.chartInstance.destroy();

        if (this.phase === 0) {
            // BRIEFING: Line chart, first 60 days
            this.chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: realDataset.dates.slice(0, 60),
                    datasets: [{
                        label: 'Unidades Vendidas (Primeros 60 días)',
                        data: realDataset.values.slice(0, 60),
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        pointRadius: 3
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
        else if (this.phase === 1) {
            // TREND: Full dataset
            const datasets = [{
                label: 'Ventas Diarias 2022',
                data: realDataset.values,
                borderColor: '#667eea',
                tension: 0.3,
                pointRadius: 1
            }];

            if (this.trendSolved) {
                const trendPoints = calculateTrendLine(realDataset.values);
                datasets.push({
                    label: 'Tendencia (Regresión Lineal)',
                    data: trendPoints,
                    borderColor: '#ffc107',
                    borderDash: [5, 5],
                    borderWidth: 3,
                    pointRadius: 0
                });
            }

            this.chartInstance = new Chart(ctx, {
                type: 'line',
                data: { labels: realDataset.dates, datasets },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
        else if (this.phase === 2) {
            // SEASONALITY: Bar Chart Aggregated
            const weekData = aggregateByDayOfWeek(realDataset.dates, realDataset.values);
            const labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
            
            this.chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Promedio de Ventas por Día',
                        data: weekData, // Debe ser el array ordenada Lun-Dom
                        backgroundColor: this.seasonalitySolved ? '#4ade80' : 'rgba(102, 126, 234, 0.6)'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
        else if (this.phase === 3) {
            // ANOMALIES: Scatter Plot
            // Map data to x,y object format for scatter
            const scatterData = realDataset.values.map((v, i) => ({ x: i, y: v }));
            const colors = detectAnomalies(realDataset.dates, anomaliesDates); // Array of colors

            this.chartInstance = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Ventas Diarias (Detección de Anomalías)',
                        data: scatterData,
                        backgroundColor: colors,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { type: 'linear', position: 'bottom', title: {display: true, text: 'Día del Año'} }
                    }
                }
            });
        }
        else if (this.phase === 4) {
            // Final summary - show full trend again or composite
            // Reusing Trend view for background context or keep Anomaly view
            this.chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: realDataset.dates,
                    datasets: [{
                        label: 'Histórico Completo',
                        data: realDataset.values,
                        borderColor: '#667eea',
                        tension: 0.3,
                        pointRadius: 1
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
            
            // Update stats logic
            document.getElementById('final-anomalies').textContent = "4 🚨"; 
            let score = 100;
            const totalHints = this.hints.trend + this.hints.seasonality + this.hints.anomaly;
            score = Math.max(50, 100 - (totalHints * 10)); // Penalize 10 pts per hint
            document.getElementById('final-score').textContent = score + "%";
        }
    },

    resetGame() {
        this.phase = 0;
        this.trendSolved = false;
        this.seasonalitySolved = false;
        this.anomalySolved = false;
        this.hints = { trend: 0, seasonality: 0, anomaly: 0 };
        
        // Reset inputs
        document.getElementById('trend-answer').value = "";
        document.getElementById('seasonality-answer').value = "";
        document.getElementById('anomaly-answer').value = "";
        
        // Hide feedbacks
        document.querySelectorAll('.hint-box, .explanation-box').forEach(el => el.style.display = 'none');
        
        // Go to start
        this.moveToPhase(0);
    }
};

// --- 3. ALGORITHMS ---

function calculateTrendLine(data) {
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += data[i];
        sumXY += i * data[i];
        sumXX += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return data.map((_, i) => slope * i + intercept);
}

function aggregateByDayOfWeek(dates, values) {
    // 0=Mon, ..., 6=Sun
    const sums = new Array(7).fill(0);
    const counts = new Array(7).fill(0);
    
    dates.forEach((dateStr, i) => {
        const date = new Date(dateStr);
        // JS getDay(): 0=Sun, 1=Mon...6=Sat
        // We want: 0=Mon...6=Sun
        let jsDay = date.getDay();
        let monIdx = (jsDay + 6) % 7;
        
        sums[monIdx] += values[i];
        counts[monIdx]++;
    });
    
    return sums.map((sum, i) => Math.round(sum / counts[i]));
}

function detectAnomalies(dates, anomalyList) {
    return dates.map(date => {
        return anomalyList.includes(date) ? '#dc3545' : '#667eea';
    });
}


// --- 4. VALIDATION LOGIC ---

function validateTrendAnswer() {
    const answer = document.getElementById('trend-answer').value;
    const hintBox = document.getElementById('trend-hint');
    const explBox = document.getElementById('trend-explanation');
    
    if (answer === 'uptrend') {
        gameState.trendSolved = true;
        hintBox.style.display = 'none';
        explBox.style.display = 'block';
        gameState.renderPhase(); // Redraw with trend line
    } else {
        gameState.hints.trend++;
        hintBox.style.display = 'block';
        
        const hints = [
             "Compara el nivel de ventas al inicio (enero) con el final (octubre). ¿Las barras crecen, bajan o se mantienen similares?",
             "El promedio de enero es menor que el de octubre. ¿Hacia dónde van los valores?",
             "Las ventas van AUMENTANDO a lo largo del período. ¡Inténtalo de nuevo!"
        ];
        hintBox.innerText = "💡 Pista: " + (hints[Math.min(gameState.hints.trend - 1, 2)]);
    }
}

function validateSeasonalityAnswer() {
    const answer = parseInt(document.getElementById('seasonality-answer').value);
    const hintBox = document.getElementById('seasonality-hint');
    const explBox = document.getElementById('seasonality-explanation');
    
    if (answer === 7) {
        gameState.seasonalitySolved = true;
        hintBox.style.display = 'none';
        explBox.style.display = 'block';
        gameState.renderPhase(); // Redraw with green bars
    } else {
        gameState.hints.seasonality++;
        hintBox.style.display = 'block';
        
        const hints = [
            "Intenta identificar si hay un patrón relacionado con los días de la semana. ¿Las ventas de lunes son similares a otros lunes?",
            "Busca un patrón que se repita cada semana. ¿Cuántos días tiene una semana?",
            "Es un patrón SEMANAL. La respuesta es 7 días."
        ];
        hintBox.innerText = "💡 Pista: " + (hints[Math.min(gameState.hints.seasonality - 1, 2)]);
    }
}

function validateAnomalyAnswer() {
    const answer = parseInt(document.getElementById('anomaly-answer').value);
    const hintBox = document.getElementById('anomaly-hint');
    const explBox = document.getElementById('anomaly-explanation');
    
    // Flexible range 3-7
    if (answer >= 3 && answer <= 7) {
        gameState.anomalySolved = true;
        hintBox.style.display = 'none';
        explBox.style.display = 'block';
        gameState.renderPhase(); // Redraw as scatter
    } else {
        gameState.hints.anomaly++;
        hintBox.style.display = 'block';
        
        const hints = [
            "Busca desviaciones significativas del patrón semanal normal.",
            "Mira enero, mayo y octubre. ¿Hay días con ventas mucho mayores o menores?",
            "Hay eventos especiales (holidays, promociones). El rango es entre 3 y 7 eventos."
        ];
        hintBox.innerText = "💡 Pista: " + (hints[Math.min(gameState.hints.anomaly - 1, 2)]);
    }
}

// Start
window.onload = () => {
    gameState.renderPhase();
};
