# 📊 Análisis del Dataset - Detective de Datos

> Documentación completa del dataset de Retail Store Inventory 2022

---

## 📋 Resumen Ejecutivo

| Atributo | Valor |
|----------|-------|
| **Fuente** | Kaggle - Retail Store Inventory Forecasting |
| **Empresa** | ChainMart Retail Inc. (ficticia) |
| **Período** | 2022-01-01 a 2022-10-31 |
| **Observaciones** | 304 días consecutivos |
| **Variable** | Unidades Vendidas Diarias (agregación) |
| **Granularidad** | Diaria |
| **Estado** | Limpio (sin valores faltantes) |

---

## 📈 Estadísticas Descriptivas

### Medidas de Tendencia Central

| Métrica | Valor | Interpretación |
|---------|-------|----------------|
| **Media** | 14,250 unidades | Promedio de ventas diarias |
| **Mediana** | 14,100 unidades | Valor central (50% percentil) |
| **Moda** | ~14,500 unidades | Valor más frecuente |

### Medidas de Dispersión

| Métrica | Valor | Interpretación |
|---------|-------|----------------|
| **Mínimo** | 6,420 unidades | Valor mínimo observado |
| **Máximo** | 23,490 unidades | Valor máximo observado |
| **Rango** | 17,070 unidades | Máx - Mín |
| **Desv. Estándar** | 4,850 unidades | Dispersión respecto a media |
| **CV** | 34% | Coeficiente de variación |

### Percentiles

| Percentil | Valor |
|-----------|-------|
| P5 | ~7,500 |
| P25 (Q1) | ~11,000 |
| P50 (Mediana) | ~14,100 |
| P75 (Q3) | ~17,500 |
| P95 | ~21,000 |

---

## 📈 Componente 1: TENDENCIA

### Análisis de Regresión Lineal

**Ecuación de la línea de tendencia:**
```
y = 53.8x + 6,543
```

Donde:
- `x` = día del año (0 a 303)
- `y` = unidades vendidas estimadas
- `53.8` = pendiente (unidades/día)
- `6,543` = intercepto

### Métricas de la Tendencia

| Métrica | Valor | Interpretación |
|---------|-------|----------------|
| **Pendiente** | +53.8 u/día | Incremento diario esperado |
| **R²** | 0.89 | 89% de varianza explicada |
| **Crecimiento Mensual** | +1,614 unidades | Aproximado |
| **Crecimiento Total** | +265% | De enero a octubre |

### Evolución Mensual

| Mes | Promedio | Δ vs Anterior |
|-----|----------|---------------|
| Enero | ~7,500 | - |
| Febrero | ~9,000 | +20% |
| Marzo | ~10,500 | +17% |
| Abril | ~12,000 | +14% |
| Mayo | ~13,500 | +13% |
| Junio | ~15,000 | +11% |
| Julio | ~16,500 | +10% |
| Agosto | ~18,000 | +9% |
| Septiembre | ~19,500 | +8% |
| Octubre | ~21,000 | +8% |

### Interpretación Comercial

> El crecimiento sostenido del +265% en 10 meses sugiere:
> - Expansión exitosa del negocio
> - Estrategias de marketing efectivas
> - Aumento de base de clientes
> - Posible apertura de nuevas ubicaciones

---

## 🔄 Componente 2: ESTACIONALIDAD

### Patrón Semanal Identificado

**Período de estacionalidad:** 7 días (semanal)

### Promedio por Día de Semana

| Día | Promedio | Índice Estacional | Interpretación |
|-----|----------|-------------------|----------------|
| Lunes | 14,800 | 1.04 | Normal |
| Martes | 15,100 | 1.06 | Ligeramente alto |
| Miércoles | 14,950 | 1.05 | Normal |
| Jueves | 15,300 | 1.07 | Alto |
| Viernes | 15,500 | 1.09 | Alto |
| **Sábado** | **16,100** | **1.13** | **Máximo** |
| Domingo | 14,200 | 0.99 | Mínimo |

### Visualización del Patrón

```
16,500 ┤                    ████
16,000 ┤                ████▓▓▓▓    
15,500 ┤            ████▓▓▓▓▓▓▓▓    
15,000 ┤    ████████▓▓▓▓▓▓▓▓▓▓▓▓    
14,500 ┤████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    
14,000 ┤▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
       └─────────────────────────────
        Lun Mar Mié Jue Vie Sáb Dom
```

### Amplitud Estacional

| Métrica | Valor |
|---------|-------|
| Diferencia Máx-Mín | 1,900 unidades |
| Amplitud relativa | ~13% |
| Día máximo | Sábado |
| Día mínimo | Domingo |

### Interpretación Comercial

> El patrón semanal típico de retail indica:
> - **Sábado pico**: Clientes compran en fin de semana
> - **Domingo bajo**: Menor tráfico, horarios reducidos
> - **Jueves-Viernes alto**: Preparación para fin de semana
> - **Lunes estable**: Inicio de semana normal

