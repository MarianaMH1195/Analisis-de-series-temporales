# 🕵️‍♂️ Detective de Datos v3.0

> **Domina el Análisis de Series Temporales** a través de la práctica con datos reales.

**Detective de Datos** es una simulación interactiva diseñada para entrenar la capacidad analítica. A través de 7 misiones prácticas con datos reales, los usuarios aprenden a interpretar patrones complejos (tendencias, estacionalidad, anomalías) y transformar datos en decisiones de negocio estratégicas.

## 📂 Arquitectura del Proyecto

Hemos estructurado el proyecto siguiendo estándares de la industria para separar claramente el entorno de producción de las herramientas de ingeniería.

### 🚀 `/public` (Entorno de Producción)
Esta carpeta contiene el **artefacto desplegable**. Todo lo necesario para ejecutar el juego reside aquí, optimizado para cualquier servidor web estático.

*   **`index.html`**: El punto de entrada único de la aplicación.
*   **`js/app.js`**: El núcleo lógico del juego. Refactorizado para ser modular, eficiente y fácil de mantener (Vanilla JS).
*   **`css/styles.css`**: Sistema de diseño visual responsivo.
*   **`data/`**: La fuente de la verdad. Datasets (CSV) y configuraciones (JSON) que alimentan el motor del juego.

### 🛠️ `/_dev_tools` (Utilidades de Desarrollo)
Zona reservada para el equipo de ingeniería y QA. Aquí se encuentran los scripts de generación de datos y las suites de pruebas automatizadas que garantizan la integridad de la lógica antes de cada despliegue.

*   **Scripts Python**: Generadores de datos sintéticos y notebooks de análisis exploratorio (EDA).
*   **Tests**: Validación de lógica de negocio (`*.test.js`).
*   **Config**: Archivos de entorno y dependencias.

## ⚡ Guía de Inicio Rápido

### Para Jugar (Despliegue)
Simplemente entra en la carpeta `public` y abre el archivo `index.html` en tu navegador.
Para una mejor experiencia (y evitar políticas CORS con los archivos CSV), te recomendamos usar un servidor local simple:

```bash
# Opción con Python (recomendada)
cd public
python -m http.server 8000
```
Luego navega a `http://localhost:8000`.

### Para Docentes
Consulta el archivo `docs/SOLUCIONES.md` para obtener la guía pedagógica completa, incluyendo el solucionario y la justificación técnica de cada misión.

## 💻 Stack Tecnológico
*   **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+).
*   **Visualización:** Chart.js 4.4 + Plugin Annotation.
*   **Animación:** Anime.js & Canvas Confetti.
*   **Datos:** Procesamiento CSV nativo en cliente.

---

