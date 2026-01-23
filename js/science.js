/**
 * STEM Learning Hub - Science Page Interactive Features
 * Engaging learning experiences for 8th graders
 */

// =========================================
// State Management
// =========================================
const ScienceApp = {
    state: {
        currentTopic: 'physics',
        score: 0,
        completedActivities: new Set(),
        achievements: [],
        quizAttempts: {},
        particleAnimationId: null
    },
    
    // Points for different activities
    points: {
        quiz: 10,
        experiment: 15,
        game: 20,
        exploration: 5
    }
};

// =========================================
// Initialization
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initTopicNavigation();
    initQuizSystem();
    initForceCalculator();
    initStateOfMatterSimulator();
    initPeriodicTableExplorer();
    initDNAGame();
    initCellExplorer();
    initProgressTracker();
    initAchievements();
    initLabSimulations();
    initFlashcards();
    loadProgress();
});

// =========================================
// Topic Navigation (Enhanced)
// =========================================
function initTopicNavigation() {
    const topicBtns = document.querySelectorAll('.topic-btn');
    const topicSections = document.querySelectorAll('.topic-section');
    
    topicBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic;
            
            // Update active states with animation
            topicBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            topicSections.forEach(section => {
                if (section.id === topic) {
                    section.classList.add('active');
                    section.style.animation = 'slideIn 0.4s ease-out';
                    
                    // Track exploration
                    if (!ScienceApp.state.completedActivities.has(`explore-${topic}`)) {
                        ScienceApp.state.completedActivities.add(`explore-${topic}`);
                        addPoints(ScienceApp.points.exploration, `Explored ${topic}!`);
                    }
                } else {
                    section.classList.remove('active');
                }
            });
            
            ScienceApp.state.currentTopic = topic;
            saveProgress();
        });
    });
}

// =========================================
// Enhanced Quiz System
// =========================================
function initQuizSystem() {
    // Physics quizzes
    const physicsQuizzes = [
        {
            id: 'physics-q1',
            question: 'If you push a box with a force of 10N and it accelerates at 2 m/s², what is its mass?',
            options: ['2 kg', '5 kg', '20 kg', '12 kg'],
            correct: 1,
            explanation: 'Using F = m × a, we get: 10N = m × 2 m/s². Solving for m: m = 10/2 = 5 kg'
        },
        {
            id: 'physics-q2',
            question: "Which of Newton's laws explains why you feel pushed back when a car accelerates?",
            options: ['1st Law (Inertia)', '2nd Law (F=ma)', '3rd Law (Action-Reaction)', 'None of these'],
            correct: 0,
            explanation: "The 1st Law (Inertia) - your body wants to stay at rest while the car moves forward!"
        },
        {
            id: 'physics-q3',
            question: 'A rocket pushes gas downward. What happens according to Newton\'s 3rd Law?',
            options: ['Nothing happens', 'The rocket moves downward', 'The rocket moves upward', 'The gas disappears'],
            correct: 2,
            explanation: 'For every action (gas pushed down), there is an equal and opposite reaction (rocket pushed up)!'
        }
    ];

    // Chemistry quizzes
    const chemistryQuizzes = [
        {
            id: 'chem-q1',
            question: 'In which state of matter do particles move most freely?',
            options: ['Solid', 'Liquid', 'Gas', 'All the same'],
            correct: 2,
            explanation: 'Gas particles have the most energy and move freely in all directions!'
        },
        {
            id: 'chem-q2',
            question: 'What is the chemical symbol for Iron?',
            options: ['Ir', 'I', 'Fe', 'In'],
            correct: 2,
            explanation: 'Fe comes from the Latin word "Ferrum" meaning iron!'
        }
    ];

    // Biology quizzes
    const biologyQuizzes = [
        {
            id: 'bio-q1',
            question: 'Which organelle is called the "powerhouse of the cell"?',
            options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body'],
            correct: 2,
            explanation: 'Mitochondria produce ATP, the energy currency of the cell!'
        },
        {
            id: 'bio-q2',
            question: 'In DNA, which base pairs with Adenine (A)?',
            options: ['Guanine (G)', 'Cytosine (C)', 'Thymine (T)', 'Uracil (U)'],
            correct: 2,
            explanation: 'A always pairs with T, and G always pairs with C!'
        }
    ];

    // Create quiz containers
    createQuizSection('physics', physicsQuizzes);
    createQuizSection('chemistry', chemistryQuizzes);
    createQuizSection('biology', biologyQuizzes);
}

function createQuizSection(topic, quizzes) {
    const section = document.getElementById(topic);
    if (!section) return;

    // Find or create quiz container
    let quizContainer = section.querySelector('.quiz-container');
    if (!quizContainer) {
        quizContainer = document.createElement('div');
        quizContainer.className = 'quiz-container';
        
        const quizCard = section.querySelector('.quiz-card');
        if (quizCard) {
            quizCard.innerHTML = '';
            quizCard.appendChild(quizContainer);
        } else {
            const newQuizCard = document.createElement('div');
            newQuizCard.className = 'quiz-card';
            newQuizCard.appendChild(quizContainer);
            section.appendChild(newQuizCard);
        }
    }

    // Create quiz HTML
    quizContainer.innerHTML = `
        <div class="quiz-header">
            <h3>🎯 Knowledge Check</h3>
            <div class="quiz-progress">
                <span class="quiz-score">Score: <span id="${topic}-score">0</span>/${quizzes.length * 10}</span>
                <div class="quiz-progress-bar">
                    <div class="quiz-progress-fill" id="${topic}-progress"></div>
                </div>
            </div>
        </div>
        <div class="quiz-questions" id="${topic}-questions"></div>
        <div class="quiz-results" id="${topic}-results" style="display: none;">
            <div class="results-content">
                <div class="results-icon">🏆</div>
                <h4>Quiz Complete!</h4>
                <p class="results-score"></p>
                <button class="btn btn-primary retry-quiz">Try Again</button>
            </div>
        </div>
    `;

    const questionsContainer = quizContainer.querySelector(`#${topic}-questions`);
    
    quizzes.forEach((quiz, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question-card';
        questionDiv.dataset.questionIndex = index;
        
        questionDiv.innerHTML = `
            <div class="question-number">Question ${index + 1} of ${quizzes.length}</div>
            <p class="question-text">${quiz.question}</p>
            <div class="quiz-options">
                ${quiz.options.map((option, i) => `
                    <label class="quiz-option" data-index="${i}">
                        <input type="radio" name="${quiz.id}" value="${i}">
                        <span class="option-marker">${String.fromCharCode(65 + i)}</span>
                        <span class="option-text">${option}</span>
                        <span class="option-indicator"></span>
                    </label>
                `).join('')}
            </div>
            <div class="question-feedback" style="display: none;">
                <p class="feedback-text"></p>
                <p class="explanation">${quiz.explanation}</p>
            </div>
            <button class="btn btn-primary submit-answer" data-quiz-id="${quiz.id}" data-correct="${quiz.correct}">
                Submit Answer
            </button>
        `;
        
        questionsContainer.appendChild(questionDiv);
    });

    // Add event listeners
    initQuizEventListeners(topic, quizzes);
}

