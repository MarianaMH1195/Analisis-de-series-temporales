/**
 * ============================================================
 * DETECTIVE DE DATOS - Lógica del Juego v2.0
 * ============================================================
 * 
 * Arquitectura Modular:
 * - GameStateManager: Estado centralizado con Observer pattern
 * - DataAnalyzer: Procesamiento de datos y cálculos estadísticos
 * - AnswerValidator: Validación de respuestas con feedback
 * - ChartManager: Gestión de gráficos Chart.js 4.4
 * - UIController: Control de eventos y UI
 * - DetectiveGame: Orquestador principal
 * 
 * @author Detective de Datos Team
 * @version 2.0.0
 */

'use strict';

// ============================================================
// 1. DATASET REAL (304 observaciones hardcodeadas)
// ============================================================

/**
 * Genera el dataset de 304 días con tendencia, estacionalidad y anomalías
 * Basado en especificaciones del Retail Store Inventory 2022
 */
const generateRealDataset = () => {
    const dates = [];
    const values = [];
    const startDate = new Date('2022-01-01');

    // Anomaly dates with their impact multipliers
    const anomalies = {
        '2022-01-01': 0.42,  // New Year: -58%
        '2022-05-01': 0.89,  // Labor Day: -11%
        '2022-05-02': 0.88,  // Labor Day+1: -12%
        '2022-10-31': 1.50   // Halloween: +50%
    };

    // Day of week factors (0=Sunday, 6=Saturday)
    // Pattern: Sat highest, Sun lowest
    const dayFactors = {
        0: -200,   // Domingo (min)
        1: 400,    // Lunes
        2: 600,    // Martes
        3: 500,    // Miércoles
        4: 800,    // Jueves
        5: 1000,   // Viernes
        6: 1500    // Sábado (max)
    };

    for (let i = 0; i < 304; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        dates.push(dateStr);

        // 1. Base Trend: y = 53.8x + 6543
        let value = 53.8 * i + 6543;

        // 2. Seasonality (weekly pattern)
        const dayOfWeek = currentDate.getDay();
        value += dayFactors[dayOfWeek];

        // 3. Random noise (deterministic for consistency)
        const noise = Math.sin(i * 0.7) * 300 + Math.cos(i * 1.3) * 200;
        value += noise;

        // 4. Apply anomaly if present
        if (anomalies[dateStr]) {
            value *= anomalies[dateStr];
        }

        values.push(Math.round(Math.max(value, 1000))); // Ensure minimum value
    }

    return {
        dates,
        values,
        metadata: {
            source: 'Kaggle - Retail Store Inventory Forecasting',
            company: 'ChainMart Retail Inc.',
            product: 'Agregación de todas las categorías',
            dateRange: '2022-01-01 a 2022-10-31',
            totalDays: 304,
            currency: 'unidades'
        }
    };
};

// Global dataset
const realDataset = generateRealDataset();

// Anomalies definition
const anomaliesInfo = [
    { date: '2022-01-01', event: 'Año Nuevo', impact: -58, type: 'holiday' },
    { date: '2022-05-01', event: 'Día del Trabajo', impact: -11, type: 'holiday' },
    { date: '2022-05-02', event: 'Post-Festivo', impact: -12, type: 'holiday' },
    { date: '2022-10-31', event: 'Halloween Promo', impact: +50, type: 'promotion' }
];

// Hints configuration
const hintsConfig = {
    trend: [
        'Compara el nivel de ventas al inicio (enero) con el final (octubre). ¿Las ventas son mayores o menores al final?',
        'El promedio de enero (~7,000) es mucho menor que el de octubre (~22,000). ¿Hacia dónde van los valores?',
        'Las ventas muestran un AUMENTO sostenido. La respuesta es "Creciente".'
    ],
    seasonality: [
        'Busca patrones que se repitan regularmente. ¿Los lunes se comportan similar a otros lunes?',
        '¿Cuántos días tiene una semana? Observa si hay picos cada 7 días.',
        'Es un patrón SEMANAL. La respuesta es exactamente 7 días.'
    ],
    anomaly: [
        'Busca puntos que se desvíen significativamente del patrón normal semanal.',
        'Revisa fechas especiales: 1 de enero, 1 de mayo, 31 de octubre. ¿Ves algo inusual?',
        'Hay 4 eventos principales (Año Nuevo, Día del Trabajo x2, Halloween). Respuestas entre 3-7 son válidas.'
    ]
};


// ============================================================
// 2. GAME STATE MANAGER (Observer Pattern)
// ============================================================

