// Main Game Script
let updateInterval;

// Initialize game on load
document.addEventListener("DOMContentLoaded", async () => {
  await initializeGame();
  startGameLoop();
  updateUI();
  setupEventListeners();
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

function setupEventListeners() {
  // Navigation button active state
  document.querySelectorAll(".nav-btn").forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function startGameLoop() {
  // Game timer loop - 100ms updates
  updateInterval = setInterval(() => {
    if (!gameState.gameOver && !gameState.isPaused) {
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
  gameState.saveToStorage();
  screenManager.showOverlay("levelUpOverlay");
  updateUI();
}

// GAME OVER
function triggerGameOver() {
  gameState.gameOver = true;
  gameState.timerActive = false;
  gameState.saveToStorage();

  const stats = `
    <div class="stat-line">Level: <span>${gameState.level}</span></div>
    <div class="stat-line">Experience: <span>${gameState.experience}</span></div>
    <div class="stat-line">Coins: <span>${gameState.coins}</span></div>
    <div class="stat-line">Bottles: <span>${gameState.bottles}</span></div>
    <div class="stat-line">Food: <span>${Math.floor(gameState.food)}%</span></div>
  `;

  document.getElementById("gameOverStats").innerHTML = stats;
  screenManager.showOverlay("gameOverOverlay");
}

// NEW GAME
function newGame() {
  gameState.resetGame();
  gameState.timerActive = true;
  gameState.saveToStorage();
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

// STORY CHAPTERS DISPLAY
function displayStoryChapters() {
  const mapContent = document.getElementById("mapContent");
  if (!window.storyCards || window.storyCards.length === 0) {
    mapContent.innerHTML = "<p>No chapters available yet.</p>";
    return;
  }

  mapContent.innerHTML = "";
  window.storyCards.forEach((card, index) => {
    const chapterNum = index + 1;
    const isUnlocked = gameState.unlockedChapters.includes(chapterNum);
    
    const chapterEl = document.createElement("div");
    chapterEl.className = `chapter-item ${isUnlocked ? "unlocked" : "locked"}`;
    
    if (isUnlocked) {
      chapterEl.innerHTML = `
        <div class="chapter-header">
          <div class="chapter-number">Chapter ${chapterNum}</div>
          <div class="chapter-title">${card.title}</div>
        </div>
        <button class="chapter-read" onclick="readStory(${index})">READ</button>
      `;
    } else {
      chapterEl.innerHTML = `
        <div class="chapter-header">
          <div class="chapter-number">Chapter ${chapterNum}</div>
          <div class="chapter-title">${card.title}</div>
        </div>
        <div class="chapter-locked">🔒 Unlock at Level ${card.requirement}</div>
      `;
    }
    
    mapContent.appendChild(chapterEl);
  });
}

function readStory(index) {
  const storyContent = document.getElementById("storyContent");
  if (window.storyCards && window.storyCards[index]) {
    const chapter = window.storyCards[index];
    storyContent.innerHTML = `
      <div class="story-header">
        <h3>${chapter.title}</h3>
        <p class="story-requirement">Chapter ${index + 1}</p>
      </div>
      <div class="story-text">${chapter.description}</div>
    `;
    screenManager.showScreen("story");
  }
}

// Start timer when game begins
setTimeout(() => {
  gameState.timerActive = true;
}, 1000);