function initQuizEventListeners(topic, quizzes) {
    const container = document.querySelector(`#${topic}-questions`);
    if (!container) return;

    // Initialize quiz state
    ScienceApp.state.quizAttempts[topic] = {
        answered: new Set(),
        correct: 0,
        total: quizzes.length
    };

    // Submit answer buttons
    container.querySelectorAll('.submit-answer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const quizId = btn.dataset.quizId;
            const correctIndex = parseInt(btn.dataset.correct);
            const questionCard = btn.closest('.quiz-question-card');
            const selectedOption = questionCard.querySelector(`input[name="${quizId}"]:checked`);
            
            if (!selectedOption) {
                showToast('Please select an answer!', 'warning');
                return;
            }

            if (ScienceApp.state.quizAttempts[topic].answered.has(quizId)) {
                return;
            }

            const selectedIndex = parseInt(selectedOption.value);
            const isCorrect = selectedIndex === correctIndex;
            const feedback = questionCard.querySelector('.question-feedback');
            const feedbackText = feedback.querySelector('.feedback-text');

            // Mark as answered
            ScienceApp.state.quizAttempts[topic].answered.add(quizId);
            
            // Disable all options
            questionCard.querySelectorAll('.quiz-option').forEach((opt, i) => {
                opt.classList.add('disabled');
                if (i === correctIndex) {
                    opt.classList.add('correct');
                } else if (i === selectedIndex && !isCorrect) {
                    opt.classList.add('incorrect');
                }
            });

            // Show feedback
            feedback.style.display = 'block';
            if (isCorrect) {
                feedbackText.textContent = '✅ Correct! Great job!';
                feedbackText.className = 'feedback-text correct';
                ScienceApp.state.quizAttempts[topic].correct++;
                addPoints(ScienceApp.points.quiz, 'Correct answer!');
            } else {
                feedbackText.textContent = '❌ Not quite right. Here\'s why:';
                feedbackText.className = 'feedback-text incorrect';
            }

            // Update progress
            updateQuizProgress(topic);
            
            // Hide submit button
            btn.style.display = 'none';

            // Check if quiz is complete
            if (ScienceApp.state.quizAttempts[topic].answered.size === quizzes.length) {
                setTimeout(() => showQuizResults(topic), 500);
            }

            saveProgress();
        });
    });

    // Retry button
    const retryBtn = document.querySelector(`#${topic}-results .retry-quiz`);
    if (retryBtn) {
        retryBtn.addEventListener('click', () => resetQuiz(topic, quizzes));
    }
}

function updateQuizProgress(topic) {
    const state = ScienceApp.state.quizAttempts[topic];
    const score = state.correct * 10;
    const progress = (state.answered.size / state.total) * 100;
    
    const scoreEl = document.querySelector(`#${topic}-score`);
    const progressEl = document.querySelector(`#${topic}-progress`);
    
    if (scoreEl) scoreEl.textContent = score;
    if (progressEl) progressEl.style.width = `${progress}%`;
}

function showQuizResults(topic) {
    const state = ScienceApp.state.quizAttempts[topic];
    const results = document.querySelector(`#${topic}-results`);
    const questions = document.querySelector(`#${topic}-questions`);
    const resultsScore = results.querySelector('.results-score');
    
    const percentage = Math.round((state.correct / state.total) * 100);
    let message = '';
    
    if (percentage === 100) {
        message = `Perfect score! You got ${state.correct}/${state.total} correct! 🌟`;
        checkAchievement('perfect_quiz');
    } else if (percentage >= 70) {
        message = `Great job! You got ${state.correct}/${state.total} correct! 👏`;
    } else {
        message = `You got ${state.correct}/${state.total} correct. Keep practicing! 💪`;
    }
    
    resultsScore.textContent = message;
    questions.style.display = 'none';
    results.style.display = 'block';
    results.style.animation = 'scaleIn 0.3s ease-out';
}

function resetQuiz(topic, quizzes) {
    ScienceApp.state.quizAttempts[topic] = {
        answered: new Set(),
        correct: 0,
        total: quizzes.length
    };
    
    const container = document.querySelector(`#${topic}`);
    const questions = container.querySelector(`#${topic}-questions`);
    const results = container.querySelector(`#${topic}-results`);
    
    // Reset UI
    questions.querySelectorAll('.quiz-question-card').forEach(card => {
        card.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('disabled', 'correct', 'incorrect');
            opt.querySelector('input').checked = false;
        });
        card.querySelector('.question-feedback').style.display = 'none';
        card.querySelector('.submit-answer').style.display = 'block';
    });
    
    updateQuizProgress(topic);
    results.style.display = 'none';
    questions.style.display = 'block';
}

