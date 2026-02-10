# 🕵️‍♂️ Detective de Datos - Soluciones de Misiones (V3)

Aquí tienes la guía de respuestas correctas para todas las misiones de la campaña **REFACTORIZADA V3**.

> **Nota pedagógica:** Esta versión se enfoca en el análisis, la toma de decisiones y la interpretación de datos en contexto de negocio, no solo en la observación visual.

---

## 📅 Misión 1: Tendencia Retail
**Objetivo:** Toma de decisiones basada en tendencias.

*   **Pregunta 1:** Si esta tendencia continúa, ¿qué decisión estratégica deberías tomar para el siguiente trimestre?
    *   **Respuesta Correcta:** `📈 Aumentar inventario y personal` ("up")
    *   *Explicación:* La tendencia es claramente CRECIENTE (+265% anual). Para no perder ventas por falta de stock, la decisión lógica es expandir la capacidad.

---

## 🔄 Misión 2: Estacionalidad Semanal
**Objetivo:** Identificar patrones recurrentes.

*   **Pregunta 1:** Observa el patrón que se repite: ¿cada cuántos días ocurre el pico máximo de ventas?
    *   **Respuesta Correcta:** `7`
    *   *Explicación:* El pico se repite cada 7 días (patrón semanal), coincidiendo con el sábado.

*   **Pregunta 2:** Para maximizar ingresos, ¿qué día deberías concentrar promociones especiales?
    *   **Respuesta Correcta:** `Sábado` ("sab")
    *   *Explicación:* Es el día de mayores ventas promedio (16.1K). Las promociones tienen mayor impacto cuando hay más flujo natural de clientes.

---

## 🚨 Misión 3: Cazador de Anomalías
**Objetivo:** Detectar eventos de fuerza mayor.

*   **Pregunta 1:** ¿Cuántas anomalías (eventos fuera del patrón esperado) detectas en la serie?
    *   **Respuesta Correcta:** `4`
    *   *Explicación:* 3 caídas (Año Nuevo, Día Trabajo, Puente) y 1 pico (Halloween). Todos rompen la tendencia normal.

*   **Pregunta 2:** ¿Cuál evento causó la MAYOR CAÍDA?
    *   **Respuesta Correcta:** `Año Nuevo` ("newyear")
    *   *Explicación:* Caída del 58%, el punto más bajo del gráfico debido al cierre de tiendas.

---

## 💻 Misión 4: Analista SaaS
**Objetivo:** Métricas de crecimiento B2B.

*   **Pregunta 1:** ¿Cuál es el patrón de crecimiento de usuarios?
    *   **Respuesta Correcta:** `📈 Crecimiento Lineal (constante)` ("linear")
    *   *Explicación:* Los usuarios aumentan una cantidad constante cada mes (~8-9%), típico de negocios B2B estables.

*   **Pregunta 2:** Si tu meta es duplicar usuarios (>100% crecimiento), ¿alcanzaste el objetivo?
    *   **Respuesta Correcta:** `130`
    *   *Explicación:* Crecimiento de 130% ((18.9K - 8.2K) / 8.2K). Se superó la meta de duplicar (100%).

---

## 🛒 Misión 5: E-commerce Volátil
**Objetivo:** Gestión de inventario y picos.

*   **Pregunta 1:** ¿Cuál es la característica principal del tráfico para gestión de stock?
    *   **Respuesta Correcta:** `📈 Alta volatilidad (riesgo de rotura)` ("volatile")
    *   *Explicación:* Los picos extremos hacen difícil predecir el stock necesario, aumentando el riesgo operativo.

*   **Pregunta 2:** ¿En qué trimestre (Q) se concentra el mayor riesgo operativo por volumen?
    *   **Respuesta Correcta:** `Q4 (Oct-Dic)` ("q4")
    *   *Explicación:* Contiene Black Friday y Navidad. Es el periodo crítico del año donde un error cuesta más caro.

*   **Pregunta 3:** ¿Cuántos eventos superan el umbral crítico de inventario (>160% del promedio)?
    *   **Respuesta Correcta:** `2`
    *   *Explicación:* Solo **Black Friday** (185%) y **Cyber Monday** (170%) cruzan la línea de umbral punteada.

---

## 🔮 Misión 6: Profeta de Datos
**Objetivo:** Proyección financiera.

*   **Pregunta 1:** ¿Promedio esperado para NOVIEMBRE 2022? (en miles)
    *   **Respuesta Correcta:** `24`
    *   *Explicación:* Siguiendo la línea de tendencia base (+54 u/día), sin contar estacionalidad extra.

*   **Pregunta 2:** El CFO pregunta: si Navidad añade +20% a la tendencia base de ~25K, ¿qué proyección presentar?
    *   **Respuesta Correcta:** `~30K` ("30")
    *   *Explicación:* 25,000 (base) + 20% (5,000) = 30,000. Matemáticamente correcto para el presupuesto.

---

## 🎓 Misión 7: Senior Analyst (Capstone)
**Objetivo:** Estrategia de portafolio.

*   **Pregunta 1:** ¿Qué industria ofrece ingresos más PREDECIBLES para un inversor conservador?
    *   **Respuesta Correcta:** `SaaS` ("saas")
    *   *Explicación:* Línea más suave y constante, menor riesgo de sorpresas.

*   **Pregunta 2:** ¿Qué industria necesita el MAYOR buffer de inventario por imprevisibilidad?
    *   **Respuesta Correcta:** `E-commerce` ("ecom")
    *   *Explicación:* Mayor volatilidad (45%) implica mayor incertidumbre y necesidad de stock de seguridad.

*   **Pregunta 3:** Para un inversor buscando crecimiento explosivo (>250%), ¿qué industria priorizar?
    *   **Respuesta Correcta:** `E-commerce` ("ecom")
    *   *Explicación:* Crecimiento del 320%, el más alto de todos, ideal para perfiles de alto riesgo/recompensa.
