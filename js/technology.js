/**
 * STEM Learning Hub - Technology Page Interactive Features
 * Enhanced learning experience for 8th graders
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initTopicNavigation();
    initBinaryConverter();
    initComputerBuilder();
    initCodePlayground();
    initPasswordChecker();
    initNetworkSimulation();
    initTypingChallenge();
    initTechQuiz();
    initProgressTracker();
});

/* =========================================
   Topic Navigation
   ========================================= */
function initTopicNavigation() {
    const topicBtns = document.querySelectorAll('.topic-btn');
    const topicSections = document.querySelectorAll('.topic-section');

    topicBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic;
            
            // Update active button
            topicBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active section with animation
            topicSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === topic) {
                    section.classList.add('active');
                }
            });

            // Track progress
            markTopicVisited(topic);
        });
    });
}

/* =========================================
   Enhanced Binary Converter
   ========================================= */
function initBinaryConverter() {
    const input = document.getElementById('decimal-input');
    const output = document.getElementById('binary-output');
    const convertBtn = document.getElementById('convert-btn');
    const binaryVisual = document.getElementById('binary-visual');

    if (!input || !output) return;

    // Real-time conversion
    input.addEventListener('input', () => {
        const value = parseInt(input.value);
        if (!isNaN(value) && value >= 0 && value <= 255) {
            animateBinaryConversion(value);
        }
    });

    convertBtn?.addEventListener('click', () => {
        const value = parseInt(input.value);
        if (!isNaN(value) && value >= 0 && value <= 255) {
            animateBinaryConversion(value);
            showConversionSteps(value);
        } else {
            showNotification('Please enter a number between 0 and 255', 'error');
        }
    });

    function animateBinaryConversion(decimal) {
        const binary = decimal.toString(2).padStart(8, '0');
        const bits = binary.split('');
        
        // Animate each bit
        if (binaryVisual) {
            binaryVisual.innerHTML = '';
            bits.forEach((bit, index) => {
                const bitElement = document.createElement('div');
                bitElement.className = `bit ${bit === '1' ? 'bit-on' : 'bit-off'}`;
                bitElement.textContent = bit;
                bitElement.style.animationDelay = `${index * 0.1}s`;
                binaryVisual.appendChild(bitElement);
            });
        }
        
        output.textContent = binary;
        output.classList.add('highlight-result');
        setTimeout(() => output.classList.remove('highlight-result'), 500);
    }

    function showConversionSteps(decimal) {
        const stepsContainer = document.getElementById('conversion-steps');
        if (!stepsContainer) return;

        stepsContainer.innerHTML = '<h4>📝 Conversion Steps:</h4>';
        const steps = [];
        let num = decimal;
        let position = 0;

        if (num === 0) {
            steps.push({ quotient: 0, remainder: 0, position: 0 });
        } else {
            while (num > 0) {
                steps.push({
                    quotient: Math.floor(num / 2),
                    remainder: num % 2,
                    original: num,
                    position: position++
                });
                num = Math.floor(num / 2);
            }
        }

        const stepsHTML = steps.map((step, i) => `
            <div class="conversion-step" style="animation-delay: ${i * 0.2}s">
                <span class="step-num">${step.original || 0}</span>
                <span class="step-operator">÷ 2 =</span>
                <span class="step-quotient">${step.quotient}</span>
                <span class="step-remainder">remainder <strong>${step.remainder}</strong></span>
            </div>
        `).join('');

        stepsContainer.innerHTML += stepsHTML;
        stepsContainer.innerHTML += `
            <div class="conversion-result">
                Read remainders bottom to top: <strong>${decimal.toString(2).padStart(8, '0')}</strong>
            </div>
        `;
    }
}

/* =========================================
   Interactive Computer Builder
   ========================================= */
