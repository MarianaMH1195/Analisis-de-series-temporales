// ============================================================
// DETECTIVE DE DATOS - DEFINICIÓN DE MISIONES (V2 REFACTORIZADA)
// 7 Misiones con coherencia total, gráficos específicos y narrativa sólida.
// ============================================================

const missionsData = [
    // ========================================================
    // MISIÓN 1: Retail Tendencia (⭐ Fácil)
    // ========================================================
    {
        id: 1,
        title: "Caso Retail 2022",
        subtitle: "Investigación de Tendencia",
        narrative: "Eres analista junior en ChainMart Retail Inc. Tu primer caso: investigar las ventas de 2022. ¿Qué dirección general muestran los datos?",

        difficulty: 1,
        stars: "<i class='ri-star-fill'></i>",
        duration: "3-5 min",
        xpReward: 100,
        dataset: "retail",
        icon: "<i class='ri-archive-line'></i>",

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
                explanation: "Las ventas crecen de 6.4K a 33K unidades (+265%). Esto indica un negocio en expansión.",
                hints: [
                    "Compara el inicio (enero) con el final (octubre)",
                    "¿Los valores suben, bajan o se mantienen?",
                    "Imagina una línea que atraviese todos los puntos"
                ]
            }
        ],

        chartConfig: {
            type: "line",
            title: "Ventas Diarias 2022 (304 días)",
            showTrendLine: false,
            color: "#667eea"
        },

        reward: {
            achievement: "🔍 Primer Caso",
            achievementDesc: "Has completado tu primera investigación",
            unlock: 2
        }
    },

    // ========================================================
    // MISIÓN 2: Patrón Semanal (⭐⭐ Fácil-Media)
    // ========================================================
    {
        id: 2,
        title: "El Patrón Semanal",
        subtitle: "Estacionalidad Detectada",
        narrative: "Los datos muestran un patrón recurrente. ¿Como varía el comportamiento durante la semana?",

        difficulty: 2,
        stars: "<i class='ri-star-fill'></i><i class='ri-star-fill'></i>",
        duration: "3-5 min",
        xpReward: 150,
        dataset: "retail",
        icon: "<i class='ri-refresh-line'></i>",

        objectives: [
            "Analizar el gráfico de barras por día de semana",
            "Identificar el período de estacionalidad",
            "Determinar los días de mayor y menor actividad"
        ],

        questions: [
            {
                id: "m2_q1",
                type: "number",
                title: "¿Cada cuántos días se repite el patrón (período)?",
                description: "Observa la estructura cíclica.",
                correctAnswer: 7,
                acceptedRange: null,
                explanation: "El patrón es SEMANAL (7 días). Se repite cada semana con máximos el sábado y mínimos el domingo.",
                hints: [
                    "¿Cuántos días tiene una semana?",
                    "Piensa en los ciclos naturales del comercio"
                ]
            },
            {
                id: "m2_q2",
                type: "select",
                title: "¿En qué día se venden más unidades?",
                description: "Observa las barras más altas.",
                options: [
                    { value: "friday", text: "Viernes", correct: false },
                    { value: "saturday", text: "Sábado", correct: true },
                    { value: "sunday", text: "Domingo", correct: false },
                    { value: "monday", text: "Lunes", correct: false }
                ],
                correctAnswer: "saturday",
                explanation: "Sábado es el día de máximas ventas (~16.1K). Las personas tienen más tiempo libre para comprar.",
                hints: [
                    "Busca la barra más alta en el gráfico",
                    "¿Cuándo tienen las personas más tiempo libre?"
                ]
            }
        ],

        chartConfig: {
            type: "bar",
            title: "Promedio de Ventas por Día de Semana",
            labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
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
    // MISIÓN 3: Anomalías Visibles (⭐⭐ Fácil-Media)
    // ========================================================
    {
        id: 3,
        title: "Eventos Especiales",
        subtitle: "Anomalías Claras",
        narrative: "Algunos días los datos se desviaron SIGNIFICATIVAMENTE del patrón normal. Detecta estos eventos especiales.",

        difficulty: 2,
        stars: "<i class='ri-star-fill'></i><i class='ri-star-fill'></i>",
        duration: "4-6 min",
        xpReward: 150,
        dataset: "retail",
        icon: "<i class='ri-alarm-warning-line'></i>",

        objectives: [
            "Identificar puntos rojos (anomalías) en el gráfico",
            "Contar eventos significativos",
            "Asociar anomalías con eventos reales"
        ],

        questions: [
            {
                id: "m3_q1",
                type: "number",
                title: "¿Cuántos eventos especiales (anomalías) identificas?",
                description: "Cuenta los puntos rojos y etiquetas marcadas.",
                correctAnswer: 4,
                acceptedRange: [3, 5],
                explanation: "4 eventos principales marcados: Año Nuevo (caída), Día del Trabajo (caída), Puente (caída) y Halloween (subida).",
                hints: [
                    "Busca los puntos destacados en ROJO",
                    "Hay eventos tanto positivos como negativos"
                ]
            },
            {
                id: "m3_q2",
                type: "select",
                title: "¿Qué evento causó la MAYOR CAÍDA?",
                description: "Busca el punto más bajo del año.",
                options: [
                    { value: "newyear", text: "Año Nuevo (01-01)", correct: true },
                    { value: "laborday", text: "Día del Trabajo (05-01)", correct: false },
                    { value: "halloween", text: "Halloween (10-31)", correct: false },
                    { value: "other", text: "Otro evento", correct: false }
                ],
                correctAnswer: "newyear",
                explanation: "Año Nuevo tuvo una caída del 58% (solo 2,950 ventas). Es el día con menor actividad del año.",
                hints: [
                    "Mira el inicio del año en el gráfico",
                    "¿Qué día está más abajo en el eje Y?"
                ]
            }
        ],

        chartConfig: {
            type: "scatter_anomaly",
            title: "Anomalías en Serie Temporal 2022",
            showAnnotation: true,
            anomalies: [
                { date: '2022-01-01', label: 'Año Nuevo', value: 2950, color: 'red' },
                { date: '2022-05-01', label: 'Día Trabajo', value: 15800, color: 'red' },
                { date: '2022-05-02', label: 'Promo', value: 15400, color: 'red' },
                { date: '2022-10-31', label: 'Halloween', value: 39500, color: 'green' }
            ]
        },

        reward: {
            achievement: "🚨 Cazador de Anomalías",
            achievementDesc: "Detectas lo que otros no ven",
            unlock: 4
        }
    },

    // ========================================================
    // MISIÓN 4: SaaS Metrics (⭐⭐⭐ Media)
    // ========================================================
    {
        id: 4,
        title: "Caso SaaS: ProductAPI",
        subtitle: "Usuarios Activos en Expansión",
        narrative: "Nuevo contexto: ProductAPI Inc. (B2B SaaS). Analiza el crecimiento de Usuarios Activos Mensuales (MAU).",

        difficulty: 3,
        stars: "<i class='ri-star-fill'></i><i class='ri-star-fill'></i><i class='ri-star-fill'></i>",
        duration: "5-7 min",
        xpReward: 200,
        dataset: "saas",
        icon: "<i class='ri-computer-line'></i>",

        objectives: [
            "Analizar crecimiento en un contexto diferente (SaaS)",
            "Identificar patrones lineales/exponenciales",
            "Calcular crecimiento anual"
        ],

        questions: [
            {
                id: "m4_q1",
                type: "select",
                title: "¿Cuál es el patrón principal de crecimiento?",
                description: "Observa la forma de la curva y el área sombreada.",
                options: [
                    { value: "linear", text: "📈 Crecimiento Lineal Constante", correct: true },
                    { value: "exponential", text: "🚀 Crecimiento Exponencial Explosivo", correct: false },
                    { value: "cyclical", text: "🔄 Ciclos de Crecimiento y Caída", correct: false },
                    { value: "stable", text: "➡️ Estable sin cambios", correct: false }
                ],
                correctAnswer: "linear",
                explanation: "SaaS B2B suele mostrar un crecimiento constante y predecible (lineal o ligeramente acelerado), sin la volatilidad diaria del retail.",
                hints: [
                    "¿La línea sube de forma constante?",
                    "No hay picos o caídas bruscas como en retail"
                ]
            },
            {
                id: "m4_q2",
                type: "number",
                title: "¿Cuál es el crecimiento aproximado en % (Ene-Dic)?",
                description: "Inicio: ~8.2K. Final: ~18.9K.",
                correctAnswer: 130,
                acceptedRange: [120, 140],
                explanation: "De 8.2K a 18.9K es un aumento de ~130%. ((18.9-8.2)/8.2 * 100).",
                hints: [
                    "Fórmula: (Final - Inicial) / Inicial * 100",
                    "(18900 - 8200) / 8200 = ?",
                    "Es un poco más del doble (100%)"
                ]
            }
        ],

        chartConfig: {
            type: "line_area",
            title: "Usuarios Activos Mensuales (MAU) 2023",
            fill: true,
            color: "#667eea",
            showTrendLine: true
        },

        reward: {
            achievement: "💻 Analista SaaS",
            achievementDesc: "Dominas múltiples contextos",
            unlock: 5
        }
    },

    // ========================================================
    // MISIÓN 5: E-commerce con Picos (⭐⭐⭐ Media)
    // ========================================================
    {
        id: 5,
        title: "Caso E-commerce",
        subtitle: "Tráfico con Picos Claros",
        narrative: "NeoStore - Tienda Online. El gráfico muestra tráfico diario con eventos especiales muy marcados.",

        difficulty: 3,
        stars: "<i class='ri-star-fill'></i><i class='ri-star-fill'></i><i class='ri-star-fill'></i>",
        duration: "6-8 min",
        xpReward: 250,
        dataset: "ecommerce",
        icon: "<i class='ri-shopping-cart-2-line'></i>",

        objectives: [
            "Gestionar alta volatilidad",
            "Identificar impacto de eventos (Black Friday, Navidad)",
            "Distinguir temporadas altas"
        ],

        questions: [
            {
                id: "m5_q1",
                type: "select",
                title: "¿Cuál es la característica principal del tráfico?",
                description: "Compara con el caso SaaS anterior.",
                options: [
                    { value: "stable", text: "Estable y predecible", correct: false },
                    { value: "volatile_growth", text: "📈 Crecimiento con alta volatilidad (picos)", correct: true },
                    { value: "declining", text: "Tendencia a la baja", correct: false },
                    { value: "cyclical", text: "Solo ciclos semanales", correct: false }
                ],
                correctAnswer: "volatile_growth",
                explanation: "E-commerce tiene crecimiento base pero con PICOS DRAMÁTICOS en fechas especiales (San Valentín, Prime Day, Navidad).",
                hints: [
                    "Fíjate en los picos agudos de colores",
                    "¿Es una línea suave o una montaña rusa?"
                ]
            },
            {
                id: "m5_q2",
                type: "select",
                title: "¿En qué período se observan los MAYORES PICOS?",
                description: "Observa dónde se concentran las barras más altas.",
                options: [
                    { value: "spring", text: "Primavera (Feb-Abr)", correct: false },
                    { value: "summer", text: "Verano (Jun-Ago)", correct: false },
                    { value: "winter", text: "Invierno (Nov-Dic)", correct: true },
                    { value: "fall", text: "Otoño (Sep-Oct)", correct: false }
                ],
                correctAnswer: "winter",
                explanation: "Invierno (Q4) tiene Black Friday, Cyber Monday y Navidad. Es, por lejos, la temporada más fuerte.",
                hints: [
                    "Busca la concentración de picos al final del año",
                    "Black Friday y Navidad están en..."
                ]
            },
            {
                id: "m5_q3",
                type: "number",
                title: "¿Cuántos EPICENTROS de ventas (>100% pico) ves?",
                description: "Cuenta los eventos mayores etiquetados en el gráfico.",
                correctAnswer: 5,
                acceptedRange: [4, 6],
                explanation: "5 Eventos Principales: San Valentín, Prime Day, Black Friday, Cyber Monday y Navidad.",
                hints: [
                    "Cuenta las etiquetas de colores en el gráfico",
                    "Son los momentos clave del año comercial"
                ]
            }
        ],

        chartConfig: {
            type: "line_with_highlights",
            title: "Tráfico Web Diario con Eventos",
            highlights: [
                { date: '2023-02-14', label: "San Valentín", color: '#ff69b4' },
                { date: '2023-07-11', label: "Prime Day", color: '#ff9900' },
                { date: '2023-11-24', label: "Black Friday", color: '#ff0000' },
                { date: '2023-11-27', label: "Cyber Monday", color: '#0066ff' },
                { date: '2023-12-25', label: "Navidad", color: '#00dd00' }
            ]
        },

        reward: {
            achievement: "📊 Experto en Volatilidad",
            achievementDesc: "Separas señal de ruido",
            unlock: 6
        }
    },

    // ========================================================
    // MISIÓN 6: Forecasting Deducible (⭐⭐⭐⭐ Difícil)
    // ========================================================
    {
        id: 6,
        title: "Proyección Retail",
        subtitle: "Forecasting Lógico",
        narrative: "Usando los patrones de 2022, predice el futuro inmediato. La línea amarilla muestra la proyección matemática simple.",

        difficulty: 4,
        stars: "<i class='ri-star-fill'></i><i class='ri-star-fill'></i><i class='ri-star-fill'></i><i class='ri-star-fill'></i>",
        duration: "8-10 min",
        xpReward: 300,
        dataset: "retail",
        icon: "<i class='ri-magic-line'></i>",

        objectives: [
            "Leer una proyección de tendencia (línea amarilla)",
            "Ajustar proyecciones por estacionalidad (Navidad)",
            "Deducir valores futuros del gráfico"
        ],

        questions: [
            {
                id: "m6_q1",
                type: "number",
                title: "¿Promedio esperado para NOVIEMBRE 2022?",
                description: "Mira la línea de proyección amarilla para Noviembre. (Tendencia base)",
                correctAnswer: 35000,
                acceptedRange: [34000, 36000],
                explanation: "Siguiendo la tendencia lineal mostrada (+53.8/día), noviembre promedia ~35,000 unidades.",
                hints: [
                    "Sigue la línea punteada amarilla",
                    "El valor está un poco por encima del final de octubre"
                ]
            },
            {
                id: "m6_q2",
                type: "select",
                title: "Si aplicamos efecto Navidad (+20%), ¿para Diciembre?",
                description: "Proyección base (~37K) + Bonus Navidad.",
                options: [
                    { value: "37000", text: "~37.0K (Igual a tendencia)", correct: false },
                    { value: "40000", text: "~40.0K (Ligero aumento)", correct: false },
                    { value: "44000", text: "~44.0K (Aumento fuerte esperado)", correct: true },
                    { value: "30000", text: "~30.0K (Bajada)", correct: false }
                ],
                correctAnswer: "44000",
                explanation: "Tendencia base diciembre (~37K) + 20% Navidad (~7.4K) = ~44.4K. Navidad rompe la tendencia lineal hacia arriba.",
                hints: [
                    "Calcula el 20% de 37,000",
                    "Súmalo al valor base"
                ]
            }
        ],

        chartConfig: {
            type: "line_with_forecast",
            title: "Proyección de Ventas: Nov-Dic",
            forecastStart: "2022-11-01",
            forecastEnd: "2022-12-31"
        },

        reward: {
            achievement: "🔮 Profeta de Datos",
            achievementDesc: "Predices el futuro con datos",
            unlock: 7
        }
    },

    // ========================================================
    // MISIÓN 7: Business Intelligence (⭐⭐⭐⭐⭐ Capstone)
    // ========================================================
    {
        id: 7,
        title: "Informe Ejecutivo Final",
        narrative: "Eres Senior Analyst. Presenta tus conclusiones estratégicas comparando las 3 industrias.",

        difficulty: 5,
        stars: "<i class='ri-star-fill'></i><i class='ri-star-fill'></i><i class='ri-star-fill'></i><i class='ri-star-fill'></i><i class='ri-star-fill'></i>",
        duration: "10-12 min",
        xpReward: 500,
        dataset: "retail", // Placeholder, usa datos de todos
        icon: "<i class='ri-graduation-cap-line'></i>",

        objectives: [
            "Comparar patrones de diferentes industrias",
            "Elegir métricas (KPIs) adecuadas para cada una",
            "Recomendar estrategias basadas en datos"
        ],

        questions: [
            {
                id: "m7_q1",
                type: "select",
                title: "¿Cuál es la insight CRÍTICA comparativa?",
                description: "Mira los 3 gráficos en el dashboard.",
                options: [
                    { value: "all_same", text: "Todos son iguales", correct: false },
                    { value: "patterns_differ", text: "Cada industria tiene patrones ÚNICOS", correct: true },
                    { value: "seasonality", text: "La estacionalidad es clave en todos", correct: false }
                ],
                correctAnswer: "patterns_differ",
                explanation: "RETAIL: Estacionalidad semanal. SAAS: Lineal/Suave. E-COMMERCE: Volatilidad extrema. Requieren estrategias distintas.",
                hints: [
                    "Compara las formas de las curvas",
                    "Uno es sierra, otro suave, otro picos locos"
                ]
            },
            {
                id: "m7_q2",
                type: "select",
                title: "¿Métrica clave para cada industria?",
                description: "Relaciona la industria con su driver principal.",
                options: [
                    { value: "revenue", text: "Ingresos totales para todos", correct: false },
                    { value: "specific", text: "Retail: Rotación | SaaS: Retención | E-com: Conversión", correct: true },
                    { value: "traffic", text: "Tráfico web para todos", correct: false }
                ],
                correctAnswer: "specific",
                explanation: "Retail cuida inventario. SaaS vive de la retención (MRR). E-commerce depende de convertir tráfico volátil.",
                hints: [
                    "¿Qué mata a una empresa SaaS? (Churn)",
                    "¿Qué mata al Retail? (Stock parado)"
                ]
            },
            {
                id: "m7_q3",
                type: "select",
                title: "Recomendación Estratégica para el próximo año",
                description: "¿Dónde invertir presupuesto?",
                options: [
                    { value: "same", text: "Igual para todos", correct: false },
                    { value: "strategy", text: "Retail: Q4 Stock | SaaS: Q1 Onboarding | E-com: Q4 Marketing", correct: true },
                    { value: "random", text: "Invertir cuando haya dinero", correct: false }
                ],
                correctAnswer: "strategy",
                explanation: "Preparar inventario Retail y Marketing E-commerce para Q4 (picos). En SaaS, aprovechar el inicio de año para captar (tendencia lineal).",
                hints: [
                    "¿Cuándo vende más el Retail y E-com?",
                    "Prepara la inversión para esos momentos"
                ]
            }
        ],

        chartConfig: {
            type: "comparison_dashboard",
            title: "Dashboard Estratégico Comparativo",
            showKPIs: true
        },

        reward: {
            achievement: "🎓 Senior Analyst",
            achievementDesc: "Maestro del análisis temporal",
            unlock: null,
            special: "diploma"
        }
    }
];

// ============================================================
// SISTEMA DE ACHIEVEMENTS
// ============================================================

const achievements = [
    { id: 1, icon: "<i class='ri-search-eye-line'></i>", name: "Primer Caso", desc: "Completa tu primera investigación", mission: 1 },
    { id: 2, icon: "<i class='ri-refresh-line'></i>", name: "Patrón Identificado", desc: "Domina la estacionalidad", mission: 2 },
    { id: 3, icon: "<i class='ri-alarm-warning-line'></i>", name: "Cazador de Anomalías", desc: "Detecta lo que otros no ven", mission: 3 },
    { id: 4, icon: "<i class='ri-computer-line'></i>", name: "Analista SaaS", desc: "Dominas múltiples contextos", mission: 4 },
    { id: 5, icon: "<i class='ri-bar-chart-2-line'></i>", name: "Experto en Volatilidad", desc: "Separas señal de ruido", mission: 5 },
    { id: 6, icon: "<i class='ri-magic-line'></i>", name: "Profeta de Datos", desc: "Predices el futuro con datos", mission: 6 },
    { id: 7, icon: "<i class='ri-graduation-cap-line'></i>", name: "Senior Analyst", desc: "Maestro del análisis temporal", mission: 7 }
];

// ============================================================
// CONFIGURACIÓN DE RANGOS
// ============================================================

const ranks = [
    { level: 0, name: "Novato", minXP: 0, icon: "<i class='ri-seedling-line'></i>" },
    { level: 1, name: "Junior Analyst", minXP: 100, icon: "<i class='ri-bar-chart-line'></i>" },
    { level: 2, name: "Analyst", minXP: 400, icon: "<i class='ri-line-chart-line'></i>" },
    { level: 3, name: "Senior Analyst", minXP: 850, icon: "<i class='ri-pie-chart-line'></i>" },
    { level: 4, name: "Expert", minXP: 1350, icon: "<i class='ri-star-line'></i>" },
    { level: 5, name: "Master Detective", minXP: 1650, icon: "<i class='ri-trophy-line'></i>" }
];

const TOTAL_XP = 1650;