class GameStateManager {
    constructor() {
        this.state = {
            phase: 0,
            playerName: 'Analista Junior',

            // Solved flags
            trendSolved: false,
            seasonalitySolved: false,
            anomalySolved: false,

            // Hints used per phase
            hints: {
                trend: 0,
                seasonality: 0,
                anomaly: 0
            },

            // User answers
            answers: {
                trend: null,
                seasonality: null,
                anomaly: null
            },

            // Timing
            startTime: null,
            completionTime: null,

            // Scoring
            score: 0,
            achievements: []
        };

        this.observers = [];
        this.timerInterval = null;
    }

    /**
     * Update state and notify observers
     * @param {Object} newState - Partial state to merge
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyObservers();
        this.saveToLocalStorage();
    }

    /**
     * Subscribe to state changes
     * @param {Function} callback - Function to call on state change
     */
    subscribe(callback) {
        this.observers.push(callback);
    }

    /**
     * Notify all observers of state change
     */
    notifyObservers() {
        this.observers.forEach(callback => callback(this.state));
    }

    /**
     * Start the game timer
     */
    startTimer() {
        this.state.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
    }

    /**
     * Stop the game timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.state.completionTime = Date.now() - this.state.startTime;
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        if (!this.state.startTime) return;
        const elapsed = Math.floor((Date.now() - this.state.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const timerEl = document.getElementById('scoreTime');
        if (timerEl) timerEl.textContent = display;
    }

    /**
     * Save state to localStorage
     */
    saveToLocalStorage() {
        try {
            localStorage.setItem('detective_game_state', JSON.stringify({
                ...this.state,
                savedAt: Date.now()
            }));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    /**
     * Load state from localStorage
     * @returns {boolean} Whether state was loaded
     */
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('detective_game_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Only load if less than 24 hours old
                if (Date.now() - parsed.savedAt < 86400000) {
                    this.state = { ...this.state, ...parsed };
                    return true;
                }
            }
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
        }
        return false;
    }

    /**
     * Get total hints used
     * @returns {number}
     */
    getTotalHints() {
        return this.state.hints.trend +
            this.state.hints.seasonality +
            this.state.hints.anomaly;
    }

    /**
     * Reset game state
     */
    reset() {
        this.stopTimer();
        this.state = {
            phase: 0,
            playerName: 'Analista Junior',
            trendSolved: false,
            seasonalitySolved: false,
            anomalySolved: false,
            hints: { trend: 0, seasonality: 0, anomaly: 0 },
            answers: { trend: null, seasonality: null, anomaly: null },
            startTime: null,
            completionTime: null,
            score: 0,
            achievements: []
        };
        localStorage.removeItem('detective_game_state');
        this.notifyObservers();
    }
}


// ============================================================
// 3. DATA ANALYZER
// ============================================================

class DataAnalyzer {
    constructor(dataset) {
        this.dataset = dataset;
        this.cache = {};
    }

    /**
     * Calculate trend line using OLS regression
     * @returns {Object} slope, intercept, r2, trendLine array
     */
    calculateTrend() {
        if (this.cache.trend) return this.cache.trend;

        const data = this.dataset.values;
        const n = data.length;

        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;

        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += data[i];
            sumXY += i * data[i];
            sumXX += i * i;
            sumYY += data[i] * data[i];
        }

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Calculate R²
        const yMean = sumY / n;
        let ssRes = 0, ssTot = 0;
        const trendLine = [];

        for (let i = 0; i < n; i++) {
            const predicted = slope * i + intercept;
            trendLine.push(predicted);
            ssRes += Math.pow(data[i] - predicted, 2);
            ssTot += Math.pow(data[i] - yMean, 2);
        }

        const r2 = 1 - (ssRes / ssTot);

        this.cache.trend = { slope, intercept, r2, trendLine };
        return this.cache.trend;
    }

    /**
     * Aggregate data by day of week
     * @returns {Array} 7 averages [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
     */
    aggregateByDayOfWeek() {
        if (this.cache.dayOfWeek) return this.cache.dayOfWeek;

        const sums = new Array(7).fill(0);
        const counts = new Array(7).fill(0);
        const labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

        this.dataset.dates.forEach((dateStr, i) => {
            const date = new Date(dateStr);
            // Convert JS day (0=Sun) to (0=Mon...6=Sun)
            let dayIndex = (date.getDay() + 6) % 7;
            sums[dayIndex] += this.dataset.values[i];
            counts[dayIndex]++;
        });

        const averages = sums.map((sum, i) => Math.round(sum / counts[i]));

        this.cache.dayOfWeek = { labels, averages };
        return this.cache.dayOfWeek;
    }

    /**
     * Calculate basic statistics
     * @returns {Object} min, max, mean, median, stdDev
     */
    calculateStats() {
        if (this.cache.stats) return this.cache.stats;

        const data = this.dataset.values;
        const n = data.length;
        const sorted = [...data].sort((a, b) => a - b);

        const sum = data.reduce((a, b) => a + b, 0);
        const mean = sum / n;

        const median = n % 2 === 0
            ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
            : sorted[Math.floor(n / 2)];

        const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
        const stdDev = Math.sqrt(variance);

        this.cache.stats = {
            min: sorted[0],
            max: sorted[n - 1],
            mean: Math.round(mean),
            median: Math.round(median),
            stdDev: Math.round(stdDev),
            count: n
        };

        return this.cache.stats;
    }

    /**
     * Format number for display
     * @param {number} num 
     * @returns {string}
     */
    formatNumber(num) {
        if (typeof numeral !== 'undefined') {
            return numeral(num).format('0,0');
        }
        return num.toLocaleString('es-ES');
    }
}