function initComputerBuilder() {
    const builderContainer = document.getElementById('computer-builder');
    if (!builderContainer) return;

    const components = [
        { id: 'cpu', name: 'CPU', icon: '🧠', slot: 'cpu-slot', description: 'The brain that processes instructions' },
        { id: 'ram', name: 'RAM', icon: '💾', slot: 'ram-slot', description: 'Temporary memory for running programs' },
        { id: 'storage', name: 'Storage', icon: '📀', slot: 'storage-slot', description: 'Permanent storage for files' },
        { id: 'gpu', name: 'GPU', icon: '🎮', slot: 'gpu-slot', description: 'Renders graphics and visuals' },
        { id: 'motherboard', name: 'Motherboard', icon: '🔌', slot: 'motherboard-slot', description: 'Connects all components together' },
        { id: 'psu', name: 'Power Supply', icon: '⚡', slot: 'psu-slot', description: 'Provides power to components' }
    ];

    let placedComponents = new Set();

    // Create draggable components
    const partsContainer = builderContainer.querySelector('.computer-parts');
    const computerCase = builderContainer.querySelector('.computer-case');

    components.forEach(comp => {
        // Create draggable part
        const part = document.createElement('div');
        part.className = 'computer-part';
        part.draggable = true;
        part.dataset.component = comp.id;
        part.innerHTML = `
            <span class="part-icon">${comp.icon}</span>
            <span class="part-name">${comp.name}</span>
        `;
        partsContainer?.appendChild(part);

        // Create drop slot
        const slot = document.createElement('div');
        slot.className = 'component-slot';
        slot.id = comp.slot;
        slot.dataset.accepts = comp.id;
        slot.innerHTML = `<span class="slot-label">${comp.name}</span>`;
        computerCase?.appendChild(slot);
    });

    // Drag and drop functionality
    const parts = builderContainer.querySelectorAll('.computer-part');
    const slots = builderContainer.querySelectorAll('.component-slot');

    parts.forEach(part => {
        part.addEventListener('dragstart', handleDragStart);
        part.addEventListener('dragend', handleDragEnd);
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('dragleave', handleDragLeave);
        slot.addEventListener('drop', handleDrop);
    });

    function handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.component);
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        const slot = e.target.closest('.component-slot');
        if (!slot) return;

        slot.classList.remove('drag-over');
        const componentId = e.dataTransfer.getData('text/plain');
        
        if (slot.dataset.accepts === componentId && !slot.classList.contains('filled')) {
            const component = components.find(c => c.id === componentId);
            slot.innerHTML = `
                <span class="placed-icon">${component.icon}</span>
                <span class="placed-name">${component.name}</span>
            `;
            slot.classList.add('filled');
            
            // Hide the dragged part
            const part = document.querySelector(`.computer-part[data-component="${componentId}"]`);
            part?.classList.add('placed');
            
            placedComponents.add(componentId);
            
            // Show component info
            showComponentInfo(component);
            
            // Check if all components are placed
            if (placedComponents.size === components.length) {
                celebrateCompletion();
            }
            
            // Play success sound effect (visual feedback)
            slot.classList.add('success-flash');
            setTimeout(() => slot.classList.remove('success-flash'), 500);
        } else if (slot.classList.contains('filled')) {
            showNotification('This slot is already filled!', 'warning');
        } else {
            showNotification('Wrong component for this slot!', 'error');
            slot.classList.add('error-shake');
            setTimeout(() => slot.classList.remove('error-shake'), 500);
        }
    }

    function showComponentInfo(component) {
        const infoPanel = document.getElementById('component-info');
        if (infoPanel) {
            infoPanel.innerHTML = `
                <div class="info-content">
                    <span class="info-icon">${component.icon}</span>
                    <h4>${component.name}</h4>
                    <p>${component.description}</p>
                </div>
            `;
            infoPanel.classList.add('show');
        }
    }

    function celebrateCompletion() {
        showNotification('🎉 Congratulations! You built a complete computer!', 'success');
        createConfetti(builderContainer);
        
        // Mark achievement
        unlockAchievement('computer-builder');
    }

    // Reset button
    const resetBtn = document.getElementById('reset-builder');
    resetBtn?.addEventListener('click', () => {
        slots.forEach(slot => {
            const comp = components.find(c => c.slot === slot.id);
            slot.innerHTML = `<span class="slot-label">${comp.name}</span>`;
            slot.classList.remove('filled');
        });
        parts.forEach(part => part.classList.remove('placed'));
        placedComponents.clear();
        document.getElementById('component-info')?.classList.remove('show');
    });
}

/* =========================================
   Code Playground
   ========================================= */
