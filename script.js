// Main Game Script
let updateInterval;

// Initialize game on load
document.addEventListener("DOMContentLoaded", async () => {
  await initializeGame();
  startGameLoop();
  updateUI();
});

async function initializeGame() {
  // Load JSON data
  try {
    const storyResponse = await fetch("storyCards.json");
    window.storyCards = await storyResponse.json();
  } catch (e) {
    console.error("Error loading storyCards:", e);
    window.storyCards = [];
  }

  try {
    const itemResponse = await fetch("itemCards.json");
    window.itemCards = await itemResponse.json();
  } catch (e) {
    console.error("Error loading itemCards:", e);
    window.itemCards = [];
  }

  // Restore game state or start new
  gameState.loadFromStorage();
  updateUI();
}

function startGameLoop() {
  // Game timer loop
  updateInterval = setInterval(() => {
    if (!gameState.gameOver && !gameState.isPaused) {
      // Timer only decreases during gameplay
      if (gameState.timerActive) {
        gameState.decreaseGoldenShotTime(0.1);
        if (gameState.gameOver) {
          triggerGameOver();
        }
      }
    }
    updateUI();
  }, 100);
}

function updateUI() {
  // Header
  document.getElementById("headerLevel").textContent = gameState.level;
  document.getElementById("headerXP").textContent =
    `${gameState.experience}/${gameState.experienceForNextLevel} XP`;

  // Timer
  document.getElementById("goldenShotTimer").textContent = gameState.getTimeFormatted();

  // Stats
  document.getElementById("statFood").textContent = Math.floor(gameState.food) + "%";
  document.getElementById("statCoins").textContent = gameState.coins;
  document.getElementById("statBottles").textContent = gameState.bottles;
  document.getElementById("shopCoins").textContent = gameState.coins;
  document.getElementById("shopCoins2").textContent = gameState.coins;

  // Progress bars
  updateProgressBars();
}

function updateProgressBars() {
  const xpPercent = gameState.getExperiencePercentage();
  document.querySelectorAll(".progress-fill").forEach((bar) => {
    if (bar.parentElement.classList.contains("header-stats")) {
      bar.style.width = xpPercent + "%";
    }
  });

  // Food progress
  const foodBars = document.querySelectorAll(".progress-fill");
  foodBars.forEach((bar) => {
    if (
      bar.parentElement.parentElement &&
      bar.parentElement.parentElement.classList.contains("stat-content")
    ) {
      const foodPercent = Math.min(100, Math.floor(gameState.food));
      bar.style.width = foodPercent + "%";
    }
  });
}

// COLLECT BOTTLES MINIGAME
function startCollectBottles() {
  screenManager.showScreen("collectBottles");
  Minigames.startCollectBottles();
}

// EXCHANGE BOTTLES
function doExchange(bottleAmount) {
  const coinReturn = bottleAmount;
  if (gameState.exchangeBottlesForCoins(bottleAmount, coinReturn)) {
    showSuccessMessage(
      `Exchanged ${bottleAmount} bottles for ${coinReturn} coins!`
    );
    updateUI();
  } else {
    alert("Du hast nicht genug Flaschen!");
  }
}

// FOOD PURCHASE
function buyFood(type, cost, foodAmount) {
  if (gameState.removeCoins(cost)) {
    gameState.addFood(foodAmount);
    const foodPercent = Math.floor(gameState.food);
    showSuccessMessage(
      `Bought ${type}! +${foodAmount}% food. Total: ${foodPercent}%`
    );
    updateUI();
  } else {
    alert("Du hast nicht genug Münzen!");
  }
}

// SUCCESS MESSAGE
function showSuccessMessage(message) {
  document.getElementById("successMessage").textContent = message;
  screenManager.showOverlay("successOverlay");
}

// LEVEL UP
function triggerLevelUp() {
  const rewards = `+${gameState.level * 10} Coins`;
  document.getElementById("levelUpNew").textContent = gameState.level;
  document.getElementById("levelUpRewards").textContent = rewards;
  gameState.addCoins(gameState.level * 10);
  screenManager.showOverlay("levelUpOverlay");
  updateUI();
}

// GAME OVER
function triggerGameOver() {
  gameState.gameOver = true;
  gameState.timerActive = false;

  const stats = `
    Level: ${gameState.level}<br>
    Experience: ${gameState.experience}<br>
    Coins: ${gameState.coins}<br>
    Bottles: ${gameState.bottles}<br>
    Food: ${Math.floor(gameState.food)}%
  `;

  document.getElementById("gameOverStats").innerHTML = stats;
  screenManager.showOverlay("gameOverOverlay");
}

// NEW GAME
function newGame() {
  gameState.resetGame();
  gameState.timerActive = true;
  screenManager.closeOverlay();
  screenManager.reset();
  screenManager.showScreen("home");
  updateUI();
}

// CHANGE DIFFICULTY
function changeDifficulty() {
  const difficulty = document.getElementById("difficultySelect").value;
  localStorage.setItem("difficulty", difficulty);
  console.log("Difficulty set to:", difficulty);
}

// Start timer when game begins
setTimeout(() => {
  gameState.timerActive = true;
}, 1000);
