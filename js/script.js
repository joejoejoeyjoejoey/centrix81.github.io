// =========================================
// STEM Learning Hub - Main JavaScript
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initTopicTabs();
    initFactsCarousel();
    initQuizzes();
    initPracticeProblems();
    initBinaryConverter();
    initMeanCalculator();
});

// =========================================
// Mobile Navigation
// =========================================
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.classList.toggle('active');
            });
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// =========================================
// Topic Tabs Navigation
// =========================================
function initTopicTabs() {
    const topicButtons = document.querySelectorAll('.topic-btn');
    const topicSections = document.querySelectorAll('.topic-section');
    
    if (topicButtons.length > 0 && topicSections.length > 0) {
        topicButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTopic = this.getAttribute('data-topic');
                
                // Remove active class from all buttons and sections
                topicButtons.forEach(btn => btn.classList.remove('active'));
                topicSections.forEach(section => section.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show corresponding section
                const targetSection = document.getElementById(targetTopic);
                if (targetSection) {
                    targetSection.classList.add('active');
                    
                    // Scroll to top of content smoothly
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

// =========================================
// Facts Carousel
// =========================================
function initFactsCarousel() {
    const factCards = document.querySelectorAll('.fact-card');
    const dots = document.querySelectorAll('.fact-dots .dot');
    let currentIndex = 0;
    let autoPlayInterval;
    
    if (factCards.length === 0) return;
    
    function showFact(index) {
        // Hide all facts
        factCards.forEach(card => {
            card.classList.remove('active');
            card.style.opacity = '0';
            card.style.transform = 'translateX(50px)';
        });
        
        // Remove active from all dots
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current fact
        factCards[index].classList.add('active');
        setTimeout(() => {
            factCards[index].style.opacity = '1';
            factCards[index].style.transform = 'translateX(0)';
        }, 50);
        
        // Activate current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    function nextFact() {
        currentIndex = (currentIndex + 1) % factCards.length;
        showFact(currentIndex);
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextFact, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Initialize
    showFact(0);
    startAutoPlay();
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopAutoPlay();
            currentIndex = index;
            showFact(currentIndex);
            startAutoPlay();
        });
    });
    
    // Pause on hover
    const carousel = document.querySelector('.facts-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
}

// =========================================
// Quiz Functionality
// =========================================
function initQuizzes() {
    const checkButtons = document.querySelectorAll('.check-answer');
    
    checkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const correctAnswer = this.getAttribute('data-correct');
            const quizQuestion = this.closest('.quiz-question');
            const selectedOption = quizQuestion.querySelector('input[type="radio"]:checked');
            const feedback = quizQuestion.querySelector('.quiz-feedback');
            
            if (!selectedOption) {
                feedback.textContent = '⚠️ Please select an answer first!';
                feedback.className = 'quiz-feedback';
                return;
            }
            
            const userAnswer = selectedOption.value;
            
            if (userAnswer === correctAnswer) {
                feedback.textContent = '🎉 Correct! Great job!';
                feedback.className = 'quiz-feedback correct';
                
                // Add celebration effect
                createConfetti(button);
            } else {
                feedback.textContent = `❌ Not quite. The correct answer is ${correctAnswer}. Try to understand why!`;
                feedback.className = 'quiz-feedback incorrect';
            }
            
            // Disable further attempts
            const options = quizQuestion.querySelectorAll('input[type="radio"]');
            options.forEach(option => {
                option.disabled = true;
            });
            
            // Change button text
            this.textContent = 'Answered';
            this.disabled = true;
        });
    });
}

// =========================================
// Practice Problems
// =========================================
function initPracticeProblems() {
    const checkButtons = document.querySelectorAll('.check-practice');
    
    checkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const feedback = this.closest('.practice-problem').querySelector('.practice-feedback');
            const correctAnswer = parseFloat(input.getAttribute('data-answer'));
            const userAnswer = parseFloat(input.value);
            
            if (isNaN(userAnswer)) {
                feedback.textContent = '⚠️ Please enter a number!';
                feedback.className = 'practice-feedback';
                return;
            }
            
            if (Math.abs(userAnswer - correctAnswer) < 0.01) {
                feedback.textContent = '✅ Correct! Well done!';
                feedback.className = 'practice-feedback correct';
                input.style.borderColor = '#10b981';
                createConfetti(button);
            } else {
                feedback.textContent = `❌ Not quite. The correct answer is ${correctAnswer}. Try again!`;
                feedback.className = 'practice-feedback incorrect';
                input.style.borderColor = '#ef4444';
            }
        });
        
        // Allow Enter key to submit
        const input = button.previousElementSibling;
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    button.click();
                }
            });
        }
    });
}