function initCodePlayground() {
    const playground = document.getElementById('code-playground');
    if (!playground) return;

    const challenges = [
        {
            id: 1,
            title: 'Hello World',
            description: 'Print "Hello, World!" to the screen',
            starterCode: '// Type your code here\nprint("Hello, World!")',
            solution: 'Hello, World!',
            hint: 'Use print() with the text in quotes'
        },
        {
            id: 2,
            title: 'Variables',
            description: 'Create a variable called "age" and set it to 13, then print it',
            starterCode: '// Create a variable and print it\nage = ___\nprint(age)',
            solution: '13',
            hint: 'Replace ___ with the number 13'
        },
        {
            id: 3,
            title: 'Math Operations',
            description: 'Calculate 15 + 27 and print the result',
            starterCode: '// Calculate and print\nresult = 15 + 27\nprint(result)',
            solution: '42',
            hint: 'The code is almost complete!'
        },
        {
            id: 4,
            title: 'Conditionals',
            description: 'Complete the if statement to print "Pass" if score >= 60',
            starterCode: 'score = 75\nif score >= 60:\n    print("Pass")\nelse:\n    print("Fail")',
            solution: 'Pass',
            hint: 'Check if score is greater than or equal to 60'
        },
        {
            id: 5,
            title: 'Loops',
            description: 'Use a loop to print numbers 1 to 5',
            starterCode: 'for i in range(1, 6):\n    print(i)',
            solution: '1\n2\n3\n4\n5',
            hint: 'range(1, 6) gives numbers 1, 2, 3, 4, 5'
        }
    ];

    let currentChallenge = 0;

    const editor = playground.querySelector('.code-editor');
    const output = playground.querySelector('.code-output');
    const runBtn = playground.querySelector('.run-code-btn');
    const hintBtn = playground.querySelector('.hint-btn');
    const prevBtn = playground.querySelector('.prev-challenge');
    const nextBtn = playground.querySelector('.next-challenge');
    const challengeTitle = playground.querySelector('.challenge-title');
    const challengeDesc = playground.querySelector('.challenge-description');

    function loadChallenge(index) {
        const challenge = challenges[index];
        challengeTitle.textContent = `Challenge ${challenge.id}: ${challenge.title}`;
        challengeDesc.textContent = challenge.description;
        editor.value = challenge.starterCode;
        output.textContent = '// Output will appear here';
        output.className = 'code-output';
        
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === challenges.length - 1;
    }

    runBtn?.addEventListener('click', () => {
        const code = editor.value;
        const challenge = challenges[currentChallenge];
        
        try {
            const result = simulatePython(code);
            output.textContent = result;
            
            if (result.trim() === challenge.solution.trim()) {
                output.classList.add('success');
                showNotification('✅ Correct! Great job!', 'success');
                markChallengeComplete(currentChallenge);
            } else {
                output.classList.remove('success');
                output.classList.add('error');
            }
        } catch (error) {
            output.textContent = `Error: ${error.message}`;
            output.classList.add('error');
        }
    });

    hintBtn?.addEventListener('click', () => {
        const challenge = challenges[currentChallenge];
        showNotification(`💡 Hint: ${challenge.hint}`, 'info');
    });

    prevBtn?.addEventListener('click', () => {
        if (currentChallenge > 0) {
            currentChallenge--;
            loadChallenge(currentChallenge);
        }
    });

    nextBtn?.addEventListener('click', () => {
        if (currentChallenge < challenges.length - 1) {
            currentChallenge++;
            loadChallenge(currentChallenge);
        }
    });

    // Simple Python simulator
    function simulatePython(code) {
        let output = [];
        const lines = code.split('\n');
        const variables = {};

        for (let line of lines) {
            line = line.trim();
            
            // Skip comments and empty lines
            if (line.startsWith('//') || line.startsWith('#') || line === '') continue;
            
            // Handle print statements
            const printMatch = line.match(/print\((.*)\)/);
            if (printMatch) {
                let content = printMatch[1].trim();
                
                // Check if it's a string
                if ((content.startsWith('"') && content.endsWith('"')) ||
                    (content.startsWith("'") && content.endsWith("'"))) {
                    output.push(content.slice(1, -1));
                }
                // Check if it's a variable
                else if (variables.hasOwnProperty(content)) {
                    output.push(variables[content]);
                }
                // Check if it's an expression
                else if (!isNaN(eval(content))) {
                    output.push(eval(content));
                }
                else {
                    output.push(content);
                }
                continue;
            }
            
            // Handle variable assignments
            const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
            if (assignMatch) {
                const varName = assignMatch[1];
                let value = assignMatch[2].trim();
                
                // Evaluate the value
                try {
                    if (!isNaN(value)) {
                        variables[varName] = Number(value);
                    } else if (value.includes('+') || value.includes('-') || 
                               value.includes('*') || value.includes('/')) {
                        // Replace variables in expression
                        for (let v in variables) {
                            value = value.replace(new RegExp(`\\b${v}\\b`, 'g'), variables[v]);
                        }
                        variables[varName] = eval(value);
                    } else {
                        variables[varName] = value;
                    }
                } catch (e) {
                    variables[varName] = value;
                }
            }
        }

        return output.join('\n') || '// No output';
    }

    function markChallengeComplete(index) {
        const progressDots = playground.querySelectorAll('.progress-dot');
        if (progressDots[index]) {
            progressDots[index].classList.add('completed');
        }
        saveProgress('code-challenge-' + index, true);
    }

    // Initialize first challenge
    loadChallenge(currentChallenge);
}

