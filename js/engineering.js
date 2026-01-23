/**
 * STEM Learning Hub - Engineering Interactive Features
 * Engaging simulations and activities for 8th graders
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initTopicNavigation();
    initDesignProcess();
    initEngineerExplorer();
    initLeverSimulator();
    initPulleySimulator();
    initMechanicalAdvantageCalculator();
    initMachineMatchingGame();
    initForceVisualizer();
    initShapeStrengthTest();
    initBridgeBuilderGame();
    initChallengeTracker();
    initAchievementSystem();
    initQuizzes();
});

/**
 * Topic Navigation with smooth transitions
 */
function initTopicNavigation() {
    const topicBtns = document.querySelectorAll('.topic-btn');
    const topicSections = document.querySelectorAll('.topic-section');

    topicBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic;
            
            // Update buttons
            topicBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update sections with animation
            topicSections.forEach(section => {
                if (section.id === topic) {
                    section.classList.add('active');
                    section.style.animation = 'slideIn 0.4s ease forwards';
                } else {
                    section.classList.remove('active');
                }
            });

            // Track progress
            trackProgress('topic_viewed', topic);
        });
    });
}

/**
 * Interactive Design Process Steps
 */
function initDesignProcess() {
    const designSteps = document.querySelectorAll('.design-step');
    
    designSteps.forEach((step, index) => {
        // Make steps interactive
        step.addEventListener('click', () => {
            toggleStepDetails(step, index);
        });

        // Add keyboard accessibility
        step.setAttribute('tabindex', '0');
        step.setAttribute('role', 'button');
        step.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                toggleStepDetails(step, index);
            }
        });
    });

    // Initialize the design project form
    initDesignProjectForm();
}

function toggleStepDetails(step, index) {
    const isExpanded = step.classList.contains('expanded');
    
    // Collapse all steps
    document.querySelectorAll('.design-step').forEach(s => {
        s.classList.remove('expanded');
        const details = s.querySelector('.step-details');
        if (details) details.remove();
    });

    if (!isExpanded) {
        step.classList.add('expanded');
        
        // Add detailed content
        const details = document.createElement('div');
        details.className = 'step-details';
        details.innerHTML = getStepDetails(index);
        step.querySelector('.step-content').appendChild(details);
        
        // Animate in
        requestAnimationFrame(() => {
            details.style.animation = 'expandIn 0.3s ease forwards';
        });

        // Award achievement for exploring
        checkAchievement('curious_engineer', index);
    }
}

function getStepDetails(index) {
    const details = [
        {
            title: 'Key Questions to Ask:',
            points: [
                'What is the problem I\'m solving?',
                'Who will use this solution?',
                'What are the limitations (time, money, materials)?',
                'What does success look like?'
            ],
            activity: 'Try writing down a problem you\'ve noticed at school or home!'
        },
        {
            title: 'Research Tips:',
            points: [
                'Look at existing solutions',
                'Interview people who have this problem',
                'Study what worked and what didn\'t',
                'Take notes on key findings'
            ],
            activity: 'Search for 3 different solutions to your problem online.'
        },
        {
            title: 'Brainstorming Rules:',
            points: [
                'Quantity over quality - get lots of ideas!',
                'No criticism allowed during brainstorming',
                'Build on others\' ideas',
                'Wild ideas are welcome!'
            ],
            activity: 'Set a timer for 5 minutes and write down every idea you can think of.'
        },
        {
            title: 'Planning Checklist:',
            points: [
                'Choose your best idea',
                'Draw detailed sketches',
                'List all materials needed',
                'Create a timeline'
            ],
            activity: 'Sketch your solution with labels for each part.'
        },
        {
            title: 'Building Tips:',
            points: [
                'Start with the basic structure',
                'Test as you build',
                'Don\'t be afraid to make changes',
                'Document your process with photos'
            ],
            activity: 'Build a simple prototype using cardboard or paper first.'
        },
        {
            title: 'Testing Methods:',
            points: [
                'Create a test plan before testing',
                'Record all results',
                'Test multiple times',
                'Get feedback from others'
            ],
            activity: 'Write 3 tests to check if your solution works.'
        },
        {
            title: 'Improvement Strategies:',
            points: [
                'Review test results',
                'Identify what needs to change',
                'Make one change at a time',
                'Test again after each change'
            ],
            activity: 'List 3 ways to make your design better.'
        }
    ];

    const detail = details[index];
    return `
        <div class="detail-content">
            <h5>${detail.title}</h5>
            <ul>
                ${detail.points.map(p => `<li>${p}</li>`).join('')}
            </ul>
            <div class="detail-activity">
                <span class="activity-icon">✏️</span>
                <span class="activity-text">${detail.activity}</span>
            </div>
        </div>
    `;
}

/**
 * Design Your Own Project Form
 */
function initDesignProjectForm() {
    const projectContainer = document.querySelector('#design .lesson-card:first-of-type');
    if (!projectContainer) return;

    // Add project button after the intro card
    const projectBtn = document.createElement('button');
    projectBtn.className = 'btn btn-primary start-project-btn';
    projectBtn.innerHTML = '🚀 Start Your Own Design Project';
    projectBtn.addEventListener('click', showProjectForm);
    
    const existingBtn = document.querySelector('.start-project-btn');
    if (!existingBtn) {
        projectContainer.appendChild(projectBtn);
    }
}

