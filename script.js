// Елементи DOM
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

// Змінні гри
let userName = '';
let userScore = 0;
let computerScore = 0;
let round = 1;
let gameOver = false;
let userStood = false;

// Номінали карт
const cardValues = {
    '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'Валет': 2, 'Дама': 3, 'Король': 4, 'Туз': 11
};

// Запит імені гравця
function askUserName() {
    userName = prompt('Будь ласка, введіть ваше ім\'я:') || 'Гравець';
    userNameElement.textContent = userName;
}

// Початок нової гри
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

// Оновлення рахунків
function updateScores() {
    userScoreElement.textContent = userScore;
    computerScoreElement.textContent = computerScore;
}

// Очищення карт
function clearCards() {
    userCardsElement.innerHTML = '';
    computerCardsElement.innerHTML = '';
}

// Оновлення лічильника раундів
function updateRoundCounter() {
    roundCounterElement.textContent = `Раунд: ${round} з 3`;
}

// Роздача початкових карт
function dealInitialCards() {
    drawCard('user');
    drawCard('user');
    drawCard('computer');
    drawCard('computer');
}

// Отримати випадкову карту
function getRandomCard() {
    const cardNames = Object.keys(cardValues);
    const randomCardName = cardNames[Math.floor(Math.random() * cardNames.length)];
    return {
        name: randomCardName,
        value: cardValues[randomCardName]
    };
}

// Взяти карту
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

// Хід комп'ютера
function computerTurn() {
    if (computerScore < 17) {
        setTimeout(() => {
            drawCard('computer');
        }, 1000);
    } else {
        endRound();
    }
}

// Кінець раунду
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

// Показати результат
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

// Увімкнути кнопки
function enableButtons() {
    drawButton.disabled = false;
    standButton.disabled = false;
}

// Вимкнути кнопки
function disableButtons() {
    drawButton.disabled = true;
    standButton.disabled = true;
}

// Обробники подій
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
        computerTurn();
    }
});

restartButton.addEventListener('click', function() {
    if (confirm('Почати нову гру?')) {
        round = 1;
        startNewGame();
    }
});

// Запуск гри
askUserName();
startNewGame();