/* =========================================
   Password Strength Checker
   ========================================= */
function initPasswordChecker() {
    const checker = document.getElementById('password-checker');
    if (!checker) return;

    const input = checker.querySelector('.password-input');
    const strengthBar = checker.querySelector('.strength-bar-fill');
    const strengthText = checker.querySelector('.strength-text');
    const tipsList = checker.querySelector('.password-tips');
    const toggleBtn = checker.querySelector('.toggle-password');

    input?.addEventListener('input', () => {
        const password = input.value;
        const result = analyzePassword(password);
        
        // Update strength bar
        strengthBar.style.width = `${result.score}%`;
        strengthBar.className = `strength-bar-fill ${result.level}`;
        
        // Update text
        strengthText.textContent = result.message;
        strengthText.className = `strength-text ${result.level}`;
        
        // Update tips
        updatePasswordTips(result.tips);
    });

    toggleBtn?.addEventListener('click', () => {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });

    function analyzePassword(password) {
        let score = 0;
        const tips = [];
        
        // Length check
        if (password.length >= 8) {
            score += 20;
        } else {
            tips.push('Use at least 8 characters');
        }
        
        if (password.length >= 12) {
            score += 10;
        }
        
        // Uppercase check
        if (/[A-Z]/.test(password)) {
            score += 20;
        } else {
            tips.push('Add uppercase letters (A-Z)');
        }
        
        // Lowercase check
        if (/[a-z]/.test(password)) {
            score += 20;
        } else {
            tips.push('Add lowercase letters (a-z)');
        }
        
        // Number check
        if (/[0-9]/.test(password)) {
            score += 15;
        } else {
            tips.push('Add numbers (0-9)');
        }
        
        // Special character check
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            score += 15;
        } else {
            tips.push('Add special characters (!@#$%...)');
        }
        
        // Determine level
        let level, message;
        if (score < 30) {
            level = 'weak';
            message = '🔴 Weak - Too easy to guess!';
        } else if (score < 60) {
            level = 'fair';
            message = '🟡 Fair - Getting better!';
        } else if (score < 80) {
            level = 'good';
            message = '🟢 Good - Nice password!';
        } else {
            level = 'strong';
            message = '💪 Strong - Excellent security!';
        }
        
        return { score, level, message, tips };
    }

    function updatePasswordTips(tips) {
        if (!tipsList) return;
        
        if (tips.length === 0) {
            tipsList.innerHTML = '<li class="tip-success">✅ All requirements met!</li>';
        } else {
            tipsList.innerHTML = tips.map(tip => 
                `<li class="tip-warning">⚠️ ${tip}</li>`
            ).join('');
        }
    }
}

/* =========================================
   Network Simulation
   ========================================= */