// =========================================
// Binary Converter
// =========================================
function initBinaryConverter() {
    const convertBtn = document.getElementById('convert-btn');
    const decimalInput = document.getElementById('decimal-input');
    const binaryOutput = document.getElementById('binary-output');
    
    if (!convertBtn || !decimalInput || !binaryOutput) return;
    
    function decimalToBinary(decimal) {
        if (decimal === 0) return '00000000';
        
        let binary = '';
        let num = decimal;
        
        while (num > 0) {
            binary = (num % 2) + binary;
            num = Math.floor(num / 2);
        }
        
        // Pad to 8 bits
        while (binary.length < 8) {
            binary = '0' + binary;
        }
        
        return binary;
    }
    
    convertBtn.addEventListener('click', function() {
        const decimal = parseInt(decimalInput.value);
        
        if (isNaN(decimal) || decimal < 0 || decimal > 255) {
            binaryOutput.textContent = 'Enter 0-255';
            binaryOutput.style.color = '#ef4444';
            return;
        }
        
        const binary = decimalToBinary(decimal);
        binaryOutput.textContent = binary;
        binaryOutput.style.color = '#4361ee';
        
        // Add animation
        binaryOutput.style.transform = 'scale(1.1)';
        setTimeout(() => {
            binaryOutput.style.transform = 'scale(1)';
        }, 200);
    });
    
    // Allow Enter key
    decimalInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertBtn.click();
        }
    });
}

