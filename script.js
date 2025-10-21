// --- Game State Variables ---
let playerScore = 0;
let computerScore = 0;
let currentRound = 1;
const MAX_ROUNDS = 3;
let selectedCharacter = null;
let currentOpponent = null; // NEW: To store the randomly selected opponent

// --- DOM Element Selectors ---
const homeScreen = document.getElementById("home-screen");
const gameScreen = document.getElementById("game-screen");

// NEW Opponent/Player Display Selectors
const playerNameElement = document.getElementById("player-name");
const playerImgElement = document.getElementById("player-char-img");
const opponentNameElement = document.getElementById("opponent-name");
const opponentImgElement = document.getElementById("opponent-char-img");

const characterButtons = document.querySelectorAll(".character-button");
const mainNarrativeElement = document.getElementById("main-narrative");
const characterNarrativeElement = document.getElementById(
  "character-narrative"
);
const startGameButton = document.getElementById("start-game");

const roundElement = document.getElementById("round");
const playerChoiceElement = document.getElementById("player-choice");
const computerChoiceElement = document.getElementById("computer-choice");
const roundResultElement = document.getElementById("round-result");
const scoreElement = document.getElementById("score");
const gameResultElement = document.getElementById("game-result");
const playAgainButton = document.getElementById("play-again");
const choiceButtons = document.querySelectorAll(".choices button");

// --- Character Data ---
const playerCharacters = {
  // Player Character Data
  sprite: {
    name: "Forest Sprite",
    description:
      "A nimble and elusive spirit of the ancient woods. Choosing the sprite means embracing agility.",
    image: "images/char1.png",
  },
  guardian: {
    name: "Stone Guardian",
    description:
      "A stoic and unyielding protector born from the earth itself. The guardian's path is one of strength.",
    image: "images/char2.png",
  },
  wanderer: {
    name: "Mystic Wanderer",
    description:
      "A wise traveler, attuned to the subtle energies of the forest. The wanderer's journey is one of balance.",
    image: "images/char3.png",
  },
};

const opponents = [
  // NEW: 7 NPC Opponents
  { name: "Kiki", image: "images/npc1.png" },
  { name: "Ponyo", image: "images/npc2.png" },
  { name: "Ashitaka", image: "images/npc3.png" },
  { name: "San", image: "images/npc4.png" },
  { name: "Totoro", image: "images/npc5.png" },
  { name: "No-Face", image: "images/npc6.png" },
  { name: "Haku", image: "images/npc7.png" },
];

// --- Control Functions ---

/**
 * Handles character selection, updates narrative, and enables start button.
 * @param {string} characterKey - The key of the selected player character.
 */
function selectCharacter(characterKey) {
  characterButtons.forEach((button) => {
    button.classList.remove("selected");
  });

  const selectedButton = document.querySelector(
    `.character-button[onclick="selectCharacter('${characterKey}')"]`
  );
  if (selectedButton) {
    selectedButton.classList.add("selected");
  }

  selectedCharacter = playerCharacters[characterKey]; // Store the full character object

  if (selectedCharacter) {
    mainNarrativeElement.style.display = "none";
    characterNarrativeElement.textContent = `You have chosen ${selectedCharacter.name}. ${selectedCharacter.description}`;
    startGameButton.style.display = "block";
  }
}

/**
 * Hides the home screen, selects an opponent, and displays the game board.
 */
function startGame() {
  if (selectedCharacter === null) {
    alert("Please choose a character first!");
    return;
  }

  // NEW: Select a random opponent
  const randomIndex = Math.floor(Math.random() * opponents.length);
  currentOpponent = opponents[randomIndex];

  // NEW: Update player and opponent display elements
  playerNameElement.textContent = selectedCharacter.name;
  playerImgElement.src = selectedCharacter.image;

  opponentNameElement.textContent = currentOpponent.name;
  opponentImgElement.src = currentOpponent.image;

  homeScreen.style.display = "none";
  gameScreen.style.display = "block";
  resetGame(false);
}

// --- Helper Function to Generate Image HTML ---

