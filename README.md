# 🔍 Detective de Datos

> **Píldora Formativa Interactiva de Análisis de Series Temporales**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

---

## 📋 Descripción

**Detective de Datos** es un juego educativo interactivo diseñado para enseñar los conceptos fundamentales del análisis de series temporales. El jugador adopta el rol de un detective de datos que debe investigar patrones en datos de ventas reales de una cadena minorista.

### 🎯 Objetivos de Aprendizaje

1. **Identificar tendencias** en series temporales (creciente, decreciente, estable)
2. **Detectar estacionalidad** y patrones cíclicos en los datos
3. **Reconocer anomalías** y eventos especiales que afectan el comportamiento normal
4. **Interpretar comercialmente** los hallazgos de un análisis de series temporales

---

## 🎮 Cómo Jugar

### Fases del Juego

| Fase | Nombre | Descripción |
|------|--------|-------------|
| 0 | **Briefing** | Introducción al caso y contexto de la investigación |
| 1 | **Tendencia** | Identificar la dirección general de las ventas |
| 2 | **Estacionalidad** | Descubrir el patrón de repetición (semanal) |
| 3 | **Anomalías** | Detectar eventos especiales en los datos |
| 4 | **Resolución** | Resumen ejecutivo del análisis completo |

### Sistema de Puntuación

- ✅ **+100 puntos** por cada fase correcta
- 💡 **-10 puntos** por cada pista utilizada
- ⚡ **+100 puntos** bonus si completas en menos de 5 minutos
- ⏱️ **+50 puntos** bonus si completas en menos de 10 minutos

### Logros Desbloqueables

| Logro | Requisito |
|-------|-----------|
| 🎯 Análisis Puro | Completar sin usar ninguna pista |
| ⚡ Velocista | Completar en menos de 5 minutos |
| 🏆 Detective Maestro | Todos los análisis correctos |

---

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet (para cargar librerías CDN)

### Ejecución Local
```bash
# Clonar el repositorio
git clone https://github.com/MarianaMH1195/Analisis-de-series-temporales.git

# Navegar al directorio
cd Analisis-de-series-temporales

# Abrir en el navegador (Windows)
start index.html

# O simplemente hacer doble clic en index.html
```

### Estructura del Proyecto
```
📁 Analisis-de-series-temporales/
├── 📄 index.html          # Estructura HTML + CSS integrado
├── 📄 game-logic.js       # Lógica del juego (arquitectura modular)
├── 📄 README.md           # Este archivo
├── 📄 ARQUITECTURA.md     # Documentación técnica
├── 📄 DATOS.md            # Análisis del dataset
└── 📄 GUIA_DOCENTES.md    # Manual para instructores
```

---

## 📊 Dataset

El juego utiliza datos reales del **Retail Store Inventory 2022**:

| Característica | Valor |
|----------------|-------|
| **Período** | 2022-01-01 a 2022-10-31 |
| **Observaciones** | 304 días consecutivos |
| **Variable** | Unidades Vendidas Diarias |
| **Fuente** | Kaggle - Retail Store Inventory |

### Patrones Detectados

1. **📈 Tendencia**: Creciente (+265% en 10 meses)
2. **🔄 Estacionalidad**: Semanal (período = 7 días)
3. **🚨 Anomalías**: 4 eventos especiales
   - Año Nuevo (1 enero): -58%
   - Día del Trabajo (1-2 mayo): -11% a -12%
   - Halloween (31 octubre): +50%

---

## 🛠️ Stack Tecnológico

### Core
- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsive con variables CSS
- **JavaScript ES6+** - Lógica modular vanilla

### Librerías (CDN)
- [Chart.js 4.4](https://www.chartjs.org/) - Visualización de gráficos
- [Chart.js Annotation](https://www.chartjs.org/chartjs-plugin-annotation/) - Anotaciones en gráficos
- [Anime.js 3.2](https://animejs.com/) - Animaciones fluidas
- [Canvas Confetti](https://www.kirilv.com/canvas-confetti/) - Efectos de celebración
- [Numeral.js](http://numeraljs.com/) - Formato de números

---

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura modular con 6 clases principales:

```
┌─────────────────────────────────────────────────────┐
│                  DetectiveGame                      │
│              (Orquestador Principal)                │
├─────────────────────────────────────────────────────┤
│  GameStateManager  │  DataAnalyzer  │  ChartManager │
│  (Estado + Observer)│ (Cálculos)    │ (Gráficos)    │
├─────────────────────────────────────────────────────┤
│     UIController    │        AnswerValidator        │
│   (Eventos + UI)    │    (Validación de respuestas) │
└─────────────────────────────────────────────────────┘
```

Ver [ARQUITECTURA.md](ARQUITECTURA.md) para documentación técnica detallada.

---

## 📚 Documentación Adicional

- [ARQUITECTURA.md](ARQUITECTURA.md) - Especificación técnica completa
- [DATOS.md](DATOS.md) - Análisis estadístico del dataset
- [GUIA_DOCENTES.md](GUIA_DOCENTES.md) - Manual para instructores

---

## 🎓 Uso Educativo

Este proyecto está diseñado para:
- **Cursos de Data Analytics** - Introducción a series temporales
- **Bootcamps de Data Science** - Práctica interactiva
- **Formación corporativa** - Capacitación en análisis de datos
- **Autoaprendizaje** - Práctica individual

### Tiempo Estimado
- **Completar el juego**: 10-15 minutos
- **Discusión en clase**: 20-30 minutos adicionales

---

## 📝 Licencia

Este proyecto es de uso educativo. Desarrollado como píldora formativa para enseñanza de análisis de series temporales.

---

## 👥 Créditos

- **Dataset**: [Kaggle - Retail Store Inventory Forecasting](https://www.kaggle.com/)
- **Desarrollo**: Proyecto de formación en Data Analytics
- **Framework de visualización**: Chart.js

---

<p align="center">
  <strong>🔍 ¡Conviértete en Detective de Datos!</strong>
</p>
