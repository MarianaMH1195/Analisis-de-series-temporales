# 🎓 Guía Didáctica y Solucionario - Detective de Datos v3.0

> **Recurso Confidencial para Docentes**
> Este documento contiene el desglose pedagógico y las respuestas correctas para las 7 misiones del juego. Úsalo para guiar la reflexión de los estudiantes.

---

## 🎯 Objetivo Pedagógico
El objetivo de "Detective de Datos" no es solo leer gráficos, sino **interpretar contextos de negocio**. Cada misión evalúa una competencia específica del analista de datos moderno:
1.  **Observación:** Identificar patrones visuales simples.
2.  **Análisis:** Conectar puntos de datos con eventos del mundo real.
3.  **Estrategia:** Tomar decisiones basadas en la evidencia histórica.

---

## 📝 Solucionario Detallado

### Misión 1: Tendencia Retail
**Competencia:** Identificación de Tendencias a Largo Plazo.

*   **P1: Decisión Estratégica**
    *   **Respuesta:** `📈 Aumentar inventario y personal`
    *   **Por qué:** La serie muestra un crecimiento sostenido del 265%. Una estrategia conservadora (mantener o reducir) resultaría en pérdida de cuota de mercado por falta de stock (stockout).

### Misión 2: Estacionalidad Semanal
**Competencia:** Reconocimiento de Patrones Cíclicos.

*   **P1: Frecuencia del Pico**
    *   **Respuesta:** `7` días.
    *   **Por qué:** El patrón se repite semanalmente, típico del sector retail (fines de semana).
*   **P2: Promociones**
    *   **Respuesta:** `Sábado`.
    *   **Por qué:** Es el día de mayor volumen natural. Las promociones aquí tienen el mayor retorno de inversión (ROI) por volumen de tráfico.

### Misión 3: Cazador de Anomalías
**Competencia:** Detección de Outliers.

*   **P1: Cantidad de Anomalías**
    *   **Respuesta:** `4` eventos.
    *   **Detalle:** 1 pico positivo (Halloween) y 3 caídas abruptas (Festivos).
*   **P2: Mayor Impacto Negativo**
    *   **Respuesta:** `Año Nuevo`.
    *   **Por qué:** Representa el mínimo absoluto de la serie (-58%), indicando un cierre total de operaciones.

### Misión 4: Analista SaaS (B2B)
**Competencia:** Métricas de Crecimiento y KPIs.

*   **P1: Tipo de Crecimiento**
    *   **Respuesta:** `📈 Lineal`.
    *   **Por qué:** A diferencia del E-commerce (volátil) o Startups virales (exponencial), este SaaS B2B crece de manera constante y predecible, ideal para proyecciones financieras fiables.
*   **P2: Crecimiento Anual**
    *   **Respuesta:** `130%`.
    *   **Cálculo:** `(Valor Final - Valor Inicial) / Valor Inicial`. `(18.9 - 8.2) / 8.2 ≈ 1.30`.

### Misión 5: E-commerce Volátil
**Competencia:** Gestión de Riesgo e Inventario.

*   **P1: Característica Principal**
    *   **Respuesta:** `📈 Alta volatilidad`.
    *   **Implicación:** Requiere una gestión de inventario ágil y buffer de seguridad (stock extra) para no fallar en los picos impredecibles.
*   **P2: Trimestre de Riesgo**
    *   **Respuesta:** `Q4 (Oct-Dic)`.
    *   **Por qué:** Concentra Black Friday y Navidad. El volumen se dispara, estresando la logística.
*   **P3: Eventos Críticos (>160%)**
    *   **Respuesta:** `2` (Black Friday y Cyber Monday).

### Misión 6: Profeta de Datos
**Competencia:** Forecasting (Proyección).

*   **P1: Proyección Noviembre**
    *   **Respuesta:** `24k`.
    *   **Método:** Extrapolación visual de la línea de tendencia media.
*   **P2: Escenario "What-If" (Navidad)**
    *   **Respuesta:** `~30K`.
    *   **Lógica:** Base (25k) + Impacto Estacional (+20% = 5k) = 30k.

### Misión 7: Capstone (Estrategia)
**Competencia:** Evaluación de Portafolio y Perfil de Inversión.

*   **P1: Ingresos Predecibles**
    *   **Respuesta:** `SaaS`. (Baja volatilidad, alta recurrencia).
*   **P2: Mayor Stock de Seguridad**
    *   **Respuesta:** `E-commerce`. (Picos extremos requieren colchón).
*   **P3: Mayor Crecimiento**
    *   **Respuesta:** `E-commerce` (320%).
    *   **Lección:** Mayor riesgo (volatilidad) suele correlacionar con mayor recompensa potencial (crecimiento).

---
*Documento generado para Data Analytics Academy.*
