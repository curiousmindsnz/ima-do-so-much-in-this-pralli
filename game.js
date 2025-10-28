// Game state
let secretNumber;
let attempts;
let guessHistory;
let bestScore = localStorage.getItem('bestScore') || null;

// DOM elements
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const resetButton = document.getElementById('reset-button');
const messageDiv = document.getElementById('message');
const hintDiv = document.getElementById('hint');
const attemptsSpan = document.getElementById('attempts');
const bestScoreSpan = document.getElementById('best-score');
const historyList = document.getElementById('history-list');

// Initialize game
function initGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    guessHistory = [];
    updateDisplay();
    messageDiv.textContent = '';
    messageDiv.className = 'message';
    hintDiv.textContent = '';
    historyList.innerHTML = '';
    guessInput.value = '';
    guessInput.disabled = false;
    guessButton.disabled = false;
    guessInput.focus();
}

// Update display
function updateDisplay() {
    attemptsSpan.textContent = attempts;
    bestScoreSpan.textContent = bestScore || '-';
}

// Handle guess
function handleGuess() {
    const guess = parseInt(guessInput.value);
    
    // Validate input
    if (isNaN(guess) || guess < 1 || guess > 100) {
        showMessage('Please enter a number between 1 and 100!', 'error');
        return;
    }

    // Check if already guessed
    if (guessHistory.includes(guess)) {
        showMessage('You already guessed that number!', 'warning');
        return;
    }

    attempts++;
    guessHistory.push(guess);
    updateDisplay();
    addToHistory(guess);

    // Check the guess
    if (guess === secretNumber) {
        handleWin();
    } else if (guess < secretNumber) {
        showMessage('Too low! 📉', 'info');
        showHint(guess);
    } else {
        showMessage('Too high! 📈', 'info');
        showHint(guess);
    }

    guessInput.value = '';
    guessInput.focus();
}

// Handle win
function handleWin() {
    showMessage(`🎉 Congratulations! You guessed it in ${attempts} attempts!`, 'success');
    guessInput.disabled = true;
    guessButton.disabled = true;

    // Update best score
    if (!bestScore || attempts < bestScore) {
        bestScore = attempts;
        localStorage.setItem('bestScore', bestScore);
        updateDisplay();
        hintDiv.textContent = '🏆 New best score!';
        hintDiv.className = 'hint success';
    }
}

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
}

// Show hint
function showHint(guess) {
    const difference = Math.abs(guess - secretNumber);
    let hintText = '';
    
    if (difference <= 5) {
        hintText = '🔥 Very hot!';
    } else if (difference <= 10) {
        hintText = '🌡️ Hot!';
    } else if (difference <= 20) {
        hintText = '🧊 Warm';
    } else {
        hintText = '❄️ Cold';
    }
    
    hintDiv.textContent = hintText;
    hintDiv.className = 'hint';
}

// Add to history
function addToHistory(guess) {
    const historyItem = document.createElement('span');
    historyItem.className = 'history-item';
    historyItem.textContent = guess;
    
    if (guess < secretNumber) {
        historyItem.classList.add('too-low');
    } else if (guess > secretNumber) {
        historyItem.classList.add('too-high');
    }
    
    historyList.appendChild(historyItem);
}

// Event listeners
guessButton.addEventListener('click', handleGuess);
guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleGuess();
    }
});
resetButton.addEventListener('click', initGame);

// Initialize game on load
initGame();
