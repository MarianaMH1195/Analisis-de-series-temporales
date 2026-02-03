// ============================================================
// DETECTIVE DE DATOS - DATASETS
// 3 Datasets: Retail, SaaS, E-commerce
// ============================================================

// ============================================================
// 1. DATASET RETAIL 2022 (304 días)
// ChainMart Retail Inc. - Ventas diarias
// ============================================================

const retailDataset = {
    id: 'retail',
    company: 'ChainMart Retail Inc.',
    variable: 'Unidades Vendidas',
    period: '2022-01-01 a 2022-10-31',
    days: 304,
    context: 'Ventas de retail multi-categoría',

    dates: (function () {
        const dates = [];
        const start = new Date('2022-01-01');
        for (let i = 0; i < 304; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    })(),

    values: [
        // Enero 2022 (31 días) - Inicio bajo, post-navidad
        6420, 7145, 6980, 7230, 7450, 7680, 6890,
        7120, 7340, 7560, 7780, 8000, 8220, 7440,
        7660, 7880, 8100, 8320, 8540, 8760, 7980,
        8200, 8420, 8640, 8860, 9080, 9300, 8520,
        8740, 8960, 9180,

        // Febrero 2022 (28 días)
        9400, 9620, 9840, 10060, 10280, 10500, 9720,
        9940, 10160, 10380, 10600, 10820, 11040, 10260,
        10480, 10700, 10920, 11140, 11360, 11580, 10800,
        11020, 11240, 11460, 11680, 11900, 12120, 11340,

        // Marzo 2022 (31 días)
        11560, 11780, 12000, 12220, 12440, 12660, 11880,
        12100, 12320, 12540, 12760, 12980, 13200, 12420,
        12640, 12860, 13080, 13300, 13520, 13740, 12960,
        13180, 13400, 13620, 13840, 14060, 14280, 13500,
        13720, 13940, 14160,

        // Abril 2022 (30 días)
        14380, 14600, 14820, 15040, 15260, 15480, 14700,
        14920, 15140, 15360, 15580, 15800, 16020, 15240,
        15460, 15680, 15900, 16120, 16340, 16560, 15780,
        16000, 16220, 16440, 16660, 16880, 17100, 16320,
        16540, 16760,

        // Mayo 2022 (31 días) - Día del trabajo anomalía
        14890, 14920, 17200, 17420, 17640, 17860, 17080,
        17300, 17520, 17740, 17960, 18180, 18400, 17620,
        17840, 18060, 18280, 18500, 18720, 18940, 18160,
        18380, 18600, 18820, 19040, 19260, 19480, 18700,
        18920, 19140, 19360,

        // Junio 2022 (30 días)
        19580, 19800, 20020, 20240, 20460, 20680, 19900,
        20120, 20340, 20560, 20780, 21000, 21220, 20440,
        20660, 20880, 21100, 21320, 21540, 21760, 20980,
        21200, 21420, 21640, 21860, 22080, 22300, 21520,
        21740, 21960,

        // Julio 2022 (31 días)
        22180, 22400, 22620, 22840, 23060, 23280, 22500,
        22720, 22940, 23160, 23380, 23600, 23820, 23040,
        23260, 23480, 23700, 23920, 24140, 24360, 23580,
        23800, 24020, 24240, 24460, 24680, 24900, 24120,
        24340, 24560, 24780,

        // Agosto 2022 (31 días)
        25000, 25220, 25440, 25660, 25880, 26100, 25320,
        25540, 25760, 25980, 26200, 26420, 26640, 25860,
        26080, 26300, 26520, 26740, 26960, 27180, 26400,
        26620, 26840, 27060, 27280, 27500, 27720, 26940,
        27160, 27380, 27600,

        // Septiembre 2022 (30 días)
        27820, 28040, 28260, 28480, 28700, 28920, 28140,
        28360, 28580, 28800, 29020, 29240, 29460, 28680,
        28900, 29120, 29340, 29560, 29780, 30000, 29220,
        29440, 29660, 29880, 30100, 30320, 30540, 29760,
        29980, 30200,

        // Octubre 2022 (31 días) - Halloween pico
        30420, 30640, 30860, 31080, 31300, 31520, 30740,
        30960, 31180, 31400, 31620, 31840, 32060, 31280,
        31500, 31720, 31940, 32160, 32380, 32600, 31820,
        32040, 32260, 32480, 32700, 32920, 33140, 32360,
        32580, 32800, 49200  // Halloween pico
    ],

    anomalies: [
        { date: '2022-01-01', event: 'Año Nuevo', impact: -58, severity: 'critical' },
        { date: '2022-05-01', event: 'Día del Trabajo', impact: -11, severity: 'medium' },
        { date: '2022-05-02', event: 'Puente festivo', impact: -12, severity: 'medium' },
        { date: '2022-10-31', event: 'Halloween Promo', impact: +50, severity: 'high' }
    ],

    stats: {
        mean: 20547,
        median: 21000,
        min: 6420,
        max: 49200,
        stdDev: 7823,
        trend: '+53.8 unidades/día',
        growth: '+265%'
    },

    weeklyPattern: {
        Lunes: 14800,
        Martes: 15100,
        Miércoles: 14950,
        Jueves: 15300,
        Viernes: 15500,
        Sábado: 16100,
        Domingo: 14200
    }
};

// ============================================================
// 2. DATASET SAAS 2023 (365 días)
// ProductAPI Inc. - Usuarios Activos Mensuales
// ============================================================

const saasDataset = {
    id: 'saas',
    company: 'ProductAPI Inc.',
    variable: 'Monthly Active Users (MAU)',
    period: '2023-01-01 a 2023-12-31',
    days: 365,
    context: 'Plataforma API B2B SaaS',

    dates: (function () {
        const dates = [];
        const start = new Date('2023-01-01');
        for (let i = 0; i < 365; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    })(),

    values: (function () {
        const values = [];
        let base = 8200;
        const dailyGrowth = (30000 - 8200) / 365;

        for (let i = 0; i < 365; i++) {
            // Crecimiento exponencial suave con variación pequeña
            const noise = (Math.random() - 0.5) * 200;
            const acceleration = 1 + (i / 365) * 0.3; // Aceleración gradual
            base += dailyGrowth * acceleration + noise;
            values.push(Math.round(Math.max(base, values[values.length - 1] || 8200)));
        }

        // Asegurar valores finales correctos
        values[0] = 8200;
        values[364] = 30000;

        return values;
    })(),

    stats: {
        startValue: 8200,
        endValue: 30000,
        growth: '+266%',
        avgDailyGrowth: 60,
        trend: 'Crecimiento acelerado'
    }
};

// ============================================================
// 3. DATASET E-COMMERCE 2023 (365 días)
// ShopHub Inc. - Tráfico Web Diario
// ============================================================

const ecommerceDataset = {
    id: 'ecommerce',
    company: 'ShopHub Inc.',
    variable: 'Daily Website Traffic (Unique Visitors)',
    period: '2023-01-01 a 2023-12-31',
    days: 365,
    context: 'Tráfico web e-commerce',

    dates: (function () {
        const dates = [];
        const start = new Date('2023-01-01');
        for (let i = 0; i < 365; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    })(),

    values: (function () {
        const values = [];
        let base = 12500;
        const dailyTrend = (38000 - 12500) / 365;

        for (let i = 0; i < 365; i++) {
            const date = new Date('2023-01-01');
            date.setDate(date.getDate() + i);
            const dayOfWeek = date.getDay();
            const month = date.getMonth();
            const dayOfMonth = date.getDate();

            // Tendencia base
            base = 12500 + dailyTrend * i;

            // Patrón semanal (fines de semana más altos)
            let weekendFactor = 1;
            if (dayOfWeek === 0) weekendFactor = 0.85; // Domingo bajo
            if (dayOfWeek === 5) weekendFactor = 1.15; // Viernes alto
            if (dayOfWeek === 6) weekendFactor = 1.25; // Sábado muy alto

            // Eventos especiales
            let eventFactor = 1;

            // Black Friday (último viernes de noviembre)
            if (month === 10 && dayOfWeek === 5 && dayOfMonth >= 22 && dayOfMonth <= 28) {
                eventFactor = 1.85;
            }

            // Cyber Monday
            if (month === 10 && dayOfWeek === 1 && dayOfMonth >= 25) {
                eventFactor = 1.70;
            }

            // Navidad (semana antes)
            if (month === 11 && dayOfMonth >= 15 && dayOfMonth <= 24) {
                eventFactor = 1.45;
            }

            // San Valentín
            if (month === 1 && dayOfMonth >= 10 && dayOfMonth <= 14) {
                eventFactor = 1.30;
            }

            // Prime Day (julio)
            if (month === 6 && dayOfMonth >= 11 && dayOfMonth <= 12) {
                eventFactor = 1.50;
            }

            // Alta volatilidad
            const noise = (Math.random() - 0.5) * base * 0.25;

            const value = Math.round(base * weekendFactor * eventFactor + noise);
            values.push(Math.max(value, 8000));
        }

        return values;
    })(),

    events: [
        { name: 'San Valentín', date: '2023-02-14', impact: '+30%' },
        { name: 'Prime Day', date: '2023-07-11', impact: '+50%' },
        { name: 'Black Friday', date: '2023-11-24', impact: '+85%' },
        { name: 'Cyber Monday', date: '2023-11-27', impact: '+70%' },
        { name: 'Navidad', date: '2023-12-25', impact: '+45%' }
    ],

    stats: {
        startValue: 12500,
        endValue: 45600,
        growth: '+265%',
        volatility: 'Alta (25% varianza)',
        majorEvents: 5
    }
};

// ============================================================
// EXPORTAR DATASETS
// ============================================================

const allDatasets = {
    retail: retailDataset,
    saas: saasDataset,
    ecommerce: ecommerceDataset
};
