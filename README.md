# 🕵️‍♂️ Detective de Datos v3.0

> **Domina el Análisis de Series Temporales** a través de la práctica con datos reales.

**Detective de Datos** es una simulación interactiva diseñada para entrenar la capacidad analítica. A través de 7 misiones prácticas con datos reales, los usuarios aprenden a interpretar patrones complejos (tendencias, estacionalidad, anomalías) y transformar datos en decisiones de negocio estratégicas.

## ✨ Características Principales

- 🎮 **7 Misiones Progresivas**: Desde análisis básico de tendencias hasta estrategias de portafolio multi-industria
- 📊 **Datos Reales**: Datasets auténticos de Retail, SaaS B2B y E-commerce
- 🎯 **Gamificación**: Sistema de XP, rangos y certificado final de completación
- 🌓 **Modo Oscuro/Claro**: Interfaz adaptable con animaciones fluidas
- ♿ **Accesibilidad**: Navegación por teclado y compatibilidad con lectores de pantalla
- 📱 **Responsive**: Optimizado para desktop, tablet y móvil

## 🎓 Objetivos de Aprendizaje

Al completar las 7 misiones, los usuarios serán capaces de:

1. **Identificar tendencias** a largo plazo y tomar decisiones estratégicas
2. **Reconocer patrones estacionales** y optimizar operaciones
3. **Detectar anomalías** y eventos de fuerza mayor en series temporales
4. **Calcular KPIs** de crecimiento y evaluar métricas de negocio
5. **Gestionar riesgo** en entornos de alta volatilidad
6. **Proyectar escenarios** futuros con forecasting básico
7. **Comparar industrias** y diseñar estrategias de inversión

## 🗺️ Mapa de Misiones

| # | Título | Competencia | Dificultad | XP |
|---|--------|-------------|------------|-----|
| 1 | Tendencia Retail | Identificación de Tendencias | ⭐ | 100 |
| 2 | Estacionalidad Semanal | Patrones Cíclicos | ⭐⭐ | 150 |
| 3 | Cazador de Anomalías | Detección de Outliers | ⭐⭐ | 150 |
| 4 | Analista SaaS | Métricas de Crecimiento | ⭐⭐⭐ | 200 |
| 5 | E-commerce Volátil | Gestión de Riesgo | ⭐⭐⭐ | 250 |
| 6 | Profeta de Datos | Forecasting | ⭐⭐⭐⭐ | 300 |
| 7 | Senior Analyst | Estrategia de Portafolio | ⭐⭐⭐⭐⭐ | 500 |

## 📂 Arquitectura del Proyecto

El proyecto está estructurado para facilitar el despliegue directo en GitHub Pages y otros servicios de hosting estático.

### 🚀 Archivos de Producción (Raíz)
Los archivos del juego están en la raíz del repositorio, listos para ser desplegados:

*   **`index.html`**: El punto de entrada único de la aplicación.
*   **`js/app.js`**: El núcleo lógico del juego. Refactorizado para ser modular, eficiente y fácil de mantener (Vanilla JS).
*   **`css/styles.css`**: Sistema de diseño visual responsivo.
*   **`data/`**: La fuente de la verdad. Datasets (CSV) y configuraciones (JSON) que alimentan el motor del juego.
*   **`.nojekyll`**: Archivo que indica a GitHub Pages que no procese el sitio con Jekyll.

### 🛠️ `/_dev_tools` (Utilidades de Desarrollo)
Zona reservada para el equipo de ingeniería y QA. GitHub Pages ignora esta carpeta automáticamente (por el prefijo `_`).

*   **Scripts Python**: Generadores de datos sintéticos y notebooks de análisis exploratorio (EDA).
*   **Tests**: Validación de lógica de negocio (`*.test.js`).
*   **Config**: Archivos de entorno y dependencias.

### 📚 `/docs` (Documentación)
*   **`SOLUCIONES.md`**: Guía pedagógica completa para docentes con solucionario y justificaciones técnicas.

## ⚡ Guía de Inicio Rápido

### Para Jugar (Despliegue Local)
Simplemente abre el archivo `index.html` en tu navegador.
Para una mejor experiencia (y evitar políticas CORS con los archivos CSV), te recomendamos usar un servidor local simple:

```bash
# Opción con Python (recomendada)
python -m http.server 8000
```
Luego navega a `http://localhost:8000`.

**Alternativas:**
```bash
# Con Node.js
npx http-server -p 8000

# Con PHP
php -S localhost:8000
```

### Para Docentes
Consulta el archivo `docs/SOLUCIONES.md` para obtener la guía pedagógica completa, incluyendo el solucionario y la justificación técnica de cada misión.

## 🚀 Despliegue en Producción

### GitHub Pages (Configuración Actual)
El proyecto está configurado para desplegarse directamente desde la raíz del repositorio:

1. Ve a **Settings** → **Pages**
2. Selecciona **Source**: Deploy from a branch
3. Selecciona **Branch**: `main`
4. Selecciona **Folder**: `/ (root)`
5. Guarda y espera el despliegue automático

El archivo `.nojekyll` en la raíz asegura que GitHub Pages no procese el proyecto con Jekyll, publicando los archivos tal cual.

### Netlify / Vercel
1. Conecta tu repositorio
2. Configura el **Build Command**: (vacío)
3. Configura el **Publish Directory**: `.` (raíz)
4. Despliega

### Servidor Propio
Simplemente copia todo el contenido del repositorio (excepto `_dev_tools`, `docs`, `.git`) a tu servidor web (Apache, Nginx, etc.)

## 💻 Stack Tecnológico

### Frontend
*   **HTML5** - Estructura semántica y accesible
*   **CSS3** - Sistema de diseño con variables CSS y modo oscuro/claro
*   **JavaScript (ES6+)** - Vanilla JS, sin frameworks

### Librerías y Dependencias
*   **[Chart.js](https://www.chartjs.org/) v4.4.0** - Visualización de gráficos interactivos
*   **[chartjs-plugin-annotation](https://www.chartjs.org/chartjs-plugin-annotation/) v3.0.1** - Anotaciones y marcadores en gráficos
*   **[Anime.js](https://animejs.com/) v3.2.1** - Animaciones fluidas de UI
*   **[Canvas Confetti](https://github.com/catdad/canvas-confetti) v1.9.0** - Efectos de celebración
*   **[Remix Icon](https://remixicon.com/) v3.5.0** - Sistema de iconografía

### Datos
*   **CSV nativo** - Procesamiento de datasets en cliente (sin backend)
*   **LocalStorage API** - Persistencia de progreso del jugador

### Accesibilidad
*   **ARIA labels** - Compatibilidad con lectores de pantalla
*   **Navegación por teclado** - Controles accesibles
*   **Anuncios en vivo** - Feedback para tecnologías asistivas

## 🤝 Contribuciones

Este proyecto es de código abierto y las contribuciones son bienvenidas. Si deseas agregar nuevas misiones, mejorar la UI o corregir bugs:

1. Haz fork del repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-mision`)
3. Realiza tus cambios y haz commit
4. Envía un Pull Request a la rama `develop`

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 👥 Autoras

Este proyecto fue desarrollado por:

- **Mariana Moreno Henao** - [LinkedIn](https://www.linkedin.com/in/mariana-moreno-henao/)
- **Rocío Lozano Caro** - [LinkedIn](https://www.linkedin.com/in/rociolozanocaro/)

---

*Proyecto desarrollado como píldora formativa del Bootcamp de Data Analysis - Factoría F5*
