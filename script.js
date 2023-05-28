// Initialize game variables
let bottles = 0;
let coins = 0;
let experience = 0;
let level = 1;
let hunger = 90;
let bottlesCollected = 0;

const eventCards = [
  {
    type: "weakness",
    title: "Drinking Party",
    description:
      "A wild night of partying awaits you! Experience +100 and Hunger -50%. Let loose, dance, and drink until the sun comes up. But be warned, the next morning might not be so pleasant.",
    experience: 100,
    hunger: -50,
  },
  {
    type: "strength",
    title: "Lucky Find",
    description: "You are a lucky person and find +100 bottles!",
    bottlesCollected: 100,
    bottles: 100,
  },
  {
    type: "strength",
    title: "Meet Colleagues",
    description: "You meet your colleagues and collect +50 bottles!",
    bottlesCollected: 50,
    bottles: 50,
  },
  // Add more event cards here
];

function playEventCard() {
  // Generate a random number between 1 and 20
  const randomNum = Math.floor(Math.random() * 20) + 1;

  // Check if the random number is 1 (1/20 chance)
  if (randomNum <= 1) {
    // Get a random event card from the eventCards array
    const randomCard =
      eventCards[Math.floor(Math.random() * eventCards.length)];

    // Apply the effects of the event card
    if (randomCard.type === "weakness") {
      // Handle weakness event card
      collectExperiencePoints(randomCard.experience);
      hunger += randomCard.hunger;
    } else if (randomCard.type === "strength") {
      // Handle strength event card
      bottlesCollected += randomCard.bottlesCollected;
      // Add more conditionals for other event card types if needed
    }
    // Update the display
    updateDisplay();

    // Show the event card on the monitorBig
    showEventCard(randomCard);
  }
}

function showEventCard(eventCard) {
  const monitorBig = document.querySelector(".monitorBig");

  // Create the event card elements
  const cardTitle = document.createElement("h2");
  cardTitle.textContent = eventCard.title;

  const cardDescription = document.createElement("p");
  cardDescription.textContent = eventCard.description;

  // Clear the monitorBig content
  monitorBig.innerText = "";

  // Append the event card elements to the monitorBig
  monitorBig.appendChild(cardTitle);
  monitorBig.appendChild(cardDescription);
}

// Function to handle checking if the player is starved
function checkStarvation() {
  if (hunger <= 0) {
    // Display the game over message
    document.querySelector(".monitorBig").textContent =
      "Game Over: You starved";
    hunger = 0;

    // Hide the buttons
    document.querySelector("#collectButton").style.display = "none";
    document.querySelector("#exchangeButton").style.display = "none";
    document.querySelector("#foodButton").style.display = "none";
    document.querySelector("#partyButton").style.display = "none";
  }

  if (hunger > 100) {
    document.querySelector(".monitorBig").textContent = "You are full";
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

  // Play an event card
  playEventCard();

  // Update the display
  updateDisplay();
}

// Function to handle exchanging bottles for coins
function exchangeBottles() {
  // Check if there are enough bottles to exchange
  if (bottlesCollected >= 5) {
    // Calculate the number of coins based on the bottles collected
    const exchangedCoins = Math.floor(bottles / 5);

    // Update the coins and bottles count
    coins += exchangedCoins;
    bottlesCollected -= 5;

    // Update the display
    updateDisplay();
  } else {
    // Display an alert for insufficient bottles
    alert("Insufficient bottles available!");
  }
}

// Function to handle buying food
function buyFood() {
  // Check if there are enough coins to buy food
  if (coins >= 3) {
    // Deduct coins and increase hunger
    coins -= 3;
    hunger += 10;

    // Update the display
    updateDisplay();
  } else {
    // Display an alert for insufficient coins
    alert("Insufficient coins available!");
  }
}

// Function to handle making a party
function makeParty() {
  // Check if there are enough coins to make a party
  if (coins >= 5) {
    // Deduct coins, increase experience, and decrease hunger
    coins -= 5;
    collectExperiencePoints(5);
    hunger -= 20;

    // Update the display
    updateDisplay();
  } else {
    // Display an alert for insufficient coins
    alert("Insufficient coins available!");
  }
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