// ============================================================
// 4. ANSWER VALIDATOR
// ============================================================

class AnswerValidator {
    /**
     * Validate trend answer
     * @param {string} answer - 'uptrend', 'downtrend', or 'stable'
     * @returns {Object} { isCorrect, feedback }
     */
    static validateTrend(answer) {
        const isCorrect = answer === 'uptrend';
        return {
            isCorrect,
            feedback: isCorrect
                ? '¡Correcto! Has identificado que las ventas tienen una tendencia creciente.'
                : 'Esa no es la tendencia correcta. Observa la dirección general de los datos.'
        };
    }

    /**
     * Validate seasonality answer
     * @param {number} answer - Period in days
     * @returns {Object} { isCorrect, feedback }
     */
    static validateSeasonality(answer) {
        const isCorrect = answer === 7;
        return {
            isCorrect,
            feedback: isCorrect
                ? '¡Correcto! El patrón se repite cada 7 días (semanal).'
                : 'El período no es correcto. Busca patrones que se repitan regularmente.'
        };
    }

    /**
     * Validate anomaly answer
     * @param {number} answer - Number of anomalies
     * @returns {Object} { isCorrect, feedback }
     */
    static validateAnomaly(answer) {
        // Flexible range: 3-7 is acceptable
        const isCorrect = answer >= 3 && answer <= 7;
        let feedback;

        if (isCorrect) {
            feedback = '¡Bien visto! Has identificado correctamente el rango de anomalías.';
        } else if (answer < 3) {
            feedback = 'Parece que faltan algunas anomalías. Busca más eventos especiales.';
        } else {
            feedback = 'Has identificado demasiados puntos. Enfócate en los eventos más significativos.';
        }

        return { isCorrect, feedback };
    }
}


// ============================================================
// 5. CHART MANAGER
// ============================================================