// =========================================
// Mean, Median, Mode Calculator
// =========================================
function initMeanCalculator() {
    const calculateBtn = document.getElementById('calculate-mean');
    const numbersInput = document.getElementById('numbers-input');
    const meanResult = document.getElementById('mean-result');
    const medianResult = document.getElementById('median-result');
    const modeResult = document.getElementById('mode-result');
    
    if (!calculateBtn || !numbersInput) return;
    
    function calculateMean(numbers) {
        const sum = numbers.reduce((a, b) => a + b, 0);
        return (sum / numbers.length).toFixed(2);
    }
    
    function calculateMedian(numbers) {
        const sorted = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
        }
        return sorted[mid].toFixed(2);
    }
    
    function calculateMode(numbers) {
        const frequency = {};
        let maxFreq = 0;
        let modes = [];
        
        numbers.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1;
            if (frequency[num] > maxFreq) {
                maxFreq = frequency[num];
            }
        });
        
        for (let num in frequency) {
            if (frequency[num] === maxFreq) {
                modes.push(parseFloat(num));
            }
        }
        
        if (modes.length === numbers.length) {
            return 'No mode';
        }
        
        return modes.join(', ');
    }
    
    calculateBtn.addEventListener('click', function() {
        const input = numbersInput.value.trim();
        
        if (!input) {
            meanResult.textContent = '-';
            medianResult.textContent = '-';
            modeResult.textContent = '-';
            return;
        }
        
        // Parse numbers from input
        const numbers = input
            .split(',')
            .map(s => parseFloat(s.trim()))
            .filter(n => !isNaN(n));
        
        if (numbers.length === 0) {
            meanResult.textContent = 'Invalid';
            medianResult.textContent = 'Invalid';
            modeResult.textContent = 'Invalid';
            return;
        }
        
        // Calculate and display results
        meanResult.textContent = calculateMean(numbers);
        medianResult.textContent = calculateMedian(numbers);
        modeResult.textContent = calculateMode(numbers);
        
        // Add animation to results
        [meanResult, medianResult, modeResult].forEach(el => {
            el.style.transform = 'scale(1.1)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // Allow Enter key
    numbersInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });
}

// =========================================
// Confetti Celebration Effect
// =========================================
function createConfetti(element) {
    const colors = ['#4361ee', '#7209b7', '#10b981', '#f59e0b', '#ef4444'];
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top}px;
            pointer-events: none;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 9999;
        `;
        
        document.body.appendChild(confetti);
        
        const angle = (Math.random() * Math.PI * 2);
        const velocity = 5 + Math.random() * 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 10;
        
        let x = 0;
        let y = 0;
        let gravity = 0.5;
        let opacity = 1;
        
        function animate() {
            x += vx;
            y += vy + gravity;
            gravity += 0.1;
            opacity -= 0.02;
            
            confetti.style.transform = `translate(${x}px, ${y}px) rotate(${x * 5}deg)`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        }
        
        requestAnimationFrame(animate);
    }
}

// =========================================
// Smooth Scroll for Anchor Links
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =========================================
// Intersection Observer for Animations
// =========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.lesson-card, .about-card, .subject-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
}

// Initialize scroll animations after DOM is ready
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// =========================================
// Keyboard Accessibility
// =========================================
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
});

// =========================================
// Dark Mode Toggle (Optional Feature)
// =========================================
function initDarkMode() {
    // Check for saved preference or system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
    }
}

// Uncomment to enable dark mode
// initDarkMode();

// =========================================
// Print Functionality
// =========================================
function printLesson() {
    window.print();
}

// =========================================
// Copy Code Blocks
// =========================================
document.querySelectorAll('.code-block').forEach(block => {
    block.addEventListener('click', function() {
        const code = this.textContent;
        navigator.clipboard.writeText(code).then(() => {
            // Show copied notification
            const notification = document.createElement('div');
            notification.textContent = 'Code copied!';
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                z-index: 9999;
                animation: fadeIn 0.3s ease;
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        });
    });
    
    // Add cursor pointer
    block.style.cursor = 'pointer';
    block.title = 'Click to copy';
});

// =========================================
// Progress Tracking (Local Storage)
// =========================================
const progressTracker = {
    save(page, topic) {
        const progress = this.get();
        if (!progress[page]) {
            progress[page] = [];
        }
        if (!progress[page].includes(topic)) {
            progress[page].push(topic);
        }
        localStorage.setItem('stemProgress', JSON.stringify(progress));
    },
    
    get() {
        const saved = localStorage.getItem('stemProgress');
        return saved ? JSON.parse(saved) : {};
    },
    
    getCompletion() {
        const progress = this.get();
        const totalTopics = 12; // 3 topics per subject × 4 subjects
        let completed = 0;
        
        Object.values(progress).forEach(topics => {
            completed += topics.length;
        });
        
        return Math.round((completed / totalTopics) * 100);
    }
};

// Track when user views a topic
document.querySelectorAll('.topic-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const topic = this.getAttribute('data-topic');
        const page = window.location.pathname.split('/').pop().replace('.html', '');
        progressTracker.save(page, topic);
    });
});

// =========================================
// Tooltip Helper
// =========================================
function createTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #1f2937;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
        white-space: nowrap;
    `;
    
    element.style.position = 'relative';
    element.appendChild(tooltip);
    
    element.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
    });
    
    element.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });
}

// =========================================
// Form Validation Helper
// =========================================
function validateInput(input, rules) {
    const value = input.value.trim();
    const errors = [];
    
    if (rules.required && !value) {
        errors.push('This field is required');
    }
    
    if (rules.min !== undefined && parseFloat(value) < rules.min) {
        errors.push(`Value must be at least ${rules.min}`);
    }
    
    if (rules.max !== undefined && parseFloat(value) > rules.max) {
        errors.push(`Value must be at most ${rules.max}`);
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
        errors.push('Invalid format');
    }
    
    return errors;
}

// =========================================
// Utility Functions
// =========================================
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Format numbers with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Generate random color
    randomColor() {
        const colors = ['#4361ee', '#7209b7', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    // Shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};

// =========================================
// Console Welcome Message
// =========================================
console.log(`
%c🔬 STEM Learning Hub %c
Welcome to the source code!
If you're curious about how this works, you're already thinking like a programmer! 🎉

Learn more about web development:
- HTML: Structure of web pages
- CSS: Styling and design
- JavaScript: Interactivity

Keep learning and stay curious! 🚀
`, 
'color: #4361ee; font-size: 24px; font-weight: bold;',
'color: #666; font-size: 14px;'
);