// =========================================
// Force Calculator (Physics)
// =========================================
function initForceCalculator() {
    const physicsSection = document.getElementById('physics');
    if (!physicsSection) return;

    // Find the second law card or create calculator after it
    const lawCards = physicsSection.querySelectorAll('.law-card');
    let insertAfter = null;
    lawCards.forEach(card => {
        if (card.textContent.includes('2nd Law')) {
            insertAfter = card;
        }
    });

    if (!insertAfter) return;

    const calculator = document.createElement('div');
    calculator.className = 'interactive-calculator';
    calculator.innerHTML = `
        <h4>🧮 Force Calculator - Try It Yourself!</h4>
        <p>Enter any two values to calculate the third:</p>
        <div class="calculator-grid">
            <div class="calc-input-group">
                <label for="force-input">Force (N)</label>
                <input type="number" id="force-input" placeholder="?" step="0.1">
                <span class="input-icon">⬇️</span>
            </div>
            <div class="calc-equals">=</div>
            <div class="calc-input-group">
                <label for="mass-input">Mass (kg)</label>
                <input type="number" id="mass-input" placeholder="?" step="0.1">
                <span class="input-icon">📦</span>
            </div>
            <div class="calc-times">×</div>
            <div class="calc-input-group">
                <label for="accel-input">Acceleration (m/s²)</label>
                <input type="number" id="accel-input" placeholder="?" step="0.1">
                <span class="input-icon">🚀</span>
            </div>
        </div>
        <div class="calculator-buttons">
            <button class="btn btn-primary" id="calculate-force">Calculate</button>
            <button class="btn btn-secondary" id="reset-calculator">Reset</button>
        </div>
        <div class="calculator-result" id="calc-result" style="display: none;">
            <div class="result-animation"></div>
            <p class="result-text"></p>
        </div>
        <div class="calculator-visual" id="force-visual">
            <div class="force-animation-container">
                <div class="box-object" id="animated-box">📦</div>
                <div class="force-arrow" id="force-arrow">→</div>
            </div>
            <p class="visual-label">Watch the box respond to force!</p>
        </div>
    `;

    insertAfter.parentNode.insertBefore(calculator, insertAfter.nextSibling);

    // Add event listeners
    const forceInput = document.getElementById('force-input');
    const massInput = document.getElementById('mass-input');
    const accelInput = document.getElementById('accel-input');
    const calculateBtn = document.getElementById('calculate-force');
    const resetBtn = document.getElementById('reset-calculator');
    const resultDiv = document.getElementById('calc-result');

    calculateBtn.addEventListener('click', () => {
        const force = parseFloat(forceInput.value);
        const mass = parseFloat(massInput.value);
        const accel = parseFloat(accelInput.value);

        let result = '';
        let calculated = null;

        // Count filled inputs
        const filled = [!isNaN(force), !isNaN(mass), !isNaN(accel)].filter(Boolean).length;

        if (filled < 2) {
            showToast('Please enter at least 2 values!', 'warning');
            return;
        }

        if (!isNaN(mass) && !isNaN(accel) && isNaN(force)) {
            calculated = mass * accel;
            forceInput.value = calculated.toFixed(2);
            result = `Force = ${mass} kg × ${accel} m/s² = <strong>${calculated.toFixed(2)} N</strong>`;
        } else if (!isNaN(force) && !isNaN(accel) && isNaN(mass)) {
            calculated = force / accel;
            massInput.value = calculated.toFixed(2);
            result = `Mass = ${force} N ÷ ${accel} m/s² = <strong>${calculated.toFixed(2)} kg</strong>`;
        } else if (!isNaN(force) && !isNaN(mass) && isNaN(accel)) {
            calculated = force / mass;
            accelInput.value = calculated.toFixed(2);
            result = `Acceleration = ${force} N ÷ ${mass} kg = <strong>${calculated.toFixed(2)} m/s²</strong>`;
        } else {
            // Verify the equation
            const check = mass * accel;
            if (Math.abs(check - force) < 0.01) {
                result = `✅ Correct! ${force} N = ${mass} kg × ${accel} m/s²`;
            } else {
                result = `❌ Check your values: ${mass} kg × ${accel} m/s² = ${check.toFixed(2)} N, not ${force} N`;
            }
        }

        resultDiv.style.display = 'block';
        resultDiv.querySelector('.result-text').innerHTML = result;
        resultDiv.style.animation = 'slideIn 0.3s ease-out';

        // Animate the visual
        animateForceVisual(calculated || force);

        // Track activity
        if (!ScienceApp.state.completedActivities.has('force-calculator')) {
            ScienceApp.state.completedActivities.add('force-calculator');
            addPoints(ScienceApp.points.experiment, 'Used the Force Calculator!');
            checkAchievement('first_experiment');
        }
    });

    resetBtn.addEventListener('click', () => {
        forceInput.value = '';
        massInput.value = '';
        accelInput.value = '';
        resultDiv.style.display = 'none';
        resetForceVisual();
    });
}

function animateForceVisual(force) {
    const box = document.getElementById('animated-box');
    const arrow = document.getElementById('force-arrow');
    
    if (!box || !arrow) return;

    // Scale arrow based on force
    const arrowSize = Math.min(Math.max(force / 5, 1), 5);
    arrow.style.transform = `scaleX(${arrowSize})`;
    arrow.style.opacity = '1';
    
    // Animate box movement
    const distance = Math.min(force * 5, 150);
    box.style.transition = 'transform 0.5s ease-out';
    box.style.transform = `translateX(${distance}px)`;
    
    // Bounce back slightly
    setTimeout(() => {
        box.style.transform = `translateX(${distance * 0.8}px)`;
    }, 500);
}

function resetForceVisual() {
    const box = document.getElementById('animated-box');
    const arrow = document.getElementById('force-arrow');
    
    if (box) box.style.transform = 'translateX(0)';
    if (arrow) {
        arrow.style.transform = 'scaleX(1)';
        arrow.style.opacity = '0.5';
    }
}

// =========================================
// State of Matter Simulator (Chemistry)
// =========================================
function initStateOfMatterSimulator() {
    const chemSection = document.getElementById('chemistry');
    if (!chemSection) return;

    const statesGrid = chemSection.querySelector('.states-grid');
    if (!statesGrid) return;

    // Create interactive simulator
    const simulator = document.createElement('div');
    simulator.className = 'matter-simulator';
    simulator.innerHTML = `
        <h4>🌡️ Interactive Particle Simulator</h4>
        <p>Adjust the temperature to see how particles behave in different states!</p>
        
        <div class="simulator-container">
            <div class="particle-container" id="particle-container">
                <canvas id="particle-canvas" width="300" height="200"></canvas>
            </div>
            <div class="temperature-control">
                <label for="temp-slider">Temperature</label>
                <input type="range" id="temp-slider" min="0" max="100" value="25">
                <div class="temp-display">
                    <span id="temp-value">25</span>°C
                    <span id="state-label" class="state-badge">Liquid</span>
                </div>
                <div class="temp-markers">
                    <span>❄️ Cold</span>
                    <span>🔥 Hot</span>
                </div>
            </div>
        </div>
        
        <div class="simulator-info" id="simulator-info">
            <p>💧 <strong>Liquid:</strong> Particles slide past each other, taking the shape of their container.</p>
        </div>
    `;

    statesGrid.parentNode.insertBefore(simulator, statesGrid.nextSibling);

    // Initialize particle animation
    initParticleAnimation();
}