class ChartManager {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#667eea',
            primaryLight: 'rgba(102, 126, 234, 0.1)',
            secondary: '#764ba2',
            success: '#4ade80',
            warning: '#ffc107',
            error: '#dc3545',
            gray: '#6b7280'
        };
    }

    /**
     * Get or create chart context
     * @param {string} canvasId 
     * @returns {CanvasRenderingContext2D}
     */
    getContext(canvasId) {
        const canvas = document.getElementById(canvasId);
        return canvas ? canvas.getContext('2d') : null;
    }

    /**
     * Destroy existing chart
     * @param {string} name 
     */
    destroyChart(name) {
        if (this.charts[name]) {
            this.charts[name].destroy();
            delete this.charts[name];
        }
    }

    /**
     * Create briefing chart (first 60 days)
     * @param {Object} dataset 
     */
    createBriefingChart(dataset) {
        this.destroyChart('main');
        const ctx = this.getContext('mainChart');
        if (!ctx) return;

        const slice = 60;

        this.charts.main = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataset.dates.slice(0, slice),
                datasets: [{
                    label: 'Unidades Vendidas (Primeros 60 días)',
                    data: dataset.values.slice(0, slice),
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primaryLight,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 6
                }]
            },
            options: this.getDefaultOptions('Serie Temporal: Muestra Inicial')
        });

        // Animate with anime.js
        this.animateChartEntry();
    }

    /**
     * Create full trend chart
     * @param {Object} dataset 
     * @param {boolean} showTrendLine 
     * @param {Array} trendLineData 
     */
    createTrendChart(dataset, showTrendLine = false, trendLineData = []) {
        this.destroyChart('main');
        const ctx = this.getContext('mainChart');
        if (!ctx) return;

        const datasets = [{
            label: 'Ventas Diarias 2022',
            data: dataset.values,
            borderColor: this.colors.primary,
            backgroundColor: this.colors.primaryLight,
            fill: false,
            tension: 0.3,
            pointRadius: 1,
            pointHoverRadius: 5
        }];

        if (showTrendLine && trendLineData.length) {
            datasets.push({
                label: 'Línea de Tendencia',
                data: trendLineData,
                borderColor: this.colors.warning,
                borderWidth: 3,
                borderDash: [8, 4],
                fill: false,
                pointRadius: 0,
                tension: 0
            });
        }

        this.charts.main = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataset.dates,
                datasets
            },
            options: this.getDefaultOptions('Serie Temporal Completa (304 días)')
        });

        // Update legend
        this.updateLegend(showTrendLine ? [
            { label: 'Datos reales', color: this.colors.primary },
            { label: 'Línea de tendencia', color: this.colors.warning }
        ] : [
            { label: 'Datos reales', color: this.colors.primary }
        ]);

        this.animateChartEntry();
    }

    /**
     * Create seasonality bar chart
     * @param {Object} aggregatedData - { labels, averages }
     * @param {boolean} isSolved 
     */
    createSeasonalityChart(aggregatedData, isSolved = false) {
        this.destroyChart('main');
        const ctx = this.getContext('mainChart');
        if (!ctx) return;

        const color = isSolved ? this.colors.success : this.colors.primary;

        this.charts.main = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: aggregatedData.labels,
                datasets: [{
                    label: 'Promedio de Ventas por Día',
                    data: aggregatedData.averages,
                    backgroundColor: aggregatedData.averages.map((_, i) => {
                        // Highlight max (Saturday) and min (Sunday)
                        if (i === 5) return this.colors.success; // Saturday
                        if (i === 6) return this.colors.error;   // Sunday
                        return color + (isSolved ? '' : 'cc');
                    }),
                    borderColor: color,
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                ...this.getDefaultOptions('Patrón de Estacionalidad Semanal'),
                plugins: {
                    ...this.getDefaultOptions().plugins,
                    annotation: {
                        annotations: isSolved ? {
                            maxLine: {
                                type: 'line',
                                yMin: Math.max(...aggregatedData.averages),
                                yMax: Math.max(...aggregatedData.averages),
                                borderColor: this.colors.success,
                                borderWidth: 2,
                                borderDash: [5, 5],
                                label: {
                                    display: true,
                                    content: 'Máximo (Sábado)',
                                    position: 'end'
                                }
                            }
                        } : {}
                    }
                }
            }
        });

        this.updateLegend([
            { label: 'Promedio diario', color },
            { label: 'Día más alto', color: this.colors.success },
            { label: 'Día más bajo', color: this.colors.error }
        ]);

        this.animateChartEntry();
    }

    /**
     * Create anomaly scatter chart
     * @param {Object} dataset 
     * @param {Array} anomalies 
     * @param {boolean} showAnomalies 
     */
    createAnomalyChart(dataset, anomalies, showAnomalies = false) {
        this.destroyChart('main');
        const ctx = this.getContext('mainChart');
        if (!ctx) return;

        // Create scatter data with colors
        const anomalyDates = anomalies.map(a => a.date);

        const scatterData = dataset.dates.map((date, i) => ({
            x: i,
            y: dataset.values[i]
        }));

        const colors = dataset.dates.map(date =>
            anomalyDates.includes(date) ? this.colors.error : this.colors.primary
        );

        const sizes = dataset.dates.map(date =>
            anomalyDates.includes(date) ? 8 : 3
        );

        // Annotations for anomalies
        const annotations = {};
        if (showAnomalies) {
            anomalies.forEach((anomaly, idx) => {
                const dateIndex = dataset.dates.indexOf(anomaly.date);
                if (dateIndex !== -1) {
                    annotations[`anomaly${idx}`] = {
                        type: 'point',
                        xValue: dateIndex,
                        yValue: dataset.values[dateIndex],
                        backgroundColor: 'rgba(220, 53, 69, 0.3)',
                        borderColor: this.colors.error,
                        borderWidth: 3,
                        radius: 20
                    };
                    annotations[`label${idx}`] = {
                        type: 'label',
                        xValue: dateIndex,
                        yValue: dataset.values[dateIndex] + 1500,
                        content: anomaly.event,
                        backgroundColor: 'rgba(220, 53, 69, 0.8)',
                        color: 'white',
                        font: { size: 10 },
                        padding: 4,
                        borderRadius: 4
                    };
                }
            });
        }

        this.charts.main = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Ventas Diarias',
                    data: scatterData,
                    backgroundColor: colors,
                    pointRadius: sizes,
                    pointHoverRadius: 10
                }]
            },
            options: {
                ...this.getDefaultOptions('Detección de Anomalías'),
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: { display: true, text: 'Día del Año (0-303)' },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    y: {
                        title: { display: true, text: 'Unidades Vendidas' },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    }
                },
                plugins: {
                    ...this.getDefaultOptions().plugins,
                    annotation: { annotations }
                }
            }
        });

        this.updateLegend([
            { label: 'Datos normales', color: this.colors.primary },
            { label: 'Anomalías', color: this.colors.error }
        ]);

        this.animateChartEntry();
    }

    /**
     * Create final summary chart
     * @param {Object} dataset 
     * @param {Array} trendLine 
     */
    createSummaryChart(dataset, trendLine) {
        this.destroyChart('main');
        const ctx = this.getContext('mainChart');
        if (!ctx) return;

        this.charts.main = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataset.dates,
                datasets: [
                    {
                        label: 'Ventas Reales',
                        data: dataset.values,
                        borderColor: this.colors.primary,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 1
                    },
                    {
                        label: 'Tendencia',
                        data: trendLine,
                        borderColor: this.colors.success,
                        borderWidth: 3,
                        borderDash: [8, 4],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: this.getDefaultOptions('Análisis Completo: Caso Resuelto')
        });

        this.updateLegend([
            { label: 'Ventas reales', color: this.colors.primary },
            { label: 'Tendencia identificada', color: this.colors.success }
        ]);
    }

    /**
     * Get default chart options
     * @param {string} title 
     * @returns {Object}
     */
    getDefaultOptions(title = '') {
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: { display: false },
                title: {
                    display: !!title,
                    text: title,
                    font: { size: 14, weight: '500' },
                    color: '#374151'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { size: 13 },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (context) => {
                            const value = typeof numeral !== 'undefined'
                                ? numeral(context.parsed.y).format('0,0')
                                : context.parsed.y.toLocaleString();
                            return `Unidades: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { maxRotation: 45, minRotation: 45 }
                },
                y: {
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    beginAtZero: false
                }
            }
        };
    }

    /**
     * Update chart legend
     * @param {Array} items - [{ label, color }]
     */
    updateLegend(items) {
        const legendEl = document.getElementById('chartLegend');
        if (!legendEl) return;

        legendEl.innerHTML = items.map(item => `
            <span class="legend-item">
                <span class="legend-color" style="background: ${item.color};"></span>
                ${item.label}
            </span>
        `).join('');
    }

    /**
     * Animate chart entry with anime.js
     */
    animateChartEntry() {
        if (typeof anime !== 'undefined') {
            anime({
                targets: '#mainChart',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 600,
                easing: 'easeOutCubic'
            });
        }
    }
}


// ============================================================
// 6. SCORING SYSTEM
// ============================================================

class ScoringSystem {
    /**
     * Calculate final score
     * @param {Object} state - Game state
     * @returns {Object} { score, breakdown, achievements }
     */
    static calculate(state) {
        let score = 0;
        const breakdown = [];
        const achievements = [];

        // Base points for correct answers (100 each)
        if (state.trendSolved) {
            score += 100;
            breakdown.push({ label: 'Tendencia correcta', points: 100 });
        }
        if (state.seasonalitySolved) {
            score += 100;
            breakdown.push({ label: 'Estacionalidad correcta', points: 100 });
        }
        if (state.anomalySolved) {
            score += 100;
            breakdown.push({ label: 'Anomalías correctas', points: 100 });
        }

        // Hint penalties (-10 per hint, max -90)
        const hintsUsed = state.hints.trend + state.hints.seasonality + state.hints.anomaly;
        const hintPenalty = hintsUsed * 10;
        if (hintPenalty > 0) {
            score -= hintPenalty;
            breakdown.push({ label: `Pistas usadas (${hintsUsed})`, points: -hintPenalty });
        }

        // Time bonus (if under 10 minutes: +50, under 5 min: +100)
        if (state.completionTime) {
            const minutes = state.completionTime / 60000;
            if (minutes < 5) {
                score += 100;
                breakdown.push({ label: 'Bonus velocidad (<5 min)', points: 100 });
                achievements.push({ id: 'speed_demon', name: '⚡ Velocista', desc: 'Completado en menos de 5 minutos' });
            } else if (minutes < 10) {
                score += 50;
                breakdown.push({ label: 'Bonus velocidad (<10 min)', points: 50 });
            }
        }

        // Perfect score achievement
        if (hintsUsed === 0 && state.trendSolved && state.seasonalitySolved && state.anomalySolved) {
            achievements.push({ id: 'no_hints', name: '🎯 Análisis Puro', desc: 'Sin usar ninguna pista' });
        }

        // All correct achievement
        if (state.trendSolved && state.seasonalitySolved && state.anomalySolved) {
            achievements.push({ id: 'detective', name: '🏆 Detective Maestro', desc: 'Todos los análisis correctos' });
        }

        return {
            score: Math.max(0, score),
            breakdown,
            achievements
        };
    }
}


// ============================================================
// 7. UI CONTROLLER
// ============================================================

class UIController {
    constructor(gameState, dataAnalyzer, chartManager) {
        this.gameState = gameState;
        this.dataAnalyzer = dataAnalyzer;
        this.chartManager = chartManager;
        this.setupEventListeners();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Start Investigation
        document.getElementById('btnStartInvestigation')?.addEventListener('click', () => {
            this.gameState.startTimer();
            this.moveToPhase(1);
        });

        // Phase 1: Trend
        document.getElementById('btnTrendSubmit')?.addEventListener('click', () => this.submitTrend());
        document.getElementById('btnTrendHint')?.addEventListener('click', () => this.showHint('trend'));
        document.getElementById('btnTrendNext')?.addEventListener('click', () => this.moveToPhase(2));

        // Phase 2: Seasonality
        document.getElementById('btnSeasonalitySubmit')?.addEventListener('click', () => this.submitSeasonality());
        document.getElementById('btnSeasonalityHint')?.addEventListener('click', () => this.showHint('seasonality'));
        document.getElementById('btnSeasonalityNext')?.addEventListener('click', () => this.moveToPhase(3));

        // Phase 3: Anomaly
        document.getElementById('btnAnomalySubmit')?.addEventListener('click', () => this.submitAnomaly());
        document.getElementById('btnAnomalyHint')?.addEventListener('click', () => this.showHint('anomaly'));
        document.getElementById('btnAnomalyNext')?.addEventListener('click', () => this.moveToPhase(4));

        // Phase 4: Resolution
        document.getElementById('btnRestart')?.addEventListener('click', () => this.restartGame());
        document.getElementById('btnDownloadReport')?.addEventListener('click', () => this.downloadReport());

        // Modal
        document.getElementById('btnModalClose')?.addEventListener('click', () => this.closeModal());
        document.getElementById('modalBackdrop')?.addEventListener('click', () => this.closeModal());

        // Enter key for inputs
        document.getElementById('seasonalityInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitSeasonality();
        });
        document.getElementById('anomalyInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitAnomaly();
        });
    }

    /**
     * Move to specified phase
     * @param {number} phase 
     */
    moveToPhase(phase) {
        const currentPhase = this.gameState.state.phase;

        // Hide current phase
        document.querySelector(`#phase-${currentPhase}`)?.classList.remove('active');

        // Show new phase
        document.querySelector(`#phase-${phase}`)?.classList.add('active');

        // Update progress bar
        this.updateProgressBar(phase);

        // Update chart
        this.updateChartForPhase(phase);

        // Update state
        this.gameState.setState({ phase });

        // Animate phase entry
        if (typeof anime !== 'undefined') {
            anime({
                targets: `#phase-${phase} .card`,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 600,
                easing: 'easeOutCubic'
            });
        }

        // If final phase, calculate score
        if (phase === 4) {
            this.showFinalResults();
        }
    }

    /**
     * Update progress bar
     * @param {number} currentPhase 
     */
    updateProgressBar(currentPhase) {
        const steps = document.querySelectorAll('.progress-step');
        const fill = document.getElementById('progressFill');

        steps.forEach((step, i) => {
            step.classList.remove('active', 'completed');
            if (i < currentPhase) {
                step.classList.add('completed');
            } else if (i === currentPhase) {
                step.classList.add('active');
            }
        });

        // Update fill bar
        const percentage = (currentPhase / 4) * 100;
        if (fill) fill.style.width = `${percentage}%`;
    }

    /**
     * Update chart for current phase
     * @param {number} phase 
     */
    updateChartForPhase(phase) {
        switch (phase) {
            case 0:
                this.chartManager.createBriefingChart(realDataset);
                break;
            case 1:
                const trendData = this.gameState.state.trendSolved
                    ? this.dataAnalyzer.calculateTrend().trendLine
                    : [];
                this.chartManager.createTrendChart(realDataset, this.gameState.state.trendSolved, trendData);
                break;
            case 2:
                const dayData = this.dataAnalyzer.aggregateByDayOfWeek();
                this.chartManager.createSeasonalityChart(dayData, this.gameState.state.seasonalitySolved);
                break;
            case 3:
                this.chartManager.createAnomalyChart(realDataset, anomaliesInfo, this.gameState.state.anomalySolved);
                break;
            case 4:
                const trend = this.dataAnalyzer.calculateTrend();
                this.chartManager.createSummaryChart(realDataset, trend.trendLine);
                break;
        }
    }

    /**
     * Submit trend answer
     */
    submitTrend() {
        const selected = document.querySelector('input[name="trendAnswer"]:checked');
        if (!selected) {
            this.showModal('⚠️', 'Selecciona una opción', 'Debes elegir una respuesta antes de enviar.');
            return;
        }

        const answer = selected.value;
        const result = AnswerValidator.validateTrend(answer);

        this.gameState.setState({
            answers: { ...this.gameState.state.answers, trend: answer },
            trendSolved: result.isCorrect
        });

        if (result.isCorrect) {
            this.onCorrectAnswer('trend');
            // Show trend line
            const trendData = this.dataAnalyzer.calculateTrend().trendLine;
            this.chartManager.createTrendChart(realDataset, true, trendData);
        } else {
            this.onIncorrectAnswer('trend', result.feedback);
        }
    }

    /**
     * Submit seasonality answer
     */
    submitSeasonality() {
        const input = document.getElementById('seasonalityInput');
        const answer = parseInt(input.value);

        if (isNaN(answer) || answer < 1) {
            this.showModal('⚠️', 'Ingresa un número', 'Debes ingresar un número válido de días.');
            return;
        }

        const result = AnswerValidator.validateSeasonality(answer);

        this.gameState.setState({
            answers: { ...this.gameState.state.answers, seasonality: answer },
            seasonalitySolved: result.isCorrect
        });

        if (result.isCorrect) {
            this.onCorrectAnswer('seasonality');
            const dayData = this.dataAnalyzer.aggregateByDayOfWeek();
            this.chartManager.createSeasonalityChart(dayData, true);
        } else {
            this.onIncorrectAnswer('seasonality', result.feedback);
        }
    }

    /**
     * Submit anomaly answer
     */
    submitAnomaly() {
        const input = document.getElementById('anomalyInput');
        const answer = parseInt(input.value);

        if (isNaN(answer) || answer < 0) {
            this.showModal('⚠️', 'Ingresa un número', 'Debes ingresar un número válido de anomalías.');
            return;
        }

        const result = AnswerValidator.validateAnomaly(answer);

        this.gameState.setState({
            answers: { ...this.gameState.state.answers, anomaly: answer },
            anomalySolved: result.isCorrect
        });

        if (result.isCorrect) {
            this.onCorrectAnswer('anomaly');
            this.chartManager.createAnomalyChart(realDataset, anomaliesInfo, true);
        } else {
            this.onIncorrectAnswer('anomaly', result.feedback);
        }
    }

    /**
     * Handle correct answer
     * @param {string} phase 
     */
    onCorrectAnswer(phase) {
        // Show explanation
        document.getElementById(`${phase}-explanation`)?.classList.remove('hidden');

        // Hide hints panel
        document.getElementById(`${phase}-hints`)?.classList.add('hidden');

        // Show next button, hide submit
        document.getElementById(`btn${this.capitalize(phase)}Submit`)?.classList.add('hidden');
        document.getElementById(`btn${this.capitalize(phase)}Hint`)?.classList.add('hidden');
        document.getElementById(`btn${this.capitalize(phase)}Next`)?.classList.remove('hidden');

        // Update score display
        this.updateScoreDisplay();

        // Show success modal
        this.showModal('✅', '¡Correcto!', 'Has identificado el patrón correctamente.');

        // Celebrate with confetti
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    /**
     * Handle incorrect answer
     * @param {string} phase 
     * @param {string} feedback 
     */
    onIncorrectAnswer(phase, feedback) {
        this.showModal('❌', 'No es correcto', feedback);

        // Shake animation on input
        if (typeof anime !== 'undefined') {
            anime({
                targets: `#phase-${this.gameState.state.phase} .form-group`,
                translateX: [-5, 5, -5, 5, 0],
                duration: 400,
                easing: 'easeInOutSine'
            });
        }
    }

    /**
     * Show hint for phase
     * @param {string} phase 
     */
    showHint(phase) {
        const hintsUsed = this.gameState.state.hints[phase];

        if (hintsUsed >= 3) {
            this.showModal('💡', 'Sin más pistas', 'Ya has usado todas las pistas disponibles para esta fase.');
            return;
        }

        // Increment hints
        const newHints = { ...this.gameState.state.hints };
        newHints[phase]++;
        this.gameState.setState({ hints: newHints });

        // Show hints panel
        const hintsPanel = document.getElementById(`${phase}-hints`);
        const hintsContent = document.getElementById(`${phase}-hints-content`);
        const hintCount = document.getElementById(`${phase}HintCount`);

        if (hintsPanel && hintsContent) {
            hintsPanel.classList.remove('hidden');

            // Add hint item
            const hintText = hintsConfig[phase][hintsUsed];
            const hintItem = document.createElement('div');
            hintItem.className = 'hint-item';
            hintItem.innerHTML = `
                <span class="hint-level">Pista ${hintsUsed + 1}</span>
                <p>${hintText}</p>
            `;
            hintsContent.appendChild(hintItem);

            // Update counter
            if (hintCount) hintCount.textContent = hintsUsed + 1;
        }

        // Update score display
        this.updateScoreDisplay();
    }

    /**
     * Update score display in footer
     */
    updateScoreDisplay() {
        const state = this.gameState.state;
        const hintsUsed = state.hints.trend + state.hints.seasonality + state.hints.anomaly;

        document.getElementById('scoreHints').textContent = `${hintsUsed}/9`;

        let currentScore = 0;
        if (state.trendSolved) currentScore += 100;
        if (state.seasonalitySolved) currentScore += 100;
        if (state.anomalySolved) currentScore += 100;
        currentScore -= hintsUsed * 10;

        document.getElementById('scorePoints').textContent = Math.max(0, currentScore);
    }

    /**
     * Show final results
     */
    showFinalResults() {
        this.gameState.stopTimer();

        const result = ScoringSystem.calculate(this.gameState.state);

        // Update final score
        document.getElementById('finalScore').textContent = result.score;
        document.getElementById('finalAnomalies').textContent =
            this.gameState.state.answers.anomaly || '4';

        // Show achievements
        if (result.achievements.length > 0) {
            const achievementsSection = document.getElementById('achievements-section');
            const achievementsList = document.getElementById('achievements-list');

            if (achievementsSection && achievementsList) {
                achievementsList.innerHTML = result.achievements.map(a => `
                    <div style="background: white; padding: 0.75rem 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem;">${a.name.split(' ')[0]}</div>
                        <div style="font-weight: 600; font-size: 0.875rem;">${a.name.split(' ').slice(1).join(' ')}</div>
                        <div style="font-size: 0.75rem; color: #6b7280;">${a.desc}</div>
                    </div>
                `).join('');
            }
        }

        // Big celebration
        if (typeof confetti !== 'undefined') {
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });

                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        }
    }

    /**
     * Restart game
     */
    restartGame() {
        this.gameState.reset();

        // Reset UI elements
        document.querySelectorAll('.phase-section').forEach(el => el.classList.remove('active'));
        document.getElementById('phase-0').classList.add('active');

        // Reset buttons
        ['Trend', 'Seasonality', 'Anomaly'].forEach(phase => {
            document.getElementById(`btn${phase}Submit`)?.classList.remove('hidden');
            document.getElementById(`btn${phase}Hint`)?.classList.remove('hidden');
            document.getElementById(`btn${phase}Next`)?.classList.add('hidden');
        });

        // Reset explanations and hints
        document.querySelectorAll('.explanation-box:not([style*="display: block"])').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.hints-panel').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('[id$="-hints-content"]').forEach(el => el.innerHTML = '');

        // Reset radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);

        // Reset inputs
        document.getElementById('seasonalityInput').value = '';
        document.getElementById('anomalyInput').value = '';

        // Reset progress bar
        this.updateProgressBar(0);

        // Reset score display
        document.getElementById('scorePoints').textContent = '0';
        document.getElementById('scoreHints').textContent = '0/9';
        document.getElementById('scoreTime').textContent = '0:00';

        // Reset chart
        this.chartManager.createBriefingChart(realDataset);
    }

    /**
     * Download report (mock)
     */
    downloadReport() {
        this.showModal('📥', 'Informe Generado', 'El informe del caso se ha generado correctamente. (Simulación)');
    }

    /**
     * Show modal
     */
    showModal(icon, title, message) {
        const modal = document.getElementById('feedbackModal');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');

        if (modal && modalIcon && modalTitle && modalMessage) {
            modalIcon.textContent = icon;
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            modal.classList.add('active');
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        document.getElementById('feedbackModal')?.classList.remove('active');
    }

    /**
     * Capitalize first letter
     * @param {string} str 
     * @returns {string}
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}


// ============================================================
// 8. DETECTIVE GAME (Main Orchestrator)
// ============================================================

class DetectiveGame {
    constructor() {
        console.log('🔍 Inicializando Detective de Datos...');

        // Initialize modules
        this.stateManager = new GameStateManager();
        this.dataAnalyzer = new DataAnalyzer(realDataset);
        this.chartManager = new ChartManager();
        this.uiController = new UIController(
            this.stateManager,
            this.dataAnalyzer,
            this.chartManager
        );

        // Subscribe to state changes
        this.stateManager.subscribe((state) => {
            this.onStateChange(state);
        });

        // Initialize
        this.init();
    }

    /**
     * Initialize game
     */
    init() {
        // Check for saved state
        const hasLoadedState = this.stateManager.loadFromLocalStorage();

        if (hasLoadedState && this.stateManager.state.phase > 0) {
            console.log('📂 Estado anterior cargado');
            // Restore to saved phase would go here
            // For now, just start fresh
        }

        // Render initial chart
        this.chartManager.createBriefingChart(realDataset);

        // Log stats
        const stats = this.dataAnalyzer.calculateStats();
        console.log('📊 Estadísticas del dataset:', stats);

        console.log('✅ Detective de Datos listo');
    }

    /**
     * Handle state changes
     * @param {Object} state 
     */
    onStateChange(state) {
        // Could add global state change handlers here
    }
}


// ============================================================
// 9. INITIALIZATION
// ============================================================

// Wait for DOM and libraries
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all CDN libraries are loaded
    setTimeout(() => {
        window.game = new DetectiveGame();
    }, 100);
});
