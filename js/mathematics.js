/**
 * STEM Learning Hub - Mathematics Interactive Module
 * Enhanced interactivity for 8th grade math concepts
 */

(function() {
    'use strict';

    // =========================================
    // State Management
    // =========================================
    const state = {
        currentTopic: 'algebra',
        practiceStats: {
            correct: 0,
            incorrect: 0,
            streak: 0,
            bestStreak: 0
        },
        difficulty: 'medium',
        achievements: new Set(),
        diceStats: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
        coinStats: { heads: 0, tails: 0 },
        totalRolls: 0,
        totalFlips: 0
    };

    // Load saved state from localStorage
    function loadState() {
        try {
            const saved = localStorage.getItem('mathState');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(state.practiceStats, parsed.practiceStats || {});
                state.achievements = new Set(parsed.achievements || []);
            }
        } catch (e) {
            console.log('Could not load saved state');
        }
    }

    // Save state to localStorage
    function saveState() {
        try {
            localStorage.setItem('mathState', JSON.stringify({
                practiceStats: state.practiceStats,
                achievements: Array.from(state.achievements)
            }));
        } catch (e) {
            console.log('Could not save state');
        }
    }

    // =========================================
    // Toast Notifications
    // =========================================
    function showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✓',
            error: '✗',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // =========================================
    // Achievement System
    // =========================================
    function checkAchievements() {
        const newAchievements = [];

        if (state.practiceStats.correct >= 1 && !state.achievements.has('first-solve')) {
            state.achievements.add('first-solve');
            newAchievements.push({ id: 'first-solve', name: 'First Steps', icon: '🎯' });
        }

        if (state.practiceStats.streak >= 5 && !state.achievements.has('streak-5')) {
            state.achievements.add('streak-5');
            newAchievements.push({ id: 'streak-5', name: 'On Fire!', icon: '🔥' });
        }

        if (state.practiceStats.correct >= 10 && !state.achievements.has('solver-10')) {
            state.achievements.add('solver-10');
            newAchievements.push({ id: 'solver-10', name: 'Problem Solver', icon: '🧮' });
        }

        if (state.totalRolls >= 50 && !state.achievements.has('dice-master')) {
            state.achievements.add('dice-master');
            newAchievements.push({ id: 'dice-master', name: 'Dice Master', icon: '🎲' });
        }

        if (state.practiceStats.bestStreak >= 10 && !state.achievements.has('streak-10')) {
            state.achievements.add('streak-10');
            newAchievements.push({ id: 'streak-10', name: 'Unstoppable!', icon: '⚡' });
        }

        newAchievements.forEach(achievement => {
            showToast(`Achievement Unlocked: ${achievement.name}!`, 'success');
        });

        updateAchievementDisplay();
        saveState();
    }

    function updateAchievementDisplay() {
        const container = document.querySelector('.badges-container');
        if (!container) return;

        container.querySelectorAll('.badge').forEach(badge => {
            const id = badge.dataset.achievement;
            if (state.achievements.has(id)) {
                badge.classList.add('earned');
            }
        });
    }

    // =========================================
    // Topic Navigation
    // =========================================
    function initTopicNavigation() {
        const topicBtns = document.querySelectorAll('.topic-btn');
        const topicSections = document.querySelectorAll('.topic-section');

        topicBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const topic = btn.dataset.topic;
                
                // Update buttons
                topicBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update sections
                topicSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === topic) {
                        section.classList.add('active');
                    }
                });

                state.currentTopic = topic;
            });
        });
    }

    // =========================================
    // Equation Solver
    // =========================================
    function initEquationSolver() {
        const container = document.querySelector('.equation-solver');
        if (!container) return;

        const input = container.querySelector('.equation-input');
        const solveBtn = container.querySelector('.solve-btn');
        const solutionDisplay = container.querySelector('.solution-display');
        const exampleBtns = container.querySelectorAll('.example-btn');

        solveBtn?.addEventListener('click', () => {
            const equation = input.value.trim();
            if (equation) {
                solveLinearEquation(equation, solutionDisplay);
            } else {
                input.classList.add('error');
                setTimeout(() => input.classList.remove('error'), 500);
            }
        });

        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                solveBtn.click();
            }
        });

        exampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                input.value = btn.textContent;
                solveBtn.click();
            });
        });
    }

    function solveLinearEquation(equation, display) {
        const steps = [];
        
        // Parse the equation (simplified parser for ax + b = c format)
        const match = equation.match(/(-?\d*)x\s*([+-])\s*(\d+)\s*=\s*(-?\d+)/);
        
        if (!match) {
            showToast('Please enter an equation like "2x + 5 = 13"', 'error');
            return;
        }

        let a = match[1] === '' || match[1] === '-' ? (match[1] === '-' ? -1 : 1) : parseInt(match[1]);
        const operator = match[2];
        let b = parseInt(match[3]) * (operator === '-' ? -1 : 1);
        const c = parseInt(match[4]);

        steps.push({
            equation: equation.replace(/\s+/g, ' '),
            explanation: 'Start with the original equation'
        });

        // Step: Move constant to right side
        const newRight = c - b;
        const moveOp = b > 0 ? 'Subtract' : 'Add';
        const moveVal = Math.abs(b);
        
        steps.push({
            equation: `${a === 1 ? '' : a === -1 ? '-' : a}x ${operator} ${Math.abs(b)} ${b > 0 ? '-' : '+'} ${moveVal} = ${c} ${b > 0 ? '-' : '+'} ${moveVal}`,
            explanation: `${moveOp} ${moveVal} from both sides`
        });

        steps.push({
            equation: `${a === 1 ? '' : a === -1 ? '-' : a}x = ${newRight}`,
            explanation: 'Simplify both sides'
        });

        // Step: Divide by coefficient
        if (a !== 1) {
            steps.push({
                equation: `${a === 1 ? '' : a === -1 ? '-' : a}x ÷ ${a} = ${newRight} ÷ ${a}`,
                explanation: `Divide both sides by ${a}`
            });
        }

        const solution = newRight / a;
        steps.push({
            equation: `x = ${solution}`,
            explanation: 'Solution found! ✓',
            final: true
        });

        renderSolutionSteps(steps, display);
    }

    function renderSolutionSteps(steps, display) {
        display.classList.remove('hidden');
        const stepsContainer = display.querySelector('.solution-steps');
        stepsContainer.innerHTML = '';

        steps.forEach((step, index) => {
            const stepEl = document.createElement('div');
            stepEl.className = `step ${step.final ? 'final' : ''}`;
            stepEl.innerHTML = `
                <span class="step-number">${index + 1}</span>
                <span class="step-equation">${step.equation}</span>
                <span class="step-explanation">${step.explanation}</span>
            `;
            stepsContainer.appendChild(stepEl);
        });
    }

    // =========================================
    // PEMDAS Interactive
    // =========================================
    function initPEMDAS() {
        const container = document.querySelector('.pemdas-interactive');
        if (!container) return;

        const evaluator = container.querySelector('.pemdas-evaluator');
        if (!evaluator) return;

        const expressionDisplay = evaluator.querySelector('.expression-display');
        const stepBtn = evaluator.querySelector('.step-btn.primary');
        const resetBtn = evaluator.querySelector('.step-btn.secondary');
        const pemdasItems = container.querySelectorAll('.pemdas-item');

        let currentExpression = '3 + 4 × 2²';
        let evaluationSteps = [];
        let currentStep = 0;

        function generateExpression() {
            const expressions = [
                '3 + 4 × 2²',
                '(5 + 3) × 2',
                '10 - 2 × 3 + 4',
                '2³ + 4 × 2',
                '(8 - 2) × (3 + 1)',
                '15 ÷ 3 + 2²',
                '4 × 3² - 10',
                '(2 + 3)² - 5'
            ];
            return expressions[Math.floor(Math.random() * expressions.length)];
        }

        function parseExpression(expr) {
            // Simplified PEMDAS evaluator
            const steps = [];
            let current = expr;

            // Handle parentheses
            while (current.includes('(')) {
                const parenMatch = current.match(/\(([^()]+)\)/);
                if (parenMatch) {
                    const innerResult = evalSimple(parenMatch[1]);
                    steps.push({
                        expression: current,
                        highlight: parenMatch[0],
                        operation: 'Parentheses'
                    });
                    current = current.replace(parenMatch[0], innerResult);
                } else break;
            }

            // Handle exponents
            while (current.match(/\d+[²³]/)) {
                const expMatch = current.match(/(\d+)([²³])/);
                if (expMatch) {
                    const base = parseInt(expMatch[1]);
                    const exp = expMatch[2] === '²' ? 2 : 3;
                    const result = Math.pow(base, exp);
                    steps.push({
                        expression: current,
                        highlight: expMatch[0],
                        operation: 'Exponent'
                    });
                    current = current.replace(expMatch[0], result);
                } else break;
            }

            // Handle multiplication and division
            while (current.match(/\d+\s*[×÷]\s*\d+/)) {
                const mdMatch = current.match(/(\d+)\s*([×÷])\s*(\d+)/);
                if (mdMatch) {
                    const a = parseInt(mdMatch[1]);
                    const op = mdMatch[2];
                    const b = parseInt(mdMatch[3]);
                    const result = op === '×' ? a * b : a / b;
                    steps.push({
                        expression: current,
                        highlight: mdMatch[0],
                        operation: op === '×' ? 'Multiplication' : 'Division'
                    });
                    current = current.replace(mdMatch[0], result);
                } else break;
            }

            // Handle addition and subtraction
            while (current.match(/\d+\s*[+-]\s*\d+/)) {
                const asMatch = current.match(/(\d+)\s*([+-])\s*(\d+)/);
                if (asMatch) {
                    const a = parseInt(asMatch[1]);
                    const op = asMatch[2];
                    const b = parseInt(asMatch[3]);
                    const result = op === '+' ? a + b : a - b;
                    steps.push({
                        expression: current,
                        highlight: asMatch[0],
                        operation: op === '+' ? 'Addition' : 'Subtraction'
                    });
                    current = current.replace(asMatch[0], result);
                } else break;
            }

            steps.push({
                expression: current,
                highlight: null,
                operation: 'Final Answer'
            });

            return steps;
        }

        function evalSimple(expr) {
            // Very simplified evaluator
            try {
                let result = expr
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/²/g, '**2')
                    .replace(/³/g, '**3');
                return eval(result);
            } catch {
                return expr;
            }
        }

        function highlightPemdas(operation) {
            pemdasItems.forEach(item => item.classList.remove('highlight'));
            const opMap = {
                'Parentheses': 0,
                'Exponent': 1,
                'Multiplication': 2,
                'Division': 3,
                'Addition': 4,
                'Subtraction': 5
            };
            if (opMap[operation] !== undefined) {
                pemdasItems[opMap[operation]]?.classList.add('highlight');
            }
        }

        function displayStep() {
            if (currentStep < evaluationSteps.length) {
                const step = evaluationSteps[currentStep];
                let displayHTML = step.expression;
                
                if (step.highlight) {
                    displayHTML = step.expression.replace(
                        step.highlight,
                        `<span class="highlight-op">${step.highlight}</span>`
                    );
                }
                
                expressionDisplay.innerHTML = displayHTML;
                highlightPemdas(step.operation);
                currentStep++;
            }
        }

        function reset() {
            currentExpression = generateExpression();
            evaluationSteps = parseExpression(currentExpression);
            currentStep = 0;
            expressionDisplay.textContent = currentExpression;
            pemdasItems.forEach(item => item.classList.remove('highlight'));
        }

        stepBtn?.addEventListener('click', displayStep);
        resetBtn?.addEventListener('click', reset);

        // Initialize
        reset();
    }

    // =========================================
    // Practice Problem Generator
    // =========================================
    function initPracticeGenerator() {
        const container = document.querySelector('.practice-generator');
        if (!container) return;

        const difficultyBtns = container.querySelectorAll('.difficulty-btn');
        const problemDisplay = container.querySelector('.problem-display');
        const answerField = container.querySelector('.answer-field');
        const submitBtn = container.querySelector('.submit-answer');
        const feedbackArea = container.querySelector('.feedback-area');
        const newProblemBtn = container.querySelector('.new-problem-btn');

        // Stats elements
        const correctEl = container.querySelector('.stat-value.correct');
        const incorrectEl = container.querySelector('.stat-value.incorrect');
        const streakEl = container.querySelector('.stat-value.streak');

        let currentProblem = null;

        function generateProblem() {
            const difficulty = state.difficulty;
            let a, b, c, answer, problemText;

            switch (difficulty) {
                case 'easy':
                    // Simple addition/subtraction
                    a = Math.floor(Math.random() * 20) + 1;
                    b = Math.floor(Math.random() * 20) + 1;
                    if (Math.random() > 0.5) {
                        answer = a + b;
                        problemText = `${a} + ${b} = ?`;
                    } else {
                        if (a < b) [a, b] = [b, a];
                        answer = a - b;
                        problemText = `${a} - ${b} = ?`;
                    }
                    break;

                case 'medium':
                    // Linear equations
                    a = Math.floor(Math.random() * 5) + 2;
                    answer = Math.floor(Math.random() * 10) + 1;
                    b = Math.floor(Math.random() * 20) + 1;
                    c = a * answer + b;
                    problemText = `${a}x + ${b} = ${c}`;
                    break;

                case 'hard':
                    // More complex expressions
                    a = Math.floor(Math.random() * 5) + 2;
                    b = Math.floor(Math.random() * 5) + 1;
                    c = Math.floor(Math.random() * 5) + 1;
                    answer = a * b + c;
                    problemText = `${a} × ${b} + ${c} = ?`;
                    break;
            }

            currentProblem = { answer, text: problemText };
            problemDisplay.textContent = problemText;
            answerField.value = '';
            feedbackArea.textContent = '';
            feedbackArea.className = 'feedback-area';
        }

        function checkAnswer() {
            if (!currentProblem) return;

            const userAnswer = parseFloat(answerField.value);
            
            if (isNaN(userAnswer)) {
                feedbackArea.textContent = 'Please enter a number';
                feedbackArea.className = 'feedback-area incorrect';
                return;
            }

            if (Math.abs(userAnswer - currentProblem.answer) < 0.01) {
                state.practiceStats.correct++;
                state.practiceStats.streak++;
                if (state.practiceStats.streak > state.practiceStats.bestStreak) {
                    state.practiceStats.bestStreak = state.practiceStats.streak;
                }
                feedbackArea.textContent = '🎉 Correct! Great job!';
                feedbackArea.className = 'feedback-area correct';
                showToast('Correct!', 'success');
                
                setTimeout(generateProblem, 1500);
            } else {
                state.practiceStats.incorrect++;
                state.practiceStats.streak = 0;
                feedbackArea.textContent = `Not quite. The answer was ${currentProblem.answer}`;
                feedbackArea.className = 'feedback-area incorrect';
                showToast('Try again!', 'error');
            }

            updateStats();
            checkAchievements();
        }

        function updateStats() {
            if (correctEl) correctEl.textContent = state.practiceStats.correct;
            if (incorrectEl) incorrectEl.textContent = state.practiceStats.incorrect;
            if (streakEl) streakEl.textContent = state.practiceStats.streak;
        }

        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.difficulty = btn.dataset.difficulty;
                generateProblem();
            });
        });

        submitBtn?.addEventListener('click', checkAnswer);
        
        answerField?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });

        newProblemBtn?.addEventListener('click', generateProblem);

        // Initialize
        generateProblem();
        updateStats();
    }

    // =========================================
    // Shape Calculator
    // =========================================
    function initShapeCalculator() {
        const container = document.querySelector('.shape-calculator');
        if (!container) return;

        const shapeBtns = container.querySelectorAll('.shape-btn');
        const inputSection = container.querySelector('.input-section');
        const visualShape = container.querySelector('.animated-shape');
        const resultsDisplay = container.querySelector('.results-display');

        let currentShape = 'rectangle';

        const shapeConfigs = {
            rectangle: {
                inputs: [
                    { id: 'length', label: 'Length' },
                    { id: 'width', label: 'Width' }
                ],
                calculate: (values) => ({
                    Area: values.length * values.width,
                    Perimeter: 2 * (values.length + values.width)
                })
            },
            triangle: {
                inputs: [
                    { id: 'base', label: 'Base' },
                    { id: 'height', label: 'Height' },
                    { id: 'side1', label: 'Side 1 (optional)' },
                    { id: 'side2', label: 'Side 2 (optional)' }
                ],
                calculate: (values) => {
                    const area = 0.5 * values.base * values.height;
                    const perimeter = values.side1 && values.side2 
                        ? values.base + values.side1 + values.side2 
                        : 'Enter all sides';
                    return { Area: area, Perimeter: perimeter };
                }
            },
            circle: {
                inputs: [
                    { id: 'radius', label: 'Radius' }
                ],
                calculate: (values) => ({
                    Area: Math.PI * values.radius * values.radius,
                    Circumference: 2 * Math.PI * values.radius
                })
            }
        };

        function renderInputs() {
            const config = shapeConfigs[currentShape];
            inputSection.innerHTML = config.inputs.map(input => `
                <div class="input-group">
                    <label for="${input.id}">${input.label}</label>
                    <input type="number" id="${input.id}" class="dimension-input" 
                           placeholder="Enter value" min="0" step="0.1">
                </div>
            `).join('');

            // Add event listeners
            inputSection.querySelectorAll('.dimension-input').forEach(input => {
                input.addEventListener('input', calculate);
            });
        }

        function updateVisual() {
            visualShape.className = `animated-shape ${currentShape}`;
        }

        function calculate() {
            const config = shapeConfigs[currentShape];
            const values = {};
            let allFilled = true;

            config.inputs.forEach(input => {
                const el = document.getElementById(input.id);
                const value = parseFloat(el.value);
                values[input.id] = value || 0;
                if (!input.label.includes('optional') && !el.value) {
                    allFilled = false;
                }
            });

            if (!allFilled) {
                resultsDisplay.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Enter values to calculate</p>';
                return;
            }

            const results = config.calculate(values);
            
            resultsDisplay.innerHTML = Object.entries(results).map(([key, value]) => `
                <div class="result-row">
                    <span class="label">${key}:</span>
                    <span class="value">${typeof value === 'number' ? value.toFixed(2) : value}</span>
                </div>
            `).join('');
        }

        shapeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                shapeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentShape = btn.dataset.shape;
                renderInputs();
                updateVisual();
                resultsDisplay.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Enter values to calculate</p>';
            });
        });

        // Initialize
        renderInputs();
    }

    // =========================================
    // Pythagorean Theorem Visualizer
    // =========================================
    function initPythagoreanVisualizer() {
        const container = document.querySelector('.pythagorean-visualizer');
        if (!container) return;

        const sideA = container.querySelector('#side-a');
        const sideB = container.querySelector('#side-b');
        const sideC = container.querySelector('#side-c');
        const calcBtn = container.querySelector('.calculate-hypotenuse');
        const toggleBtn = container.querySelector('.toggle-squares');
        const resultEquation = container.querySelector('.theorem-equation');
        const resultExplanation = container.querySelector('.theorem-explanation');
        const svg = container.querySelector('.triangle-svg');

        let showSquares = false;

        calcBtn?.addEventListener('click', () => {
            const a = parseFloat(sideA.value) || 0;
            const b = parseFloat(sideB.value) || 0;

            if (a <= 0 || b <= 0) {
                showToast('Please enter positive values for sides a and b', 'error');
                return;
            }

            const c = Math.sqrt(a * a + b * b);
            sideC.value = c.toFixed(2);

            resultEquation.textContent = `${a}² + ${b}² = ${c.toFixed(2)}²`;
            resultExplanation.textContent = `${a * a} + ${b * b} = ${(c * c).toFixed(2)}`;

            showToast(`Hypotenuse c = ${c.toFixed(2)}`, 'success');
        });

        toggleBtn?.addEventListener('click', () => {
            showSquares = !showSquares;
            svg?.classList.toggle('show-squares', showSquares);
            toggleBtn.textContent = showSquares ? 'Hide Squares' : 'Show Squares';
        });

        // Calculate when side C is filled (to find missing side)
        sideC?.addEventListener('input', () => {
            const a = parseFloat(sideA.value) || 0;
            const c = parseFloat(sideC.value) || 0;
            
            if (a > 0 && c > a) {
                const b = Math.sqrt(c * c - a * a);
                sideB.value = b.toFixed(2);
            }
        });
    }

    // =========================================
    // Angle Explorer
    // =========================================
    function initAngleExplorer() {
        const container = document.querySelector('.angle-explorer');
        if (!container) return;

        const canvas = document.getElementById('angleCanvas');
        const slider = container.querySelector('.angle-slider');
        const valueDisplay = container.querySelector('.angle-value');
        const typeName = container.querySelector('.angle-type-name');
        const typeDesc = container.querySelector('.angle-type-desc');
        const quickBtns = container.querySelectorAll('.quick-angle-btn');

        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 30;

        function drawAngle(degrees) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the angle arc
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + radius, centerY);
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw the rotated line
            const radians = (degrees * Math.PI) / 180;
            const endX = centerX + radius * Math.cos(-radians);
            const endY = centerY + radius * Math.sin(-radians);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw the arc
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.3, 0, -radians, true);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Fill the angle
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius * 0.3, 0, -radians, true);
            ctx.closePath();
            ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
            ctx.fill();

            // Draw degree marker
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.fillStyle = '#ef4444';
            ctx.textAlign = 'center';
            const labelRadius = radius * 0.5;
            const labelAngle = -radians / 2;
            const labelX = centerX + labelRadius * Math.cos(labelAngle);
            const labelY = centerY + labelRadius * Math.sin(labelAngle);
            ctx.fillText(`${degrees}°`, labelX, labelY);
        }

        function updateAngleType(degrees) {
            let name, desc;

            if (degrees === 0) {
                name = 'Zero Angle';
                desc = 'No rotation';
            } else if (degrees < 90) {
                name = 'Acute Angle';
                desc = 'Less than 90°';
            } else if (degrees === 90) {
                name = 'Right Angle';
                desc = 'Exactly 90°';
            } else if (degrees < 180) {
                name = 'Obtuse Angle';
                desc = 'Between 90° and 180°';
            } else if (degrees === 180) {
                name = 'Straight Angle';
                desc = 'Exactly 180°';
            } else if (degrees < 360) {
                name = 'Reflex Angle';
                desc = 'Between 180° and 360°';
            } else {
                name = 'Full Rotation';
                desc = 'Complete 360°';
            }

            typeName.textContent = name;
            typeDesc.textContent = desc;
        }

        function update(degrees) {
            valueDisplay.textContent = `${degrees}°`;
            drawAngle(degrees);
            updateAngleType(degrees);
        }

        slider?.addEventListener('input', (e) => {
            update(parseInt(e.target.value));
        });

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const angle = parseInt(btn.dataset.angle);
                slider.value = angle;
                update(angle);
            });
        });

        // Initial draw
        update(45);
    }

    // =========================================
    // Statistics Calculator
    // =========================================
    function initStatsCalculator() {
        const container = document.querySelector('.stats-calculator');
        if (!container) return;

        const dataInput = container.querySelector('.data-input');
        const calculateBtn = container.querySelector('.calculate-stats');
        const randomBtn = container.querySelector('.random-data-btn');
        const statsResults = container.querySelector('.stats-results');
        const chartContainer = container.querySelector('.chart-container');

        function parseData(input) {
            return input.split(',')
                .map(s => parseFloat(s.trim()))
                .filter(n => !isNaN(n));
        }

        function calculateStats(data) {
            if (data.length === 0) return null;

            const sorted = [...data].sort((a, b) => a - b);
            const sum = data.reduce((a, b) => a + b, 0);
            const mean = sum / data.length;

            // Median
            const mid = Math.floor(sorted.length / 2);
            const median = sorted.length % 2 === 0
                ? (sorted[mid - 1] + sorted[mid]) / 2
                : sorted[mid];

            // Mode
            const frequency = {};
            let maxFreq = 0;
            let mode = null;
            data.forEach(n => {
                frequency[n] = (frequency[n] || 0) + 1;
                if (frequency[n] > maxFreq) {
                    maxFreq = frequency[n];
                    mode = n;
                }
            });

            // Range
            const range = sorted[sorted.length - 1] - sorted[0];

            return { mean, median, mode, range, min: sorted[0], max: sorted[sorted.length - 1], count: data.length };
        }

        function renderStats(stats) {
            if (!stats) {
                statsResults.innerHTML = '<p style="text-align: center;">Enter some numbers to calculate</p>';
                return;
            }

            const statCards = [
                { icon: '📊', label: 'Mean', value: stats.mean.toFixed(2) },
                { icon: '📈', label: 'Median', value: stats.median.toFixed(2) },
                { icon: '🎯', label: 'Mode', value: stats.mode },
                { icon: '📏', label: 'Range', value: stats.range.toFixed(2) },
                { icon: '⬇️', label: 'Min', value: stats.min },
                { icon: '⬆️', label: 'Max', value: stats.max }
            ];

            statsResults.innerHTML = statCards.map(stat => `
                <div class="stat-card">
                    <span class="stat-icon">${stat.icon}</span>
                    <span class="stat-label">${stat.label}</span>
                    <span class="stat-value">${stat.value}</span>
                </div>
            `).join('');
        }

        function renderChart(data) {
            if (!chartContainer || data.length === 0) return;

            const max = Math.max(...data);
            const maxHeight = 180;

            chartContainer.innerHTML = data.slice(0, 15).map(value => {
                const height = (value / max) * maxHeight;
                return `<div class="chart-bar" style="height: ${height}px" data-value="${value}"></div>`;
            }).join('');
        }

        function calculate() {
            const data = parseData(dataInput.value);
            const stats = calculateStats(data);
            renderStats(stats);
            renderChart(data);
        }

        calculateBtn?.addEventListener('click', calculate);

        dataInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });

        randomBtn?.addEventListener('click', () => {
            const count = Math.floor(Math.random() * 8) + 5;
            const randomData = Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 1);
            dataInput.value = randomData.join(', ');
            calculate();
        });
    }

    // =========================================
    // Probability Simulator
    // =========================================
    function initProbabilitySimulator() {
        const container = document.querySelector('.probability-simulator');
        if (!container) return;

        const tabs = container.querySelectorAll('.sim-tab');
        const dicePanel = container.querySelector('.dice-simulator');
        const coinPanel = container.querySelector('.coin-simulator');

        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const type = tab.dataset.type;
                if (type === 'dice') {
                    dicePanel?.classList.remove('hidden');
                    coinPanel?.classList.add('hidden');
                } else {
                    dicePanel?.classList.add('hidden');
                    coinPanel?.classList.remove('hidden');
                }
            });
        });

        // Dice simulator
        initDiceSimulator(container);
        
        // Coin simulator
        initCoinSimulator(container);
    }

    function initDiceSimulator(container) {
        const dice = container.querySelectorAll('.dice');
        const rollBtn = container.querySelector('.roll-btn');
        const statsContainer = container.querySelector('.probability-stats');
        const resetBtn = container.querySelector('.dice-simulator .reset-sim');

        const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

        function roll() {
            dice.forEach(die => {
                die.classList.add('rolling');
                
                setTimeout(() => {
                    const result = Math.floor(Math.random() * 6) + 1;
                    die.textContent = diceFaces[result - 1];
                    die.classList.remove('rolling');
                    
                    state.diceStats[result]++;
                    state.totalRolls++;
                }, 500);
            });

            setTimeout(updateDiceStats, 600);
            setTimeout(checkAchievements, 700);
        }

        function updateDiceStats() {
            const statElements = statsContainer?.querySelectorAll('.prob-stat');
            statElements?.forEach((el, i) => {
                const face = i + 1;
                const count = state.diceStats[face];
                const percent = state.totalRolls > 0 
                    ? ((count / state.totalRolls) * 100).toFixed(1) 
                    : '0.0';
                
                el.querySelector('.count').textContent = count;
                el.querySelector('.percent').textContent = `${percent}%`;
            });
        }

        function reset() {
            state.diceStats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
            state.totalRolls = 0;
            updateDiceStats();
            dice.forEach(die => die.textContent = '🎲');
        }

        rollBtn?.addEventListener('click', roll);
        resetBtn?.addEventListener('click', reset);
    }

    function initCoinSimulator(container) {
        const coin = container.querySelector('.coin');
        const flipBtn = container.querySelector('.coin-simulator .roll-btn');
        const resetBtn = container.querySelector('.coin-simulator .reset-sim');
        const headsCount = container.querySelector('.coin-stat.heads .count');
        const tailsCount = container.querySelector('.coin-stat.tails .count');
        const headsPercent = container.querySelector('.coin-stat.heads .percent');
        const tailsPercent = container.querySelector('.coin-stat.tails .percent');

        function flip() {
            coin?.classList.add('flipping');
            
            setTimeout(() => {
                const isHeads = Math.random() > 0.5;
                coin.textContent = isHeads ? 'H' : 'T';
                coin.classList.remove('flipping');
                
                if (isHeads) {
                    state.coinStats.heads++;
                } else {
                    state.coinStats.tails++;
                }
                state.totalFlips++;
                
                updateCoinStats();
            }, 600);
        }

        function updateCoinStats() {
            const total = state.coinStats.heads + state.coinStats.tails;
            
            if (headsCount) headsCount.textContent = state.coinStats.heads;
            if (tailsCount) tailsCount.textContent = state.coinStats.tails;
            
            if (headsPercent) {
                headsPercent.textContent = total > 0 
                    ? `${((state.coinStats.heads / total) * 100).toFixed(1)}%` 
                    : '0%';
            }
            if (tailsPercent) {
                tailsPercent.textContent = total > 0 
                    ? `${((state.coinStats.tails / total) * 100).toFixed(1)}%` 
                    : '0%';
            }
        }

        function reset() {
            state.coinStats = { heads: 0, tails: 0 };
            state.totalFlips = 0;
            updateCoinStats();
            if (coin) coin.textContent = '?';
        }

        flipBtn?.addEventListener('click', flip);
        resetBtn?.addEventListener('click', reset);
    }

    // =========================================
    // Practice Problems (from original)
    // =========================================
    function initPracticeProblems() {
        const practiceProblems = document.querySelectorAll('.practice-problem');

        practiceProblems.forEach(problem => {
            const input = problem.querySelector('.practice-input');
            const checkBtn = problem.querySelector('.check-practice');
            const feedback = problem.querySelector('.practice-feedback');

            checkBtn?.addEventListener('click', () => {
                const answer = parseFloat(input.dataset.answer);
                const userAnswer = parseFloat(input.value);

                if (Math.abs(userAnswer - answer) < 0.01) {
                    feedback.textContent = '✓ Correct! Great job!';
                    feedback.className = 'practice-feedback correct';
                    state.practiceStats.correct++;
                    state.practiceStats.streak++;
                } else {
                    feedback.textContent = `✗ Not quite. The answer is ${answer}`;
                    feedback.className = 'practice-feedback incorrect';
                    state.practiceStats.incorrect++;
                    state.practiceStats.streak = 0;
                }

                checkAchievements();
            });
        });
    }

    // =========================================
    // Mean Calculator (from original, enhanced)
    // =========================================
    function initMeanCalculator() {
        const calculateBtn = document.getElementById('calculate-mean');
        const numbersInput = document.getElementById('numbers-input');
        const meanResult = document.getElementById('mean-result');
        const medianResult = document.getElementById('median-result');
        const modeResult = document.getElementById('mode-result');

        calculateBtn?.addEventListener('click', () => {
            const input = numbersInput.value;
            const numbers = input.split(',')
                .map(s => parseFloat(s.trim()))
                .filter(n => !isNaN(n));

            if (numbers.length === 0) {
                showToast('Please enter some numbers', 'error');
                return;
            }

            // Mean
            const sum = numbers.reduce((a, b) => a + b, 0);
            const mean = sum / numbers.length;

            // Median
            const sorted = [...numbers].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            const median = sorted.length % 2 === 0
                ? (sorted[mid - 1] + sorted[mid]) / 2
                : sorted[mid];

            // Mode
            const frequency = {};
            let maxFreq = 0;
            let mode = null;
            numbers.forEach(n => {
                frequency[n] = (frequency[n] || 0) + 1;
                if (frequency[n] > maxFreq) {
                    maxFreq = frequency[n];
                    mode = n;
                }
            });

            meanResult.textContent = mean.toFixed(2);
            medianResult.textContent = median.toFixed(2);
            modeResult.textContent = mode;

            showToast('Calculations complete!', 'success');
        });
    }

    // =========================================
    // Initialize Everything
    // =========================================
    function init() {
        loadState();
        
        initTopicNavigation();
        initEquationSolver();
        initPEMDAS();
        initPracticeGenerator();
        initShapeCalculator();
        initPythagoreanVisualizer();
        initAngleExplorer();
        initStatsCalculator();
        initProbabilitySimulator();
        initPracticeProblems();
        initMeanCalculator();
        
        updateAchievementDisplay();
        
        console.log('🧮 Mathematics module initialized!');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