function initParticleAnimation() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 30;
    let temperature = 25;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: 8
        });
    }

    function getState(temp) {
        if (temp < 20) return 'solid';
        if (temp < 80) return 'liquid';
        return 'gas';
    }

    function updateParticles() {
        const state = getState(temperature);
        const speedMultiplier = temperature / 25;

        particles.forEach(p => {
            if (state === 'solid') {
                // Vibrate in place
                p.x += (Math.random() - 0.5) * 0.5;
                p.y += (Math.random() - 0.5) * 0.5;
                
                // Keep in grid formation
                const gridX = Math.round(p.x / 30) * 30 + 15;
                const gridY = Math.round(p.y / 30) * 30 + 15;
                p.x += (gridX - p.x) * 0.1;
                p.y += (gridY - p.y) * 0.1;
            } else {
                // Move based on velocity
                p.x += p.vx * speedMultiplier;
                p.y += p.vy * speedMultiplier;

                // Add randomness for gas
                if (state === 'gas') {
                    p.vx += (Math.random() - 0.5) * 0.5;
                    p.vy += (Math.random() - 0.5) * 0.5;
                }

                // Bounce off walls
                if (p.x < p.radius || p.x > canvas.width - p.radius) {
                    p.vx *= -0.9;
                    p.x = Math.max(p.radius, Math.min(canvas.width - p.radius, p.x));
                }
                if (p.y < p.radius || p.y > canvas.height - p.radius) {
                    p.vy *= -0.9;
                    p.y = Math.max(p.radius, Math.min(canvas.height - p.radius, p.y));
                }

                // Limit velocity
                const maxSpeed = state === 'gas' ? 5 : 2;
                p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx));
                p.vy = Math.max(-maxSpeed, Math.min(maxSpeed, p.vy));
            }
        });
    }

    function draw() {
        const state = getState(temperature);
        
        // Clear canvas
        ctx.fillStyle = state === 'gas' ? '#e8f4f8' : state === 'liquid' ? '#cce7ff' : '#e0e0e0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            
            // Color based on temperature
            const hue = 200 - (temperature * 1.5);
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
            ctx.fill();
            
            // Add glow for gas
            if (state === 'gas') {
                ctx.shadowColor = `hsl(${hue}, 70%, 50%)`;
                ctx.shadowBlur = 10;
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.stroke();
        });

        updateParticles();
        ScienceApp.state.particleAnimationId = requestAnimationFrame(draw);
    }

    // Temperature slider
    const slider = document.getElementById('temp-slider');
    const tempValue = document.getElementById('temp-value');
    const stateLabel = document.getElementById('state-label');
    const infoDiv = document.getElementById('simulator-info');

    slider.addEventListener('input', (e) => {
        temperature = parseInt(e.target.value);
        tempValue.textContent = temperature;
        
        const state = getState(temperature);
        stateLabel.textContent = state.charAt(0).toUpperCase() + state.slice(1);
        stateLabel.className = `state-badge ${state}`;
        
        const stateInfo = {
            solid: '🧊 <strong>Solid:</strong> Particles vibrate in fixed positions, maintaining a definite shape.',
            liquid: '💧 <strong>Liquid:</strong> Particles slide past each other, taking the shape of their container.',
            gas: '💨 <strong>Gas:</strong> Particles move rapidly and spread out to fill all available space.'
        };
        
        infoDiv.innerHTML = `<p>${stateInfo[state]}</p>`;

        // Track activity
        if (!ScienceApp.state.completedActivities.has('matter-simulator')) {
            ScienceApp.state.completedActivities.add('matter-simulator');
            addPoints(ScienceApp.points.experiment, 'Explored states of matter!');
        }
    });

    // Start animation
    draw();
}

// =========================================
// Periodic Table Explorer (Chemistry)
// =========================================
function initPeriodicTableExplorer() {
    const elementsShowcase = document.querySelector('.elements-showcase');
    if (!elementsShowcase) return;

    // Enhanced element data
    const elements = [
        { number: 1, symbol: 'H', name: 'Hydrogen', color: '#ff6b6b', 
          facts: ['Lightest element', 'Most abundant in universe', 'Used in rocket fuel'] },
        { number: 6, symbol: 'C', name: 'Carbon', color: '#ffd93d',
          facts: ['Basis of all organic life', 'Forms diamonds and graphite', '4th most abundant element'] },
        { number: 8, symbol: 'O', name: 'Oxygen', color: '#6bcb77',
          facts: ['Essential for breathing', '21% of atmosphere', 'Most abundant in Earth\'s crust'] },
        { number: 26, symbol: 'Fe', name: 'Iron', color: '#4d96ff',
          facts: ['Core of Earth is mostly iron', 'Used to make steel', 'Essential for blood cells'] },
        { number: 79, symbol: 'Au', name: 'Gold', color: '#f5a623',
          facts: ['Doesn\'t tarnish or corrode', 'Excellent conductor', 'Used since ancient times'] },
        { number: 47, symbol: 'Ag', name: 'Silver', color: '#c0c0c0',
          facts: ['Best conductor of electricity', 'Antibacterial properties', 'Used in photography'] }
    ];

    // Rebuild elements showcase
    elementsShowcase.innerHTML = `
        <div class="elements-grid">
            ${elements.map(el => `
                <div class="element-card interactive" style="--element-color: ${el.color};" data-element="${el.symbol}">
                    <span class="element-number">${el.number}</span>
                    <span class="element-symbol">${el.symbol}</span>
                    <span class="element-name">${el.name}</span>
                    <span class="click-hint">Click to learn more!</span>
                </div>
            `).join('')}
        </div>
        <div class="element-detail-panel" id="element-detail" style="display: none;">
            <button class="close-panel">&times;</button>
            <div class="detail-content"></div>
        </div>
    `;

    // Add click handlers
    elementsShowcase.querySelectorAll('.element-card').forEach(card => {
        card.addEventListener('click', () => {
            const symbol = card.dataset.element;
            const element = elements.find(e => e.symbol === symbol);
            showElementDetail(element);
        });
    });

    // Close panel
    const closeBtn = elementsShowcase.querySelector('.close-panel');
    closeBtn.addEventListener('click', () => {
        document.getElementById('element-detail').style.display = 'none';
    });
}

