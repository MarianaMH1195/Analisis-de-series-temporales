# 🎓 Guía para Docentes - Detective de Datos

> Manual completo para instructores que utilicen esta píldora formativa

---

## 📋 Índice

1. [Objetivos Pedagógicos](#objetivos-pedagógicos)
2. [Preparación de la Clase](#preparación-de-la-clase)
3. [Estructura de la Sesión](#estructura-de-la-sesión)
4. [Guía Fase por Fase](#guía-fase-por-fase)
5. [Preguntas de Discusión](#preguntas-de-discusión)
6. [Errores Comunes](#errores-comunes)
7. [Extensiones y Actividades](#extensiones-y-actividades)
8. [Evaluación](#evaluación)

---

## 🎯 Objetivos Pedagógicos

### Objetivo General

Introducir los conceptos fundamentales del análisis de series temporales de manera práctica e interactiva, utilizando datos de retail como caso de estudio.

### Objetivos Específicos

Al finalizar esta actividad, el estudiante será capaz de:

| # | Objetivo | Nivel Bloom |
|---|----------|-------------|
| 1 | **Identificar** la tendencia general de una serie temporal | Comprensión |
| 2 | **Reconocer** patrones estacionales en datos | Análisis |
| 3 | **Detectar** anomalías o eventos especiales | Análisis |
| 4 | **Interpretar** hallazgos en contexto comercial | Evaluación |
| 5 | **Aplicar** conceptos a nuevos datasets | Aplicación |

### Competencias Desarrolladas

- Pensamiento analítico basado en datos
- Reconocimiento visual de patrones
- Razonamiento inductivo y deductivo
- Comunicación de hallazgos técnicos

---

## 📚 Preparación de la Clase

### Requisitos Técnicos

| Recurso | Especificación |
|---------|---------------|
| **Computadoras** | 1 por estudiante o equipo |
| **Navegador** | Chrome, Firefox, Edge (actualizado) |
| **Conexión** | Internet para CDN (o version offline) |
| **Proyector** | Para demostración del instructor |

### Conocimientos Previos (Estudiantes)

- [x] Conceptos básicos de estadística (media, mediana)
- [x] Lectura de gráficos de líneas y barras
- [x] Familiaridad con Excel o herramientas similares
- [ ] No requiere programación

### Materiales a Preparar

1. **URL del juego** o archivos descargados
2. **Hoja de respuestas** (opcional, para grupos)
3. **Presentación de cierre** con conceptos clave
4. **Dataset adicional** para actividad de extensión

---

## ⏱️ Estructura de la Sesión

### Sesión Estándar (60 minutos)

| Tiempo | Actividad | Descripción |
|--------|-----------|-------------|
| 0-5 min | **Introducción** | Presentar el contexto y objetivos |
| 5-10 min | **Demo** | Mostrar interfaz y mecánica básica |
| 10-35 min | **Juego Individual** | Estudiantes completan el juego |
| 35-50 min | **Discusión** | Análisis grupal de hallazgos |
| 50-60 min | **Cierre** | Síntesis de conceptos y Q&A |

### Sesión Corta (30 minutos)

| Tiempo | Actividad |
|--------|-----------|
| 0-3 min | Introducción rápida |
| 3-20 min | Juego individual |
| 20-30 min | Discusión breve |

### Sesión Extendida (90 minutos)

| Tiempo | Actividad |
|--------|-----------|
| 0-10 min | Introducción teórica |
| 10-15 min | Demo del instructor |
| 15-45 min | Juego individual |
| 45-60 min | Discusión en profundidad |
| 60-75 min | Actividad de extensión |
| 75-90 min | Presentación de equipos |

---

## 📖 Guía Fase por Fase

### Fase 0: Briefing

**Objetivo de aprendizaje:** Contextualizar el análisis de datos en un escenario real.

**Puntos a destacar:**
- Los datos provienen de ventas reales de retail
- El período cubre 304 días (casi un año)
- El objetivo es "investigar" patrones ocultos

**Pregunta para el grupo:**
> "Antes de analizar, ¿qué patrones esperarían encontrar en datos de ventas de una tienda?"

---

### Fase 1: Tendencia

**Objetivo de aprendizaje:** Identificar la dirección general de largo plazo.

**Concepto clave:**
> La **tendencia** es el movimiento general de los datos a lo largo del tiempo, ignorando fluctuaciones de corto plazo.

**Pistas para guiar (si necesitan ayuda):**
1. "Compara el INICIO con el FINAL de la gráfica"
2. "¿Los valores de octubre son mayores o menores que los de enero?"
3. "Si trazaras una línea recta por los datos, ¿hacia dónde iría?"

**Después de resolver:**
- Mostrar la línea de regresión
- Explicar el concepto de "mínimos cuadrados"
- Discutir por qué puede haber crecimiento

**Fórmula a mencionar (opcional):**
```
y = mx + b
Donde m = pendiente (dirección) y b = intercepto
```

---

### Fase 2: Estacionalidad

**Objetivo de aprendizaje:** Reconocer patrones cíclicos que se repiten.

**Concepto clave:**
> La **estacionalidad** son fluctuaciones que se repiten en intervalos regulares (diario, semanal, mensual, anual).

**Pistas para guiar:**
1. "¿Los lunes se parecen entre sí? ¿Y los sábados?"
2. "Piensa en los hábitos de compra de la gente"
3. "¿Cuántos días tiene una semana? Eso es una pista grande"

**Después de resolver:**
- Mostrar el gráfico de barras por día
- Destacar el sábado como día pico
- Discutir implicaciones para staffing

**Conectar con el mundo real:**
> "¿Por qué creen que el sábado es el día de mayor venta?"
> "¿Cómo usaría un gerente de tienda esta información?"

---

### Fase 3: Anomalías

**Objetivo de aprendizaje:** Detectar eventos que rompen el patrón normal.

**Concepto clave:**
> Las **anomalías** son observaciones que se desvían significativamente del comportamiento esperado.

**Pistas para guiar:**
1. "Busca puntos que 'se salen' del patrón normal"
2. "Piensa en fechas especiales: festivos, promociones"
3. "Mira enero, mayo y octubre con cuidado"

**Después de resolver:**
- Mostrar los puntos marcados en rojo
- Explicar cada anomalía y su causa
- Discutir impacto en modelado predictivo

**Conexión con ML/AI:**
> "¿Por qué es importante detectar anomalías antes de entrenar un modelo predictivo?"

---

### Fase 4: Resolución

**Objetivo de aprendizaje:** Sintetizar hallazgos en conclusiones accionables.

**Actividad de cierre:**
1. Revisar las estadísticas finales
2. Discutir la puntuación y logros
3. Reflexionar sobre el proceso de análisis

**Pregunta final:**
> "Si fueran consultores de esta empresa, ¿qué recomendaciones harían basándose en este análisis?"

---

## 💬 Preguntas de Discusión

### Nivel Básico
1. ¿Qué significa que una serie tenga tendencia creciente?
2. ¿Por qué las ventas bajan los domingos?
3. ¿Qué es una anomalía y cómo la identificamos?

### Nivel Intermedio
4. ¿Cómo afectaría la estacionalidad a la gestión de inventario?
5. ¿Qué otros períodos de estacionalidad podrían existir en retail?
6. ¿Cómo distinguimos ruido aleatorio de una anomalía real?

### Nivel Avanzado
7. ¿Cómo se relaciona la regresión lineal con el cálculo de tendencia?
8. ¿Qué técnicas estadísticas se usan para detectar anomalías automáticamente?
9. ¿Cómo descompondríamos formalmente esta serie en sus componentes?

---

## ⚠️ Errores Comunes

### Error 1: Confundir tendencia con estacionalidad
**Síntoma:** Estudiante responde "7 días" en la pregunta de tendencia
**Solución:** Clarificar que la tendencia es LARGO PLAZO, la estacionalidad es REPETICIÓN

### Error 2: Contar cualquier variación como anomalía
**Síntoma:** Estudiante responde 20+ anomalías
**Solución:** Explicar diferencia entre ruido normal y eventos significativos

### Error 3: No entender la escala temporal
**Síntoma:** Confusión sobre qué representa cada punto
**Solución:** Recordar que cada punto = 1 día de ventas

### Error 4: Interpretar correlación como causalidad
**Síntoma:** "Las ventas suben porque es sábado"
**Solución:** Discutir factores subyacentes (más tiempo libre, familias, etc.)

---

## 🔄 Extensiones y Actividades

### Actividad 1: Análisis de Otro Dataset
**Duración:** 20-30 minutos
**Descripción:** Proporcionar datos de otra industria (restaurante, turismo, energía) y pedir que identifiquen los mismos componentes.

### Actividad 2: Predicción Manual
**Duración:** 15 minutos
**Descripción:** Dado el patrón identificado, ¿qué ventas esperarían para noviembre y diciembre?

### Actividad 3: Presentación Ejecutiva
**Duración:** 30 minutos
**Descripción:** En equipos, preparar un "informe ejecutivo" de 3 minutos con los hallazgos.

### Actividad 4: Programación (Avanzado)
**Duración:** 45-60 minutos
**Descripción:** Recrear el análisis en Python/R usando pandas/statsmodels.

```python
# Ejemplo de código para extensión
import pandas as pd
from statsmodels.tsa.seasonal import seasonal_decompose

# Descomposición de serie temporal
result = seasonal_decompose(df['sales'], period=7)
result.plot()
```

---

## 📊 Evaluación

### Rúbrica de Evaluación (Opcional)

| Criterio | 4 (Excelente) | 3 (Bueno) | 2 (Básico) | 1 (Insuficiente) |
|----------|---------------|-----------|------------|------------------|
| **Tendencia** | Identifica correctamente sin pistas | Identifica con 1 pista | Identifica con 2+ pistas | No identifica |
| **Estacionalidad** | Respuesta exacta (7) sin pistas | Con 1-2 pistas | Con 3 pistas | No identifica |
| **Anomalías** | Rango 3-5 sin pistas | Rango 3-7 con pistas | Fuera de rango | No identifica |
| **Interpretación** | Explica implicaciones comerciales | Describe hallazgos | Lista datos | No interpreta |

### Puntuación del Juego

| Rango | Calificación |
|-------|--------------|
| 350-400 pts | Sobresaliente |
| 270-349 pts | Notable |
| 200-269 pts | Aprobado |
| <200 pts | Requiere refuerzo |

---

## 📝 Notas Adicionales

### Adaptaciones para Diferentes Niveles

**Principiantes:**
- Enfocar en visualización e interpretación
- Permitir trabajo en parejas
- Dar más tiempo (20 minutos para el juego)

**Avanzados:**
- Discutir fórmulas matemáticas
- Pedir que calculen manualmente la pendiente
- Conectar con modelos ARIMA, Prophet

### Conexión con Otros Temas

Este juego conecta con:
- **Estadística descriptiva**: Media, mediana, desviación
- **Visualización de datos**: Gráficos de línea, barras, scatter
- **Business Intelligence**: KPIs, dashboards
- **Machine Learning**: Regresión, detección de anomalías
- **Análisis de negocios**: Forecasting, planificación

---

## 🆘 Soporte Técnico

### Problemas Comunes

| Problema | Solución |
|----------|----------|
| Gráficos no cargan | Verificar conexión a internet (CDN) |
| Página en blanco | Abrir consola (F12) y reportar error |
| Progreso no guarda | Verificar que localStorage esté habilitado |
| Botones no responden | Refrescar página (F5) |

### Contacto
Para dudas o sugerencias sobre esta guía, contactar al equipo de desarrollo.

---

<p align="center">
  <strong>🎓 ¡Buena clase!</strong>
</p>