function showProjectForm() {
    // Check if form already exists
    if (document.querySelector('.project-form-modal')) return;

    const modal = document.createElement('div');
    modal.className = 'project-form-modal';
    modal.innerHTML = `
        <div class="project-form-content">
            <button class="close-modal" aria-label="Close">&times;</button>
            <h3>🎯 Your Design Project</h3>
            <p>Follow the design process to create your own solution!</p>
            
            <form id="design-project-form">
                <div class="form-step active" data-step="1">
                    <h4>Step 1: Identify the Problem</h4>
                    <label for="problem">What problem do you want to solve?</label>
                    <textarea id="problem" placeholder="Example: My backpack is always messy and I can't find things..." required></textarea>
                </div>

                <div class="form-step" data-step="2">
                    <h4>Step 2: Who & Why</h4>
                    <label for="user">Who will use your solution?</label>
                    <input type="text" id="user" placeholder="Example: Students like me" required>
                    <label for="why">Why is this problem important to solve?</label>
                    <textarea id="why" placeholder="Example: I waste time looking for things..." required></textarea>
                </div>

                <div class="form-step" data-step="3">
                    <h4>Step 3: Brainstorm Ideas</h4>
                    <label>List at least 3 possible solutions:</label>
                    <input type="text" class="idea-input" placeholder="Idea 1" required>
                    <input type="text" class="idea-input" placeholder="Idea 2" required>
                    <input type="text" class="idea-input" placeholder="Idea 3" required>
                    <button type="button" class="btn btn-secondary btn-small add-idea-btn">+ Add Another Idea</button>
                </div>

                <div class="form-step" data-step="4">
                    <h4>Step 4: Choose Your Best Idea</h4>
                    <label for="best-idea">Which idea will you develop?</label>
                    <select id="best-idea" required>
                        <option value="">Select your best idea...</option>
                    </select>
                    <label for="why-best">Why is this the best solution?</label>
                    <textarea id="why-best" placeholder="Example: It's simple to make and uses materials I have..." required></textarea>
                </div>

                <div class="form-step" data-step="5">
                    <h4>Step 5: Plan Your Build</h4>
                    <label for="materials">What materials do you need?</label>
                    <textarea id="materials" placeholder="List your materials..." required></textarea>
                    <label for="steps">What are the steps to build it?</label>
                    <textarea id="steps" placeholder="1. First, I will...&#10;2. Then...&#10;3. Next..." required></textarea>
                </div>

                <div class="form-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 20%"></div>
                    </div>
                    <span class="progress-text">Step 1 of 5</span>
                </div>

                <div class="form-navigation">
                    <button type="button" class="btn btn-secondary prev-step" disabled>← Previous</button>
                    <button type="button" class="btn btn-primary next-step">Next →</button>
                    <button type="submit" class="btn btn-primary submit-project" style="display: none;">🎉 Complete Project</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('active'));

    // Initialize form functionality
    initProjectFormNavigation(modal);
}

function initProjectFormNavigation(modal) {
    const form = modal.querySelector('#design-project-form');
    const steps = modal.querySelectorAll('.form-step');
    const prevBtn = modal.querySelector('.prev-step');
    const nextBtn = modal.querySelector('.next-step');
    const submitBtn = modal.querySelector('.submit-project');
    const progressFill = modal.querySelector('.progress-fill');
    const progressText = modal.querySelector('.progress-text');
    const closeBtn = modal.querySelector('.close-modal');
    
    let currentStep = 1;

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });

    // Add idea button
    const addIdeaBtn = modal.querySelector('.add-idea-btn');
    addIdeaBtn.addEventListener('click', () => {
        const container = addIdeaBtn.parentElement;
        const ideaCount = container.querySelectorAll('.idea-input').length + 1;
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'idea-input';
        newInput.placeholder = `Idea ${ideaCount}`;
        container.insertBefore(newInput, addIdeaBtn);
    });

    // Navigation
    function updateStep(direction) {
        if (direction === 'next' && currentStep < 5) {
            // Validate current step
            const currentStepEl = modal.querySelector(`.form-step[data-step="${currentStep}"]`);
            const inputs = currentStepEl.querySelectorAll('input:required, textarea:required, select:required');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (!valid) {
                showNotification('Please fill in all required fields!', 'warning');
                return;
            }

            // Update idea select options when moving to step 4
            if (currentStep === 3) {
                updateIdeaSelect();
            }

            currentStep++;
        } else if (direction === 'prev' && currentStep > 1) {
            currentStep--;
        }

        // Update UI
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === currentStep) {
                step.classList.add('active');
            }
        });

        prevBtn.disabled = currentStep === 1;
        nextBtn.style.display = currentStep === 5 ? 'none' : 'inline-flex';
        submitBtn.style.display = currentStep === 5 ? 'inline-flex' : 'none';

        const progress = (currentStep / 5) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Step ${currentStep} of 5`;
    }

    function updateIdeaSelect() {
        const ideaInputs = modal.querySelectorAll('.idea-input');
        const select = modal.querySelector('#best-idea');
        select.innerHTML = '<option value="">Select your best idea...</option>';
        
        ideaInputs.forEach((input, index) => {
            if (input.value.trim()) {
                const option = document.createElement('option');
                option.value = input.value;
                option.textContent = input.value;
                select.appendChild(option);
            }
        });
    }

    nextBtn.addEventListener('click', () => updateStep('next'));
    prevBtn.addEventListener('click', () => updateStep('prev'));

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const projectData = {
            problem: form.querySelector('#problem').value,
            user: form.querySelector('#user').value,
            why: form.querySelector('#why').value,
            ideas: Array.from(form.querySelectorAll('.idea-input')).map(i => i.value).filter(v => v),
            bestIdea: form.querySelector('#best-idea').value,
            whyBest: form.querySelector('#why-best').value,
            materials: form.querySelector('#materials').value,
            steps: form.querySelector('#steps').value
        };

        // Save project
        saveProject(projectData);
        
        // Show success
        modal.querySelector('.project-form-content').innerHTML = `
            <div class="project-success">
                <div class="success-icon">🎉</div>
                <h3>Awesome Work, Engineer!</h3>
                <p>You've completed the design process planning!</p>
                <div class="project-summary">
                    <h4>Your Project Summary:</h4>
                    <p><strong>Problem:</strong> ${projectData.problem}</p>
                    <p><strong>Solution:</strong> ${projectData.bestIdea}</p>
                </div>
                <p class="next-step-prompt">Now it's time to build your prototype!</p>
                <button class="btn btn-primary close-success">Got it! 🚀</button>
            </div>
        `;

        modal.querySelector('.close-success').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });

        // Award achievement
        awardAchievement('design_master', 'Design Master', 'Completed your first design project plan!');
    });
}

function saveProject(data) {
    const projects = JSON.parse(localStorage.getItem('engineering_projects') || '[]');
    data.id = Date.now();
    data.date = new Date().toLocaleDateString();
    projects.push(data);
    localStorage.setItem('engineering_projects', JSON.stringify(projects));
}

/**
 * Interactive Engineer Explorer Cards
 */
function initEngineerExplorer() {
    const engineerCards = document.querySelectorAll('.engineer-card');
    
    const engineerDetails = {
        'Civil Engineer': {
            salary: '$88,000/year',
            education: 'Bachelor\'s in Civil Engineering',
            skills: ['Math', 'Physics', 'Design Software', 'Problem Solving'],
            projects: ['Golden Gate Bridge', 'Burj Khalifa', 'Panama Canal'],
            dayInLife: 'Review blueprints, visit construction sites, meet with clients, solve structural problems'
        },
        'Electrical Engineer': {
            salary: '$100,000/year',
            education: 'Bachelor\'s in Electrical Engineering',
            skills: ['Circuit Design', 'Programming', 'Mathematics', 'Electronics'],
            projects: ['Smartphones', 'Electric Cars', 'Power Grids'],
            dayInLife: 'Design circuits, test prototypes, write code, troubleshoot electrical systems'
        },
        'Mechanical Engineer': {
            salary: '$90,000/year',
            education: 'Bachelor\'s in Mechanical Engineering',
            skills: ['CAD Software', 'Physics', 'Material Science', 'Manufacturing'],
            projects: ['Jet Engines', 'Robots', 'Medical Devices'],
            dayInLife: 'Design machine parts, run simulations, test prototypes, improve efficiency'
        },
        'Chemical Engineer': {
            salary: '$108,000/year',
            education: 'Bachelor\'s in Chemical Engineering',
            skills: ['Chemistry', 'Process Design', 'Lab Skills', 'Safety Protocols'],
            projects: ['Medicines', 'Clean Fuels', 'Food Processing'],
            dayInLife: 'Develop chemical processes, conduct experiments, ensure safety standards'
        },
        'Software Engineer': {
            salary: '$110,000/year',
            education: 'Bachelor\'s in Computer Science',
            skills: ['Programming', 'Algorithms', 'Problem Solving', 'Teamwork'],
            projects: ['Apps', 'Video Games', 'AI Systems'],
            dayInLife: 'Write code, review others\' code, fix bugs, plan new features'
        },
        'Environmental Engineer': {
            salary: '$92,000/year',
            education: 'Bachelor\'s in Environmental Engineering',
            skills: ['Environmental Science', 'Data Analysis', 'Regulations', 'Sustainability'],
            projects: ['Water Treatment', 'Solar Farms', 'Recycling Systems'],
            dayInLife: 'Monitor pollution, design clean systems, ensure environmental compliance'
        }
    };

    engineerCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('click', () => {
            showEngineerDetails(card, engineerDetails);
        });

        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                showEngineerDetails(card, engineerDetails);
            }
        });
    });
}