function showElementDetail(element) {
    const panel = document.getElementById('element-detail');
    const content = panel.querySelector('.detail-content');
    
    content.innerHTML = `
        <div class="element-large" style="background: ${element.color};">
            <span class="element-number">${element.number}</span>
            <span class="element-symbol">${element.symbol}</span>
            <span class="element-name">${element.name}</span>
        </div>
        <div class="element-facts">
            <h4>Fun Facts:</h4>
            <ul>
                ${element.facts.map(fact => `<li>✨ ${fact}</li>`).join('')}
            </ul>
        </div>
    `;
    
    panel.style.display = 'block';
    panel.style.animation = 'slideIn 0.3s ease-out';

    // Track exploration
    if (!ScienceApp.state.completedActivities.has(`element-${element.symbol}`)) {
        ScienceApp.state.completedActivities.add(`element-${element.symbol}`);
        addPoints(ScienceApp.points.exploration, `Learned about ${element.name}!`);
    }
}

// =========================================
// DNA Base Pairing Game (Biology)
// =========================================
function initDNAGame() {
    const bioSection = document.getElementById('biology');
    if (!bioSection) return;

    const dnaInfo = bioSection.querySelector('.dna-info');
    if (!dnaInfo) return;

    const game = document.createElement('div');
    game.className = 'dna-game';
    game.innerHTML = `
        <h4>🧬 DNA Base Pairing Challenge</h4>
        <p>Match the correct complementary base pairs! Remember: A↔T and G↔C</p>
        
        <div class="dna-game-container">
            <div class="dna-strand" id="dna-strand-1">
                <!-- Generated by JS -->
            </div>
            <div class="dna-strand" id="dna-strand-2">
                <!-- Player fills this -->
            </div>
        </div>
        
        <div class="base-palette">
            <button class="base-btn" data-base="A" style="--base-color: #ff6b6b;">A</button>
            <button class="base-btn" data-base="T" style="--base-color: #4ecdc4;">T</button>
            <button class="base-btn" data-base="G" style="--base-color: #ffe66d;">G</button>
            <button class="base-btn" data-base="C" style="--base-color: #95e1d3;">C</button>
        </div>
        
        <div class="game-controls">
            <button class="btn btn-primary" id="check-dna">Check Pairing</button>
            <button class="btn btn-secondary" id="new-dna">New Sequence</button>
        </div>
        
        <div class="game-feedback" id="dna-feedback"></div>
        <div class="game-score">Score: <span id="dna-score">0</span></div>
    `;

    dnaInfo.parentNode.insertBefore(game, dnaInfo.nextSibling);

    let currentSequence = [];
    let selectedBase = null;
    let dnaScore = 0;

    function generateSequence() {
        const bases = ['A', 'T', 'G', 'C'];
        currentSequence = [];
        for (let i = 0; i < 6; i++) {
            currentSequence.push(bases[Math.floor(Math.random() * 4)]);
        }
        renderStrands();
    }

    function renderStrands() {
        const strand1 = document.getElementById('dna-strand-1');
        const strand2 = document.getElementById('dna-strand-2');

        strand1.innerHTML = currentSequence.map((base, i) => `
            <div class="base-pair">
                <span class="base" data-base="${base}">${base}</span>
                <span class="bond">|</span>
            </div>
        `).join('');

        strand2.innerHTML = currentSequence.map((base, i) => `
            <div class="base-pair">
                <span class="bond">|</span>
                <span class="base empty" data-index="${i}">?</span>
            </div>
        `).join('');

        // Add click handlers for empty bases
        strand2.querySelectorAll('.base.empty').forEach(base => {
            base.addEventListener('click', () => {
                if (selectedBase) {
                    base.textContent = selectedBase;
                    base.dataset.selected = selectedBase;
                    base.classList.add('filled');
                    base.classList.remove('empty');
                }
            });
        });
    }

    // Base selection
    game.querySelectorAll('.base-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            game.querySelectorAll('.base-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedBase = btn.dataset.base;
        });
    });

    // Check pairing
    document.getElementById('check-dna').addEventListener('click', () => {
        const strand2 = document.getElementById('dna-strand-2');
        const userBases = strand2.querySelectorAll('.base');
        const feedback = document.getElementById('dna-feedback');
        let correct = 0;

        const complements = { 'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G' };

        userBases.forEach((base, i) => {
            const expected = complements[currentSequence[i]];
            const selected = base.dataset.selected;

            if (selected === expected) {
                base.classList.add('correct');
                correct++;
            } else if (selected) {
                base.classList.add('incorrect');
            }
        });

        if (correct === currentSequence.length) {
            feedback.innerHTML = '🎉 Perfect! All base pairs are correct!';
            feedback.className = 'game-feedback success';
            dnaScore += 10;
            addPoints(ScienceApp.points.game, 'Perfect DNA pairing!');
            checkAchievement('dna_master');
        } else if (correct > 0) {
            feedback.innerHTML = `Almost! You got ${correct}/${currentSequence.length} correct. Remember: A↔T and G↔C`;
            feedback.className = 'game-feedback partial';
            dnaScore += correct;
        } else {
            feedback.innerHTML = 'Try again! Remember: A pairs with T, G pairs with C';
            feedback.className = 'game-feedback error';
        }

        document.getElementById('dna-score').textContent = dnaScore;
        saveProgress();
    });

    // New sequence
    document.getElementById('new-dna').addEventListener('click', () => {
        generateSequence();
        document.getElementById('dna-feedback').innerHTML = '';
        game.querySelectorAll('.base-btn').forEach(b => b.classList.remove('selected'));
        selectedBase = null;
    });

    generateSequence();
}

