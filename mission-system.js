// ============================================================
// DETECTIVE DE DATOS - MISSION SYSTEM
// Sistema de gestión de misiones con progresión
// ============================================================

class MissionSystem {
    constructor() {
        this.storageKey = 'detective_missions';
        this.currentMission = null;
        this.currentQuestionIndex = 0;
        this.missionAnswers = {};

        // Estado del jugador
        this.playerState = this.loadPlayerState();

        // Inicializar
        this.init();
    }

    // ========================================================
    // INICIALIZACIÓN
    // ========================================================

    init() {
        this.setupNavigationListeners();
        this.renderMissionSelect();
        this.updatePlayerStats();
    }

    loadPlayerState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load mission state:', e);
        }

        return {
            totalXP: 0,
            completedMissions: [],
            unlockedMissions: [1], // Misión 1 siempre desbloqueada
            achievements: [],
            currentRank: 0,
            missionScores: {}
        };
    }

    savePlayerState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.playerState));
        } catch (e) {
            console.warn('Could not save mission state:', e);
        }
    }

    // ========================================================
    // NAVEGACIÓN
    // ========================================================

    setupNavigationListeners() {
        // Botón volver a misiones
        document.getElementById('btnBackToMissions')?.addEventListener('click', () => {
            this.showMissionSelect();
        });

        // Modal de Completado
        document.getElementById('btnMissionCompleteClose')?.addEventListener('click', () => {
            document.getElementById('missionCompleteModal')?.classList.remove('active');
            this.showMissionSelect();
        });

        // ========================================================
        // LISTENERS DE MODALES NUEVOS
        // ========================================================

        // Tutorial
        document.getElementById('btnTutorial')?.addEventListener('click', () => {
            document.getElementById('tutorialModal')?.classList.add('active');
        });

        document.getElementById('btnCloseTutorial')?.addEventListener('click', () => {
            document.getElementById('tutorialModal')?.classList.remove('active');
        });

        document.getElementById('tutorialBackdrop')?.addEventListener('click', () => {
            document.getElementById('tutorialModal')?.classList.remove('active');
        });

        // Settings
        document.getElementById('btnSettings')?.addEventListener('click', () => {
            this.openSettings();
        });

        document.getElementById('btnCloseSettings')?.addEventListener('click', () => {
            document.getElementById('settingsModal')?.classList.remove('active');
        });

        document.getElementById('settingsBackdrop')?.addEventListener('click', () => {
            document.getElementById('settingsModal')?.classList.remove('active');
        });

        // Botón Reset en Settings
        document.getElementById('btnResetProgress')?.addEventListener('click', () => {
            if (confirm('⚠️ ¿Estás seguro de reiniciar todo tu progreso? Perderás tu rango y medallas.')) {
                this.resetProgress();
                document.getElementById('settingsModal')?.classList.remove('active');
            }
        });

        // Toggle Sonido en Settings
        document.getElementById('settingSoundToggle')?.addEventListener('change', (e) => {
            if (typeof soundManager !== 'undefined') {
                soundManager.enabled = e.target.checked;
            }
        });

        // Toggle Dark Mode en Settings
        document.getElementById('settingDarkModeToggle')?.addEventListener('change', (e) => {
            if (typeof uiController !== 'undefined') {
                const isDark = e.target.checked;
                const html = document.documentElement;
                if (isDark) {
                    html.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    html.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                }

                // Actualizar gráfico misiones
                if (this.missionChart) {
                    this.initMissionChart();
                }
            }
        });

        // Siguiente misión
        document.getElementById('btnNextMission')?.addEventListener('click', () => {
            document.getElementById('missionCompleteModal')?.classList.remove('active');
            const nextId = this.currentMission.id + 1;

            if (nextId > 7) {
                // Campaña completada - Mostrar modal de nombre
                this.showNameModal();
            } else if (this.playerState.unlockedMissions.includes(nextId)) {
                this.startMission(nextId);
            } else {
                this.showMissionSelect();
            }
        });

        // Listeners para el modal de nombre (Final del juego)
        document.getElementById('btnSaveName')?.addEventListener('click', () => {
            this.saveScoreAndFinish();
        });

        document.getElementById('btnSkipName')?.addEventListener('click', () => {
            this.finishCampaign();
        });
    }

    openSettings() {
        const modal = document.getElementById('settingsModal');
        if (!modal) return;

        // Sincronizar estado actual de los switches
        const soundToggle = document.getElementById('settingSoundToggle');
        if (soundToggle && typeof soundManager !== 'undefined') {
            soundToggle.checked = soundManager.enabled;
        }

        const darkToggle = document.getElementById('settingDarkModeToggle');
        if (darkToggle) {
            darkToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
        }

        modal.classList.add('active');
    }

    showMissionSelect() {
        document.getElementById('missionSelectScreen')?.classList.add('active');
        document.getElementById('missionPlayScreen')?.classList.remove('active');
        this.renderMissionSelect();
        this.updatePlayerStats();
    }

    showMissionPlay() {
        document.getElementById('missionSelectScreen')?.classList.remove('active');
        document.getElementById('missionPlayScreen')?.classList.add('active');
    }

    // ========================================================
    // RENDER SELECTOR DE MISIONES
    // ========================================================

    renderMissionSelect() {
        const grid = document.getElementById('missionsGrid');
        if (!grid) return;

        grid.innerHTML = missionsData.map(mission => {
            const isCompleted = this.playerState.completedMissions.includes(mission.id);
            const isUnlocked = this.playerState.unlockedMissions.includes(mission.id);
            const score = this.playerState.missionScores[mission.id] || 0;

            let stateClass = 'locked';
            if (isCompleted) stateClass = 'completed';
            else if (isUnlocked) stateClass = 'unlocked';

            return `
                <div class="mission-card ${stateClass}" data-mission="${mission.id}">
                    <div class="mission-card-header">
                        <span class="mission-icon">${mission.icon}</span>
                        <span class="mission-number">Misión ${mission.id}</span>
                    </div>
                    <h3 class="mission-title">${mission.title}</h3>
                    <p class="mission-subtitle">${mission.subtitle}</p>
                    <div class="mission-meta">
                        <span class="mission-difficulty">${mission.stars}</span>
                        <span class="mission-duration">⏱️ ${mission.duration}</span>
                    </div>
                    <div class="mission-progress">
                        ${isCompleted ? `
                            <div class="mission-xp-earned">✓ ${score}/${mission.xpReward} XP</div>
                        ` : `
                            <div class="mission-xp-reward">🎯 ${mission.xpReward} XP</div>
                        `}
                    </div>
                    ${stateClass === 'locked' ? `
                        <div class="mission-lock">
                            <span class="lock-icon">🔒</span>
                            <p>Completa Misión ${mission.id - 1}</p>
                        </div>
                    ` : `
                        <button class="btn btn-mission ${isCompleted ? 'btn-replay' : 'btn-start'}" 
                                onclick="missionSystem.startMission(${mission.id})">
                            ${isCompleted ? '🔄 Repetir' : '▶️ Iniciar'}
                        </button>
                    `}
                </div>
            `;
        }).join('');
    }

    // ========================================================
    // ACTUALIZAR STATS DEL JUGADOR
    // ========================================================

    updatePlayerStats() {
        // XP Total
        const xpDisplay = document.getElementById('totalXP');
        const xpProgress = document.getElementById('xpProgressFill');
        if (xpDisplay) xpDisplay.textContent = this.playerState.totalXP;
        if (xpProgress) xpProgress.style.width = `${(this.playerState.totalXP / TOTAL_XP) * 100}%`;

        // Misiones completadas
        const missionsDisplay = document.getElementById('missionsCompleted');
        if (missionsDisplay) {
            missionsDisplay.textContent = `${this.playerState.completedMissions.length}/7`;
        }

        // Rango actual
        const currentRank = this.getCurrentRank();
        const rankDisplay = document.getElementById('currentRank');
        const rankIcon = document.getElementById('rankIcon');
        if (rankDisplay) rankDisplay.textContent = currentRank.name;
        if (rankIcon) rankIcon.textContent = currentRank.icon;

        // Achievements
        this.renderAchievements();
    }

    getCurrentRank() {
        const xp = this.playerState.totalXP;
        let currentRank = ranks[0];
        for (const rank of ranks) {
            if (xp >= rank.minXP) {
                currentRank = rank;
            }
        }
        return currentRank;
    }

    renderAchievements() {
        const container = document.getElementById('achievementsContainer');
        if (!container) return;

        container.innerHTML = achievements.map(ach => {
            const earned = this.playerState.achievements.includes(ach.id);
            return `
                <div class="achievement-badge ${earned ? 'earned' : 'locked'}" title="${ach.desc}">
                    <span class="achievement-icon">${earned ? ach.icon : '🔒'}</span>
                    <span class="achievement-name">${ach.name}</span>
                </div>
            `;
        }).join('');
    }

    // ========================================================
    // INICIAR MISIÓN
    // ========================================================

    startMission(missionId) {
        const mission = missionsData.find(m => m.id === missionId);
        if (!mission) return;

        if (!this.playerState.unlockedMissions.includes(missionId)) {
            alert('Esta misión aún está bloqueada.');
            return;
        }

        this.currentMission = mission;
        this.currentQuestionIndex = 0;
        this.missionAnswers = {};

        this.showMissionPlay();
        this.renderMissionContent();
        this.initMissionChart();

        // Play sound if available
        if (typeof soundManager !== 'undefined') {
            soundManager.play('click');
        }
    }

    // ========================================================
    // RENDER CONTENIDO DE MISIÓN
    // ========================================================

    renderMissionContent() {
        const mission = this.currentMission;
        if (!mission) return;

        // Header
        document.getElementById('missionPlayTitle').textContent = mission.title;
        document.getElementById('missionPlaySubtitle').textContent = mission.subtitle;
        document.getElementById('missionPlayIcon').textContent = mission.icon;
        document.getElementById('missionPlayDifficulty').textContent = mission.stars;

        // Narrative
        document.getElementById('missionNarrative').textContent = mission.narrative;

        // Objectives
        const objectivesList = document.getElementById('missionObjectives');
        if (objectivesList) {
            objectivesList.innerHTML = mission.objectives.map(obj =>
                `<li>${obj}</li>`
            ).join('');
        }

        // Questions progress
        this.updateQuestionProgress();

        // Render current question
        this.renderCurrentQuestion();
    }

    updateQuestionProgress() {
        const progress = document.getElementById('questionProgress');
        if (progress) {
            progress.textContent = `Pregunta ${this.currentQuestionIndex + 1} de ${this.currentMission.questions.length}`;
        }
    }

    renderCurrentQuestion() {
        const mission = this.currentMission;
        const question = mission.questions[this.currentQuestionIndex];
        if (!question) return;

        const container = document.getElementById('questionContainer');
        if (!container) return;

        let inputHTML = '';

        switch (question.type) {
            case 'select':
                inputHTML = `
                    <div class="radio-group">
                        ${question.options.map(opt => `
                            <div class="radio-option">
                                <input type="radio" name="answer" id="opt-${opt.value}" value="${opt.value}">
                                <label for="opt-${opt.value}">${opt.text}</label>
                            </div>
                        `).join('')}
                    </div>
                `;
                break;

            case 'number':
                inputHTML = `
                    <div class="form-group">
                        <input type="number" id="numberAnswer" class="form-input" 
                               placeholder="Ingresa tu respuesta numérica">
                    </div>
                `;
                break;

            case 'text':
                inputHTML = `
                    <div class="form-group">
                        <input type="text" id="textAnswer" class="form-input" 
                               placeholder="Escribe tu respuesta">
                    </div>
                `;
                break;
        }

        container.innerHTML = `
            <div class="question-card">
                <h3 class="question-title">${question.title}</h3>
                <p class="question-description">${question.description || ''}</p>
                
                ${inputHTML}
                
                <div class="question-hints hidden" id="hintsPanel">
                    <div class="hints-header">
                        <h4>💡 Pistas</h4>
                        <span class="hints-counter">Usadas: <span id="hintsUsed">0</span>/${question.hints?.length || 0}</span>
                    </div>
                    <div id="hintsContent"></div>
                </div>
                
                <div class="question-explanation hidden" id="explanationPanel">
                    <h4>✅ Explicación</h4>
                    <p>${question.explanation}</p>
                </div>
                
                <div class="question-actions">
                    <button class="btn btn-secondary" id="btnShowHint" onclick="missionSystem.showHint()">
                        💡 Pista
                    </button>
                    <button class="btn btn-primary" id="btnSubmitAnswer" onclick="missionSystem.submitAnswer()">
                        Enviar Respuesta
                    </button>
                    <button class="btn btn-success hidden" id="btnNextQuestion" onclick="missionSystem.nextQuestion()">
                        Siguiente →
                    </button>
                </div>
            </div>
        `;

        // Reset hints counter
        this.hintsUsedForQuestion = 0;
    }

    // ========================================================
    // GRÁFICOS
    // ========================================================

    initMissionChart() {
        const mission = this.currentMission;
        const dataset = allDatasets[mission.dataset];
        if (!dataset) return;

        const ctx = document.getElementById('missionChart');
        if (!ctx) return;

        // Destruir chart anterior si existe
        if (this.missionChart) {
            this.missionChart.destroy();
        }

        const config = mission.chartConfig;
        let chartData, chartType, chartOptions;

        if (config.useWeeklyData) {
            // Gráfico de barras para estacionalidad
            chartType = 'bar';
            chartData = {
                labels: config.labels,
                datasets: [{
                    label: 'Ventas Promedio',
                    data: Object.values(dataset.weeklyPattern),
                    backgroundColor: config.labels.map((_, i) =>
                        i === 5 ? 'rgba(74, 222, 128, 0.8)' : 'rgba(102, 126, 234, 0.6)'
                    ),
                    borderColor: config.labels.map((_, i) =>
                        i === 5 ? '#22c55e' : '#667eea'
                    ),
                    borderWidth: 2
                }]
            };
        } else {
            // Gráfico de línea estándar
            chartType = 'line';
            chartData = {
                labels: dataset.dates,
                datasets: [{
                    label: dataset.variable,
                    data: dataset.values,
                    borderColor: config.color || '#667eea',
                    backgroundColor: (config.color || 'rgba(102, 126, 234, 0.1)').replace(')', ', 0.1)'),
                    fill: true,
                    tension: 0.3,
                    pointRadius: config.showAnomalies ? 2 : 1
                }]
            };

            // Añadir línea de tendencia si aplica
            if (config.showTrendLine) {
                const n = dataset.values.length;
                let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
                dataset.values.forEach((y, x) => {
                    sumX += x;
                    sumY += y;
                    sumXY += x * y;
                    sumX2 += x * x;
                });
                const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
                const intercept = (sumY - slope * sumX) / n;
                const trendData = dataset.values.map((_, i) => Math.round(slope * i + intercept));

                chartData.datasets.push({
                    label: 'Tendencia',
                    data: trendData,
                    borderColor: '#ffc107',
                    borderWidth: 2,
                    borderDash: [8, 4],
                    fill: false,
                    pointRadius: 0
                });
            }
        }

        chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        };

        this.missionChart = new Chart(ctx, {
            type: chartType,
            data: chartData,
            options: chartOptions
        });
    }

    // ========================================================
    // PISTAS
    // ========================================================

    showHint() {
        const question = this.currentMission.questions[this.currentQuestionIndex];
        if (!question.hints || this.hintsUsedForQuestion >= question.hints.length) {
            return;
        }

        const hintsPanel = document.getElementById('hintsPanel');
        const hintsContent = document.getElementById('hintsContent');
        const hintsUsed = document.getElementById('hintsUsed');

        hintsPanel?.classList.remove('hidden');

        const hintIndex = this.hintsUsedForQuestion;
        const hint = question.hints[hintIndex];

        hintsContent.innerHTML += `
            <div class="hint-item" style="animation: slideIn 0.3s ease;">
                <span class="hint-level">Pista ${hintIndex + 1}</span>
                <p>${hint}</p>
            </div>
        `;

        this.hintsUsedForQuestion++;
        if (hintsUsed) hintsUsed.textContent = this.hintsUsedForQuestion;

        // Desactivar botón si no hay más pistas
        if (this.hintsUsedForQuestion >= question.hints.length) {
            document.getElementById('btnShowHint')?.setAttribute('disabled', 'true');
        }

        // Registrar uso de pista (penalización XP)
        if (!this.missionAnswers[question.id]) {
            this.missionAnswers[question.id] = { hintsUsed: 0 };
        }
        this.missionAnswers[question.id].hintsUsed++;
    }

    // ========================================================
    // ENVIAR RESPUESTA
    // ========================================================

    submitAnswer() {
        const question = this.currentMission.questions[this.currentQuestionIndex];
        let userAnswer;

        switch (question.type) {
            case 'select':
                const selected = document.querySelector('input[name="answer"]:checked');
                userAnswer = selected?.value;
                break;
            case 'number':
                userAnswer = parseFloat(document.getElementById('numberAnswer')?.value);
                break;
            case 'text':
                userAnswer = document.getElementById('textAnswer')?.value?.toLowerCase().trim();
                break;
        }

        if (userAnswer === undefined || userAnswer === '' || (typeof userAnswer === 'number' && isNaN(userAnswer))) {
            alert('Por favor, selecciona o ingresa una respuesta.');
            return;
        }

        const isCorrect = this.checkAnswer(question, userAnswer);

        // Guardar respuesta
        if (!this.missionAnswers[question.id]) {
            this.missionAnswers[question.id] = { hintsUsed: 0 };
        }
        this.missionAnswers[question.id].answer = userAnswer;
        this.missionAnswers[question.id].correct = isCorrect;

        // Mostrar feedback
        this.showAnswerFeedback(isCorrect, question);
    }

    checkAnswer(question, userAnswer) {
        switch (question.type) {
            case 'select':
                return userAnswer === question.correctAnswer;
            case 'number':
                if (question.acceptedRange) {
                    return userAnswer >= question.acceptedRange[0] && userAnswer <= question.acceptedRange[1];
                }
                return userAnswer === question.correctAnswer;
            case 'text':
                if (question.correctAnswers) {
                    return question.correctAnswers.some(ans =>
                        userAnswer.includes(ans.toLowerCase())
                    );
                }
                return userAnswer === question.correctAnswer?.toLowerCase();
            default:
                return false;
        }
    }

    showAnswerFeedback(isCorrect, question) {
        const explanationPanel = document.getElementById('explanationPanel');
        const btnSubmit = document.getElementById('btnSubmitAnswer');
        const btnNext = document.getElementById('btnNextQuestion');
        const btnHint = document.getElementById('btnShowHint');

        // Limpiar clases previas
        explanationPanel?.classList.remove('hidden', 'feedback-correct', 'feedback-incorrect');
        explanationPanel?.style.removeProperty('background');
        explanationPanel?.style.removeProperty('border-color');

        // Mostrar panel
        explanationPanel?.classList.remove('hidden');

        if (isCorrect) {
            // Correcto
            explanationPanel?.classList.add('feedback-correct');
            explanationPanel.querySelector('h4').textContent = '✅ Correcto';

            // Confetti
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { y: 0.7 }
                });
            }

            // Sound
            if (typeof soundManager !== 'undefined') {
                soundManager.play('success');
            }
        } else {
            // Incorrecto
            explanationPanel?.classList.add('feedback-incorrect');
            explanationPanel.querySelector('h4').textContent = '❌ Incorrecto';

            // Animation shake
            if (typeof anime !== 'undefined') {
                anime({
                    targets: '.question-card',
                    translateX: [-5, 5, -5, 5, 0],
                    duration: 400
                });
            }

            // Sound
            if (typeof soundManager !== 'undefined') {
                soundManager.play('error');
            }
        }

        // Ocultar botones de envío, mostrar siguiente
        btnSubmit?.classList.add('hidden');
        btnHint?.classList.add('hidden');
        btnNext?.classList.remove('hidden');

        // Si es la última pregunta, cambiar texto
        if (this.currentQuestionIndex >= this.currentMission.questions.length - 1) {
            if (btnNext) btnNext.textContent = 'Finalizar Misión 🎉';
        }
    }

    // ========================================================
    // SIGUIENTE PREGUNTA
    // ========================================================

    nextQuestion() {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex >= this.currentMission.questions.length) {
            // Misión completada
            this.completeMission();
        } else {
            // Siguiente pregunta
            this.updateQuestionProgress();
            this.renderCurrentQuestion();
        }
    }

    // ========================================================
    // COMPLETAR MISIÓN
    // ========================================================

    completeMission() {
        const mission = this.currentMission;

        // Calcular XP ganado
        let xpEarned = mission.xpReward;
        let correctAnswers = 0;
        let totalHints = 0;

        for (const questionId in this.missionAnswers) {
            const answer = this.missionAnswers[questionId];
            if (answer.correct) correctAnswers++;
            totalHints += answer.hintsUsed || 0;
        }

        // Penalización por pistas (10% por pista)
        const hintPenalty = Math.min(totalHints * 0.1, 0.5);
        xpEarned = Math.round(xpEarned * (1 - hintPenalty));

        // Penalización por respuestas incorrectas
        const correctRatio = correctAnswers / mission.questions.length;
        xpEarned = Math.round(xpEarned * correctRatio);

        // Determinamos si aprobó (Mínimo 60% de aciertos)
        const isSuccess = correctRatio >= 0.6;

        if (isSuccess) {
            // Actualizar estado solo si aprobó
            if (!this.playerState.completedMissions.includes(mission.id)) {
                this.playerState.completedMissions.push(mission.id);
            }

            // Solo sumar XP si es mejor que el anterior
            const previousScore = this.playerState.missionScores[mission.id] || 0;
            if (xpEarned > previousScore) {
                this.playerState.totalXP += (xpEarned - previousScore);
                this.playerState.missionScores[mission.id] = xpEarned;
            }

            // Desbloquear siguiente misión
            if (mission.reward.unlock && !this.playerState.unlockedMissions.includes(mission.reward.unlock)) {
                this.playerState.unlockedMissions.push(mission.reward.unlock);
            }

            // Achievement
            const achievementId = mission.id;
            if (!this.playerState.achievements.includes(achievementId)) {
                this.playerState.achievements.push(achievementId);
            }

            // Guardar
            this.savePlayerState();
        }

        // Mostrar modal de completado o fallido
        this.showMissionCompleteModal(mission, xpEarned, correctAnswers, isSuccess);
    }

    showMissionCompleteModal(mission, xpEarned, correctAnswers, isSuccess) {
        const modal = document.getElementById('missionCompleteModal');
        if (!modal) return;

        const titleEl = document.getElementById('completeMissionTitle');
        const nextBtn = document.getElementById('btnNextMission');
        const iconEl = document.getElementById('completeAchievementIcon');
        const descEl = document.getElementById('completeAchievementDesc');
        const nameEl = document.getElementById('completeAchievementName');

        document.getElementById('completeTotalXP').textContent = this.playerState.totalXP;
        document.getElementById('completeCorrectAnswers').textContent =
            `${correctAnswers}/${mission.questions.length}`;

        if (isSuccess) {
            // ÉXITO
            titleEl.textContent = `¡${mission.title} Completada!`;
            titleEl.style.color = 'var(--success)';
            document.getElementById('completeXPEarned').textContent = `+${xpEarned} XP`;

            // Achievement
            const achievement = achievements.find(a => a.mission === mission.id);
            if (achievement) {
                iconEl.textContent = achievement.icon;
                nameEl.textContent = achievement.name;
                descEl.textContent = achievement.desc;
                // Estilo normal de éxito
                document.querySelector('.complete-achievement').style.opacity = '1';
                document.querySelector('.complete-achievement').style.filter = 'none';
            }

            // Next mission button configuration
            if (nextBtn) {
                nextBtn.classList.remove('hidden');
                // Remover listeners anteriores para evitar duplicados si se re-renderiza
                const newBtn = nextBtn.cloneNode(true);
                nextBtn.parentNode.replaceChild(newBtn, nextBtn);

                if (mission.id < 7) {
                    newBtn.textContent = `Misión ${mission.id + 1} →`;
                    newBtn.onclick = () => {
                        modal.classList.remove('active');
                        if (this.currentMission.id + 1 <= 7) {
                            this.startMission(this.currentMission.id + 1);
                        } else {
                            this.showNameModal();
                        }
                    };
                } else {
                    newBtn.textContent = '🎓 ¡Campaña Completada!';
                    newBtn.onclick = () => {
                        this.finishCampaign();
                    };
                }
            }

            // Celebration
            if (typeof confetti !== 'undefined') {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }

            if (typeof soundManager !== 'undefined') soundManager.play('complete');

        } else {
            // FALLO
            titleEl.textContent = 'Misión Fallida';
            titleEl.style.color = '#ef4444';
            document.getElementById('completeXPEarned').textContent = '+0 XP';

            // Achievement visual feedback (Locked/Grayed out)
            if (iconEl) iconEl.textContent = '🔒';
            if (nameEl) nameEl.textContent = 'Logro Bloqueado';
            if (descEl) descEl.textContent = 'Necesitas al menos 60% de aciertos.';

            document.querySelector('.complete-achievement').style.opacity = '0.7';
            document.querySelector('.complete-achievement').style.filter = 'grayscale(100%)';

            // Configure button for Retry
            if (nextBtn) {
                const newBtn = nextBtn.cloneNode(true);
                nextBtn.parentNode.replaceChild(newBtn, nextBtn);

                newBtn.textContent = '🔄 Intentar de nuevo';
                newBtn.classList.remove('hidden');
                newBtn.onclick = () => {
                    modal.classList.remove('active');
                    this.startMission(mission.id); // Restart current
                };
            }

            if (typeof soundManager !== 'undefined') soundManager.play('error');
        }

        modal.classList.add('active');
    }

    // ========================================================
    // FINALIZACIÓN DE CAMPAÑA
    // ========================================================


    finishCampaign() {
        this.showMissionSelect();
        // Maybe trigger some global celebration
    }

    // ========================================================
    // RESET (para testing)
    // ========================================================

    resetProgress() {
        if (confirm('¿Seguro que quieres reiniciar todo el progreso?')) {
            localStorage.removeItem(this.storageKey);
            this.playerState = this.loadPlayerState();
            this.showMissionSelect();
        }
    }
}

// Instancia global
let missionSystem;
