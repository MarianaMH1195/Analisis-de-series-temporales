// ============================================================
// DETECTIVE DE DATOS - DEFINICIÓN DE MISIONES
// 7 Misiones con progresión de dificultad
// ============================================================

const missionsData = [
    // ========================================================
    // MISIÓN 1: Tendencia Básica
    // ========================================================
    {
        id: 1,
        title: "El Caso Retail 2022",
        subtitle: "Investigación de Tendencia",
        difficulty: 1,
        stars: "⭐",
        duration: "3-5 min",
        xpReward: 100,
        dataset: 'retail',
        icon: "📦",

        narrative: `Eres analista junior en ChainMart Retail Inc. Tu primer caso: investigar las ventas de 2022. ¿Qué dirección general muestran los datos?`,

        objectives: [
            "Observar el gráfico completo de 304 días",
            "Identificar la tendencia principal",
            "Entender el concepto de tendencia en series temporales"
        ],

        questions: [
            {
                id: "m1_q1",
                type: "select",
                title: "¿Cuál es la tendencia principal de las ventas?",
                description: "Observa el gráfico completo y determina la dirección general.",
                options: [
                    { value: "uptrend", text: "📈 Creciente (Alza)", correct: true },
                    { value: "downtrend", text: "📉 Decreciente (Baja)", correct: false },
                    { value: "stable", text: "➡️ Estable (Plano)", correct: false }
                ],
                correctAnswer: "uptrend",
                explanation: "Las ventas crecen de 6.4K a 33K unidades, mostrando una tendencia claramente creciente (+265%). Esto indica un negocio en expansión.",
                hints: [
                    "Compara el inicio (enero) con el final (octubre)",
                    "¿Los valores suben, bajan o se mantienen?",
                    "Imagina una línea que atraviese todos los puntos"
                ]
            }
        ],

        chartConfig: {
            type: 'line',
            showTrendLine: true,
            annotations: []
        },

        reward: {
            achievement: "🔍 Primer Caso",
            achievementDesc: "Has completado tu primera investigación",
            unlock: 2
        }
    },

    // ========================================================
    // MISIÓN 2: Estacionalidad
    // ========================================================
    {
        id: 2,
        title: "El Patrón Semanal",
        subtitle: "Estacionalidad Detectada",
        difficulty: 2,
        stars: "⭐⭐",
        duration: "3-5 min",
        xpReward: 150,
        dataset: 'retail',
        icon: "🔄",

        narrative: `Los datos muestran un patrón recurrente. ¿Cada cuántos días se repite el comportamiento? Pista: Piensa en cómo varía el comportamiento de compra durante la semana.`,

        objectives: [
            "Analizar el gráfico de barras por día de semana",
            "Identificar el período de estacionalidad",
            "Determinar los días de mayor y menor actividad"
        ],

        questions: [
            {
                id: "m2_q1",
                type: "number",
                title: "¿Cuál es el período de estacionalidad (en días)?",
                description: "¿Cada cuántos días se repite el patrón de ventas?",
                correctAnswer: 7,
                acceptedRange: null,
                explanation: "El patrón se repite cada 7 días (semanal). Sábado tiene las ventas más altas y domingo las más bajas.",
                hints: [
                    "Piensa en los ciclos naturales del comercio",
                    "¿Cuántos días tiene una semana?",
                    "El comportamiento de compra varía según el día de la semana"
                ]
            },
            {
                id: "m2_q2",
                type: "select",
                title: "¿Qué día tiene las ventas más ALTAS?",
                description: "Observa el gráfico de barras.",
                options: [
                    { value: "lunes", text: "Lunes", correct: false },
                    { value: "viernes", text: "Viernes", correct: false },
                    { value: "sabado", text: "Sábado", correct: true },
                    { value: "domingo", text: "Domingo", correct: false }
                ],
                correctAnswer: "sabado",
                explanation: "El sábado tiene el pico de ventas (~16,100 unidades). Las personas tienen más tiempo libre para comprar.",
                hints: [
                    "Busca la barra más alta en el gráfico",
                    "¿Cuándo tienen las personas más tiempo libre?"
                ]
            }
        ],

        chartConfig: {
            type: 'bar',
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            highlightMax: true,
            useWeeklyData: true
        },

        reward: {
            achievement: "🔄 Patrón Identificado",
            achievementDesc: "Has dominado la estacionalidad",
            unlock: 3
        }
    },

    // ========================================================
    // MISIÓN 3: Anomalías
    // ========================================================
    {
        id: 3,
        title: "Eventos Especiales",
        subtitle: "Anomalías en el Dataset",
        difficulty: 2,
        stars: "⭐⭐",
        duration: "4-6 min",
        xpReward: 150,
        dataset: 'retail',
        icon: "🚨",

        narrative: `Algunos días los datos se desviaron significativamente del patrón normal. ¿Cuántos eventos anómalos puedes identificar? Busca desviaciones de más del 15% del patrón normal.`,

        objectives: [
            "Identificar puntos que se desvían del patrón",
            "Contar las anomalías significativas",
            "Asociar las anomalías con eventos del mundo real"
        ],

        questions: [
            {
                id: "m3_q1",
                type: "number",
                title: "¿Cuántas anomalías significativas detectas?",
                description: "Cuenta los puntos que se desvían notablemente del patrón.",
                correctAnswer: 4,
                acceptedRange: [3, 5],
                explanation: "Hay 4 anomalías principales: Año Nuevo (-58%), Día del Trabajo x2 (-11%, -12%), y Halloween (+50%).",
                hints: [
                    "Busca picos o caídas muy pronunciadas",
                    "Piensa en festivos importantes del año",
                    "Las anomalías pueden ser positivas O negativas"
                ]
            },
            {
                id: "m3_q2",
                type: "select",
                title: "¿Cuál crees que es la anomalía MÁS grande?",
                description: "Identifica el evento con mayor impacto.",
                options: [
                    { value: "newyear", text: "1 Enero - Año Nuevo", correct: true },
                    { value: "labor", text: "1 Mayo - Día del Trabajo", correct: false },
                    { value: "halloween", text: "31 Octubre - Halloween", correct: false },
                    { value: "summer", text: "Vacaciones de verano", correct: false }
                ],
                correctAnswer: "newyear",
                explanation: "Año Nuevo tuvo una caída del 58%, la mayor del dataset. Las tiendas cierran o tienen horario reducido.",
                hints: [
                    "Busca el punto más bajo en enero",
                    "¿Cuándo están las tiendas cerradas?"
                ]
            }
        ],

        chartConfig: {
            type: 'line',
            showAnomalies: true,
            annotations: [
                { date: '2022-01-01', label: '¿?' },
                { date: '2022-05-01', label: '¿?' },
                { date: '2022-10-31', label: '¿?' }
            ]
        },

        reward: {
            achievement: "🚨 Cazador de Anomalías",
            achievementDesc: "Detectas lo que otros no ven",
            unlock: 4
        }
    },

    // ========================================================
    // MISIÓN 4: SaaS (Nuevo Contexto)
    // ========================================================
    {
        id: 4,
        title: "Caso SaaS",
        subtitle: "Usuarios Activos Mensuales",
        difficulty: 3,
        stars: "⭐⭐⭐",
        duration: "5-7 min",
        xpReward: 200,
        dataset: 'saas',
        icon: "💻",

        narrative: `Ascenso rápido. Nuevo caso: ProductAPI Inc. Analiza el crecimiento de usuarios activos (MAU) durante 2023. Este es un contexto diferente al retail. ¿Qué patrones ves?`,

        objectives: [
            "Aplicar conocimientos previos a nuevo contexto",
            "Identificar diferencias entre retail y SaaS",
            "Calcular el crecimiento porcentual"
        ],

        questions: [
            {
                id: "m4_q1",
                type: "select",
                title: "¿Qué tipo de crecimiento muestra el dataset?",
                description: "Analiza la forma de la curva de crecimiento.",
                options: [
                    { value: "linear", text: "📈 Crecimiento lineal (constante)", correct: false },
                    { value: "exponential", text: "🚀 Crecimiento acelerado (exponencial)", correct: true },
                    { value: "declining", text: "📉 Crecimiento decreciente", correct: false },
                    { value: "stable", text: "➡️ Estable", correct: false }
                ],
                correctAnswer: "exponential",
                explanation: "SaaS típicamente muestra crecimiento exponencial. Cada nuevo usuario trae más usuarios (efecto red).",
                hints: [
                    "Compara la pendiente al inicio vs al final",
                    "¿El crecimiento es más rápido hacia el final?"
                ]
            },
            {
                id: "m4_q2",
                type: "number",
                title: "Estima el crecimiento total en porcentaje (%)",
                description: "De 8,200 usuarios a 30,000 usuarios.",
                correctAnswer: 266,
                acceptedRange: [250, 280],
                explanation: "Crecimiento: (30,000 - 8,200) / 8,200 × 100 = 266%",
                hints: [
                    "Fórmula: (Final - Inicial) / Inicial × 100",
                    "(30000 - 8200) / 8200 = ?",
                    "El resultado está entre 250% y 280%"
                ]
            },
            {
                id: "m4_q3",
                type: "select",
                title: "¿Cómo difiere este patrón del retail?",
                description: "Compara con lo aprendido en misiones anteriores.",
                options: [
                    { value: "less_seasonal", text: "Menos estacionalidad semanal", correct: true },
                    { value: "more_volatile", text: "Más volatilidad diaria", correct: false },
                    { value: "same", text: "Es igual al retail", correct: false },
                    { value: "declining", text: "Tendencia opuesta", correct: false }
                ],
                correctAnswer: "less_seasonal",
                explanation: "SaaS B2B tiene menos estacionalidad semanal porque los usuarios son empresas que operan todos los días.",
                hints: [
                    "¿Hay patrón de fines de semana?",
                    "Las empresas trabajan diferente que consumidores"
                ]
            }
        ],

        chartConfig: {
            type: 'line',
            showTrendLine: true,
            color: '#10b981'
        },

        reward: {
            achievement: "💻 Analista SaaS",
            achievementDesc: "Dominas múltiples contextos",
            unlock: 5
        }
    },

    // ========================================================
    // MISIÓN 5: E-commerce (Volatilidad Alta)
    // ========================================================
    {
        id: 5,
        title: "Tráfico E-commerce",
        subtitle: "Caso de Alta Volatilidad",
        difficulty: 3,
        stars: "⭐⭐⭐",
        duration: "6-8 min",
        xpReward: 250,
        dataset: 'ecommerce',
        icon: "🛒",

        narrative: `Nuevo desafío: ShopHub Inc., plataforma e-commerce. Analiza el tráfico web diario. ⚠️ Advertencia: Este dataset es MUCHO más volátil. Habrá picos y caídas. ¿Puedes identificar los patrones?`,

        objectives: [
            "Manejar datos con alta volatilidad",
            "Identificar eventos especiales (Black Friday, etc.)",
            "Separar ruido de señal"
        ],

        questions: [
            {
                id: "m5_q1",
                type: "select",
                title: "¿Qué patrón principal ves?",
                description: "Mira más allá del ruido diario.",
                options: [
                    { value: "stable", text: "Tendencia estable sin cambios", correct: false },
                    { value: "growth_volatile", text: "📈 Crecimiento con alta volatilidad", correct: true },
                    { value: "declining", text: "Tendencia a la baja", correct: false },
                    { value: "random", text: "Completamente aleatorio", correct: false }
                ],
                correctAnswer: "growth_volatile",
                explanation: "Hay tendencia creciente (+265%) pero con alta volatilidad. Los picos corresponden a eventos de ventas.",
                hints: [
                    "Ignora las fluctuaciones individuales",
                    "¿La línea general sube o baja?",
                    "E-commerce tiene muchos eventos promocionales"
                ]
            },
            {
                id: "m5_q2",
                type: "number",
                title: "¿Cuántos picos significativos (>30% sobre promedio) detectas?",
                description: "Cuenta los eventos con impacto mayor al 30%.",
                correctAnswer: 5,
                acceptedRange: [4, 7],
                explanation: "~5 picos principales: San Valentín, Prime Day, Black Friday, Cyber Monday, Navidad.",
                hints: [
                    "Busca los picos más pronunciados",
                    "Piensa en eventos comerciales importantes",
                    "Black Friday, Cyber Monday, Navidad..."
                ]
            },
            {
                id: "m5_q3",
                type: "select",
                title: "¿Cuál es el evento con mayor impacto?",
                description: "Identifica el pico más grande del año.",
                options: [
                    { value: "valentine", text: "💝 San Valentín", correct: false },
                    { value: "prime", text: "📦 Prime Day (Julio)", correct: false },
                    { value: "blackfriday", text: "🛍️ Black Friday", correct: true },
                    { value: "christmas", text: "🎄 Navidad", correct: false }
                ],
                correctAnswer: "blackfriday",
                explanation: "Black Friday genera el pico más alto (~85% sobre promedio). Es el evento de ventas más importante del año.",
                hints: [
                    "Busca el pico máximo en noviembre",
                    "¿Cuál es el día de más ventas en retail mundial?"
                ]
            }
        ],

        chartConfig: {
            type: 'line',
            showEvents: true,
            color: '#f59e0b',
            volatileStyle: true
        },

        reward: {
            achievement: "📊 Experto en Volatilidad",
            achievementDesc: "Separas señal de ruido",
            unlock: 6
        }
    },

    // ========================================================
    // MISIÓN 6: Predicción (Forecasting)
    // ========================================================
    {
        id: 6,
        title: "Predicción Avanzada",
        subtitle: "Forecasting de Ventas",
        difficulty: 4,
        stars: "⭐⭐⭐⭐",
        duration: "8-10 min",
        xpReward: 300,
        dataset: 'retail',
        icon: "🔮",

        narrative: `Próxima etapa: predicción. Usando el caso Retail 2022, predice las ventas de noviembre y diciembre. No es adivinación - usa los patrones que identificaste: tendencia creciente, estacionalidad semanal, eventos especiales.`,

        objectives: [
            "Aplicar todos los conceptos aprendidos",
            "Hacer predicciones basadas en datos",
            "Considerar factores estacionales"
        ],

        questions: [
            {
                id: "m6_q1",
                type: "number",
                title: "¿Cuál sería el PROMEDIO de ventas en NOVIEMBRE 2022?",
                description: "Último dato octubre: ~33,000 unidades. Tendencia: +53.8/día.",
                correctAnswer: 35000,
                acceptedRange: [32000, 38000],
                explanation: "Continuando la tendencia: ~35,000 unidades promedio en noviembre.",
                hints: [
                    "Último valor octubre ≈ 33,000",
                    "Tendencia diaria ≈ +54 unidades",
                    "30 días × 54 = +1,620 unidades más"
                ]
            },
            {
                id: "m6_q2",
                type: "number",
                title: "¿Cuál sería el PROMEDIO de ventas en DICIEMBRE 2022?",
                description: "Considera el efecto de Navidad (+15-20% típico).",
                correctAnswer: 42000,
                acceptedRange: [38000, 46000],
                explanation: "Tendencia base ~37K + efecto Navidad (+15%) = ~42,000 unidades.",
                hints: [
                    "Navidad aumenta las ventas significativamente",
                    "Aplica un factor de +15% a +20%",
                    "Base ~37K × 1.15 = ?"
                ]
            },
            {
                id: "m6_q3",
                type: "select",
                title: "¿Qué factor afectaría MÁS el pronóstico de diciembre?",
                description: "Elige el factor con mayor impacto.",
                options: [
                    { value: "trend", text: "📈 La tendencia creciente", correct: false },
                    { value: "weekly", text: "🔄 Patrón semanal", correct: false },
                    { value: "holiday", text: "🎄 Navidad y fin de año", correct: true },
                    { value: "inventory", text: "📦 Nivel de inventario", correct: false }
                ],
                correctAnswer: "holiday",
                explanation: "Los eventos especiales (Navidad) tienen mayor impacto que la tendencia regular. Pueden aumentar ventas 20-50%.",
                hints: [
                    "¿Qué causa los mayores picos en el año?",
                    "Eventos especiales > tendencia regular"
                ]
            }
        ],

        chartConfig: {
            type: 'line',
            showTrendLine: true,
            showForecast: true,
            forecastMonths: ['Nov', 'Dic']
        },

        reward: {
            achievement: "🔮 Profeta de Datos",
            achievementDesc: "Predices el futuro con datos",
            unlock: 7
        }
    },

    // ========================================================
    // MISIÓN 7: Análisis Estratégico (Capstone)
    // ========================================================
    {
        id: 7,
        title: "Análisis Estratégico",
        subtitle: "Caso Capstone Final",
        difficulty: 5,
        stars: "⭐⭐⭐⭐⭐",
        duration: "10-12 min",
        xpReward: 500,
        dataset: 'retail',
        icon: "🎓",

        narrative: `Última misión de rango junior. Has dominado: tendencia, estacionalidad, anomalías, volatilidad, forecasting. Ahora: análisis estratégico COMPLETO. Toma decisiones de negocio basadas en datos. Esto determina si asciendes a Analista Senior.`,

        objectives: [
            "Combinar todos los conceptos aprendidos",
            "Tomar decisiones estratégicas basadas en datos",
            "Demostrar pensamiento analítico empresarial"
        ],

        questions: [
            {
                id: "m7_q1",
                type: "select",
                title: "Escenario 1: ChainMart quiere optimizar inventario. ¿Cómo distribuirlo?",
                description: "Basándote en el patrón semanal identificado.",
                options: [
                    { value: "equal", text: "Distribuir igual todos los días", correct: false },
                    { value: "weekend", text: "Concentrar en viernes-sábado (patrón semanal)", correct: true },
                    { value: "seasonal", text: "Solo para noviembre-diciembre", correct: false },
                    { value: "monday", text: "Concentrar en lunes-martes", correct: false }
                ],
                correctAnswer: "weekend",
                explanation: "El patrón semanal muestra 13% más ventas en fines de semana. Optimizar inventario para estos días maximiza ventas.",
                hints: [
                    "Recuerda la Misión 2: ¿qué días venden más?",
                    "El inventario debe estar donde se vende"
                ]
            },
            {
                id: "m7_q2",
                type: "select",
                title: "Escenario 2: ¿Cuándo lanzar promociones?",
                description: "Estrategia óptima de marketing.",
                options: [
                    { value: "always", text: "Todos los días igual", correct: false },
                    { value: "high", text: "Viernes-sábado (días altos)", correct: false },
                    { value: "low", text: "Lunes-martes (compensar días bajos)", correct: true },
                    { value: "random", text: "Aleatoriamente", correct: false }
                ],
                correctAnswer: "low",
                explanation: "Las promociones son más efectivas en días bajos (lunes-martes) para suavizar la demanda y aprovechar capacidad.",
                hints: [
                    "¿Cuándo necesitas más impulso?",
                    "Compensa los días de menor actividad"
                ]
            },
            {
                id: "m7_q3",
                type: "number",
                title: "Presupuesto de 100K para staffing. ¿Qué % asignar a viernes-sábado?",
                description: "Proporcional a las ventas de esos días.",
                correctAnswer: 40,
                acceptedRange: [35, 45],
                explanation: "Vie+Sáb = ~31,600 de ~112,300 semanal = 28%. Pero necesitas +40% por picos de demanda.",
                hints: [
                    "Vie: 15,500 + Sáb: 16,100 = 31,600",
                    "Total semanal ≈ 112,300",
                    "Necesitas margen para picos"
                ]
            },
            {
                id: "m7_q4",
                type: "select",
                title: "¿Cuál es el PRINCIPAL insight de todo el análisis?",
                description: "El aprendizaje más importante.",
                options: [
                    { value: "trend", text: "La tendencia siempre es positiva", correct: false },
                    { value: "patterns", text: "Los patrones de datos guían decisiones estratégicas", correct: true },
                    { value: "events", text: "Solo importan los eventos especiales", correct: false },
                    { value: "random", text: "Los datos son impredecibles", correct: false }
                ],
                correctAnswer: "patterns",
                explanation: "El análisis de patrones (tendencia, estacionalidad, anomalías) transforma datos en decisiones estratégicas de negocio.",
                hints: [
                    "¿Qué aprendiste en las 7 misiones?",
                    "Datos → Patrones → Decisiones"
                ]
            }
        ],

        chartConfig: {
            type: 'multi',
            showAllPatterns: true
        },

        reward: {
            achievement: "🎓 Ascenso a Senior",
            achievementDesc: "Has dominado el análisis de series temporales",
            unlock: null,
            special: "diploma"
        }
    }
];