// =========================================
// Interactive Cell Explorer (Biology)
// =========================================
function initCellExplorer() {
    const organelleGrid = document.querySelector('.organelle-grid');
    if (!organelleGrid) return;

    // Create interactive cell diagram
    const explorer = document.createElement('div');
    explorer.className = 'cell-explorer';
    explorer.innerHTML = `
        <h4>🔬 Interactive Cell Explorer</h4>
        <p>Click on different parts of the cell to learn more!</p>
        
        <div class="cell-diagram">
            <div class="cell-membrane">
                <div class="organelle-marker" data-organelle="nucleus" style="top: 40%; left: 45%;">
                    <span class="marker-icon">🧠</span>
                    <span class="marker-pulse"></span>
                </div>
                <div class="organelle-marker" data-organelle="mitochondria" style="top: 25%; left: 70%;">
                    <span class="marker-icon">🔋</span>
                    <span class="marker-pulse"></span>
                </div>
                <div class="organelle-marker" data-organelle="ribosome" style="top: 60%; left: 30%;">
                    <span class="marker-icon">🏭</span>
                    <span class="marker-pulse"></span>
                </div>
                <div class="organelle-marker" data-organelle="er" style="top: 30%; left: 25%;">
                    <span class="marker-icon">🚚</span>
                    <span class="marker-pulse"></span>
                </div>
                <div class="organelle-marker" data-organelle="golgi" style="top: 65%; left: 65%;">
                    <span class="marker-icon">📦</span>
                    <span class="marker-pulse"></span>
                </div>
                <div class="organelle-marker" data-organelle="lysosome" style="top: 75%; left: 45%;">
                    <span class="marker-icon">🗑️</span>
                    <span class="marker-pulse"></span>
                </div>
            </div>
        </div>
        
        <div class="organelle-info-panel" id="organelle-info">
            <p class="hint">👆 Click on an organelle to learn about it!</p>
        </div>
        
        <div class="explorer-progress">
            <span>Discovered: <span id="discovered-count">0</span>/6</span>
            <div class="progress-bar">
                <div class="progress-fill" id="explorer-progress"></div>
            </div>
        </div>
    `;

    organelleGrid.parentNode.insertBefore(explorer, organelleGrid);

    const organelleData = {
        nucleus: {
            name: 'Nucleus',
            icon: '🧠',
            description: 'The control center of the cell',
            details: [
                'Contains DNA (genetic material)',
                'Controls all cell activities',
                'Surrounded by nuclear membrane',
                'Contains the nucleolus which makes ribosomes'
            ]
        },
        mitochondria: {
            name: 'Mitochondria',
            icon: '🔋',
            description: 'The powerhouse of the cell',
            details: [
                'Produces ATP (cellular energy)',
                'Has its own DNA',
                'Has double membrane',
                'More active cells have more mitochondria'
            ]
        },
        ribosome: {
            name: 'Ribosome',
            icon: '🏭',
            description: 'The protein factory',
            details: [
                'Makes proteins from amino acids',
                'Can be free or attached to ER',
                'Made of RNA and protein',
                'Reads genetic code from mRNA'
            ]
        },
        er: {
            name: 'Endoplasmic Reticulum',
            icon: '🚚',
            description: 'The transportation highway',
            details: [
                'Rough ER has ribosomes attached',
                'Smooth ER makes lipids',
                'Transports proteins through cell',
                'Connected to nuclear membrane'
            ]
        },
        golgi: {
            name: 'Golgi Apparatus',
            icon: '📦',
            description: 'The packaging center',
            details: [
                'Modifies and packages proteins',
                'Prepares proteins for export',
                'Looks like stacked pancakes',
                'Creates lysosomes'
            ]
        },
        lysosome: {
            name: 'Lysosome',
            icon: '🗑️',
            description: 'The recycling center',
            details: [
                'Contains digestive enzymes',
                'Breaks down old organelles',
                'Destroys invading bacteria',
                'Helps with cell recycling'
            ]
        }
    };

    const discovered = new Set();

    explorer.querySelectorAll('.organelle-marker').forEach(marker => {
        marker.addEventListener('click', () => {
            const organelle = marker.dataset.organelle;
            const data = organelleData[organelle];
            const infoPanel = document.getElementById('organelle-info');

            // Mark as discovered
            if (!discovered.has(organelle)) {
                discovered.add(organelle);
                marker.classList.add('discovered');
                document.getElementById('discovered-count').textContent = discovered.size;
                document.getElementById('explorer-progress').style.width = `${(discovered.size / 6) * 100}%`;
                
                addPoints(ScienceApp.points.exploration, `Discovered ${data.name}!`);

                if (discovered.size === 6) {
                    checkAchievement('cell_master');
                }
            }

            // Highlight active marker
            explorer.querySelectorAll('.organelle-marker').forEach(m => m.classList.remove('active'));
            marker.classList.add('active');

            // Show info
            infoPanel.innerHTML = `
                <div class="organelle-detail">
                    <div class="detail-header">
                        <span class="detail-icon">${data.icon}</span>
                        <div>
                            <h5>${data.name}</h5>
                            <p class="detail-description">${data.description}</p>
                        </div>
                    </div>
                    <ul class="detail-facts">
                        ${data.details.map(d => `<li>✓ ${d}</li>`).join('')}
                    </ul>
                </div>
            `;
            infoPanel.style.animation = 'slideIn 0.3s ease-out';
        });
    });
}

// =========================================
// Lab Simulations
// =========================================
function initLabSimulations() {
    // Add virtual lab experiments
    const physicsSection = document.getElementById('physics');
    if (!physicsSection) return;

    const lab = document.createElement('div');
    lab.className = 'virtual-lab';
    lab.innerHTML = `
        <h3>🧪 Virtual Physics Lab</h3>
        <p>Conduct experiments to understand physics concepts!</p>
        
        <div class="experiment-selector">
            <button class="experiment-btn active" data-exp="pendulum">Pendulum</button>
            <button class="experiment-btn" data-exp="projectile">Projectile Motion</button>
            <button class="experiment-btn" data-exp="collision">Collisions</button>
        </div>
        
        <div class="experiment-area" id="experiment-area">
            <div class="experiment pendulum-exp active" id="pendulum-exp">
                <canvas id="pendulum-canvas" width="400" height="300"></canvas>
                <div class="experiment-controls">
                    <label>
                        Length: <input type="range" id="pendulum-length" min="50" max="150" value="100">
                    </label>
                    <label>
                        Angle: <input type="range" id="pendulum-angle" min="10" max="80" value="45">
                    </label>
                    <button class="btn btn-primary" id="start-pendulum">Start</button>
                    <button class="btn btn-secondary" id="reset-pendulum">Reset</button>
                </div>
                <div class="experiment-data">
                    <span>Period: <span id="pendulum-period">--</span>s</span>
                </div>
            </div>
        </div>
    `;

    physicsSection.appendChild(lab);
    initPendulumExperiment();
}