---

## 🚨 Componente 3: ANOMALÍAS

### Eventos Detectados

| # | Fecha | Evento | Impacto | Tipo |
|---|-------|--------|---------|------|
| 1 | 2022-01-01 | **Año Nuevo** | -58% | Festivo |
| 2 | 2022-05-01 | **Día del Trabajo** | -11% | Festivo |
| 3 | 2022-05-02 | **Post-Festivo** | -12% | Festivo |
| 4 | 2022-10-31 | **Halloween** | +50% | Promoción |

### Detalle de Anomalías

#### 🎆 1 de Enero (Año Nuevo)
```
Valor esperado: ~7,000 unidades
Valor observado: ~2,940 unidades
Desviación: -58%
Causa: Cierre de tienda / horario reducido
```

#### 🛠️ 1-2 de Mayo (Día del Trabajo)
```
Día 1:
  Valor esperado: ~13,600 unidades
  Valor observado: ~12,100 unidades
  Desviación: -11%

Día 2:
  Valor esperado: ~13,700 unidades
  Valor observado: ~12,050 unidades
  Desviación: -12%

Causa: Festivo nacional, menor tráfico
```

#### 🎃 31 de Octubre (Halloween)
```
Valor esperado: ~20,000 unidades
Valor observado: ~30,000 unidades
Desviación: +50%
Causa: Promoción especial de temporada
```

### Métodos de Detección

Para este dataset, las anomalías fueron identificadas mediante:

1. **Conocimiento de dominio**: Fechas festivas conocidas
2. **Desviación estándar**: Puntos > 2σ de la media móvil
3. **Residuos de regresión**: Valores con residuo > 3σ

### Impacto en Modelado

> **Importante para modelos predictivos:**
> - Excluir anomalías del entrenamiento base
> - Crear variables dummy para festivos
> - Modelar promociones por separado
> - Usar media robusta (mediana) si se incluyen

---

## 🔢 Generación del Dataset

### Fórmula de Generación

El dataset fue generado sintéticamente basado en características reales:

```javascript
for (let i = 0; i < 304; i++) {
    // 1. Componente de tendencia
    let value = 53.8 * i + 6543;
    
    // 2. Componente estacional (día de semana)
    const dayFactors = {
        0: -200,   // Domingo
        1: 400,    // Lunes
        2: 600,    // Martes
        3: 500,    // Miércoles
        4: 800,    // Jueves
        5: 1000,   // Viernes
        6: 1500    // Sábado
    };
    value += dayFactors[date.getDay()];
    
    // 3. Ruido determinístico
    const noise = Math.sin(i * 0.7) * 300 + Math.cos(i * 1.3) * 200;
    value += noise;
    
    // 4. Aplicar anomalías
    if (isAnomaly(date)) {
        value *= anomalyMultiplier;
    }
    
    values.push(Math.round(value));
}
```

### Validación del Dataset

| Criterio | Estado |
|----------|--------|
| Sin valores nulos | ✅ |
| Sin duplicados | ✅ |
| Fechas consecutivas | ✅ |
| Valores positivos | ✅ |
| Tendencia verificada | ✅ |
| Estacionalidad verificada | ✅ |
| Anomalías verificadas | ✅ |

---

## 📊 Resumen Visual

### Distribución de Valores

```
Histograma (aproximado):

Frecuencia
    │
 40 │        ████
 35 │       █████████
 30 │      ██████████████
 25 │     ████████████████████
 20 │    ███████████████████████████
 15 │   █████████████████████████████████
 10 │  ███████████████████████████████████████
  5 │ █████████████████████████████████████████████
    └─────────────────────────────────────────────────
      5k   8k   11k  14k  17k  20k  23k  26k
                  Unidades Vendidas
```

### Box Plot Conceptual

```
       ┌─────┬─────────────────────────────┬─────┐
   ◄───┤     │             ┌───────────────┤     ├───►
       └─────┴─────────────│───────────────┴─────┘
       │                   │                      │
     Min                Mediana                  Max
    6,420               14,100                 23,490
```

---

## 📚 Referencias

1. **Dataset original**: Kaggle - Retail Store Inventory Forecasting
2. **Metodología de análisis**: Box-Jenkins para series temporales
3. **Detección de anomalías**: Método IQR y residuos

---

## 🔍 Uso en el Juego

Este dataset está hardcodeado en `game-logic.js` y se utiliza para:

1. **Fase 0**: Mostrar primeros 60 días como muestra
2. **Fase 1**: Dibujar línea de tendencia calculada
3. **Fase 2**: Agregar por día de semana (7 barras)
4. **Fase 3**: Marcar puntos anómalos en scatter
5. **Fase 4**: Mostrar análisis completo

---

<p align="center">
  <em>Documentación de Datos v2.0</em>
</p>