function showEngineerDetails(card, details) {
    const title = card.querySelector('h4').textContent;
    const detail = details[title];
    
    if (!detail) return;

    // Remove any existing expanded details
    document.querySelectorAll('.engineer-expanded').forEach(el => el.remove());
    document.querySelectorAll('.engineer-card').forEach(c => c.classList.remove('active'));

    card.classList.add('active');

    const expandedContent = document.createElement('div');
    expandedContent.className = 'engineer-expanded';
    expandedContent.innerHTML = `
        <div class="engineer-detail-grid">
            <div class="detail-section">
                <h5>💰 Average Salary</h5>
                <p>${detail.salary}</p>
            </div>
            <div class="detail-section">
                <h5>🎓 Education</h5>
                <p>${detail.education}</p>
            </div>
            <div class="detail-section">
                <h5>🛠️ Key Skills</h5>
                <div class="skill-tags">
                    ${detail.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                </div>
            </div>
            <div class="detail-section">
                <h5>🏗️ Famous Projects</h5>
                <p>${detail.projects.join(', ')}</p>
            </div>
            <div class="detail-section full-width">
                <h5>📅 A Day in the Life</h5>
                <p>${detail.dayInLife}</p>
            </div>
        </div>
    `;

    card.appendChild(expandedContent);
    
    requestAnimationFrame(() => {
        expandedContent.classList.add('active');
    });

    // Close on click outside
    document.addEventListener('click', function closeDetail(e) {
        if (!card.contains(e.target)) {
            expandedContent.classList.remove('active');
            setTimeout(() => expandedContent.remove(), 300);
            card.classList.remove('active');
            document.removeEventListener('click', closeDetail);
        }
    });
}

/**
 * Interactive Lever Simulator
 */
function initLeverSimulator() {
    const machineCard = document.querySelector('.machine-card:first-of-type');
    if (!machineCard || !machineCard.textContent.includes('Lever')) return;

    const existingSimulator = document.querySelector('.lever-simulator');
    if (existingSimulator) return;

    const simulator = document.createElement('div');
    simulator.className = 'lever-simulator';
    simulator.innerHTML = `
        <h5>🎮 Interactive Lever Simulator</h5>
        <div class="lever-container">
            <div class="lever-visual">
                <div class="lever-arm">
                    <div class="effort-side">
                        <div class="weight effort-weight" draggable="true">
                            <span>You</span>
                            <span class="weight-value">50N</span>
                        </div>
                    </div>
                    <div class="fulcrum-marker">▲</div>
                    <div class="load-side">
                        <div class="weight load-weight">
                            <span>Load</span>
                            <span class="weight-value">100N</span>
                        </div>
                    </div>
                </div>
                <div class="fulcrum"></div>
            </div>
            
            <div class="lever-controls">
                <div class="control-group">
                    <label>Fulcrum Position</label>
                    <input type="range" id="fulcrum-position" min="20" max="80" value="50">
                    <div class="position-labels">
                        <span>Closer to You</span>
                        <span>Closer to Load</span>
                    </div>
                </div>
                <div class="control-group">
                    <label>Load Weight: <span id="load-value">100</span>N</label>
                    <input type="range" id="load-weight" min="10" max="500" value="100">
                </div>
            </div>
            
            <div class="lever-results">
                <div class="result-box">
                    <span class="result-label">Effort Needed</span>
                    <span class="result-value" id="effort-needed">100N</span>
                </div>
                <div class="result-box">
                    <span class="result-label">Mechanical Advantage</span>
                    <span class="result-value" id="lever-ma">1.0</span>
                </div>
                <div class="result-box status">
                    <span class="result-label">Status</span>
                    <span class="result-value" id="lever-status">Balanced</span>
                </div>
            </div>
        </div>
    `;

    machineCard.appendChild(simulator);

    // Add interactivity
    const fulcrumSlider = simulator.querySelector('#fulcrum-position');
    const loadSlider = simulator.querySelector('#load-weight');
    const leverArm = simulator.querySelector('.lever-arm');

    function updateLever() {
        const fulcrumPos = parseInt(fulcrumSlider.value);
        const loadWeight = parseInt(loadSlider.value);
        
        // Update visual
        const effortDistance = fulcrumPos;
        const loadDistance = 100 - fulcrumPos;
        
        leverArm.style.setProperty('--fulcrum-position', `${fulcrumPos}%`);
        
        // Calculate mechanical advantage
        const ma = effortDistance / loadDistance;
        const effortNeeded = loadWeight / ma;
        
        // Update displays
        document.getElementById('load-value').textContent = loadWeight;
        document.getElementById('effort-needed').textContent = effortNeeded.toFixed(1) + 'N';
        document.getElementById('lever-ma').textContent = ma.toFixed(2);
        
        // Update weight displays
        simulator.querySelector('.load-weight .weight-value').textContent = loadWeight + 'N';
        simulator.querySelector('.effort-weight .weight-value').textContent = effortNeeded.toFixed(0) + 'N';
        
        // Update status
        const status = document.getElementById('lever-status');
        if (ma > 1.5) {
            status.textContent = 'Easy Lift! 💪';
            status.style.color = '#10b981';
        } else if (ma < 0.7) {
            status.textContent = 'Hard Work! 😓';
            status.style.color = '#ef4444';
        } else {
            status.textContent = 'Balanced ⚖️';
            status.style.color = '#f59e0b';
        }

        // Animate lever tilt
        const tilt = (fulcrumPos - 50) * 0.2;
        leverArm.style.transform = `rotate(${tilt}deg)`;
    }

    fulcrumSlider.addEventListener('input', updateLever);
    loadSlider.addEventListener('input', updateLever);
    updateLever();
}