function initPendulumExperiment() {
    const canvas = document.getElementById('pendulum-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animating = false;
    let angle = 45 * Math.PI / 180;
    let angularVelocity = 0;
    let length = 100;
    const gravity = 0.5;
    const damping = 0.999;
    const pivotX = canvas.width / 2;
    const pivotY = 20;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw pivot
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();

        // Calculate bob position
        const bobX = pivotX + length * Math.sin(angle);
        const bobY = pivotY + length * Math.cos(angle);

        // Draw string
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw bob
        ctx.beginPath();
        ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(bobX - 5, bobY - 5, 0, bobX, bobY, 20);
        gradient.addColorStop(0, '#4361ee');
        gradient.addColorStop(1, '#3651d4');
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#2541ce';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw shadow
        ctx.beginPath();
        ctx.ellipse(bobX, canvas.height - 10, 15, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fill();

        if (animating) {
            // Physics simulation
            const angularAcceleration = -gravity / length * Math.sin(angle);
            angularVelocity += angularAcceleration;
            angularVelocity *= damping;
            angle += angularVelocity;

            // Calculate period
            const period = 2 * Math.PI * Math.sqrt(length / (gravity * 60));
            document.getElementById('pendulum-period').textContent = period.toFixed(2);

            requestAnimationFrame(draw);
        }
    }

    // Controls
    document.getElementById('pendulum-length').addEventListener('input', (e) => {
        length = parseInt(e.target.value);
        draw();
    });

    document.getElementById('pendulum-angle').addEventListener('input', (e) => {
        angle = parseInt(e.target.value) * Math.PI / 180;
        angularVelocity = 0;
        draw();
    });

    document.getElementById('start-pendulum').addEventListener('click', () => {
        if (!animating) {
            animating = true;
            draw();
            
            if (!ScienceApp.state.completedActivities.has('pendulum-lab')) {
                ScienceApp.state.completedActivities.add('pendulum-lab');
                addPoints(ScienceApp.points.experiment, 'Completed pendulum experiment!');
            }
        }
    });

    document.getElementById('reset-pendulum').addEventListener('click', () => {
        animating = false;
        angle = document.getElementById('pendulum-angle').value * Math.PI / 180;
        angularVelocity = 0;
        draw();
    });

    draw();
}

// =========================================
// Flashcard System
// =========================================
function initFlashcards() {
    const container = document.querySelector('.main-content .container');
    if (!container) return;

    const flashcardSection = document.createElement('section');
    flashcardSection.className = 'flashcard-section';
    flashcardSection.innerHTML = `
        <h2 class="section-title">📚 Study Flashcards</h2>
        <p class="section-description">Review key concepts with interactive flashcards!</p>
        
        <div class="flashcard-topics">
            <button class="fc-topic-btn active" data-topic="physics-fc">Physics</button>
            <button class="fc-topic-btn" data-topic="chemistry-fc">Chemistry</button>
            <button class="fc-topic-btn" data-topic="biology-fc">Biology</button>
        </div>
        
        <div class="flashcard-container">
            <div class="flashcard" id="flashcard">
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <span class="fc-category">Physics</span>
                        <p class="fc-question">What is Newton's First Law?</p>
                        <span class="fc-hint">Click to flip</span>
                    </div>
                    <div class="flashcard-back">
                        <p class="fc-answer">Law of Inertia: An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by a force.</p>
                    </div>
                </div>
            </div>
            
            <div class="flashcard-controls">
                <button class="fc-nav-btn" id="fc-prev">← Previous</button>
                <span class="fc-counter"><span id="fc-current">1</span> / <span id="fc-total">10</span></span>
                <button class="fc-nav-btn" id="fc-next">Next →</button>
            </div>
            
            <div class="flashcard-actions">
                <button class="btn btn-secondary" id="fc-shuffle">🔀 Shuffle</button>
                <button class="btn btn-primary" id="fc-know">✓ I Know This</button>
            </div>
        </div>
        
        <div class="flashcard-progress">
            <p>Mastered: <span id="fc-mastered">0</span> cards</p>
        </div>
    `;

    container.appendChild(flashcardSection);

    const flashcards = {
        'physics-fc': [
            { q: "What is Newton's First Law?", a: "Law of Inertia: An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by a force." },
            { q: "What is the formula for force?", a: "F = m × a (Force equals mass times acceleration)" },
            { q: "What is Newton's Third Law?", a: "For every action, there is an equal and opposite reaction." },
            { q: "What is inertia?", a: "The tendency of an object to resist changes in its state of motion." },
            { q: "What is the unit of force?", a: "Newton (N)" }
        ],
        'chemistry-fc': [
            { q: "What are the three states of matter?", a: "Solid, Liquid, and Gas" },
            { q: "What happens to particles when heated?", a: "They gain energy and move faster, eventually changing state." },
            { q: "What is the chemical symbol for water?", a: "H₂O (2 hydrogen atoms and 1 oxygen atom)" },
            { q: "What is photosynthesis?", a: "The process plants use to convert CO₂ and H₂O into glucose and O₂ using sunlight." },
            { q: "What is an element?", a: "A pure substance made of only one type of atom." }
        ],
        'biology-fc': [
            { q: "What is the powerhouse of the cell?", a: "Mitochondria - they produce ATP (energy)." },
            { q: "What does DNA stand for?", a: "Deoxyribonucleic Acid" },
            { q: "What are the DNA base pairs?", a: "A pairs with T, G pairs with C" },
            { q: "What is the difference between prokaryotic and eukaryotic cells?", a: "Prokaryotic cells have no nucleus; eukaryotic cells have a nucleus." },
            { q: "What is the function of ribosomes?", a: "To make proteins from amino acids." }
        ]
    };

    let currentTopic = 'physics-fc';
    let currentIndex = 0;
    let mastered = new Set();

    function updateFlashcard() {
        const cards = flashcards[currentTopic];
        const card = cards[currentIndex];
        const flashcard = document.getElementById('flashcard');
        
        flashcard.querySelector('.fc-category').textContent = currentTopic.replace('-fc', '').charAt(0).toUpperCase() + currentTopic.replace('-fc', '').slice(1);
        flashcard.querySelector('.fc-question').textContent = card.q;
        flashcard.querySelector('.fc-answer').textContent = card.a;
        flashcard.classList.remove('flipped');
        
        document.getElementById('fc-current').textContent = currentIndex + 1;
        document.getElementById('fc-total').textContent = cards.length;
    }

    // Flip card
    document.getElementById('flashcard').addEventListener('click', function() {
        this.classList.toggle('flipped');
    });

    // Navigation
    document.getElementById('fc-prev').addEventListener('click', () => {
        const cards = flashcards[currentTopic];
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateFlashcard();
    });

    document.getElementById('fc-next').addEventListener('click', () => {
        const cards = flashcards[currentTopic];
        currentIndex = (currentIndex + 1) % cards.length;
        updateFlashcard();
    });

    // Topic selection
    flashcardSection.querySelectorAll('.fc-topic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            flashcardSection.querySelectorAll('.fc-topic-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTopic = btn.dataset.topic;
            currentIndex = 0;
            updateFlashcard();
        });
    });

    // Shuffle
    document.getElementById('fc-shuffle').addEventListener('click', () => {
        const cards = flashcards[currentTopic];
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        currentIndex = 0;
        updateFlashcard();
        showToast('Cards shuffled!', 'info');
    });

    // Mark as known
    document.getElementById('fc-know').addEventListener('click', () => {
        const key = `${currentTopic}-${currentIndex}`;
        if (!mastered.has(key)) {
            mastered.add(key);
            document.getElementById('fc-mastered').textContent = mastered.size;
            addPoints(5, 'Mastered a flashcard!');
        }
        
        // Move to next card
        const cards = flashcards[currentTopic];
        currentIndex = (currentIndex + 1) % cards.length;
        updateFlashcard();
    });

    updateFlashcard();
}

