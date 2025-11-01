const userNameElement = document.getElementById('user-name');
const userScoreElement = document.getElementById('user-score');
const computerScoreElement = document.getElementById('computer-score');
const userCardsElement = document.getElementById('user-cards');
const computerCardsElement = document.getElementById('computer-cards');
const drawButton = document.getElementById('draw-btn');
const standButton = document.getElementById('stand-btn');
const restartButton = document.getElementById('restart-btn');
const messageElement = document.getElementById('message');
const roundCounterElement = document.getElementById('round-counter');

let userName = '';
let userScore = 0;
let computerScore = 0;
let round = 1;
let gameOver = false;
let userStood = false;

const cardValues = {
    '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'Валет': 2, 'Дама': 3, 'Король': 4, 'Туз': 11
};

function askUserName() {
    userName = prompt('Будь ласка, введіть ваше ім\'я:') || 'Гравець';
    userNameElement.textContent = userName;
}

// Нова гра
function startNewGame() {
    userScore = 0;
    computerScore = 0;
    round = 1;
    gameOver = false;
    userStood = false;
    
    updateScores();
    clearCards();
    updateRoundCounter();
    
    messageElement.textContent = `${userName}, почніть гру!`;
    messageElement.className = 'message';
    
    enableButtons();
    dealInitialCards();
}

// Оновлення рахунку
function updateScores() {
    userScoreElement.textContent = userScore;
    computerScoreElement.textContent = computerScore;
}

function clearCards() {
    userCardsElement.innerHTML = '';
    computerCardsElement.innerHTML = '';
}

// Оновлення лічильника
function updateRoundCounter() {
    roundCounterElement.textContent = `Раунд: ${round} з 3`;
}

function dealInitialCards() {
    drawCard('user');
    drawCard('user');
    drawCard('computer');
    drawCard('computer');
}

// Випадкова карта
function getRandomCard() {
    const cardNames = Object.keys(cardValues);
    const randomCardName = cardNames[Math.floor(Math.random() * cardNames.length)];
    return {
        name: randomCardName,
        value: cardValues[randomCardName]
    };
}

// Беремо карту
function drawCard(player) {
    if (gameOver) return;
    
    const card = getRandomCard();
    const container = player === 'user' ? userCardsElement : computerCardsElement;
    
    if (player === 'user') {
        userScore += card.value;
        renderCard(container, card.name);
    } else {
        computerScore += card.value;
        renderCard(container, card.name);
    }
    
    updateScores();
    checkGameStatus();
}

// Відображення карти
function renderCard(container, cardName) {
    const cardElement = document.createElement('img');
    cardElement.src = `${cardName}.jpg`;
    cardElement.alt = cardName;
    cardElement.className = 'card-img';
    container.appendChild(cardElement);
}

// Перевірка статусу гри
function checkGameStatus() {
    if (userStood) {
        computerTurn();
        return;
    }
    
    if (userScore > 21) {
        endRound('computer');
    }
}

function computerTurn() {
    if (computerScore < 17) {
        setTimeout(() => {
            drawCard('computer');
            // Продовжуємо хід комп'ютера, поки він не набере достатньо очок
            if (computerScore < 17) {
                computerTurn();
            } else {
                endRound();
            }
        }, 1000);
    } else {
        endRound();
    }
}

function endRound(winner = null) {
    gameOver = true;
    
    if (!winner) {
        if (userScore > 21) winner = 'computer';
        else if (computerScore > 21) winner = 'user';
        else if (userScore > computerScore) winner = 'user';
        else if (computerScore > userScore) winner = 'computer';
        else winner = 'nobody';
    }
    
    showResult(winner);
    disableButtons();
    
    setTimeout(nextRound, 3000);
}

// Результат
function showResult(winner) {
    if (winner === 'user') {
        messageElement.textContent = `Вітаємо, ${userName}! Ви виграли раунд!`;
        messageElement.className = 'message winner';
    } else if (winner === 'computer') {
        messageElement.textContent = 'Комп\'ютер виграв раунд.';
        messageElement.className = 'message loser';
    } else {
        messageElement.textContent = 'Нічия!';
        messageElement.className = 'message';
    }
}

// Наступний раунд
function nextRound() {
    round++;
    
    if (round <= 3) {
        userScore = 0;
        computerScore = 0;
        gameOver = false;
        userStood = false;
        
        updateScores();
        clearCards();
        updateRoundCounter();
        
        messageElement.textContent = `Раунд ${round}. ${userName}, почніть гру!`;
        messageElement.className = 'message';
        
        enableButtons();
        dealInitialCards();
    } else {
        endGame();
    }
}

// Кінець гри
function endGame() {
    messageElement.textContent = `Гра завершена! Дякуємо за гру, ${userName}!`;
    
    setTimeout(() => {
        if (confirm('Гра завершена. Хочете зіграти ще раз?')) {
            round = 1;
            startNewGame();
        }
    }, 1000);
}

function enableButtons() {
    drawButton.disabled = false;
    standButton.disabled = false;
}

function disableButtons() {
    drawButton.disabled = true;
    standButton.disabled = true;
}

drawButton.addEventListener('click', function() {
    if (!gameOver && !userStood) {
        drawCard('user');
    }
});

standButton.addEventListener('click', function() {
    if (!gameOver && !userStood) {
        userStood = true;
        disableButtons();
        messageElement.textContent = `${userName}, ви зупинилися. Хід комп'ютера.`;
        setTimeout(() => {
            computerTurn();
        }, 1000);
    }
});

restartButton.addEventListener('click', function() {
    if (confirm('Почати нову гру?')) {
        round = 1;
        startNewGame();
    }
});

askUserName();
startNewGame();