function initNetworkSimulation() {
    const simulation = document.getElementById('network-simulation');
    if (!simulation) return;

    const sendBtn = simulation.querySelector('.send-packet-btn');
    const packetPath = simulation.querySelector('.packet-path');
    const statusLog = simulation.querySelector('.network-log');

    sendBtn?.addEventListener('click', () => {
        sendPacket();
    });

    function sendPacket() {
        const steps = [
            { node: 'your-device', message: '📱 Creating data packet...', delay: 0 },
            { node: 'router', message: '📡 Packet sent to router...', delay: 800 },
            { node: 'isp', message: '🏢 Traveling through ISP...', delay: 1600 },
            { node: 'internet', message: '🌍 Routing through the Internet...', delay: 2400 },
            { node: 'server', message: '🖥️ Packet arrived at server!', delay: 3200 },
            { node: 'server', message: '📨 Server sending response...', delay: 4000 },
            { node: 'your-device', message: '✅ Response received!', delay: 5000 }
        ];

        // Reset
        document.querySelectorAll('.network-node').forEach(node => {
            node.classList.remove('active', 'sending', 'receiving');
        });
        statusLog.innerHTML = '';

        // Create animated packet
        const packet = document.createElement('div');
        packet.className = 'data-packet';
        packet.textContent = '📦';
        packetPath.appendChild(packet);

        steps.forEach((step, index) => {
            setTimeout(() => {
                // Update node state
                const node = simulation.querySelector(`[data-node="${step.node}"]`);
                if (node) {
                    node.classList.add('active');
                    if (index < 5) {
                        node.classList.add('sending');
                    } else {
                        node.classList.add('receiving');
                    }
                }

                // Add log entry
                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry';
                logEntry.innerHTML = `<span class="log-time">${(step.delay / 1000).toFixed(1)}s</span> ${step.message}`;
                statusLog.appendChild(logEntry);
                statusLog.scrollTop = statusLog.scrollHeight;

                // Move packet
                packet.style.left = `${(index / (steps.length - 1)) * 100}%`;

            }, step.delay);
        });

        // Cleanup
        setTimeout(() => {
            packet.remove();
            showNotification('🎉 Data transfer complete!', 'success');
        }, 5500);
    }
}

/* =========================================
   Typing Challenge
   ========================================= */
function initTypingChallenge() {
    const challenge = document.getElementById('typing-challenge');
    if (!challenge) return;

    const codeSnippets = [
        'print("Hello World")',
        'if score >= 90:',
        'for i in range(10):',
        'def calculate(x, y):',
        'import random',
        'name = input("Enter name: ")',
        'while count < 100:',
        'return result * 2'
    ];

    let currentSnippet = '';
    let startTime = null;
    let isTyping = false;

    const displayText = challenge.querySelector('.display-text');
    const inputField = challenge.querySelector('.typing-input');
    const wpmDisplay = challenge.querySelector('.wpm-value');
    const accuracyDisplay = challenge.querySelector('.accuracy-value');
    const startBtn = challenge.querySelector('.start-typing-btn');
    const resultPanel = challenge.querySelector('.typing-result');

    startBtn?.addEventListener('click', startChallenge);
    inputField?.addEventListener('input', handleTyping);

    function startChallenge() {
        currentSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        displayText.innerHTML = currentSnippet.split('').map(char => 
            `<span class="char">${char}</span>`
        ).join('');
        
        inputField.value = '';
        inputField.disabled = false;
        inputField.focus();
        
        startTime = null;
        isTyping = false;
        resultPanel.classList.remove('show');
        
        wpmDisplay.textContent = '0';
        accuracyDisplay.textContent = '100';
    }

    function handleTyping() {
        const typed = inputField.value;
        
        if (!isTyping) {
            startTime = new Date();
            isTyping = true;
        }

        // Highlight characters
        const chars = displayText.querySelectorAll('.char');
        chars.forEach((char, index) => {
            char.classList.remove('correct', 'incorrect', 'current');
            
            if (index < typed.length) {
                if (typed[index] === currentSnippet[index]) {
                    char.classList.add('correct');
                } else {
                    char.classList.add('incorrect');
                }
            } else if (index === typed.length) {
                char.classList.add('current');
            }
        });

        // Calculate WPM and accuracy
        const timeElapsed = (new Date() - startTime) / 1000 / 60; // in minutes
        const wordsTyped = typed.length / 5; // standard: 5 chars = 1 word
        const wpm = Math.round(wordsTyped / timeElapsed) || 0;
        
        let correctChars = 0;
        for (let i = 0; i < typed.length; i++) {
            if (typed[i] === currentSnippet[i]) correctChars++;
        }
        const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;

        wpmDisplay.textContent = wpm;
        accuracyDisplay.textContent = accuracy;

        // Check completion
        if (typed === currentSnippet) {
            finishChallenge(wpm, accuracy);
        }
    }

    function finishChallenge(wpm, accuracy) {
        inputField.disabled = true;
        resultPanel.classList.add('show');
        
        let message = '';
        if (wpm >= 40 && accuracy >= 95) {
            message = '🏆 Excellent! You\'re a coding speedster!';
        } else if (wpm >= 25 && accuracy >= 80) {
            message = '👍 Good job! Keep practicing!';
        } else {
            message = '💪 Nice try! Practice makes perfect!';
        }
        
        resultPanel.innerHTML = `
            <h4>Challenge Complete!</h4>
            <p>${message}</p>
            <div class="final-stats">
                <span>Speed: ${wpm} WPM</span>
                <span>Accuracy: ${accuracy}%</span>
            </div>
        `;
        
        if (wpm >= 30) {
            unlockAchievement('speed-typer');
        }
    }
}

