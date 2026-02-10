
// Mock Game State and functions from app.js
// Since we don't have modules, we simulate the state object and critical functions.

const gameState = {
    currentMission: 0,
    unlockedMissions: 1, // Start with mission 1 unlocked (index 0)
    xp: 0,
    badges: [],
    completed: [] // Array of booleans for mission completion
};

// Mock Missions
const missions = [
    { id: 1, xp: 100, questions: [{ correct: 4 }] },
    { id: 2, xp: 150, questions: [{ correct: "trend" }] }
];

// Mock core logic
function submitAnswer(missionIndex, questionIndex, answer) {
    const mission = missions[missionIndex];
    const question = mission.questions[questionIndex];

    // Simplified validation Logic
    let isCorrect = (answer === question.correct);

    if (isCorrect) {
        completeMission(missionIndex);
        return { success: true, message: "Correcto" };
    } else {
        return { success: false, message: "Incorrecto" };
    }
}

function completeMission(missionIndex) {
    if (!gameState.completed[missionIndex]) {
        gameState.completed[missionIndex] = true;
        gameState.xp += missions[missionIndex].xp;

        // Unlock next mission
        if (missionIndex + 1 < missions.length) {
            gameState.unlockedMissions = Math.max(gameState.unlockedMissions, missionIndex + 2);
        }

        saveProgress();
    }
}

// Mock LocalStorage
const localStorageMock = (function () {
    let store = {};
    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        }
    };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

function saveProgress() {
    localStorage.setItem('detectiveDatos_save', JSON.stringify({
        unlockedMissions: gameState.unlockedMissions,
        xp: gameState.xp,
        completed: gameState.completed
    }));
}

describe('Integration Test: Gameplay Flow', () => {
    beforeEach(() => {
        // Reset State
        gameState.currentMission = 0;
        gameState.unlockedMissions = 1;
        gameState.xp = 0;
        gameState.completed = [];
        localStorage.clear();
    });

    test('Debe desbloquear la siguiente misión al completar la actual', () => {
        // User plays Mission 1
        const result = submitAnswer(0, 0, 4); // Correct answer for M1

        expect(result.success).toBe(true);
        expect(gameState.xp).toBe(100); // XP gained
        expect(gameState.unlockedMissions).toBe(2); // Mission 2 unlocked
        expect(gameState.completed[0]).toBe(true); // Mission 1 marked complete
    });

    test('Debe guardar el progreso en LocalStorage', () => {
        submitAnswer(0, 0, 4); // Complete M1

        const savedData = JSON.parse(localStorage.getItem('detectiveDatos_save'));

        expect(savedData.xp).toBe(100);
        expect(savedData.unlockedMissions).toBe(2);
        expect(savedData.completed[0]).toBe(true);
    });

    test('No debe otorgar doble XP si la misión ya fue completada', () => {
        submitAnswer(0, 0, 4); // First time
        expect(gameState.xp).toBe(100);

        submitAnswer(0, 0, 4); // Second time
        expect(gameState.xp).toBe(100); // XP should remain same
    });

    test('Respuesta incorrecta no avanza el juego', () => {
        const result = submitAnswer(0, 0, 999); // Wrong answer

        expect(result.success).toBe(false);
        expect(gameState.xp).toBe(0);
        expect(gameState.unlockedMissions).toBe(1); // Still on M1
    });
});