// ============================================================
// SISTEMA DE ACHIEVEMENTS
// ============================================================

const achievements = [
    { id: 1, icon: "🔍", name: "Primer Caso", desc: "Completa tu primera investigación", mission: 1 },
    { id: 2, icon: "🔄", name: "Patrón Identificado", desc: "Domina la estacionalidad", mission: 2 },
    { id: 3, icon: "🚨", name: "Cazador de Anomalías", desc: "Detecta lo que otros no ven", mission: 3 },
    { id: 4, icon: "💻", name: "Analista SaaS", desc: "Dominas múltiples contextos", mission: 4 },
    { id: 5, icon: "📊", name: "Experto en Volatilidad", desc: "Separas señal de ruido", mission: 5 },
    { id: 6, icon: "🔮", name: "Profeta de Datos", desc: "Predices el futuro con datos", mission: 6 },
    { id: 7, icon: "🎓", name: "Ascenso a Senior", desc: "Maestro del análisis temporal", mission: 7 }
];

// ============================================================
// CONFIGURACIÓN DE RANGOS
// ============================================================

const ranks = [
    { level: 0, name: "Novato", minXP: 0, icon: "🌱" },
    { level: 1, name: "Junior Analyst", minXP: 100, icon: "📊" },
    { level: 2, name: "Analyst", minXP: 400, icon: "📈" },
    { level: 3, name: "Senior Analyst", minXP: 850, icon: "🎯" },
    { level: 4, name: "Expert", minXP: 1350, icon: "⭐" },
    { level: 5, name: "Master Detective", minXP: 1650, icon: "🏆" }
];

const TOTAL_XP = 1650; // Suma de todas las misiones
