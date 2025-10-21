// --- Game State Variables ---
let playerScore = 0;
let computerScore = 0;
let currentRound = 1;
const MAX_ROUNDS = 3;

// --- DOM Element Selectors ---
// Ensure these IDs match the HTML exactly:
const roundElement = document.getElementById('round');
const playerChoiceElement = document.getElementById('player-choice'); 
const computerChoiceElement = document.getElementById('computer-choice'); 
const roundResultElement = document.getElementById('round-result');
const scoreElement = document.getElementById('score');
const gameResultElement = document.getElementById('game-result');
const playAgainButton = document.getElementById('play-again');
const choiceButtons = document.querySelectorAll('.choices button');

// --- Helper Function to Generate Image HTML ---

/**
 * Creates the HTML string for displaying the player/computer move image.
 * @param {string} choice - The move ('Rock', 'Paper', or 'Scissors').
 * @returns {string} An HTML <img> tag styled for display.
 */
function generateChoiceHTML(choice) {
    const imageName = choice.toLowerCase() + '.png';
    // The inline style sets the display size for the status area
    return `<img src="images/${imageName}" alt="${choice}" style="width: 50px; height: 50px; vertical-align: middle; margin-left: 10px; border: 1px solid #ddd; border-radius: 5px;">`;
}

// --- Core Game Functions ---

/**
 * Generates a random move for the computer.
 * @returns {string} 'Rock', 'Paper', or 'Scissors'.
 */
function getComputerChoice() {
    const choices = ['Rock', 'Paper', 'Scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

/**
 * Determines the winner of a single round.
 * @param {string} playerChoice - The player's choice.
 * @param {string} computerChoice - The computer's choice.
 * @returns {string} 'win', 'lose', or 'tie'.
 */
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    } else if (
        (playerChoice === 'Rock' && computerChoice === 'Scissors') ||
        (playerChoice === 'Paper' && computerChoice === 'Rock') ||
        (playerChoice === 'Scissors' && computerChoice === 'Paper')
    ) {
        return 'win';
    } else {
        return 'lose';
    }
}

/**
 * Executes one round of the game.
 * @param {string} playerChoice - The player's choice.
 */
function playRound(playerChoice) {
    if (currentRound > MAX_ROUNDS) {
        return;
    }

    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);
    let roundMessage = '';

    // 1. Update Choices Display using innerHTML to insert the image tag
    playerChoiceElement.innerHTML = `Player Choice: ${generateChoiceHTML(playerChoice)}`;
    computerChoiceElement.innerHTML = `Computer Choice: ${generateChoiceHTML(computerChoice)}`;

    // 2. Update Score and Round Message
    if (result === 'win') {
        playerScore++;
        roundMessage = `You win! ${playerChoice} beats ${computerChoice}.`;
    } else if (result === 'lose') {
        computerScore++;
        roundMessage = `You lose! ${computerChoice} beats ${playerChoice}.`;
    } else {
        roundMessage = "It's a tie!";
    }

    // 3. Update Round Result Display
    roundResultElement.textContent = roundMessage;

    // 4. Update Score Display
    scoreElement.textContent = `Score - Player: ${playerScore}, Computer: ${computerScore}`;

    // 5. Check for Game End
    if (currentRound < MAX_ROUNDS) {
        currentRound++;
        roundElement.textContent = `Round: ${currentRound}`;
    } else {
        endGame();
    }
}

/**
 * Handles the end of the game (after MAX_ROUNDS).
 */
function endGame() {
    let finalMessage = '';

    if (playerScore > computerScore) {
        finalMessage = 'CONGRATULATIONS! You won the best of 3!';
        gameResultElement.style.color = 'green';
    } else if (computerScore > playerScore) {
        finalMessage = 'GAME OVER. The Computer won the best of 3.';
        gameResultElement.style.color = 'red';
    } else {
        finalMessage = 'It\'s a DRAW! You both tied the best of 3.';
        gameResultElement.style.color = 'orange';
    }

    gameResultElement.textContent = finalMessage;

    // Disable choice buttons
    choiceButtons.forEach(button => {
        button.disabled = true;
    });

    // Show the 'Play Again' button
    playAgainButton.style.display = 'block';
}

/**
 * Resets all game variables and UI elements.
 */
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    currentRound = 1;

    // Reset UI text
    roundElement.textContent = `Round: ${currentRound}`;
    playerChoiceElement.textContent = 'Player Choice: ';
    computerChoiceElement.textContent = 'Computer Choice: ';
    roundResultElement.textContent = '';
    scoreElement.textContent = `Score - Player: ${playerScore}, Computer: ${computerScore}`;
    gameResultElement.textContent = '';
    gameResultElement.style.color = 'initial';

    // Hide 'Play Again' button
    playAgainButton.style.display = 'none';

    // Re-enable choice buttons
    choiceButtons.forEach(button => {
        button.disabled = false;
    });
}