/**
 * Interactive Pulley Simulator
 */
function initPulleySimulator() {
    const pulleyCard = Array.from(document.querySelectorAll('.machine-card'))
        .find(card => card.textContent.includes('Pulley'));
    
    if (!pulleyCard) return;

    const existingSimulator = pulleyCard.querySelector('.pulley-simulator');
    if (existingSimulator) return;

    const simulator = document.createElement('div');
    simulator.className = 'pulley-simulator';
    simulator.innerHTML = `
        <h5>🎮 Pulley System Builder</h5>
        <div class="pulley-container">
            <div class="pulley-visual">
                <div class="pulley-system" id="pulley-system">
                    <div class="pulley single">
                        <div class="pulley-wheel"></div>
                        <div class="rope"></div>
                    </div>
                    <div class="pulley-load">
                        <div class="load-box">100N</div>
                    </div>
                    <div class="pulley-effort">
                        <div class="person-icon">🧑</div>
                        <div class="effort-arrow">↓ <span id="pulley-effort-display">100N</span></div>
                    </div>
                </div>
            </div>
            
            <div class="pulley-controls">
                <label>Number of Pulleys</label>
                <div class="pulley-buttons">
                    <button class="pulley-btn active" data-pulleys="1">1 (Fixed)</button>
                    <button class="pulley-btn" data-pulleys="2">2 (Movable)</button>
                    <button class="pulley-btn" data-pulleys="4">4 (Block & Tackle)</button>
                </div>
                
                <div class="pulley-info">
                    <p id="pulley-explanation">
                        A single fixed pulley changes the direction of force but doesn't reduce effort.
                    </p>
                </div>
                
                <div class="pulley-stats">
                    <div class="stat">
                        <span class="stat-label">Load</span>
                        <span class="stat-value">100N</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Effort Needed</span>
                        <span class="stat-value" id="pulley-effort-stat">100N</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Mechanical Advantage</span>
                        <span class="stat-value" id="pulley-ma">1</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    pulleyCard.appendChild(simulator);

    // Add interactivity
    const pulleyBtns = simulator.querySelectorAll('.pulley-btn');
    const pulleySystem = simulator.querySelector('#pulley-system');
    
    pulleyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pulleyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const numPulleys = parseInt(btn.dataset.pulleys);
            updatePulleySystem(numPulleys, simulator);
        });
    });
}

function updatePulleySystem(numPulleys, simulator) {
    const load = 100;
    const ma = numPulleys;
    const effort = load / ma;
    
    // Update displays
    simulator.querySelector('#pulley-effort-display').textContent = effort + 'N';
    simulator.querySelector('#pulley-effort-stat').textContent = effort + 'N';
    simulator.querySelector('#pulley-ma').textContent = ma;
    
    // Update explanation
    const explanations = {
        1: 'A single fixed pulley changes the direction of force but doesn\'t reduce effort.',
        2: 'A movable pulley system gives you a 2:1 mechanical advantage! You only need half the force.',
        4: 'A block and tackle system with 4 pulleys means you only need 1/4 of the force!'
    };
    simulator.querySelector('#pulley-explanation').textContent = explanations[numPulleys];
    
    // Update visual
    const pulleySystem = simulator.querySelector('.pulley');
    pulleySystem.className = `pulley pulleys-${numPulleys}`;
}

/**
 * Mechanical Advantage Calculator
 */
function initMechanicalAdvantageCalculator() {
    const maSection = document.querySelector('.lesson-card:has(.formula-box)');
    if (!maSection) return;

    const existingCalc = maSection.querySelector('.ma-calculator');
    if (existingCalc) return;

    const calculator = document.createElement('div');
    calculator.className = 'ma-calculator';
    calculator.innerHTML = `
        <h4>🧮 MA Calculator</h4>
        <div class="calc-grid">
            <div class="calc-input-group">
                <label for="input-force">Input Force (your effort)</label>
                <div class="input-with-unit">
                    <input type="number" id="input-force" value="10" min="1">
                    <span class="unit">N</span>
                </div>
            </div>
            <div class="calc-input-group">
                <label for="output-force">Output Force (load moved)</label>
                <div class="input-with-unit">
                    <input type="number" id="output-force" value="50" min="1">
                    <span class="unit">N</span>
                </div>
            </div>
        </div>
        <button class="btn btn-primary calculate-ma-btn">Calculate MA</button>
        <div class="ma-result">
            <div class="ma-value">
                <span class="big-number" id="ma-result-value">5</span>
                <span class="ma-label">Mechanical Advantage</span>
            </div>
            <p class="ma-interpretation" id="ma-interpretation">
                This machine multiplies your force by 5! 💪
            </p>
        </div>
    `;

    maSection.appendChild(calculator);

    // Add functionality
    const inputForce = calculator.querySelector('#input-force');
    const outputForce = calculator.querySelector('#output-force');
    const calcBtn = calculator.querySelector('.calculate-ma-btn');
    const resultValue = calculator.querySelector('#ma-result-value');
    const interpretation = calculator.querySelector('#ma-interpretation');

    function calculate() {
        const input = parseFloat(inputForce.value) || 1;
        const output = parseFloat(outputForce.value) || 1;
        const ma = output / input;
        
        resultValue.textContent = ma.toFixed(2);
        resultValue.classList.add('pulse');
        setTimeout(() => resultValue.classList.remove('pulse'), 500);
        
        if (ma > 1) {
            interpretation.textContent = `This machine multiplies your force by ${ma.toFixed(1)}! 💪 Great for lifting heavy things!`;
            interpretation.style.color = '#10b981';
        } else if (ma < 1) {
            interpretation.textContent = `This machine reduces force (MA < 1) but increases speed/distance. 🏃`;
            interpretation.style.color = '#f59e0b';
        } else {
            interpretation.textContent = `No mechanical advantage - force in equals force out. The machine just changes direction.`;
            interpretation.style.color = '#6b7280';
        }
    }

    calcBtn.addEventListener('click', calculate);
    inputForce.addEventListener('input', calculate);
    outputForce.addEventListener('input', calculate);
}

/**
 * Machine Matching Game
 */
function initMachineMatchingGame() {
    const machinesSection = document.querySelector('#machines');
    if (!machinesSection) return;

    const existingGame = machinesSection.querySelector('.machine-game');
    if (existingGame) return;

    const gameContainer = document.createElement('div');
    gameContainer.className = 'lesson-card machine-game';
    gameContainer.innerHTML = `
        <h3>🎮 Machine Matching Game</h3>
        <p>Drag each real-world example to the correct simple machine!</p>
        
        <div class="matching-game">
            <div class="examples-container">
                <div class="draggable-example" draggable="true" data-machine="lever">Seesaw</div>
                <div class="draggable-example" draggable="true" data-machine="pulley">Flagpole</div>
                <div class="draggable-example" draggable="true" data-machine="wheel">Doorknob</div>
                <div class="draggable-example" draggable="true" data-machine="inclined">Wheelchair Ramp</div>
                <div class="draggable-example" draggable="true" data-machine="wedge">Axe</div>
                <div class="draggable-example" draggable="true" data-machine="screw">Jar Lid</div>
                <div class="draggable-example" draggable="true" data-machine="lever">Crowbar</div>
                <div class="draggable-example" draggable="true" data-machine="wheel">Bicycle</div>
            </div>
            
            <div class="drop-zones">
                <div class="drop-zone" data-machine="lever">
                    <span class="zone-icon">🎚️</span>
                    <span class="zone-label">Lever</span>
                    <div class="dropped-items"></div>
                </div>
                <div class="drop-zone" data-machine="wheel">
                    <span class="zone-icon">🔘</span>
                    <span class="zone-label">Wheel & Axle</span>
                    <div class="dropped-items"></div>
                </div>
                <div class="drop-zone" data-machine="pulley">
                    <span class="zone-icon">🅾️</span>
                    <span class="zone-label">Pulley</span>
                    <div class="dropped-items"></div>
                </div>
                <div class="drop-zone" data-machine="inclined">
                    <span class="zone-icon">📐</span>
                    <span class="zone-label">Inclined Plane</span>
                    <div class="dropped-items"></div>
                </div>
                <div class="drop-zone" data-machine="wedge">
                    <span class="zone-icon">🔪</span>
                    <span class="zone-label">Wedge</span>
                    <div class="dropped-items"></div>
                </div>
                <div class="drop-zone" data-machine="screw">
                    <span class="zone-icon">🔩</span>
                    <span class="zone-label">Screw</span>
                    <div class="dropped-items"></div>
                </div>
            </div>
        </div>
        
        <div class="game-status">
            <span class="score">Score: <span id="match-score">0</span>/8</span>
            <button class="btn btn-secondary reset-game-btn">Reset Game</button>
        </div>
    `;

    machinesSection.appendChild(gameContainer);

    // Initialize drag and drop
    initDragAndDrop(gameContainer);
}

function initDragAndDrop(container) {
    const draggables = container.querySelectorAll('.draggable-example');
    const dropZones = container.querySelectorAll('.drop-zone');
    let score = 0;
    const scoreDisplay = container.querySelector('#match-score');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', draggable.dataset.machine);
            e.dataTransfer.setData('text/html', draggable.textContent);
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });

        // Touch support
        draggable.addEventListener('touchstart', handleTouchStart);
        draggable.addEventListener('touchmove', handleTouchMove);
        draggable.addEventListener('touchend', handleTouchEnd);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            const machine = e.dataTransfer.getData('text/plain');
            const text = e.dataTransfer.getData('text/html');
            const dragging = document.querySelector('.dragging');
            
            if (machine === zone.dataset.machine) {
                // Correct match
                const item = document.createElement('div');
                item.className = 'dropped-item correct';
                item.textContent = text;
                zone.querySelector('.dropped-items').appendChild(item);
                
                if (dragging) dragging.remove();
                score++;
                scoreDisplay.textContent = score;
                
                showNotification('Correct! ✓', 'success');
                
                if (score === 8) {
                    showNotification('🎉 Perfect! You matched all machines!', 'success');
                    awardAchievement('machine_master', 'Machine Master', 'Correctly matched all simple machines!');
                }
            } else {
                // Wrong match
                zone.classList.add('wrong');
                setTimeout(() => zone.classList.remove('wrong'), 500);
                showNotification('Try again!', 'error');
            }
        });
    });

    // Reset button
    container.querySelector('.reset-game-btn').addEventListener('click', () => {
        location.reload();
    });
}

let touchDragging = null;
let touchClone = null;

function handleTouchStart(e) {
    touchDragging = e.target;
    touchDragging.classList.add('dragging');
    
    // Create clone for visual feedback
    touchClone = touchDragging.cloneNode(true);
    touchClone.classList.add('touch-clone');
    document.body.appendChild(touchClone);
    
    const touch = e.touches[0];
    touchClone.style.left = touch.pageX + 'px';
    touchClone.style.top = touch.pageY + 'px';
}

function handleTouchMove(e) {
    if (!touchClone) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    touchClone.style.left = touch.pageX + 'px';
    touchClone.style.top = touch.pageY + 'px';
}

function handleTouchEnd(e) {
    if (!touchDragging || !touchClone) return;
    
    const touch = e.changedTouches[0];
    const dropZone = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (dropZone && dropZone.classList.contains('drop-zone')) {
        // Simulate drop
        if (touchDragging.dataset.machine === dropZone.dataset.machine) {
            const item = document.createElement('div');
            item.className = 'dropped-item correct';
            item.textContent = touchDragging.textContent;
            dropZone.querySelector('.dropped-items').appendChild(item);
            touchDragging.remove();
        }
    }
    
    touchDragging.classList.remove('dragging');
    touchClone.remove();
    touchDragging = null;
    touchClone = null;
}

/**
 * Force Visualizer
 */
function initForceVisualizer() {
    const forcesGrid = document.querySelector('.forces-grid');
    if (!forcesGrid) return;

    const forceCards = forcesGrid.querySelectorAll('.force-card');
    
    forceCards.forEach(card => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', () => {
            animateForce(card);
        });

        card.addEventListener('mouseenter', () => {
            card.classList.add('preview');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('preview');
        });
    });
}

function animateForce(card) {
    const forceType = card.querySelector('h4').textContent.toLowerCase();
    const visual = card.querySelector('.force-visual');
    
    card.classList.add('animating');
    
    // Custom animations for each force type
    switch(forceType) {
        case 'compression':
            visual.style.animation = 'compress 0.5s ease-in-out 3';
            break;
        case 'tension':
            visual.style.animation = 'stretch 0.5s ease-in-out 3';
            break;
        case 'shear':
            visual.style.animation = 'shear 0.5s ease-in-out 3';
            break;
        case 'torsion':
            visual.style.animation = 'twist 0.5s ease-in-out 3';
            break;
    }
    
    setTimeout(() => {
        visual.style.animation = '';
        card.classList.remove('animating');
    }, 1500);
}

/**
 * Shape Strength Test
 */
function initShapeStrengthTest() {
    const shapesShowcase = document.querySelector('.shapes-showcase');
    if (!shapesShowcase) return;

    // Add interactive strength test
    const testSection = document.createElement('div');
    testSection.className = 'shape-strength-test';
    testSection.innerHTML = `
        <h4>🔬 Shape Strength Experiment</h4>
        <p>Click on each shape to see how it handles stress!</p>
        
        <div class="shape-test-area">
            <div class="test-shape" data-shape="square">
                <div class="shape-svg square-shape">
                    <svg viewBox="0 0 100 100">
                        <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" stroke-width="4"/>
                    </svg>
                </div>
                <span>Square</span>
            </div>
            <div class="test-shape" data-shape="triangle">
                <div class="shape-svg triangle-shape">
                    <svg viewBox="0 0 100 100">
                        <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" stroke-width="4"/>
                    </svg>
                </div>
                <span>Triangle</span>
            </div>
            <div class="test-shape" data-shape="hexagon">
                <div class="shape-svg hexagon-shape">
                    <svg viewBox="0 0 100 100">
                        <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="currentColor" stroke-width="4"/>
                    </svg>
                </div>
                <span>Hexagon</span>
            </div>
        </div>
        
        <div class="strength-result" id="strength-result">
            <p>Click a shape to test its strength!</p>
        </div>
    `;

    shapesShowcase.parentElement.appendChild(testSection);

    // Add click handlers
    const testShapes = testSection.querySelectorAll('.test-shape');
    testShapes.forEach(shape => {
        shape.addEventListener('click', () => {
            testShapeStrength(shape, testSection);
        });
    });
}

function testShapeStrength(shape, container) {
    const shapeName = shape.dataset.shape;
    const shapeEl = shape.querySelector('.shape-svg');
    const resultEl = container.querySelector('#strength-result');
    
    // Reset all shapes
    container.querySelectorAll('.test-shape').forEach(s => {
        s.classList.remove('testing', 'passed', 'failed');
    });
    
    shape.classList.add('testing');
    
    // Apply force animation
    shapeEl.style.animation = 'applyForce 1s ease-in-out forwards';
    
    setTimeout(() => {
        shapeEl.style.animation = '';
        
        const results = {
            square: {
                pass: false,
                message: '❌ The square deformed! Squares can collapse into parallelograms under pressure because their angles can change.',
                tip: 'Add diagonal braces to strengthen a square frame!'
            },
            triangle: {
                pass: true,
                message: '✅ The triangle held strong! Triangles are the strongest shape because their angles cannot change without breaking a side.',
                tip: 'This is why bridges and towers use triangular trusses!'
            },
            hexagon: {
                pass: true,
                message: '✅ The hexagon is strong! Hexagons distribute force efficiently - that\'s why bees use them for honeycombs!',
                tip: 'Hexagons use less material while being very strong.'
            }
        };

        const result = results[shapeName];
        
        shape.classList.remove('testing');
        shape.classList.add(result.pass ? 'passed' : 'failed');
        
        resultEl.innerHTML = `
            <p class="${result.pass ? 'success' : 'warning'}">${result.message}</p>
            <p class="tip">💡 <strong>Engineering Tip:</strong> ${result.tip}</p>
        `;
    }, 1000);
}

/**
 * Bridge Builder Game
 */
function initBridgeBuilderGame() {
    const structuresSection = document.querySelector('#structures');
    if (!structuresSection) return;

    const existingGame = structuresSection.querySelector('.bridge-builder');
    if (existingGame) return;

    const game = document.createElement('div');
    game.className = 'lesson-card bridge-builder';
    game.innerHTML = `
        <h3>🌉 Bridge Builder Challenge</h3>
        <p>Design a bridge to hold the maximum load! Click to place beams.</p>
        
        <div class="bridge-game">
            <div class="bridge-canvas" id="bridge-canvas">
                <div class="bridge-start">🏔️</div>
                <div class="bridge-gap">
                    <div class="water">〰️〰️〰️〰️〰️</div>
                </div>
                <div class="bridge-end">🏔️</div>
                <div class="bridge-deck" id="bridge-deck"></div>
                <div class="beams-container" id="beams-container"></div>
                <div class="test-truck" id="test-truck">🚛</div>
            </div>
            
            <div class="bridge-controls">
                <div class="beam-selector">
                    <button class="beam-btn active" data-beam="horizontal">
                        ━ Horizontal Beam
                    </button>
                    <button class="beam-btn" data-beam="diagonal-left">
                        ╲ Diagonal Left
                    </button>
                    <button class="beam-btn" data-beam="diagonal-right">
                        ╱ Diagonal Right
                    </button>
                    <button class="beam-btn" data-beam="vertical">
                        ┃ Vertical Support
                    </button>
                </div>
                
                <div class="bridge-stats">
                    <div class="stat">
                        <span class="stat-label">Beams Used</span>
                        <span class="stat-value" id="beams-used">0</span>
                        <span class="stat-max">/12</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Triangles Formed</span>
                        <span class="stat-value" id="triangles-formed">0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Strength Rating</span>
                        <span class="stat-value" id="strength-rating">⭐</span>
                    </div>
                </div>
                
                <div class="bridge-actions">
                    <button class="btn btn-primary" id="test-bridge">🚛 Test Bridge</button>
                    <button class="btn btn-secondary" id="clear-bridge">Clear</button>
                </div>
            </div>
        </div>
        
        <div class="bridge-tips">
            <h4>💡 Engineering Tips:</h4>
            <ul>
                <li>Triangles are the strongest shape - try to form them!</li>
                <li>Support beams underneath help distribute weight</li>
                <li>Diagonal beams add stability</li>
            </ul>
        </div>
    `;

    structuresSection.insertBefore(game, structuresSection.querySelector('.lesson-card.project-card'));

    initBridgeGame(game);
}

function initBridgeGame(container) {
    const canvas = container.querySelector('#bridge-canvas');
    const beamsContainer = container.querySelector('#beams-container');
    const beamBtns = container.querySelectorAll('.beam-btn');
    const testBtn = container.querySelector('#test-bridge');
    const clearBtn = container.querySelector('#clear-bridge');
    const truck = container.querySelector('#test-truck');
    
    let selectedBeam = 'horizontal';
    let beamsUsed = 0;
    const maxBeams = 12;
    let beams = [];

    // Beam selection
    beamBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            beamBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedBeam = btn.dataset.beam;
        });
    });

    // Place beams on click
    canvas.addEventListener('click', (e) => {
        if (beamsUsed >= maxBeams) {
            showNotification('Maximum beams reached!', 'warning');
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Don't place in start/end zones
        if (x < 60 || x > rect.width - 60) return;
        if (y < 20 || y > rect.height - 40) return;

        placeBeam(x, y, selectedBeam, beamsContainer);
        beamsUsed++;
        updateBridgeStats(container, beamsUsed, beams);
    });

    // Test bridge
    testBtn.addEventListener('click', () => {
        testBridge(container, beams, truck);
    });

    // Clear bridge
    clearBtn.addEventListener('click', () => {
        beamsContainer.innerHTML = '';
        beamsUsed = 0;
        beams = [];
        truck.style.left = '0';
        truck.style.opacity = '1';
        updateBridgeStats(container, beamsUsed, beams);
    });

    function placeBeam(x, y, type, container) {
        const beam = document.createElement('div');
        beam.className = `bridge-beam beam-${type}`;
        beam.style.left = `${x - 30}px`;
        beam.style.top = `${y - 3}px`;
        
        container.appendChild(beam);
        beams.push({ x, y, type, element: beam });

        // Click to remove
        beam.addEventListener('click', (e) => {
            e.stopPropagation();
            beam.remove();
            beamsUsed--;
            beams = beams.filter(b => b.element !== beam);
            updateBridgeStats(container.parentElement.parentElement, beamsUsed, beams);
        });
    }
}

function updateBridgeStats(container, beamsUsed, beams) {
    container.querySelector('#beams-used').textContent = beamsUsed;
    
    // Count triangles (simplified)
    const triangles = Math.floor(beams.filter(b => b.type.includes('diagonal')).length / 2);
    container.querySelector('#triangles-formed').textContent = triangles;
    
    // Calculate strength rating
    let strength = 1;
    strength += triangles;
    strength += beams.filter(b => b.type === 'vertical').length * 0.5;
    
    const stars = Math.min(5, Math.ceil(strength));
    container.querySelector('#strength-rating').textContent = '⭐'.repeat(stars);
}

function testBridge(container, beams, truck) {
    const triangles = Math.floor(beams.filter(b => b.type.includes('diagonal')).length / 2);
    const verticals = beams.filter(b => b.type === 'vertical').length;
    const strength = triangles * 2 + verticals + beams.length * 0.5;

    truck.style.transition = 'left 3s linear';
    truck.style.left = 'calc(100% - 80px)';

    const passThreshold = 5;

    if (strength >= passThreshold) {
        setTimeout(() => {
            showNotification('🎉 Bridge held! Great engineering!', 'success');
            awardAchievement('bridge_builder', 'Bridge Builder', 'Built a bridge that held the truck!');
        }, 3000);
    } else {
        setTimeout(() => {
            truck.style.animation = 'bridgeFall 0.5s ease-in forwards';
            showNotification('😢 Bridge collapsed! Add more triangles for strength.', 'error');
            
            setTimeout(() => {
                truck.style.animation = '';
                truck.style.left = '0';
                truck.style.opacity = '1';
            }, 2000);
        }, 1500);
    }
}

/**
 * Challenge Tracker for Paper Tower
 */
function initChallengeTracker() {
    const challengeCard = document.querySelector('.project-card');
    if (!challengeCard) return;

    const existingTracker = challengeCard.querySelector('.challenge-tracker');
    if (existingTracker) return;

    const tracker = document.createElement('div');
    tracker.className = 'challenge-tracker';
    tracker.innerHTML = `
        <h4>📊 Track Your Challenge</h4>
        <div class="tracker-form">
            <div class="input-group">
                <label for="tower-height">Tower Height (cm)</label>
                <input type="number" id="tower-height" placeholder="Enter height..." min="0">
            </div>
            <div class="input-group">
                <label for="hold-time">Time Book Was Held (seconds)</label>
                <input type="number" id="hold-time" placeholder="Enter time..." min="0">
            </div>
            <div class="input-group">
                <label for="notes">What worked well?</label>
                <textarea id="notes" placeholder="What techniques did you use?"></textarea>
            </div>
            <button class="btn btn-primary save-attempt-btn">Save Attempt</button>
        </div>
        
        <div class="attempts-list" id="attempts-list">
            <h5>Your Attempts</h5>
            <div class="attempts-container"></div>
        </div>
    `;

    challengeCard.appendChild(tracker);

    // Load saved attempts
    loadAttempts(tracker);

    // Save attempt
    tracker.querySelector('.save-attempt-btn').addEventListener('click', () => {
        const height = document.getElementById('tower-height').value;
        const time = document.getElementById('hold-time').value;
        const notes = document.getElementById('notes').value;

        if (!height || !time) {
            showNotification('Please enter height and time!', 'warning');
            return;
        }

        const attempt = {
            id: Date.now(),
            height: parseInt(height),
            time: parseInt(time),
            notes,
            date: new Date().toLocaleDateString()
        };

        saveAttempt(attempt);
        loadAttempts(tracker);

        // Clear form
        document.getElementById('tower-height').value = '';
        document.getElementById('hold-time').value = '';
        document.getElementById('notes').value = '';

        showNotification('Attempt saved! Keep improving! 🏗️', 'success');

        if (attempt.time >= 10) {
            awardAchievement('tower_master', 'Tower Master', 'Built a tower that held for 10+ seconds!');
        }
    });
}

function saveAttempt(attempt) {
    const attempts = JSON.parse(localStorage.getItem('tower_attempts') || '[]');
    attempts.push(attempt);
    localStorage.setItem('tower_attempts', JSON.stringify(attempts));
}

function loadAttempts(tracker) {
    const attempts = JSON.parse(localStorage.getItem('tower_attempts') || '[]');
    const container = tracker.querySelector('.attempts-container');
    
    if (attempts.length === 0) {
        container.innerHTML = '<p class="no-attempts">No attempts yet. Build your tower and record your results!</p>';
        return;
    }

    const sortedAttempts = attempts.sort((a, b) => b.height - a.height);
    const best = sortedAttempts[0];

    container.innerHTML = `
        <div class="best-attempt">
            <span class="best-label">🏆 Personal Best:</span>
            <span class="best-value">${best.height}cm for ${best.time}s</span>
        </div>
        <div class="attempts-scroll">
            ${sortedAttempts.slice(0, 5).map((a, i) => `
                <div class="attempt-item ${i === 0 ? 'best' : ''}">
                    <span class="attempt-rank">${i + 1}</span>
                    <span class="attempt-stats">${a.height}cm / ${a.time}s</span>
                    <span class="attempt-date">${a.date}</span>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Achievement System
 */
function initAchievementSystem() {
    // Create achievements display
    const main = document.querySelector('.main-content .container');
    if (!main) return;

    const achievementsBar = document.createElement('div');
    achievementsBar.className = 'achievements-bar';
    achievementsBar.innerHTML = `
        <button class="achievements-toggle" aria-label="Toggle achievements">
            🏆 <span class="achievement-count">0</span>
        </button>
        <div class="achievements-panel">
            <h4>Your Engineering Achievements</h4>
            <div class="achievements-grid" id="achievements-grid"></div>
        </div>
    `;

    main.insertBefore(achievementsBar, main.firstChild);

    // Toggle panel
    const toggle = achievementsBar.querySelector('.achievements-toggle');
    const panel = achievementsBar.querySelector('.achievements-panel');
    
    toggle.addEventListener('click', () => {
        panel.classList.toggle('active');
    });

    // Load achievements
    loadAchievements();
}

function loadAchievements() {
    const achievements = JSON.parse(localStorage.getItem('engineering_achievements') || '[]');
    const grid = document.getElementById('achievements-grid');
    const count = document.querySelector('.achievement-count');
    
    if (!grid) return;

    const allAchievements = [
        { id: 'curious_engineer', name: 'Curious Engineer', icon: '🔍', desc: 'Explored all design process steps' },
        { id: 'design_master', name: 'Design Master', icon: '📝', desc: 'Completed a design project plan' },
        { id: 'machine_master', name: 'Machine Master', icon: '⚙️', desc: 'Matched all simple machines' },
        { id: 'bridge_builder', name: 'Bridge Builder', icon: '🌉', desc: 'Built a successful bridge' },
        { id: 'tower_master', name: 'Tower Master', icon: '🗼', desc: 'Built a tower that held for 10+ seconds' }
    ];

    grid.innerHTML = allAchievements.map(a => {
        const earned = achievements.find(ea => ea.id === a.id);
        return `
            <div class="achievement ${earned ? 'earned' : 'locked'}">
                <span class="achievement-icon">${earned ? a.icon : '🔒'}</span>
                <span class="achievement-name">${a.name}</span>
                <span class="achievement-desc">${a.desc}</span>
                ${earned ? `<span class="earned-date">${earned.date}</span>` : ''}
            </div>
        `;
    }).join('');

    count.textContent = achievements.length;
}

function awardAchievement(id, name, description) {
    const achievements = JSON.parse(localStorage.getItem('engineering_achievements') || '[]');
    
    if (achievements.find(a => a.id === id)) return; // Already earned

    achievements.push({
        id,
        name,
        description,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem('engineering_achievements', JSON.stringify(achievements));
    loadAchievements();
    
    showAchievementNotification(name);
}

function showAchievementNotification(name) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-popup">
            <span class="achievement-trophy">🏆</span>
            <div class="achievement-text">
                <span class="achievement-label">Achievement Unlocked!</span>
                <span class="achievement-title">${name}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function checkAchievement(id, stepIndex) {
    // Track explored steps
    const explored = JSON.parse(localStorage.getItem('explored_steps') || '[]');
    
    if (!explored.includes(stepIndex)) {
        explored.push(stepIndex);
        localStorage.setItem('explored_steps', JSON.stringify(explored));
    }

    if (explored.length >= 7) {
        awardAchievement('curious_engineer', 'Curious Engineer', 'Explored all design process steps');
    }
}

/**
 * Quizzes
 */
function initQuizzes() {
    // Add quiz to each section
    addQuizToSection('design', designQuizQuestions);
    addQuizToSection('machines', machinesQuizQuestions);
    addQuizToSection('structures', structuresQuizQuestions);
}

const designQuizQuestions = [
    {
        question: 'What is the first step in the engineering design process?',
        options: ['Build a prototype', 'Identify the problem', 'Test your solution', 'Brainstorm ideas'],
        correct: 1,
        explanation: 'Engineers always start by clearly defining the problem they want to solve!'
    },
    {
        question: 'Why is testing important in the design process?',
        options: ['It\'s not important', 'To find what works and what doesn\'t', 'To skip straight to the final product', 'Just for fun'],
        correct: 1,
        explanation: 'Testing helps engineers find problems and improve their designs before final production.'
    }
];

const machinesQuizQuestions = [
    {
        question: 'Which simple machine is a ramp?',
        options: ['Lever', 'Pulley', 'Inclined Plane', 'Wedge'],
        correct: 2,
        explanation: 'An inclined plane is a flat surface set at an angle - just like a ramp!'
    },
    {
        question: 'If a machine has a mechanical advantage of 3, what does this mean?',
        options: ['It requires 3x more effort', 'It multiplies your force by 3', 'It has 3 parts', 'It moves 3 times slower'],
        correct: 1,
        explanation: 'A MA of 3 means the machine multiplies your input force by 3!'
    }
];

const structuresQuizQuestions = [
    {
        question: 'What is the strongest shape in engineering?',
        options: ['Square', 'Circle', 'Triangle', 'Rectangle'],
        correct: 2,
        explanation: 'Triangles cannot be deformed without breaking a side, making them the strongest shape!'
    },
    {
        question: 'Compression is a force that:',
        options: ['Pulls things apart', 'Pushes things together', 'Twists things', 'Slides things'],
        correct: 1,
        explanation: 'Compression is a pushing force that squeezes objects together.'
    }
];

function addQuizToSection(sectionId, questions) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const quizCard = document.createElement('div');
    quizCard.className = 'quiz-card';
    quizCard.innerHTML = `
        <h3>📝 Quick Quiz</h3>
        <div class="quiz-container" data-current="0"></div>
    `;

    section.appendChild(quizCard);

    const container = quizCard.querySelector('.quiz-container');
    renderQuizQuestion(container, questions, 0);
}

function renderQuizQuestion(container, questions, index) {
    const question = questions[index];
    
    container.innerHTML = `
        <div class="quiz-question">
            <p class="question-number">Question ${index + 1} of ${questions.length}</p>
            <p class="question-text">${question.question}</p>
            <div class="quiz-options">
                ${question.options.map((opt, i) => `
                    <label class="quiz-option">
                        <input type="radio" name="quiz-${index}" value="${i}">
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
            <button class="btn btn-primary check-answer" disabled>Check Answer</button>
            <div class="quiz-feedback"></div>
        </div>
    `;

    const options = container.querySelectorAll('input[type="radio"]');
    const checkBtn = container.querySelector('.check-answer');
    const feedback = container.querySelector('.quiz-feedback');

    options.forEach(opt => {
        opt.addEventListener('change', () => {
            checkBtn.disabled = false;
        });
    });

    checkBtn.addEventListener('click', () => {
        const selected = container.querySelector('input:checked');
        if (!selected) return;

        const selectedValue = parseInt(selected.value);
        const isCorrect = selectedValue === question.correct;

        // Disable options
        options.forEach(opt => opt.disabled = true);
        checkBtn.disabled = true;

        // Show feedback
        const label = selected.closest('.quiz-option');
        label.classList.add(isCorrect ? 'correct' : 'incorrect');

        if (!isCorrect) {
            options[question.correct].closest('.quiz-option').classList.add('correct');
        }

        feedback.innerHTML = `
            <p class="${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? '✅ Correct!' : '❌ Not quite!'}
            </p>
            <p class="explanation">${question.explanation}</p>
            ${index < questions.length - 1 ? '<button class="btn btn-secondary next-question">Next Question →</button>' : '<p class="quiz-complete">🎉 Quiz Complete!</p>'}
        `;

        const nextBtn = feedback.querySelector('.next-question');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                renderQuizQuestion(container, questions, index + 1);
            });
        }
    });
}

/**
 * Utility Functions
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function trackProgress(type, value) {
    const progress = JSON.parse(localStorage.getItem('engineering_progress') || '{}');
    
    if (!progress[type]) {
        progress[type] = [];
    }
    
    if (!progress[type].includes(value)) {
        progress[type].push(value);
    }
    
    localStorage.setItem('engineering_progress', JSON.stringify(progress));
}