function generateChoiceHTML(choice) {
  const imageName = choice.toLowerCase() + ".png";
  const repoName = "/rock-paper-scissors-game/";

  return `<img src="${repoName}images/${imageName}" alt="${choice}" style="width: 50px; height: 50px; vertical-align: middle; margin-left: 10px; border: 1px solid #ddd; border-radius: 5px;">`;
}

// --- Core Game Functions (rest remain the same) ---

function getComputerChoice() {
  const choices = ["Rock", "Paper", "Scissors"];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return "tie";
  } else if (
    (playerChoice === "Rock" && computerChoice === "Scissors") ||
    (playerChoice === "Paper" && computerChoice === "Rock") ||
    (playerChoice === "Scissors" && computerChoice === "Paper")
  ) {
    return "win";
  } else {
    return "lose";
  }
}

function playRound(playerChoice) {
  if (currentRound > MAX_ROUNDS) {
    return;
  }

  const computerChoice = getComputerChoice();
  const result = determineWinner(playerChoice, computerChoice);
  let roundMessage = "";

  playerChoiceElement.innerHTML = `Player Choice: ${generateChoiceHTML(
    playerChoice
  )}`;
  computerChoiceElement.innerHTML = `Computer Choice: ${generateChoiceHTML(
    computerChoice
  )}`;

  if (result === "win") {
    playerScore++;
    roundMessage = `You win! ${playerChoice} beats ${computerChoice}.`;
  } else if (result === "lose") {
    computerScore++;
    roundMessage = `You lose! ${computerChoice} beats ${playerChoice}.`;
  } else {
    roundMessage = "It's a tie!";
  }

  roundResultElement.textContent = roundMessage;
  scoreElement.textContent = `Score - Player: ${playerScore}, Computer: ${computerScore}`;

  if (currentRound < MAX_ROUNDS) {
    currentRound++;
    roundElement.textContent = `Round: ${currentRound}`;
  } else {
    endGame();
  }
}

function endGame() {
  let finalMessage = "";

  if (playerScore > computerScore) {
    finalMessage = `VICTORY! ${selectedCharacter.name} has defeated ${currentOpponent.name}!`;
    gameResultElement.style.color = "green";
  } else if (computerScore > playerScore) {
    finalMessage = `DEFEAT! ${currentOpponent.name} was too strong for ${selectedCharacter.name}.`;
    gameResultElement.style.color = "red";
  } else {
    finalMessage = `A DRAW! Neither ${selectedCharacter.name} nor ${currentOpponent.name} could claim victory.`;
    gameResultElement.style.color = "orange";
  }

  gameResultElement.textContent = finalMessage;

  choiceButtons.forEach((button) => {
    button.disabled = true;
  });

  playAgainButton.style.display = "block";
}

/**
 * Resets all game variables and UI elements.
 * @param {boolean} [returnToHome=true] - If true, returns to the home screen after reset.
 */
function resetGame(returnToHome = true) {
  playerScore = 0;
  computerScore = 0;
  currentRound = 1;

  // Clear opponent and player name/image only on full reset
  if (returnToHome) {
    selectedCharacter = null;
    currentOpponent = null;
    playerNameElement.textContent = "Player";
    playerImgElement.src = "";
    opponentNameElement.textContent = "Opponent";
    opponentImgElement.src = "";
  }

  roundElement.textContent = `Round: ${currentRound}`;
  playerChoiceElement.textContent = "Player Choice: ";
  computerChoiceElement.textContent = "Computer Choice: ";
  roundResultElement.textContent = "";
  scoreElement.textContent = `Score - Player: ${playerScore}, Computer: ${computerScore}`;
  gameResultElement.textContent = "";
  gameResultElement.style.color = "initial";

  playAgainButton.style.display = "none";

  choiceButtons.forEach((button) => {
    button.disabled = false;
  });

  if (returnToHome) {
    gameScreen.style.display = "none";
    homeScreen.style.display = "block";
    characterNarrativeElement.textContent = "";
    startGameButton.style.display = "none";
    characterButtons.forEach((button) => {
      button.classList.remove("selected");
    });
    mainNarrativeElement.style.display = "block";
  }
}

// Initial call to reset when the script loads
document.addEventListener("DOMContentLoaded", () => {
  resetGame(true);
  gameScreen.style.display = "none";
  homeScreen.style.display = "block";
});