/* =========================================
   Tech Quiz
   ========================================= */
function initTechQuiz() {
    const quizzes = document.querySelectorAll('.tech-quiz');
    
    quizzes.forEach(quiz => {
        const options = quiz.querySelectorAll('.quiz-option');
        const checkBtn = quiz.querySelector('.check-answer');
        const feedback = quiz.querySelector('.quiz-feedback');
        const correctAnswer = quiz.dataset.answer;

        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                option.querySelector('input').checked = true;
            });
        });

        checkBtn?.addEventListener('click', () => {
            const selected = quiz.querySelector('input:checked');
            if (!selected) {
                showNotification('Please select an answer!', 'warning');
                return;
            }

            const isCorrect = selected.value === correctAnswer;
            
            options.forEach(option => {
                option.classList.remove('correct', 'incorrect');
                if (option.querySelector('input').value === correctAnswer) {
                    option.classList.add('correct');
                } else if (option.querySelector('input').checked) {
                    option.classList.add('incorrect');
                }
            });

            feedback.textContent = isCorrect ? 
                '✅ Correct! Great job!' : 
                '❌ Not quite. The correct answer is highlighted.';
            feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;

            if (isCorrect) {
                incrementQuizScore();
            }
        });
    });
}

/* =========================================
   Progress Tracking
   ========================================= */
function initProgressTracker() {
    loadProgress();
    updateProgressDisplay();
}

function saveProgress(key, value) {
    const progress = JSON.parse(localStorage.getItem('techProgress') || '{}');
    progress[key] = value;
    localStorage.setItem('techProgress', JSON.stringify(progress));
    updateProgressDisplay();
}

function loadProgress() {
    return JSON.parse(localStorage.getItem('techProgress') || '{}');
}

function markTopicVisited(topic) {
    saveProgress(`visited-${topic}`, true);
}

function incrementQuizScore() {
    const progress = loadProgress();
    progress.quizScore = (progress.quizScore || 0) + 1;
    localStorage.setItem('techProgress', JSON.stringify(progress));
    updateProgressDisplay();
}

function updateProgressDisplay() {
    const progress = loadProgress();
    const progressBar = document.querySelector('.learning-progress-bar');
    const progressText = document.querySelector('.learning-progress-text');
    
    if (!progressBar) return;

    // Calculate progress percentage
    const totalItems = 10; // topics, challenges, quizzes
    const completedItems = Object.keys(progress).filter(k => progress[k] === true).length;
    const percentage = Math.round((completedItems / totalItems) * 100);

    progressBar.style.width = `${percentage}%`;
    if (progressText) {
        progressText.textContent = `${percentage}% Complete`;
    }
}

function unlockAchievement(achievementId) {
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    if (!achievements.includes(achievementId)) {
        achievements.push(achievementId);
        localStorage.setItem('achievements', JSON.stringify(achievements));
        showAchievementPopup(achievementId);
    }
}

function showAchievementPopup(achievementId) {
    const achievementNames = {
        'computer-builder': '🏗️ Computer Builder',
        'speed-typer': '⌨️ Speed Typer',
        'code-master': '💻 Code Master',
        'security-expert': '🔒 Security Expert'
    };

    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <div class="achievement-content">
            <span class="achievement-icon">🏆</span>
            <div>
                <h4>Achievement Unlocked!</h4>
                <p>${achievementNames[achievementId] || achievementId}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => popup.classList.add('show'), 100);
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}

/* =========================================
   Utility Functions
   ========================================= */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    const close = () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    };
    
    notification.querySelector('.notification-close').addEventListener('click', close);
    setTimeout(close, 4000);
}

function createConfetti(container) {
    const colors = ['#4361ee', '#7209b7', '#10b981', '#f59e0b', '#ef4444'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}
