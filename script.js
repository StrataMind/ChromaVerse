class ChromaVerseGame {
    constructor() {
        this.score = 0;
        this.streak = 0;
        this.bestScore = parseInt(localStorage.getItem('chromaVerseBest')) || 0;
        this.level = 1;
        this.timeLeft = 30;
        this.gameActive = true;
        this.currentMode = 'rgb';
        this.difficulty = 'easy';
        this.correctColor = null;
        this.timer = null;
        this.isPaused = false;
        this.hintsUsed = 0;
        this.soundEnabled = true;
        this.animationsEnabled = true;
        this.achievements = JSON.parse(localStorage.getItem('chromaVerseAchievements') || '[]');
        this.powerUps = { timeBonus: 0, doubleScore: 0, easyMode: 0 };
        this.lastAnswerTime = Date.now();
        this.quickAnswerBonus = 0;
        this.gameStats = { totalGames: 0, totalAnswers: 0, correctAnswers: 0 };
        
        this.initializeElements();
        this.attachEventListeners();
        this.createParticles();
        this.updateDisplay();
        this.generateNewQuestion();
        this.startTimer();
    }

    initializeElements() {
        this.scoreElement = document.getElementById('score');
        this.streakElement = document.getElementById('streak');
        this.bestElement = document.getElementById('best');
        this.levelElement = document.getElementById('level');
        this.timerElement = document.getElementById('timer');
        this.colorDisplay = document.getElementById('colorDisplay');
        this.colorValue = document.getElementById('colorValue');
        this.colorHint = document.getElementById('colorHint');
        this.optionsGrid = document.getElementById('optionsGrid');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.feedback = document.getElementById('feedback');
        this.comboIndicator = document.getElementById('comboIndicator');
        this.achievementPopup = document.getElementById('achievementPopup');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.closeSettings = document.getElementById('closeSettings');
        this.soundToggle = document.getElementById('soundToggle');
        this.animToggle = document.getElementById('animToggle');
        this.progressRing = document.querySelector('.progress-ring-circle');
    }

    attachEventListeners() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentMode = e.target.dataset.mode;
                this.generateNewQuestion();
            });
        });

        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.difficulty = e.target.dataset.difficulty;
                this.generateNewQuestion();
            });
        });

        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.hintBtn.addEventListener('click', () => this.useHint());
        this.settingsBtn.addEventListener('click', () => this.toggleSettings());
        this.closeSettings.addEventListener('click', () => this.toggleSettings());
        
        this.soundToggle.addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
            localStorage.setItem('chromaVerseSoundEnabled', this.soundEnabled);
        });
        
        this.animToggle.addEventListener('change', (e) => {
            this.animationsEnabled = e.target.checked;
            localStorage.setItem('chromaVerseAnimationsEnabled', this.animationsEnabled);
            document.body.style.setProperty('--animation-duration', this.animationsEnabled ? '0.3s' : '0s');
        });

        // Load settings
        this.soundEnabled = localStorage.getItem('chromaVerseSoundEnabled') !== 'false';
        this.animationsEnabled = localStorage.getItem('chromaVerseAnimationsEnabled') !== 'false';
        this.soundToggle.checked = this.soundEnabled;
        this.animToggle.checked = this.animationsEnabled;
    }

    createParticles() {
        const particlesContainer = document.querySelector('.particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s infinite linear;
            `;
            particlesContainer.appendChild(particle);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    generateRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return { r, g, b };
    }

    colorToString(color, mode) {
        switch (mode) {
            case 'rgb':
                return `rgb(${color.r}, ${color.g}, ${color.b})`;
            case 'hex':
                return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`.toUpperCase();
            case 'hsl':
                const hsl = this.rgbToHsl(color.r, color.g, color.b);
                return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
            default:
                return `rgb(${color.r}, ${color.g}, ${color.b})`;
        }
    }

    rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    generateSimilarColor(baseColor, variance) {
        const r = Math.max(0, Math.min(255, baseColor.r + (Math.random() - 0.5) * variance));
        const g = Math.max(0, Math.min(255, baseColor.g + (Math.random() - 0.5) * variance));
        const b = Math.max(0, Math.min(255, baseColor.b + (Math.random() - 0.5) * variance));
        return { r: Math.floor(r), g: Math.floor(g), b: Math.floor(b) };
    }

    getVarianceByDifficulty() {
        const base = { easy: 80, medium: 50, hard: 25 }[this.difficulty];
        return Math.max(15, base - this.level * 2);
    }

    getOptionsCount() {
        const base = { easy: 4, medium: 6, hard: 9 }[this.difficulty];
        return Math.min(12, base + Math.floor(this.level / 3));
    }

    generateNewQuestion() {
        // Don't generate new questions if game is not active
        if (!this.gameActive || this.timeLeft <= 0) {
            return;
        }

        this.correctColor = this.generateRandomColor();
        const variance = this.getVarianceByDifficulty();
        const optionsCount = this.getOptionsCount();

        const options = [this.correctColor];
        for (let i = 1; i < optionsCount; i++) {
            options.push(this.generateSimilarColor(this.correctColor, variance));
        }

        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        // Smooth color transition
        this.colorDisplay.style.transition = 'background-color 0.5s ease';
        this.colorDisplay.style.backgroundColor = `rgb(${this.correctColor.r}, ${this.correctColor.g}, ${this.correctColor.b})`;
        this.colorValue.textContent = this.colorToString(this.correctColor, this.currentMode);

        if (this.animationsEnabled) {
            this.colorDisplay.classList.add('animate');
            setTimeout(() => this.colorDisplay.classList.remove('animate'), 600);
        }

        // Use requestAnimationFrame for smoother rendering
        requestAnimationFrame(() => {
            this.optionsGrid.innerHTML = '';
            options.forEach((color, index) => {
                setTimeout(() => {
                    // Check again if game is still active before creating buttons
                    if (!this.gameActive || this.timeLeft <= 0) {
                        return;
                    }

                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    btn.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
                    btn.style.opacity = '0';
                    btn.style.transform = 'scale(0.8)';
                    btn.addEventListener('click', () => this.checkAnswer(color));
                    this.optionsGrid.appendChild(btn);

                    // Animate in
                    requestAnimationFrame(() => {
                        btn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        btn.style.opacity = '1';
                        btn.style.transform = 'scale(1)';
                    });
                }, index * 50);
            });
        });

        this.updateHint();
        this.hideFeedback();
        this.lastAnswerTime = Date.now();
    }

    checkAnswer(selectedColor) {
        // Don't process answers if game is not active
        if (!this.gameActive || this.timeLeft <= 0) {
            return;
        }

        const isCorrect = selectedColor.r === this.correctColor.r &&
                        selectedColor.g === this.correctColor.g &&
                        selectedColor.b === this.correctColor.b;

        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.style.pointerEvents = 'none'; // Disable further clicks
            const btnColor = btn.style.backgroundColor;
            const correctColorStr = `rgb(${this.correctColor.r}, ${this.correctColor.g}, ${this.correctColor.b})`;

            if (btnColor === correctColorStr) {
                btn.classList.add('correct');
            } else if (btnColor === `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})` && !isCorrect) {
                btn.classList.add('wrong');
            }
        });

        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }

        this.updateDisplay();

        // Only generate new question if game is still active
        if (this.gameActive && this.timeLeft > 0) {
            setTimeout(() => {
                if (this.gameActive && this.timeLeft > 0) {
                    this.generateNewQuestion();
                }
            }, 1500);
        }
    }

    handleCorrectAnswer() {
        const basePoints = this.getPointsByDifficulty();
        let points = basePoints;

        // Quick answer bonus
        const answerTime = Date.now() - this.lastAnswerTime;
        if (answerTime < 3000) {
            const quickBonus = Math.floor((3000 - answerTime) / 100);
            points += quickBonus;
            this.quickAnswerBonus = quickBonus;
        }

        // Double score power-up
        if (this.powerUps.doubleScore > 0) {
            points *= 2;
            this.powerUps.doubleScore--;
        }

        this.score += points;
        this.streak++;
        this.gameStats.correctAnswers++;
        this.gameStats.totalAnswers++;

        if (this.streak > 0 && this.streak % 5 === 0) {
            this.level++;
            this.showAchievement('🎉', `Level ${this.level} Unlocked!`);
            this.grantRandomPowerUp();
        }

        let feedbackText = `Perfect! +${points} points`;
        if (this.quickAnswerBonus > 0) {
            feedbackText += ` (Quick +${this.quickAnswerBonus}!)`;
            this.quickAnswerBonus = 0;
        }

        this.showFeedback(feedbackText, 'success');

        if (this.streak >= 3) {
            this.showCombo(`${this.streak}x Combo!`);
        }

        this.checkAchievements();
        this.playSound('correct');
    }

    handleWrongAnswer() {
        this.streak = 0;
        this.gameStats.totalAnswers++;

        // Calculate accuracy
        const accuracy = Math.round((this.gameStats.correctAnswers / this.gameStats.totalAnswers) * 100);

        this.showFeedback(`Not quite right! Accuracy: ${accuracy}%`, 'error');
        this.playSound('wrong');
    }

    getPointsByDifficulty() {
        const base = { easy: 10, medium: 20, hard: 30 }[this.difficulty];
        const levelBonus = this.level * 2;
        const streakBonus = Math.floor(this.streak / 3) * 5;
        return base + levelBonus + streakBonus;
    }

    useHint() {
        if (this.hintsUsed >= 3) {
            this.showFeedback('No more hints available!', 'error');
            return;
        }

        this.hintsUsed++;
        const buttons = document.querySelectorAll('.option-btn');
        const correctColorStr = `rgb(${this.correctColor.r}, ${this.correctColor.g}, ${this.correctColor.b})`;
        
        let wrongButtons = Array.from(buttons).filter(btn => 
            btn.style.backgroundColor !== correctColorStr
        );
        
        // Remove half of wrong options
        const toRemove = Math.floor(wrongButtons.length / 2);
        for (let i = 0; i < toRemove; i++) {
            const randomIndex = Math.floor(Math.random() * wrongButtons.length);
            wrongButtons[randomIndex].style.opacity = '0.3';
            wrongButtons[randomIndex].style.pointerEvents = 'none';
            wrongButtons.splice(randomIndex, 1);
        }

        this.showFeedback(`Hint used! ${3 - this.hintsUsed} hints remaining`, 'success');
        this.playSound('hint');
    }

    showFeedback(message, type) {
        this.feedback.textContent = message;
        this.feedback.className = `feedback ${type} show`;
    }

    hideFeedback() {
        this.feedback.classList.remove('show');
    }

    showCombo(message) {
        this.comboIndicator.textContent = message;
        this.comboIndicator.classList.add('show');
        setTimeout(() => this.comboIndicator.classList.remove('show'), 2000);
    }

    showAchievement(icon, text) {
        const popup = this.achievementPopup;
        popup.querySelector('.achievement-icon').textContent = icon;
        popup.querySelector('.achievement-text').textContent = text;
        popup.classList.add('show');
        
        setTimeout(() => popup.classList.remove('show'), 3000);
        this.playSound('achievement');
    }

    updateHint() {
        const hints = {
            easy: 'Look for similar brightness',
            medium: 'Focus on color temperature',
            hard: 'Notice subtle hue differences'
        };
        this.colorHint.textContent = hints[this.difficulty];
    }

    checkAchievements() {
        const newAchievements = [];
        
        if (this.score >= 1000 && !this.achievements.includes('score_1000')) {
            newAchievements.push('score_1000');
            this.showAchievement('🏆', 'Score Master: 1000 points!');
        }
        
        if (this.streak >= 10 && !this.achievements.includes('streak_10')) {
            newAchievements.push('streak_10');
            this.showAchievement('🔥', 'Hot Streak: 10 in a row!');
        }

        if (newAchievements.length > 0) {
            this.achievements.push(...newAchievements);
            localStorage.setItem('chromaVerseAchievements', JSON.stringify(this.achievements));
        }
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        try {
            const frequencies = {
                correct: [523.25, 659.25, 783.99],
                wrong: [220, 196],
                hint: [440],
                achievement: [523.25, 659.25, 783.99, 1046.50]
            };

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            frequencies[type].forEach((freq, i) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime + i * 0.1);
                oscillator.stop(audioContext.currentTime + 0.3 + i * 0.1);
            });
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    startNewGame() {
        this.score = 0;
        this.streak = 0;
        this.level = 1;
        this.timeLeft = 30;
        this.hintsUsed = 0;
        this.gameActive = true;
        this.isPaused = false;
        this.powerUps = { timeBonus: 0, doubleScore: 0, easyMode: 0 };
        this.quickAnswerBonus = 0;

        // Remove game-over class
        document.body.classList.remove('game-over');

        // Re-enable all buttons
        document.querySelectorAll('.option-btn, .mode-btn, .difficulty-btn').forEach(btn => {
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        });

        this.updateDisplay();
        this.generateNewQuestion();
        this.startTimer();
        this.newGameBtn.querySelector('.btn-text').textContent = 'Restart';
        this.pauseBtn.style.display = 'flex';
        this.hintBtn.style.display = 'flex';
    }

    startTimer() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            if (!this.isPaused && this.gameActive) {
                this.timeLeft--;
                this.updateTimerDisplay();

                if (this.timeLeft <= 0) {
                    clearInterval(this.timer);
                    this.timeLeft = 0;
                    this.endGame();
                }
            }
        }, 1000);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const btnText = this.pauseBtn.querySelector('.btn-text');
        const btnIcon = this.pauseBtn.querySelector('.btn-icon');
        
        if (this.isPaused) {
            btnText.textContent = 'Resume';
            btnIcon.textContent = '▶️';
        } else {
            btnText.textContent = 'Pause';
            btnIcon.textContent = '⏸️';
        }
    }

    toggleSettings() {
        this.settingsPanel.classList.toggle('open');
    }

    endGame() {
        this.gameActive = false;
        clearInterval(this.timer);

        // Add game-over class for visual styling
        document.body.classList.add('game-over');

        // Disable all option buttons
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.style.pointerEvents = 'none';
        });

        // Disable game mode and difficulty buttons
        document.querySelectorAll('.mode-btn, .difficulty-btn').forEach(btn => {
            btn.style.pointerEvents = 'none';
        });

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('chromaVerseBest', this.bestScore);
            this.showAchievement('👑', `New Best Score: ${this.score}!`);
        }

        const accuracy = this.gameStats.totalAnswers > 0
            ? Math.round((this.gameStats.correctAnswers / this.gameStats.totalAnswers) * 100)
            : 0;

        this.showFeedback(`Game Over! Score: ${this.score} | Accuracy: ${accuracy}%`, 'error');
        this.updateDisplay();
        this.newGameBtn.querySelector('.btn-text').textContent = 'New Game';
        this.pauseBtn.style.display = 'none';
        this.hintBtn.style.display = 'none';

        // Update game statistics
        this.gameStats.totalGames++;
        localStorage.setItem('chromaVerseGameStats', JSON.stringify(this.gameStats));
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.streakElement.textContent = this.streak;
        this.bestElement.textContent = this.bestScore;
        this.levelElement.textContent = this.level;
        
        // Update progress bars
        const maxScore = Math.max(this.bestScore, 1000);
        document.getElementById('scoreFill').style.width = `${(this.score / maxScore) * 100}%`;
        document.getElementById('streakFill').style.width = `${Math.min(this.streak / 10, 1) * 100}%`;
        document.getElementById('bestFill').style.width = `${(this.bestScore / maxScore) * 100}%`;
        
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        this.timerElement.textContent = this.timeLeft;
        const percentage = (this.timeLeft / 30) * 100;
        const circumference = 2 * Math.PI * 25;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        if (this.progressRing) {
            this.progressRing.style.strokeDasharray = circumference;
            this.progressRing.style.strokeDashoffset = strokeDashoffset;

            // Color changes based on time left
            if (this.timeLeft <= 5) {
                this.progressRing.style.stroke = 'var(--error)';
            } else if (this.timeLeft <= 10) {
                this.progressRing.style.stroke = 'var(--warning)';
            } else {
                this.progressRing.style.stroke = 'var(--accent)';
            }
        }
    }

    grantRandomPowerUp() {
        const powerUps = ['timeBonus', 'doubleScore', 'easyMode'];
        const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];

        switch (randomPowerUp) {
            case 'timeBonus':
                this.timeLeft += 5;
                this.powerUps.timeBonus++;
                this.showAchievement('⏰', '+5 Seconds!');
                break;
            case 'doubleScore':
                this.powerUps.doubleScore += 3;
                this.showAchievement('💎', '2x Score (3 questions)!');
                break;
            case 'easyMode':
                this.powerUps.easyMode += 2;
                this.showAchievement('🎯', 'Easy Mode (2 questions)!');
                break;
        }
    }

    getVarianceByDifficulty() {
        let base = { easy: 80, medium: 50, hard: 25 }[this.difficulty];

        // Apply easy mode power-up
        if (this.powerUps.easyMode > 0) {
            base += 30;
            this.powerUps.easyMode--;
        }

        return Math.max(15, base - this.level * 2);
    }

    showEnhancedFeedback(message, type, duration = 2000) {
        this.feedback.textContent = message;
        this.feedback.className = `feedback ${type} show enhanced`;

        setTimeout(() => {
            this.feedback.classList.remove('show', 'enhanced');
        }, duration);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChromaVerseGame();
});