// =========================================
// Progress Tracking
// =========================================
function initProgressTracker() {
    // Add progress indicator to page header
    const pageHeader = document.querySelector('.page-header-content');
    if (!pageHeader) return;

    const progressTracker = document.createElement('div');
    progressTracker.className = 'progress-tracker';
    progressTracker.innerHTML = `
        <div class="tracker-stats">
            <div class="stat">
                <span class="stat-icon">⭐</span>
                <span class="stat-value" id="total-points">0</span>
                <span class="stat-label">Points</span>
            </div>
            <div class="stat">
                <span class="stat-icon">✓</span>
                <span class="stat-value" id="activities-completed">0</span>
                <span class="stat-label">Activities</span>
            </div>
            <div class="stat">
                <span class="stat-icon">🏆</span>
                <span class="stat-value" id="achievements-earned">0</span>
                <span class="stat-label">Achievements</span>
            </div>
        </div>
    `;

    pageHeader.appendChild(progressTracker);
}

// =========================================
// Achievements System
// =========================================
function initAchievements() {
    const achievementsList = [
        { id: 'first_experiment', name: 'First Experiment', desc: 'Complete your first interactive experiment', icon: '🧪' },
        { id: 'perfect_quiz', name: 'Perfect Score', desc: 'Get 100% on a quiz', icon: '💯' },
        { id: 'cell_master', name: 'Cell Master', desc: 'Discover all cell organelles', icon: '🔬' },
        { id: 'dna_master', name: 'DNA Master', desc: 'Complete a perfect DNA base pairing', icon: '🧬' },
        { id: 'explorer', name: 'Explorer', desc: 'Visit all three science topics', icon: '🗺️' },
        { id: 'scientist', name: 'Young Scientist', desc: 'Earn 100 points', icon: '👨‍🔬' }
    ];

    ScienceApp.achievementsList = achievementsList;

    // Create achievement notification container
    const notifContainer = document.createElement('div');
    notifContainer.id = 'achievement-notifications';
    notifContainer.className = 'achievement-notifications';
    document.body.appendChild(notifContainer);
}

function checkAchievement(id) {
    if (ScienceApp.state.achievements.includes(id)) return;
    
    const achievement = ScienceApp.achievementsList.find(a => a.id === id);
    if (!achievement) return;

    ScienceApp.state.achievements.push(id);
    document.getElementById('achievements-earned').textContent = ScienceApp.state.achievements.length;
    
    showAchievementNotification(achievement);
    saveProgress();
}

function showAchievementNotification(achievement) {
    const container = document.getElementById('achievement-notifications');
    const notif = document.createElement('div');
    notif.className = 'achievement-notif';
    notif.innerHTML = `
        <span class="achievement-icon">${achievement.icon}</span>
        <div class="achievement-content">
            <strong>Achievement Unlocked!</strong>
            <p>${achievement.name}</p>
        </div>
    `;
    
    container.appendChild(notif);
    
    setTimeout(() => notif.classList.add('show'), 100);
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// =========================================
// Utility Functions
// =========================================
function addPoints(points, message) {
    ScienceApp.state.score += points;
    document.getElementById('total-points').textContent = ScienceApp.state.score;
    document.getElementById('activities-completed').textContent = ScienceApp.state.completedActivities.size;
    
    showToast(`+${points} points! ${message}`, 'success');
    
    // Check for point-based achievements
    if (ScienceApp.state.score >= 100) {
        checkAchievement('scientist');
    }
    
    // Check for explorer achievement
    const topics = ['explore-physics', 'explore-chemistry', 'explore-biology'];
    if (topics.every(t => ScienceApp.state.completedActivities.has(t))) {
        checkAchievement('explorer');
    }
    
    saveProgress();
}

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function saveProgress() {
    const data = {
        score: ScienceApp.state.score,
        completedActivities: Array.from(ScienceApp.state.completedActivities),
        achievements: ScienceApp.state.achievements
    };
    localStorage.setItem('scienceProgress', JSON.stringify(data));
}

function loadProgress() {
    const saved = localStorage.getItem('scienceProgress');
    if (saved) {
        const data = JSON.parse(saved);
        ScienceApp.state.score = data.score || 0;
        ScienceApp.state.completedActivities = new Set(data.completedActivities || []);
        ScienceApp.state.achievements = data.achievements || [];
        
        // Update UI
        document.getElementById('total-points').textContent = ScienceApp.state.score;
        document.getElementById('activities-completed').textContent = ScienceApp.state.completedActivities.size;
        document.getElementById('achievements-earned').textContent = ScienceApp.state.achievements.length;
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (ScienceApp.state.particleAnimationId) {
        cancelAnimationFrame(ScienceApp.state.particleAnimationId);
    }
});
