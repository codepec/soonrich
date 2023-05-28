// Initialize game variables
let bottles = 0;
let coins = 0;
let experience = 0;
let level = 1;
let hunger = 90;
let bottlesCollected = 0;

// Function to handle checking if the player is starved
function checkStarvation() {
  if (hunger < 0) {
    // Display the game over message
    document.querySelector(".monitorBig").textContent = "Du bist verhungert";
    hunger = 0;

    // Disable the buttons
    document
      .querySelector("#collectButton")
      .setAttribute("disabled", "disabled");
    document
      .querySelector("#exchangeButton")
      .setAttribute("disabled", "disabled");
    document.querySelector("#foodButton").setAttribute("disabled", "disabled");
    document.querySelector("#partyButton").setAttribute("disabled", "disabled");
  }

  if (hunger > 100) {
    document.querySelector(".monitorBig").textContent = "Du bist satt";
    hunger = 100;
  }
}

// Function to update the profile picture based on the level
function updateProfilePicture() {
  const profileImage = document.querySelector(".profile-image");
  profileImage.src = `img/profile${level}.jpg`;
}

// Function to update the game display
function updateDisplay() {
  // Update the progress bars
  document.querySelector(".level").textContent = `Level ${level}`;
  document.querySelector(".xp").textContent = `Experience: ${experience}`;

  // Limit the displayed hunger value to a range of 0 to 100
  const displayedHunger = Math.min(Math.max(hunger, 0), 100);
  document.querySelector(".food").textContent = `Hunger: ${displayedHunger}%`;

  document.querySelector(".coins").textContent = `Coins: ${coins}`;
  document.querySelector(
    ".bottles"
  ).textContent = `Bottles: ${bottlesCollected}`;

  // Set the experience CSS variable for the progress bar
  document.querySelector(".xp").style.setProperty("--experience", experience);
  document.querySelector(".food").style.setProperty("--hunger", hunger);

  // Update the profile picture
  updateProfilePicture();

  // Check for starvation
  checkStarvation();
}

// Function to update the level based on experience points
function updateLevel() {
  if (experience >= 100 && experience < 200) {
    level = 2;
  } else if (experience >= 200 && experience < 300) {
    level = 3;
  } else if (experience >= 300 && experience < 500) {
    level = 4;
  } else if (experience >= 500 && experience < 1000) {
    level = 5;
  } else if (experience >= 1000 && experience < 2000) {
    level = 6;
  } else if (experience >= 2000 && experience < 3000) {
    level = 7;
  } else if (experience >= 3000 && experience < 4000) {
    level = 8;
  } else if (experience >= 4000 && experience < 5000) {
    level = 9;
  } else if (experience >= 5000 && experience < 6000) {
    level = 10;
  } else if (experience >= 6000 && experience < 7000) {
    level = 11;
  } else if (experience >= 10000) {
    level = 12;
  }
  // Update the profile picture
  updateProfilePicture();
}

// Function to handle collecting experience points
function collectExperiencePoints(points) {
  // Increase the experience points
  experience += points;

  // Update the level based on experience points
  updateLevel();

  // Update the display
  updateDisplay();
}

// Function to handle collecting bottles
function collectBottles() {
  // Increase the bottle count
  bottles++;
  bottlesCollected++;

  // Check if the player has leveled up
  if (bottles % 10 === 0) {
    // Increase experience points
    collectExperiencePoints(10);
  }

  // Update the display
  updateDisplay();
}

// Function to handle exchanging bottles for coins
function exchangeBottles() {
  // Calculate the number of coins based on the bottles collected
  const exchangedCoins = Math.floor(bottles / 5);

  // Update the coins and bottles count
  coins += exchangedCoins;
  bottlesCollected -= 5;

  // Update the display
  updateDisplay();
}

// Function to handle buying food
function buyFood() {
  // Deduct coins and decrease hunger
  coins -= 3;
  hunger += 10;

  // Update the display
  updateDisplay();
}

// Function to handle making a party
function makeParty() {
  // Deduct coins, increase experience, and decrease hunger
  coins -= 5;
  collectExperiencePoints(5);
  hunger -= 20;

  // Update the display
  updateDisplay();
}

// Add event listeners to the buttons
document
  .querySelector("#collectButton")
  .addEventListener("click", collectBottles);
document
  .querySelector("#exchangeButton")
  .addEventListener("click", exchangeBottles);
document.querySelector("#foodButton").addEventListener("click", buyFood);
document.querySelector("#partyButton").addEventListener("click", makeParty);

// Initial display update
updateDisplay();
