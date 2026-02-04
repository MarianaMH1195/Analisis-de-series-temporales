# 🏗️ Arquitectura Técnica - Detective de Datos

> Documentación técnica completa del juego educativo de análisis de series temporales

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Arquitectura de Clases](#arquitectura-de-clases)
4. [Flujo de Datos](#flujo-de-datos)
5. [Estado del Juego](#estado-del-juego)
6. [Algoritmos Implementados](#algoritmos-implementados)
7. [Gráficos Chart.js](#gráficos-chartjs)
8. [Sistema de Validación](#sistema-de-validación)

---

## 🎯 Visión General

### Principios de Diseño

1. **Separación de Responsabilidades**: Cada clase tiene una única responsabilidad
2. **Observer Pattern**: El estado notifica cambios a los observadores
3. **Modularidad**: Componentes independientes y reutilizables
4. **Offline-First**: Todos los datos en memoria, sin servidor

### Stack Tecnológico

```
┌─────────────────────────────────────────┐
│              FRONTEND                    │
├─────────────────────────────────────────┤
│  HTML5     │  CSS3      │  JavaScript   │
│  Semántico │  Variables │  ES6+ Vanilla │
├─────────────────────────────────────────┤
│              LIBRERÍAS CDN               │
├─────────────────────────────────────────┤
│ Chart.js 4.4 │ Anime.js │ Confetti.js  │
│ Annotation   │ 3.2.1    │ 1.9.0        │
└─────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos

```
📦 Detective-de-Datos/
│
├── 📄 index.html (26KB)
│   ├── <head> - Meta, fonts, CSS variables
│   ├── <style> - 800+ líneas de CSS
│   ├── <body> - Estructura semántica
│   │   ├── .app-header - Logo + Progress bar
│   │   ├── .main-content - Fases del juego
│   │   ├── .score-bar - Barra de puntuación
│   │   └── .modal - Feedback modal
│   └── <script> - CDN imports
│
├── 📄 game-logic.js (30KB)
│   ├── Dataset (304 observaciones)
│   ├── GameStateManager (Observer)
│   ├── DataAnalyzer (Cálculos)
│   ├── AnswerValidator (Validación)
│   ├── ChartManager (Gráficos)
│   ├── ScoringSystem (Puntuación)
│   ├── UIController (Eventos)
│   └── DetectiveGame (Orquestador)
│
└── 📄 Documentación
    ├── README.md
    ├── ARQUITECTURA.md (este archivo)
    ├── DATOS.md
    └── GUIA_DOCENTES.md
```

---

## 🏛️ Arquitectura de Clases

### Diagrama de Clases

```
┌─────────────────────────────────────────────────────────────┐
│                      DetectiveGame                          │
│  ─────────────────────────────────────────────────────────  │
│  - stateManager: GameStateManager                           │
│  - dataAnalyzer: DataAnalyzer                               │
│  - chartManager: ChartManager                               │
│  - uiController: UIController                               │
│  ─────────────────────────────────────────────────────────  │
│  + init(): void                                             │
│  + onStateChange(state): void                               │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ GameStateManager│  │  DataAnalyzer   │  │  ChartManager   │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ - state: Object │  │ - dataset       │  │ - charts: {}    │
│ - observers: [] │  │ - cache: {}     │  │ - colors: {}    │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ + setState()    │  │ + calcTrend()   │  │ + createChart() │
│ + subscribe()   │  │ + aggregateDay()│  │ + destroyChart()│
│ + startTimer()  │  │ + calcStats()   │  │ + updateLegend()│
│ + saveLocal()   │  │ + formatNum()   │  │ + animate()     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │
         ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  UIController   │  │ AnswerValidator │  │  ScoringSystem  │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ - gameState     │  │ (static class)  │  │ (static class)  │
│ - dataAnalyzer  │  ├─────────────────┤  ├─────────────────┤
│ - chartManager  │  │ + validateTrend │  │ + calculate()   │
├─────────────────┤  │ + validateSeas. │  └─────────────────┘
│ + setupEvents() │  │ + validateAnom. │
│ + moveToPhase() │  └─────────────────┘
│ + submitAnswer()│
│ + showHint()    │
│ + showModal()   │
└─────────────────┘
```

### Responsabilidades por Clase

| Clase | Responsabilidad |
|-------|-----------------|
| `DetectiveGame` | Orquestar la inicialización y coordinar módulos |
| `GameStateManager` | Gestionar estado, notificar cambios, persistencia |
| `DataAnalyzer` | Cálculos estadísticos (OLS, agregación, stats) |
| `ChartManager` | Crear, actualizar y destruir gráficos Chart.js |
| `AnswerValidator` | Validar respuestas del usuario con feedback |
| `ScoringSystem` | Calcular puntuación final y logros |
| `UIController` | Manejar eventos DOM y actualizar interfaz |

---

## 🔄 Flujo de Datos

### Diagrama de Secuencia: Envío de Respuesta

```
Usuario          UIController       AnswerValidator     GameStateManager     ChartManager
   │                  │                   │                    │                  │
   │  Click Submit    │                   │                    │                  │
   │─────────────────>│                   │                    │                  │
   │                  │                   │                    │                  │
   │                  │  validate(answer) │                    │                  │
   │                  │──────────────────>│                    │                  │
   │                  │                   │                    │                  │
   │                  │  {isCorrect, msg} │                    │                  │
   │                  │<──────────────────│                    │                  │
   │                  │                   │                    │                  │
   │                  │         setState({solved: true})       │                  │
   │                  │───────────────────────────────────────>│                  │
   │                  │                   │                    │                  │
   │                  │                   │    notifyObservers │                  │
   │                  │                   │<───────────────────│                  │
   │                  │                   │                    │                  │
   │                  │              updateChart(withTrendLine)│                  │
   │                  │────────────────────────────────────────────────────────>│
   │                  │                   │                    │                  │
   │     showModal    │                   │                    │                  │
   │<─────────────────│                   │                    │                  │
```

---

## 💾 Estado del Juego

### Estructura del Estado (`gameState`)

```javascript
const gameState = {
    // Fase actual (0-4)
    phase: 0,
    
    // Nombre del jugador
    playerName: 'Analista Junior',
    
    // Banderas de resolución
    trendSolved: false,
    seasonalitySolved: false,
    anomalySolved: false,
    
    // Contador de pistas usadas
    hints: {
        trend: 0,        // Máximo 3
        seasonality: 0,  // Máximo 3
        anomaly: 0       // Máximo 3
    },
    
    // Respuestas del usuario
    answers: {
        trend: null,        // 'uptrend' | 'downtrend' | 'stable'
        seasonality: null,  // número (esperado: 7)
        anomaly: null       // número (rango: 3-7)
    },
    
    // Tiempos
    startTime: null,        // Timestamp inicio
    completionTime: null,   // Duración en ms
    
    // Puntuación
    score: 0,
    achievements: []        // Array de logros
};
```

### Persistencia (localStorage)

```javascript
// Guardar
localStorage.setItem('detective_game_state', JSON.stringify({
    ...state,
    savedAt: Date.now()
}));

// Cargar (solo si < 24 horas)
const saved = JSON.parse(localStorage.getItem('detective_game_state'));
if (Date.now() - saved.savedAt < 86400000) {
    // Restaurar estado
}
```

---

## 📐 Algoritmos Implementados

### 1. Regresión Lineal (OLS)

Calcula la línea de tendencia usando mínimos cuadrados ordinarios.

```javascript
function calculateTrend() {
    const data = this.dataset.values;  // 304 valores
    const n = data.length;
    
    // Sumatorias
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    for (let i = 0; i < n; i++) {
        sumX += i;           // X = índice (0-303)
        sumY += data[i];     // Y = valor
        sumXY += i * data[i];
        sumXX += i * i;
    }
    
    // Pendiente: m = (n*ΣXY - ΣX*ΣY) / (n*ΣX² - (ΣX)²)
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    // Intercepto: b = (ΣY - m*ΣX) / n
    const intercept = (sumY - slope * sumX) / n;
    
    // Generar línea de tendencia
    const trendLine = [];
    for (let i = 0; i < n; i++) {
        trendLine.push(slope * i + intercept);
    }
    
    return { slope, intercept, trendLine };
}
```

**Resultado esperado:**
- Pendiente (slope): ~53.8 unidades/día
- Intercepto: ~6,543

### 2. Agregación por Día de Semana

```javascript
function aggregateByDayOfWeek() {
    const sums = new Array(7).fill(0);
    const counts = new Array(7).fill(0);
    
    this.dataset.dates.forEach((dateStr, i) => {
        const date = new Date(dateStr);
        // Convertir: JS(0=Dom) → (0=Lun...6=Dom)
        const dayIndex = (date.getDay() + 6) % 7;
        sums[dayIndex] += this.dataset.values[i];
        counts[dayIndex]++;
    });
    
    const averages = sums.map((sum, i) => Math.round(sum / counts[i]));
    
    return {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        averages
    };
}
```

**Resultado esperado:**
| Día | Promedio |
|-----|----------|
| Lun | ~14,800 |
| Mar | ~15,100 |
| Mié | ~14,950 |
| Jue | ~15,300 |
| Vie | ~15,500 |
| **Sáb** | **~16,100** (máx) |
| Dom | ~14,200 (mín) |

### 3. Detección de Anomalías

```javascript
const anomaliesInfo = [
    { date: '2022-01-01', event: 'Año Nuevo', impact: -58 },
    { date: '2022-05-01', event: 'Día del Trabajo', impact: -11 },
    { date: '2022-05-02', event: 'Post-Festivo', impact: -12 },
    { date: '2022-10-31', event: 'Halloween Promo', impact: +50 }
];

// Colorear puntos según si son anomalías
const colors = dataset.dates.map(date => 
    anomalyDates.includes(date) ? '#dc3545' : '#667eea'
);
```

---

## 📊 Gráficos Chart.js

### Configuración por Fase

| Fase | Tipo | Descripción |
|------|------|-------------|
| 0 | `line` | Primeros 60 días, datos crudos |
| 1 | `line` | 304 días + línea de tendencia (si resuelto) |
| 2 | `bar` | 7 barras (promedio por día de semana) |
| 3 | `scatter` | 304 puntos, anomalías en rojo |
| 4 | `line` | Resumen con tendencia superpuesta |

### Paleta de Colores

```javascript
const colors = {
    primary: '#667eea',      // Azul principal
    primaryLight: 'rgba(102, 126, 234, 0.1)',
    secondary: '#764ba2',    // Púrpura
    success: '#4ade80',      // Verde
    warning: '#ffc107',      // Amarillo
    error: '#dc3545',        // Rojo
    gray: '#6b7280'
};
```

---

## ✅ Sistema de Validación

### Respuestas Correctas

| Fase | Pregunta | Respuesta Correcta |
|------|----------|-------------------|
| 1 | ¿Cuál es la tendencia? | `uptrend` (Creciente) |
| 2 | ¿Período de estacionalidad? | `7` (exactamente) |
| 3 | ¿Cuántas anomalías? | `3-7` (rango flexible) |

### Validadores

```javascript
class AnswerValidator {
    static validateTrend(answer) {
        return { isCorrect: answer === 'uptrend', feedback: '...' };
    }
    
    static validateSeasonality(answer) {
        return { isCorrect: answer === 7, feedback: '...' };
    }
    
    static validateAnomaly(answer) {
        return { isCorrect: answer >= 3 && answer <= 7, feedback: '...' };
    }
}
```

---

## 🎯 Sistema de Puntuación

### Cálculo Final

```javascript
static calculate(state) {
    let score = 0;
    
    // Base: +100 por fase correcta
    if (state.trendSolved) score += 100;
    if (state.seasonalitySolved) score += 100;
    if (state.anomalySolved) score += 100;
    
    // Penalización: -10 por pista
    const hintsUsed = state.hints.trend + 
                      state.hints.seasonality + 
                      state.hints.anomaly;
    score -= hintsUsed * 10;
    
    // Bonus tiempo
    const minutes = state.completionTime / 60000;
    if (minutes < 5) score += 100;      // Velocista
    else if (minutes < 10) score += 50; // Rápido
    
    return Math.max(0, score);
}
```

### Puntuación Máxima

| Concepto | Puntos |
|----------|--------|
| 3 fases correctas | +300 |
| 0 pistas usadas | +0 |
| Bonus <5 minutos | +100 |
| **TOTAL MÁXIMO** | **400** |

---

## 🔧 Extensibilidad

### Añadir Nueva Fase

1. Agregar HTML en `index.html`:
```html
<section id="phase-5" class="phase-section" data-phase="5">
    <!-- Contenido -->
</section>
```

2. Agregar step en progress bar
3. Actualizar `moveToPhase()` en UIController
4. Agregar validador en AnswerValidator
5. Agregar gráfico en ChartManager

### Añadir Nuevo Dataset

1. Modificar `generateRealDataset()` en game-logic.js
2. Actualizar anomalías
3. Recalibrar respuestas correctas
4. Actualizar explicaciones

---

## 📝 Notas de Implementación

1. **Performance**: Todos los cálculos son O(n) donde n=304
2. **Cache**: DataAnalyzer usa memoización para evitar recálculos
3. **Responsive**: Breakpoints en 768px y 480px
4. **Accesibilidad**: Labels en todos los inputs, roles ARIA básicos
5. **Compatibilidad**: ES6+, navegadores modernos

---

<p align="center">
  <em>Documentación de Arquitectura v2.0</em>
</p>
